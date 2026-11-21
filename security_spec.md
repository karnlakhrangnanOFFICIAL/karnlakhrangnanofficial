# Security Specification & Dirty Dozen Payloads

## 1. Data Invariants
1. **Default Deny**: Every unmatched Firestore path is denied (`allow read, write: if false`).
2. **PII Isolation**: Public fixture documents under `/matches/{matchId}` MUST NOT store email addresses or personal contact data (`updatedByEmail` is forbidden by schema allowlist; only opaque `updatedByUid` is permitted). `/admins/{adminId}` contains admin email PII and is strictly restricted to the owner UID (with `email_verified == true`) or verified super admin (`kaebmoopingkai3737@gmail.com`).
3. **Verified Admin Only Writes**: Only an authenticated user with `request.auth.token.email_verified == true` AND (`request.auth.token.email == 'kaebmoopingkai3737@gmail.com'` OR an existing `/admins/$(request.auth.uid)` document) may create, update, or delete `/matches/{matchId}`.
4. **Identity & Temporal Integrity**: Every write to `/matches/{matchId}` must set `updatedByUid == request.auth.uid` and `updatedAt == request.time`. `id` must match the `{matchId}` path segment (`^[a-zA-Z0-9_\-]+$`, `<= 128` chars), and `id` / `createdAt` cannot be mutated on updates.
5. **Bounded Payloads**: Every string has explicit `.size()` bounds; `goals` (`<= 50`), `events` (`<= 150`), `channels` (`<= 20`), `stats` (`<= 40`) are strictly bounded.

## 2. The "Dirty Dozen" Payloads (Must All Return PERMISSION_DENIED)
1. **Unauthenticated Write**: Anonymous client sends `setDoc(doc(db, 'matches', 'm999'), validMatch)`. -> Denied (`request.auth == null`).
2. **Non-Admin User Write**: Signed-in Google user (`other@gmail.com`, `email_verified: true`) tries to create/update `/matches/m999`. -> Denied (`!isAdmin()`).
3. **Email Spoofing (`email_verified: false`)**: Signed-in user with `email: 'kaebmoopingkai3737@gmail.com'` and `email_verified: false` tries to write `/matches/m999`. -> Denied (`email_verified != true`).
4. **Self-Assigned Admin Escalation**: Non-admin user tries to create `/admins/{theirUid}` with `{ uid: theirUid, email: 'attacker@evil.com', role: 'admin' }`. -> Denied (`!isSuperAdmin()`).
5. **PII Leak Attempt on `/admins`**: Non-admin signed-in user tries `list` on `/admins` or `get` on another admin's `/admins/{otherUid}`. -> Denied.
6. **Shadow / Ghost Field Injection**: Admin sends a valid match payload plus `{ isVerified: true }` or `{ updatedByEmail: 'admin@example.com' }` to `/matches/m999`. -> Denied (`keys().hasOnly(...)`).
7. **ID Poisoning / Path Traversal**: Admin tries to create `/matches/a...` (150 chars) or mismatched `{ id: 'm1' }` at path `/matches/m2`. -> Denied (`isValidId` and `data.id == matchId`).
8. **Forged Identity (`updatedByUid`)**: Admin writes `{ ..., updatedByUid: 'someone_else_uid' }`. -> Denied (`data.updatedByUid == request.auth.uid`).
9. **Client-Forged Timestamp (`updatedAt`)**: Admin writes `{ ..., updatedAt: new Date('2020-01-01') }` instead of `serverTimestamp()`. -> Denied (`data.updatedAt == request.time`).
10. **Immutable `createdAt` Mutation**: Admin updates `/matches/m999` and changes `createdAt` from existing server timestamp. -> Denied (`affectedKeys().hasOnly(...)` + `incoming().createdAt == existing().createdAt`).
11. **Oversized String / Resource Poisoning**: Admin writes `notes` with 5,000 characters or `home_team` with 500 characters. -> Denied (`notes.size() <= 2000`, `home_team.size() <= 120`).
12. **Unbounded Array / Invalid Enum**: Admin writes `status: 'hacked'` or `goals` array with 100 entries. -> Denied (`status in [...]`, `goals.size() <= 50`).

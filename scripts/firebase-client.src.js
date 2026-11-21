import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  collection,
  setDoc,
  onSnapshot,
  serverTimestamp,
  query,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const ADMIN_EMAIL = 'kaebmoopingkai3737@gmail.com';
const MATCHES_COLLECTION = 'matches';
const ADMINS_COLLECTION = 'admins';

const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const auth = getAuth(app);

let cachedCloudMatches = null;
let cachedCloudMatchesAt = 0;
let inflightMatchesPromise = null;

function handleFirestoreError(error, operationType, path) {
  const user = auth.currentUser;
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: user ? user.uid : null,
      email: user ? user.email : null,
      emailVerified: user ? user.emailVerified : null,
      isAnonymous: user ? user.isAnonymous : null,
      tenantId: user ? user.tenantId : null,
      providerInfo:
        user && Array.isArray(user.providerData)
          ? user.providerData.map((provider) => ({
              providerId: provider.providerId,
              email: provider.email,
            }))
          : [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

function isSuperAdminEmail(user) {
  if (!user || !user.emailVerified) return false;
  return String(user.email || '').trim().toLowerCase() === ADMIN_EMAIL;
}

async function verifyAdminAccess(user) {
  const target = user || auth.currentUser;
  if (!target || !target.emailVerified) return false;
  if (isSuperAdminEmail(target)) return true;

  const adminPath = `${ADMINS_COLLECTION}/${target.uid}`;
  try {
    const snap = await getDoc(doc(db, ADMINS_COLLECTION, target.uid));
    return snap.exists() && snap.data()?.role === 'admin';
  } catch (error) {
    if (error && error.code === 'permission-denied') {
      return false;
    }
    handleFirestoreError(error, OperationType.GET, adminPath);
    return false;
  }
}

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

async function signOutUser() {
  await signOut(auth);
}

function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

function clampString(val, maxLen) {
  if (val === null || val === undefined) return undefined;
  const s = String(val).trim();
  if (!s) return undefined;
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function stripUndefinedDeep(value) {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    return value.map(stripUndefinedDeep).filter((v) => v !== undefined);
  }
  const out = {};
  Object.entries(value).forEach(([k, v]) => {
    if (v !== undefined) {
      out[k] = stripUndefinedDeep(v);
    }
  });
  return out;
}

function toBoundedInt(val, minVal, maxVal) {
  if (val === null || val === undefined || val === '') return null;
  const n = Math.trunc(Number(val));
  if (!Number.isFinite(n)) return null;
  return Math.min(Math.max(n, minVal), maxVal);
}

function toBoundedNumber(val, minVal, maxVal) {
  if (val === null || val === undefined || val === '') return undefined;
  const n = Number(val);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(n, minVal), maxVal);
}

function normalizeDocData(docSnap) {
  const data = docSnap.data() || {};
  return {
    ...data,
    id: data.id || docSnap.id,
    _cloudManaged: true,
  };
}

function sanitizeMatchForFirestore(payload, uid, options = {}) {
  const { isCreate = true, existingCreatedAt = null } = options;
  const rawId = String(payload.id || '').trim();
  if (!rawId || rawId.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(rawId)) {
    throw new Error('Invalid match ID format. Use letters, numbers, hyphens, or underscores only.');
  }

  const date = String(payload.date || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid match date format. Expected YYYY-MM-DD.');
  }

  const competition = clampString(payload.competition, 120);
  const homeTeam = clampString(payload.home_team, 120);
  const awayTeam = clampString(payload.away_team, 120);
  if (!competition || !homeTeam || !awayTeam) {
    throw new Error('Missing required fields: competition, home_team, away_team.');
  }

  const status = ['upcoming', 'live', 'halftime', 'completed'].includes(payload.status)
    ? payload.status
    : 'upcoming';
  const teamType = payload.team_type === 'W' ? 'W' : 'M';

  const isScoreActive = status === 'completed' || status === 'live' || status === 'halftime';
  const homeScore = isScoreActive ? toBoundedInt(payload.home_score, 0, 99) : null;
  const awayScore = isScoreActive ? toBoundedInt(payload.away_score, 0, 99) : null;

  const isChelseaHome = homeTeam.toLowerCase().includes('chelsea');
  const isChelseaAway = awayTeam.toLowerCase().includes('chelsea');
  const ha =
    payload.ha === 'H' || payload.ha === 'A'
      ? payload.ha
      : isChelseaHome
        ? 'H'
        : isChelseaAway
          ? 'A'
          : '';

  const goals = Array.isArray(payload.goals)
    ? stripUndefinedDeep(payload.goals).slice(0, 50)
    : [];

  const events =
    Array.isArray(payload.events) && payload.events.length > 0
      ? stripUndefinedDeep(payload.events).slice(0, 150)
      : goals.map((g) => ({
          type: 'goal',
          player: g.player || '',
          minute: g.minute ?? '',
          team: g.team === 'away' ? 'away' : 'home',
          ...(g.penalty ? { detail: 'Penalty' } : {}),
          ...(g.own_goal ? { detail: 'Own Goal' } : {}),
        }));

  const channels = Array.isArray(payload.channels)
    ? stripUndefinedDeep(payload.channels).slice(0, 20)
    : [];

  const docObj = {
    id: rawId,
    date,
    time: clampString(payload.time || payload.time_th || 'TBC', 20) || 'TBC',
    time_th: clampString(payload.time_th || payload.time || 'TBC', 20) || 'TBC',
    competition,
    competition_name: clampString(payload.competition_name || competition, 120) || competition,
    competition_logo: clampString(payload.competition_logo || '', 300) || '',
    home_team: homeTeam,
    home_logo: clampString(payload.home_logo || 'assets/images/placeholder-team.svg', 300) || 'assets/images/placeholder-team.svg',
    away_team: awayTeam,
    away_logo: clampString(payload.away_logo || 'assets/images/placeholder-team.svg', 300) || 'assets/images/placeholder-team.svg',
    venue: clampString(payload.venue || '', 180) || '',
    ha,
    status,
    team_type: teamType,
    home_score: homeScore,
    away_score: awayScore,
    goals,
    events,
    channels,
    updatedByUid: uid,
    updatedAt: serverTimestamp(),
  };

  if (isCreate) {
    docObj.createdAt = serverTimestamp();
  } else if (existingCreatedAt) {
    docObj.createdAt = existingCreatedAt;
  }

  const timeUk = clampString(payload.time_uk, 20);
  if (timeUk) docObj.time_uk = timeUk;

  const round = clampString(payload.round, 120);
  if (round) docObj.round = round;

  const referee = clampString(payload.referee, 120);
  if (referee) docObj.referee = referee;

  const attendance = toBoundedInt(payload.attendance, 0, 300000);
  if (attendance !== null) docObj.attendance = attendance;

  const formation = clampString(payload.formation, 30);
  if (formation) docObj.formation = formation;

  const captain = clampString(payload.captain, 120);
  if (captain) docObj.captain = captain;

  const poss = toBoundedNumber(payload.poss, 0, 100);
  if (poss !== undefined) docObj.poss = poss;

  const xg = toBoundedNumber(payload.xg, 0, 50);
  if (xg !== undefined) docObj.xg = xg;

  const xga = toBoundedNumber(payload.xga, 0, 50);
  if (xga !== undefined) docObj.xga = xga;

  const notes = clampString(payload.notes, 2000);
  if (notes) docObj.notes = notes;

  if (payload.lineups && typeof payload.lineups === 'object') {
    docObj.lineups = stripUndefinedDeep(payload.lineups);
  } else if (payload.lineups === null) {
    docObj.lineups = null;
  }

  if (Array.isArray(payload.stats) && payload.stats.length > 0) {
    docObj.stats = stripUndefinedDeep(payload.stats).slice(0, 40);
  }

  if (payload.officials && typeof payload.officials === 'object') {
    docObj.officials = stripUndefinedDeep(payload.officials);
  }

  if (typeof payload._deleted === 'boolean') {
    docObj._deleted = payload._deleted;
  }

  return docObj;
}

async function getCloudMatches(options = {}) {
  const { forceRefresh = false } = options;
  const now = Date.now();
  if (!forceRefresh && Array.isArray(cachedCloudMatches) && now - cachedCloudMatchesAt < 5000) {
    return cachedCloudMatches;
  }
  if (!forceRefresh && inflightMatchesPromise) {
    return inflightMatchesPromise;
  }

  inflightMatchesPromise = (async () => {
    try {
      const matchesQuery = query(collection(db, MATCHES_COLLECTION), limit(1000));
      const snap = await getDocs(matchesQuery);
      const list = snap.docs.map(normalizeDocData);
      cachedCloudMatches = list;
      cachedCloudMatchesAt = Date.now();
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, MATCHES_COLLECTION);
      return [];
    } finally {
      inflightMatchesPromise = null;
    }
  })();

  return inflightMatchesPromise;
}

function subscribeCloudMatches(onData, onError) {
  const matchesQuery = query(collection(db, MATCHES_COLLECTION), limit(1000));
  return onSnapshot(
    matchesQuery,
    (snap) => {
      const list = snap.docs.map(normalizeDocData);
      cachedCloudMatches = list;
      cachedCloudMatchesAt = Date.now();
      if (typeof onData === 'function') onData(list);
    },
    (error) => {
      if (typeof onError === 'function') {
        try {
          handleFirestoreError(error, OperationType.GET, MATCHES_COLLECTION);
        } catch (wrappedErr) {
          onError(wrappedErr);
        }
      } else {
        handleFirestoreError(error, OperationType.GET, MATCHES_COLLECTION);
      }
    }
  );
}

async function saveCloudMatch(payload) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required. Please sign in as admin.');
  }
  const hasAdmin = await verifyAdminAccess(user);
  if (!hasAdmin) {
    throw new Error(`Account ${user.email || ''} is not authorized as admin.`);
  }

  const targetId = String(payload.id || '').trim();
  const docPath = `${MATCHES_COLLECTION}/${targetId}`;
  const docRef = doc(db, MATCHES_COLLECTION, targetId);

  let existingSnap = null;
  try {
    existingSnap = await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }

  const isCreate = !existingSnap || !existingSnap.exists();
  const existingData = isCreate ? null : existingSnap.data();
  const cleanDoc = sanitizeMatchForFirestore(
    { ...payload, _deleted: false },
    user.uid,
    {
      isCreate,
      existingCreatedAt: existingData?.createdAt || null,
    }
  );

  try {
    await setDoc(docRef, cleanDoc);
  } catch (error) {
    handleFirestoreError(error, isCreate ? OperationType.CREATE : OperationType.UPDATE, docPath);
  }

  cachedCloudMatches = null;
  const savedLocal = {
    ...cleanDoc,
    createdAt: existingData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _cloudManaged: true,
  };
  return savedLocal;
}

async function deleteCloudMatch(matchOrId) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required. Please sign in as admin.');
  }
  const hasAdmin = await verifyAdminAccess(user);
  if (!hasAdmin) {
    throw new Error(`Account ${user.email || ''} is not authorized as admin.`);
  }

  const matchObj =
    typeof matchOrId === 'object' && matchOrId !== null ? matchOrId : { id: String(matchOrId || '') };
  const targetId = String(matchObj.id || '').trim();
  if (!targetId) {
    throw new Error('Missing match ID for deletion.');
  }

  const docPath = `${MATCHES_COLLECTION}/${targetId}`;
  const docRef = doc(db, MATCHES_COLLECTION, targetId);

  let existingSnap = null;
  try {
    existingSnap = await getDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }

  const isCreate = !existingSnap || !existingSnap.exists();
  const existingData = isCreate ? {} : existingSnap.data();

  const fallbackMatch = {
    id: targetId,
    date: matchObj.date || existingData.date || '2026-01-01',
    competition: matchObj.competition || existingData.competition || 'premier-league',
    home_team: matchObj.home_team || existingData.home_team || 'Chelsea',
    away_team: matchObj.away_team || existingData.away_team || 'Opponent',
    status: matchObj.status || existingData.status || 'upcoming',
    team_type: matchObj.team_type === 'W' || existingData.team_type === 'W' ? 'W' : 'M',
    _deleted: true,
  };

  const tombstoneDoc = sanitizeMatchForFirestore(fallbackMatch, user.uid, {
    isCreate,
    existingCreatedAt: existingData?.createdAt || null,
  });

  try {
    await setDoc(docRef, tombstoneDoc);
  } catch (error) {
    handleFirestoreError(error, isCreate ? OperationType.CREATE : OperationType.UPDATE, docPath);
  }

  cachedCloudMatches = null;
  return { ok: true, deletedId: targetId };
}

function normalizeMatchLookupKey(id) {
  const s = String(id || '').trim().toLowerCase();
  const m = s.match(/^(m|w)0*(\d+)$/);
  if (m) return `${m[1]}${parseInt(m[2], 10)}`;
  return s;
}

function mergeMatchesWithCloud(baseList, cloudList, options = {}) {
  const { filterTeamType = null, includeDeleted = false } = options;
  const baseArr = Array.isArray(baseList) ? baseList : [];
  const cloudArr = Array.isArray(cloudList) ? cloudList : [];

  const cloudByExact = new Map();
  const cloudByNorm = new Map();
  cloudArr.forEach((cm) => {
    if (!cm || cm.id == null) return;
    const exactKey = String(cm.id).trim().toLowerCase();
    const normKey = normalizeMatchLookupKey(cm.id);
    cloudByExact.set(exactKey, cm);
    cloudByNorm.set(normKey, cm);
  });

  const consumedCloudIds = new Set();
  const merged = [];

  baseArr.forEach((bm) => {
    if (!bm || bm.id == null) return;
    const exactKey = String(bm.id).trim().toLowerCase();
    const normKey = normalizeMatchLookupKey(bm.id);
    const cloudMatch = cloudByExact.get(exactKey) || cloudByNorm.get(normKey);

    if (cloudMatch) {
      consumedCloudIds.add(String(cloudMatch.id).trim().toLowerCase());
      if (cloudMatch._deleted && !includeDeleted) {
        return;
      }
      const combined = {
        ...bm,
        ...cloudMatch,
        _cloudManaged: true,
      };
      if (cloudMatch.lineups === null) {
        delete combined.lineups;
      }
      merged.push(combined);
    } else {
      merged.push(bm);
    }
  });

  cloudArr.forEach((cm) => {
    if (!cm || cm.id == null) return;
    const exactKey = String(cm.id).trim().toLowerCase();
    if (consumedCloudIds.has(exactKey)) return;
    if (cm._deleted && !includeDeleted) return;

    const tt = cm.team_type === 'W' || String(cm.id).toLowerCase().startsWith('w') ? 'W' : 'M';
    if (filterTeamType && tt !== filterTeamType) return;

    const clean = { ...cm, _cloudManaged: true };
    if (clean.lineups === null) delete clean.lineups;
    merged.push(clean);
  });

  return merged;
}

async function fetchAndMergeMenFixtures(baseList) {
  try {
    const cloud = await getCloudMatches();
    return mergeMatchesWithCloud(baseList, cloud, { filterTeamType: 'M' });
  } catch (err) {
    console.warn('[KlknFirebase] Falling back to static men fixtures:', err);
    return Array.isArray(baseList) ? baseList : [];
  }
}

async function fetchAndMergeWomenFixtures(baseList) {
  try {
    const cloud = await getCloudMatches();
    return mergeMatchesWithCloud(baseList, cloud, { filterTeamType: 'W' });
  } catch (err) {
    console.warn('[KlknFirebase] Falling back to static women fixtures:', err);
    return Array.isArray(baseList) ? baseList : [];
  }
}

async function fetchAndMergeAllFixtures(baseList) {
  try {
    const cloud = await getCloudMatches();
    return mergeMatchesWithCloud(baseList, cloud);
  } catch (err) {
    console.warn('[KlknFirebase] Falling back to static all fixtures:', err);
    return Array.isArray(baseList) ? baseList : [];
  }
}

window.KlknFirebase = {
  ADMIN_EMAIL,
  OperationType,
  app,
  db,
  auth,
  isSuperAdminEmail,
  verifyAdminAccess,
  signInWithGoogle,
  signOutUser,
  onAuthChange,
  getCloudMatches,
  subscribeCloudMatches,
  saveCloudMatch,
  deleteCloudMatch,
  mergeMatchesWithCloud,
  fetchAndMergeMenFixtures,
  fetchAndMergeWomenFixtures,
  fetchAndMergeAllFixtures,
};

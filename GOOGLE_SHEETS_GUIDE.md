# Google Sheets Setup for Players Profile

The `player-profile.html` is configured to read data from your current Google Sheets or JSON data setup.

To correctly populate the full profile for 1 player, you need the following columns in your Google Sheets:

1. **id** (Number/String) - Unique identifier for the player (e.g., 24).
2. **name** (String) - Full name of the player (e.g., "Cole Palmer").
3. **number** (Number) - Squad number (e.g., 10).
4. **position** (String) - Goalkeeper, Defender, Midfielder, Forward.
5. **nationality** (String) - Country name.
6. **image** (String) - URL or path to the player's photo (e.g., `assets/images/players/cole-palmer.jpg`).
7. **height** (Number) - Player's height in cm.
8. **foot** (String) - Preferred foot (Left/Right).
9. **date_of_birth** (String) - Format `YYYY-MM-DD`.
10. **age** (Number) - Current age.
11. **joined** (String) - Date joined, format `YYYY-MM-DD`.
12. **signed_from** (String) - Previous club name.
13. **market_value** (Number) - Estimated market value (e.g., 100000000).
14. **appearances** (Number) - Matches played.
15. **goals** (Number) - Goals scored.
16. **assists** (Number) - Assists provided.
17. **bio** (String) - A short biography or background story about the player. (New field to add)
18. **instagram** (String) - Instagram username or full URL. (New field to add)
19. **twitter** (String) - Twitter (X) username or full URL. (New field to add)

Ensure that your Google App Script (`exec?team=men` and `exec?team=women`) is updated to fetch and return these new columns (`bio`, `instagram`, `twitter`) if you want them to display on the profile page.

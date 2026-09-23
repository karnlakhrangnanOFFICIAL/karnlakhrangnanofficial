#!/usr/bin/env python3
"""
ETL Pipeline: Chelsea Women Data Ingestion & Normalization
Sources:
  1. TheSportsDB (Team Profile & Artworks)
  2. API-Football (Team ID, Squad Players, Match Fixtures)

Author: Senior Data Engineer & Python Developer
"""

import json
import logging
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Tuple

# Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("ChelseaWomenETL")

API_SPORTS_KEY = "bf907aa564f4776d02638ff4da3edf23"
USER_AGENT = "ChelseaWomenDataPipeline/1.0 (DataEngineering; Python)"


def send_http_request(
    url: str,
    headers: Optional[Dict[str, str]] = None,
    timeout: int = 15
) -> Optional[Dict[str, Any]]:
    """
    HTTP Request wrapper พร้อม Error Handling ครอบคลุม:
    - HTTPError (4xx, 5xx)
    - URLError (DNS, Connection Refused, Network Down)
    - TimeoutError
    - JSONDecodeError
    """
    req_headers = {"User-Agent": USER_AGENT}
    if headers:
        req_headers.update(headers)

    req = urllib.request.Request(url, headers=req_headers)
    try:
        logger.info(f"Connecting to: {url}")
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status_code = response.getcode()
            if status_code != 200:
                logger.warning(f"Unexpected HTTP status {status_code} from {url}")
                return None
            raw_body = response.read().decode("utf-8")
            return json.loads(raw_body)
    except urllib.error.HTTPError as e:
        logger.error(f"[HTTPError] {e.code} - {e.reason} while requesting {url}")
    except urllib.error.URLError as e:
        logger.error(f"[URLError] Network or DNS error: {e.reason} for {url}")
    except TimeoutError:
        logger.error(f"[TimeoutError] Request timed out after {timeout}s for {url}")
    except json.JSONDecodeError as e:
        logger.error(f"[JSONDecodeError] Failed to parse response JSON from {url}: {e}")
    except Exception as e:
        logger.error(f"[UnexpectedError] An error occurred: {e}")

    return None


def fetch_thesportsdb_profile(team_name: str = "Chelsea Women") -> Optional[Dict[str, Any]]:
    """
    ดึงข้อมูล Profile และ Artwork ของทีมจาก TheSportsDB
    """
    encoded_name = urllib.parse.quote(team_name)
    url = f"https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t={encoded_name}"
    data = send_http_request(url)

    if not data or not data.get("teams"):
        logger.warning(f"No team data found on TheSportsDB for: {team_name}")
        return None

    return data["teams"][0]


def fetch_apifootball_team_id(api_key: str, search_name: str = "Chelsea Women") -> Tuple[Optional[int], Optional[str]]:
    """
    ค้นหา Team ID ของ Chelsea Women จาก API-Football
    Data Engineering Note:
      ในฐานข้อมูล API-Football สโมสรลงทะเบียนด้วยชื่อ 'Chelsea W'
      ระบบจึงทำ Smart Fallback หากค้นหา 'Chelsea Women' แล้วไม่พบ
    """
    headers = {"x-apisports-key": api_key}
    
    # รอบที่ 1: ค้นหาตาม search_name ที่ระบุ
    candidates = [search_name, "Chelsea W", "Chelsea"]
    
    for candidate in candidates:
        encoded_query = urllib.parse.quote(candidate)
        url = f"https://v3.football.api-sports.io/teams?search={encoded_query}"
        data = send_http_request(url, headers=headers)
        
        if data and data.get("response"):
            for item in data["response"]:
                team = item.get("team", {})
                t_name = team.get("name", "")
                t_id = team.get("id")
                # ตรวจสอบชื่อที่ตรงกับ Chelsea Women / Chelsea W
                if t_name in ["Chelsea W", "Chelsea Women", "Chelsea FC Women"]:
                    logger.info(f"Identified API-Football Team ID: {t_id} (Name: '{t_name}')")
                    return t_id, t_name
                    
    logger.warning("Could not resolve Chelsea Women Team ID from API-Football")
    return None, None


def fetch_apifootball_squad(api_key: str, team_id: int) -> List[Dict[str, Any]]:
    """
    ดึงข้อมูลรายชื่อนักฟุตบอล (Squad) ของทีมจาก API-Football
    """
    headers = {"x-apisports-key": api_key}
    url = f"https://v3.football.api-sports.io/players/squads?team={team_id}"
    data = send_http_request(url, headers=headers)

    if not data or not data.get("response"):
        logger.warning(f"No squad data returned for Team ID: {team_id}")
        return []

    return data["response"][0].get("players", [])


def fetch_apifootball_fixtures(api_key: str, team_id: int, season: int = 2024, limit: int = 5) -> List[Dict[str, Any]]:
    """
    ดึงข้อมูลโปรแกรมการแข่งขัน (Match Fixtures) ล่าสุดจาก API-Football
    """
    headers = {"x-apisports-key": api_key}
    url = f"https://v3.football.api-sports.io/fixtures?team={team_id}&season={season}"
    data = send_http_request(url, headers=headers)

    if not data or not data.get("response"):
        logger.warning(f"No fixtures found for Team ID {team_id} in Season {season}")
        return []

    return data["response"][:limit]


def print_ascii_table(title: str, headers: List[str], rows: List[List[Any]], max_col_width: int = 35) -> None:
    """
    แปลงข้อมูลให้อยู่ในรูปแบบตาราง ASCII สวยงาม พร้อมตัดคำ (Truncate) สำหรับ Database Preview
    """
    print("\n" + "=" * 80)
    print(f"📊 TABLE: {title.upper()}")
    print("=" * 80)

    if not rows:
        print("(No records found)")
        return

    # Calculate column widths
    str_rows = [
        [str(cell if cell is not None else "NULL")[:max_col_width] for cell in row]
        for row in rows
    ]
    col_widths = [len(h) for h in headers]
    for row in str_rows:
        for idx, cell in enumerate(row):
            col_widths[idx] = max(col_widths[idx], len(cell))

    # Format row border and header
    border = "+-" + "-+-".join("-" * w for w in col_widths) + "-+"
    header_str = "| " + " | ".join(h.ljust(w) for h, w in zip(headers, col_widths)) + " |"

    print(border)
    print(header_str)
    print(border)
    for row in str_rows:
        row_str = "| " + " | ".join(cell.ljust(w) for cell, w in zip(row, col_widths)) + " |"
        print(row_str)
    print(border)
    print(f"Total Rows: {len(rows)}\n")


def run_pipeline():
    print("""
    ======================================================================
    🚀 CHELSEA WOMEN - DATA PIPELINE & DATABASE NORMALIZATION SCRIPT
    ======================================================================
    """)

    # STEP 1: TheSportsDB
    logger.info("--- STEP 1: Fetching Profile & Artworks from TheSportsDB ---")
    tsdb_team = fetch_thesportsdb_profile("Chelsea Women")

    # STEP 2: API-Football
    logger.info("--- STEP 2: Searching Team ID from API-Football ---")
    api_team_id, api_team_name = fetch_apifootball_team_id(API_SPORTS_KEY, "Chelsea Women")

    if not api_team_id and tsdb_team and tsdb_team.get("idAPIfootball"):
        # Cross-reference using TSDB's foreign key
        api_team_id = int(tsdb_team["idAPIfootball"])
        logger.info(f"Fallback to TSDB linked idAPIfootball: {api_team_id}")

    # STEP 3: Fetch Players & Fixtures
    players = []
    fixtures = []
    if api_team_id:
        logger.info(f"--- STEP 3: Fetching Squad & Fixtures for Team ID: {api_team_id} ---")
        players = fetch_apifootball_squad(API_SPORTS_KEY, api_team_id)
        fixtures = fetch_apifootball_fixtures(API_SPORTS_KEY, api_team_id, season=2024, limit=5)

    # STEP 4: Format Normalized Tables for Database Creation
    logger.info("--- STEP 4: Formatting JSON to Database-Ready Tables ---")

    # Table 1: Dim_Team (Merged Master Record)
    team_headers = ["team_id", "source_system", "team_name", "formed_year", "country", "stadium_name", "league_name"]
    team_rows = []
    if tsdb_team:
        team_rows.append([
            tsdb_team.get("idTeam"),
            "TheSportsDB",
            tsdb_team.get("strTeam"),
            tsdb_team.get("intFormedYear"),
            tsdb_team.get("strCountry"),
            tsdb_team.get("strStadium"),
            tsdb_team.get("strLeague")
        ])
    if api_team_id:
        team_rows.append([
            api_team_id,
            "API-Football",
            api_team_name or "Chelsea W",
            "1992",
            "England",
            "Kingsmeadow",
            "Women's Super League"
        ])
    print_ascii_table("Dim_Team (Team Master Profiles)", team_headers, team_rows)

    # Table 2: Dim_Team_Artworks (TheSportsDB Goal)
    artwork_headers = ["team_id", "asset_type", "image_url"]
    artwork_rows = []
    if tsdb_team:
        t_id = tsdb_team.get("idTeam")
        asset_keys = [
            ("Badge", "strBadge"),
            ("Logo", "strLogo"),
            ("Banner", "strBanner"),
            ("Equipment/Kit", "strEquipment"),
            ("Fanart 1", "strFanart1"),
            ("Fanart 2", "strFanart2")
        ]
        for label, key in asset_keys:
            val = tsdb_team.get(key)
            if val:
                artwork_rows.append([t_id, label, val])
    print_ascii_table("Dim_Team_Artworks (Visual Branding Assets)", artwork_headers, artwork_rows, max_col_width=45)

    # Table 3: Dim_Player (Squad from API-Football)
    player_headers = ["player_id", "team_id", "player_name", "age", "number", "position"]
    player_rows = []
    for p in players[:10]:  # Preview Top 10 players
        player_rows.append([
            p.get("id"),
            api_team_id,
            p.get("name"),
            p.get("age"),
            p.get("number"),
            p.get("position")
        ])
    print_ascii_table("Dim_Player (API-Football Squad Sample)", player_headers, player_rows)

    # Table 4: Fact_Fixture (Match Fixtures from API-Football)
    fixture_headers = ["fixture_id", "date_utc", "league", "home_team", "away_team", "score"]
    fixture_rows = []
    for f in fixtures:
        fix = f.get("fixture", {})
        league = f.get("league", {})
        teams = f.get("teams", {})
        goals = f.get("goals", {})
        home_score = goals.get("home") if goals.get("home") is not None else "-"
        away_score = goals.get("away") if goals.get("away") is not None else "-"

        fixture_rows.append([
            fix.get("id"),
            fix.get("date"),
            league.get("name"),
            teams.get("home", {}).get("name"),
            teams.get("away", {}).get("name"),
            f"{home_score} - {away_score}"
        ])
    print_ascii_table("Fact_Fixture (API-Football Fixture Schedule)", fixture_headers, fixture_rows)

    logger.info("Pipeline completed successfully! Ready for SQL insertion or Pandas DataFrame processing.")


if __name__ == "__main__":
    run_pipeline()

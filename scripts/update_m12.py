import json

def update_m12():
    with open("data/fixtures.json", "r", encoding="utf-8") as f:
        fixtures = json.load(f)

    m12_updated = {
        "id": "m12",
        "date": "2026-10-10",
        "time": "21:00",
        "time_th": "21:00",
        "time_uk": "15:00",
        "competition": "premier-league",
        "competition_name": "Premier League",
        "competition_logo": "databases/logo/competitions/men/premier-league.png",
        "round": "Matchweek 7",
        "ha": "H",
        "home_team": "Chelsea",
        "home_logo": "databases/logo/teams/england_chelsea.svg",
        "away_team": "AFC Bournemouth",
        "away_logo": "databases/logo/teams/england_bournemouth.svg",
        "venue": "Stamford Bridge",
        "attendance": 39676,
        "referee": "Samuel Barrott",
        "status": "completed",
        "period": "FullTime",
        "home_score": 5,
        "away_score": 1,
        "home_half_score": 2,
        "away_half_score": 0,
        "channels": [
            {
                "platform": "www.monomax.me",
                "name": "MONOMAX SPORTS TV",
                "logo": "databases/logo/tv/monomax.svg"
            }
        ],
        "goals": [
            {
                "team": "home",
                "player": "Jordan Henderson",
                "minute": 2,
                "assist": "Cole Palmer"
            },
            {
                "team": "home",
                "player": "Morgan Rogers",
                "minute": 3,
                "assist": "Jordan Henderson"
            },
            {
                "team": "home",
                "player": "João Pedro",
                "minute": 46,
                "assist": "Pedro Neto"
            },
            {
                "team": "away",
                "player": "Evanilson",
                "minute": 51
            },
            {
                "team": "home",
                "player": "João Pedro",
                "minute": 67,
                "assist": "Pep Chavarría"
            },
            {
                "team": "home",
                "player": "Jordan Henderson",
                "minute": 70,
                "detail": "Direct free kick"
            }
        ],
        "events": [
            {
                "type": "goal",
                "team": "home",
                "player": "Jordan Henderson",
                "minute": 2,
                "assist": "Cole Palmer",
                "detail": "Goal! Chelsea 1, Bournemouth 0. Jordan Henderson (Chelsea) right footed shot. Assisted by Cole Palmer."
            },
            {
                "type": "goal",
                "team": "home",
                "player": "Morgan Rogers",
                "minute": 3,
                "assist": "Jordan Henderson",
                "detail": "Goal! Chelsea 2, Bournemouth 0. Morgan Rogers (Chelsea) right footed shot. Assisted by Jordan Henderson."
            },
            {
                "type": "yellow_card",
                "team": "away",
                "player": "Marcus Tavernier",
                "minute": 10,
                "detail": "Marcus Tavernier (Bournemouth) is shown the yellow card for a bad foul."
            },
            {
                "type": "yellow_card",
                "team": "away",
                "player": "Adrien Truffert",
                "minute": 42,
                "detail": "Adrien Truffert (Bournemouth) is shown the yellow card for a bad foul."
            },
            {
                "type": "substitution",
                "team": "away",
                "player_in": "Ben Gannon-Doak",
                "player_out": "David Brooks",
                "player": "Ben Gannon-Doak",
                "minute": 46,
                "detail": "Substitution, Bournemouth. Ben Gannon-Doak replaces David Brooks."
            },
            {
                "type": "goal",
                "team": "home",
                "player": "João Pedro",
                "minute": 46,
                "assist": "Pedro Neto",
                "detail": "Goal! Chelsea 3, Bournemouth 0. João Pedro (Chelsea) right footed shot. Assisted by Pedro Neto."
            },
            {
                "type": "goal",
                "team": "away",
                "player": "Evanilson",
                "minute": 51,
                "detail": "Goal! Chelsea 3, Bournemouth 1. Evanilson (Bournemouth) right footed shot."
            },
            {
                "type": "yellow_card",
                "team": "away",
                "player": "Tyler Adams",
                "minute": 62,
                "detail": "Tyler Adams (Bournemouth) is shown the yellow card for a bad foul."
            },
            {
                "type": "goal",
                "team": "home",
                "player": "João Pedro",
                "minute": 67,
                "assist": "Pep Chavarría",
                "detail": "Goal! Chelsea 4, Bournemouth 1. João Pedro (Chelsea) right footed shot. Assisted by Pep Chavarría."
            },
            {
                "type": "yellow_card",
                "team": "away",
                "player": "Ryan Christie",
                "minute": 69,
                "detail": "Ryan Christie (Bournemouth) is shown the yellow card for a bad foul."
            },
            {
                "type": "goal",
                "team": "home",
                "player": "Jordan Henderson",
                "minute": 70,
                "detail": "Goal! Chelsea 5, Bournemouth 1. Jordan Henderson (Chelsea) direct free kick."
            },
            {
                "type": "substitution",
                "team": "home",
                "player_in": "Marco Palestra",
                "player_out": "João Pedro",
                "player": "Marco Palestra",
                "minute": 72,
                "detail": "Substitution, Chelsea. Marco Palestra replaces João Pedro."
            },
            {
                "type": "substitution",
                "team": "home",
                "player_in": "Roméo Lavia",
                "player_out": "Moisés Caicedo",
                "player": "Roméo Lavia",
                "minute": 72,
                "detail": "Substitution, Chelsea. Roméo Lavia replaces Moisés Caicedo."
            },
            {
                "type": "substitution",
                "team": "away",
                "player_in": "Juanlu Sánchez",
                "player_out": "Adam Smith",
                "player": "Juanlu Sánchez",
                "minute": 72,
                "detail": "Substitution, Bournemouth. Juanlu Sánchez replaces Adam Smith."
            },
            {
                "type": "substitution",
                "team": "away",
                "player_in": "Álvaro Rodriguez",
                "player_out": "Marcus Tavernier",
                "player": "Álvaro Rodriguez",
                "minute": 72,
                "detail": "Substitution, Bournemouth. Álvaro Rodriguez replaces Marcus Tavernier."
            },
            {
                "type": "substitution",
                "team": "away",
                "player_in": "Lewis Cook",
                "player_out": "Ryan Christie",
                "player": "Lewis Cook",
                "minute": 73,
                "detail": "Substitution, Bournemouth. Lewis Cook replaces Ryan Christie."
            },
            {
                "type": "substitution",
                "team": "home",
                "player_in": "Danny Welbeck",
                "player_out": "Pedro Neto",
                "player": "Danny Welbeck",
                "minute": 83,
                "detail": "Substitution, Chelsea. Danny Welbeck replaces Pedro Neto."
            },
            {
                "type": "substitution",
                "team": "home",
                "player_in": "Estêvão",
                "player_out": "Morgan Rogers",
                "player": "Estêvão",
                "minute": 84,
                "detail": "Substitution, Chelsea. Estêvão replaces Morgan Rogers."
            },
            {
                "type": "substitution",
                "team": "away",
                "player_in": "Julio Soler",
                "player_out": "Adrien Truffert",
                "player": "Julio Soler",
                "minute": 84,
                "detail": "Substitution, Bournemouth. Julio Soler replaces Adrien Truffert."
            },
            {
                "type": "substitution",
                "team": "home",
                "player_in": "Malo Gusto",
                "player_out": "Cole Palmer",
                "player": "Malo Gusto",
                "minute": 88,
                "detail": "Substitution, Chelsea. Malo Gusto replaces Cole Palmer."
            }
        ],
        "lineups": {
            "home": {
                "manager": "Xabi Alonso",
                "formation": "3-4-2-1",
                "starting": [
                    {"number": 1, "name": "Emiliano Martínez", "position": "GK"},
                    {"number": 34, "name": "Josh Acheampong", "position": "CB"},
                    {"number": 5, "name": "Maxence Lacroix", "position": "CB"},
                    {"number": 6, "name": "Levi Colwill", "position": "CB", "captain": True},
                    {"number": 25, "name": "Moisés Caicedo", "position": "CM"},
                    {"number": 14, "name": "Jordan Henderson", "position": "CM"},
                    {"number": 29, "name": "Pep Chavarría", "position": "LWB"},
                    {"number": 7, "name": "Pedro Neto", "position": "RWB"},
                    {"number": 10, "name": "Cole Palmer", "position": "AM"},
                    {"number": 17, "name": "Morgan Rogers", "position": "AM"},
                    {"number": 9, "name": "João Pedro", "position": "ST"}
                ],
                "substitutes": [
                    {"number": 39, "name": "Mike Penders", "position": "GK"},
                    {"number": 21, "name": "Jorrel Hato", "position": "DF"},
                    {"number": 3, "name": "Wesley Fofana", "position": "DF"},
                    {"number": 23, "name": "Geovany Quenda", "position": "FW"},
                    {"number": 2, "name": "Marco Palestra", "position": "DF"},
                    {"number": 45, "name": "Roméo Lavia", "position": "MF"},
                    {"number": 18, "name": "Danny Welbeck", "position": "FW"},
                    {"number": 41, "name": "Estêvão", "position": "FW"},
                    {"number": 27, "name": "Malo Gusto", "position": "DF"}
                ]
            },
            "away": {
                "manager": "Marco Rose",
                "formation": "4-2-3-1",
                "starting": [
                    {"number": 1, "name": "Djordje Petrović", "position": "GK"},
                    {"number": 15, "name": "Adam Smith", "position": "DF", "captain": True},
                    {"number": 5, "name": "James Hill", "position": "DF"},
                    {"number": 14, "name": "António Silva", "position": "DF"},
                    {"number": 3, "name": "Adrien Truffert", "position": "DF"},
                    {"number": 12, "name": "Tyler Adams", "position": "MF"},
                    {"number": 10, "name": "Ryan Christie", "position": "MF"},
                    {"number": 7, "name": "David Brooks", "position": "MF"},
                    {"number": 16, "name": "Marcus Tavernier", "position": "MF"},
                    {"number": 37, "name": "Rayan", "position": "FW"},
                    {"number": 9, "name": "Evanilson", "position": "FW"}
                ],
                "substitutes": [
                    {"number": 20, "name": "Michele Di Gregorio", "position": "GK"},
                    {"number": 18, "name": "Bafodé Diakité", "position": "DF"},
                    {"number": 27, "name": "Alex Tóth", "position": "MF"},
                    {"number": 29, "name": "Daniel Jebbison", "position": "FW"},
                    {"number": 11, "name": "Ben Gannon-Doak", "position": "FW"},
                    {"number": 24, "name": "Juanlu Sánchez", "position": "DF"},
                    {"number": 30, "name": "Álvaro Rodriguez", "position": "FW"},
                    {"number": 4, "name": "Lewis Cook", "position": "MF"},
                    {"number": 6, "name": "Julio Soler", "position": "DF"}
                ]
            },
            "officials": [
                {"role": "ผู้ตัดสิน (Referee)", "name": "Samuel Barrott"},
                {"role": "ผู้ช่วยผู้ตัดสิน 1 (Assistant Referee 1)", "name": "Adam Nunn"},
                {"role": "ผู้ช่วยผู้ตัดสิน 2 (Assistant Referee 2)", "name": "Wade Smith"},
                {"role": "ผู้ตัดสินที่ 4 (Fourth Official)", "name": "Elliot Bell"},
                {"role": "ผู้ตัดสิน VAR (Video Assistant Referee)", "name": "John Brooks"},
                {"role": "ผู้ช่วยผู้ตัดสิน VAR (Assistant VAR)", "name": "James Mainwaring"}
            ]
        },
        "officials": {
            "referee": "Samuel Barrott",
            "assistant_referees": ["Adam Nunn", "Wade Smith"],
            "fourth_official": "Elliot Bell",
            "var": "John Brooks",
            "assistant_var": "James Mainwaring"
        },
        "stats": [
            {"name": "การครองบอล (Possession)", "home": 50, "away": 50, "isPercentage": True},
            {"name": "โอกาสยิงทั้งหมด (Total Shots)", "home": 10, "away": 9, "isPercentage": False},
            {"name": "ยิงตรงกรอบ (Shots on Target)", "home": 6, "away": 4, "isPercentage": False},
            {"name": "เตะมุม (Corner Kicks)", "home": 1, "away": 7, "isPercentage": False},
            {"name": "ทำฟาวล์ (Fouls)", "home": 7, "away": 15, "isPercentage": False},
            {"name": "การเซฟ (Saves)", "home": 3, "away": 1, "isPercentage": False},
            {"name": "ใบเหลือง (Yellow Cards)", "home": 0, "away": 4, "isPercentage": False}
        ],
        "goalkeeper_stats": [
            {"name": "Emiliano Martínez", "team": "Chelsea", "saves": 3, "save_pct": "75%"},
            {"name": "Djordje Petrović", "team": "Bournemouth", "saves": 1, "save_pct": "17%"}
        ],
        "youtube_id": "FddTcfdg18c",
        "video": {
            "id": "FddTcfdg18c",
            "title": "Chelsea 5-1 Bournemouth | HIGHLIGHTS | Premier League 2026/27",
            "desc_th": "ไฮไลท์การแข่งขัน พรีเมียร์ลีก เชลซี เปิดรังชนะ บอร์นมัธ 5-1 ณ สนามสแตมฟอร์ด บริดจ์",
            "desc_en": "Match highlights: Chelsea 5-1 Bournemouth at Stamford Bridge.",
            "credit": "ขอขอบคุณคลิปไฮไลท์จากช่อง Monomax Sports ทาง YouTube",
            "channel_name": "Monomax Sports",
            "channel_handle": "@MonomaxSports",
            "channel_url": "https://www.youtube.com/@MonomaxSports"
        },
        "commentary": [
            {
                "section": "📌 ประเด็นสำคัญจากการแข่งขัน (Key Takeaways)",
                "events": [
                    {
                        "text": "<strong>เปิดเกมสุดดุดัน:</strong> เชลซียิงนำรวดเร็ว 2-0 ตั้งแต่ 3 นาทีแรก จาก Jordan Henderson (2') และ Morgan Rogers (3')"
                    },
                    {
                        "text": "<strong>João Pedro ฟอร์มร้อนแรง:</strong> เหมาคนเดียว 2 ประตูในนาทีที่ 46 และ 67 โชว์ความเฉียบคมในแดนหน้า"
                    },
                    {
                        "text": "<strong>ลูกฟรีคิกสุดสวยของ Henderson:</strong> Jordan Henderson ยิงฟรีคิกโดยตรงเสียบเสาในนาทีที่ 70 ทำประตูที่ 2 ของตัวเองในเกมนี้"
                    },
                    {
                        "text": "<strong>ชัยชนะขาดลอย 5-1:</strong> สิงห์บลูส์เก็บ 3 แต้มสำคัญต่อหน้าแฟนบอล 39,676 คนในสแตมฟอร์ด บริดจ์"
                    }
                ]
            }
        ],
        "live_commentary": [
            {
                "time": "90+5'",
                "type": "end 2nd half",
                "text": "Full Time. Chelsea 5, AFC Bournemouth 1. จบเกมการแข่งขัน เชลซี เปิดบ้านถล่ม บอร์นมัธ 5-1 คว้า 3 แต้มได้อย่างยอดเยี่ยม",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "88'",
                "type": "substitution",
                "text": "Substitution, Chelsea. Malo Gusto replaces Cole Palmer.",
                "team": "home",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "84'",
                "type": "substitution",
                "text": "Substitution, Chelsea. Estêvão replaces Morgan Rogers.",
                "team": "home",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "84'",
                "type": "substitution",
                "text": "Substitution, Bournemouth. Julio Soler replaces Adrien Truffert.",
                "team": "away",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "83'",
                "type": "substitution",
                "text": "Substitution, Chelsea. Danny Welbeck replaces Pedro Neto.",
                "team": "home",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "73'",
                "type": "substitution",
                "text": "Substitution, Bournemouth. Lewis Cook replaces Ryan Christie.",
                "team": "away",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "72'",
                "type": "substitution",
                "text": "Substitution, Bournemouth. Álvaro Rodriguez replaces Marcus Tavernier.",
                "team": "away",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "72'",
                "type": "substitution",
                "text": "Substitution, Bournemouth. Juanlu Sánchez replaces Adam Smith.",
                "team": "away",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "72'",
                "type": "substitution",
                "text": "Substitution, Chelsea. Roméo Lavia replaces Moisés Caicedo.",
                "team": "home",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "72'",
                "type": "substitution",
                "text": "Substitution, Chelsea. Marco Palestra replaces João Pedro.",
                "team": "home",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "70'",
                "type": "goal",
                "text": "Goal! Chelsea 5, AFC Bournemouth 1. Jordan Henderson (Chelsea) direct free kick right footed shot into the top corner.",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "69'",
                "type": "yellow card",
                "text": "Ryan Christie (Bournemouth) is shown the yellow card for a bad foul.",
                "team": "away",
                "category": "card",
                "isKey": True
            },
            {
                "time": "67'",
                "type": "goal",
                "text": "Goal! Chelsea 4, AFC Bournemouth 1. João Pedro (Chelsea) right footed shot from the centre of the box. Assisted by Pep Chavarría.",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "62'",
                "type": "yellow card",
                "text": "Tyler Adams (Bournemouth) is shown the yellow card for a bad foul.",
                "team": "away",
                "category": "card",
                "isKey": True
            },
            {
                "time": "51'",
                "type": "goal",
                "text": "Goal! Chelsea 3, AFC Bournemouth 1. Evanilson (Bournemouth) right footed shot from the centre of the box.",
                "team": "away",
                "category": "key",
                "isKey": True
            },
            {
                "time": "46'",
                "type": "goal",
                "text": "Goal! Chelsea 3, AFC Bournemouth 0. João Pedro (Chelsea) right footed shot from inside the box. Assisted by Pedro Neto.",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "46'",
                "type": "substitution",
                "text": "Substitution, Bournemouth. Ben Gannon-Doak replaces David Brooks.",
                "team": "away",
                "category": "sub",
                "isKey": True
            },
            {
                "time": "46'",
                "type": "start 2nd half",
                "text": "Second Half begins Chelsea 2, AFC Bournemouth 0.",
                "team": "home",
                "category": "general",
                "isKey": False
            },
            {
                "time": "45+2'",
                "type": "end 1st half",
                "text": "Half Time. Chelsea 2, AFC Bournemouth 0.",
                "team": "home",
                "category": "general",
                "isKey": False
            },
            {
                "time": "42'",
                "type": "yellow card",
                "text": "Adrien Truffert (Bournemouth) is shown the yellow card for a bad foul.",
                "team": "away",
                "category": "card",
                "isKey": True
            },
            {
                "time": "10'",
                "type": "yellow card",
                "text": "Marcus Tavernier (Bournemouth) is shown the yellow card for a bad foul.",
                "team": "away",
                "category": "card",
                "isKey": True
            },
            {
                "time": "3'",
                "type": "goal",
                "text": "Goal! Chelsea 2, AFC Bournemouth 0. Morgan Rogers (Chelsea) right footed shot from inside the box. Assisted by Jordan Henderson.",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "2'",
                "type": "goal",
                "text": "Goal! Chelsea 1, AFC Bournemouth 0. Jordan Henderson (Chelsea) right footed shot from the centre of the box. Assisted by Cole Palmer.",
                "team": "home",
                "category": "key",
                "isKey": True
            },
            {
                "time": "0'",
                "type": "start 1st half",
                "text": "First Half begins. Kick-off at Stamford Bridge.",
                "team": "home",
                "category": "general",
                "isKey": False
            }
        ],
        "competition_name": "premier-league",
        "team_type": "M"
    }

    found = False
    for idx, m in enumerate(fixtures):
        if m.get("id") == "m12":
            fixtures[idx] = m12_updated
            found = True
            break

    if not found:
        fixtures.append(m12_updated)

    with open("data/fixtures.json", "w", encoding="utf-8") as f:
        json.dump(fixtures, f, indent=2, ensure_ascii=False)

    print("Success: Updated m12 in data/fixtures.json!")

if __name__ == "__main__":
    update_m12()

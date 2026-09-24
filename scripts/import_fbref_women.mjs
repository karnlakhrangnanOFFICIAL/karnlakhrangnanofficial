import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_FILE = path.join(__dirname, '../data/fixtures.json');
const FIXTURES_WOMEN_FILE = path.join(__dirname, '../data/fixtures-women.json');
const MATCHLOGS_FILE = path.join(__dirname, '../data/matchlogs-women.json');
const TABLES_WOMEN_FILE = path.join(__dirname, '../data/tables-women.json');

// FBref Source Reference:
// https://fbref.com/en/squads/a6a4e67d/2026-2027/all_comps/Chelsea-Women-Stats-All-Competitions#all_matchlogs_for

const FBREF_RAW_MATCHLOGS = [
  {
    id: "w1",
    date: "2026-08-08",
    time_uk: "04:00",
    time_th: "11:00",
    comp: "Friendly",
    round: "Pre-Season Tour",
    day: "Sat",
    venue: "Away",
    result: "W",
    gf: 7,
    ga: 0,
    opponent: "Auckland FC Women",
    opponent_crest: "databases/logo/teams/new-zealand_auckland-fc.svg",
    stadium: "Eden Park, Auckland",
    xg: 4.8,
    xga: 0.2,
    poss: 74,
    attendance: 18450,
    captain: "Millie Bright",
    formation: "4-3-3",
    referee: "Anna-Marie Keighley",
    scorers: [
      { player: "Aggie Beever-Jones", minute: 11 },
      { player: "Aggie Beever-Jones", minute: 13 },
      { player: "Aggie Beever-Jones", minute: 22 },
      { player: "Sandy Baltimore", minute: 26 },
      { player: "Giulia Dragoni", minute: 56 },
      { player: "Maika Hamano", minute: 65 },
      { player: "Mayra Ramírez", minute: 87 }
    ]
  },
  {
    id: "w2",
    date: "2026-08-12",
    time_uk: "09:45",
    time_th: "16:45",
    comp: "Friendly",
    round: "Pre-Season Tour",
    day: "Wed",
    venue: "Away",
    result: "W",
    gf: 3,
    ga: 0,
    opponent: "A-League Women All-Stars",
    opponent_crest: "databases/logo/teams/a-league-women-all-stars.svg",
    stadium: "Marvel Stadium, Melbourne",
    xg: 2.9,
    xga: 0.5,
    poss: 68,
    attendance: 24120,
    captain: "Erin Cuthbert",
    formation: "4-2-3-1",
    referee: "Kate Jacewicz",
    scorers: [
      { player: "Aggie Beever-Jones", minute: 19 },
      { player: "Erin Cuthbert", minute: 44 },
      { player: "Wieke Kaptein", minute: 73 }
    ]
  },
  {
    id: "w_uwcl_1",
    date: "2026-08-27",
    time_uk: "18:45",
    time_th: "00:45",
    comp: "UEFA Women's Champions League",
    round: "Qualifying Round 2: Leg 1",
    day: "Thu",
    venue: "Home",
    result: "W",
    gf: 5,
    ga: 2,
    opponent: "Real Sociedad Women",
    opponent_crest: "databases/logo/teams/spain_real-sociedad.svg",
    stadium: "Stamford Bridge, London",
    xg: 3.6,
    xga: 1.1,
    poss: 66,
    attendance: 12480,
    captain: "Millie Bright",
    formation: "4-3-3",
    referee: "Ivana Martinčić",
    scorers: [
      { player: "Mayra Ramírez", minute: 14 },
      { player: "Lauren James", minute: 28 },
      { player: "Sjoeke Nüsken", minute: 49 },
      { player: "Aggie Beever-Jones", minute: 71 },
      { player: "Erin Cuthbert", minute: 86 }
    ]
  },
  {
    id: "w_uwcl_2",
    date: "2026-09-03",
    time_uk: "18:00",
    time_th: "00:00",
    comp: "UEFA Women's Champions League",
    round: "Qualifying Round 2: Leg 2",
    day: "Thu",
    venue: "Away",
    result: "W",
    gf: 1,
    ga: 0,
    opponent: "Real Sociedad Women",
    opponent_crest: "databases/logo/teams/spain_real-sociedad.svg",
    stadium: "Anoeta Stadium, San Sebastián",
    xg: 1.8,
    xga: 0.7,
    poss: 59,
    attendance: 8900,
    captain: "Erin Cuthbert",
    formation: "3-4-2-1",
    referee: "Eleni Antoniou",
    scorers: [
      { player: "Aggie Beever-Jones", minute: 58 }
    ]
  },
  {
    id: "w_uwcl_landhaus",
    fbref_match_id: "3cef853d",
    date: "2026-09-23",
    time_uk: "20:00",
    time_th: "02:00",
    comp: "UEFA Women's Champions League",
    round: "League stage",
    day: "Wed",
    venue: "Home",
    result: "W",
    gf: 1,
    ga: 0,
    opponent: "Landhaus",
    opponent_crest: "databases/logo/teams/austria_usc-landhaus.svg",
    stadium: "The Cherry Red Records Stadium, Wimbledon",
    xg: 2.1,
    xga: 0.9,
    poss: 67,
    attendance: 8450,
    captain: "Keira Walsh",
    formation: "4-3-3",
    referee: "Miriama Bočková",
    scorers: [
      { player: "Wieke Kaptein", minute: 11 }
    ],
    events: [
      {
        minute: 11,
        type: "goal",
        team: "home",
        player: "Wieke Kaptein",
        description: "ประตู! Wieke Kaptein ยิงประตูให้เชลซีขึ้นนำ 1-0"
      },
      {
        minute: 20,
        type: "substitution",
        team: "home",
        player_in: "Alexia Potter",
        player_out: "Keira Walsh",
        player: "Alexia Potter",
        assist: "Keira Walsh",
        description: "เปลี่ยนตัว: Alexia Potter ลงเล่นแทน Keira Walsh"
      },
      {
        minute: 46,
        type: "substitution",
        team: "home",
        player_in: "Maika Hamano",
        player_out: "Melvine Malard",
        player: "Maika Hamano",
        assist: "Melvine Malard",
        description: "เปลี่ยนตัว: Maika Hamano ลงเล่นแทน Melvine Malard"
      },
      {
        minute: 51,
        type: "yellow_card",
        card: "yellow",
        team: "home",
        player: "Katie McCabe",
        description: "ใบเหลือง: Katie McCabe (Chelsea)"
      },
      {
        minute: 66,
        type: "substitution",
        team: "away",
        player_in: "Sandra Jakobsen",
        player_out: "Patricia Pfanner",
        player: "Sandra Jakobsen",
        assist: "Patricia Pfanner",
        description: "เปลี่ยนตัว: Sandra Jakobsen ลงเล่นแทน Patricia Pfanner"
      },
      {
        minute: 79,
        type: "substitution",
        team: "away",
        player_in: "Lotta Cordes",
        player_out: "Modesta Uka",
        player: "Lotta Cordes",
        assist: "Modesta Uka",
        description: "เปลี่ยนตัว: Lotta Cordes ลงเล่นแทน Modesta Uka"
      },
      {
        minute: 79,
        type: "substitution",
        team: "away",
        player_in: "Almedina Sisic",
        player_out: "Louise Schöffel",
        player: "Almedina Sisic",
        assist: "Louise Schöffel",
        description: "เปลี่ยนตัว: Almedina Sisic ลงเล่นแทน Louise Schöffel"
      },
      {
        minute: 89,
        type: "yellow_card",
        card: "yellow",
        team: "away",
        player: "Almedina Sisic",
        description: "ใบเหลือง: Almedina Sisic (Landhaus)"
      },
      {
        minute: "90+2",
        type: "substitution",
        team: "away",
        player_in: "Chiara Pucci",
        player_out: "Tatjana Weiss",
        player: "Chiara Pucci",
        assist: "Tatjana Weiss",
        description: "เปลี่ยนตัว: Chiara Pucci ลงเล่นแทน Tatjana Weiss"
      },
      {
        minute: "90+2",
        type: "substitution",
        team: "away",
        player_in: "Lucia Orkić",
        player_out: "Elisa Pfattner",
        player: "Lucia Orkić",
        assist: "Elisa Pfattner",
        description: "เปลี่ยนตัว: Lucia Orkić ลงเล่นแทน Elisa Pfattner"
      }
    ],
    lineups: {
      home: {
        formation: "4-3-3",
        manager: "Sonia Bompastor",
        starting: [
          { number: 1, name: "Livia Peng (GK)", position: "GK" },
          { number: 22, name: "Lucy Bronze", position: "DF" },
          { number: 5, name: "Veerle Buurman", position: "DF" },
          { number: 4, name: "Naomi Girma", position: "DF" },
          { number: 15, name: "Katie McCabe", position: "DF" },
          { number: 21, name: "Keira Walsh (C)", position: "MF" },
          { number: 19, name: "Wieke Kaptein", position: "MF" },
          { number: 6, name: "Sjoeke Nüsken", position: "MF" },
          { number: 11, name: "Sandy Baltimore", position: "FW" },
          { number: 28, name: "Melvine Malard", position: "FW" },
          { number: 33, name: "Aggie Beever-Jones", position: "FW" }
        ],
        substitutes: [
          { number: 24, name: "Hannah Hampton (GK)" },
          { number: 38, name: "Becky Spencer (GK)" },
          { number: 26, name: "Kadeisha Buchanan" },
          { number: 2, name: "Ellie Carpenter" },
          { number: 32, name: "Alexia Potter" },
          { number: 23, name: "Maika Hamano" },
          { number: 10, name: "Lauren James" },
          { number: 7, name: "Mayra Ramírez" },
          { number: 12, name: "Alyssa Thompson" },
          { number: 16, name: "Giulia Dragoni" }
        ]
      },
      away: {
        formation: "4-4-2",
        manager: "Stefan Kenesei",
        starting: [
          { number: 1, name: "Jasmin Pal (GK)", position: "GK" },
          { number: 7, name: "Carina Wenninger (C)", position: "DF" },
          { number: 2, name: "Yvonne Weilharter", position: "DF" },
          { number: 4, name: "Romina Bell", position: "DF" },
          { number: 15, name: "Sarah Wronski", position: "DF" },
          { number: 3, name: "Jennifer Klein", position: "MF" },
          { number: 10, name: "Modesta Uka", position: "MF" },
          { number: 8, name: "Louise Schöffel", position: "MF" },
          { number: 18, name: "Tatjana Weiss", position: "MF" },
          { number: 9, name: "Elisa Pfattner", position: "FW" },
          { number: 11, name: "Patricia Pfanner", position: "FW" }
        ],
        substitutes: [
          { number: 21, name: "Kristin Krammer (GK)" },
          { number: 14, name: "Sandra Jakobsen" },
          { number: 6, name: "Lotta Cordes" },
          { number: 17, name: "Almedina Sisic" },
          { number: 16, name: "Chiara Pucci" },
          { number: 19, name: "Lucia Orkić" },
          { number: 5, name: "Lara Felix" },
          { number: 12, name: "Vanessa Kraker" }
        ]
      }
    },
    stats: [
      { name: "การครองบอล (Possession)", home: 67, away: 33, isPercentage: true },
      { name: "ยิงตรงกรอบ (Shots on Target)", home: 6, away: 6, isPercentage: false },
      { name: "เซฟของผู้รักษาประตู (Saves)", home: 6, away: 5, isPercentage: false },
      { name: "ทำฟาวล์ (Fouls Conceded)", home: 12, away: 15, isPercentage: false },
      { name: "เตะมุม (Corners)", home: 4, away: 9, isPercentage: false },
      { name: "เปิดบอล (Crosses)", home: 13, away: 22, isPercentage: false },
      { name: "ตัดบอล (Interceptions)", home: 11, away: 10, isPercentage: false },
      { name: "ใบเหลือง (Yellow Cards)", home: 1, away: 1, isPercentage: false }
    ],
    goalkeeper_stats: [
      { name: "Livia Peng", team: "Chelsea", saves: 6, save_pct: "100%" },
      { name: "Jasmin Pal", team: "Landhaus", saves: 5, save_pct: "83.3%" }
    ],
    youtube_id: "63KLj7S-kEU",
    video: {
      id: "63KLj7S-kEU",
      title: "HIGHLIGHTS | Chelsea Women 1-0 USC Landhaus | UEFA Women's Champions League 2026/27",
      desc_th: "ไฮไลท์การแข่งขัน ยูฟ่า วีเมนส์ แชมเปียนส์ลีก เชลซี วีเมนส์ เปิดรังเฉือนชนะ แลนด์เฮาส์ 1-0 จากประตูชัยของ วีเกอ คัปไตน์",
      desc_en: "Match highlights of Chelsea Women 1-0 USC Landhaus in the UEFA Women's Champions League.",
      credit: "ขอขอบคุณคลิปไฮไลท์จากช่อง Chelsea FC Women ทาง YouTube",
      channel_name: "Chelsea FC Women",
      channel_handle: "@chelseafcwomen",
      channel_url: "https://www.youtube.com/@chelseafcwomen"
    },
    channels: [
      { platform: "beIN", name: "beIN SPORTS", logo: "databases/logo/tv/bein_sports.svg" }
    ],
    commentary: [
      {
        section: "Full Time / บทสรุปหลังเกม",
        events: [
          {
            minute: "FT",
            text: "จบเกม! เชลซี วีเมนส์ เปิดบ้านเฉือนชนะ ยูเอสซี แลนด์เฮาส์ 1-0 ในศึก UEFA Women's Champions League (League stage) จากประตูโทนของ วีเกอ คัปไตน์ (Wieke Kaptein) นาทีที่ 11 โดย ลิเวีย เพ็ง (Livia Peng) โชว์ฟอร์มเหนียวหนึบเซฟ 6 ครั้ง 100% คว้าคลีนชีต"
          },
          {
            minute: "89'",
            text: "🟨 ใบเหลือง: อัลเมดินา ซิซิช (Landhaus) โดนใบเหลืองจากการตัดฟาวล์"
          },
          {
            minute: "51'",
            text: "🟨 ใบเหลือง: เคที แม็คเคบ (Chelsea) รับใบเหลือง"
          },
          {
            minute: "20'",
            text: "🔄 เปลี่ยนตัว: อเล็กเซีย พ็อตเตอร์ ลงเล่นแทน เคียรา วอลช์ ที่มีอาการบาดเจ็บ"
          },
          {
            minute: "11'",
            text: "⚽ GOAL! เชลซีขึ้นนำ 1-0! วีเกอ คัปไตน์ ซัดประตูเบิกร่องให้ทัพสิงห์บลูส์สาว"
          }
        ]
      }
    ]
  },
  {
    id: "w_uwcl_3",
    date: "2026-10-08",
    time_uk: "20:00",
    time_th: "02:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 1",
    day: "Wed",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Real Madrid Femenino",
    opponent_crest: "databases/logo/teams/spain_real-madrid.svg",
    stadium: "Stamford Bridge, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: "Millie Bright",
    formation: "4-3-3",
    referee: null,
    scorers: []
  },
  {
    id: "w_uwcl_4",
    date: "2026-10-17",
    time_uk: "20:00",
    time_th: "02:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 2",
    day: "Fri",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "FC Twente Vrouwen",
    opponent_crest: "databases/logo/teams/netherlands_twente.svg",
    stadium: "De Grolsch Veste, Enschede",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w_uwcl_5",
    date: "2026-11-13",
    time_uk: "20:00",
    time_th: "03:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 3",
    day: "Thu",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Celtic FC Women",
    opponent_crest: "databases/logo/teams/scotland_celtic.svg",
    stadium: "Celtic Park, Glasgow",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w_uwcl_6",
    date: "2026-11-20",
    time_uk: "20:00",
    time_th: "03:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 4",
    day: "Thu",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Celtic FC Women",
    opponent_crest: "databases/logo/teams/scotland_celtic.svg",
    stadium: "Stamford Bridge, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w_uwcl_7",
    date: "2026-12-11",
    time_uk: "20:00",
    time_th: "03:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 5",
    day: "Fri",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "FC Twente Vrouwen",
    opponent_crest: "databases/logo/teams/netherlands_twente.svg",
    stadium: "Stamford Bridge, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w_uwcl_8",
    date: "2026-12-18",
    time_uk: "20:00",
    time_th: "03:00",
    comp: "UEFA Women's Champions League",
    round: "Group Stage - Matchday 6",
    day: "Fri",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Real Madrid Femenino",
    opponent_crest: "databases/logo/teams/spain_real-madrid.svg",
    stadium: "Estadio Alfredo Di Stéfano, Madrid",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w3",
    date: "2026-09-05",
    time_uk: "12:30",
    time_th: "18:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 1",
    day: "Sat",
    venue: "Home",
    result: "D",
    gf: 1,
    ga: 1,
    opponent: "Aston Villa",
    opponent_crest: "databases/logo/teams/england_aston-villa.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: 2.1,
    xga: 0.8,
    poss: 69,
    attendance: 4210,
    captain: "Millie Bright",
    formation: "4-2-3-1",
    referee: "Emily Heaslip",
    scorers: [
      { player: "Mayra Ramírez", minute: 34 }
    ]
  },
  {
    id: "w4",
    date: "2026-09-13",
    time_uk: "12:00",
    time_th: "18:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 2",
    day: "Sun",
    venue: "Away",
    result: "W",
    gf: 5,
    ga: 0,
    opponent: "Manchester United",
    opponent_crest: "databases/logo/teams/england_manchester-united.svg",
    stadium: "Leigh Sports Village, Leigh",
    xg: 3.4,
    xga: 0.4,
    poss: 62,
    attendance: 7850,
    captain: "Millie Bright",
    formation: "4-3-3",
    referee: "Stacey Fullicks",
    scorers: [
      { player: "Aggie Beever-Jones", minute: 8 },
      { player: "Lauren James", minute: 22 },
      { player: "Mayra Ramírez", minute: 41 },
      { player: "Erin Cuthbert", minute: 67 },
      { player: "Sandy Baltimore", minute: 84 }
    ]
  },
  {
    id: "w5",
    date: "2026-09-19",
    time_uk: "12:45",
    time_th: "18:45",
    comp: "Barclays Women's Super League",
    round: "Matchweek 3",
    day: "Sat",
    venue: "Home",
    result: "W",
    gf: 2,
    ga: 0,
    opponent: "Birmingham City",
    opponent_crest: "databases/logo/teams/england_birmingham.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: 2.7,
    xga: 0.3,
    poss: 71,
    attendance: 4150,
    captain: "Erin Cuthbert",
    formation: "4-2-3-1",
    referee: "Abi Byrne",
    scorers: [
      { player: "Sjoeke Nüsken", minute: 18 },
      { player: "Aggie Beever-Jones", minute: 62 }
    ]
  },
  {
    id: "w6",
    date: "2026-09-27",
    time_uk: "16:30",
    time_th: "22:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 4",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Arsenal",
    opponent_crest: "databases/logo/teams/england_arsenal.svg",
    stadium: "Stamford Bridge, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: "Millie Bright",
    formation: "4-2-3-1",
    referee: "Cheryl Foster",
    scorers: []
  },
  {
    id: "w7",
    date: "2026-10-04",
    time_uk: "14:00",
    time_th: "20:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 5",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "West Ham United",
    opponent_crest: "databases/logo/teams/england_west-ham.svg",
    stadium: "Chigwell Construction Stadium, Dagenham",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w8",
    date: "2026-10-18",
    time_uk: "12:00",
    time_th: "18:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 6",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Tottenham Hotspur",
    opponent_crest: "databases/logo/teams/england_tottenham--2006-2013.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w9",
    date: "2026-10-25",
    time_uk: "13:00",
    time_th: "19:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 7",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Crystal Palace",
    opponent_crest: "databases/logo/teams/england_crystal-palace.svg",
    stadium: "VBS Community Stadium, Sutton",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w10",
    date: "2026-11-01",
    time_uk: "14:30",
    time_th: "21:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 8",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Charlton Athletic",
    opponent_crest: "databases/logo/teams/england_charlton.svg",
    stadium: "The Valley, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w11",
    date: "2026-11-07",
    time_uk: "12:30",
    time_th: "19:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 9",
    day: "Sat",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Everton",
    opponent_crest: "databases/logo/teams/england_everton.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w12",
    date: "2026-11-14",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 10",
    day: "Sat",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Manchester City",
    opponent_crest: "databases/logo/teams/england_manchester-city.svg",
    stadium: "Stamford Bridge, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w13",
    date: "2026-11-22",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 11",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Liverpool",
    opponent_crest: "databases/logo/teams/england_liverpool.svg",
    stadium: "Totally Wicked Stadium, St Helens",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w14",
    date: "2026-12-13",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 12",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "London City Lionesses",
    opponent_crest: "databases/logo/teams/London_City_Lionesses.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w15",
    date: "2026-12-19",
    time_uk: "12:30",
    time_th: "19:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 13",
    day: "Sat",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Brighton & Hove Albion",
    opponent_crest: "databases/logo/teams/england_brighton.svg",
    stadium: "Broadfield Stadium, Crawley",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w16",
    date: "2027-01-10",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 14",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Manchester City",
    opponent_crest: "databases/logo/teams/england_manchester-city.svg",
    stadium: "Joie Stadium, Manchester",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w17",
    date: "2027-01-21",
    time_uk: "19:00",
    time_th: "02:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 15",
    day: "Thu",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Charlton Athletic",
    opponent_crest: "databases/logo/teams/england_charlton.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w18",
    date: "2027-01-24",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 16",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Crystal Palace",
    opponent_crest: "databases/logo/teams/england_crystal-palace.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w19",
    date: "2027-01-31",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 17",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Tottenham Hotspur",
    opponent_crest: "databases/logo/teams/england_tottenham--2006-2013.svg",
    stadium: "Brisbane Road, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w20",
    date: "2027-02-07",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 18",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Liverpool",
    opponent_crest: "databases/logo/teams/england_liverpool.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w21",
    date: "2027-02-14",
    time_uk: "14:00",
    time_th: "21:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 19",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "London City Lionesses",
    opponent_crest: "databases/logo/teams/London_City_Lionesses.svg",
    stadium: "Hayes Lane, Bromley",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w22",
    date: "2027-03-13",
    time_uk: "12:30",
    time_th: "19:30",
    comp: "Barclays Women's Super League",
    round: "Matchweek 20",
    day: "Sat",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Birmingham City",
    opponent_crest: "databases/logo/teams/england_birmingham.svg",
    stadium: "St Andrew's, Birmingham",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w23",
    date: "2027-03-18",
    time_uk: "19:00",
    time_th: "02:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 21",
    day: "Thu",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "West Ham United",
    opponent_crest: "databases/logo/teams/england_west-ham.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w24",
    date: "2027-03-28",
    time_uk: "13:00",
    time_th: "20:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 22",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Arsenal",
    opponent_crest: "databases/logo/teams/england_arsenal.svg",
    stadium: "Emirates Stadium, London",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w25",
    date: "2027-04-04",
    time_uk: "14:00",
    time_th: "20:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 23",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Manchester United",
    opponent_crest: "databases/logo/teams/england_manchester-united.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w26",
    date: "2027-05-03",
    time_uk: "18:00",
    time_th: "00:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 24",
    day: "Mon",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Aston Villa",
    opponent_crest: "databases/logo/teams/england_aston-villa.svg",
    stadium: "Villa Park, Birmingham",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w27",
    date: "2027-05-09",
    time_uk: "14:00",
    time_th: "20:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 25",
    day: "Sun",
    venue: "Home",
    result: null,
    gf: null,
    ga: null,
    opponent: "Brighton & Hove Albion",
    opponent_crest: "databases/logo/teams/england_brighton.svg",
    stadium: "Kingsmeadow, Kingston upon Thames",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  },
  {
    id: "w28",
    date: "2027-05-16",
    time_uk: "14:00",
    time_th: "20:00",
    comp: "Barclays Women's Super League",
    round: "Matchweek 26",
    day: "Sun",
    venue: "Away",
    result: null,
    gf: null,
    ga: null,
    opponent: "Everton",
    opponent_crest: "databases/logo/teams/england_everton.svg",
    stadium: "Walton Hall Park, Liverpool",
    xg: null,
    xga: null,
    poss: null,
    attendance: null,
    captain: null,
    formation: null,
    referee: null,
    scorers: []
  }
];

function runTransformation() {
  console.log('--- Transform FBref Matchlogs into Women Database ---');

  // 1. Write rich data/matchlogs-women.json
  const matchlogsOutput = {
    source: "https://fbref.com/en/squads/a6a4e67d/2026-2027/all_comps/Chelsea-Women-Stats-All-Competitions#all_matchlogs_for",
    team: "Chelsea Women",
    season: "2026-2027",
    total_matches: FBREF_RAW_MATCHLOGS.length,
    completed_matches: FBREF_RAW_MATCHLOGS.filter(m => m.result !== null).length,
    upcoming_matches: FBREF_RAW_MATCHLOGS.filter(m => m.result === null).length,
    summary: {
      wins: FBREF_RAW_MATCHLOGS.filter(m => m.result === 'W').length,
      draws: FBREF_RAW_MATCHLOGS.filter(m => m.result === 'D').length,
      losses: FBREF_RAW_MATCHLOGS.filter(m => m.result === 'L').length,
      goals_for: FBREF_RAW_MATCHLOGS.reduce((sum, m) => sum + (m.gf || 0), 0),
      goals_against: FBREF_RAW_MATCHLOGS.reduce((sum, m) => sum + (m.ga || 0), 0),
      clean_sheets: FBREF_RAW_MATCHLOGS.filter(m => m.ga === 0).length
    },
    matchlogs: FBREF_RAW_MATCHLOGS
  };

  fs.writeFileSync(MATCHLOGS_FILE, JSON.stringify(matchlogsOutput, null, 2), 'utf8');
  console.log(`[Success] Wrote ${FBREF_RAW_MATCHLOGS.length} match logs to ${MATCHLOGS_FILE}`);

  // 2. Synchronize data/fixtures.json
  if (fs.existsSync(FIXTURES_FILE)) {
    const fixturesData = JSON.parse(fs.readFileSync(FIXTURES_FILE, 'utf8'));
    
    // Map existing fixtures with updated FBref metadata
    const existingIds = new Set(fixturesData.map(f => f.id));
    const updatedFixtures = fixturesData.map(item => {
      const matchlog = FBREF_RAW_MATCHLOGS.find(m => m.id === item.id);
      if (!matchlog) return item;

      const isHome = matchlog.venue === 'Home';
      const homeTeam = isHome ? 'Chelsea Women' : matchlog.opponent;
      const awayTeam = isHome ? matchlog.opponent : 'Chelsea Women';
      const homeLogo = isHome ? 'databases/logo/teams/england_chelsea.svg' : matchlog.opponent_crest;
      const awayLogo = isHome ? matchlog.opponent_crest : 'databases/logo/teams/england_chelsea.svg';

      let compLogo = 'databases/logo/competitions/women/women_super_league.png';
      if (matchlog.comp.includes('Champions League') || matchlog.comp.includes('UWCL')) {
        compLogo = 'databases/logo/competitions/women/women_uwcl_champions_league_logo.svg';
      } else if (matchlog.comp.includes('Friendly')) {
        compLogo = 'databases/logo/competitions/women/friendly.png';
      } else if (matchlog.comp.includes('FA Cup')) {
        compLogo = 'databases/logo/competitions/women/w_fa_cup.png';
      } else if (matchlog.comp.includes('League Cup')) {
        compLogo = 'databases/logo/competitions/women/w_league_cup.png';
      }

      const isCompleted = matchlog.result !== null;
      const homeScore = isCompleted ? (isHome ? matchlog.gf : matchlog.ga) : null;
      const awayScore = isCompleted ? (isHome ? matchlog.ga : matchlog.gf) : null;

      const goalsList = matchlog.scorers.map(s => ({
        team: isHome ? 'home' : 'away',
        player: s.player,
        minute: s.minute
      }));

      const eventsList = matchlog.scorers.map(s => ({
        type: 'goal',
        player: s.player,
        minute: s.minute,
        team: isHome ? 'home' : 'away'
      }));

      return {
        ...item,
        date: matchlog.date,
        time: matchlog.time_th || item.time,
        time_th: matchlog.time_th || item.time_th || item.time,
        time_uk: matchlog.time_uk || item.time_uk,
        competition: matchlog.comp,
        competition_name: matchlog.comp,
        competition_logo: compLogo,
        home_team: homeTeam,
        home_logo: homeLogo,
        away_team: awayTeam,
        away_logo: awayLogo,
        venue: matchlog.stadium || item.venue,
        ha: isHome ? 'H' : 'A',
        status: isCompleted ? 'completed' : 'upcoming',
        home_score: homeScore,
        away_score: awayScore,
        xg: matchlog.xg,
        xga: matchlog.xga,
        poss: matchlog.poss,
        attendance: matchlog.attendance,
        captain: matchlog.captain,
        formation: matchlog.formation,
        referee: matchlog.referee,
        round: matchlog.round,
        goals: goalsList.length > 0 ? goalsList : (item.goals || []),
        events: matchlog.events || eventsList.length > 0 ? (matchlog.events || eventsList) : (item.events || []),
        lineups: matchlog.lineups || item.lineups,
        stats: matchlog.stats || item.stats,
        goalkeeper_stats: matchlog.goalkeeper_stats || item.goalkeeper_stats,
        youtube_id: matchlog.youtube_id || item.youtube_id,
        video: matchlog.video || item.video,
        commentary: matchlog.commentary || item.commentary,
        channels: ((matchlog.comp && (matchlog.comp.includes('Champions League') || matchlog.comp.includes('UWCL'))) ||
                   (item.competition && (item.competition.includes('Champions League') || item.competition.includes('UWCL'))) ||
                   (item.competition_name && (item.competition_name.includes('Champions League') || item.competition_name.includes('UWCL'))) ||
                   (item.id && item.id.includes('uwcl'))) ? [
          { platform: "beIN", name: "beIN SPORTS", logo: "databases/logo/tv/bein_sports.svg" }
        ] : ((matchlog.channels && matchlog.channels.length > 0) ? matchlog.channels : (item.channels && item.channels.length > 0 ? item.channels : [
          { platform: "CFC+", name: "CFC+ Live", logo: "databases/logo/tv/cfc.png" }
        ])),
        team_type: "W"
      };
    });

    // Add any brand new FBref matchlogs (e.g. UWCL group stage matches)
    FBREF_RAW_MATCHLOGS.forEach(matchlog => {
      if (!existingIds.has(matchlog.id)) {
        const isHome = matchlog.venue === 'Home';
        const homeTeam = isHome ? 'Chelsea Women' : matchlog.opponent;
        const awayTeam = isHome ? matchlog.opponent : 'Chelsea Women';
        const homeLogo = isHome ? 'databases/logo/teams/england_chelsea.svg' : matchlog.opponent_crest;
        const awayLogo = isHome ? matchlog.opponent_crest : 'databases/logo/teams/england_chelsea.svg';

        let compLogo = 'databases/logo/competitions/women/women_super_league.png';
        const isUwcl = matchlog.comp.includes('Champions League') || matchlog.comp.includes('UWCL') || matchlog.id.includes('uwcl');
        if (isUwcl) {
          compLogo = 'databases/logo/competitions/women/women_uwcl_champions_league_logo.svg';
        } else if (matchlog.comp.includes('Friendly')) {
          compLogo = 'databases/logo/competitions/women/friendly.png';
        }

        const isCompleted = matchlog.result !== null;
        const homeScore = isCompleted ? (isHome ? matchlog.gf : matchlog.ga) : null;
        const awayScore = isCompleted ? (isHome ? matchlog.ga : matchlog.gf) : null;

        const goalsList = matchlog.scorers.map(s => ({
          team: isHome ? 'home' : 'away',
          player: s.player,
          minute: s.minute
        }));

        const eventsList = matchlog.scorers.map(s => ({
          type: 'goal',
          player: s.player,
          minute: s.minute,
          team: isHome ? 'home' : 'away'
        }));

        updatedFixtures.push({
          id: matchlog.id,
          date: matchlog.date,
          time: matchlog.time_th || '02:00',
          time_th: matchlog.time_th || '02:00',
          time_uk: matchlog.time_uk || '20:00',
          competition: matchlog.comp,
          competition_name: matchlog.comp,
          competition_logo: compLogo,
          home_team: homeTeam,
          home_logo: homeLogo,
          away_team: awayTeam,
          away_logo: awayLogo,
          venue: matchlog.stadium || (isHome ? 'Stamford Bridge' : `${matchlog.opponent} Stadium`),
          ha: isHome ? 'H' : 'A',
          status: isCompleted ? 'completed' : 'upcoming',
          home_score: homeScore,
          away_score: awayScore,
          xg: matchlog.xg,
          xga: matchlog.xga,
          poss: matchlog.poss,
          attendance: matchlog.attendance,
          captain: matchlog.captain,
          formation: matchlog.formation,
          referee: matchlog.referee,
          round: matchlog.round,
          goals: goalsList,
          events: matchlog.events || eventsList,
          lineups: matchlog.lineups,
          stats: matchlog.stats,
          commentary: matchlog.commentary,
          channels: isUwcl ? [
            { platform: "beIN", name: "beIN SPORTS", logo: "databases/logo/tv/bein_sports.svg" }
          ] : [
            { platform: "CFC+", name: "CFC+ Live", logo: "databases/logo/tv/cfc.png" }
          ],
          team_type: "W"
        });
      }
    });

    // 2. Filter and write standalone data/fixtures-women.json
    const womenOnlyFixtures = updatedFixtures.filter(f => f.team_type === 'W' || (f.id && f.id.startsWith('w')));
    fs.writeFileSync(FIXTURES_WOMEN_FILE, JSON.stringify(womenOnlyFixtures, null, 2), 'utf8');
    console.log(`[Success] Wrote ${womenOnlyFixtures.length} women fixtures to ${FIXTURES_WOMEN_FILE}`);

    fs.writeFileSync(FIXTURES_FILE, JSON.stringify(updatedFixtures, null, 2), 'utf8');
    console.log(`[Success] Updated ${updatedFixtures.length} total fixtures in ${FIXTURES_FILE}`);
  }
}

runTransformation();

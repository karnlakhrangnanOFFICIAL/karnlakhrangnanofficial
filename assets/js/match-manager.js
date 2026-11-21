const COMPETITION_META = {
  'premier-league': {
    label: 'Premier League',
    logo: 'databases/logo/competitions/men/premier-league.png',
    teamType: 'M',
  },
  'fa-cup': {
    label: 'FA Cup',
    logo: 'databases/logo/competitions/men/england_emirates-fa-cup.svg',
    teamType: 'M',
  },
  'league-cup': {
    label: 'Carabao Cup',
    logo: 'databases/logo/competitions/men/england_efl-cup.svg',
    teamType: 'M',
  },
  'champions-league': {
    label: 'UEFA Champions League',
    logo: 'databases/logo/competitions/men/tournaments_uefa-champions-league.svg',
    teamType: 'M',
  },
  "Barclays Women's Super League": {
    label: "Barclays Women's Super League",
    logo: 'databases/logo/competitions/women/women_super_league.png',
    teamType: 'W',
  },
  "UEFA Women's Champions League": {
    label: "UEFA Women's Champions League",
    logo: 'databases/logo/competitions/women/women_uwcl_champions_league_logo.svg',
    teamType: 'W',
  },
  "Women's FA Cup": {
    label: "Women's FA Cup",
    logo: 'databases/logo/competitions/women/w_fa_cup.png',
    teamType: 'W',
  },
  "Women's League Cup": {
    label: "Women's League Cup",
    logo: 'databases/logo/competitions/women/w_league_cup.png',
    teamType: 'W',
  },
  Friendly: {
    label: 'Friendly',
    logo: 'databases/logo/competitions/women/friendly.png',
    teamType: 'M',
  },
  'club-world-cup': {
    label: 'FIFA Club World Cup',
    logo: 'databases/logo/competitions/men/tournaments_uefa-champions-league.svg',
    teamType: 'M',
  },
};

const KNOWN_CHANNELS = [
  { platform: 'www.monomax.me', name: 'MONOMAX SPORTS TV', logo: 'databases/logo/tv/monomax.svg' },
  { platform: 'CFC+', name: 'CFC+ Live', logo: 'databases/logo/tv/cfc.png' },
  { platform: 'beIN', name: 'beIN SPORTS', logo: 'databases/logo/tv/bein_sports.svg' },
  { platform: 'Sky Sports', name: 'Sky Sports', logo: 'databases/logo/tv/sky_sports.svg' },
  { platform: 'BBC', name: 'BBC', logo: 'databases/logo/tv/bbc.svg' },
  { platform: 'DAZN', name: "DAZN Women's Football", logo: 'databases/logo/tv/dazn.svg' },
  { platform: 'Disney+', name: 'Disney+', logo: 'databases/logo/tv/disney+.svg' },
];

const THEMES = [
  { id: 'editorial', icon: '📰', label: 'Editorial' },
  { id: 'classic-blue', icon: '🔵', label: 'Classic Blue' },
  { id: 'modern-dark', icon: '🌙', label: 'Modern Dark' },
];

const I18N = {
  th: {
    loading: 'กำลังโหลด...',
    saving: 'กำลังอัปโหลดข้อมูล...',
    deleting: 'กำลังลบข้อมูล...',
    creatingTitle: 'เพิ่มข้อมูลแมตช์ใหม่',
    editingTitle: (id) => `แก้ไขแมตช์ #${id}`,
    creatingMeta: 'กรอกโปรแกรมการแข่งขันหรือบันทึกผลการแข่งขัน',
    editingMeta: (date, comp) => `${date} · ${comp}`,
    savedDisk: 'บันทึกข้อมูลลงฐานข้อมูลกลาง Firestore เรียบร้อยแล้ว (ทุกคนเห็นทันที)',
    savedDraft: 'กรุณาเข้าสู่ระบบด้วยบัญชีแอดมินก่อนบันทึกข้อมูล',
    deletedOk: 'ลบข้อมูลแมตช์ออกจากฐานข้อมูลกลางเรียบร้อยแล้ว',
    validationError: 'กรุณากรอกวันที่ รายการแข่งขัน ทีมเหย้า และทีมเยือนให้ครบถ้วน',
    invalidDateError: 'กรุณาระบุวันที่แข่งขันในรูปแบบ ปี-เดือน-วัน (YYYY-MM-DD) เช่น 2026-11-15',
    emptyList: 'ไม่พบแมตช์ที่ตรงกับตัวกรอง',
    emptySub: 'ลองปรับตัวกรองในหน้าต่างเมนู หรือกดปุ่มสร้างแมตช์ใหม่',
    createNow: '+ สร้างแมตช์ใหม่',
    statusUpcoming: 'โปรแกรมแข่ง',
    statusCompleted: 'จบเกมแล้ว',
    statusLive: 'กำลังแข่ง',
    enterResult: 'กรอกผลแข่ง',
    editBtn: 'แก้ไข',
    selectInModal: 'เลือกแก้ไข',
    itemsCount: (n) => `${n} รายการ`,
    dbConnected: 'เชื่อมต่อ Firestore ออนไลน์ (Real-time)',
    dbReadOnly: 'โหมดดูข้อมูล (รอแอดมินเข้าสู่ระบบ)',
    authChecking: 'กำลังตรวจสอบสิทธิ์...',
    authGuestChip: 'ยังไม่ได้เข้าสู่ระบบ',
    authAdminChip: (email) => `แอดมิน: ${email}`,
    authDeniedChip: (email) => `ไม่มีสิทธิ์: ${email}`,
    authSignInBtn: 'เข้าสู่ระบบแอดมิน (Google)',
    authSignOutBtn: 'ออกจากระบบ',
    authSwitchBtn: 'สลับบัญชี',
    authLockedTitle: 'โหมดดูข้อมูล (กรุณายืนยันตัวตนแอดมินเพื่อบันทึกออนไลน์)',
    authLockedDesc: 'เข้าสู่ระบบด้วย Google บัญชีแอดมิน (kaebmoopingkai3737@gmail.com) เพื่อเพิ่ม แก้ไข หรือลบข้อมูลลงฐานข้อมูลกลาง Firestore ให้ทุกคนเห็นทันที',
    authDeniedTitle: (email) => `บัญชี ${email} ไม่มีสิทธิ์แอดมินในการแก้ไขฐานข้อมูล`,
    authDeniedDesc: 'กรุณากดสลับบัญชีแล้วเข้าสู่ระบบด้วยบัญชีแอดมิน (kaebmoopingkai3737@gmail.com)',
    authAdminTitle: (email) => `ยืนยันสิทธิ์แอดมินแล้ว (${email})`,
    authAdminDesc: 'ทุกการเพิ่ม แก้ไข หรือลบจะบันทึกลงฐานข้อมูลกลาง Firestore และอัปเดตให้ทุกคนเห็นทันที',
    authRequiredToast: 'กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน (kaebmoopingkai3737@gmail.com) ก่อนแก้ไขข้อมูล',
    authSignInSuccess: (email) => `เข้าสู่ระบบแอดมิน ${email} สำเร็จ`,
    authSignInDenied: (email) => `บัญชี ${email} ไม่ได้รับอนุญาตให้แก้ไขฐานข้อมูล`,
    authPopupBlockedTitle: 'หน้าต่าง Pop-up เข้าสู่ระบบ Google ถูกบล็อก (auth/popup-blocked)',
    authPopupBlockedDesc: 'กรุณากดอนุญาต Pop-up ที่ไอคอนแถบ Address Bar ของเบราว์เซอร์ หรือกดปุ่ม "เปิดในแท็บใหม่เพื่อล็อกอิน ↗" ด้านขวาเพื่อเข้าสู่ระบบนอกกรอบ Preview',
    authPopupBlockedToast: 'Pop-up ถูกบล็อก: กรุณาอนุญาต Pop-up หรือกด "เปิดในแท็บใหม่เพื่อล็อกอิน ↗"',
    allSeasons: 'ทุกฤดูกาล (All)',
    allComps: 'ทุกรายการแข่งขัน',
    copiedJson: 'คัดลอก JSON ไปยังคลิปบอร์ดแล้ว',
    searchPlaceholder: 'ค้นหาทีม, สนาม, ผู้ทำประตู, รหัส...',
    goalPlayerPlaceholder: 'ชื่อผู้ทำประตู',
    goalMinutePlaceholder: 'นาที เช่น 45+2',
    goalNormal: 'ประตูทั่วไป',
    goalPenalty: 'จุดโทษ (Pen)',
    goalOwn: 'ทำเข้าประตูตัวเอง (OG)',
    homeSide: 'เจ้าบ้าน',
    awaySide: 'ทีมเยือน',
    noGoals: 'ยังไม่มีรายชื่อผู้ทำประตู — กด "+ เพิ่มผู้ทำประตู" เพื่อระบุ',
    lineupColNum: 'เบอร์',
    lineupColPlayer: 'ชื่อนักเตะ',
    lineupColPos: 'ตำแหน่ง',
    lineupColCap: 'กัปตัน',
    lineupColOps: 'ลำดับ',
    lineupNoStarters: 'ยังไม่มีรายชื่อ 11 ตัวจริง — กด "จัด 11 ตำแหน่งตามแผน" หรือ "+ เพิ่มตัวจริง"',
    lineupNoSubs: 'ยังไม่มีรายชื่อตัวสำรอง',
    lineupQuickAddPlaceholder: (team) => `+ เลือกนักเตะ ${team} ใส่ในตำแหน่งถัดไป...`,
    lineupPreviewEmpty: 'เพิ่มรายชื่อตัวจริงอย่างน้อย 1 คนเพื่อดูพรีวิวผังสนาม Tactical Line-up',
    lineupShowPreview: 'แสดงพรีวิว',
    lineupHidePreview: 'ซ่อนพรีวิว',
    lineupCopiedLatest: (team) => `คัดลอก Line-up ล่าสุดของ ${team} เรียบร้อยแล้ว`,
    lineupNoLatestFound: 'ยังไม่พบข้อมูล Line-up ก่อนหน้าของทีมนี้ในฐานข้อมูล',
    lineupCleared: 'ล้างข้อมูล Line-up แล้ว',
    lineupAutoFilled: (team) => `เติมรายชื่อ 11 ตัวจริงและตัวสำรองของ ${team} ตามแผนแล้ว`,
    lineupNoChelseaPool: 'ยังไม่พบคลังนักเตะของทีมนี้สำหรับจัดทีมอัตโนมัติ',
    lineupSquadFullAddedSub: 'ตัวจริงครบ 11 คนแล้ว เพิ่มเข้าชื่อตัวสำรองแทน',
  },
  en: {
    loading: 'Loading...',
    saving: 'Saving to Firestore...',
    deleting: 'Deleting from Firestore...',
    creatingTitle: 'Create New Match Entry',
    editingTitle: (id) => `Edit Match #${id}`,
    creatingMeta: 'Enter upcoming fixture or completed match result',
    editingMeta: (date, comp) => `${date} · ${comp}`,
    savedDisk: 'Match saved directly to central Firestore database (live for all visitors).',
    savedDraft: 'Admin Google Sign-In is required before saving changes.',
    deletedOk: 'Match deleted from central Firestore database.',
    validationError: 'Please fill in Date, Competition, Home Team, and Away Team.',
    invalidDateError: 'Please enter a valid date in YYYY-MM-DD format (e.g. 2026-11-15).',
    emptyList: 'No matches match the current filters',
    emptySub: 'Adjust filters in the menu window or create a new match.',
    createNow: '+ Create New Match',
    statusUpcoming: 'Upcoming',
    statusCompleted: 'Completed',
    statusLive: 'Live',
    enterResult: 'Enter Result',
    editBtn: 'Edit',
    selectInModal: 'Select',
    itemsCount: (n) => `${n} matches`,
    dbConnected: 'Firestore Connected (Real-time)',
    dbReadOnly: 'Read-only (Admin Sign-In required)',
    authChecking: 'Checking auth...',
    authGuestChip: 'Not signed in',
    authAdminChip: (email) => `Admin: ${email}`,
    authDeniedChip: (email) => `No access: ${email}`,
    authSignInBtn: 'Admin Sign In (Google)',
    authSignOutBtn: 'Sign Out',
    authSwitchBtn: 'Switch Account',
    authLockedTitle: 'Read-Only Preview (Admin Google Sign-In required to save)',
    authLockedDesc: 'Sign in with your authorized Admin Google account (kaebmoopingkai3737@gmail.com) to publish changes live to Firestore for all visitors.',
    authDeniedTitle: (email) => `Account ${email} does not have admin permission`,
    authDeniedDesc: 'Please switch accounts and sign in with the authorized admin account (kaebmoopingkai3737@gmail.com).',
    authAdminTitle: (email) => `Verified Admin Signed In (${email})`,
    authAdminDesc: 'All additions, edits, and deletions are saved directly to central Firestore and synced live for everyone.',
    authRequiredToast: 'Please sign in with the admin Google account (kaebmoopingkai3737@gmail.com) first.',
    authSignInSuccess: (email) => `Signed in as admin ${email}`,
    authSignInDenied: (email) => `Account ${email} is not authorized to edit the database.`,
    authPopupBlockedTitle: 'Google Sign-In Pop-up Was Blocked (auth/popup-blocked)',
    authPopupBlockedDesc: 'Please allow pop-ups in your browser address bar or click "Open in New Tab to Sign In ↗" to sign in outside the preview frame.',
    authPopupBlockedToast: 'Pop-up blocked: allow pop-ups or click "Open in New Tab to Sign In ↗".',
    allSeasons: 'All Seasons',
    allComps: 'All Competitions',
    copiedJson: 'JSON copied to clipboard.',
    searchPlaceholder: 'Search team, venue, scorer, ID...',
    goalPlayerPlaceholder: 'Scorer name',
    goalMinutePlaceholder: 'Min e.g. 45+2',
    goalNormal: 'Goal',
    goalPenalty: 'Penalty',
    goalOwn: 'Own Goal',
    homeSide: 'Home',
    awaySide: 'Away',
    noGoals: 'No goals recorded yet — click "+ Add Goal" to add scorers.',
    lineupColNum: 'No.',
    lineupColPlayer: 'Player Name',
    lineupColPos: 'Pos',
    lineupColCap: 'Cap',
    lineupColOps: 'Order',
    lineupNoStarters: 'No starting XI yet — click "Init 11 Slots" or "+ Add Starter".',
    lineupNoSubs: 'No substitutes listed yet.',
    lineupQuickAddPlaceholder: (team) => `+ Quick-add ${team} player...`,
    lineupPreviewEmpty: 'Add at least 1 starting player to see the live Tactical Line-up preview.',
    lineupShowPreview: 'Show Preview',
    lineupHidePreview: 'Hide Preview',
    lineupCopiedLatest: (team) => `Copied latest saved line-up for ${team}.`,
    lineupNoLatestFound: 'No previous saved line-up found for this team.',
    lineupCleared: 'Line-up cleared.',
    lineupAutoFilled: (team) => `Auto-filled ${team} XI and substitutes for the selected formation.`,
    lineupNoChelseaPool: 'Squad database is not available for this team yet.',
    lineupSquadFullAddedSub: 'Starting XI has 11 players; added to substitutes instead.',
  },
};

const DRAFT_STORAGE_KEY = 'klkn_match_manager_drafts_v1';

const state = {
  lang: localStorage.getItem('lang') === 'en' ? 'en' : 'th',
  theme: localStorage.getItem('theme') || localStorage.getItem('chelsea_theme') || 'editorial',
  matches: [],
  clubs: [],
  playersMen: [],
  playersWomen: [],
  womenSquads: [],
  seasons: ['2026/27'],
  competitions: [],
  editingId: null,
  selectedChannels: new Set(['MONOMAX SPORTS TV']),
  goals: [],
  activeLineupSide: 'home',
  lineupPreviewVisible: true,
  hadLineupsOnLoad: false,
  lineupClearedExplicitly: false,
  lineups: {
    home: { manager: '', formation: '4-2-3-1', starting: [], substitutes: [] },
    away: { manager: '', formation: '4-2-3-1', starting: [], substitutes: [] },
  },
  filters: {
    status: 'all',
    team: 'all',
    season: '2026/27',
    competition: 'all',
    month: 'all',
    ha: 'all',
    outcome: 'all',
    dateFrom: '',
    dateTo: '',
    search: '',
    sort: 'date_desc',
  },
  modalFilters: null,
  readOnlyMode: true,
  lastTimeSource: 'th',
  authReady: false,
  authUser: null,
  isAdmin: false,
  popupBlocked: false,
  baseMatches: [],
  cloudMatches: [],
  allMergedMatches: [],
  baseCatalogLoaded: false,
};

const el = {
  adminAuthChip: document.getElementById('adminAuthChip'),
  adminAuthLabel: document.getElementById('adminAuthLabel'),
  adminAuthBtn: document.getElementById('adminAuthBtn'),
  adminAuthBanner: document.getElementById('adminAuthBanner'),
  adminBannerTitle: document.getElementById('adminBannerTitle'),
  adminBannerDesc: document.getElementById('adminBannerDesc'),
  bannerSignInBtn: document.getElementById('bannerSignInBtn'),
  bannerOpenTabLink: document.getElementById('bannerOpenTabLink'),
  langToggleBtn: document.getElementById('langToggleBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  themeLabel: document.getElementById('themeLabel'),
  topNewMatchBtn: document.getElementById('topNewMatchBtn'),
  openFilterMenuBtn: document.getElementById('openFilterMenuBtn'),
  openJsonModalBtn: document.getElementById('openJsonModalBtn'),

  statTotal: document.getElementById('statTotal'),
  statSeasonNote: document.getElementById('statSeasonNote'),
  statUpcoming: document.getElementById('statUpcoming'),
  statCompleted: document.getElementById('statCompleted'),
  statSplit: document.getElementById('statSplit'),
  statStorageNote: document.getElementById('statStorageNote'),

  quickSearchInput: document.getElementById('quickSearchInput'),
  activeFilterSummary: document.getElementById('activeFilterSummary'),
  listCountLabel: document.getElementById('listCountLabel'),
  matchListContainer: document.getElementById('matchListContainer'),

  formHeading: document.getElementById('formHeading'),
  formSubMeta: document.getElementById('formSubMeta'),
  previewDetailLink: document.getElementById('previewDetailLink'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  clearFormBtn: document.getElementById('clearFormBtn'),
  matchEntryForm: document.getElementById('matchEntryForm'),
  saveMatchBtn: document.getElementById('saveMatchBtn'),

  fieldStatus: document.getElementById('fieldStatus'),
  fieldTeamType: document.getElementById('fieldTeamType'),
  fieldId: document.getElementById('fieldId'),
  fieldCompetition: document.getElementById('fieldCompetition'),
  competitionPicker: document.getElementById('competitionPicker'),
  competitionPickerBtn: document.getElementById('competitionPickerBtn'),
  competitionPickerLogo: document.getElementById('competitionPickerLogo'),
  competitionPickerLabel: document.getElementById('competitionPickerLabel'),
  competitionPickerMenu: document.getElementById('competitionPickerMenu'),
  customCompWrap: document.getElementById('customCompWrap'),
  fieldCustomCompetition: document.getElementById('fieldCustomCompetition'),
  fieldRound: document.getElementById('fieldRound'),
  fieldDate: document.getElementById('fieldDate'),
  fieldDatePicker: document.getElementById('fieldDatePicker'),
  openDatePickerBtn: document.getElementById('openDatePickerBtn'),
  fieldTimeTh: document.getElementById('fieldTimeTh'),
  fieldTimeUk: document.getElementById('fieldTimeUk'),
  fieldTimeThCustom: document.getElementById('fieldTimeThCustom'),
  fieldTimeUkCustom: document.getElementById('fieldTimeUkCustom'),
  dateTimezoneNote: document.getElementById('dateTimezoneNote'),
  timeThHint: document.getElementById('timeThHint'),
  timeUkHint: document.getElementById('timeUkHint'),
  fieldVenue: document.getElementById('fieldVenue'),
  fieldHomeTeam: document.getElementById('fieldHomeTeam'),
  fieldAwayTeam: document.getElementById('fieldAwayTeam'),
  fieldHomeLogo: document.getElementById('fieldHomeLogo'),
  fieldAwayLogo: document.getElementById('fieldAwayLogo'),
  homeLogoPreview: document.getElementById('homeLogoPreview'),
  awayLogoPreview: document.getElementById('awayLogoPreview'),

  presetChelseaHomeBtn: document.getElementById('presetChelseaHomeBtn'),
  presetChelseaAwayBtn: document.getElementById('presetChelseaAwayBtn'),
  swapTeamsBtn: document.getElementById('swapTeamsBtn'),

  scoreSection: document.getElementById('scoreSection'),
  scoreboardHomeLogo: document.getElementById('scoreboardHomeLogo'),
  scoreboardAwayLogo: document.getElementById('scoreboardAwayLogo'),
  scoreboardHomeName: document.getElementById('scoreboardHomeName'),
  scoreboardAwayName: document.getElementById('scoreboardAwayName'),
  fieldHomeScore: document.getElementById('fieldHomeScore'),
  fieldAwayScore: document.getElementById('fieldAwayScore'),
  addGoalBtn: document.getElementById('addGoalBtn'),
  goalsListContainer: document.getElementById('goalsListContainer'),

  channelsGrid: document.getElementById('channelsGrid'),

  lineupSideTabs: document.getElementById('lineupSideTabs'),
  lineupTabHomeLogo: document.getElementById('lineupTabHomeLogo'),
  lineupTabHomeName: document.getElementById('lineupTabHomeName'),
  lineupTabHomeCount: document.getElementById('lineupTabHomeCount'),
  lineupTabAwayLogo: document.getElementById('lineupTabAwayLogo'),
  lineupTabAwayName: document.getElementById('lineupTabAwayName'),
  lineupTabAwayCount: document.getElementById('lineupTabAwayCount'),
  lineupFormationSelect: document.getElementById('lineupFormationSelect'),
  lineupFormationCustom: document.getElementById('lineupFormationCustom'),
  lineupManagerInput: document.getElementById('lineupManagerInput'),
  lineupInitSlotsBtn: document.getElementById('lineupInitSlotsBtn'),
  lineupAutoChelseaBtn: document.getElementById('lineupAutoChelseaBtn'),
  lineupChelseaQuickWrap: document.getElementById('lineupChelseaQuickWrap'),
  lineupChelseaQuickSelect: document.getElementById('lineupChelseaQuickSelect'),
  lineupAddStarterBtn: document.getElementById('lineupAddStarterBtn'),
  lineupAddSubBtn: document.getElementById('lineupAddSubBtn'),
  lineupStartingContainer: document.getElementById('lineupStartingContainer'),
  lineupSubsContainer: document.getElementById('lineupSubsContainer'),
  lineupCopyLatestBtn: document.getElementById('lineupCopyLatestBtn'),
  lineupClearBtn: document.getElementById('lineupClearBtn'),
  lineupTogglePreviewBtn: document.getElementById('lineupTogglePreviewBtn'),
  lineupLivePreview: document.getElementById('lineupLivePreview'),

  fieldReferee: document.getElementById('fieldReferee'),
  fieldAttendance: document.getElementById('fieldAttendance'),
  fieldFormation: document.getElementById('fieldFormation'),
  fieldCaptain: document.getElementById('fieldCaptain'),
  fieldPoss: document.getElementById('fieldPoss'),
  fieldXg: document.getElementById('fieldXg'),
  fieldNotes: document.getElementById('fieldNotes'),

  requestDeleteBtn: document.getElementById('requestDeleteBtn'),
  deleteConfirmBar: document.getElementById('deleteConfirmBar'),
  confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
  cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),

  clubsDatalist: document.getElementById('clubsDatalist'),
  playersDatalist: document.getElementById('playersDatalist'),
  lineupPlayersDatalist: document.getElementById('lineupPlayersDatalist'),
  lineupNumbersDatalist: document.getElementById('lineupNumbersDatalist'),

  filterMenuModal: document.getElementById('filterMenuModal'),
  closeFilterMenuBtn: document.getElementById('closeFilterMenuBtn'),
  modalSearchInput: document.getElementById('modalSearchInput'),
  modalStatusSelect: document.getElementById('modalStatusSelect'),
  modalTeamSelect: document.getElementById('modalTeamSelect'),
  modalSeasonSelect: document.getElementById('modalSeasonSelect'),
  modalCompSelect: document.getElementById('modalCompSelect'),
  modalMonthSelect: document.getElementById('modalMonthSelect'),
  modalHaSelect: document.getElementById('modalHaSelect'),
  modalOutcomeSelect: document.getElementById('modalOutcomeSelect'),
  modalDateFrom: document.getElementById('modalDateFrom'),
  modalDateTo: document.getElementById('modalDateTo'),
  modalSortSelect: document.getElementById('modalSortSelect'),
  modalPreviewCount: document.getElementById('modalPreviewCount'),
  modalPreviewList: document.getElementById('modalPreviewList'),
  modalResetFiltersBtn: document.getElementById('modalResetFiltersBtn'),
  modalNewMatchBtn: document.getElementById('modalNewMatchBtn'),
  modalApplyFiltersBtn: document.getElementById('modalApplyFiltersBtn'),

  jsonPreviewModal: document.getElementById('jsonPreviewModal'),
  closeJsonModalBtn: document.getElementById('closeJsonModalBtn'),
  jsonPreviewCode: document.getElementById('jsonPreviewCode'),
  downloadJsonBtn: document.getElementById('downloadJsonBtn'),
  copyJsonBtn: document.getElementById('copyJsonBtn'),

  mmToast: document.getElementById('mmToast'),
};

function t(key) {
  return I18N[state.lang][key];
}

function escapeHtml(val) {
  return String(val ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[ch]);
}

let toastTimer = null;
function showToast(msg, type = 'success') {
  if (!el.mmToast) return;
  el.mmToast.textContent = msg;
  el.mmToast.className = `mm-toast show ${type === 'error' ? 'is-error' : 'is-success'}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.mmToast.classList.remove('show');
  }, 3600);
}

function applyTheme(themeId) {
  const found = THEMES.find((item) => item.id === themeId) || THEMES[0];
  state.theme = found.id;
  document.documentElement.setAttribute('data-theme', found.id);
  document.documentElement.classList.remove('theme-editorial', 'theme-classic-blue', 'theme-modern-dark');
  document.documentElement.classList.add(`theme-${found.id}`);
  localStorage.setItem('theme', found.id);
  localStorage.setItem('chelsea_theme', found.id);
  if (el.themeIcon) el.themeIcon.textContent = found.icon;
  if (el.themeLabel) el.themeLabel.textContent = found.label;
}

function updateAuthUI() {
  const user = state.authUser;
  const isAdmin = Boolean(state.isAdmin);
  state.readOnlyMode = !isAdmin;

  if (el.adminAuthChip && el.adminAuthLabel) {
    el.adminAuthChip.classList.remove('is-admin', 'is-denied');
    if (!state.authReady) {
      el.adminAuthLabel.textContent = t('authChecking');
    } else if (!user) {
      el.adminAuthLabel.textContent = t('authGuestChip');
    } else if (isAdmin) {
      el.adminAuthChip.classList.add('is-admin');
      el.adminAuthLabel.textContent = t('authAdminChip')(user.email || '');
    } else {
      el.adminAuthChip.classList.add('is-denied');
      el.adminAuthLabel.textContent = t('authDeniedChip')(user.email || '');
    }
  }

  if (el.adminAuthBtn) {
    if (!user) {
      el.adminAuthBtn.textContent = t('authSignInBtn');
    } else {
      el.adminAuthBtn.textContent = isAdmin ? t('authSignOutBtn') : t('authSwitchBtn');
    }
  }

  if (el.adminAuthBanner && el.adminBannerTitle && el.adminBannerDesc && el.bannerSignInBtn) {
    el.adminAuthBanner.classList.remove('is-locked', 'is-denied', 'is-admin');
    const inIframe = (() => {
      try {
        return window.self !== window.top;
      } catch {
        return true;
      }
    })();

    if (!user) {
      el.adminAuthBanner.classList.add('is-locked');
      el.adminBannerTitle.textContent = state.popupBlocked ? t('authPopupBlockedTitle') : t('authLockedTitle');
      el.adminBannerDesc.textContent = state.popupBlocked ? t('authPopupBlockedDesc') : t('authLockedDesc');
      el.bannerSignInBtn.style.display = 'inline-flex';
      el.bannerSignInBtn.textContent = t('authSignInBtn');
      if (el.bannerOpenTabLink) {
        el.bannerOpenTabLink.style.display = (inIframe || state.popupBlocked) ? 'inline-flex' : 'none';
      }
    } else if (!isAdmin) {
      el.adminAuthBanner.classList.add('is-denied');
      el.adminBannerTitle.textContent = state.popupBlocked ? t('authPopupBlockedTitle') : t('authDeniedTitle')(user.email || '');
      el.adminBannerDesc.textContent = state.popupBlocked ? t('authPopupBlockedDesc') : t('authDeniedDesc');
      el.bannerSignInBtn.style.display = 'inline-flex';
      el.bannerSignInBtn.textContent = t('authSwitchBtn');
      if (el.bannerOpenTabLink) {
        el.bannerOpenTabLink.style.display = (inIframe || state.popupBlocked) ? 'inline-flex' : 'none';
      }
    } else {
      el.adminAuthBanner.classList.add('is-admin');
      el.adminBannerTitle.textContent = t('authAdminTitle')(user.email || '');
      el.adminBannerDesc.textContent = t('authAdminDesc');
      el.bannerSignInBtn.style.display = 'none';
      if (el.bannerOpenTabLink) {
        el.bannerOpenTabLink.style.display = 'none';
      }
    }
  }

  if (el.statStorageNote) {
    el.statStorageNote.textContent = isAdmin ? t('dbConnected') : t('dbReadOnly');
  }
}

async function handleAdminAuthAction() {
  if (!window.KlknFirebase) return;
  if (state.authUser && state.isAdmin) {
    try {
      await window.KlknFirebase.signOutUser();
    } catch (err) {
      showToast(err.message || 'Sign-out failed', 'error');
    }
    return;
  }

  state.popupBlocked = false;
  try {
    // Call signInWithGoogle() immediately without awaiting anything beforehand
    // so browsers preserve the synchronous user click activation for the popup.
    const user = await window.KlknFirebase.signInWithGoogle();
    const ok = await window.KlknFirebase.verifyAdminAccess(user);
    if (ok) {
      showToast(t('authSignInSuccess')(user?.email || ''), 'success');
    } else {
      showToast(t('authSignInDenied')(user?.email || ''), 'error');
    }
  } catch (err) {
    if (err && err.code === 'auth/popup-blocked') {
      state.popupBlocked = true;
      updateAuthUI();
      showToast(t('authPopupBlockedToast'), 'error');
      return;
    }
    if (err && err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
      showToast(err.message || 'Sign-in failed', 'error');
    }
  }
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-lang-th][data-lang-en]').forEach((node) => {
    node.textContent = node.getAttribute(`data-lang-${state.lang}`);
  });
  if (el.langToggleBtn) {
    el.langToggleBtn.textContent = state.lang === 'th' ? 'EN' : 'ไทย';
  }
  if (el.quickSearchInput) {
    el.quickSearchInput.placeholder = t('searchPlaceholder');
  }
  updateAuthUI();
  updateFormHeaderUI();
  renderCompetitionPickerMenu();
  syncCompetitionPickerUI();
  populateTimeDropdownOptions();
  updateTimeSyncHints();
  renderGoalsEditor();
  renderLineupEditor();
  renderMatchList();
  if (el.filterMenuModal.classList.contains('open')) {
    renderModalPreviewList();
  }
}

/* ==================== LINKED TIME DROPDOWNS (TH <-> UK) ==================== */
function generateBaseTimeSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

const BASE_TIME_SLOTS = generateBaseTimeSlots();

function normalizeHHMM(val) {
  if (!val) return '';
  const match = String(val).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return '';
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return '';
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function populateSingleTimeSelect(selectEl, extraTime = '') {
  if (!selectEl) return;
  const currentVal = selectEl.value;
  const slots = [...BASE_TIME_SLOTS];
  const cleanExtra = normalizeHHMM(extraTime);
  if (cleanExtra && !slots.includes(cleanExtra)) {
    slots.push(cleanExtra);
    slots.sort();
  }
  const cleanCurrent = normalizeHHMM(currentVal);
  if (cleanCurrent && !slots.includes(cleanCurrent)) {
    slots.push(cleanCurrent);
    slots.sort();
  }

  const tbcLabel = state.lang === 'th' ? 'TBC (ยังไม่ระบุเวลา)' : 'TBC (To Be Confirmed)';
  const customLabel = state.lang === 'th' ? 'กำหนดเวลาเอง...' : 'Custom time...';

  const optionsHtml = [
    `<option value="TBC">${tbcLabel}</option>`,
    ...slots.map((s) => `<option value="${s}">${s}</option>`),
    `<option value="__custom__">${customLabel}</option>`,
  ].join('');

  selectEl.innerHTML = optionsHtml;
  if (currentVal && Array.from(selectEl.options).some((o) => o.value === currentVal)) {
    selectEl.value = currentVal;
  }
}

function populateTimeDropdownOptions() {
  populateSingleTimeSelect(el.fieldTimeTh, el.fieldTimeThCustom?.value);
  populateSingleTimeSelect(el.fieldTimeUk, el.fieldTimeUkCustom?.value);
}

function normalizeIsoDate(val) {
  const raw = String(val || '').trim();
  if (!raw) return '';
  let y;
  let m;
  let d;
  const sepMatch = raw.match(/^(\d{4})[-/. ](\d{1,2})[-/. ](\d{1,2})$/);
  if (sepMatch) {
    y = parseInt(sepMatch[1], 10);
    m = parseInt(sepMatch[2], 10);
    d = parseInt(sepMatch[3], 10);
  } else if (/^\d{8}$/.test(raw)) {
    y = parseInt(raw.slice(0, 4), 10);
    m = parseInt(raw.slice(4, 6), 10);
    d = parseInt(raw.slice(6, 8), 10);
  } else {
    return '';
  }
  if (m < 1 || m > 12 || d < 1 || d > 31) return '';
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return '';
  }
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function setFieldDateValue(val) {
  const iso = normalizeIsoDate(val);
  if (el.fieldDate) {
    el.fieldDate.value = iso || String(val || '').trim();
  }
  if (el.fieldDatePicker) {
    el.fieldDatePicker.value = iso || '';
  }
}

function getSafeDateStr() {
  const iso = normalizeIsoDate(el.fieldDate?.value);
  if (iso) return iso;
  return new Date().toISOString().slice(0, 10);
}

function formatInTimeZone(dateObj, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(dateObj);
  const map = {};
  parts.forEach((p) => { map[p.type] = p.value; });
  return {
    date: `${map.year}-${map.month}-${map.day}`,
    time: `${map.hour}:${map.minute}`,
  };
}

function getLondonOffsetHours(dateStr) {
  try {
    const probe = new Date(`${dateStr}T12:00:00Z`);
    if (isNaN(probe.getTime())) return 0;
    const ukNoon = formatInTimeZone(probe, 'Europe/London');
    const ukHour = parseInt(ukNoon.time.slice(0, 2), 10);
    return ukHour === 13 ? 1 : 0;
  } catch {
    return 0;
  }
}

function convertThToUk(thTime, dateStr) {
  const clean = normalizeHHMM(thTime);
  if (!clean) return { time: 'TBC', dayShift: 0 };
  const utcInstant = new Date(`${dateStr}T${clean}:00+07:00`);
  if (isNaN(utcInstant.getTime())) return { time: 'TBC', dayShift: 0 };
  const uk = formatInTimeZone(utcInstant, 'Europe/London');
  const dayShift = uk.date < dateStr ? -1 : uk.date > dateStr ? 1 : 0;
  return { time: uk.time, dayShift };
}

function convertUkToTh(ukTime, dateStr) {
  const clean = normalizeHHMM(ukTime);
  if (!clean) return { time: 'TBC', dayShift: 0 };
  let utcInstant = new Date(`${dateStr}T${clean}:00Z`);
  const check0 = formatInTimeZone(utcInstant, 'Europe/London');
  if (check0.time !== clean || check0.date !== dateStr) {
    const candidateBst = new Date(`${dateStr}T${clean}:00+01:00`);
    const check1 = formatInTimeZone(candidateBst, 'Europe/London');
    if (check1.time === clean && check1.date === dateStr) {
      utcInstant = candidateBst;
    }
  }
  const th = formatInTimeZone(utcInstant, 'Asia/Bangkok');
  const dayShift = th.date > dateStr ? 1 : th.date < dateStr ? -1 : 0;
  return { time: th.time, dayShift };
}

function setSideTimeValue(side, value) {
  const selectEl = side === 'th' ? el.fieldTimeTh : el.fieldTimeUk;
  const customEl = side === 'th' ? el.fieldTimeThCustom : el.fieldTimeUkCustom;
  if (!selectEl || !customEl) return;

  const trimmed = String(value || '').trim();
  const clean = normalizeHHMM(trimmed);

  if (!trimmed || trimmed.toUpperCase() === 'TBC') {
    selectEl.value = 'TBC';
    customEl.style.display = 'none';
    customEl.value = '';
    return;
  }

  if (clean) {
    populateSingleTimeSelect(selectEl, clean);
    selectEl.value = clean;
    customEl.style.display = 'none';
    customEl.value = clean;
  } else {
    selectEl.value = 'TBC';
    customEl.style.display = 'none';
    customEl.value = '';
  }
}

function getEffectiveTimeValue(side) {
  const selectEl = side === 'th' ? el.fieldTimeTh : el.fieldTimeUk;
  const customEl = side === 'th' ? el.fieldTimeThCustom : el.fieldTimeUkCustom;
  if (!selectEl) return 'TBC';
  if (selectEl.value === '__custom__') {
    return normalizeHHMM(customEl?.value) || 'TBC';
  }
  return selectEl.value || 'TBC';
}

function updateTimeSyncHints(dayShiftInfo = null) {
  const dateStr = getSafeDateStr();
  const londonOffset = getLondonOffsetHours(dateStr);
  const diffHours = 7 - londonOffset;
  const zoneLabel = londonOffset === 1 ? 'BST' : 'GMT';

  if (el.dateTimezoneNote) {
    el.dateTimezoneNote.textContent =
      state.lang === 'th'
        ? `UK: ${zoneLabel} (ไทยเร็วกว่า +${diffHours} ชม.)`
        : `UK: ${zoneLabel} (TH +${diffHours}h)`;
  }

  const thVal = getEffectiveTimeValue('th');
  const ukVal = getEffectiveTimeValue('uk');

  if (thVal === 'TBC' || ukVal === 'TBC') {
    if (el.timeThHint) el.timeThHint.textContent = state.lang === 'th' ? 'เชื่อมโยงเวลาอังกฤษอัตโนมัติ' : 'Auto-linked with UK Time';
    if (el.timeUkHint) el.timeUkHint.textContent = state.lang === 'th' ? 'เชื่อมโยงเวลาไทยอัตโนมัติ' : 'Auto-linked with TH Time';
    return;
  }

  const convUk = convertThToUk(thVal, dateStr);
  const shiftThToUk = dayShiftInfo?.from === 'th' ? dayShiftInfo.shift : convUk.dayShift;
  const shiftUkToTh = dayShiftInfo?.from === 'uk' ? dayShiftInfo.shift : -convUk.dayShift;

  if (el.timeThHint) {
    if (shiftUkToTh === 1) {
      el.timeThHint.textContent = state.lang === 'th' ? 'วันถัดไป (+1 วันจากเวลา UK)' : 'Next day (+1 day vs UK)';
    } else if (shiftUkToTh === -1) {
      el.timeThHint.textContent = state.lang === 'th' ? 'วันก่อนหน้า (-1 วันจากเวลา UK)' : 'Previous day (-1 day vs UK)';
    } else {
      el.timeThHint.textContent = state.lang === 'th' ? `ซิงก์แบบเรียลไทม์ (+${diffHours} ชม.)` : `Synced live (+${diffHours}h)`;
    }
  }

  if (el.timeUkHint) {
    if (shiftThToUk === -1) {
      el.timeUkHint.textContent = state.lang === 'th' ? `วันก่อนหน้า (-1 วัน · ${zoneLabel})` : `Previous day (-1 day · ${zoneLabel})`;
    } else if (shiftThToUk === 1) {
      el.timeUkHint.textContent = state.lang === 'th' ? `วันถัดไป (+1 วัน · ${zoneLabel})` : `Next day (+1 day · ${zoneLabel})`;
    } else {
      el.timeUkHint.textContent = state.lang === 'th' ? `ซิงก์แบบเรียลไทม์ (${zoneLabel})` : `Synced live (${zoneLabel})`;
    }
  }
}

function syncTimesFromTh() {
  state.lastTimeSource = 'th';
  const thVal = getEffectiveTimeValue('th');
  if (thVal === 'TBC') {
    setSideTimeValue('uk', 'TBC');
    updateTimeSyncHints();
    return;
  }
  const dateStr = getSafeDateStr();
  const converted = convertThToUk(thVal, dateStr);
  setSideTimeValue('uk', converted.time);
  updateTimeSyncHints({ from: 'th', shift: converted.dayShift });
}

function syncTimesFromUk() {
  state.lastTimeSource = 'uk';
  const ukVal = getEffectiveTimeValue('uk');
  if (ukVal === 'TBC') {
    setSideTimeValue('th', 'TBC');
    updateTimeSyncHints();
    return;
  }
  const dateStr = getSafeDateStr();
  const converted = convertUkToTh(ukVal, dateStr);
  setSideTimeValue('th', converted.time);
  updateTimeSyncHints({ from: 'uk', shift: converted.dayShift });
}

function getLogoForCompetition(compValue) {
  if (COMPETITION_META[compValue]) return COMPETITION_META[compValue].logo;
  const lower = String(compValue || '').toLowerCase();
  if (lower.includes('premier')) return COMPETITION_META['premier-league'].logo;
  if (lower.includes('wsl') || lower.includes("women's super")) return COMPETITION_META["Barclays Women's Super League"].logo;
  if (lower.includes('uwcl') || (lower.includes('women') && lower.includes('champions'))) return COMPETITION_META["UEFA Women's Champions League"].logo;
  if (lower.includes('champions')) return COMPETITION_META['champions-league'].logo;
  if (lower.includes('europa')) return 'databases/logo/competitions/men/tournaments_uefa-europa-league.svg';
  if (lower.includes('conference')) return 'databases/logo/competitions/men/tournaments_uefa-conference-league.svg';
  if (lower.includes('community')) return 'databases/logo/competitions/men/england_fa-community-shield.svg';
  if (lower.includes('women') && lower.includes('fa')) return COMPETITION_META["Women's FA Cup"].logo;
  if (lower.includes('women') && lower.includes('league')) return COMPETITION_META["Women's League Cup"].logo;
  if (lower.includes('fa')) return COMPETITION_META['fa-cup'].logo;
  if (lower.includes('efl') || lower.includes('carabao') || lower.includes('league cup')) return COMPETITION_META['league-cup'].logo;
  if (lower.includes('friendly')) return COMPETITION_META.Friendly.logo;
  return '';
}

function getCompetitionDisplayMeta(compValue) {
  if (compValue === '__custom__') {
    const customName = el.fieldCustomCompetition?.value?.trim();
    const label = customName || (state.lang === 'th' ? 'กำหนดชื่อรายการเอง...' : 'Custom competition...');
    const logo = (customName && getLogoForCompetition(customName)) || 'assets/images/placeholder-trophy.svg';
    return { label, logo };
  }
  const opt = Array.from(el.fieldCompetition?.options || []).find((o) => o.value === compValue);
  const label = opt ? opt.textContent : compValue;
  const logo = getLogoForCompetition(compValue) || 'assets/images/placeholder-trophy.svg';
  return { label, logo };
}

function toggleCompetitionMenu(forceState = null) {
  if (!el.competitionPicker || !el.competitionPickerBtn) return;
  const shouldOpen = forceState !== null ? Boolean(forceState) : !el.competitionPicker.classList.contains('open');
  el.competitionPicker.classList.toggle('open', shouldOpen);
  el.competitionPickerBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
}

function renderCompetitionPickerMenu() {
  if (!el.fieldCompetition || !el.competitionPickerMenu) return;
  const currentVal = el.fieldCompetition.value;
  const customLabel = state.lang === 'th' ? 'กำหนดชื่อรายการเอง...' : 'Custom competition...';
  const rowsHtml = Array.from(el.fieldCompetition.options).map((opt) => {
    const val = opt.value;
    const isCustom = val === '__custom__';
    if (isCustom) {
      opt.textContent = customLabel;
    }
    const label = isCustom ? customLabel : opt.textContent;
    const logo = isCustom ? 'assets/images/placeholder-trophy.svg' : getLogoForCompetition(val) || 'assets/images/placeholder-trophy.svg';
    const selected = val === currentVal;
    return `
      <button
        type="button"
        class="mm-comp-option ${selected ? 'is-selected' : ''}"
        role="option"
        aria-selected="${selected ? 'true' : 'false'}"
        data-comp-value="${escapeHtml(val)}"
      >
        <span class="mm-comp-option-logo">
          <img src="${escapeHtml(logo)}" alt="" onerror="this.src='assets/images/placeholder-trophy.svg'" />
        </span>
        <span class="mm-comp-option-name">${escapeHtml(label)}</span>
      </button>
    `;
  }).join('');

  el.competitionPickerMenu.innerHTML = rowsHtml;
  el.competitionPickerMenu.querySelectorAll('.mm-comp-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextVal = btn.getAttribute('data-comp-value');
      if (el.fieldCompetition.value !== nextVal) {
        el.fieldCompetition.value = nextVal;
        el.fieldCompetition.dispatchEvent(new Event('change'));
      } else {
        syncCompetitionPickerUI();
      }
      toggleCompetitionMenu(false);
      el.competitionPickerBtn?.focus();
    });
  });
}

function syncCompetitionPickerUI() {
  if (!el.fieldCompetition || !el.competitionPickerLabel || !el.competitionPickerLogo) return;
  const currentVal = el.fieldCompetition.value;
  const meta = getCompetitionDisplayMeta(currentVal);
  el.competitionPickerLabel.textContent = meta.label;
  el.competitionPickerLogo.src = meta.logo;
  el.competitionPickerLogo.onerror = () => {
    el.competitionPickerLogo.src = 'assets/images/placeholder-trophy.svg';
  };
  if (el.competitionPickerMenu) {
    el.competitionPickerMenu.querySelectorAll('.mm-comp-option').forEach((btn) => {
      const isSelected = btn.getAttribute('data-comp-value') === currentVal;
      btn.classList.toggle('is-selected', isSelected);
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }
}

function findClubMatch(name) {
  const q = String(name || '').trim().toLowerCase();
  if (!q) return null;
  const normalizedQ = q
    .replace('legia warszawa', 'legia warsaw')
    .replace('djurgården', 'djurgarden')
    .replace('espérance', 'esperance')
    .replace('fc copenhagen', 'copenhagen')
    .replace('fc københavn', 'copenhagen')
    .replace('fc kobenhavn', 'copenhagen');

  return state.clubs.find((c) => {
    const en = String(c['สโมสร'] || '').toLowerCase();
    const th = String(c['ชื่อสโมสร (ภาษาไทย)'] || '').toLowerCase();
    const abbr = String(c['ชื่อย่อ'] || '').toLowerCase();
    return en === normalizedQ || th === q || abbr === q;
  }) || state.clubs.find((c) => {
    const en = String(c['สโมสร'] || '').toLowerCase();
    if (en === 'copenhagen' && (normalizedQ.includes('frem ') || normalizedQ.includes('kb '))) return false;
    if (en === 'paris' && normalizedQ !== 'paris' && normalizedQ !== 'paris fc') return false;
    return (en.includes(normalizedQ) && normalizedQ.length >= 4) || (en.length >= 4 && normalizedQ.includes(en));
  });
}

function resolveLogoPath(teamName, fallback = 'assets/images/placeholder-team.svg') {
  const club = findClubMatch(teamName);
  if (club && club.logo) return club.logo;
  const lower = String(teamName || '').toLowerCase();
  if (lower.includes('chelsea')) return 'databases/logo/teams/england_chelsea.svg';
  return fallback;
}

function updateTeamPreviews() {
  const homeName = el.fieldHomeTeam.value.trim() || 'Home';
  const awayName = el.fieldAwayTeam.value.trim() || 'Away';
  const homeLogo = el.fieldHomeLogo.value.trim() || 'assets/images/placeholder-team.svg';
  const awayLogo = el.fieldAwayLogo.value.trim() || 'assets/images/placeholder-team.svg';

  el.homeLogoPreview.src = homeLogo;
  el.homeLogoPreview.onerror = () => { el.homeLogoPreview.src = 'assets/images/placeholder-team.svg'; };
  el.awayLogoPreview.src = awayLogo;
  el.awayLogoPreview.onerror = () => { el.awayLogoPreview.src = 'assets/images/placeholder-team.svg'; };

  el.scoreboardHomeLogo.src = homeLogo;
  el.scoreboardHomeLogo.onerror = () => { el.scoreboardHomeLogo.src = 'assets/images/placeholder-team.svg'; };
  el.scoreboardAwayLogo.src = awayLogo;
  el.scoreboardAwayLogo.onerror = () => { el.scoreboardAwayLogo.src = 'assets/images/placeholder-team.svg'; };

  el.scoreboardHomeName.textContent = homeName;
  el.scoreboardAwayName.textContent = awayName;

  if (el.lineupTabHomeLogo) {
    el.lineupTabHomeLogo.src = homeLogo;
    el.lineupTabHomeLogo.onerror = () => { el.lineupTabHomeLogo.src = 'assets/images/placeholder-team.svg'; };
  }
  if (el.lineupTabAwayLogo) {
    el.lineupTabAwayLogo.src = awayLogo;
    el.lineupTabAwayLogo.onerror = () => { el.lineupTabAwayLogo.src = 'assets/images/placeholder-team.svg'; };
  }
  if (el.lineupTabHomeName) el.lineupTabHomeName.textContent = homeName;
  if (el.lineupTabAwayName) el.lineupTabAwayName.textContent = awayName;

  updateLineupSideUI();
  renderLineupLivePreview();
}

function populateClubsDatalist() {
  if (!el.clubsDatalist) return;
  const seen = new Set();
  const options = [];
  state.clubs.forEach((c) => {
    const name = c['สโมสร'];
    if (name && !seen.has(name)) {
      seen.add(name);
      options.push(`<option value="${escapeHtml(name)}">${escapeHtml(c['ชื่อสโมสร (ภาษาไทย)'] || '')} (${escapeHtml(c['ลีก'] || '')})</option>`);
    }
  });
  el.clubsDatalist.innerHTML = options.join('');
}

function populatePlayersDatalist() {
  if (!el.playersDatalist) return;
  const teamType = el.fieldTeamType.value;
  const pool = teamType === 'W' ? state.playersWomen : state.playersMen;
  const options = pool
    .filter((p) => p && p.name && String(p.position || '').toLowerCase() !== 'head coach')
    .map((p) => `<option value="${escapeHtml(p.name)}">#${escapeHtml(p.number ?? '')} · ${escapeHtml(p.position || '')}</option>`);
  el.playersDatalist.innerHTML = options.join('');
}

function renderChannelsGrid() {
  if (!el.channelsGrid) return;
  el.channelsGrid.innerHTML = KNOWN_CHANNELS.map((ch) => {
    const active = state.selectedChannels.has(ch.name);
    return `
      <button type="button" class="mm-channel-toggle ${active ? 'active' : ''}" data-channel-name="${escapeHtml(ch.name)}">
        <img src="${escapeHtml(ch.logo)}" alt="${escapeHtml(ch.name)}" onerror="this.style.display='none'" />
        <span>${escapeHtml(ch.name)}</span>
      </button>
    `;
  }).join('');

  el.channelsGrid.querySelectorAll('.mm-channel-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chName = btn.getAttribute('data-channel-name');
      if (state.selectedChannels.has(chName)) {
        state.selectedChannels.delete(chName);
      } else {
        state.selectedChannels.add(chName);
      }
      renderChannelsGrid();
    });
  });
}

function renderGoalsEditor() {
  if (!el.goalsListContainer) return;
  if (state.goals.length === 0) {
    el.goalsListContainer.innerHTML = `<div class="mm-panel-meta" style="padding: 8px 0">${escapeHtml(t('noGoals'))}</div>`;
    return;
  }

  el.goalsListContainer.innerHTML = state.goals.map((g, idx) => {
    const goalKind = g.own_goal ? 'own_goal' : g.penalty ? 'penalty' : 'normal';
    return `
      <div class="mm-goal-row" data-goal-idx="${idx}">
        <select class="mm-select goal-team-select" aria-label="Scoring team">
          <option value="home" ${g.team === 'home' ? 'selected' : ''}>${escapeHtml(t('homeSide'))}</option>
          <option value="away" ${g.team === 'away' ? 'selected' : ''}>${escapeHtml(t('awaySide'))}</option>
        </select>
        <input type="text" class="mm-input goal-player-input" list="playersDatalist" value="${escapeHtml(g.player || '')}" placeholder="${escapeHtml(t('goalPlayerPlaceholder'))}" />
        <input type="text" class="mm-input mono goal-minute-input" value="${escapeHtml(g.minute ?? '')}" placeholder="${escapeHtml(t('goalMinutePlaceholder'))}" />
        <select class="mm-select goal-kind-select" aria-label="Goal type">
          <option value="normal" ${goalKind === 'normal' ? 'selected' : ''}>${escapeHtml(t('goalNormal'))}</option>
          <option value="penalty" ${goalKind === 'penalty' ? 'selected' : ''}>${escapeHtml(t('goalPenalty'))}</option>
          <option value="own_goal" ${goalKind === 'own_goal' ? 'selected' : ''}>${escapeHtml(t('goalOwn'))}</option>
        </select>
        <button type="button" class="mm-btn mm-btn-danger mm-btn-compact goal-remove-btn" aria-label="Remove goal" style="padding: 6px; min-width: 36px">✕</button>
      </div>
    `;
  }).join('');

  el.goalsListContainer.querySelectorAll('.mm-goal-row').forEach((row) => {
    const idx = Number(row.getAttribute('data-goal-idx'));
    row.querySelector('.goal-team-select').addEventListener('change', (e) => {
      state.goals[idx].team = e.target.value;
    });
    row.querySelector('.goal-player-input').addEventListener('input', (e) => {
      state.goals[idx].player = e.target.value;
    });
    row.querySelector('.goal-minute-input').addEventListener('input', (e) => {
      state.goals[idx].minute = e.target.value;
    });
    row.querySelector('.goal-kind-select').addEventListener('change', (e) => {
      const val = e.target.value;
      state.goals[idx].penalty = val === 'penalty';
      state.goals[idx].own_goal = val === 'own_goal';
    });
    row.querySelector('.goal-remove-btn').addEventListener('click', () => {
      state.goals.splice(idx, 1);
      renderGoalsEditor();
    });
  });
}

function setFormStatus(status) {
  const safeStatus = ['upcoming', 'completed', 'live'].includes(status) ? status : 'upcoming';
  el.fieldStatus.value = safeStatus;
  document.querySelectorAll('#statusSegControl .mm-seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-form-status') === safeStatus);
  });
  const isScoreActive = safeStatus === 'completed' || safeStatus === 'live';
  el.scoreSection.style.opacity = isScoreActive ? '1' : '0.78';
}

function setFormTeamType(teamType) {
  const safeTeam = teamType === 'W' ? 'W' : 'M';
  el.fieldTeamType.value = safeTeam;
  document.querySelectorAll('#teamTypeSegControl .mm-seg-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-form-team-type') === safeTeam);
  });
  populatePlayersDatalist();
}

function updateFormHeaderUI() {
  if (state.editingId) {
    el.formHeading.textContent = t('editingTitle')(state.editingId);
    const date = el.fieldDate.value || '—';
    const comp = el.fieldCompetition.value === '__custom__' ? el.fieldCustomCompetition.value : el.fieldCompetition.value;
    el.formSubMeta.textContent = t('editingMeta')(date, comp || '—');
    el.requestDeleteBtn.style.display = 'inline-flex';
    const isW = el.fieldTeamType.value === 'W';
    el.previewDetailLink.href = isW
      ? `match-detail-women.html?id=${encodeURIComponent(state.editingId)}`
      : `match-detail.html?id=${encodeURIComponent(state.editingId)}&team=men`;
    el.previewDetailLink.style.display = 'inline-flex';
  } else {
    el.formHeading.textContent = t('creatingTitle');
    el.formSubMeta.textContent = t('creatingMeta');
    el.requestDeleteBtn.style.display = 'none';
    el.previewDetailLink.style.display = 'none';
  }
  el.deleteConfirmBar.classList.remove('open');
}

/* ==================== PRE-MATCH LINE-UP BUILDER ==================== */
const FORMATION_PRESETS = ['4-2-3-1', '4-3-3', '3-4-2-1', '3-4-3', '3-5-2', '4-4-2', '4-1-4-1', '4-3-1-2', '5-3-2'];

const FORMATION_POSITION_TEMPLATES = {
  '4-2-3-1': ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'CDM', 'RW', 'CAM', 'LW', 'ST'],
  '4-3-3': ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CDM', 'CM', 'RW', 'ST', 'LW'],
  '3-4-2-1': ['GK', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'LWB', 'CAM', 'CAM', 'ST'],
  '3-4-3': ['GK', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CM', 'LWB', 'RW', 'ST', 'LW'],
  '3-5-2': ['GK', 'CB', 'CB', 'CB', 'RWB', 'CM', 'CDM', 'CM', 'LWB', 'ST', 'ST'],
  '4-4-2': ['GK', 'RB', 'CB', 'CB', 'LB', 'RM', 'CM', 'CM', 'LM', 'ST', 'ST'],
  '4-1-4-1': ['GK', 'RB', 'CB', 'CB', 'LB', 'CDM', 'RM', 'CM', 'CM', 'LM', 'ST'],
  '4-3-1-2': ['GK', 'RB', 'CB', 'CB', 'LB', 'CM', 'CDM', 'CM', 'CAM', 'ST', 'ST'],
  '5-3-2': ['GK', 'RWB', 'CB', 'CB', 'CB', 'LWB', 'CM', 'CDM', 'CM', 'ST', 'ST'],
};

const LINEUP_POSITION_OPTIONS = [
  'GK', 'RB', 'CB', 'LB', 'RWB', 'LWB', 'DF',
  'CDM', 'CM', 'CAM', 'RM', 'LM', 'MF',
  'RW', 'LW', 'ST', 'FW',
];

function createEmptyLineupSide(defaultFormation = '4-2-3-1') {
  return {
    manager: '',
    formation: defaultFormation,
    starting: [],
    substitutes: [],
  };
}

function getPositionsForFormation(formationStr) {
  const clean = String(formationStr || '').trim();
  if (FORMATION_POSITION_TEMPLATES[clean]) {
    return [...FORMATION_POSITION_TEMPLATES[clean]];
  }
  const nums = clean
    .split(/[-–\s]+/)
    .map((n) => parseInt(n, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length >= 2 && 1 + nums.reduce((a, b) => a + b, 0) === 11) {
    const slots = ['GK'];
    nums.forEach((count, lineIdx) => {
      const role = lineIdx === 0 ? 'DF' : lineIdx === nums.length - 1 ? 'FW' : 'MF';
      for (let i = 0; i < count; i++) slots.push(role);
    });
    return slots;
  }
  return [...FORMATION_POSITION_TEMPLATES['4-2-3-1']];
}

function normalizePlayerNameForMatch(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*\(C\)/gi, '')
    .replace(/\s*\(GK\)/gi, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getActiveChelseaSquadPool() {
  const isW = el.fieldTeamType?.value === 'W';
  if (!isW) {
    return (Array.isArray(state.playersMen) ? state.playersMen : []).filter(
      (p) => p && p.name && String(p.position || '').toLowerCase() !== 'head coach'
    );
  }
  const baseWomen = (Array.isArray(state.playersWomen) ? state.playersWomen : []).filter(
    (p) => p && p.name && String(p.position || '').toLowerCase() !== 'head coach'
  );
  const wsClub = (Array.isArray(state.womenSquads) ? state.womenSquads : []).find((c) =>
    String(c.team || '').toLowerCase().includes('chelsea')
  );
  if (!wsClub || !Array.isArray(wsClub.players)) return baseWomen;

  const byNorm = new Map();
  baseWomen.forEach((p) => {
    byNorm.set(normalizePlayerNameForMatch(p.name), p);
  });

  const merged = [];
  const seenNorm = new Set();
  wsClub.players.forEach((wp) => {
    const norm = normalizePlayerNameForMatch(wp.name);
    seenNorm.add(norm);
    const existing = byNorm.get(norm);
    merged.push({
      ...(existing || {}),
      id: existing?.id || norm,
      name: wp.name,
      short_name: wp.short_name || '',
      number: wp.number ?? existing?.number ?? null,
      position: wp.position || mapSquadPosToShortTag(existing?.position),
      role: wp.role || existing?.position || '',
      appearances: existing?.appearances ?? 0,
      image: existing?.image || '',
    });
  });

  baseWomen.forEach((bp) => {
    const norm = normalizePlayerNameForMatch(bp.name);
    if (!seenNorm.has(norm)) {
      merged.push({
        ...bp,
        role: bp.position || '',
        position: mapSquadPosToShortTag(bp.position),
      });
    }
  });
  return merged;
}

function findWomenSquadClubByTeamName(teamName) {
  const q = String(teamName || '').trim().toLowerCase().replace(/['’]s\b/gi, '');
  if (!q || !Array.isArray(state.womenSquads) || state.womenSquads.length === 0) return null;
  const cleanQ = q.replace(/\s*(w\.f\.c\.|wfc|fc|women)\b/gi, '').replace(/\s+/g, ' ').trim();

  const exact = state.womenSquads.find((c) => {
    if (String(c.team || '').toLowerCase() === q) return true;
    if (Array.isArray(c.aliases) && c.aliases.some((a) => {
      const al = a.toLowerCase().replace(/['’]s\b/gi, '');
      return al === q || al === cleanQ;
    })) return true;
    return false;
  });
  if (exact) return exact;

  if (cleanQ.length >= 4) {
    return state.womenSquads.find((c) => {
      const cTeam = String(c.team || '').toLowerCase();
      const cleanC = cTeam.replace(/\s*(w\.f\.c\.|wfc|fc|women)\b/gi, '').replace(/\s+/g, ' ').trim();
      if (cleanC === cleanQ) return true;
      if (Array.isArray(c.aliases) && c.aliases.some((a) => a.toLowerCase().includes(cleanQ) || cleanQ.includes(a.toLowerCase()))) return true;
      return false;
    }) || null;
  }
  return null;
}

function getWomenClubManagerForSide(side) {
  if (el.fieldTeamType?.value !== 'W') return '';
  const teamName = String(side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value || '').trim();
  const club = findWomenSquadClubByTeamName(teamName);
  return club && club.manager ? String(club.manager).trim() : '';
}

function syncAutoWomenManagersForForm() {
  const isW = el.fieldTeamType?.value === 'W';
  ['home', 'away'].forEach((sideKey) => {
    const sideData = state.lineups?.[sideKey];
    if (!sideData) return;
    if (sideData._manualManagerEdited) return;
    if (!isW) {
      if (sideData._autoManager && sideData.manager === sideData._autoManager) {
        sideData.manager = '';
      }
      sideData._autoManager = '';
      return;
    }
    const nextMgr = getWomenClubManagerForSide(sideKey);
    const curMgr = String(sideData.manager || '').trim();
    if (!curMgr || curMgr === '-' || (sideData._autoManager && curMgr === sideData._autoManager)) {
      sideData.manager = nextMgr;
      sideData._autoManager = nextMgr;
    }
  });
}

function normalizeTeamKeyForSquadLookup(teamName) {
  return String(teamName || '')
    .trim()
    .toLowerCase()
    .replace(/['’]s\b/gi, '')
    .replace(/\b(w\.?f\.?c\.?|fc|cf|afc|women)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getHistoricalClubPoolFromMatches(teamName, teamType) {
  const targetClean = normalizeTeamKeyForSquadLookup(teamName);
  if (!targetClean || !Array.isArray(state.allMergedMatches) || state.allMergedMatches.length === 0) {
    return [];
  }
  const byKey = new Map();
  const sorted = state.allMergedMatches
    .filter((m) => m && m.lineups && (!teamType || m.team_type === teamType))
    .slice()
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  for (const m of sorted) {
    const homeClean = normalizeTeamKeyForSquadLookup(m.home_team);
    const awayClean = normalizeTeamKeyForSquadLookup(m.away_team);
    const matchedSides = [];
    if (homeClean && (homeClean === targetClean || (targetClean.length >= 4 && (homeClean.includes(targetClean) || targetClean.includes(homeClean))))) {
      matchedSides.push(m.lineups.home);
    }
    if (awayClean && (awayClean === targetClean || (targetClean.length >= 4 && (awayClean.includes(targetClean) || targetClean.includes(awayClean))))) {
      matchedSides.push(m.lineups.away);
    }
    for (const sideObj of matchedSides) {
      if (!sideObj) continue;
      const players = [
        ...(Array.isArray(sideObj.starting) ? sideObj.starting : []),
        ...(Array.isArray(sideObj.substitutes) ? sideObj.substitutes : []),
      ];
      for (const p of players) {
        if (!p || !p.name) continue;
        const cleanName = String(p.name).replace(/\s*\(C\)/gi, '').replace(/\s*\(GK\)/gi, '').trim();
        const norm = normalizePlayerNameForMatch(cleanName);
        if (!norm) continue;
        const pNum = p.number ?? p.shirt_number ?? '';
        const key = `${norm}`;
        if (!byKey.has(key)) {
          byKey.set(key, {
            id: `hist_${norm}`,
            name: cleanName,
            number: pNum !== '' && !isNaN(Number(pNum)) ? Number(pNum) : null,
            position: mapSquadPosToShortTag(p.position || p.pos || ''),
            status: 'active',
          });
        } else {
          const existing = byKey.get(key);
          if ((existing.number === null || existing.number === undefined) && pNum !== '' && !isNaN(Number(pNum))) {
            existing.number = Number(pNum);
          }
          if (!existing.position && (p.position || p.pos)) {
            existing.position = mapSquadPosToShortTag(p.position || p.pos);
          }
        }
      }
    }
  }
  return Array.from(byKey.values());
}

function getSquadPoolForSide(side) {
  const teamName = String(side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value || '').trim();
  const isChelsea = teamName.toLowerCase().includes('chelsea');
  const isW = el.fieldTeamType?.value === 'W';

  if (isChelsea) {
    return getActiveChelseaSquadPool();
  }
  if (isW) {
    const club = findWomenSquadClubByTeamName(teamName);
    if (club && Array.isArray(club.players)) {
      return club.players.map((p, idx) => ({
        ...p,
        id: `${club.team}_${idx}`,
      }));
    }
  }
  return getHistoricalClubPoolFromMatches(teamName, isW ? 'W' : 'M');
}

function isPoolPlayerActive(player) {
  const st = String(player?.status || '').trim().toLowerCase();
  return !st || st === 'active' || st === 'new_signing';
}

function findPlayersByNumberInPool(rawNum, pool) {
  const numStr = String(rawNum ?? '').trim();
  if (!numStr || !Array.isArray(pool) || pool.length === 0) return [];
  const parsedTarget = /^\d+$/.test(numStr) ? parseInt(numStr, 10) : null;
  const matches = pool.filter((p) => {
    if (p.number === null || p.number === undefined || String(p.number).trim() === '') return false;
    const pStr = String(p.number).trim();
    if (pStr === numStr) return true;
    if (parsedTarget !== null && /^\d+$/.test(pStr) && parseInt(pStr, 10) === parsedTarget) return true;
    return false;
  });
  return matches.sort((a, b) => {
    const aActive = isPoolPlayerActive(a) ? 0 : 1;
    const bActive = isPoolPlayerActive(b) ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    const aApp = Number(a.appearances ?? 0);
    const bApp = Number(b.appearances ?? 0);
    return bApp - aApp;
  });
}

function pickBestPlayerByNumber(rawNum, side, currentIdx, isSub) {
  const pool = getSquadPoolForSide(side);
  const candidates = findPlayersByNumberInPool(rawNum, pool);
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];

  const sideData = state.lineups[side] || { starting: [], substitutes: [] };
  const usedNorms = new Set();
  sideData.starting.forEach((r, i) => {
    if (!isSub && i === currentIdx) return;
    const n = normalizePlayerNameForMatch(r?.name || '');
    if (n) usedNorms.add(n);
  });
  sideData.substitutes.forEach((r, i) => {
    if (isSub && i === currentIdx) return;
    const n = normalizePlayerNameForMatch(r?.name || '');
    if (n) usedNorms.add(n);
  });

  const unused = candidates.find((c) => !usedNorms.has(normalizePlayerNameForMatch(c.name)));
  return unused || candidates[0];
}

function findPlayerInPool(rawName, pNum, pool) {
  if (!Array.isArray(pool) || pool.length === 0) return null;
  const clean = String(rawName || '').replace(/\s*\(C\)/gi, '').replace(/\s*\(GK\)/gi, '').trim();
  const norm = normalizePlayerNameForMatch(clean);
  if (norm) {
    const exact = pool.find(
      (p) => normalizePlayerNameForMatch(p.name) === norm || (p.short_name && normalizePlayerNameForMatch(p.short_name) === norm)
    );
    if (exact) return exact;
    const parts = norm.split(' ').filter((pt) => pt.length > 2);
    const surname = parts[parts.length - 1];
    if (surname) {
      const bySurname = pool.find((p) => {
        const pParts = normalizePlayerNameForMatch(p.name).split(' ');
        return pParts[pParts.length - 1] === surname;
      });
      if (bySurname) return bySurname;
    }
  }
  if (pNum !== undefined && pNum !== null && String(pNum).trim() !== '') {
    const byNum = findPlayersByNumberInPool(pNum, pool);
    if (byNum.length > 0) return byNum[0];
  }
  return null;
}

function findChelseaPlayerInPool(rawName, pNum) {
  return findPlayerInPool(rawName, pNum, getActiveChelseaSquadPool());
}

function resolveChelseaPlayerForPreview(cleanName, pNum, teamTypeArg, isChelseaTeam) {
  if (!isChelseaTeam) return null;
  const isW = teamTypeArg === 'women' || teamTypeArg === 'W' || el.fieldTeamType?.value === 'W';
  const pool = (isW ? state.playersWomen : state.playersMen) || [];
  const found = findPlayerInPool(cleanName, pNum, pool);
  if (!found) return null;
  return {
    id: found.id,
    team: isW ? 'women' : 'men',
    image: found.image || '',
  };
}

function isSideChelsea(side) {
  const teamName = side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value;
  return String(teamName || '').toLowerCase().includes('chelsea');
}

function mapSquadPosToShortTag(posStr) {
  const raw = String(posStr || '').trim();
  if (LINEUP_POSITION_OPTIONS.includes(raw)) return raw;
  const lower = raw.toLowerCase();
  if (lower.includes('goalkeeper') || lower === 'gk') return 'GK';
  if (lower.includes('defender') || lower === 'df') return 'DF';
  if (lower.includes('midfielder') || lower === 'mf') return 'MF';
  if (lower.includes('forward') || lower.includes('striker') || lower === 'fw') return 'FW';
  return raw || '';
}

function normalizeLineupRowFromMatch(rawPlayer) {
  if (!rawPlayer || typeof rawPlayer !== 'object') {
    return { number: '', name: '', position: '', captain: false, _extra: {} };
  }
  const rawName = String(rawPlayer.name || rawPlayer.player_name || '').trim();
  const isCap = Boolean(
    rawPlayer.captain === true ||
    rawPlayer.isCaptain === true ||
    /\(C\)/i.test(rawName) ||
    rawPlayer.position === 'C' ||
    rawPlayer.pos === 'C'
  );
  const cleanName = rawName.replace(/\s*\(C\)/gi, '').replace(/\s*\(GK\)/gi, '').trim();
  const rawPos = String(rawPlayer.position || rawPlayer.pos || '').trim();
  const isGkName = /\(GK\)/i.test(rawName);
  let displayPos = rawPos === 'C' ? '' : rawPos;
  if (!displayPos && isGkName) displayPos = 'GK';

  const { number, shirt_number, name, player_name, position, pos, captain, isCaptain, ...rest } = rawPlayer;
  return {
    number: number ?? shirt_number ?? '',
    name: cleanName,
    position: displayPos,
    captain: isCap,
    _extra: rest,
  };
}

function serializeLineupRowForOutput(row, index, isStarter) {
  const cleanName = String(row.name || '').trim();
  const cleanPos = String(row.position || '').trim();
  const rawNum = String(row.number ?? '').trim();
  const numVal = rawNum !== '' && !isNaN(Number(rawNum)) ? Number(rawNum) : rawNum;

  let outName = cleanName;
  if (row.captain && cleanName && !/\(C\)/i.test(outName)) {
    outName = `${outName} (C)`;
  }

  const out = {
    ...(row._extra && typeof row._extra === 'object' ? row._extra : {}),
    ...(numVal !== '' ? { number: numVal } : {}),
    name: outName,
    ...(cleanPos ? { position: cleanPos } : {}),
  };
  if (row.captain) {
    out.captain = true;
  } else {
    delete out.captain;
  }
  return out;
}

function syncChelseaSummaryFieldsFromLineup() {
  const chelseaSide = isSideChelsea('home') ? 'home' : isSideChelsea('away') ? 'away' : null;
  if (!chelseaSide) return;
  const sideData = state.lineups[chelseaSide];
  if (sideData.formation && el.fieldFormation && !el.fieldFormation.value.trim()) {
    el.fieldFormation.value = sideData.formation;
  }
  const capRow = sideData.starting.find((p) => p.captain && p.name && p.name.trim());
  if (capRow && el.fieldCaptain) {
    el.fieldCaptain.value = capRow.name.replace(/\s*\(C\)/gi, '').trim();
  }
}

function populateActiveSideSquadControls() {
  const side = state.activeLineupSide === 'away' ? 'away' : 'home';
  const pool = getSquadPoolForSide(side).slice().sort((a, b) => {
    const aAct = isPoolPlayerActive(a) ? 0 : 1;
    const bAct = isPoolPlayerActive(b) ? 0 : 1;
    if (aAct !== bAct) return aAct - bAct;
    return Number(a.number ?? 999) - Number(b.number ?? 999);
  });
  const teamLabel = (side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value || '').trim() || (side === 'home' ? 'Home' : 'Away');

  if (el.lineupPlayersDatalist) {
    el.lineupPlayersDatalist.innerHTML = pool
      .map((p) => `<option value="${escapeHtml(p.name)}">#${escapeHtml(p.number ?? '-')} · ${escapeHtml(mapSquadPosToShortTag(p.position))}${p.role ? ` (${escapeHtml(p.role)})` : ''}</option>`)
      .join('');
  }

  if (el.lineupNumbersDatalist) {
    const seenNumOption = new Set();
    el.lineupNumbersDatalist.innerHTML = pool
      .filter((p) => p.number !== null && p.number !== undefined && String(p.number).trim() !== '')
      .filter((p) => {
        const key = `${String(p.number).trim()}|${normalizePlayerNameForMatch(p.name)}`;
        if (seenNumOption.has(key)) return false;
        seenNumOption.add(key);
        return true;
      })
      .map((p) => {
        const shortPos = mapSquadPosToShortTag(p.position);
        return `<option value="${escapeHtml(p.number)}">${escapeHtml(p.name)}${shortPos ? ` (${escapeHtml(shortPos)})` : ''}</option>`;
      })
      .join('');
  }

  if (el.lineupChelseaQuickSelect) {
    const optionsHtml = [
      `<option value="">${escapeHtml(t('lineupQuickAddPlaceholder')(teamLabel))}</option>`,
      ...pool.map((p) => `<option value="${escapeHtml(p.name)}">#${escapeHtml(p.number ?? '-')} · ${escapeHtml(p.name)} (${escapeHtml(mapSquadPosToShortTag(p.position))})</option>`),
    ].join('');
    el.lineupChelseaQuickSelect.innerHTML = optionsHtml;
  }

  if (el.lineupAutoChelseaBtn) {
    el.lineupAutoChelseaBtn.textContent = state.lang === 'th' ? `เติม 11 ตัวจริง (${teamLabel})` : `Auto-Fill (${teamLabel})`;
  }
}

let lastActiveSquadControlKey = '';

function updateLineupSideUI() {
  const homeCount = state.lineups.home.starting.filter((p) => p.name && p.name.trim()).length;
  const awayCount = state.lineups.away.starting.filter((p) => p.name && p.name.trim()).length;
  if (el.lineupTabHomeCount) el.lineupTabHomeCount.textContent = `${homeCount}/11`;
  if (el.lineupTabAwayCount) el.lineupTabAwayCount.textContent = `${awayCount}/11`;

  if (el.lineupSideTabs) {
    el.lineupSideTabs.querySelectorAll('.mm-lineup-tab').forEach((btn) => {
      const side = btn.getAttribute('data-lineup-side');
      const active = side === state.activeLineupSide;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  syncAutoWomenManagersForForm();

  const side = state.activeLineupSide === 'away' ? 'away' : 'home';
  const teamName = String(side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value || '').trim();
  const teamType = el.fieldTeamType?.value || 'M';
  const squadControlKey = `${side}|${teamType}|${teamName}|${state.lang}|${state.womenSquads.length}|${state.playersMen.length}|${state.playersWomen.length}|${state.allMergedMatches.length}`;

  if (el.lineupManagerInput && document.activeElement !== el.lineupManagerInput) {
    el.lineupManagerInput.value = state.lineups[side]?.manager || '';
  }

  const sidePool = getSquadPoolForSide(side);
  const hasPool = sidePool.length > 0;
  if (el.lineupAutoChelseaBtn) {
    el.lineupAutoChelseaBtn.style.display = hasPool ? 'inline-flex' : 'none';
  }
  if (el.lineupChelseaQuickWrap) {
    el.lineupChelseaQuickWrap.style.display = hasPool ? 'block' : 'none';
  }

  if (squadControlKey !== lastActiveSquadControlKey) {
    lastActiveSquadControlKey = squadControlKey;
    if (hasPool) {
      populateActiveSideSquadControls();
    } else {
      if (el.lineupPlayersDatalist) el.lineupPlayersDatalist.innerHTML = '';
      if (el.lineupNumbersDatalist) el.lineupNumbersDatalist.innerHTML = '';
    }
  }

  const syncRowDatalist = (container, selector, listId) => {
    if (!container) return;
    container.querySelectorAll(selector).forEach((inputEl) => {
      if (hasPool) {
        if (inputEl.getAttribute('list') !== listId) {
          inputEl.setAttribute('list', listId);
        }
      } else if (inputEl.hasAttribute('list')) {
        inputEl.removeAttribute('list');
      }
    });
  };
  syncRowDatalist(el.lineupStartingContainer, '.lineup-name-input', 'lineupPlayersDatalist');
  syncRowDatalist(el.lineupSubsContainer, '.lineup-sub-name-input', 'lineupPlayersDatalist');
  syncRowDatalist(el.lineupStartingContainer, '.lineup-num-input', 'lineupNumbersDatalist');
  syncRowDatalist(el.lineupSubsContainer, '.lineup-sub-num-input', 'lineupNumbersDatalist');
}

function renderPositionSelectHTML(currentPos, extraClass = '') {
  const val = String(currentPos || '').trim();
  const hasKnown = LINEUP_POSITION_OPTIONS.includes(val);
  const options = hasKnown || !val ? LINEUP_POSITION_OPTIONS : [val, ...LINEUP_POSITION_OPTIONS];
  return `
    <select class="mm-select ${extraClass}" aria-label="Position">
      <option value="">—</option>
      ${options.map((pos) => `<option value="${escapeHtml(pos)}" ${pos === val ? 'selected' : ''}>${escapeHtml(pos)}</option>`).join('')}
    </select>
  `;
}

function handleLineupNumberInput(side, row, rawVal, nameInput, posSelect, idx, isSub) {
  const numStr = String(rawVal ?? '').trim();
  row.number = rawVal;

  const currentName = String(row.name || '').trim();
  const canUpdateName = !currentName || (row._autoNameFromNum && currentName === row._autoNameFromNum);

  if (!numStr) {
    if (row._autoNameFromNum && currentName === row._autoNameFromNum) {
      row.name = '';
      if (nameInput) nameInput.value = '';
    }
    row._autoNameFromNum = '';
    if (row._autoPosFromNum && row.position === row._autoPosFromNum) {
      row.position = row._autoPosPrev ?? '';
      if (posSelect) posSelect.value = row.position;
    }
    row._autoPosFromNum = '';
    updateLineupSideUI();
    renderLineupLivePreview();
    return;
  }

  const matched = pickBestPlayerByNumber(numStr, side, idx, isSub);
  if (matched && matched.name) {
    if (canUpdateName) {
      row.name = matched.name;
      if (nameInput) nameInput.value = matched.name;
      row._autoNameFromNum = matched.name;
    }
    const canUpdatePos = !row.position || (row._autoPosFromNum && row.position === row._autoPosFromNum);
    if (canUpdatePos) {
      if (row._autoPosFromNum === undefined || row._autoPosFromNum === '') {
        row._autoPosPrev = row.position || '';
      }
      const shortPos = mapSquadPosToShortTag(matched.position);
      if (shortPos) {
        row.position = shortPos;
        if (posSelect) posSelect.value = shortPos;
        row._autoPosFromNum = shortPos;
      }
    }
  } else {
    if (row._autoNameFromNum && currentName === row._autoNameFromNum) {
      row.name = '';
      if (nameInput) nameInput.value = '';
    }
    row._autoNameFromNum = '';
    if (row._autoPosFromNum && row.position === row._autoPosFromNum) {
      row.position = row._autoPosPrev ?? '';
      if (posSelect) posSelect.value = row.position;
    }
    row._autoPosFromNum = '';
  }

  updateLineupSideUI();
  syncChelseaSummaryFieldsFromLineup();
  renderLineupLivePreview();
}

function focusNextLineupNumberInput(container, currentInput) {
  if (!container || !currentInput) return;
  const inputs = Array.from(container.querySelectorAll('.lineup-num-input, .lineup-sub-num-input'));
  const pos = inputs.indexOf(currentInput);
  if (pos >= 0 && pos + 1 < inputs.length) {
    inputs[pos + 1].focus();
    inputs[pos + 1].select?.();
  }
}

function renderLineupEditor() {
  const side = state.activeLineupSide === 'away' ? 'away' : 'home';
  const sideData = state.lineups[side];
  const sidePool = getSquadPoolForSide(side);
  const hasSidePool = sidePool.length > 0;
  const numTitleHint = state.lang === 'th'
    ? 'กรอกหมายเลขเสื้อ # เพื่อดึงชื่อนักเตะอัตโนมัติ (กด Enter เพื่อไปช่องถัดไป)'
    : 'Enter shirt # to auto-fill player name (press Enter for next slot)';

  updateLineupSideUI();

  if (el.lineupFormationSelect && el.lineupFormationCustom) {
    const fVal = String(sideData.formation || '4-2-3-1').trim();
    if (FORMATION_PRESETS.includes(fVal)) {
      el.lineupFormationSelect.value = fVal;
      el.lineupFormationCustom.style.display = 'none';
      el.lineupFormationCustom.value = '';
    } else {
      el.lineupFormationSelect.value = '__custom__';
      el.lineupFormationCustom.style.display = 'block';
      el.lineupFormationCustom.value = fVal;
    }
  }

  if (el.lineupManagerInput) {
    el.lineupManagerInput.value = sideData.manager || '';
  }

  // Render Starting XI
  if (el.lineupStartingContainer) {
    if (sideData.starting.length === 0) {
      el.lineupStartingContainer.innerHTML = `<div class="mm-panel-meta" style="padding: 8px 0">${escapeHtml(t('lineupNoStarters'))}</div>`;
    } else {
      const headerHtml = `
        <div class="mm-lineup-grid-header">
          <span>#</span>
          <span>${escapeHtml(t('lineupColNum'))}</span>
          <span>${escapeHtml(t('lineupColPlayer'))}</span>
          <span>${escapeHtml(t('lineupColPos'))}</span>
          <span style="text-align:center">${escapeHtml(t('lineupColCap'))}</span>
          <span style="text-align:right">${escapeHtml(t('lineupColOps'))}</span>
        </div>
      `;
      const rowsHtml = sideData.starting.map((p, idx) => `
        <div class="mm-lineup-row" data-starter-idx="${idx}">
          <span class="mm-lineup-slot-idx">${String(idx + 1).padStart(2, '0')}</span>
          <input type="number" min="1" max="99" class="mm-input mono lineup-num-input" ${hasSidePool ? 'list="lineupNumbersDatalist"' : ''} value="${escapeHtml(p.number ?? '')}" placeholder="#" title="${escapeHtml(numTitleHint)}" />
          <input type="text" class="mm-input lineup-name-input" ${hasSidePool ? 'list="lineupPlayersDatalist"' : ''} value="${escapeHtml(p.name || '')}" placeholder="${escapeHtml(t('lineupPlayerPlaceholder'))}" />
          ${renderPositionSelectHTML(p.position, 'lineup-pos-select')}
          <button type="button" class="mm-cap-btn ${p.captain ? 'active' : ''}" title="${escapeHtml(t('lineupColCap'))}" aria-pressed="${p.captain ? 'true' : 'false'}">C</button>
          <div class="mm-row-ops">
            <button type="button" class="mm-mini-op-btn lineup-up-btn" ${idx === 0 ? 'disabled' : ''} title="Move Up">↑</button>
            <button type="button" class="mm-mini-op-btn lineup-down-btn" ${idx === sideData.starting.length - 1 ? 'disabled' : ''} title="Move Down">↓</button>
            <button type="button" class="mm-mini-op-btn is-del lineup-del-btn" title="Remove">✕</button>
          </div>
        </div>
      `).join('');

      el.lineupStartingContainer.innerHTML = headerHtml + rowsHtml;

      el.lineupStartingContainer.querySelectorAll('.mm-lineup-row').forEach((rowEl) => {
        const idx = Number(rowEl.getAttribute('data-starter-idx'));
        const numInput = rowEl.querySelector('.lineup-num-input');
        const nameInput = rowEl.querySelector('.lineup-name-input');
        const posSelect = rowEl.querySelector('.lineup-pos-select');
        const capBtn = rowEl.querySelector('.mm-cap-btn');

        numInput.addEventListener('input', (e) => {
          handleLineupNumberInput(side, sideData.starting[idx], e.target.value, nameInput, posSelect, idx, false);
        });

        numInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            focusNextLineupNumberInput(el.lineupStartingContainer, numInput);
          }
        });

        nameInput.addEventListener('input', (e) => {
          const val = e.target.value;
          sideData.starting[idx]._autoNameFromNum = '';
          sideData.starting[idx].name = val;
          const activePool = getSquadPoolForSide(side);
          if (activePool.length > 0) {
            const matched = findPlayerInPool(val, '', activePool);
            if (matched && normalizePlayerNameForMatch(matched.name) === normalizePlayerNameForMatch(val)) {
              if (matched.number !== undefined && matched.number !== null) {
                sideData.starting[idx].number = matched.number;
                numInput.value = matched.number;
              }
              if (!sideData.starting[idx].position) {
                const shortPos = mapSquadPosToShortTag(matched.position);
                sideData.starting[idx].position = shortPos;
                posSelect.value = shortPos;
              }
            }
          }
          updateLineupSideUI();
          renderLineupLivePreview();
        });

        posSelect.addEventListener('change', (e) => {
          sideData.starting[idx]._autoPosFromNum = '';
          sideData.starting[idx].position = e.target.value;
          renderLineupLivePreview();
        });

        capBtn.addEventListener('click', () => {
          const nextState = !sideData.starting[idx].captain;
          sideData.starting.forEach((item, i) => {
            item.captain = i === idx ? nextState : false;
          });
          syncChelseaSummaryFieldsFromLineup();
          renderLineupEditor();
        });

        rowEl.querySelector('.lineup-up-btn').addEventListener('click', () => {
          if (idx <= 0) return;
          const tmp = sideData.starting[idx - 1];
          sideData.starting[idx - 1] = sideData.starting[idx];
          sideData.starting[idx] = tmp;
          renderLineupEditor();
        });

        rowEl.querySelector('.lineup-down-btn').addEventListener('click', () => {
          if (idx >= sideData.starting.length - 1) return;
          const tmp = sideData.starting[idx + 1];
          sideData.starting[idx + 1] = sideData.starting[idx];
          sideData.starting[idx] = tmp;
          renderLineupEditor();
        });

        rowEl.querySelector('.lineup-del-btn').addEventListener('click', () => {
          sideData.starting.splice(idx, 1);
          renderLineupEditor();
        });
      });
    }
  }

  // Render Substitutes
  if (el.lineupSubsContainer) {
    if (sideData.substitutes.length === 0) {
      el.lineupSubsContainer.innerHTML = `<div class="mm-panel-meta" style="padding: 6px 0">${escapeHtml(t('lineupNoSubs'))}</div>`;
    } else {
      el.lineupSubsContainer.innerHTML = sideData.substitutes.map((s, idx) => `
        <div class="mm-lineup-row is-sub" data-sub-idx="${idx}">
          <span class="mm-lineup-slot-idx">S${idx + 1}</span>
          <input type="number" min="1" max="99" class="mm-input mono lineup-sub-num-input" ${hasSidePool ? 'list="lineupNumbersDatalist"' : ''} value="${escapeHtml(s.number ?? '')}" placeholder="#" title="${escapeHtml(numTitleHint)}" />
          <input type="text" class="mm-input lineup-sub-name-input" ${hasSidePool ? 'list="lineupPlayersDatalist"' : ''} value="${escapeHtml(s.name || '')}" placeholder="${escapeHtml(t('lineupPlayerPlaceholder'))}" />
          ${renderPositionSelectHTML(s.position, 'lineup-sub-pos-select')}
          <button type="button" class="mm-mini-op-btn is-del lineup-sub-del-btn" title="Remove">✕</button>
        </div>
      `).join('');

      el.lineupSubsContainer.querySelectorAll('.mm-lineup-row.is-sub').forEach((rowEl) => {
        const idx = Number(rowEl.getAttribute('data-sub-idx'));
        const numInput = rowEl.querySelector('.lineup-sub-num-input');
        const nameInput = rowEl.querySelector('.lineup-sub-name-input');
        const posSelect = rowEl.querySelector('.lineup-sub-pos-select');

        numInput.addEventListener('input', (e) => {
          handleLineupNumberInput(side, sideData.substitutes[idx], e.target.value, nameInput, posSelect, idx, true);
        });

        numInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            focusNextLineupNumberInput(el.lineupSubsContainer, numInput);
          }
        });

        nameInput.addEventListener('input', (e) => {
          const val = e.target.value;
          sideData.substitutes[idx]._autoNameFromNum = '';
          sideData.substitutes[idx].name = val;
          const activePool = getSquadPoolForSide(side);
          if (activePool.length > 0) {
            const matched = findPlayerInPool(val, '', activePool);
            if (matched && normalizePlayerNameForMatch(matched.name) === normalizePlayerNameForMatch(val)) {
              if (matched.number !== undefined && matched.number !== null) {
                sideData.substitutes[idx].number = matched.number;
                numInput.value = matched.number;
              }
              if (!sideData.substitutes[idx].position) {
                const shortPos = mapSquadPosToShortTag(matched.position);
                sideData.substitutes[idx].position = shortPos;
                posSelect.value = shortPos;
              }
            }
          }
          renderLineupLivePreview();
        });

        posSelect.addEventListener('change', (e) => {
          sideData.substitutes[idx]._autoPosFromNum = '';
          sideData.substitutes[idx].position = e.target.value;
          renderLineupLivePreview();
        });

        rowEl.querySelector('.lineup-sub-del-btn').addEventListener('click', () => {
          sideData.substitutes.splice(idx, 1);
          renderLineupEditor();
        });
      });
    }
  }

  renderLineupLivePreview();
}

function buildLineupsObjectForSave() {
  const serializeSide = (sideData) => {
    const starting = sideData.starting
      .filter((p) => p.name && p.name.trim())
      .map((p, idx) => serializeLineupRowForOutput(p, idx, true));
    const substitutes = sideData.substitutes
      .filter((p) => p.name && p.name.trim())
      .map((p, idx) => serializeLineupRowForOutput(p, idx, false));
    const manager = String(sideData.manager || '').trim();
    const hasManualManager = Boolean(manager && manager !== '-' && manager !== sideData._autoManager);
    const formation = String(sideData.formation || '').trim();
    if (starting.length === 0 && substitutes.length === 0 && !hasManualManager) {
      return null;
    }
    return {
      manager: manager || '-',
      formation: formation || '4-2-3-1',
      starting,
      substitutes,
    };
  };

  const homeObj = serializeSide(state.lineups.home);
  const awayObj = serializeSide(state.lineups.away);
  if (!homeObj && !awayObj) return null;

  return {
    ...(homeObj ? { home: homeObj } : { home: { manager: '-', formation: state.lineups.home.formation || '4-2-3-1', starting: [], substitutes: [] } }),
    ...(awayObj ? { away: awayObj } : { away: { manager: '-', formation: state.lineups.away.formation || '4-2-3-1', starting: [], substitutes: [] } }),
  };
}

function renderLineupLivePreview() {
  if (!el.lineupLivePreview) return;
  if (el.lineupTogglePreviewBtn) {
    el.lineupTogglePreviewBtn.textContent = state.lineupPreviewVisible ? t('lineupHidePreview') : t('lineupShowPreview');
  }
  if (!state.lineupPreviewVisible) {
    el.lineupLivePreview.style.display = 'none';
    return;
  }
  el.lineupLivePreview.style.display = 'block';

  const lineupsObj = buildLineupsObjectForSave();
  const hasAnyStarter = Boolean(
    lineupsObj &&
    ((lineupsObj.home?.starting?.length || 0) > 0 || (lineupsObj.away?.starting?.length || 0) > 0)
  );

  if (!hasAnyStarter || !window.TacticalLineup) {
    el.lineupLivePreview.innerHTML = `
      <div class="empty-tab-box">
        <strong>📋 ${escapeHtml(t('lineupPreviewEmpty'))}</strong>
      </div>
    `;
    return;
  }

  const previewMatch = {
    home_team: el.fieldHomeTeam.value.trim() || 'Home',
    home_logo: el.fieldHomeLogo.value.trim() || 'assets/images/placeholder-team.svg',
    away_team: el.fieldAwayTeam.value.trim() || 'Away',
    away_logo: el.fieldAwayLogo.value.trim() || 'assets/images/placeholder-team.svg',
    team_type: el.fieldTeamType.value === 'W' ? 'W' : 'M',
    referee: el.fieldReferee.value.trim() || '',
    goals: state.goals.filter((g) => g.player && g.player.trim()),
    lineups: lineupsObj,
  };

  el.lineupLivePreview.innerHTML = window.TacticalLineup.renderTacticalLineupsHTML(previewMatch, {
    isTh: state.lang === 'th',
    teamType: previewMatch.team_type === 'W' ? 'women' : 'men',
    resolveChelseaPlayer: resolveChelseaPlayerForPreview,
  });
}

function initSlotsForSide(side) {
  const sideData = state.lineups[side];
  const slots = getPositionsForFormation(sideData.formation);
  const nextStarting = [];
  for (let i = 0; i < 11; i++) {
    const existing = sideData.starting[i];
    if (existing) {
      nextStarting.push({
        ...existing,
        position: existing.position || slots[i] || '',
      });
    } else {
      nextStarting.push({
        number: '',
        name: '',
        position: slots[i] || '',
        captain: false,
        _extra: {},
      });
    }
  }
  sideData.starting = nextStarting;
  renderLineupEditor();
}

function autoFillSideLineup(side) {
  const pool = getSquadPoolForSide(side);
  if (pool.length === 0) {
    showToast(t('lineupNoChelseaPool'), 'error');
    return;
  }
  const sideData = state.lineups[side];
  const slots = getPositionsForFormation(sideData.formation);
  const usedKeys = new Set();
  const teamLabel = (side === 'home' ? el.fieldHomeTeam?.value : el.fieldAwayTeam?.value || '').trim() || side;

  const keyOf = (p) => String(p.id || `${p.name}_${p.number ?? ''}`);
  const roleOf = (p) => String(p.role || p.position || '').toLowerCase();
  const sortedPool = pool.slice().sort((a, b) => {
    const appDiff = (Number(b.appearances) || 0) - (Number(a.appearances) || 0);
    if (appDiff !== 0) return appDiff;
    return (Number(a.number) || 999) - (Number(b.number) || 999);
  });

  const pickByRole = (slotPos) => {
    const s = String(slotPos || '').toUpperCase();
    let targetGroup = 'midfielder';
    if (s === 'GK') targetGroup = 'goalkeeper';
    else if (['RB', 'CB', 'LB', 'RWB', 'LWB', 'DF'].includes(s)) targetGroup = 'defender';
    else if (['RW', 'LW', 'ST', 'FW'].includes(s)) targetGroup = 'forward';

    const exactPos = sortedPool.find((p) => !usedKeys.has(keyOf(p)) && String(p.position || '').toUpperCase() === s);
    const groupMatch = sortedPool.find((p) => !usedKeys.has(keyOf(p)) && roleOf(p).includes(targetGroup));
    const fallback = sortedPool.find((p) => !usedKeys.has(keyOf(p)));
    const found = exactPos || groupMatch || fallback;
    if (found) usedKeys.add(keyOf(found));
    return found || null;
  };

  sideData.starting = slots.map((slotPos, idx) => {
    const picked = pickByRole(slotPos);
    return {
      number: picked?.number ?? '',
      name: picked?.name || '',
      position: slotPos,
      captain: idx === 2,
      _extra: {},
    };
  });

  const benchGk = sortedPool.find((p) => !usedKeys.has(keyOf(p)) && (roleOf(p).includes('goalkeeper') || String(p.position || '').toUpperCase() === 'GK'));
  const benchList = [];
  if (benchGk) {
    usedKeys.add(keyOf(benchGk));
    benchList.push(benchGk);
  }
  sortedPool.forEach((p) => {
    if (!usedKeys.has(keyOf(p)) && benchList.length < 9) {
      usedKeys.add(keyOf(p));
      benchList.push(p);
    }
  });

  sideData.substitutes = benchList.map((p) => ({
    number: p.number ?? '',
    name: p.name,
    position: mapSquadPosToShortTag(p.position || p.role),
    captain: false,
    _extra: {},
  }));

  if (!sideData.manager) {
    const wMgr = getWomenClubManagerForSide(side);
    if (wMgr) {
      sideData.manager = wMgr;
      sideData._autoManager = wMgr;
    } else if (isSideChelsea(side)) {
      const teamType = el.fieldTeamType.value;
      const latestWithMgr = state.matches.find((m) => {
        if ((m.team_type === 'W' ? 'W' : 'M') !== teamType) return false;
        const hC = String(m.home_team || '').toLowerCase().includes('chelsea');
        const aC = String(m.away_team || '').toLowerCase().includes('chelsea');
        const mObj = hC ? m.lineups?.home : aC ? m.lineups?.away : null;
        return mObj?.manager && mObj.manager !== '-';
      });
      if (latestWithMgr) {
        const hC = String(latestWithMgr.home_team || '').toLowerCase().includes('chelsea');
        sideData.manager = (hC ? latestWithMgr.lineups.home.manager : latestWithMgr.lineups.away.manager) || '';
      }
    }
  }

  state.lineupClearedExplicitly = false;
  syncChelseaSummaryFieldsFromLineup();
  renderLineupEditor();
  showToast(t('lineupAutoFilled')(teamLabel), 'success');
}

function copyLatestLineupForActiveSide() {
  const side = state.activeLineupSide === 'away' ? 'away' : 'home';
  const targetTeam = String(side === 'home' ? el.fieldHomeTeam.value : el.fieldAwayTeam.value).trim().toLowerCase();
  const targetType = el.fieldTeamType.value;

  const sorted = state.matches.slice().sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  let matchedSideData = null;

  for (const m of sorted) {
    if (String(m.id) === String(state.editingId)) continue;
    const mType = m.team_type === 'W' ? 'W' : 'M';
    if (mType !== targetType) continue;
    const hName = String(m.home_team || '').toLowerCase();
    const aName = String(m.away_team || '').toLowerCase();

    if (targetTeam && hName === targetTeam && m.lineups?.home?.starting?.length) {
      matchedSideData = m.lineups.home;
      break;
    }
    if (targetTeam && aName === targetTeam && m.lineups?.away?.starting?.length) {
      matchedSideData = m.lineups.away;
      break;
    }
    if (targetTeam.includes('chelsea')) {
      if (hName.includes('chelsea') && m.lineups?.home?.starting?.length) {
        matchedSideData = m.lineups.home;
        break;
      }
      if (aName.includes('chelsea') && m.lineups?.away?.starting?.length) {
        matchedSideData = m.lineups.away;
        break;
      }
    }
  }

  if (!matchedSideData) {
    showToast(t('lineupNoLatestFound'), 'error');
    return;
  }

  state.lineups[side] = {
    manager: matchedSideData.manager && matchedSideData.manager !== '-' ? matchedSideData.manager : '',
    formation: matchedSideData.formation || '4-2-3-1',
    starting: (matchedSideData.starting || []).map((p) => {
      const normalized = normalizeLineupRowFromMatch(p);
      // Clear previous match-specific live stats/cards/subs when copying as pre-match template
      return {
        number: normalized.number,
        name: normalized.name,
        position: normalized.position,
        captain: normalized.captain,
        _extra: {},
      };
    }),
    substitutes: (matchedSideData.substitutes || []).map((p) => {
      const normalized = normalizeLineupRowFromMatch(p);
      return {
        number: normalized.number,
        name: normalized.name,
        position: normalized.position,
        captain: false,
        _extra: {},
      };
    }),
  };

  state.lineupClearedExplicitly = false;
  syncChelseaSummaryFieldsFromLineup();
  renderLineupEditor();
  const displayTeam = (side === 'home' ? el.fieldHomeTeam.value : el.fieldAwayTeam.value).trim() || side;
  showToast(t('lineupCopiedLatest')(displayTeam), 'success');
}

function resetForm(defaultStatus = 'upcoming') {
  state.editingId = null;
  el.fieldId.value = '';
  el.fieldId.readOnly = false;
  setFormStatus(defaultStatus);
  setFormTeamType(state.filters.team === 'W' ? 'W' : 'M');

  const isW = el.fieldTeamType.value === 'W';
  el.fieldCompetition.value = isW ? "Barclays Women's Super League" : 'premier-league';
  el.customCompWrap.style.display = 'none';
  el.fieldCustomCompetition.value = '';
  syncCompetitionPickerUI();
  el.fieldRound.value = '';
  setFieldDateValue(new Date().toISOString().slice(0, 10));
  setSideTimeValue('th', 'TBC');
  setSideTimeValue('uk', 'TBC');
  state.lastTimeSource = 'th';
  updateTimeSyncHints();
  el.fieldVenue.value = isW ? 'Kingsmeadow' : 'Stamford Bridge';

  el.fieldHomeTeam.value = isW ? 'Chelsea Women' : 'Chelsea';
  el.fieldHomeLogo.value = 'databases/logo/teams/england_chelsea.svg';
  el.fieldAwayTeam.value = '';
  el.fieldAwayLogo.value = 'assets/images/placeholder-team.svg';

  el.fieldHomeScore.value = '';
  el.fieldAwayScore.value = '';
  state.goals = [];
  state.selectedChannels = new Set([isW ? 'CFC+ Live' : 'MONOMAX SPORTS TV']);

  state.activeLineupSide = 'home';
  state.hadLineupsOnLoad = false;
  state.lineupClearedExplicitly = false;
  state.lineups = {
    home: createEmptyLineupSide('4-2-3-1'),
    away: createEmptyLineupSide('4-2-3-1'),
  };

  el.fieldReferee.value = '';
  el.fieldAttendance.value = '';
  el.fieldFormation.value = '';
  el.fieldCaptain.value = '';
  el.fieldPoss.value = '';
  el.fieldXg.value = '';
  el.fieldNotes.value = '';

  updateTeamPreviews();
  renderChannelsGrid();
  renderGoalsEditor();
  renderLineupEditor();
  updateFormHeaderUI();
  renderMatchList();
}

function loadMatchIntoForm(match, forceStatus = null) {
  if (!match) return;
  state.editingId = String(match.id);
  el.fieldId.value = String(match.id);
  el.fieldId.readOnly = true;

  const targetStatus = forceStatus || (match.status === 'halftime' ? 'live' : match.status || 'upcoming');
  setFormStatus(targetStatus);
  setFormTeamType(match.team_type === 'W' ? 'W' : 'M');

  const compVal = match.competition || match.competition_name || 'premier-league';
  const hasOption = Array.from(el.fieldCompetition.options).some((opt) => opt.value === compVal);
  if (hasOption) {
    el.fieldCompetition.value = compVal;
    el.customCompWrap.style.display = 'none';
    el.fieldCustomCompetition.value = '';
  } else {
    el.fieldCompetition.value = '__custom__';
    el.customCompWrap.style.display = 'flex';
    el.fieldCustomCompetition.value = compVal;
  }
  syncCompetitionPickerUI();

  el.fieldRound.value = match.round || '';
  setFieldDateValue(match.date || '');
  const loadedTh = normalizeHHMM(match.time_th || match.time);
  const loadedUk = normalizeHHMM(match.time_uk);
  if (loadedTh && loadedUk) {
    setSideTimeValue('th', loadedTh);
    setSideTimeValue('uk', loadedUk);
    state.lastTimeSource = 'th';
  } else if (loadedTh) {
    setSideTimeValue('th', loadedTh);
    syncTimesFromTh();
  } else if (loadedUk) {
    setSideTimeValue('uk', loadedUk);
    syncTimesFromUk();
  } else {
    setSideTimeValue('th', 'TBC');
    setSideTimeValue('uk', 'TBC');
  }
  updateTimeSyncHints();
  el.fieldVenue.value = match.venue || '';

  el.fieldHomeTeam.value = match.home_team || '';
  el.fieldAwayTeam.value = match.away_team || '';
  el.fieldHomeLogo.value = match.home_logo || resolveLogoPath(match.home_team);
  el.fieldAwayLogo.value = match.away_logo || resolveLogoPath(match.away_team);

  el.fieldHomeScore.value = match.home_score !== null && match.home_score !== undefined ? match.home_score : '';
  el.fieldAwayScore.value = match.away_score !== null && match.away_score !== undefined ? match.away_score : '';

  state.goals = Array.isArray(match.goals)
    ? match.goals.map((g) => ({
        team: g.team === 'away' ? 'away' : 'home',
        player: g.player || '',
        minute: g.minute ?? '',
        penalty: Boolean(g.penalty || g.detail === 'Penalty'),
        own_goal: Boolean(g.own_goal || g.detail === 'Own Goal'),
      }))
    : [];

  state.selectedChannels = new Set(
    Array.isArray(match.channels)
      ? match.channels.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean)
      : []
  );

  el.fieldReferee.value = match.referee || match.officials?.referee || '';
  el.fieldAttendance.value = match.attendance ?? '';
  el.fieldFormation.value = match.formation || '';
  el.fieldCaptain.value = match.captain || '';
  el.fieldPoss.value = match.poss ?? '';
  el.fieldXg.value = match.xg ?? '';
  el.fieldNotes.value = match.notes || '';

  const hasSavedLineups = Boolean(match.lineups && (match.lineups.home || match.lineups.away));
  state.hadLineupsOnLoad = hasSavedLineups;
  state.lineupClearedExplicitly = false;
  const hydrateSide = (srcSide, fallbackFormation) => ({
    manager: srcSide?.manager && srcSide.manager !== '-' ? srcSide.manager : '',
    formation: srcSide?.formation || fallbackFormation || '4-2-3-1',
    starting: Array.isArray(srcSide?.starting) ? srcSide.starting.map(normalizeLineupRowFromMatch) : [],
    substitutes: Array.isArray(srcSide?.substitutes) ? srcSide.substitutes.map(normalizeLineupRowFromMatch) : [],
  });
  const isHomeChelsea = String(match.home_team || '').toLowerCase().includes('chelsea');
  state.activeLineupSide = isHomeChelsea ? 'home' : 'away';
  state.lineups = {
    home: hydrateSide(match.lineups?.home, match.formation || '4-2-3-1'),
    away: hydrateSide(match.lineups?.away, '4-2-3-1'),
  };

  updateTeamPreviews();
  renderChannelsGrid();
  renderGoalsEditor();
  renderLineupEditor();
  updateFormHeaderUI();
  renderMatchList();

  if (forceStatus === 'completed') {
    el.fieldHomeScore.focus();
  }
}

function buildPayloadFromForm() {
  const compSelected = el.fieldCompetition.value;
  const competition =
    compSelected === '__custom__' ? el.fieldCustomCompetition.value.trim() : compSelected;
  const competitionLogo = getLogoForCompetition(competition);

  const channels = Array.from(state.selectedChannels).map((name) => {
    const found = KNOWN_CHANNELS.find((c) => c.name === name);
    return found || { platform: name, name, logo: '' };
  });

  const status = el.fieldStatus.value;
  const hasScores = status === 'completed' || status === 'live';

  const thTimeVal = getEffectiveTimeValue('th');
  const ukTimeVal = getEffectiveTimeValue('uk');

  const lineupsPayload = buildLineupsObjectForSave();
  const lineupsField = lineupsPayload
    ? { lineups: lineupsPayload }
    : state.lineupClearedExplicitly && state.hadLineupsOnLoad
    ? { lineups: null }
    : {};

  const normalizedDate = normalizeIsoDate(el.fieldDate.value);
  const payload = {
    id: el.fieldId.value.trim() || undefined,
    date: normalizedDate || el.fieldDate.value.trim(),
    time: thTimeVal || 'TBC',
    time_th: thTimeVal || 'TBC',
    ...(ukTimeVal && ukTimeVal !== 'TBC' ? { time_uk: ukTimeVal } : {}),
    competition,
    competition_name: competition,
    competition_logo: competitionLogo,
    round: el.fieldRound.value.trim() || undefined,
    home_team: el.fieldHomeTeam.value.trim(),
    home_logo: el.fieldHomeLogo.value.trim() || 'assets/images/placeholder-team.svg',
    away_team: el.fieldAwayTeam.value.trim(),
    away_logo: el.fieldAwayLogo.value.trim() || 'assets/images/placeholder-team.svg',
    venue: el.fieldVenue.value.trim(),
    status,
    team_type: el.fieldTeamType.value === 'W' ? 'W' : 'M',
    home_score: hasScores && el.fieldHomeScore.value !== '' ? Number(el.fieldHomeScore.value) : null,
    away_score: hasScores && el.fieldAwayScore.value !== '' ? Number(el.fieldAwayScore.value) : null,
    goals: state.goals
      .filter((g) => g.player && g.player.trim())
      .map((g) => ({
        team: g.team === 'away' ? 'away' : 'home',
        player: g.player.trim(),
        minute: g.minute !== '' && !isNaN(Number(g.minute)) ? Number(g.minute) : String(g.minute || '').trim(),
        ...(g.penalty ? { penalty: true, detail: 'Penalty' } : {}),
        ...(g.own_goal ? { own_goal: true, detail: 'Own Goal' } : {}),
      })),
    channels,
    ...(el.fieldReferee.value.trim() ? { referee: el.fieldReferee.value.trim() } : {}),
    ...(el.fieldAttendance.value !== '' ? { attendance: Number(el.fieldAttendance.value) } : {}),
    ...(el.fieldFormation.value.trim() ? { formation: el.fieldFormation.value.trim() } : {}),
    ...(el.fieldCaptain.value.trim() ? { captain: el.fieldCaptain.value.trim() } : {}),
    ...(el.fieldPoss.value !== '' ? { poss: Number(el.fieldPoss.value) } : {}),
    ...(el.fieldXg.value !== '' ? { xg: Number(el.fieldXg.value) } : {}),
    ...(el.fieldNotes.value.trim() ? { notes: el.fieldNotes.value.trim() } : {}),
    ...lineupsField,
  };

  return payload;
}

function getSeasonFromDateStr(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.split('-');
  if (parts.length < 2) return '';
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  if (isNaN(year) || isNaN(month)) return '';
  const startYear = month >= 7 ? year : year - 1;
  const endShort = String((startYear + 1) % 100).padStart(2, '0');
  return `${startYear}/${endShort}`;
}

function normalizeMatchTeamType(match) {
  if (!match) return 'M';
  if (match.team_type === 'W' || match.team_type === 'women') return 'W';
  if (match.team_type === 'M' || match.team_type === 'men') return 'M';
  const idStr = String(match.id || '').toLowerCase();
  const home = String(match.home_team || '').toLowerCase();
  const away = String(match.away_team || '').toLowerCase();
  const comp = String(match.competition || '').toLowerCase();
  if (
    idStr.startsWith('w') ||
    home.includes('women') ||
    away.includes('women') ||
    comp.includes('women') ||
    comp.includes('wsl')
  ) {
    return 'W';
  }
  return 'M';
}

function normalizeMatchCompSlug(comp) {
  const c = String(comp || '').toLowerCase();
  if (!c) return 'other';
  if (c.includes('premier-league') || c.includes('premier league')) return 'premier-league';
  if (c.includes('wsl') || c.includes("women's super league")) return 'wsl';
  if (c.includes('uwcl') || (c.includes('champions league') && c.includes('women'))) return 'uwcl';
  if (c.includes('champions league') || c === 'ucl' || c === 'cl') return 'champions-league';
  if (c.includes('fa cup') || c.includes('fa-cup')) return 'fa-cup';
  if (c.includes('carabao') || c.includes('efl') || c.includes('league cup') || c.includes('league-cup')) return 'league-cup';
  if (c.includes('friendly')) return 'friendly';
  if (c.includes('club-world-cup') || c.includes('club world cup')) return 'club-world-cup';
  return c.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getChelseaMatchOutcome(match) {
  if (match.status !== 'completed' || match.home_score === null || match.away_score === null) return '';
  const hs = Number(match.home_score);
  const as = Number(match.away_score);
  if (isNaN(hs) || isNaN(as)) return '';
  const homeChelsea = String(match.home_team || '').toLowerCase().includes('chelsea');
  const awayChelsea = String(match.away_team || '').toLowerCase().includes('chelsea');
  if (!homeChelsea && !awayChelsea) return '';
  const chelseaScore = homeChelsea ? hs : as;
  const oppScore = homeChelsea ? as : hs;
  if (chelseaScore > oppScore) return 'W';
  if (chelseaScore < oppScore) return 'L';
  return 'D';
}

async function ensureBaseCatalogLoaded() {
  if (state.baseCatalogLoaded) return state.baseMatches;

  const [mainRes, womenRes] = await Promise.allSettled([
    fetch('data/fixtures.json').then((r) => (r.ok ? r.json() : [])),
    fetch('data/fixtures-women.json').then((r) => (r.ok ? r.json() : [])),
  ]);

  const byId = new Map();
  if (mainRes.status === 'fulfilled' && Array.isArray(mainRes.value)) {
    mainRes.value.forEach((m) => {
      if (!m || m.id == null) return;
      byId.set(String(m.id), { ...m, team_type: normalizeMatchTeamType(m) });
    });
  }
  if (womenRes.status === 'fulfilled' && Array.isArray(womenRes.value)) {
    womenRes.value.forEach((wm) => {
      if (!wm || wm.id == null) return;
      const key = String(wm.id);
      const existing = byId.get(key) || {};
      byId.set(key, { ...existing, ...wm, team_type: 'W' });
    });
  }

  state.baseMatches = Array.from(byId.values());
  state.baseCatalogLoaded = true;
  return state.baseMatches;
}

function rebuildMergedCatalog() {
  const merged = window.KlknFirebase
    ? window.KlknFirebase.mergeMatchesWithCloud(state.baseMatches, state.cloudMatches)
    : [...state.baseMatches];
  merged.forEach((m) => {
    m.team_type = normalizeMatchTeamType(m);
  });
  state.allMergedMatches = merged;
  return merged;
}

function buildFilteredResult(filterObj) {
  const allMatches = rebuildMergedCatalog();
  const {
    team = 'all',
    status = 'all',
    competition = 'all',
    season = '2026/27',
    ha = 'all',
    outcome = 'all',
    month = 'all',
    dateFrom = '',
    dateTo = '',
    search = '',
    sort = 'date_desc',
  } = filterObj || {};

  const seasonsSet = new Set();
  const competitionsMap = new Map();

  allMatches.forEach((m) => {
    const s = getSeasonFromDateStr(m.date);
    if (s) seasonsSet.add(s);
    const slug = normalizeMatchCompSlug(m.competition_name || m.competition);
    if (slug && !competitionsMap.has(slug)) {
      competitionsMap.set(slug, {
        slug,
        label: m.competition || slug,
        logo: m.competition_logo || '',
      });
    }
  });

  const filtered = allMatches.filter((m) => {
    if (team !== 'all' && m.team_type !== team) return false;
    if (status !== 'all') {
      if (status === 'live') {
        if (m.status !== 'live' && m.status !== 'halftime') return false;
      } else if (m.status !== status) {
        return false;
      }
    }
    if (season !== 'all') {
      if (getSeasonFromDateStr(m.date) !== season) return false;
    }
    if (competition !== 'all') {
      const slug = normalizeMatchCompSlug(m.competition_name || m.competition);
      if (slug !== competition && m.competition !== competition) return false;
    }
    if (ha !== 'all') {
      const isHome = String(m.home_team || '').toLowerCase().includes('chelsea');
      const mHa = m.ha || (isHome ? 'H' : 'A');
      if (mHa !== ha) return false;
    }
    if (outcome !== 'all') {
      if (getChelseaMatchOutcome(m) !== outcome) return false;
    }
    if (month !== 'all' && m.date) {
      if (m.date.slice(5, 7) !== month) return false;
    }
    if (dateFrom && m.date && m.date < dateFrom) return false;
    if (dateTo && m.date && m.date > dateTo) return false;
    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      const goalPlayers = (m.goals || []).map((g) => g.player).join(' ');
      const haystack = [
        m.id,
        m.home_team,
        m.away_team,
        m.competition,
        m.venue,
        m.round,
        m.referee,
        goalPlayers,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (sort === 'date_asc') {
    filtered.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  } else {
    filtered.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }

  return {
    matches: filtered.slice(0, 400),
    summary: {
      total: filtered.length,
      upcoming: filtered.filter((m) => m.status === 'upcoming').length,
      completed: filtered.filter((m) => m.status === 'completed').length,
      live: filtered.filter((m) => m.status === 'live' || m.status === 'halftime').length,
      men: filtered.filter((m) => m.team_type === 'M').length,
      women: filtered.filter((m) => m.team_type === 'W').length,
    },
    meta: {
      seasons: Array.from(seasonsSet).sort((a, b) => b.localeCompare(a)),
      competitions: Array.from(competitionsMap.values()),
    },
  };
}

function generateNextMatchId(teamType) {
  const prefix = teamType === 'W' ? 'w' : 'm';
  let maxNum = 0;
  const merged = state.allMergedMatches.length > 0 ? state.allMergedMatches : state.baseMatches;
  merged.forEach((m) => {
    const idStr = String(m.id || '');
    if (idStr.startsWith(prefix)) {
      const n = parseInt(idStr.slice(1), 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
  });
  return `${prefix}${maxNum + 1}`;
}

async function fetchFilteredMatches(filterObj) {
  await ensureBaseCatalogLoaded();
  if (window.KlknFirebase && state.cloudMatches.length === 0) {
    try {
      state.cloudMatches = await window.KlknFirebase.getCloudMatches();
    } catch (err) {
      console.warn('[MatchManager] Cloud matches initial fetch fallback:', err);
    }
  }
  return buildFilteredResult(filterObj);
}

function applyWorkspaceData(data) {
  state.matches = Array.isArray(data.matches) ? data.matches : [];
  if (data.meta) {
    state.seasons = data.meta.seasons || state.seasons;
    state.competitions = data.meta.competitions || state.competitions;
    populateModalFilterOptions();
  }
  updateSummaryStats(data.summary);
  renderActiveFilterSummary();
  renderMatchList();
}

async function loadWorkspaceMatches(showSpinner = true) {
  if (showSpinner) {
    el.matchListContainer.innerHTML = `
      <div class="mm-state-box">
        <div class="mm-spinner"></div>
        <span>${escapeHtml(t('loading'))}</span>
      </div>
    `;
    el.listCountLabel.textContent = t('loading');
  }

  try {
    const data = await fetchFilteredMatches(state.filters);
    applyWorkspaceData(data);
  } catch (err) {
    console.error(err);
    el.matchListContainer.innerHTML = `
      <div class="mm-state-box">
        <span>${escapeHtml(err.message)}</span>
      </div>
    `;
  }
}

function updateSummaryStats(summary) {
  const s = summary || {
    total: state.matches.length,
    upcoming: state.matches.filter((m) => m.status === 'upcoming').length,
    completed: state.matches.filter((m) => m.status === 'completed').length,
    men: state.matches.filter((m) => m.team_type === 'M').length,
    women: state.matches.filter((m) => m.team_type === 'W').length,
  };
  el.statTotal.textContent = String(s.total);
  el.statUpcoming.textContent = String(s.upcoming);
  el.statCompleted.textContent = String(s.completed);
  el.statSplit.textContent = `${s.men}M / ${s.women}W`;
  el.statSeasonNote.textContent =
    state.filters.season === 'all' ? t('allSeasons') : `${state.filters.season}`;
  el.statStorageNote.textContent = state.isAdmin ? t('dbConnected') : t('dbReadOnly');
}

function renderActiveFilterSummary() {
  const parts = [];
  parts.push(state.filters.season === 'all' ? t('allSeasons') : state.filters.season);
  if (state.filters.team === 'M') parts.push(state.lang === 'th' ? 'ทีมชาย' : "Men's");
  if (state.filters.team === 'W') parts.push(state.lang === 'th' ? 'ทีมหญิง' : "Women's");
  if (state.filters.status !== 'all') parts.push(state.filters.status);
  if (state.filters.competition !== 'all') parts.push(state.filters.competition);
  if (state.filters.month !== 'all') parts.push(`M${state.filters.month}`);
  if (state.filters.ha !== 'all') parts.push(state.filters.ha === 'H' ? 'Home' : 'Away');
  if (state.filters.outcome !== 'all') parts.push(state.filters.outcome);
  el.activeFilterSummary.innerHTML = parts
    .map((p) => `<span>${escapeHtml(p)}</span>`)
    .join('<span aria-hidden="true">·</span>');
}

function renderMatchRowHtml(m, mode = 'list') {
  const statusClass = m.status === 'completed' ? 'completed' : m.status === 'live' || m.status === 'halftime' ? 'live' : 'upcoming';
  const statusLabel =
    statusClass === 'completed'
      ? t('statusCompleted')
      : statusClass === 'live'
      ? t('statusLive')
      : t('statusUpcoming');

  const isSelected = state.editingId && String(m.id) === String(state.editingId);
  const homeChelsea = String(m.home_team || '').toLowerCase().includes('chelsea');
  const awayChelsea = String(m.away_team || '').toLowerCase().includes('chelsea');

  const scoreText =
    m.status === 'completed' || m.status === 'live' || m.status === 'halftime'
      ? `${m.home_score ?? 0} - ${m.away_score ?? 0}`
      : m.time_th || m.time || 'TBC';

  const actionLabel =
    mode === 'modal'
      ? t('selectInModal')
      : m.status === 'upcoming'
      ? t('enterResult')
      : t('editBtn');

  return `
    <div class="mm-match-row ${isSelected ? 'is-selected' : ''}" data-match-id="${escapeHtml(m.id)}" role="button" tabindex="0">
      <div class="mm-row-top">
        <div class="mm-row-meta-inline">
          ${m.competition_logo ? `<img src="${escapeHtml(m.competition_logo)}" alt="" class="mm-comp-mini" onerror="this.style.display='none'" />` : ''}
          <span class="tabular">${escapeHtml(m.date || '—')}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHtml(m.competition || '')}</span>
          <span aria-hidden="true">·</span>
          <span class="mono">${escapeHtml(m.team_type || 'M')}#${escapeHtml(m.id)}</span>
        </div>
        <span class="mm-status-text ${statusClass}">${escapeHtml(statusLabel)}</span>
      </div>

      <div class="mm-row-teams">
        <div class="mm-team-side home">
          <span class="mm-team-name ${homeChelsea ? 'is-chelsea' : ''}">${escapeHtml(m.home_team)}</span>
          <img src="${escapeHtml(m.home_logo || 'assets/images/placeholder-team.svg')}" alt="" class="mm-team-logo" onerror="this.src='assets/images/placeholder-team.svg'" />
        </div>
        <div class="mm-score-box">${escapeHtml(scoreText)}</div>
        <div class="mm-team-side away">
          <img src="${escapeHtml(m.away_logo || 'assets/images/placeholder-team.svg')}" alt="" class="mm-team-logo" onerror="this.src='assets/images/placeholder-team.svg'" />
          <span class="mm-team-name ${awayChelsea ? 'is-chelsea' : ''}">${escapeHtml(m.away_team)}</span>
        </div>
      </div>

      <div class="mm-row-foot">
        <span>${escapeHtml(m.venue || '—')}${m.round ? ` · ${escapeHtml(m.round)}` : ''}</span>
        <button type="button" class="mm-row-quick-action" data-quick-action="${escapeHtml(m.id)}">${escapeHtml(actionLabel)} →</button>
      </div>
    </div>
  `;
}

function renderMatchList() {
  el.listCountLabel.textContent = t('itemsCount')(state.matches.length);
  if (state.matches.length === 0) {
    el.matchListContainer.innerHTML = `
      <div class="mm-state-box">
        <strong>${escapeHtml(t('emptyList'))}</strong>
        <span>${escapeHtml(t('emptySub'))}</span>
        <button type="button" class="mm-btn mm-btn-primary mm-btn-compact" id="emptyNewBtn">${escapeHtml(t('createNow'))}</button>
      </div>
    `;
    const emptyBtn = document.getElementById('emptyNewBtn');
    if (emptyBtn) emptyBtn.addEventListener('click', () => resetForm('upcoming'));
    return;
  }

  el.matchListContainer.innerHTML = state.matches.map((m) => renderMatchRowHtml(m, 'list')).join('');
  el.matchListContainer.querySelectorAll('.mm-match-row').forEach((row) => {
    const id = row.getAttribute('data-match-id');
    const match = state.matches.find((m) => String(m.id) === String(id));
    if (!match) return;

    const quickBtn = row.querySelector('[data-quick-action]');
    if (quickBtn) {
      quickBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        loadMatchIntoForm(match, match.status === 'upcoming' ? 'completed' : null);
      });
    }

    row.addEventListener('click', () => {
      loadMatchIntoForm(match);
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadMatchIntoForm(match);
      }
    });
  });
}

/* ==================== FILTER & SELECTION MENU WINDOW ==================== */
function populateModalFilterOptions() {
  const curSeason = el.modalSeasonSelect.value || state.filters.season;
  const seasonOptions = [
    `<option value="all">${escapeHtml(t('allSeasons'))}</option>`,
    ...state.seasons.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`),
  ];
  el.modalSeasonSelect.innerHTML = seasonOptions.join('');
  el.modalSeasonSelect.value = state.seasons.includes(curSeason) || curSeason === 'all' ? curSeason : '2026/27';

  const curComp = el.modalCompSelect.value || state.filters.competition;
  const compOptions = [
    `<option value="all">${escapeHtml(t('allComps'))}</option>`,
    ...state.competitions.map((c) => `<option value="${escapeHtml(c.slug)}">${escapeHtml(c.label)}</option>`),
  ];
  el.modalCompSelect.innerHTML = compOptions.join('');
  el.modalCompSelect.value = Array.from(el.modalCompSelect.options).some((o) => o.value === curComp) ? curComp : 'all';
}

function syncModalInputsFromState(f) {
  el.modalSearchInput.value = f.search || '';
  el.modalStatusSelect.value = f.status || 'all';
  el.modalTeamSelect.value = f.team || 'all';
  el.modalSeasonSelect.value = f.season || '2026/27';
  el.modalCompSelect.value = f.competition || 'all';
  el.modalMonthSelect.value = f.month || 'all';
  el.modalHaSelect.value = f.ha || 'all';
  el.modalOutcomeSelect.value = f.outcome || 'all';
  el.modalDateFrom.value = f.dateFrom || '';
  el.modalDateTo.value = f.dateTo || '';
  el.modalSortSelect.value = f.sort || 'date_desc';
}

function readFiltersFromModal() {
  return {
    search: el.modalSearchInput.value.trim(),
    status: el.modalStatusSelect.value,
    team: el.modalTeamSelect.value,
    season: el.modalSeasonSelect.value,
    competition: el.modalCompSelect.value,
    month: el.modalMonthSelect.value,
    ha: el.modalHaSelect.value,
    outcome: el.modalOutcomeSelect.value,
    dateFrom: el.modalDateFrom.value,
    dateTo: el.modalDateTo.value,
    sort: el.modalSortSelect.value,
  };
}

let modalPreviewMatches = [];
let modalDebounceTimer = null;

async function renderModalPreviewList() {
  const modalFilters = readFiltersFromModal();
  el.modalPreviewList.innerHTML = `
    <div class="mm-state-box">
      <div class="mm-spinner"></div>
      <span>${escapeHtml(t('loading'))}</span>
    </div>
  `;
  try {
    const data = await fetchFilteredMatches(modalFilters);
    modalPreviewMatches = Array.isArray(data.matches) ? data.matches : [];
    el.modalPreviewCount.textContent = t('itemsCount')(data.summary?.total ?? modalPreviewMatches.length);
    if (modalPreviewMatches.length === 0) {
      el.modalPreviewList.innerHTML = `
        <div class="mm-state-box">
          <span>${escapeHtml(t('emptyList'))}</span>
        </div>
      `;
      return;
    }
    el.modalPreviewList.innerHTML = modalPreviewMatches
      .slice(0, 80)
      .map((m) => renderMatchRowHtml(m, 'modal'))
      .join('');

    el.modalPreviewList.querySelectorAll('.mm-match-row').forEach((row) => {
      const id = row.getAttribute('data-match-id');
      const match = modalPreviewMatches.find((m) => String(m.id) === String(id));
      if (!match) return;
      row.addEventListener('click', () => {
        state.filters = readFiltersFromModal();
        syncQuickToolbarFromFilters();
        closeFilterModal();
        loadWorkspaceMatches().then(() => {
          loadMatchIntoForm(match);
        });
      });
    });
  } catch (err) {
    el.modalPreviewList.innerHTML = `<div class="mm-state-box"><span>${escapeHtml(err.message)}</span></div>`;
  }
}

function scheduleModalPreview() {
  clearTimeout(modalDebounceTimer);
  modalDebounceTimer = setTimeout(renderModalPreviewList, 200);
}

function openFilterModal() {
  populateModalFilterOptions();
  syncModalInputsFromState(state.filters);
  el.filterMenuModal.classList.add('open');
  renderModalPreviewList();
}

function closeFilterModal() {
  el.filterMenuModal.classList.remove('open');
}

function syncQuickToolbarFromFilters() {
  document.querySelectorAll('[data-quick-status]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-quick-status') === state.filters.status);
  });
  document.querySelectorAll('[data-quick-team]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-quick-team') === state.filters.team);
  });
  el.quickSearchInput.value = state.filters.search || '';
}

/* ==================== FORM SUBMISSION & ACTIONS ==================== */
async function handleFormSubmit(e) {
  e.preventDefault();
  if (!window.KlknFirebase || !state.isAdmin) {
    showToast(t('authRequiredToast'), 'error');
    return;
  }

  const payload = buildPayloadFromForm();

  if (!payload.date || !payload.competition || !payload.home_team || !payload.away_team) {
    showToast(t('validationError'), 'error');
    return;
  }

  if (!normalizeIsoDate(payload.date)) {
    showToast(t('invalidDateError'), 'error');
    el.fieldDate.focus();
    return;
  }

  if (!payload.id) {
    payload.id = state.editingId || generateNextMatchId(payload.team_type);
  }

  const originalBtnHtml = el.saveMatchBtn.innerHTML;
  el.saveMatchBtn.disabled = true;
  el.saveMatchBtn.textContent = t('saving');

  try {
    const savedMatch = await window.KlknFirebase.saveCloudMatch(payload);
    showToast(t('savedDisk'), 'success');

    if (savedMatch) {
      state.editingId = String(savedMatch.id);
      el.fieldId.value = String(savedMatch.id);
      el.fieldId.readOnly = true;
      state.hadLineupsOnLoad = Boolean(savedMatch.lineups);
      state.lineupClearedExplicitly = false;
    }
    state.cloudMatches = await window.KlknFirebase.getCloudMatches({ forceRefresh: true });
    applyWorkspaceData(buildFilteredResult(state.filters));
    updateFormHeaderUI();
  } catch (err) {
    console.error(err);
    showToast(err.message || 'Failed to save match', 'error');
  } finally {
    el.saveMatchBtn.disabled = false;
    el.saveMatchBtn.innerHTML = originalBtnHtml;
  }
}

async function handleDeleteMatch() {
  if (!state.editingId) return;
  if (!window.KlknFirebase || !state.isAdmin) {
    showToast(t('authRequiredToast'), 'error');
    return;
  }

  const targetId = state.editingId;
  const targetMatch =
    state.matches.find((m) => String(m.id) === String(targetId)) ||
    state.allMergedMatches.find((m) => String(m.id) === String(targetId)) ||
    { id: targetId };

  el.confirmDeleteBtn.disabled = true;
  el.confirmDeleteBtn.textContent = t('deleting');

  try {
    await window.KlknFirebase.deleteCloudMatch(targetMatch);
    showToast(t('deletedOk'), 'success');
    resetForm('upcoming');
    state.cloudMatches = await window.KlknFirebase.getCloudMatches({ forceRefresh: true });
    applyWorkspaceData(buildFilteredResult(state.filters));
  } catch (err) {
    showToast(err.message || 'Failed to delete match', 'error');
  } finally {
    el.confirmDeleteBtn.disabled = false;
    el.confirmDeleteBtn.textContent = state.lang === 'th' ? 'ยืนยันลบ' : 'Confirm Delete';
  }
}

/* ==================== INITIALIZATION & EVENT WIRING ==================== */
async function loadReferenceData() {
  const [clubsRes, menPlayersRes, womenPlayersRes, womenSquadsRes] = await Promise.allSettled([
    fetch('data/id_team.json').then((r) => (r.ok ? r.json() : [])),
    fetch('data/players-men.json').then((r) => (r.ok ? r.json() : [])),
    fetch('data/players-women.json').then((r) => (r.ok ? r.json() : [])),
    fetch('data/women-squads.json').then((r) => (r.ok ? r.json() : [])),
  ]);

  if (clubsRes.status === 'fulfilled' && Array.isArray(clubsRes.value)) {
    state.clubs = clubsRes.value;
    populateClubsDatalist();
  }
  if (menPlayersRes.status === 'fulfilled' && Array.isArray(menPlayersRes.value)) {
    state.playersMen = menPlayersRes.value;
  }
  if (womenPlayersRes.status === 'fulfilled' && Array.isArray(womenPlayersRes.value)) {
    state.playersWomen = womenPlayersRes.value;
  }
  if (womenSquadsRes.status === 'fulfilled' && Array.isArray(womenSquadsRes.value)) {
    state.womenSquads = womenSquadsRes.value;
  }
  populatePlayersDatalist();
  renderLineupEditor();
}

function wireEvents() {
  if (el.adminAuthBtn) {
    el.adminAuthBtn.addEventListener('click', handleAdminAuthAction);
  }
  if (el.bannerSignInBtn) {
    el.bannerSignInBtn.addEventListener('click', handleAdminAuthAction);
  }

  el.langToggleBtn.addEventListener('click', () => {
    state.lang = state.lang === 'th' ? 'en' : 'th';
    localStorage.setItem('lang', state.lang);
    applyLanguage();
  });

  el.themeToggleBtn.addEventListener('click', () => {
    const idx = THEMES.findIndex((item) => item.id === state.theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next.id);
  });

  el.topNewMatchBtn.addEventListener('click', () => {
    resetForm('upcoming');
    el.fieldDate.focus();
  });

  el.resetFormBtn.addEventListener('click', () => resetForm('upcoming'));
  el.clearFormBtn.addEventListener('click', () => resetForm('upcoming'));

  document.querySelectorAll('#statusSegControl .mm-seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setFormStatus(btn.getAttribute('data-form-status'));
    });
  });

  document.querySelectorAll('#teamTypeSegControl .mm-seg-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTeam = btn.getAttribute('data-form-team-type');
      setFormTeamType(nextTeam);
      if (!state.editingId) {
        el.fieldCompetition.value = nextTeam === 'W' ? "Barclays Women's Super League" : 'premier-league';
        syncCompetitionPickerUI();
        if (el.fieldHomeTeam.value.toLowerCase().includes('chelsea')) {
          el.fieldHomeTeam.value = nextTeam === 'W' ? 'Chelsea Women' : 'Chelsea';
          el.fieldVenue.value = nextTeam === 'W' ? 'Kingsmeadow' : 'Stamford Bridge';
        }
        updateTeamPreviews();
      } else {
        updateLineupSideUI();
        renderLineupLivePreview();
      }
    });
  });

  el.fieldCompetition.addEventListener('change', () => {
    const isCustom = el.fieldCompetition.value === '__custom__';
    el.customCompWrap.style.display = isCustom ? 'flex' : 'none';
    syncCompetitionPickerUI();
  });

  el.fieldCustomCompetition.addEventListener('input', () => {
    if (el.fieldCompetition.value === '__custom__') {
      syncCompetitionPickerUI();
    }
  });

  if (el.competitionPickerBtn) {
    el.competitionPickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCompetitionMenu();
    });
    el.competitionPickerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        toggleCompetitionMenu(true);
        const options = Array.from(el.competitionPickerMenu?.querySelectorAll('.mm-comp-option') || []);
        const selectedIdx = options.findIndex((o) => o.classList.contains('is-selected'));
        const nextIdx = e.key === 'ArrowDown'
          ? Math.min(options.length - 1, Math.max(0, selectedIdx + 1))
          : Math.max(0, selectedIdx - 1);
        options[nextIdx]?.focus();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (el.competitionPicker && !el.competitionPicker.contains(e.target)) {
      toggleCompetitionMenu(false);
    }
  });

  const handleDateUpdated = () => {
    const iso = normalizeIsoDate(el.fieldDate.value);
    if (iso && el.fieldDatePicker) {
      el.fieldDatePicker.value = iso;
    }
    if (state.lastTimeSource === 'uk') {
      syncTimesFromUk();
    } else {
      syncTimesFromTh();
    }
  };

  el.fieldDate.addEventListener('input', handleDateUpdated);
  el.fieldDate.addEventListener('change', () => {
    const iso = normalizeIsoDate(el.fieldDate.value);
    if (iso) el.fieldDate.value = iso;
    handleDateUpdated();
  });
  el.fieldDate.addEventListener('blur', () => {
    const iso = normalizeIsoDate(el.fieldDate.value);
    if (iso) {
      el.fieldDate.value = iso;
      handleDateUpdated();
    }
  });

  if (el.openDatePickerBtn && el.fieldDatePicker) {
    el.openDatePickerBtn.addEventListener('click', () => {
      const iso = normalizeIsoDate(el.fieldDate.value);
      if (iso) el.fieldDatePicker.value = iso;
      if (typeof el.fieldDatePicker.showPicker === 'function') {
        try {
          el.fieldDatePicker.showPicker();
          return;
        } catch {
          // fallback below
        }
      }
      el.fieldDatePicker.focus();
      el.fieldDatePicker.click();
    });

    el.fieldDatePicker.addEventListener('change', () => {
      if (el.fieldDatePicker.value) {
        setFieldDateValue(el.fieldDatePicker.value);
        handleDateUpdated();
      }
    });
  }

  el.fieldTimeTh.addEventListener('change', () => {
    if (el.fieldTimeTh.value === '__custom__') {
      el.fieldTimeThCustom.style.display = 'block';
      el.fieldTimeThCustom.focus();
      if (el.fieldTimeThCustom.value) syncTimesFromTh();
    } else {
      el.fieldTimeThCustom.style.display = 'none';
      syncTimesFromTh();
    }
  });

  el.fieldTimeThCustom.addEventListener('input', () => {
    if (el.fieldTimeTh.value === '__custom__') {
      syncTimesFromTh();
    }
  });

  el.fieldTimeUk.addEventListener('change', () => {
    if (el.fieldTimeUk.value === '__custom__') {
      el.fieldTimeUkCustom.style.display = 'block';
      el.fieldTimeUkCustom.focus();
      if (el.fieldTimeUkCustom.value) syncTimesFromUk();
    } else {
      el.fieldTimeUkCustom.style.display = 'none';
      syncTimesFromUk();
    }
  });

  el.fieldTimeUkCustom.addEventListener('input', () => {
    if (el.fieldTimeUk.value === '__custom__') {
      syncTimesFromUk();
    }
  });

  el.presetChelseaHomeBtn.addEventListener('click', () => {
    const isW = el.fieldTeamType.value === 'W';
    if (el.fieldHomeTeam.value.toLowerCase().includes('chelsea') === false && el.fieldHomeTeam.value.trim()) {
      el.fieldAwayTeam.value = el.fieldHomeTeam.value;
      el.fieldAwayLogo.value = el.fieldHomeLogo.value;
    }
    el.fieldHomeTeam.value = isW ? 'Chelsea Women' : 'Chelsea';
    el.fieldHomeLogo.value = 'databases/logo/teams/england_chelsea.svg';
    el.fieldVenue.value = isW ? 'Kingsmeadow' : 'Stamford Bridge';
    updateTeamPreviews();
  });

  el.presetChelseaAwayBtn.addEventListener('click', () => {
    const isW = el.fieldTeamType.value === 'W';
    if (el.fieldAwayTeam.value.toLowerCase().includes('chelsea') === false && el.fieldAwayTeam.value.trim()) {
      el.fieldHomeTeam.value = el.fieldAwayTeam.value;
      el.fieldHomeLogo.value = el.fieldAwayLogo.value;
    }
    el.fieldAwayTeam.value = isW ? 'Chelsea Women' : 'Chelsea';
    el.fieldAwayLogo.value = 'databases/logo/teams/england_chelsea.svg';
    const homeClub = findClubMatch(el.fieldHomeTeam.value);
    if (homeClub && homeClub['ชื่อสนามเหย้า (Home Stadium)']) {
      el.fieldVenue.value = homeClub['ชื่อสนามเหย้า (Home Stadium)'];
    }
    updateTeamPreviews();
  });

  el.swapTeamsBtn.addEventListener('click', () => {
    const hName = el.fieldHomeTeam.value;
    const hLogo = el.fieldHomeLogo.value;
    const hScore = el.fieldHomeScore.value;

    el.fieldHomeTeam.value = el.fieldAwayTeam.value;
    el.fieldHomeLogo.value = el.fieldAwayLogo.value;
    el.fieldHomeScore.value = el.fieldAwayScore.value;

    el.fieldAwayTeam.value = hName;
    el.fieldAwayLogo.value = hLogo;
    el.fieldAwayScore.value = hScore;

    state.goals = state.goals.map((g) => ({
      ...g,
      team: g.team === 'home' ? 'away' : 'home',
    }));

    const tmpLineupHome = state.lineups.home;
    state.lineups.home = state.lineups.away;
    state.lineups.away = tmpLineupHome;
    state.activeLineupSide = state.activeLineupSide === 'home' ? 'away' : 'home';

    const homeClub = findClubMatch(el.fieldHomeTeam.value);
    if (homeClub && homeClub['ชื่อสนามเหย้า (Home Stadium)']) {
      el.fieldVenue.value = homeClub['ชื่อสนามเหย้า (Home Stadium)'];
    }
    updateTeamPreviews();
    renderGoalsEditor();
    renderLineupEditor();
  });

  el.fieldHomeTeam.addEventListener('input', () => {
    const club = findClubMatch(el.fieldHomeTeam.value);
    if (club) {
      if (club.logo) el.fieldHomeLogo.value = club.logo;
      if (club['ชื่อสนามเหย้า (Home Stadium)'] && !state.editingId) {
        el.fieldVenue.value = club['ชื่อสนามเหย้า (Home Stadium)'];
      }
    }
    updateTeamPreviews();
  });

  el.fieldAwayTeam.addEventListener('input', () => {
    const club = findClubMatch(el.fieldAwayTeam.value);
    if (club && club.logo) {
      el.fieldAwayLogo.value = club.logo;
    }
    updateTeamPreviews();
  });

  el.fieldHomeLogo.addEventListener('input', updateTeamPreviews);
  el.fieldAwayLogo.addEventListener('input', updateTeamPreviews);

  el.addGoalBtn.addEventListener('click', () => {
    state.goals.push({
      team: 'home',
      player: '',
      minute: '',
      penalty: false,
      own_goal: false,
    });
    renderGoalsEditor();
  });

  // Pre-Match Line-up Events
  if (el.lineupSideTabs) {
    el.lineupSideTabs.querySelectorAll('.mm-lineup-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeLineupSide = btn.getAttribute('data-lineup-side') === 'away' ? 'away' : 'home';
        renderLineupEditor();
      });
    });
  }

  if (el.lineupFormationSelect) {
    el.lineupFormationSelect.addEventListener('change', () => {
      const sideData = state.lineups[state.activeLineupSide];
      const val = el.lineupFormationSelect.value;
      if (val === '__custom__') {
        el.lineupFormationCustom.style.display = 'block';
        el.lineupFormationCustom.focus();
        if (el.lineupFormationCustom.value.trim()) {
          sideData.formation = el.lineupFormationCustom.value.trim();
        }
      } else {
        el.lineupFormationCustom.style.display = 'none';
        sideData.formation = val;
        // Re-map slot positions if rows already exist with default/empty positions
        const newSlots = getPositionsForFormation(val);
        sideData.starting.forEach((p, idx) => {
          if (newSlots[idx]) p.position = newSlots[idx];
        });
      }
      syncChelseaSummaryFieldsFromLineup();
      renderLineupEditor();
    });
  }

  if (el.lineupFormationCustom) {
    el.lineupFormationCustom.addEventListener('input', () => {
      if (el.lineupFormationSelect?.value === '__custom__') {
        const val = el.lineupFormationCustom.value.trim();
        if (val) {
          state.lineups[state.activeLineupSide].formation = val;
          syncChelseaSummaryFieldsFromLineup();
          renderLineupLivePreview();
        }
      }
    });
  }

  if (el.lineupManagerInput) {
    el.lineupManagerInput.addEventListener('input', () => {
      const sideData = state.lineups[state.activeLineupSide];
      sideData.manager = el.lineupManagerInput.value;
      sideData._manualManagerEdited = true;
      renderLineupLivePreview();
    });
  }

  if (el.lineupInitSlotsBtn) {
    el.lineupInitSlotsBtn.addEventListener('click', () => {
      initSlotsForSide(state.activeLineupSide);
    });
  }

  if (el.lineupAutoChelseaBtn) {
    el.lineupAutoChelseaBtn.addEventListener('click', () => {
      autoFillSideLineup(state.activeLineupSide);
    });
  }

  if (el.lineupChelseaQuickSelect) {
    el.lineupChelseaQuickSelect.addEventListener('change', () => {
      const selectedName = el.lineupChelseaQuickSelect.value;
      if (!selectedName) return;
      const pool = getSquadPoolForSide(state.activeLineupSide);
      const player = pool.find((p) => p.name === selectedName);
      if (player) {
        const sideData = state.lineups[state.activeLineupSide];
        const slots = getPositionsForFormation(sideData.formation);
        const emptyIdx = sideData.starting.findIndex((row) => !row.name || !row.name.trim());
        if (emptyIdx >= 0) {
          sideData.starting[emptyIdx].name = player.name;
          sideData.starting[emptyIdx].number = player.number ?? '';
          if (!sideData.starting[emptyIdx].position) {
            sideData.starting[emptyIdx].position = slots[emptyIdx] || mapSquadPosToShortTag(player.position);
          }
        } else if (sideData.starting.length < 11) {
          const nextIdx = sideData.starting.length;
          sideData.starting.push({
            number: player.number ?? '',
            name: player.name,
            position: slots[nextIdx] || mapSquadPosToShortTag(player.position),
            captain: false,
            _extra: {},
          });
        } else {
          sideData.substitutes.push({
            number: player.number ?? '',
            name: player.name,
            position: mapSquadPosToShortTag(player.position),
            captain: false,
            _extra: {},
          });
          showToast(t('lineupSquadFullAddedSub'), 'success');
        }
        state.lineupClearedExplicitly = false;
        renderLineupEditor();
      }
      el.lineupChelseaQuickSelect.value = '';
    });
  }

  if (el.lineupAddStarterBtn) {
    el.lineupAddStarterBtn.addEventListener('click', () => {
      const sideData = state.lineups[state.activeLineupSide];
      const slots = getPositionsForFormation(sideData.formation);
      const nextIdx = sideData.starting.length;
      sideData.starting.push({
        number: '',
        name: '',
        position: slots[nextIdx] || '',
        captain: false,
        _extra: {},
      });
      state.lineupClearedExplicitly = false;
      renderLineupEditor();
    });
  }

  if (el.lineupAddSubBtn) {
    el.lineupAddSubBtn.addEventListener('click', () => {
      const sideData = state.lineups[state.activeLineupSide];
      sideData.substitutes.push({
        number: '',
        name: '',
        position: '',
        captain: false,
        _extra: {},
      });
      state.lineupClearedExplicitly = false;
      renderLineupEditor();
    });
  }

  if (el.lineupCopyLatestBtn) {
    el.lineupCopyLatestBtn.addEventListener('click', copyLatestLineupForActiveSide);
  }

  if (el.lineupClearBtn) {
    el.lineupClearBtn.addEventListener('click', () => {
      state.lineups = {
        home: createEmptyLineupSide('4-2-3-1'),
        away: createEmptyLineupSide('4-2-3-1'),
      };
      state.lineupClearedExplicitly = true;
      renderLineupEditor();
      showToast(t('lineupCleared'), 'success');
    });
  }

  if (el.lineupTogglePreviewBtn) {
    el.lineupTogglePreviewBtn.addEventListener('click', () => {
      state.lineupPreviewVisible = !state.lineupPreviewVisible;
      renderLineupLivePreview();
    });
  }

  if (el.fieldReferee) {
    el.fieldReferee.addEventListener('input', renderLineupLivePreview);
  }

  el.matchEntryForm.addEventListener('submit', handleFormSubmit);

  el.requestDeleteBtn.addEventListener('click', () => {
    el.deleteConfirmBar.classList.add('open');
  });
  el.cancelDeleteBtn.addEventListener('click', () => {
    el.deleteConfirmBar.classList.remove('open');
  });
  el.confirmDeleteBtn.addEventListener('click', handleDeleteMatch);

  // Quick toolbar filters
  document.querySelectorAll('[data-quick-status]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filters.status = btn.getAttribute('data-quick-status');
      syncQuickToolbarFromFilters();
      loadWorkspaceMatches();
    });
  });

  document.querySelectorAll('[data-quick-team]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.filters.team = btn.getAttribute('data-quick-team');
      syncQuickToolbarFromFilters();
      loadWorkspaceMatches();
    });
  });

  let quickSearchTimer = null;
  el.quickSearchInput.addEventListener('input', () => {
    clearTimeout(quickSearchTimer);
    quickSearchTimer = setTimeout(() => {
      state.filters.search = el.quickSearchInput.value.trim();
      loadWorkspaceMatches();
    }, 240);
  });

  // Filter & Selection Menu Modal
  el.openFilterMenuBtn.addEventListener('click', openFilterModal);
  el.closeFilterMenuBtn.addEventListener('click', closeFilterModal);
  el.filterMenuModal.addEventListener('click', (e) => {
    if (e.target === el.filterMenuModal) closeFilterModal();
  });

  [
    el.modalSearchInput,
    el.modalStatusSelect,
    el.modalTeamSelect,
    el.modalSeasonSelect,
    el.modalCompSelect,
    el.modalMonthSelect,
    el.modalHaSelect,
    el.modalOutcomeSelect,
    el.modalDateFrom,
    el.modalDateTo,
    el.modalSortSelect,
  ].forEach((ctrl) => {
    ctrl.addEventListener('input', scheduleModalPreview);
    ctrl.addEventListener('change', scheduleModalPreview);
  });

  el.modalResetFiltersBtn.addEventListener('click', () => {
    const defaults = {
      status: 'all',
      team: 'all',
      season: '2026/27',
      competition: 'all',
      month: 'all',
      ha: 'all',
      outcome: 'all',
      dateFrom: '',
      dateTo: '',
      search: '',
      sort: 'date_desc',
    };
    syncModalInputsFromState(defaults);
    renderModalPreviewList();
  });

  el.modalNewMatchBtn.addEventListener('click', () => {
    closeFilterModal();
    resetForm('upcoming');
    el.fieldDate.focus();
  });

  el.modalApplyFiltersBtn.addEventListener('click', () => {
    state.filters = readFiltersFromModal();
    syncQuickToolbarFromFilters();
    closeFilterModal();
    loadWorkspaceMatches();
  });

  // JSON Preview Modal
  el.openJsonModalBtn.addEventListener('click', () => {
    const payload = buildPayloadFromForm();
    el.jsonPreviewCode.textContent = JSON.stringify(payload, null, 2);
    el.jsonPreviewModal.classList.add('open');
  });
  el.closeJsonModalBtn.addEventListener('click', () => {
    el.jsonPreviewModal.classList.remove('open');
  });
  el.jsonPreviewModal.addEventListener('click', (e) => {
    if (e.target === el.jsonPreviewModal) el.jsonPreviewModal.classList.remove('open');
  });

  el.copyJsonBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(el.jsonPreviewCode.textContent);
      showToast(t('copiedJson'), 'success');
    } catch {
      showToast('Clipboard copy failed', 'error');
    }
  });

  el.downloadJsonBtn.addEventListener('click', () => {
    const payload = buildPayloadFromForm();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-${payload.id || payload.date || 'entry'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleCompetitionMenu(false);
      closeFilterModal();
      el.jsonPreviewModal.classList.remove('open');
    }
  });
}

async function init() {
  applyTheme(state.theme);
  renderCompetitionPickerMenu();
  populateTimeDropdownOptions();
  wireEvents();
  resetForm('upcoming');
  applyLanguage();

  if (window.KlknFirebase) {
    window.KlknFirebase.onAuthChange(async (user) => {
      state.authUser = user || null;
      state.isAdmin = user ? await window.KlknFirebase.verifyAdminAccess(user) : false;
      state.authReady = true;
      updateAuthUI();
    });
  } else {
    state.authReady = true;
    updateAuthUI();
  }

  await loadReferenceData();
  await loadWorkspaceMatches();

  if (window.KlknFirebase) {
    window.KlknFirebase.subscribeCloudMatches(
      (cloudList) => {
        state.cloudMatches = cloudList;
        applyWorkspaceData(buildFilteredResult(state.filters));
      },
      (err) => {
        console.warn('[MatchManager] Real-time Firestore listener error:', err);
      }
    );
  }
}

init();

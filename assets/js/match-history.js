const text = {
  th: {
    allSeasons: 'ทุกฤดูกาล', allCompetitions: 'ทุกรายการ', loading: 'กำลังโหลดคลังข้อมูล…',
    loadError: 'โหลดคลังผลการแข่งขันไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง', noResults: 'ไม่พบผลการแข่งขันตามตัวกรองนี้',
    resultCount: (shown, total) => `แสดง ${shown} จาก ${total} นัด`, loadMore: 'แสดงผลเพิ่มเติม',
    win: 'ชนะ', draw: 'เสมอ', loss: 'แพ้', details: 'รายละเอียดนัด', venue: 'สนาม',
    attendance: 'ผู้ชม', referee: 'ผู้ตัดสิน', halfTime: 'พักครึ่ง', scorers: 'ผู้ทำประตูและเหตุการณ์',
    excluded: 'ต้นฉบับระบุว่าไม่นับสถิติทางการ', noExtraDetails: 'ไม่มีรายละเอียดเพิ่มเติมในบันทึกนี้',
    searchPlaceholder: 'เช่น Arsenal หรือ Stamford Bridge', countUnit: 'นัด',
  },
  en: {
    allSeasons: 'All seasons', allCompetitions: 'All competitions', loading: 'Loading the archive…',
    loadError: 'The match archive could not be loaded. Please refresh the page.', noResults: 'No results match these filters.',
    resultCount: (shown, total) => `Showing ${shown} of ${total} matches`, loadMore: 'Load more results',
    win: 'Win', draw: 'Draw', loss: 'Loss', details: 'Match details', venue: 'Venue',
    attendance: 'Attendance', referee: 'Referee', halfTime: 'Half-time', scorers: 'Scorers and events',
    excluded: 'Source marks this match outside official statistics', noExtraDetails: 'No further details in the source',
    searchPlaceholder: 'Try Arsenal or Stamford Bridge', countUnit: 'matches',
  },
};

let language = localStorage.getItem('lang') === 'en' ? 'en' : 'th';
let archiveMatches = [];
let visibleMatches = [];
let displayedCount = 36;
const pageSize = 36;

const elements = {
  list: document.querySelector('#matchList'),
  count: document.querySelector('#resultCount'),
  season: document.querySelector('#seasonFilter'),
  competition: document.querySelector('#competitionFilter'),
  result: document.querySelector('#resultFilter'),
  search: document.querySelector('#searchInput'),
  sort: document.querySelector('#sortOrder'),
  loadMore: document.querySelector('#loadMore'),
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function formatNumber(value) {
  return new Intl.NumberFormat(language === 'th' ? 'th-TH' : 'en-GB').format(value);
}

function formatDate(isoDate) {
  if (!isoDate) return '—';
  const date = new Date(`${isoDate}T12:00:00Z`);
  return new Intl.DateTimeFormat(language === 'th' ? 'th-TH' : 'en-GB', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function applyLanguage() {
  const words = text[language];
  document.documentElement.lang = language;
  document.querySelectorAll('[data-lang-th][data-lang-en]').forEach(node => {
    node.textContent = node.getAttribute(`data-lang-${language}`);
  });
  document.querySelector('#languageToggle').textContent = language === 'th' ? 'EN' : 'ไทย';
  elements.search.placeholder = words.searchPlaceholder;
  if (archiveMatches.length) {
    populateFilters();
    renderMatches();
  }
}

function populateFilters() {
  const words = text[language];
  const selectedSeason = elements.season.value;
  const selectedCompetition = elements.competition.value;
  const seasons = [...new Set(archiveMatches.map(match => match.season).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const competitions = [...new Set(archiveMatches.map(match => match.competition).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  elements.season.innerHTML = `<option value="">${escapeHtml(words.allSeasons)}</option>${seasons.map(season => `<option value="${escapeHtml(season)}">${escapeHtml(season)}</option>`).join('')}`;
  elements.competition.innerHTML = `<option value="">${escapeHtml(words.allCompetitions)}</option>${competitions.map(competition => `<option value="${escapeHtml(competition)}">${escapeHtml(competition)}</option>`).join('')}`;
  elements.season.value = selectedSeason;
  elements.competition.value = selectedCompetition;
}

function filteredMatches() {
  const term = elements.search.value.trim().toLocaleLowerCase();
  const result = elements.result.value;
  const filtered = archiveMatches.filter(match => {
    if (elements.season.value && match.season !== elements.season.value) return false;
    if (elements.competition.value && match.competition !== elements.competition.value) return false;
    if (result && match.result !== result) return false;
    if (!term) return true;
    const searchable = [match.homeTeam, match.awayTeam, match.competition, match.venue, match.referee,
      ...(match.scorers || []).map(item => `${item.type} ${item.text}`)].join(' ').toLocaleLowerCase();
    return searchable.includes(term);
  });
  const direction = elements.sort.value === 'oldest' ? 1 : -1;
  filtered.sort((a, b) => direction * (a.date.localeCompare(b.date) || a.id.localeCompare(b.id)));
  return filtered;
}

function renderMatch(match) {
  const words = text[language];
  const homeChelsea = match.homeTeam.toLocaleLowerCase().includes('chelsea');
  const awayChelsea = match.awayTeam.toLocaleLowerCase().includes('chelsea');
  const resultLabel = match.result === 'W' ? words.win : match.result === 'D' ? words.draw : words.loss;
  const halfTime = match.halfTimeHome === null || match.halfTimeAway === null
    ? '—'
    : `${match.halfTimeHome}–${match.halfTimeAway}`;
  const scorers = (match.scorers || []).map(item => `${escapeHtml(item.type)}: ${escapeHtml(item.text)}`).join('<br>') || words.noExtraDetails;
  const detailValues = [
    [words.venue, match.venue], [words.attendance, match.attendance], [words.referee, match.referee],
    [words.halfTime, halfTime], [words.scorers, null],
  ];
  const details = detailValues.map(([label, value]) => value
    ? `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`
    : label === words.scorers ? `<div class="match-scorers"><dt>${escapeHtml(label)}</dt><dd>${scorers}</dd></div>` : '').join('');
  const excluded = match.excludedFromOfficialStats
    ? `<span class="unofficial-badge">${escapeHtml(words.excluded)}</span>` : '';

  return `<article class="match-card result-${escapeHtml(match.result)}">
    <div class="match-meta"><time datetime="${escapeHtml(match.date)}">${escapeHtml(formatDate(match.date))}${match.time ? ` · ${escapeHtml(match.time)}` : ''}</time><span class="season">${escapeHtml(match.season)}</span><span>${escapeHtml(match.competition || '—')}</span>${excluded}</div>
    <div class="scoreline" aria-label="${escapeHtml(match.homeTeam)} ${match.homeScore}, ${escapeHtml(match.awayTeam)} ${match.awayScore}">
      <span class="team home${homeChelsea ? ' chelsea' : ''}">${escapeHtml(match.homeTeam)}</span><strong class="score">${match.homeScore}</strong><span class="score-separator">–</span><strong class="score">${match.awayScore}</strong><span class="team away${awayChelsea ? ' chelsea' : ''}">${escapeHtml(match.awayTeam)}</span>
    </div>
    <div class="match-foot"><span class="result-label">${escapeHtml(resultLabel)}</span><span>${escapeHtml(match.venue || '')}</span><span>${match.attendance ? `${escapeHtml(match.attendance)} ${language === 'th' ? 'คน' : 'attendees'}` : ''}</span></div>
    <details><summary>${escapeHtml(words.details)}</summary><dl class="match-details">${details}</dl></details>
  </article>`;
}

function renderMatches() {
  const words = text[language];
  visibleMatches = filteredMatches();
  const shown = visibleMatches.slice(0, displayedCount);
  elements.count.textContent = words.resultCount(formatNumber(shown.length), formatNumber(visibleMatches.length));
  elements.list.innerHTML = shown.length
    ? shown.map(renderMatch).join('')
    : `<p class="empty-state">${escapeHtml(words.noResults)}</p>`;
  elements.loadMore.hidden = shown.length >= visibleMatches.length;
  elements.loadMore.textContent = words.loadMore;
}

function renderStats() {
  const countedMatches = archiveMatches.filter(match => !match.excludedFromOfficialStats);
  const wins = countedMatches.filter(match => match.result === 'W').length;
  const draws = countedMatches.filter(match => match.result === 'D').length;
  const losses = countedMatches.length - wins - draws;
  document.querySelector('#statMatches').textContent = formatNumber(archiveMatches.length);
  document.querySelector('#statSeasons').textContent = formatNumber(new Set(archiveMatches.map(match => match.season)).size);
  document.querySelector('#statRecord').textContent = `${formatNumber(wins)}–${formatNumber(draws)}–${formatNumber(losses)}`;
}

async function loadArchive() {
  try {
    const response = await fetch('data/chelsea-match-history.json');
    if (!response.ok) throw new Error(`Archive request failed: ${response.status}`);
    const archive = await response.json();
    archiveMatches = archive.matches || [];
    renderStats();
    populateFilters();
    renderMatches();
  } catch (error) {
    console.error(error);
    const words = text[language];
    elements.count.textContent = words.loadError;
    elements.list.innerHTML = `<p class="empty-state">${escapeHtml(words.loadError)}</p>`;
  }
}

document.querySelector('#languageToggle').addEventListener('click', () => {
  language = language === 'th' ? 'en' : 'th';
  localStorage.setItem('lang', language);
  applyLanguage();
});
document.querySelector('#clearFilters').addEventListener('click', () => {
  elements.search.value = '';
  elements.season.value = '';
  elements.competition.value = '';
  elements.result.value = '';
  elements.sort.value = 'newest';
  displayedCount = pageSize;
  renderMatches();
});
[elements.search, elements.season, elements.competition, elements.result, elements.sort].forEach(control => {
  control.addEventListener(control === elements.search ? 'input' : 'change', () => {
    displayedCount = pageSize;
    renderMatches();
  });
});
elements.loadMore.addEventListener('click', () => {
  displayedCount += pageSize;
  renderMatches();
});
applyLanguage();
loadArchive();

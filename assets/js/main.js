// ============================================
// KARN LA KHRANg NAN Official - Main JS
// ============================================

let currentLang = localStorage.getItem('lang') || 'th';
window.currentLang = currentLang;
let translations = {};

// ---------- TEAMS DATA (id_team.json) INTEGRATION ----------
let teamsDataMap = null;

async function loadTeamsData() {
  if (teamsDataMap) return teamsDataMap;
  try {
    const res = await fetch('data/id_team.json');
    if (res.ok) {
      const list = await res.json();
      teamsDataMap = new Map();
      list.forEach(item => {
        const key = (item['สโมสร'] || '').toLowerCase().trim();
        const info = {
          en: item['สโมสร'],
          th: item['ชื่อสโมสร (ภาษาไทย)'],
          short: item['ชื่อย่อ'],
          league: item['ลีก'],
          homeStadium: item['ชื่อสนามเหย้า (Home Stadium)'],
          secondaryStadium: item['ชื่อสนามรอง / นัดสำคัญ (Secondary)']
        };
        if (key) teamsDataMap.set(key, info);
      });
    }
  } catch (e) {
    console.warn('Failed to load id_team.json:', e);
  }
  if (!teamsDataMap) teamsDataMap = new Map();
  window.teamsDataMap = teamsDataMap;
  return teamsDataMap;
}

function getTeamInfo(teamName) {
  if (!teamName) return null;
  if (!teamsDataMap) return null;
  const norm = teamName.toLowerCase().trim();
  if (teamsDataMap.has(norm)) return teamsDataMap.get(norm);

  // Normalize variations e.g. "Chelsea FC", "Chelsea Women"
  for (const [key, val] of teamsDataMap.entries()) {
    if (norm === key || norm.startsWith(key) || key.startsWith(norm)) return val;
  }
  for (const [key, val] of teamsDataMap.entries()) {
    if (norm.includes(key) || key.includes(norm)) return val;
  }
  return null;
}

function formatTeamName(teamName, options = {}) {
  if (!teamName) return '';
  const info = getTeamInfo(teamName);
  const lang = options.lang || window.currentLang || 'th';
  const isMobile = options.isMobile !== undefined ? options.isMobile : (window.innerWidth <= 768);

  if (isMobile && !options.preferFullOnMobile) {
    if (info && info.short) return info.short;
  }

  if (lang === 'th' && info && info.th) {
    return info.th;
  }

  return (info && info.en) ? info.en : teamName;
}

function renderTeamNameHTML(teamName, options = {}) {
  if (!teamName) return '';
  const info = getTeamInfo(teamName);
  const lang = options.lang || window.currentLang || 'th';
  const thName = (info && info.th) ? info.th : teamName;
  const enName = (info && info.en) ? info.en : teamName;
  const shortName = (info && info.short) ? info.short : teamName;
  const fullDisplay = lang === 'th' ? thName : enName;

  return `<span class="team-name-wrapper" title="${fullDisplay}">
    <span class="team-name-full">${fullDisplay}</span>
    <span class="team-name-short">${shortName}</span>
  </span>`;
}

function getFlagCode(nat) {
  if (!nat) return '';
  const n = nat.trim().toLowerCase();
  const map = {
    'argentina': 'arg', 'belgium': 'bel', 'brazil': 'bra', 'denmark': 'dnk',
    'ecuador': 'ecu', 'england': 'eng', 'france': 'fra', 'guinea-bissau': 'gnb',
    'ireland': 'irl', 'italy': 'ita', 'kazakhstan': 'kaz', 'netherlands': 'ned',
    'portugal': 'por', 'senegal': 'sen', 'spain': 'esp', 'usa': 'usa',
    'ukraine': 'ua', 'germany': 'ger', 'deu': 'ger', 'switzerland': 'ch',
    'sui': 'ch', 'japan': 'jpn', 'jp': 'jpn', 'sweden': 'se', 'swe': 'se',
    'australia': 'aus', 'canada': 'can', 'colombia': 'col', 'czech': 'cze',
    'ghana': 'gha', 'iceland': 'isl', 'jamaica': 'jam', 'nigeria': 'nga',
    'norway': 'nor', 'scotland': 'sco', 'serbia': 'srb', 'wales': 'wls',
    'ivory coast': 'civ'
  };
  return map[n] || n;
}

function getFlagSpriteHTML(nat, className = 'flag-icon', width = 20, height = 15) {
  const code = getFlagCode(nat);
  if (!code) return '';
  return `<svg class="${className}" width="${width}" height="${height}" aria-label="${nat}"><use href="assets/images/flags-sprite.svg#flag-${code}"></use></svg>`;
}

window.loadTeamsData = loadTeamsData;
window.getTeamInfo = getTeamInfo;
window.formatTeamName = formatTeamName;
window.renderTeamNameHTML = renderTeamNameHTML;
window.getFlagCode = getFlagCode;
window.getFlagSpriteHTML = getFlagSpriteHTML;

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) return;
    const ct = res.headers.get('content-type');
    if (ct && !ct.includes('json') && !ct.includes('javascript')) return;
    translations = await res.json();
    currentLang = lang;
    window.currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    updateUIText();
    localStorage.setItem('lang', lang);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  } catch (e) {
    console.error('Failed to load language:', e);
  }
}

function updateUIText() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && value[k] !== undefined) value = value[k];
      else { value = null; break; }
    }
    if (value !== null && value !== undefined) {
      if (el.children.length === 0) {
        el.textContent = value;
      } else {
        // If element has icon or child element, update text node or innerHTML safely
        const icon = el.querySelector('.icon, .emoji');
        if (icon) {
          const iconHtml = icon.outerHTML;
          el.innerHTML = iconHtml + ' ' + value;
        } else {
          el.innerHTML = value;
        }
      }
    }
  });

  document.querySelectorAll('[data-lang-th][data-lang-en]').forEach(el => {
    const val = currentLang === 'th' ? el.getAttribute('data-lang-th') : el.getAttribute('data-lang-en');
    if (val) el.innerHTML = val;
  });

  const langToggle = document.getElementById('langToggle');
  if (langToggle && translations?.nav?.lang_toggle) {
    langToggle.textContent = translations.nav.lang_toggle;
  }
  
  const langToggleBtn = document.getElementById('langToggleBtn');
  if (langToggleBtn && translations?.story?.read_btn) {
    langToggleBtn.textContent = translations.story.read_btn;
  }
}

function toggleLanguage() {
  const newLang = currentLang === 'th' ? 'en' : 'th';
  loadLanguage(newLang);
}

// Mobile Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadTeamsData();
  await loadLanguage(currentLang);
  initMobileMenu();

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLanguage();
    });
  }
});

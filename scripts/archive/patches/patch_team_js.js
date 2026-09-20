import fs from 'fs';

let content = fs.readFileSync('assets/js/team.js', 'utf8');

const regex = /async function loadMenTable\(\) \{[\s\S]*?async function loadMenPlayers\(\) \{/m;
const newFunction = `async function loadMenTable() {
  const container = document.getElementById('menTableContainer');
  if (!container) return;
  try {
    let data = await safeFetchJson('/api/epl-standings');
    if (data && data.success && data.data) {
      data = data.data;
    } else {
      data = await safeFetchJson('data/tables-men.json');
    }
    if (!data) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    const compLogo = data?.competition_logo || '';
    const compName = data?.competition || '';
    renderTable(container, table, 'Chelsea', compLogo, compName);
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>';
    console.error('Table error:', e);
  }
}

async function loadMenPlayers() {`;

content = content.replace(regex, newFunction);
fs.writeFileSync('assets/js/team.js', content);

const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const legendHTML = `
      <!-- Calendar Legend -->
      <div class="calendar-legend" style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 1rem; font-size: 0.8rem; flex-wrap: wrap; align-items: center;">
        <div style="display: flex; align-items: center; gap: 4px;">
          <span class="team-badge m" style="padding: 1px 4px; font-size: 0.6rem;">M</span> <span data-i18n="calendar.legend_men">Men's Team</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span class="team-badge w" style="padding: 1px 4px; font-size: 0.6rem;">W</span> <span data-i18n="calendar.legend_women">Women's Team</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: var(--primary-color); display: inline-block;"></span> <span data-i18n="calendar.legend_home">Home Match</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #ff6b6b; display: inline-block;"></span> <span data-i18n="calendar.legend_away">Away Match</span>
        </div>
      </div>
`;

if (!html.includes('calendar-legend')) {
    html = html.replace(
        /<div id="calendarGrid"/,
        legendHTML + '\n      <div id="calendarGrid"'
    );
}

fs.writeFileSync('index.html', html);

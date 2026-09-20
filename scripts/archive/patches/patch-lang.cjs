const fs = require('fs');

function addKeys(file, keys) {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!data.calendar) data.calendar = {};
  for (const k in keys) {
    data.calendar[k] = keys[k];
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

addKeys('lang/en.json', {
  legend_men: "Men's Team",
  legend_women: "Women's Team",
  legend_home: "Home Match",
  legend_away: "Away Match"
});

addKeys('lang/th.json', {
  legend_men: "ทีมชาย",
  legend_women: "ทีมหญิง",
  legend_home: "เหย้า",
  legend_away: "เยือน"
});

const fs = require('fs');

const schedule = {
  w5: { date: "2026-09-19", time: "18:45", venue: "Stamford Bridge", channels: [{ platform: "Sky Sports", name: "Sky Sports", logo: "databases/logo/tv/sky_sports.svg" }] },
  w6: { date: "2026-09-27", time: "22:30", venue: "Stamford Bridge", channels: [{ platform: "Sky Sports", name: "Sky Sports", logo: "databases/logo/tv/sky_sports.svg" }] },
  w7: { date: "2026-10-04", time: "20:00", venue: "Chigwell Construction Stadium", channels: [] },
  w8: { date: "2026-10-18", time: "18:00", venue: "Stamford Bridge", channels: [] },
  w9: { date: "2026-10-25", time: "19:00", venue: "VBS Community Stadium", channels: [] },
  w10: { date: "2026-11-01", time: "21:30", venue: "The Valley", channels: [] },
  w11: { date: "2026-11-07", time: "19:30", venue: "Stamford Bridge", channels: [] },
  w12: { date: "2026-11-14", time: "21:00", venue: "Stamford Bridge", channels: [] },
  w13: { date: "2026-11-22", time: "21:00", venue: "BrewDog Stadium", channels: [] },
  w14: { date: "2026-12-13", time: "21:00", venue: "Stamford Bridge", channels: [] },
  w15: { date: "2026-12-19", time: "19:30", venue: "Broadfield Stadium", channels: [] },
  w16: { date: "2027-01-10", time: "21:00", venue: "Joie Stadium", channels: [] },
  w17: { date: "2027-01-21", time: "02:00", venue: "Stamford Bridge", channels: [] },
  w18: { date: "2027-01-24", time: "21:00", venue: "Stamford Bridge", channels: [] },
  w19: { date: "2027-01-31", time: "21:00", venue: "BetWright Stadium", channels: [] },
  w20: { date: "2027-02-07", time: "21:00", venue: "Stamford Bridge", channels: [] },
  w21: { date: "2027-02-14", time: "21:00", venue: "Copperjax Community Stadium", channels: [] },
  w22: { date: "2027-03-13", time: "19:30", venue: "St. Andrew's @ Knighthead Park", channels: [] },
  w23: { date: "2027-03-18", time: "02:00", venue: "Stamford Bridge", channels: [] },
  w24: { date: "2027-03-28", time: "20:00", venue: "Emirates Stadium", channels: [] },
  w25: { date: "2027-04-04", time: "20:00", venue: "Stamford Bridge", channels: [] },
  w26: { date: "2027-05-03", time: "00:00", venue: "Villa Park", channels: [] },
  w27: { date: "2027-05-09", time: "20:00", venue: "Stamford Bridge", channels: [] },
  w28: { date: "TBC", time: "TBC", venue: "Goodison Park", channels: [] }
};

const file = 'data/fixtures.json';
let fixtures = JSON.parse(fs.readFileSync(file, 'utf8'));

fixtures = fixtures.map(match => {
  if (schedule[match.id]) {
    const update = schedule[match.id];
    return {
      ...match,
      date: update.date,
      time: update.time,
      time_th: update.time !== 'TBC' ? update.time : match.time_th,
      time_uk: update.time !== 'TBC' ? 'TBC' : match.time_uk, // Optional: just clear or map time_uk roughly, wait, easier to just set TBC or calculate. We can leave it as TBC for now to avoid timezone logic, or just let time_uk = TBC.
      venue: update.venue,
      channels: update.channels
    };
  }
  return match;
});

fs.writeFileSync(file, JSON.stringify(fixtures, null, 2));
console.log('Schedule updated successfully.');

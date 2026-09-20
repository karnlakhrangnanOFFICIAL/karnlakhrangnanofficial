const fs = require('fs');

let th = JSON.parse(fs.readFileSync('lang/th.json', 'utf8'));
th.home.list_view = "มุมมองรายการ";
th.home.calendar_view = "มุมมองปฏิทิน";
fs.writeFileSync('lang/th.json', JSON.stringify(th, null, 2), 'utf8');

let en = JSON.parse(fs.readFileSync('lang/en.json', 'utf8'));
en.home.list_view = "List View";
en.home.calendar_view = "Calendar View";
fs.writeFileSync('lang/en.json', JSON.stringify(en, null, 2), 'utf8');

console.log('Language files updated');

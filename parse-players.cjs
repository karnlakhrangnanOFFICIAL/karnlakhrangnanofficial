const fs = require('fs');

function parseTSV(text) {
    let result = [];
    let row = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let c = text[i];
        if (c === '"') {
            if (inQuotes && text[i+1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c === '\t' && !inQuotes) {
            row.push(current);
            current = "";
        } else if (c === '\n' && !inQuotes) {
            row.push(current);
            result.push(row);
            row = [];
            current = "";
        } else {
            current += c;
        }
    }
    if (current !== "" || text[text.length-1] === '\t') row.push(current);
    if (row.length > 0) result.push(row);
    return result;
}

const rawText = fs.readFileSync('temp-players.txt', 'utf8');
const rows = parseTSV(rawText);

const players = rows.filter(r => r.length > 5 && r[0].trim() !== '').map(r => {
    const p = {
        id: parseInt(r[0]) || r[0],
        name: r[1],
        position: r[2] || '',
        number: parseInt(r[3]) || null,
        nationality: r[4] || '',
        image: r[5] || '',
        height: parseInt(r[6]) || null,
        foot: r[7] || null,
        date_of_birth: r[8] || null,
        age: parseInt(r[9]) || null,
        current_club: r[10] || '',
        joined: r[11] || null,
        signed_from: r[12] || null,
        market_value: parseInt(r[13]) || null,
        appearances: parseInt(r[14]) || 0,
        goals: parseInt(r[15]) || 0,
        assists: parseInt(r[16]) || 0,
        biography_th: r[17] || '',
        biography_en: r[18] || '',
        stats: {
            "Premier League": {
                "appearances": parseInt(r[19]) || 0,
                "goals": parseInt(r[20]) || 0,
                "assists": parseInt(r[21]) || 0,
                "clean_sheets": parseInt(r[22]) || 0,
                "yellow_cards": parseInt(r[23]) || 0,
                "red_cards": parseInt(r[24]) || 0
            },
            "Carabao Cup": {
                "appearances": parseInt(r[25]) || 0,
                "goals": parseInt(r[26]) || 0,
                "assists": parseInt(r[27]) || 0,
                "clean_sheets": parseInt(r[28]) || 0,
                "yellow_cards": parseInt(r[29]) || 0,
                "red_cards": parseInt(r[30]) || 0
            },
            "FA Cup": {
                "appearances": parseInt(r[31]) || 0,
                "goals": parseInt(r[32]) || 0,
                "assists": parseInt(r[33]) || 0,
                "clean_sheets": parseInt(r[34]) || 0,
                "yellow_cards": parseInt(r[35]) || 0,
                "red_cards": parseInt(r[36]) || 0
            }
        }
    };
    return p;
});

fs.writeFileSync('data/players-men.json', JSON.stringify(players, null, 2));
console.log('Successfully updated data/players-men.json with ' + players.length + ' players');

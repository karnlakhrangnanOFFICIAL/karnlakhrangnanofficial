const fs = require('fs');

const file = 'data/tables-women.json';
let tableData = JSON.parse(fs.readFileSync(file, 'utf8'));

function updateTeam(teamName, gf, ga) {
    const team = tableData.standings.find(t => t.team.toLowerCase().includes(teamName.toLowerCase()));
    if (team) {
        team.p += 1;
        team.gf += gf;
        team.ga += ga;
        team.gd = team.gf - team.ga;
        if (gf > ga) {
            team.w += 1;
            team.pts += 3;
        } else if (gf === ga) {
            team.d += 1;
            team.pts += 1;
        } else {
            team.l += 1;
        }
    }
}

// Chelsea vs Aston Villa (1 - 1)
// Already applied previously

// Manchester United vs Chelsea (0 - 5)
updateTeam("Chelsea", 5, 0);
updateTeam("Manchester United", 0, 5);

// Sort standings by PTS, then GD, then GF
tableData.standings.sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
});

// Update pos
tableData.standings.forEach((t, i) => t.pos = i + 1);

fs.writeFileSync(file, JSON.stringify(tableData, null, 2));
console.log("Women's table updated.");

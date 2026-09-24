// ============================================
// KARN LA KHRANg NAN Official - Team Page JS
// ============================================

const API_PLAYERS_MEN =
  "https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=men";
const API_PLAYERS_WOMEN =
  "https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=women";

// ---------- TAB SYSTEM ----------
function showTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));
  const targetTab = document.getElementById("tab-" + tabName);
  if (targetTab) targetTab.classList.add("active");
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    if (btn.getAttribute("data-tab") === tabName) btn.classList.add("active");
  });
}

function initTabButtons() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      if (tabName) showTab(tabName);
    });
  });
}

// ---------- FORMAT DATE ----------
function formatDate(dateString, lang) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  if (lang === "th") {
    const thaiMonths = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  }
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
}

function formatCompetitionName(name) {
  if (!name) return "";
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function renderFixtures(container, fixtures, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || "th";
  if (fixtures.length === 0) {
    const noMsg = lang === "th" ? "ไม่มีโปรแกรมแข่งขัน" : "No upcoming fixtures";
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">📅</span><p>${noMsg}</p></div>`;
    return;
  }
  const timeNote =
    lang === "th"
      ? "ℹ️ เวลาการแข่งขันแสดงเป็นเวลาประเทศอังกฤษ (UK Time - GMT/BST)"
      : "ℹ️ Match times are displayed in UK Time (GMT/BST)";
  const cardsHtml = fixtures
    .map((match, index) => {
      const compLogo = match.competition_logo || "";
      const compName = formatCompetitionName(match.competition_name || match.competition);
      const localDT = window.getLocalMatchDateTime
        ? window.getLocalMatchDateTime(match.date, match.time_th || match.time, match.time_uk)
        : {
            date: match.date,
            time: (match.time_uk || match.time_th || match.time || "TBC").substring(0, 5),
          };
      const displayDate = localDT.date;
      const displayTime = localDT.time === "TBC" ? "TBC" : localDT.time;

      let channelsIcons = "";
      if (match.channels && match.channels.length > 0) {
        channelsIcons = match.channels
          .map((ch) => {
            let chName = typeof ch === "string" ? ch : ch.name || "";
            let iconUrl =
              ch && typeof ch === "object" && ch.logo
                ? ch.logo
                : "databases/logo/channels/default.png";
            if (!ch.logo) {
              if (chName.toLowerCase().includes("true"))
                iconUrl = "databases/logo/channels/true_premier.png";
              else if (chName.toLowerCase().includes("bein"))
                iconUrl = "databases/logo/channels/bein.png";
              else if (chName.toLowerCase().includes("pptv"))
                iconUrl = "databases/logo/channels/pptv.png";
              else if (chName.toLowerCase().includes("apple"))
                iconUrl = "databases/logo/channels/apple.png";
            }
            return `<img src="${iconUrl}" class="channel-icon" alt="${chName}" title="${chName}" onerror="this.style.display='none'">`;
          })
          .join("");
      }

      const teamParam = badgeClass === "W" ? "&team=women" : "&team=men";

      const homeStr = match.home_team.toLowerCase();
      const awayStr = match.away_team.toLowerCase();
      const isChelseaHome = homeStr.includes("chelsea") || homeStr === "kanlakhrangnan";
      const isChelseaAway = awayStr.includes("chelsea") || awayStr === "kanlakhrangnan";

      let homeNameStyle = "color: #ffffff;";
      let awayNameStyle = "color: #ffffff;";
      if (isChelseaHome)
        homeNameStyle =
          "color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);";
      if (isChelseaAway)
        awayNameStyle =
          "color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);";
      const teamBadgeClass = badgeClass.toLowerCase();
      const isLive = match.status === "live";

      return `
    <a href="match-detail.html?id=${match.id}${teamParam}" class="card-link match-card ${isLive ? "is-live" : ""}" style="animation-delay: ${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date" style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap;">
          ${
            isLive
              ? `
            <span class="live-flashing-badge mini">
              <span class="live-beacon">
                <span class="live-dot-ping"></span>
                <span class="live-dot-core"></span>
              </span>
              <span class="live-badge-text">LIVE ${match.time_live || ""}</span>
            </span>
          `
              : ""
          }
          <span>📅 ${formatDate(displayDate, lang)}</span>
        </div>
        <div class="match-card-league">
          ${compLogo ? `<img src="${compLogo}" alt="">` : ""}
          <span>${compName} <span class="team-badge ${teamBadgeClass}">${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>${match.venue || "Stadium"}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="${match.home_logo}" alt="${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${homeNameStyle}">${typeof renderTeamNameHTML === "function" ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          ${isLive ? `<span style="color:#ef4444; font-weight:800;">${match.home_score || 0} - ${match.away_score || 0}</span>` : `<span>${displayTime}</span>`}
        </div>
        
        <div class="match-card-team away">
          <img src="${match.away_logo}" alt="${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${awayNameStyle}">${typeof renderTeamNameHTML === "function" ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">
          ${
            isLive
              ? `
            <span class="live-flashing-badge mini">
              <span class="live-beacon">
                <span class="live-dot-ping"></span>
                <span class="live-dot-core"></span>
              </span>
              <span class="live-badge-text">LIVE ${match.time_live || "NOW"}</span>
            </span>
          `
              : "UPCOMING MATCH"
          }
        </span>
        <div class="match-card-providers">
          ${channelsIcons}
        </div>
      </div>
    </a>`;
    })
    .join("");
  container.innerHTML = `<div class="time-zone-note" style="font-size:0.8rem; color:var(--text-muted, #94a3b8); margin-bottom:0.75rem; font-weight:500;">${timeNote}</div>${cardsHtml}`;
}

function renderResults(container, results, badgeClass) {
  if (!container) return;
  const lang = window.currentLang || "th";
  if (results.length === 0) {
    const noMsg = lang === "th" ? "ยังไม่มีผลการแข่งขัน" : "No results yet";
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">📊</span><p>${noMsg}</p></div>`;
    return;
  }
  const teamParam = badgeClass === "W" ? "&team=women" : "&team=men";
  container.innerHTML = results
    .map((match, index) => {
      const localDT = window.getLocalMatchDateTime
        ? window.getLocalMatchDateTime(match.date, match.time_th || match.time, match.time_uk)
        : { date: match.date };
      const displayDate = localDT.date;
      const homeWin = match.home_score > match.away_score;
      const awayWin = match.away_score > match.home_score;
      const compName = formatCompetitionName(match.competition_name || match.competition);
      const compLogo = match.competition_logo || "";
      const teamBadgeClass = badgeClass.toLowerCase();

      const homeStr = match.home_team.toLowerCase();
      const awayStr = match.away_team.toLowerCase();
      const isChelseaHome = homeStr.includes("chelsea") || homeStr === "kanlakhrangnan";
      const isChelseaAway = awayStr.includes("chelsea") || awayStr === "kanlakhrangnan";

      let homeNameStyle = "color: #ffffff;";
      let awayNameStyle = "color: #ffffff;";
      if (isChelseaHome)
        homeNameStyle =
          "color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);";
      if (isChelseaAway)
        awayNameStyle =
          "color: #D4AF37; font-weight: 800; text-shadow: 0 0 8px rgba(212, 175, 55, 0.8), 0 0 15px rgba(212, 175, 55, 0.4);";

      let channelsIcons = "";

      let scorersHtml = "";
      if (match.status === "completed" && match.goals && match.goals.length > 0) {
        const homeGoals = match.goals
          .filter((g) => g.team === "home")
          .sort((a, b) => (parseInt(a.minute) || 0) - (parseInt(b.minute) || 0));
        const awayGoals = match.goals
          .filter((g) => g.team === "away")
          .sort((a, b) => (parseInt(a.minute) || 0) - (parseInt(b.minute) || 0));

        const renderHomeGoal = (g) => {
          const rawName = g.player || "";
          const isOG = rawName.includes("(OG)");
          const isPen = rawName.includes("(Pen)");
          const clean = rawName
            .replace(/\s*\(OG\)/i, "")
            .replace(/\s*\(Pen\)/i, "")
            .trim();
          const suffix = isOG ? " (OG)" : isPen ? " (Pen)" : "";
          const avatarUrl = window.getPlayerAvatarUrl
            ? window.getPlayerAvatarUrl(clean)
            : "assets/images/placeholder-player.svg";
          return `
          <div class="card-goal-item home" title="${clean}${suffix} ${g.minute}'">
            <img src="${avatarUrl}" alt="${clean}" class="goal-player-avatar" onerror="this.src='assets/images/placeholder-player.svg'">
            <span class="goal-player-name">${clean}${suffix}</span>
            <span class="goal-minute">${g.minute}'</span>
          </div>
        `;
        };

        const renderAwayGoal = (g) => {
          const rawName = g.player || "";
          const isOG = rawName.includes("(OG)");
          const isPen = rawName.includes("(Pen)");
          const clean = rawName
            .replace(/\s*\(OG\)/i, "")
            .replace(/\s*\(Pen\)/i, "")
            .trim();
          const suffix = isOG ? " (OG)" : isPen ? " (Pen)" : "";
          const avatarUrl = window.getPlayerAvatarUrl
            ? window.getPlayerAvatarUrl(clean)
            : "assets/images/placeholder-player.svg";
          return `
          <div class="card-goal-item away" title="${clean}${suffix} ${g.minute}'">
            <span class="goal-minute">${g.minute}'</span>
            <span class="goal-player-name">${clean}${suffix}</span>
            <img src="${avatarUrl}" alt="${clean}" class="goal-player-avatar" onerror="this.src='assets/images/placeholder-player.svg'">
          </div>
        `;
        };

        scorersHtml = `
        <div class="card-goals-row">
          <div class="card-goals-col home">
            ${homeGoals.map(renderHomeGoal).join("")}
          </div>
          <div class="card-goals-col away">
            ${awayGoals.map(renderAwayGoal).join("")}
          </div>
        </div>
      `;
      }

      return `
    <a href="match-detail.html?id=${match.id}${teamParam}" class="card-link match-card" style="animation-delay: ${index * 0.05}s; text-decoration: none; display: block;">
      <div class="match-card-top">
        <div class="match-card-date">📅 ${formatDate(displayDate, lang)}</div>
        <div class="match-card-league">
          ${compLogo ? `<img src="${compLogo}" alt="">` : ""}
          <span>${compName} <span class="team-badge ${teamBadgeClass}">${badgeClass}</span></span>
        </div>
        <div class="match-card-venue">
          <img src="databases/logo/svg/stadium.svg" alt="Stadium" style="width:14px; height:14px;">
          <span>${match.venue || "Stadium"}</span>
        </div>
      </div>
      
      <div class="match-card-row">
        <div class="match-card-team home">
          <img src="${match.home_logo}" alt="${match.home_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${homeNameStyle}">${typeof renderTeamNameHTML === "function" ? renderTeamNameHTML(match.home_team) : match.home_team}</span>
        </div>
        
        <div class="match-card-timebox">
          <span style="color:var(--primary-color);">${match.home_score} - ${match.away_score}</span>
        </div>
        
        <div class="match-card-team away">
          <img src="${match.away_logo}" alt="${match.away_team}" class="match-card-team-logo" onerror="this.src='assets/images/placeholder-team.svg'">
          <span class="match-card-team-name" style="${awayNameStyle}">${typeof renderTeamNameHTML === "function" ? renderTeamNameHTML(match.away_team) : match.away_team}</span>
        </div>
      </div>
      
      ${scorersHtml}
      
      <div class="match-card-footer team-page-footer">
        <span class="match-card-footer-text team-page-hide-text">FULL TIME</span>
        <div class="match-card-providers">
          ${channelsIcons}
        </div>
      </div>
    </a>`;
    })
    .join("");
}

function getLocalTeamLogo(teamName, fallbackLogo) {
  const nameStr =
    typeof teamName === "object" && teamName !== null
      ? teamName.shortName || teamName.name || ""
      : String(teamName || "");
  const fallback =
    typeof fallbackLogo === "string"
      ? fallbackLogo
      : typeof teamName === "object" && teamName?.crest
      ? teamName.crest
      : "";
  if (!nameStr) return fallback || "databases/logo/teams/england_chelsea.svg";
  const name = nameStr.toLowerCase();
  if (name.includes("city lionesses") || name.includes("london city")) return "databases/logo/teams/London_City_Lionesses.svg";
  if (name.includes("manchester city") || name.includes("man city")) return "databases/logo/teams/england_manchester-city.svg";
  if (name.includes("manchester united") || name.includes("man utd")) return "databases/logo/teams/england_manchester-united.svg";
  if (name.includes("chelsea") || name === "kanlakhrangnan") return "databases/logo/teams/england_chelsea.svg";
  if (name.includes("tottenham") || name.includes("spurs")) return "databases/logo/teams/england_tottenham--2006-2013.svg";
  if (name.includes("arsenal")) return "databases/logo/teams/england_arsenal.svg";
  if (name.includes("aston villa")) return "databases/logo/teams/england_aston-villa.svg";
  if (name.includes("birmingham")) return "databases/logo/teams/england_birmingham.svg";
  if (name.includes("bournemouth")) return "databases/logo/teams/england_bournemouth.svg";
  if (name.includes("brentford")) return "databases/logo/teams/england_brentford.svg";
  if (name.includes("brighton")) return "databases/logo/teams/england_brighton.svg";
  if (name.includes("charlton")) return "databases/logo/teams/england_charlton.svg";
  if (name.includes("coventry")) return "databases/logo/teams/england_coventry-city.svg";
  if (name.includes("crystal palace")) return "databases/logo/teams/england_crystal-palace.svg";
  if (name.includes("everton")) return "databases/logo/teams/england_everton.svg";
  if (name.includes("fulham")) return "databases/logo/teams/england_fulham.svg";
  if (name.includes("hull")) return "databases/logo/teams/england_hull-city.svg";
  if (name.includes("ipswich")) return "databases/logo/teams/england_ipswich.svg";
  if (name.includes("leeds")) return "databases/logo/teams/england_leeds-united.svg";
  if (name.includes("liverpool")) return "databases/logo/teams/england_liverpool.svg";
  if (name.includes("luton")) return "databases/logo/teams/england_luton.svg";
  if (name.includes("newcastle")) return "databases/logo/teams/england_newcastle.svg";
  if (name.includes("nottingham")) return "databases/logo/teams/england_nottingham-forest.svg";
  if (name.includes("sunderland")) return "databases/logo/teams/england_sunderland.svg";
  if (name.includes("west ham")) return "databases/logo/teams/england_west-ham.svg";
  if (name.includes("juventus")) return "databases/logo/teams/italy_juventus--white.svg";
  if (name.includes("milan")) return "databases/logo/teams/italy_milan.svg";
  if (name.includes("barcelona")) return "databases/logo/teams/spain_barcelona.svg";
  if (name.includes("lyon")) return "databases/logo/teams/france_lyon.svg";
  if (name.includes("bayern")) return "databases/logo/teams/germany_bayern-munchen.svg";
  if (name.includes("wolfsburg")) return "databases/logo/teams/germany_wolfsburg.svg";
  if (name.includes("psg") || name.includes("paris saint-germain")) return "databases/logo/teams/france_psg.svg";
  if (name.includes("roma")) return "databases/logo/teams/italy_roma.svg";
  if (name.includes("benfica")) return "databases/logo/teams/portugal_benfica.svg";
  if (name.includes("valerenga") || name.includes("vålerenga")) return "databases/logo/teams/norway_valerenga.svg";
  if (name.includes("galatasaray")) return "databases/logo/teams/turkey_galatasaray.svg";
  if (name.includes("polten") || name.includes("pölten")) return "databases/logo/teams/austria_st-polten.svg";
  if (name.includes("servette")) return "databases/logo/teams/switzerland_servette.svg";
  if (name.includes("sociedad")) return "databases/logo/teams/spain_real-sociedad.svg";
  if (name.includes("real madrid")) return "databases/logo/teams/spain_real-madrid.svg";
  if (name.includes("celtic")) return "databases/logo/teams/scotland_celtic.svg";
  if (name.includes("twente")) return "databases/logo/teams/netherlands_twente.svg";
  if (name.includes("landhaus")) return "databases/logo/teams/austria_usc-landhaus.svg";
  if (name.includes("auckland")) return "databases/logo/teams/new-zealand_auckland-fc.svg";
  if (name.includes("wanderers")) return "databases/logo/teams/australia_western-sydney-wanderers.svg";
  if (name.includes("johor") || name.includes("tazim")) return "databases/logo/teams/malaysia_johor-darul-tazim.svg";
  if (name.includes("all stars") || name.includes("all-stars")) return "databases/logo/teams/a-league-women-all-stars.svg";
  
  if (fallback && fallback.startsWith("databases/logo/teams/")) return fallback;
  return fallback || "databases/logo/teams/england_chelsea.svg";
}

function renderTable(container, table, highlightTeam, compLogo, compName, compKey = "wsl") {
  if (!table || table.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
    return;
  }
  const isWomenPage =
    window.location.pathname.includes("women") ||
    (compName && compName.toLowerCase().includes("women"));
  const isUwcl =
    compKey === "uwcl" ||
    (compName && compName.toLowerCase().includes("champions league"));

  const logoHtml = compLogo
    ? `<div class="table-comp-header" style="display:flex; align-items:center; gap:12px; margin-bottom:1rem; padding:10px 14px; background:var(--surface, rgba(255,255,255,0.04)); border:1px solid var(--border-color, rgba(255,255,255,0.08)); border-radius:8px;"><img src="${compLogo}" alt="${compName || ""}" onerror="this.style.display='none'" style="height:60px; width:60px; object-fit:contain;"><div style="display:flex; flex-direction:column;"><span style="font-weight:700; font-size:1.05rem; color:var(--ink);">${compName || ""}</span><span style="font-size:0.8rem; color:var(--text-muted); font-family:'Space Mono',monospace;">${isUwcl ? "League Phase · Single Table (18 Teams)" : "2026/27 Season"}</span></div></div>`
    : "";
  container.innerHTML = `
    ${logoHtml}
    <table class="league-table">
      <thead><tr><th title="Rank">#</th><th title="Logo">Logo</th><th title="Team">Team</th><th title="จำนวน Match ที่แข่ง">P</th><th title="ชนะ">W</th><th title="เสมอ">D</th><th title="แพ้">L</th><th title="Goal +">GF</th><th title="Goal -">GA</th><th title="Goal =">GD</th><th title="Point">PTS</th></tr></thead>
      <tbody>
        ${table
          .map((row, index) => {
            const rawTeamName =
              typeof row.team === "object" && row.team !== null
                ? row.team.shortName || row.team.name || ""
                : row.team || "";
            const rawTeamLogo =
              row.logo ||
              (typeof row.team === "object" && row.team !== null ? row.team.crest : "");
            let teamHtml =
              typeof renderTeamNameHTML === "function" ? renderTeamNameHTML(rawTeamName) : rawTeamName;
            let posNum = parseInt(row.pos ?? row.position ?? index + 1, 10);
            let posClass = "";
            let teamLogo = getLocalTeamLogo(row.team, rawTeamLogo);

            if (isUwcl) {
              if (posNum >= 1 && posNum <= 4) posClass = "pos-first-tier";
              else if (posNum >= 5 && posNum <= 16) posClass = "pos-playoff";
              else if (posNum >= 17) posClass = "pos-relegation";
            } else if (isWomenPage) {
              if (posNum >= 1 && posNum <= 2) posClass = "pos-ucl";
              else if (posNum === 3) posClass = "pos-uwcl-qual";
              else if (posNum === table.length - 1 && table.length > 3) posClass = "pos-rel-po";
              else if (posNum === table.length && table.length > 2) posClass = "pos-rel";
            } else {
              if (posNum >= 1 && posNum <= 4) posClass = "pos-ucl";
              else if (posNum === 5) posClass = "pos-uel";
              else if (posNum >= 18) posClass = "pos-rel";
            }

            const p = row.p ?? row.playedGames ?? 0;
            const w = row.w ?? row.won ?? 0;
            const d = row.d ?? row.draw ?? 0;
            const l = row.l ?? row.lost ?? 0;
            const gf = row.gf ?? row.goalsFor ?? 0;
            const ga = row.ga ?? row.goalsAgainst ?? 0;
            const gd = row.gd ?? row.goalDifference ?? gf - ga;
            const pts = row.pts ?? row.points ?? 0;

            const isHighlighted =
              rawTeamName.toLowerCase().includes("chelsea") ||
              (highlightTeam &&
                rawTeamName.toLowerCase().includes(String(highlightTeam).toLowerCase()));

            return `
          <tr class="${posClass} ${isHighlighted ? "highlight" : ""}">
            <td>${posNum}</td>
            <td class="logo-cell">${teamLogo ? `<img src="${teamLogo}" alt="${rawTeamName}" class="table-team-logo" onerror="this.onerror=null; this.src='databases/logo/teams/england_chelsea.svg';">` : ""}</td>
            <td class="team-cell">${teamHtml}</td>
            <td>${p}</td><td>${w}</td><td>${d}</td><td>${l}</td>
            <td>${gf}</td><td>${ga}</td><td>${gd}</td>
            <td><strong>${pts}</strong></td>
          </tr>
          `;
          })
          .join("")}
      </tbody>
    </table>`;
}

function renderWomenTableRules(compKey = "uwcl") {
  const rulesCard = document.getElementById("womenTableRules");
  if (!rulesCard) return;

  const isTh = (window.currentLang || "th") === "th";
  const isUwcl = compKey === "uwcl";

  rulesCard.innerHTML = `
    <div class="table-rules-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
      <span>📌 ${isTh ? "กฎระเบียบการแข่งขัน บันทึกคะแนน & คำอธิบายสัญลักษณ์ (League Notes & Rank Key)" : "Rules, Match Notes & Rank Key"}</span>
      <a href="https://www.uefa.com/womenschampionsleague/standings/" target="_blank" rel="noopener noreferrer" style="font-size: 0.75rem; color: var(--gold); text-decoration: underline; font-family: 'Space Mono', monospace;">
        🔗 ${isTh ? "ตารางคะแนนทางการ (UEFA.com)" : "Official UEFA Standings"}
      </a>
    </div>

    <div class="table-rules-grid">
      <!-- Section 1: League Notes & Match Notes -->
      <div class="table-rules-section">
        <h3 class="table-rules-subtitle">📝 ${isTh ? "League Notes & Match Notes (บันทึกคะแนน)" : "League Notes & Match Notes"}</h3>
        <ul class="table-rules-list">
          <li class="table-rules-item">
            <span style="font-size: 1.1rem; line-height: 1;">⚡</span>
            <span><strong>3 points</strong> ${isTh ? "สำหรับการ win (3 คะแนนสำหรับการชนะ)" : "for a win"}</span>
          </li>
          <li class="table-rules-item">
            <span style="font-size: 1.1rem; line-height: 1;">⚖️</span>
            <span><strong>1 point</strong> ${isTh ? "สำหรับการ draw (1 คะแนนสำหรับการเสมอ)" : "for a draw"}</span>
          </li>
          <li class="table-rules-item">
            <span style="font-size: 1.1rem; line-height: 1;">❌</span>
            <span><strong>0 points</strong> ${isTh ? "สำหรับการ loss (0 คะแนนสำหรับการแพ้)" : "for a loss"}</span>
          </li>
        </ul>

        ${
          isUwcl
            ? `
          <div style="margin-top: 10px; padding: 10px 12px; background: rgba(0, 87, 183, 0.12); border: 1px solid rgba(0, 87, 183, 0.3); border-radius: 8px; font-size: 0.82rem; color: var(--ink);">
            <strong style="color: var(--gold);">⭐ รูปแบบการแข่งขัน UEFA Women's Champions League (League phase):</strong><br>
            • <strong>อันดับ 1 - 4:</strong> ผ่านเข้าสู่รอบ 16 ทีมสุดท้ายโดยตรง (Direct Round of 16 / First Tier Cup)<br>
            • <strong>อันดับ 5 - 16:</strong> ผ่านเข้าสู่รอบเพลย์ออฟน็อคเอาท์ (Knockout phase play-offs)<br>
            • <strong>อันดับ 17 - 18:</strong> ตกรอบการแข่งขัน (Eliminated)
          </div>
        `
            : `
          <div style="margin-top: 10px; padding: 10px 12px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; font-size: 0.82rem; color: var(--ink);">
            <strong style="color: var(--gold);">🏆 โควต้าฟุตบอลยุโรป Barclays Women's Super League:</strong><br>
            • <strong>อันดับ 1 - 2:</strong> ผ่านเข้าสู่ UEFA Women's Champions League รอบลีกโดยตรง<br>
            • <strong>อันดับ 3:</strong> ได้สิทธิ์ไปเล่นรอบคัดเลือกรอบที่ 2 (UWCL Qualifiers)<br>
            • <strong>อันดับ 14:</strong> ตกชั้นสู่ Women's Championship
          </div>
        `
        }

        <p style="font-size: 0.8rem; color: var(--ink-muted); margin-top: 8px; margin-bottom: 0;">
          ${isTh ? "กรณีคะแนนเท่ากัน ตัดสินด้วย: 1. ผลต่างประตูได้-เสีย (Goal Difference) 2. ประตูที่ทำได้ (Goals Scored)" : "Tie-break criteria: 1. Goal difference 2. Goals scored"}
        </p>
      </div>

      <!-- Section 2: Rank Key -->
      <div class="table-rules-section">
        <h3 class="table-rules-subtitle">🏷️ ${isTh ? "Rank Key (คำอธิบายสัญลักษณ์ระดับและสถานะอันดับ)" : "Rank Key (Rank Categories & Status)"}</h3>
        <ul class="table-rules-list">
          <li class="table-rules-item">
            <span class="legend-dot first-tier"></span>
            <span><strong>First Tier Cup:</strong> ${isTh ? "ได้สิทธิ์เข้าร่วม first tier cup (เช่น UEFA Champions League) หรืออยู่ใน qualification zone" : "Qualified for first tier cup (e.g. UEFA Champions League) or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot second-tier"></span>
            <span><strong>Second Tier Cup:</strong> ${isTh ? "ได้สิทธิ์เข้าร่วม second tier cup (เช่น UEFA Europa League) หรืออยู่ใน qualification zone" : "Qualified for second tier cup (e.g. UEFA Europa League) or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot third-tier"></span>
            <span><strong>Third Tier Cup:</strong> ${isTh ? "ได้สิทธิ์เข้าร่วม third tier cup (เช่น UEFA Europa Conference League) หรืออยู่ใน qualification zone" : "Qualified for third tier cup (e.g. UEFA Europa Conference League) or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot playoff"></span>
            <span><strong>Playoff:</strong> ${isTh ? "ได้สิทธิ์สำหรับการเล่น playoff หรืออยู่ใน qualification zone" : "Qualified for playoff or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot promotion"></span>
            <span><strong>Promotion:</strong> ${isTh ? "Squad ได้รับการ promoted หรืออยู่ใน promotion zone" : "Squad promoted or in promotion zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot promo-po"></span>
            <span><strong>Promotion Playoff:</strong> ${isTh ? "ได้สิทธิ์สำหรับการเล่น promotion playoff หรืออยู่ใน qualification zone" : "Qualified for promotion playoff or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot rel-po"></span>
            <span><strong>Relegation Playoff:</strong> ${isTh ? "ได้สิทธิ์สำหรับการเล่น relegation playoff หรืออยู่ใน qualification zone" : "Qualified for relegation playoff or in qualification zone"}</span>
          </li>
          <li class="table-rules-item">
            <span class="legend-dot relegation"></span>
            <span><strong>Relegation:</strong> ${isTh ? "Squad ถูก relegated หรืออยู่ใน relegation zone" : "Squad relegated or in relegation zone"}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Abbreviations / Table Legend -->
    <div class="table-abbr-grid">
      <span class="table-abbr-item"><strong>P:</strong> <span>${isTh ? "จำนวนนัดที่แข่ง (Matches played)" : "Matches played"}</span></span>
      <span class="table-abbr-item"><strong>W:</strong> <span>${isTh ? "ชนะ (Wins)" : "Wins"}</span></span>
      <span class="table-abbr-item"><strong>D:</strong> <span>${isTh ? "เสมอ (Draws)" : "Draws"}</span></span>
      <span class="table-abbr-item"><strong>L:</strong> <span>${isTh ? "แพ้ (Losses)" : "Losses"}</span></span>
      <span class="table-abbr-item"><strong>GF:</strong> <span>${isTh ? "ได้ (Goals For)" : "Goals For"}</span></span>
      <span class="table-abbr-item"><strong>GA:</strong> <span>${isTh ? "เสีย (Goals Against)" : "Goals Against"}</span></span>
      <span class="table-abbr-item"><strong>DIFF / GD:</strong> <span>${isTh ? "ผลต่าง (Goal Difference)" : "Goal Difference"}</span></span>
      <span class="table-abbr-item"><strong>Pts:</strong> <span>${isTh ? "คะแนน (Points)" : "Points"}</span></span>
    </div>
  `;
}

function renderPlayers(container, players, teamType) {
  const isTh = (window.currentLang || "th") === "th";
  const goalsText = isTh ? "ประตู" : "goals";
  const assistsText = isTh ? "แอสซิสต์" : "assists";
  const appsText = isTh ? "นัด" : "apps";

  container.innerHTML = players
    .map((p) => {
      let pos = p.position || "";
      pos = formatPlayerPosition(p.position, isTh);
      let pImage = p.image || "assets/images/placeholder-player.svg";

      let statusBadge = "";
      let opacity = "1";

      if (p.status === "sold") {
        const dest = p.current_club ? ` → ${p.current_club}` : "";
        statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#c0392b; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isTh ? "ย้ายออก" : "Sold"}${dest}</div>`;
        opacity = "0.65";
      } else if (p.status === "loaned_out") {
        const dest = p.current_club ? ` → ${p.current_club}` : "";
        statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#f39c12; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isTh ? "ยืมตัว" : "Loaned Out"}${dest}</div>`;
        opacity = "0.85";
      } else if (p.status === "released") {
        statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#7f8c8d; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isTh ? "หมดสัญญา" : "Released"}</div>`;
        opacity = "0.65";
      } else if (p.status === "retired") {
        statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#4a5568; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isTh ? "แขวนสตั๊ด" : "Retired"}</div>`;
        opacity = "0.65";
      } else if (p.status === "new_signing") {
        statusBadge = `<div style="position:absolute; top:10px; right:10px; background:#27ae60; color:#fff; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; z-index:1; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${isTh ? "นักเตะใหม่" : "New Signing"}</div>`;
      }

      return `
      <a href="player-profile.html?id=${p.id}&team=${teamType}" class="player-card" style="text-decoration: none; color: inherit; display: block; position:relative; opacity: ${opacity};">
        ${statusBadge}
        <img src="${pImage}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/placeholder-player.svg';">
        <div class="player-info">
          <h3>${p.name}</h3>
          <span class="player-number">#${p.status === "sold" || p.status === "loaned_out" || p.status === "released" || p.status === "retired" ? "?" : p.number || "?"}</span>
          <span class="player-position">${pos}</span>
          <div class="player-stats">
          ${(() => {
            let tGoals = p.goals || 0,
              tAssists = p.assists || 0,
              tApps = p.appearances || 0;
            if (p.stats) {
              tGoals = 0;
              tAssists = 0;
              tApps = 0;
              for (let comp in p.stats) {
                tGoals += p.stats[comp].goals || 0;
                tAssists += p.stats[comp].assists || 0;
                tApps += p.stats[comp].appearances || 0;
              }
            }
            return `<span>⚽ ${tGoals} ${goalsText}</span>
            <span>🎯 ${tAssists} ${assistsText}</span>
            <span>👕 ${tApps} ${appsText}</span>`;
          })()}
          </div>
        </div>
      </a>
    `;
    })
    .join("");
}

// ---------- SAFE FETCH JSON ----------
async function safeFetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type");
    if (
      contentType &&
      !contentType.includes("json") &&
      !contentType.includes("javascript") &&
      !contentType.includes("text/plain")
    ) {
      return null;
    }
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn(`Safe fetch failed for ${url}:`, e);
    return null;
  }
}

// ---------- HELPER FOR COMPETITION FILTERING ----------
function getMatchCompKey(match) {
  if (!match) return "other";
  const c = (match.competition || "").toLowerCase();
  const cn = (match.competition_name || "").toLowerCase();
  if (c.includes("premier") || cn.includes("premier")) return "premier-league";
  if (
    c.includes("super league") ||
    cn === "wsl" ||
    c === "wsl" ||
    cn.includes("wsl") ||
    c.includes("barclays")
  )
    return "wsl";
  if (c.includes("champions league") || cn === "uwcl" || c === "uwcl" || cn.includes("uwcl"))
    return "uwcl";
  if (
    c.includes("league-cup") ||
    cn.includes("league-cup") ||
    c.includes("carabao") ||
    cn.includes("carabao") ||
    c.includes("efl") ||
    cn.includes("efl")
  )
    return "league-cup";
  if (c.includes("friendly") || cn.includes("friendly")) return "friendly";
  if (c.includes("fa cup") || cn.includes("fa-cup")) return "fa-cup";
  return (match.competition_name || match.competition || "other").toLowerCase();
}

function getCompDisplayName(key, lang) {
  const isTh = (lang || window.currentLang || "th") === "th";
  const names = {
    all: isTh ? "🏆 ทุกรายการแข่งขัน" : "🏆 All Tournaments",
    "premier-league": isTh ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿 พรีเมียร์ลีก" : "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
    wsl: isTh ? "🏆 บาร์เคลย์ส วีเมนส์ ซูเปอร์ลีก" : "🏆 Barclays WSL",
    uwcl: isTh ? "⭐ ยูฟ่า แชมเปียนส์ลีก (หญิง)" : "⭐ UEFA Women's Champions League",
    "league-cup": isTh ? "🥤 คาราบาว คัพ" : "🥤 Carabao Cup",
    friendly: isTh ? "🤝 นัดกระชับมิตร" : "🤝 Club Friendly",
    "fa-cup": isTh ? "🏆 เอฟเอ คัพ" : "🏆 FA Cup",
  };
  return names[key] || formatCompetitionName(key);
}

function setupSelectCompFilter(selectId, matches, onFilterChange) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;
  const lang = window.currentLang || "th";
  const compKeys = new Set();
  matches.forEach((m) => compKeys.add(getMatchCompKey(m)));

  let html = `<option value="all">${getCompDisplayName("all", lang)} (${matches.length})</option>`;
  const order = ["premier-league", "wsl", "uwcl", "league-cup", "friendly", "fa-cup"];
  const sortedKeys = Array.from(compKeys).sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  sortedKeys.forEach((k) => {
    const count = matches.filter((m) => getMatchCompKey(m) === k).length;
    html += `<option value="${k}">${getCompDisplayName(k, lang)} (${count})</option>`;
  });

  selectEl.innerHTML = html;
  selectEl.onchange = (e) => {
    onFilterChange(e.target.value);
  };
}

// ---------- LOAD DATA ----------
async function loadMenFixtures() {
  const container = document.getElementById("menFixturesContainer");
  if (!container) return;
  try {
    let all = await safeFetchJson("data/fixtures.json");
    if (!all || !Array.isArray(all)) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    all = all.filter((m) => m.team_type === "M");
    const upcoming = all
      .filter((m) => m.status === "upcoming" || m.status === "live")
      .sort((a, b) => {
        let timeA = a.time || "00:00";
        if (timeA === "TBC") timeA = "00:00";
        let timeB = b.time || "00:00";
        if (timeB === "TBC") timeB = "00:00";
        return new Date(a.date + "T" + timeA) - new Date(b.date + "T" + timeB);
      });

    setupSelectCompFilter("menFixturesCompFilter", upcoming, (comp) => {
      const filtered =
        comp === "all" ? upcoming : upcoming.filter((m) => getMatchCompKey(m) === comp);
      renderFixtures(container, filtered, "M");
    });

    renderFixtures(container, upcoming, "M");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading fixtures</p></div>';
    console.error("Fixtures error:", e);
  }
}

async function loadMenResults() {
  const container = document.getElementById("menResultsContainer");
  if (!container) return;
  try {
    let all = await safeFetchJson("data/fixtures.json");
    if (!all || !Array.isArray(all)) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    all = all.filter((m) => m.team_type === "M");
    const results = all
      .filter((m) => m.status === "completed")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setupSelectCompFilter("menResultsCompFilter", results, (comp) => {
      const filtered =
        comp === "all" ? results : results.filter((m) => getMatchCompKey(m) === comp);
      renderResults(container, filtered, "M");
    });

    renderResults(container, results, "M");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading results</p></div>';
    console.error("Results error:", e);
  }
}

// ---------- SAFE GOOGLE SHEETS FETCH (Client-side) ----------
async function fetchGoogleSheetDirect(spreadsheetId, queryParams = "gid=0") {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&${queryParams}&headers=1`;
    const res = await fetch(url);
    const text = await res.text();
    if (!text.includes("google.visualization.Query.setResponse")) {
      throw new Error("Failed to query spreadsheet. Ensure it is public.");
    }
    const jsonStr = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const json = JSON.parse(jsonStr);

    if (json.status === "error") {
      throw new Error(json.errors?.[0]?.detailed_message || "Error reading spreadsheet");
    }

    const table = json.table;
    const cols = table.cols.map((c, i) =>
      c && c.label && c.label.trim() ? c.label.trim() : `col_${i}`
    );
    const rows = table.rows.map((row) => {
      const obj = {};
      row.c.forEach((cell, idx) => {
        const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : null;
        if (val !== null && val !== undefined) {
          const colName = cols[idx] || `col_${idx}`;
          obj[colName] = val;
        }
      });
      return obj;
    });

    return {
      success: true,
      data: rows,
    };
  } catch (err) {
    console.error("Google Sheets Direct Fetch Error:", err);
    return { success: false, error: err.message };
  }
}

async function loadMenTable() {
  const container = document.getElementById("menTableContainer");
  if (!container) return;
  try {
    let data = await safeFetchJson("/api/epl-standings");
    if (data && data.success && data.data) {
      data = data.data;
    } else {
      data = await safeFetchJson("data/tables-men.json");
    }
    if (!data) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }
    const table = Array.isArray(data) ? data : data.standings || data.table || [];
    const compLogo =
      data?.competition_logo || "databases/logo/competitions/men/premier-league.png";
    const compName = data?.competition || "Premier League";
    renderTable(container, table, "Chelsea", compLogo, compName);
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>';
    console.error("Table error:", e);
  }
}

async function loadMenPlayers() {
  const container = document.getElementById("menPlayersContainer");
  if (!container) return;
  try {
    let players = await safeFetchJson("data/players-men.json");

    if (!Array.isArray(players) || players.length === 0) {
      players = await safeFetchJson(API_PLAYERS_MEN);
    }

    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }
    renderPlayers(container, players, container.id.includes("women") ? "women" : "men");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
    console.error("Players error:", e);
  }
}

// Women functions similar
async function loadWomenFixtures() {
  const container = document.getElementById("womenFixturesContainer");
  if (!container) return;
  try {
    let all = await safeFetchJson("data/fixtures-women.json");
    if (!all || !Array.isArray(all) || all.length === 0) {
      all = await safeFetchJson("data/fixtures.json");
    }
    if (!all || !Array.isArray(all)) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    all = all.filter((m) => m.team_type === "W" || (m.id && m.id.startsWith("w")));
    const upcoming = all
      .filter((m) => m.status === "upcoming" || m.status === "live")
      .sort((a, b) => {
        let timeA = a.time || "00:00";
        if (timeA === "TBC") timeA = "00:00";
        let timeB = b.time || "00:00";
        if (timeB === "TBC") timeB = "00:00";
        return new Date(a.date + "T" + timeA) - new Date(b.date + "T" + timeB);
      });

    setupSelectCompFilter("womenFixturesCompFilter", upcoming, (comp) => {
      const filtered =
        comp === "all" ? upcoming : upcoming.filter((m) => getMatchCompKey(m) === comp);
      renderFixtures(container, filtered, "W");
    });

    renderFixtures(container, upcoming, "W");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>';
    console.error(e);
  }
}

async function loadWomenResults() {
  const container = document.getElementById("womenResultsContainer");
  if (!container) return;
  try {
    let all = await safeFetchJson("data/fixtures-women.json");
    if (!all || !Array.isArray(all) || all.length === 0) {
      all = await safeFetchJson("data/fixtures.json");
    }
    if (!all || !Array.isArray(all)) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    all = all.filter((m) => m.team_type === "W" || (m.id && m.id.startsWith("w")));
    const results = all
      .filter((m) => m.status === "completed")
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setupSelectCompFilter("womenResultsCompFilter", results, (comp) => {
      const filtered =
        comp === "all" ? results : results.filter((m) => getMatchCompKey(m) === comp);
      renderResults(container, filtered, "W");
    });

    renderResults(container, results, "W");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>';
    console.error(e);
  }
}

async function loadWomenTable(compChoice = null) {
  const container = document.getElementById("womenTableContainer");
  if (!container) return;
  const filterSelect = document.getElementById("womenTableCompFilter");
  const titleEl = document.getElementById("womenTableTitle");
  const isTh = (window.currentLang || "th") === "th";

  const compKey = compChoice || (filterSelect ? filterSelect.value : "uwcl") || "uwcl";

  if (filterSelect && filterSelect.value !== compKey) {
    filterSelect.value = compKey;
  }

  if (filterSelect && !filterSelect.dataset.listenerAttached) {
    filterSelect.dataset.listenerAttached = "true";
    filterSelect.addEventListener("change", (e) => {
      loadWomenTable(e.target.value);
    });
  }

  if (titleEl) {
    if (compKey === "uwcl") {
      titleEl.innerHTML = isTh
        ? "⭐ ตารางคะแนน UEFA Women's Champions League (League phase)"
        : "⭐ UEFA Women's Champions League Standings (League phase)";
    } else {
      titleEl.innerHTML = isTh
        ? "🏆 ตารางคะแนน Barclays Women's Super League"
        : "🏆 Barclays Women's Super League Standings";
    }
  }

  container.innerHTML = '<div class="loading"><div class="spinner"></div><p>' + (isTh ? "กำลังโหลดตารางคะแนน..." : "Loading standings...") + '</p></div>';

  try {
    let data = null;
    if (compKey === "uwcl") {
      data = await safeFetchJson("/api/uwcl-standings");
      if (!data || !data.success || !data.data) {
        data = await safeFetchJson("data/tables-uwcl.json");
      } else {
        data = data.data;
      }
    } else {
      data = await safeFetchJson("/api/wsl-standings");
      if (!data || !data.success || !data.data) {
        data = await safeFetchJson("data/tables-women.json");
      } else {
        data = data.data;
      }
    }

    if (!data) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }

    const table = Array.isArray(data) ? data : data.standings || data.table || [];
    let compLogo = data?.competition_logo;
    if (!compLogo) {
      compLogo = compKey === "uwcl"
        ? "databases/logo/competitions/women/women_uwcl_champions_league_logo.svg"
        : "databases/logo/competitions/women/women_super_league.png";
    }
    const compName = data?.competition || (compKey === "uwcl" ? "UEFA Women's Champions League" : "Barclays Women's Super League");

    renderTable(container, table, "Chelsea", compLogo, compName, compKey);
    renderWomenTableRules(compKey);
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading table</p></div>';
    console.error("loadWomenTable error:", e);
  }
}

async function loadWomenPlayers() {
  const container = document.getElementById("womenPlayersContainer");
  const coachContainer = document.getElementById("womenCoachProfileContainer");
  if (!container) return;
  const isTh = (window.currentLang || "th") === "th";

  try {
    let allData = await safeFetchJson("data/players-women.json");

    if (!Array.isArray(allData) || allData.length === 0) {
      allData = await safeFetchJson(API_PLAYERS_WOMEN);
    }

    if (!Array.isArray(allData) || allData.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }

    // Render Sonia Bompastor Head Coach Card
    if (coachContainer) {
      coachContainer.innerHTML = `
        <div class="coach-profile-card">
          <div class="coach-header-row">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <div class="coach-avatar-badge" title="Sonia Bompastor" style="border-color: #C2185B;">
                <img src="https://img.chelseafc.com/image/upload/f_auto,h_860,q_50/editorial/people/management/2026-27/Sonia_Bompastor_profile_2026-27_avatar-removebg.png" alt="Sonia Bompastor" class="coach-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <span class="coach-avatar-fallback" style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;">SB</span>
              </div>
              <div>
                <div style="font-size: 0.78rem; color: #f472b6; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; display: flex; align-items: center; gap: 0.4rem;">
                  <span>👚</span>
                  <span>Head coach / โค้ชทีมหญิง</span>
                </div>
                <div style="font-size: 1.45rem; font-weight: 900; color: #ffffff; letter-spacing: 0.3px; line-height: 1.2; margin-top: 2px;">
                  Sonia Bompastor <span style="font-size: 0.95rem; font-weight: 600; color: #fbcfe8;">(${isTh ? "โซเนีย บอมพาสเตอร์" : "French"})</span>
                </div>
              </div>
            </div>

            <div class="coach-meta-badges">
              <div class="coach-meta-chip">
                <img src="databases/logo/national/fr.svg" alt="France" style="width: 20px; height: 14px; object-fit: cover; border-radius: 2px; display: inline-block; vertical-align: middle; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                <span><strong>Nationality:</strong> ${isTh ? "ฝรั่งเศส (French)" : "French"}</span>
              </div>
              <div class="coach-meta-chip">
                <span>👚</span>
                <span><strong>Position:</strong> Head coach (${isTh ? "โค้ช" : "Manager"})</span>
              </div>
              <div class="coach-meta-chip">
                <span>📅</span>
                <span><strong>Contract:</strong> 2024 - 2030 (Extended)</span>
              </div>
            </div>
          </div>

          <!-- Key Honours & Milestones -->
          <div class="coach-highlights-row">
            <span class="coach-trophy-tag" style="border-color: rgba(244,114,182,0.4); background: rgba(194,24,91,0.15); color: #fbcfe8;">🏆 Domestic Treble (2024/25)</span>
            <span class="coach-trophy-tag" style="border-color: rgba(244,114,182,0.4); background: rgba(194,24,91,0.15); color: #fbcfe8;">🛡️ ไร้พ่ายประวัติศาสตร์ 22 นัด WSL Unbeaten</span>
            <span class="coach-trophy-tag" style="border-color: rgba(244,114,182,0.4); background: rgba(194,24,91,0.15); color: #fbcfe8;">⭐ UWCL แชมป์ทั้งฐานะนักเตะและผู้จัดการทีม</span>
            <span class="coach-trophy-tag" style="border-color: rgba(244,114,182,0.4); background: rgba(194,24,91,0.15); color: #fbcfe8;">🏆 แชมป์ D1 Féminine 3 สมัยซ้อน</span>
            <span class="coach-trophy-tag" style="border-color: rgba(244,114,182,0.4); background: rgba(194,24,91,0.15); color: #fbcfe8;">🥈 รองชนะเลิศ The Best FIFA Women’s Coach 2025</span>
          </div>

          <!-- Detailed Biography Box -->
          <div class="coach-bio-box">
            <div class="coach-bio-header" id="womenCoachBioToggle">
              <div class="coach-bio-title">
                <span>📖</span>
                <span>${isTh ? "ประวัติและผลงานทางการ (Official Biography)" : "Official Biography & Career"}</span>
              </div>
              <button type="button" class="coach-bio-toggle-btn" id="womenCoachBioToggleBtn">
                ${isTh ? "ย่อ/ขยายเนื้อหา ▼" : "Expand / Collapse ▼"}
              </button>
            </div>
            <div class="coach-bio-content" id="womenCoachBioContent" style="display: flex; flex-direction: column; gap: 12px;">
              ${
                isTh
                  ? `
                <div style="background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #C2185B;">
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #e2e8f0;">
                    Sonia Bompastor เข้ารับตำแหน่ง <strong>head coach</strong> ของ <strong>women’s team</strong> ในช่วงเริ่มต้นของ <strong>season</strong> 2024/25 หลังจากคุม <strong>team</strong> Lyon ในบ้านเกิดที่ประเทศ France เป็นเวลา 3 <strong>seasons</strong> กุนซือวัย 43 ปีรายนี้ก็เริ่มงานใน <strong>role</strong> ใหม่เมื่อวันที่ 1 July 2024 หลังเซ็น <strong>contract</strong> เป็นเวลา 4 ปี
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    เธอเข้ามาทำหน้าที่แทน Emma Hayes ผู้คุม <strong>team</strong> มาอย่างยาวนาน ซึ่งอำลา Chelsea ไปหลังจบ <strong>season</strong> 2023/24 หลังจากกุมบังเหียน <strong>Blues</strong> มาเกือบ 12 ปี
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    Bompastor เคยติด <strong>French national team</strong> ถึง 156 ครั้ง ก่อนจะแขวนสตั๊ดในปี 2013 เพื่อผันตัวไปรับ <strong>position</strong> โค้ชใน <strong>academy</strong> ของ Lyon ต่อมาในเดือน April 2021 เธอได้รับการแต่งตั้งเป็น <strong>head coach</strong> ของ <strong>first team</strong> และประสบความสำเร็จอย่างมากตลอดช่วงเวลาที่อยู่ใน <strong>role</strong> นี้ โดยพาทีมคว้า <strong>title</strong> Division 1 Feminine ได้ตลอดทั้ง 3 <strong>seasons</strong> ก่อนที่เธอจะย้ายมาร่วม <strong>team</strong> Chelsea
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    เธอพา Lyon คว้า <strong>double</strong> แชมป์ ทั้ง <strong>league</strong> และการแข่งขันระดับ European ใน <strong>season</strong> แรกที่คุมทีมเต็มฤดูกาล ส่งผลให้เธอกลายเป็น <strong>person</strong> คนแรกที่คว้าแชมป์ UEFA Women’s Champions League ได้ทั้งในฐานะ <strong>player</strong> และ <strong>manager</strong>
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    การคุม <strong>team</strong> Chelsea ในเดือนแรกจบลงด้วยการที่เธอได้รับ <strong>award</strong> WSL Manager of the Month ประจำเดือน September และเดินหน้าสร้างประวัติศาสตร์เป็น <strong>coach</strong> คนแรกใน <strong>history</strong> ของ WSL ที่คว้าชัยชนะได้ตลอด 9 <strong>games</strong> แรกในรายการนี้
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    ช่วงปลายเดือน November 2024 เธอมี <strong>name</strong> ติดโผผู้เข้าชิง The Best FIFA Women's Coach และคว้ารางวัล WSL Manager of the Month ประจำเดือน November ไปครอง ตามด้วย <strong>award</strong> เดียวกันนี้อีกครั้งในเดือน January
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    กว่าที่ความพ่ายแพ้นัดแรกของ <strong>season</strong> รวมทุก <strong>competitions</strong> จะเกิดขึ้นใน <strong>first leg</strong> ของศึก Champions League ที่พบกับ Man City สถิติการไร้พ่ายใน <strong>league</strong> ของ Bompastor ก็พุ่งขึ้นไปถึง 16 นัด ซึ่งถือเป็นสถิติที่ดีที่สุดใน <strong>history</strong> ของ WSL นอกจากนี้เธอยังคว้า <strong>trophy</strong> แรกกับ Chelsea ได้สำเร็จ หลังเอาชนะ City ในรอบ <strong>final</strong> ของ League Cup
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    แม้จะมีช่วงสะดุดอยู่บ้างเมื่อ Barcelona เขี่ย <strong>Blues</strong> ตกรอบใน <strong>semi-final stage</strong> ของ Champions League แต่ <strong>side</strong> ของ Bompastor ก็เดินหน้าคว้า <strong>domestic treble</strong> มาครองได้อย่างยอดเยี่ยม พร้อมสร้างสถิติไร้พ่ายตลอด <strong>season</strong> 22 นัดใน WSL อย่างที่ไม่เคยมีใครทำได้มาก่อน รวมถึงการเอาชนะ Manchester United ไปแบบขาดลอย 3-0 ใน <strong>final</strong> ของ FA Cup
                  </p>
                  <p style="margin: 0; line-height: 1.6; font-size: 0.88rem; color: #cbd5e1;">
                    เธอมีชื่อติด <strong>shortlist</strong> ลุ้นรางวัล Best Coach ของงาน Ballon d'Or และจบลงด้วยอันดับ 2 จากผลโหวต The Best FIFA Women’s Coach ประจำปี 2025 ในเดือน February 2026 Bompastor ได้ต่อ <strong>contract</strong> กับ Chelsea ออกไปจนถึงปี 2030
                  </p>
                </div>
              `
                  : `
                <div style="background: rgba(255,255,255,0.02); padding: 12px 14px; border-radius: 8px; border-left: 3px solid #38bdf8;">
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    Sonia Bompastor became head coach of the women’s team for the start of the 2024/25 season. Having spent three seasons in charge of Lyon in her native France, the 43-year-old began her new role on 1 July 2024 after signing a four-year contract.
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    She replaced the long-serving Emma Hayes who departed Chelsea upon the conclusion of the 2023/24 season after nearly 12 years in charge of the Blues.
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    Bompastor was capped 156 times by the French national team before retiring in 2013 to take up a coaching position with Lyon’s Academy. In April 2021, she became first team head coach and enjoyed much success during her time in the role, winning the Division 1 Feminine title in the three seasons prior to her joining Chelsea.
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    She led Lyon to a league and European double during her first full season in charge, becoming the first person to win the UEFA Women’s Champions League as both a player and a manager.
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    Her first month in charge of Chelsea ended with her awarded the WSL Manager of the Month for September and she went on to became the first coach in WSL history to win their first nine games in the competition. At the end of November 2024, she was included in The Best FIFA Women's Coach nominees and named WSL Manager of the Month for November, which was followed by the same award for January.
                  </p>
                  <p style="margin: 0 0 8px 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    By the time a first defeat of the season in all competitions came in a Champions League first leg at Man City, Bompastor's unbeaten league run was up to 16, the best in WSL history. She had also collected her first trophy with Chelsea. City were defeated in the League Cup final. Although there was an isolated setback when Barcelona knocked the Blues out of the Champions League at the semi-final stage, Bompastor's side duly went on to complete a domestic treble, with an unprecedented unbeaten campaign for a 22-match WSL season, and a convincing 3-0 win over Manchester United in the FA Cup final.
                  </p>
                  <p style="margin: 0; line-height: 1.6; font-size: 0.85rem; color: #94a3b8;">
                    She was named on the shortlist for the Best Coach award at the Ballon d'Or and finished second in the voting for The Best FIFA Women’s Coach of 2025. In February 2026, Bompastor extended her contract at Chelsea to 2030.
                  </p>
                </div>
              `
              }
            </div>
          </div>
        </div>
      `;

      // Bind collapsible toggle listener
      const toggleBtn = document.getElementById("womenCoachBioToggleBtn");
      const toggleHeader = document.getElementById("womenCoachBioToggle");
      const bioContent = document.getElementById("womenCoachBioContent");
      if (toggleBtn && bioContent) {
        const handleToggle = () => {
          if (bioContent.style.display === "none") {
            bioContent.style.display = "flex";
            toggleBtn.textContent = isTh ? "ย่อเนื้อหา ▲" : "Collapse ▲";
          } else {
            bioContent.style.display = "none";
            toggleBtn.textContent = isTh ? "ขยายอ่านทั้งหมด ▼" : "Expand ▼";
          }
        };
        toggleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          handleToggle();
        });
        if (toggleHeader) toggleHeader.addEventListener("click", handleToggle);
      }
    }

    // Filter out coach from the players grid list
    const squadPlayers = allData.filter((p) => p.id !== "sonia-bompastor" && (p.position || "").toLowerCase() !== "head coach");
    renderPlayers(container, squadPlayers, "women");
  } catch (e) {
    container.innerHTML =
      '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
    console.error("Women players error:", e);
  }
}

function initTeamPage() {
  const isWomenPage = window.location.pathname.includes("women");
  initTabButtons();
  if (isWomenPage) {
    loadWomenFixtures();
    loadWomenResults();
    loadWomenTable();
    loadWomenPlayers();
  } else {
    loadMenFixtures();
    loadMenResults();
    loadMenTable();
    loadMenPlayers();
  }
}

document.addEventListener("DOMContentLoaded", initTeamPage);
window.addEventListener("languageChanged", initTeamPage);

// ============================================
// PLAYER PROFILE JS
// ============================================

// Function to fetch and map players from Google Sheet
async function fetchPlayersFromSheet(isMen = true) {
  if (!isMen) {
    // Google Sheets currently only provides profile-men tab
    return [];
  }
  const SPREADSHEET_ID = "11aZTuUOCacJrnx8nAUKu-PQ59NAVoz1nm8vEOE8x6xs";
  const sheetParam = "gid=1721120655&sheet=profile-men";
  try {
    const data = await fetchGoogleSheetDirect(SPREADSHEET_ID, sheetParam);
    if (!data.success || !Array.isArray(data.data))
      throw new Error(data.error || "Failed to fetch sheet");

    // Try to load local JSON as fallback/merge for extra details if needed
    let localData = [];
    try {
      const localRes = await fetch(isMen ? "data/players-men.json" : "data/players-women.json");
      localData = await localRes.json();
    } catch (e) {
      console.warn("Could not load local JSON");
    }

    const sheetPlayers = data.data
      .map((row, index) => {
        const sheetName = row.name || row["ชื่อ"] || "--";
        if (sheetName === "--") return null;

        const localMatch =
          localData.find((p) => p.name.toLowerCase() === sheetName.toLowerCase()) || {};

        // Calculate or format age/dob
        let age = row.age || localMatch.age || null;
        let dobIso = row.date_of_birth || localMatch.date_of_birth || null;
        if (!dobIso && row["วันเกิด"]) {
          const parts = row["วันเกิด"].split("/");
          if (parts.length === 3) {
            dobIso = `${parts[2]}-${parts[1]}-${parts[0]}`;
            const dob = new Date(parts[2], parts[1] - 1, parts[0]);
            const diffMs = Date.now() - dob.getTime();
            age = Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
          }
        }

        // Format image path
        let rawImg = row.image || row["link png"] || localMatch.image || "placeholder-player.svg";
        rawImg = String(rawImg).trim().split(" ")[0]; // Handle "reece-james.png (หรือ James.jpg)"
        let imagePath = rawImg;
        if (!imagePath.startsWith("assets/") && !imagePath.startsWith("http")) {
          imagePath =
            (isMen ? "assets/images/players/men/" : "assets/images/players/women/") + imagePath;
        }

        // Format Market Value
        let mv = row.market_value || localMatch.market_value || null;
        if (mv && typeof mv === "string") {
          mv = Number(mv.replace(/[^0-9.]/g, "")) || mv;
        }

        const idVal = row.id
          ? String(row.id)
          : localMatch.id
            ? String(localMatch.id)
            : `sheet_${index}`;

        return {
          id: idVal,
          name: sheetName,
          number:
            row.number ||
            (row["เบอร์เสื้อ"] && row["เบอร์เสื้อ"] !== "-"
              ? row["เบอร์เสื้อ"]
              : localMatch.number),
          position: row.position || localMatch.position || "Unknown",
          nationality: row.nationality || row["สัญชาติ"] || localMatch.nationality || "--",
          image: imagePath,
          height: row.height || localMatch.height || null,
          foot: row.foot || localMatch.foot || null,
          date_of_birth: dobIso,
          age: age,
          current_club: row.current_club || localMatch.current_club || "Chelsea FC",
          joined: row.joined || localMatch.joined || null,
          signed_from: row.signed_from || localMatch.signed_from || null,
          market_value: mv,
          appearances:
            row.appearances !== undefined ? Number(row.appearances) : localMatch.appearances || 0,
          goals: row.goals !== undefined ? Number(row.goals) : localMatch.goals || 0,
          assists: row.assists !== undefined ? Number(row.assists) : localMatch.assists || 0,
          clean_sheets:
            row.clean_sheets !== undefined
              ? Number(row.clean_sheets)
              : localMatch.clean_sheets || 0,
          biography_th:
            row.biography_th ||
            localMatch.biography_th ||
            (typeof row.biography === "object" ? row.biography?.th : "") ||
            (typeof localMatch.biography === "object" ? localMatch.biography?.th : "") ||
            (typeof row.biography === "string" ? row.biography : "") ||
            (typeof localMatch.biography === "string" ? localMatch.biography : ""),
          biography_en:
            row.biography_en ||
            localMatch.biography_en ||
            (typeof row.biography === "object" ? row.biography?.en : "") ||
            (typeof localMatch.biography === "object" ? localMatch.biography?.en : ""),
          bio:
            row.biography_th ||
            row.biography_en ||
            localMatch.biography_th ||
            localMatch.biography_en
              ? {
                  th: row.biography_th || localMatch.biography_th || "",
                  en: row.biography_en || localMatch.biography_en || "",
                }
              : row.biography || row.bio || localMatch.biography || localMatch.bio || "",
          biography:
            row.biography_th ||
            row.biography_en ||
            localMatch.biography_th ||
            localMatch.biography_en
              ? {
                  th: row.biography_th || localMatch.biography_th || "",
                  en: row.biography_en || localMatch.biography_en || "",
                }
              : row.biography || row.bio || localMatch.biography || localMatch.bio || "",
          stats: row.stats || localMatch.stats || null,
          instagram: row.instagram || localMatch.instagram || "",
          twitter: row.twitter || localMatch.twitter || "",
        };
      })
      .filter(Boolean);

    // Add local players that are NOT in the sheet
    const sheetNames = sheetPlayers.map((p) => p.name.toLowerCase());
    const missingPlayers = localData.filter((p) => !sheetNames.includes(p.name.toLowerCase()));

    return [...sheetPlayers, ...missingPlayers];
  } catch (err) {
    console.error("Error fetching players from sheet:", err);
    return null;
  }
}

function formatPlayerPosition(pos, isTh) {
  if (!pos) return "--";
  if (!isTh) return pos;
  const p = pos.toLowerCase();
  if (p.includes("goalkeeper") || p.includes("gk")) return "ผู้รักษาประตู";
  if (
    p.includes("defender") ||
    p.includes("cb") ||
    p.includes("lb") ||
    p.includes("rb") ||
    p.includes("wb")
  )
    return "กองหลัง";
  if (p.includes("midfielder") || p.includes("cm") || p.includes("dm") || p.includes("am"))
    return "กองกลาง";
  if (
    p.includes("forward") ||
    p.includes("striker") ||
    p.includes("winger") ||
    p.includes("st") ||
    p.includes("rw") ||
    p.includes("lw") ||
    p.includes("cf")
  )
    return "กองหน้า";
  return pos;
}

async function initPlayerProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get("id");
  const requestedTeam = urlParams.get("team");
  let teamType = requestedTeam || "men";
  let isMen = teamType === "men";

  if (!playerId) {
    if (document.getElementById("playerName")) {
      document.getElementById("playerName").textContent = "Player Not Found";
    }
    return;
  }

  try {
    const normalizeName = (str) => {
      if (!str) return "";
      return str
        .toLowerCase()
        .replace(/-/g, " ")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim();
    };

    let playersMen = [];
    let playersWomen = [];

    if (isMen) {
      playersMen = (await safeFetchJson("data/players-men.json")) || [];
      if (!playersMen.length) {
        try {
          playersMen = (await fetchPlayersFromSheet(true)) || [];
        } catch (e) {
          console.warn("Failed to fetch men players from API", e);
        }
      }
    } else {
      playersWomen = (await safeFetchJson("data/players-women.json")) || [];
    }

    let primaryList = isMen ? playersMen : playersWomen;
    let secondaryList = isMen ? playersWomen : playersMen;

    const targetId = decodeURIComponent(playerId).trim();
    const targetNorm = normalizeName(targetId);

    const findInList = (list) => {
      if (!Array.isArray(list)) return null;
      return list.find((p) => {
        if (!p) return false;
        if (String(p.id) === String(targetId)) return true;
        if (p.name) {
          const pNorm = normalizeName(p.name);
          if (pNorm === targetNorm) return true;
          if (pNorm && targetNorm && (pNorm.includes(targetNorm) || targetNorm.includes(pNorm)))
            return true;
        }
        return false;
      });
    };

    let player = findInList(primaryList);
    if (!player && !requestedTeam) {
      player = findInList(secondaryList);
      if (player) {
        isMen = !isMen;
      }
    }

    if (!player) {
      if (document.getElementById("playerName")) {
        document.getElementById("playerName").textContent = "Player Not Found";
      }
      return;
    }

    // Render Player Info
    const isTh = (window.currentLang || "th") === "th";
    document.getElementById("playerName").textContent = player.name;
    document.getElementById("playerNumber").textContent =
      "#" +
      (player.status === "sold" ||
      player.status === "loaned_out" ||
      player.status === "released" ||
      player.status === "retired"
        ? "?"
        : player.number || "?");
    const pImg = player.image || "assets/images/placeholder-player.svg";
    const playerImgEl = document.getElementById("playerImage");
    if (playerImgEl) {
      playerImgEl.src = pImg;
      playerImgEl.alt = player.name;
      playerImgEl.onerror = function () {
        this.onerror = null;
        this.src = "assets/images/placeholder-player.svg";
      };
    }
    document.getElementById("playerTeamBadge").textContent = isMen
      ? isTh
        ? "ทีมชาย"
        : "MEN'S TEAM"
      : isTh
        ? "ทีมหญิง"
        : "WOMEN'S TEAM";

    // Status Badge in Hero
    const statusBadgeEl = document.getElementById("playerStatusBadge");
    if (statusBadgeEl) {
      if (player.status === "sold") {
        statusBadgeEl.style.display = "inline-block";
        statusBadgeEl.style.background = "#c0392b";
        statusBadgeEl.textContent = isTh
          ? player.current_club
            ? `ย้ายไป ${player.current_club}`
            : "ย้ายออก"
          : player.current_club
            ? `Sold to ${player.current_club}`
            : "Sold";
      } else if (player.status === "loaned_out") {
        statusBadgeEl.style.display = "inline-block";
        statusBadgeEl.style.background = "#f39c12";
        statusBadgeEl.textContent = isTh
          ? player.current_club
            ? `ยืมตัวไป ${player.current_club}`
            : "ยืมตัว"
          : player.current_club
            ? `On Loan at ${player.current_club}`
            : "On Loan";
      } else if (player.status === "released") {
        statusBadgeEl.style.display = "inline-block";
        statusBadgeEl.style.background = "#7f8c8d";
        statusBadgeEl.textContent = isTh ? "หมดสัญญา (Free Agent)" : "Released (Free Agent)";
      } else if (player.status === "retired") {
        statusBadgeEl.style.display = "inline-block";
        statusBadgeEl.style.background = "#4a5568";
        statusBadgeEl.textContent = isTh ? "แขวนสตั๊ด (Retired)" : "Retired";
      } else if (player.status === "new_signing") {
        statusBadgeEl.style.display = "inline-block";
        statusBadgeEl.style.background = "#27ae60";
        statusBadgeEl.textContent = isTh ? "นักเตะใหม่" : "New Signing";
      } else {
        statusBadgeEl.style.display = "none";
      }
    }

    // Update active nav link & back link & document title based on team (men / women)
    const menNavLink = document.querySelector('.nav-links a[href="men-team.html"]');
    const womenNavLink = document.querySelector('.nav-links a[href="women-team.html"]');
    const backLink = document.getElementById("playerBackLink");

    if (isMen) {
      if (menNavLink) menNavLink.classList.add("active");
      if (womenNavLink) womenNavLink.classList.remove("active");
      if (backLink) {
        backLink.href = "men-team.html";
        backLink.innerHTML = isTh ? "← กลับหน้าทีมชาย" : "← Back to Men's Team";
      }
    } else {
      if (womenNavLink) womenNavLink.classList.add("active");
      if (menNavLink) menNavLink.classList.remove("active");
      if (backLink) {
        backLink.href = "women-team.html";
        backLink.innerHTML = isTh ? "← กลับหน้าทีมหญิง" : "← Back to Women's Team";
      }
    }

    const teamTitleText = isMen
      ? isTh
        ? "ทีมชาย"
        : "Men's Team"
      : isTh
        ? "ทีมหญิง"
        : "Women's Team";
    document.title = `${player.name} - ${teamTitleText} - KARNLAKHRANGNAN Official`;

    let pos = formatPlayerPosition(player.position, isTh);
    document.getElementById("playerPosition").textContent = pos;
    const natEl = document.getElementById("playerNationality");
    if (natEl) {
      const nat = player.nationality || "";
      const flagHtml = window.getFlagSpriteHTML ? window.getFlagSpriteHTML(nat) : "";
      const natName = window.getCountryName ? window.getCountryName(nat, isTh ? "th" : "en") : nat;
      natEl.innerHTML = `${flagHtml} <span>${natName || "--"}</span>`;
    }

    // Personal Details
    document.getElementById("playerDob").textContent = player.date_of_birth
      ? formatDate(player.date_of_birth, isTh ? "th" : "en")
      : "--";
    document.getElementById("playerAge").textContent = player.age
      ? `(${player.age} ${isTh ? "ปี" : "yo"})`
      : "";
    document.getElementById("playerHeight").textContent = player.height
      ? `${player.height} cm`
      : "--";
    document.getElementById("playerFoot").textContent = player.foot || "--";
    document.getElementById("playerJoined").textContent = player.joined
      ? formatDate(player.joined, isTh ? "th" : "en")
      : "--";
    document.getElementById("playerSignedFrom").textContent = player.signed_from || "--";
    const clubRow = document.getElementById("playerClubRow");
    const clubEl = document.getElementById("playerCurrentClub");
    if (clubRow && clubEl) {
      if (player.current_club && !player.current_club.includes("Chelsea FC")) {
        clubRow.style.display = "list-item";
        clubEl.textContent = player.current_club;
      } else {
        clubRow.style.display = "none";
      }
    }

    let mvText = "--";
    if (player.market_value) {
      if (player.market_value >= 1000000) {
        mvText = "€" + (player.market_value / 1000000).toFixed(1) + "M";
      } else {
        mvText = "€" + player.market_value.toLocaleString();
      }
    }
    document.getElementById("playerMarketValue").textContent = mvText;

    // Stats

    // Stats
    let totalApps = 0,
      totalGoals = 0,
      totalAssists = 0,
      totalCleanSheets = 0,
      totalYellows = 0,
      totalReds = 0;
    const isGK = player.position === "GK" || player.position === "Goalkeeper";

    // Check if clean sheets box exists
    const cleanSheetsBox = document.getElementById("statCleanSheetsBox");
    if (cleanSheetsBox) {
      cleanSheetsBox.style.display = isGK ? "block" : "none";
    }

    const tbody = document.querySelector("#competitionStatsTable tbody");
    const thead = document.querySelector("#competitionStatsTable thead");

    if (tbody && thead) {
      // Setup table headers based on position
      if (isGK) {
        thead.innerHTML =
          '<tr><th style="text-align: left;">Competition</th><th>Apps</th><th>Goals</th><th>Assists</th><th>Clean Sheets</th><th><span style="color:#ecc94b;">YC</span></th><th><span style="color:#f56565;">RC</span></th></tr>';
      } else {
        thead.innerHTML =
          '<tr><th style="text-align: left;">Competition</th><th>Apps</th><th>Goals</th><th>Assists</th><th><span style="color:#ecc94b;">YC</span></th><th><span style="color:#f56565;">RC</span></th></tr>';
      }

      tbody.innerHTML = "";

      if (!player.stats) {
        if (isMen) {
          player.stats = {
            "Premier League": {
              appearances: player.appearances || 0,
              goals: player.goals || 0,
              assists: player.assists || 0,
              clean_sheets: player.clean_sheets || 0,
              yellow_cards: 0,
              red_cards: 0,
            },
            "Carabao Cup": {
              appearances: 0,
              goals: 0,
              assists: 0,
              clean_sheets: 0,
              yellow_cards: 0,
              red_cards: 0,
            },
            "FA Cup": {
              appearances: 0,
              goals: 0,
              assists: 0,
              clean_sheets: 0,
              yellow_cards: 0,
              red_cards: 0,
            },
          };
        } else {
          player.stats = {
            "Barclays Women's Super League": {
              appearances: player.appearances || 0,
              goals: player.goals || 0,
              assists: player.assists || 0,
              clean_sheets: player.clean_sheets || 0,
              yellow_cards: 0,
              red_cards: 0,
            },
            "UEFA Women's Champions League": {
              appearances: 0,
              goals: 0,
              assists: 0,
              clean_sheets: 0,
              yellow_cards: 0,
              red_cards: 0,
            },
            "Women's League Cup": {
              appearances: 0,
              goals: 0,
              assists: 0,
              clean_sheets: 0,
              yellow_cards: 0,
              red_cards: 0,
            },
            "Women's FA Cup": {
              appearances: 0,
              goals: 0,
              assists: 0,
              clean_sheets: 0,
              yellow_cards: 0,
              red_cards: 0,
            },
          };
        }
      }

      if (player.stats) {
        for (const [compName, compStats] of Object.entries(player.stats)) {
          totalApps += compStats.appearances || 0;
          totalGoals += compStats.goals || 0;
          totalAssists += compStats.assists || 0;
          totalYellows += compStats.yellow_cards || 0;
          totalReds += compStats.red_cards || 0;
          if (isGK) totalCleanSheets += compStats.clean_sheets || 0;

          const tr = document.createElement("tr");
          if (isGK) {
            tr.innerHTML = `<td style="text-align: left;">${compName}</td><td>${compStats.appearances || 0}</td><td>${compStats.goals || 0}</td><td>${compStats.assists || 0}</td><td>${compStats.clean_sheets || 0}</td><td>${compStats.yellow_cards || 0}</td><td>${compStats.red_cards || 0}</td>`;
          } else {
            tr.innerHTML = `<td style="text-align: left;">${compName}</td><td>${compStats.appearances || 0}</td><td>${compStats.goals || 0}</td><td>${compStats.assists || 0}</td><td>${compStats.yellow_cards || 0}</td><td>${compStats.red_cards || 0}</td>`;
          }
          tbody.appendChild(tr);
        }
      }
    } else {
      totalApps = player.appearances || 0;
      totalGoals = player.goals || 0;
      totalAssists = player.assists || 0;
    }

    document.getElementById("statApps").textContent = totalApps;
    document.getElementById("statGoals").textContent = totalGoals;
    document.getElementById("statAssists").textContent = totalAssists;

    if (document.getElementById("statCleanSheets"))
      document.getElementById("statCleanSheets").textContent = totalCleanSheets;
    if (document.getElementById("statYellowCards"))
      document.getElementById("statYellowCards").textContent = totalYellows;
    if (document.getElementById("statRedCards"))
      document.getElementById("statRedCards").textContent = totalReds;

    // Bio
    let bioText = "";
    if (player.biography_th || player.biography_en) {
      bioText = isTh
        ? player.biography_th || player.biography_en || ""
        : player.biography_en || player.biography_th || "";
    } else {
      const rawBio = player.biography || player.bio;
      if (rawBio) {
        if (typeof rawBio === "object" && rawBio !== null) {
          bioText = isTh ? rawBio.th || rawBio.en || "" : rawBio.en || rawBio.th || "";
        } else if (typeof rawBio === "string") {
          bioText = rawBio;
        }
      }
    }

    if (bioText) {
      // Clean escape characters (\", \', \n\, \n, \t, etc.)
      const normalizedBio = bioText
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\n\\/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\t/g, " ")
        .replace(/\\/g, "");

      const paragraphs = normalizedBio
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (paragraphs.length > 0) {
        document.getElementById("playerBio").innerHTML = paragraphs
          .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
          .join("");
      } else {
        document.getElementById("playerBio").innerHTML =
          `<p>${normalizedBio.replace(/\n/g, "<br>")}</p>`;
      }
    } else {
      document.getElementById("playerBio").innerHTML =
        `<p>${isTh ? "ไม่มีข้อมูลชีวประวัติ" : "No biography available."}</p>`;
    }

    // Social
    if (player.instagram || player.twitter) {
      document.getElementById("socialSection").style.display = "block";
      if (player.instagram) {
        const igLink = document.getElementById("socialInstagram");
        igLink.href = player.instagram.startsWith("http")
          ? player.instagram
          : `https://instagram.com/${player.instagram}`;
        igLink.style.display = "inline-block";
      }
      if (player.twitter) {
        const twLink = document.getElementById("socialTwitter");
        twLink.href = player.twitter.startsWith("http")
          ? player.twitter
          : `https://twitter.com/${player.twitter}`;
        twLink.style.display = "inline-block";
      }
    }
  } catch (e) {
    console.error(e);
    document.getElementById("playerName").textContent = "Error Loading Player";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("player-profile")) {
    initPlayerProfile();
  }
});

window.addEventListener("languageChanged", () => {
  if (window.location.pathname.includes("player-profile")) {
    initPlayerProfile();
  }
});

/* Tactical Line-up Template — Kit-Themed Pitch & Squad Renderer */
(function (global) {
  "use strict";

  const CLUB_KITS = [
    { match: ["chelsea"], primary: "#034694", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#034694" },
    { match: ["arsenal"], primary: "#ef0107", secondary: "#ffffff", awayPrimary: "#111827", awaySecondary: "#facc15" },
    { match: ["liverpool"], primary: "#c8102e", secondary: "#f6eb61", awayPrimary: "#f8fafc", awaySecondary: "#c8102e" },
    { match: ["manchester united", "man utd", "man united"], primary: "#da291c", secondary: "#fbe122", awayPrimary: "#111827", awaySecondary: "#ffffff" },
    { match: ["manchester city", "man city"], primary: "#6cabdd", secondary: "#1c2c5b", awayPrimary: "#1c2c5b", awaySecondary: "#6cabdd" },
    { match: ["tottenham", "spurs"], primary: "#f8fafc", secondary: "#132257", awayPrimary: "#132257", awaySecondary: "#93c5fd" },
    { match: ["aston villa"], primary: "#670e36", secondary: "#95bfe5", awayPrimary: "#f8fafc", awaySecondary: "#670e36" },
    { match: ["newcastle"], primary: "#111827", secondary: "#ffffff", awayPrimary: "#0f766e", awaySecondary: "#ffffff" },
    { match: ["everton"], primary: "#003399", secondary: "#ffffff", awayPrimary: "#f59e0b", awaySecondary: "#1e293b" },
    { match: ["brighton"], primary: "#0057b8", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#38bdf8" },
    { match: ["brentford"], primary: "#e30613", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#f8fafc" },
    { match: ["crystal palace"], primary: "#1b458f", secondary: "#c4122e", awayPrimary: "#f8fafc", awaySecondary: "#1b458f" },
    { match: ["fulham"], primary: "#f8fafc", secondary: "#111827", awayPrimary: "#111827", awaySecondary: "#ef4444" },
    { match: ["ipswich"], primary: "#0044a9", secondary: "#ffffff", awayPrimary: "#dc2626", awaySecondary: "#ffffff" },
    { match: ["leeds"], primary: "#f8fafc", secondary: "#ffcd00", awayPrimary: "#1d4ed8", awaySecondary: "#ffcd00" },
    { match: ["leicester"], primary: "#003090", secondary: "#fdbe11", awayPrimary: "#f8fafc", awaySecondary: "#003090" },
    { match: ["nottingham forest"], primary: "#dd0000", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#f8fafc" },
    { match: ["southampton"], primary: "#d71920", secondary: "#ffffff", awayPrimary: "#facc15", awaySecondary: "#111827" },
    { match: ["sunderland"], primary: "#eb172b", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#f8fafc" },
    { match: ["west ham"], primary: "#7a263a", secondary: "#1bb1e7", awayPrimary: "#f8fafc", awaySecondary: "#7a263a" },
    { match: ["wolverhampton", "wolves"], primary: "#fdb913", secondary: "#111827", awayPrimary: "#111827", awaySecondary: "#fdb913" },
    { match: ["bournemouth"], primary: "#da291c", secondary: "#111827", awayPrimary: "#f8fafc", awaySecondary: "#da291c" },
    { match: ["coventry"], primary: "#0099dc", secondary: "#ffffff", awayPrimary: "#111827", awaySecondary: "#38bdf8" },
    { match: ["hull city", "hull"], primary: "#f5a12d", secondary: "#111827", awayPrimary: "#111827", awaySecondary: "#f5a12d" },
    { match: ["birmingham"], primary: "#0033a0", secondary: "#ffffff", awayPrimary: "#dc2626", awaySecondary: "#ffffff" },
    { match: ["charlton"], primary: "#d71920", secondary: "#ffffff", awayPrimary: "#111827", awaySecondary: "#f8fafc" },
    { match: ["real sociedad"], primary: "#0067b1", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#38bdf8" },
    { match: ["real madrid"], primary: "#f8fafc", secondary: "#febe10", awayPrimary: "#1e293b", awaySecondary: "#febe10" },
    { match: ["barcelona"], primary: "#a50044", secondary: "#004d98", awayPrimary: "#111827", awaySecondary: "#f59e0b" },
    { match: ["paris saint-germain", "psg"], primary: "#004170", secondary: "#da291c", awayPrimary: "#f8fafc", awaySecondary: "#004170" },
    { match: ["lyon", "ol lyonnes"], primary: "#f8fafc", secondary: "#da291c", awayPrimary: "#1d4ed8", awaySecondary: "#ef4444" },
    { match: ["roma"], primary: "#8e1f2f", secondary: "#f0bc42", awayPrimary: "#f8fafc", awaySecondary: "#8e1f2f" },
    { match: ["austria wien"], primary: "#5b21b6", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#5b21b6" },
    { match: ["bayern"], primary: "#dc052d", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#dc052d" },
    { match: ["benfica"], primary: "#e81b23", secondary: "#ffffff", awayPrimary: "#111827", awaySecondary: "#ffffff" },
    { match: ["flamengo"], primary: "#c8102e", secondary: "#111827", awayPrimary: "#f8fafc", awaySecondary: "#c8102e" },
    { match: ["palmeiras"], primary: "#006437", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#006437" },
    { match: ["fluminense"], primary: "#7a0026", secondary: "#006633", awayPrimary: "#f8fafc", awaySecondary: "#7a0026" },
    { match: ["real betis", "betis"], primary: "#0bb363", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#0bb363" },
    { match: ["copenhagen"], primary: "#f8fafc", secondary: "#0055a4", awayPrimary: "#111827", awaySecondary: "#38bdf8" },
    { match: ["hacken", "häcken"], primary: "#ffd100", secondary: "#111827", awayPrimary: "#111827", awaySecondary: "#ffd100" },
  ];

  const FALLBACK_PALETTES = [
    { primary: "#b91c1c", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#b91c1c" },
    { primary: "#0f766e", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#0f766e" },
    { primary: "#7c3aed", secondary: "#ffffff", awayPrimary: "#f8fafc", awaySecondary: "#7c3aed" },
    { primary: "#d97706", secondary: "#111827", awayPrimary: "#111827", awaySecondary: "#f59e0b" },
    { primary: "#be123c", secondary: "#ffffff", awayPrimary: "#1e293b", awaySecondary: "#fb7185" },
  ];

  function escapeHtml(val) {
    return String(val ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function normalizeText(name) {
    return String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s*\(C\)/gi, "")
      .replace(/\s*\(GK\)/gi, "")
      .replace(/\s*\(O\.?G\.?\)/gi, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hexToRgb(hex) {
    const clean = String(hex || "").replace("#", "");
    if (clean.length !== 6) return { r: 30, g: 41, b: 59 };
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function getContrastInk(hex) {
    const { r, g, b } = hexToRgb(hex);
    const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luma > 0.62 ? "#0f172a" : "#ffffff";
  }

  function colorDistance(hexA, hexB) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return Math.sqrt(
      Math.pow(a.r - b.r, 2) +
      Math.pow(a.g - b.g, 2) +
      Math.pow(a.b - b.b, 2)
    );
  }

  function findClubKit(teamName) {
    const lower = String(teamName || "").toLowerCase();
    for (const entry of CLUB_KITS) {
      if (entry.match.some((kw) => lower.includes(kw))) {
        return entry;
      }
    }
    let hash = 0;
    for (let i = 0; i < lower.length; i++) {
      hash = (hash * 31 + lower.charCodeAt(i)) >>> 0;
    }
    return FALLBACK_PALETTES[hash % FALLBACK_PALETTES.length];
  }

  function getTeamKitPalette(homeName, awayName) {
    const homeEntry = findClubKit(homeName);
    const awayEntry = findClubKit(awayName);

    const home = {
      primary: homeEntry.primary,
      secondary: homeEntry.secondary,
      ink: getContrastInk(homeEntry.primary),
    };

    let awayPrimary = awayEntry.primary;
    let awaySecondary = awayEntry.secondary;
    if (colorDistance(home.primary, awayPrimary) < 95) {
      awayPrimary = awayEntry.awayPrimary || "#dc2626";
      awaySecondary = awayEntry.awaySecondary || "#ffffff";
      if (colorDistance(home.primary, awayPrimary) < 95) {
        awayPrimary = getContrastInk(home.primary) === "#ffffff" ? "#f8fafc" : "#111827";
        awaySecondary = "#f59e0b";
      }
    }

    const away = {
      primary: awayPrimary,
      secondary: awaySecondary,
      ink: getContrastInk(awayPrimary),
    };

    return { home, away };
  }

  function namesMatch(a, b) {
    const na = normalizeText(a);
    const nb = normalizeText(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    const partsA = na.split(" ");
    const partsB = nb.split(" ");
    const lastA = partsA[partsA.length - 1];
    const lastB = partsB[partsB.length - 1];
    if (lastA && lastB && lastA === lastB && lastA.length >= 4) {
      if (partsA.length === 1 || partsB.length === 1) return true;
      if (partsA[0][0] && partsB[0][0] && partsA[0][0] === partsB[0][0]) return true;
    }
    return false;
  }

  function formatMinute(ev) {
    if (ev.display_minute) return String(ev.display_minute).replace(/'$/, "") + "'";
    if (ev.minute !== null && ev.minute !== undefined && String(ev.minute).trim() !== "") {
      return `${String(ev.minute).replace(/'$/, "")}'`;
    }
    return "";
  }

  function enrichSideWithEvents(teamData, side, match) {
    const starting = Array.isArray(teamData?.starting) ? teamData.starting.map((p) => ({ ...p })) : [];
    const substitutes = Array.isArray(teamData?.substitutes) ? teamData.substitutes.map((p) => ({ ...p })) : [];
    const events = Array.isArray(match?.events) ? match.events : [];
    const goals = Array.isArray(match?.goals) ? match.goals : [];

    const allPlayers = [...starting, ...substitutes];
    const findPlayer = (name) => {
      if (!name) return null;
      return allPlayers.find((p) => namesMatch(p.name || p.player_name, name)) || null;
    };

    // Map goals & assists (deduplicate between match.goals and match.events)
    const goalSeen = new Set();
    const assistSeen = new Set();

    const registerGoal = (playerName, minuteRaw, isOwnGoal) => {
      if (isOwnGoal) return;
      const key = `${normalizeText(playerName)}_${String(minuteRaw ?? "")}`;
      if (goalSeen.has(key)) return;
      goalSeen.add(key);
      const target = findPlayer(playerName);
      if (target) {
        target._goals = (target._goals || 0) + 1;
      }
    };

    const registerAssist = (assistName, minuteRaw) => {
      const cleanAssist = String(assistName || "").trim();
      if (!cleanAssist || cleanAssist === "-" || cleanAssist.toLowerCase() === "none") return;
      const key = `${normalizeText(cleanAssist)}_${String(minuteRaw ?? "")}`;
      if (assistSeen.has(key)) return;
      assistSeen.add(key);
      const target = findPlayer(cleanAssist);
      if (target) {
        target._assists = (target._assists || 0) + 1;
      }
    };

    goals.forEach((g) => {
      if (g.team !== side) return;
      const isOg = Boolean(g.own_goal || g.type === "own_goal" || /\(O\.?G\.?\)/i.test(g.player || ""));
      registerGoal(g.player, g.minute, isOg);
      if (!isOg) {
        registerAssist(g.assist || g.assist_player, g.minute);
      }
    });

    events.forEach((ev) => {
      if (ev.team !== side) return;
      if (ev.type === "goal" || ev.type === "penalty") {
        registerGoal(ev.player, ev.minute, false);
        registerAssist(ev.assist || ev.assist_player, ev.minute);
      } else if (ev.type === "assist") {
        registerAssist(ev.player || ev.assist || ev.assist_player, ev.minute);
      } else if (ev.type === "yellow_card") {
        const target = findPlayer(ev.player);
        if (target && !target._card) target._card = "yellow";
      } else if (ev.type === "second_yellow") {
        const target = findPlayer(ev.player);
        if (target) target._card = "second-yellow";
      } else if (ev.type === "red_card") {
        const target = findPlayer(ev.player);
        if (target) target._card = "red";
      } else if (ev.type === "substitution") {
        const pInName = ev.player_in || ev.player;
        const pOutName = ev.player_out || ev.replaced;
        const minStr = formatMinute(ev);
        const pOut = findPlayer(pOutName);
        if (pOut && !pOut._subOut) {
          pOut._subOut = minStr || "Sub";
          pOut._subInPlayer = pInName || "";
        }
        const pIn = findPlayer(pInName);
        if (pIn && !pIn._subIn) {
          pIn._subIn = minStr || "Sub";
          pIn._replaced = pOutName || "";
        }
      }
    });

    starting.forEach((p) => {
      if (!p._subOut && (p.sub_status === "OUT" || p.minute_out)) {
        const m = p.minute_out ?? p.sub_minute;
        p._subOut = m ? `${String(m).replace(/'$/, "")}'` : "Sub";
      }
    });
    substitutes.forEach((p) => {
      if (!p._subIn && (p.sub_status === "IN" || p.minute_in)) {
        const m = p.minute_in ?? p.sub_minute;
        p._subIn = m ? `${String(m).replace(/'$/, "")}'` : "Sub";
      }
    });

    return {
      manager: teamData?.manager || "-",
      formation: teamData?.formation || "",
      starting,
      substitutes,
    };
  }

  function parseFormationLines(formationStr, starting) {
    const count = starting.length;
    if (count === 0) return { lines: [], displayFormation: "" };

    const rawNums = String(formationStr || "")
      .trim()
      .split(/[-–\s]+/)
      .map((n) => parseInt(n, 10))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (rawNums.length > 0) {
      const totalWithGk = 1 + rawNums.reduce((a, b) => a + b, 0);
      if (totalWithGk === count) {
        return { lines: [1, ...rawNums], displayFormation: rawNums.join("-") };
      }
      if (rawNums.reduce((a, b) => a + b, 0) === count) {
        return { lines: rawNums, displayFormation: rawNums.slice(1).join("-") || rawNums.join("-") };
      }
    }

    if (count === 11) {
      const roleOf = (p) => {
        const s = String(p?.position || p?.pos || "").toLowerCase();
        if (s.includes("goalkeeper") || s === "gk") return "GK";
        if (s.includes("defender") || s === "df") return "DF";
        if (s.includes("midfield") || s === "mf") return "MF";
        if (s.includes("forward") || s.includes("striker") || s === "fw") return "FW";
        return "";
      };
      const roles = starting.slice(1).map(roleOf);
      let def = 0;
      let mid = 0;
      let fwd = 0;
      let stage = 0;
      let monotonic = true;
      for (const r of roles) {
        if (!r) { monotonic = false; break; }
        if (r === "DF" && stage <= 0) { stage = 0; def++; }
        else if (r === "MF" && stage <= 1) { stage = 1; mid++; }
        else if (r === "FW" && stage <= 2) { stage = 2; fwd++; }
        else { monotonic = false; }
      }
      if (monotonic && def >= 2 && mid >= 2 && fwd >= 1 && 1 + def + mid + fwd === 11) {
        return { lines: [1, def, mid, fwd], displayFormation: `${def}-${mid}-${fwd}` };
      }
      const totalFwd = roles.filter((r) => r === "FW").length;
      if (totalFwd === 2) {
        return { lines: [1, 4, 4, 2], displayFormation: "4-4-2" };
      }
      return { lines: [1, 4, 2, 3, 1], displayFormation: formationStr || "4-2-3-1" };
    }
    if (count <= 1) {
      return { lines: [count], displayFormation: formationStr || "" };
    }
    const outfield = count - 1;
    const def = Math.min(4, Math.max(1, Math.round(outfield * 0.4)));
    const mid = Math.min(4, Math.max(1, Math.round(outfield * 0.4)));
    const fwd = Math.max(1, outfield - def - mid);
    return {
      lines: [1, def, mid, fwd],
      displayFormation: formationStr || `${def}-${mid}-${fwd}`,
    };
  }

  function getPositionTag(player, lineIndex, totalLines, isTh) {
    const subPos = isTh
      ? (player.sub_pos_th || player.sub_pos_en || "")
      : (player.sub_pos_en || player.sub_pos_th || "");
    if (subPos) return subPos;

    const rawPos = String(player.position || player.pos || "").trim();
    if (rawPos) {
      const lower = rawPos.toLowerCase();
      if (lower.includes("goalkeeper") || lower === "gk") return "GK";
      if (lower.includes("wing-back") || lower.includes("wingback")) {
        return lower.includes("left") ? "LWB" : lower.includes("right") ? "RWB" : "WB";
      }
      if (lower.includes("full-back") || lower.includes("fullback")) {
        return lower.includes("left") ? "LB" : lower.includes("right") ? "RB" : "FB";
      }
      if (lower.includes("centre-back") || lower.includes("center-back") || lower.includes("central defender")) return "CB";
      if (lower === "defender" || lower === "df") return "DF";
      if (lower.includes("defensive mid")) return "CDM";
      if (lower.includes("attacking mid")) return "CAM";
      if (lower.includes("central mid")) return "CM";
      if (lower.includes("midfield")) {
        if (lower.includes("left")) return "LM";
        if (lower.includes("right")) return "RM";
        return "MF";
      }
      if (lower === "mf") return "MF";
      if (lower.includes("forward") || lower.includes("striker") || lower.includes("winger") || lower === "fw") {
        if (lower.includes("left")) return "LW";
        if (lower.includes("right")) return "RW";
        if (lower.includes("centre") || lower.includes("center")) return "ST";
        return "FW";
      }
      if (rawPos !== "C" && rawPos.length <= 8) return rawPos;
    }

    if (lineIndex === 0) return "GK";
    if (lineIndex === 1) return "DF";
    if (lineIndex === totalLines - 1) return "FW";
    return "MF";
  }

  function getShortPlayerName(fullName) {
    const clean = String(fullName || "")
      .replace(/\s*\(C\)/gi, "")
      .replace(/\s*\(GK\)/gi, "")
      .trim();
    const parts = clean.split(/\s+/);
    if (parts.length <= 1) return clean;
    if (parts.length === 2 && clean.length <= 15) return clean;
    return parts[parts.length - 1];
  }

  function isPlayerCaptain(p) {
    const rawName = p.name || p.player_name || "";
    return Boolean(
      /\(C\)/i.test(rawName) ||
      p.captain === true ||
      p.isCaptain === true ||
      p.position === "C" ||
      p.pos === "C"
    );
  }

  function isPlayerGK(p, lineIndex) {
    const rawName = p.name || p.player_name || "";
    const pos = String(p.position || p.pos || "").toLowerCase();
    return Boolean(
      lineIndex === 0 ||
      /\(GK\)/i.test(rawName) ||
      pos === "gk" ||
      pos === "goalkeeper"
    );
  }

  function renderPitchHalfHTML(side, team, isChelsea, options) {
    const { isTh, teamType, resolveChelseaPlayer } = options;
    const { lines } = parseFormationLines(team.formation, team.starting);
    let idx = 0;

    const colsHtml = lines.map((count, lineIdx) => {
      const nodes = [];
      for (let i = 0; i < count; i++) {
        const p = team.starting[idx++];
        if (!p) continue;
        const rawName = p.name || p.player_name || "";
        const cleanName = rawName.replace(/\s*\(C\)/gi, "").replace(/\s*\(GK\)/gi, "").trim();
        const shortName = getShortPlayerName(cleanName);
        const pNum = p.number ?? p.shirt_number ?? "";
        const captain = isPlayerCaptain(p);
        const gk = isPlayerGK(p, lineIdx);
        const posTag = getPositionTag(p, lineIdx, lines.length, isTh);

        const resolved = typeof resolveChelseaPlayer === "function"
          ? resolveChelseaPlayer(cleanName, pNum, teamType, isChelsea)
          : null;

        const avatarInner = resolved?.image
          ? `<img src="${escapeHtml(resolved.image)}" alt="${escapeHtml(cleanName)}" onerror="this.style.display='none'; this.parentElement.textContent='${escapeHtml(pNum || "?")}'">`
          : escapeHtml(pNum || "•");

        const cardType = p._card || p.card || "";
        const cardBadge = cardType
          ? `<span class="tl-badge" title="${cardType === "yellow" ? (isTh ? "ใบเหลือง" : "Yellow Card") : (isTh ? "ใบแดง" : "Red Card")}"><span class="tl-card-icon ${escapeHtml(cardType)}"></span></span>`
          : `<span></span>`;

        const subBadge = p._subOut
          ? `<span class="tl-badge is-sub" title="${isTh ? `เปลี่ยนออก ${p._subOut}${p._subInPlayer ? ` (${p._subInPlayer} ลง)` : ""}` : `Sub off ${p._subOut}${p._subInPlayer ? ` (${p._subInPlayer} on)` : ""}`}">⇄</span>`
          : `<span></span>`;

        const goalCount = Number(p._goals ?? p.goals ?? 0) || 0;
        const assistCount = Number(p._assists ?? p.assists ?? 0) || 0;
        const contribIcons = `${"⚽".repeat(goalCount)}${"👟".repeat(assistCount)}`;
        const contribParts = [];
        if (goalCount > 0) contribParts.push(isTh ? `ทำประตู ${goalCount} ลูก` : `${goalCount} Goal${goalCount > 1 ? "s" : ""}`);
        if (assistCount > 0) contribParts.push(isTh ? `แอสซิสต์ ${assistCount} ครั้ง` : `${assistCount} Assist${assistCount > 1 ? "s" : ""}`);
        const goalBadge = contribIcons
          ? `<span class="tl-badge is-contrib" title="${escapeHtml(contribParts.join(" · "))}">${contribIcons}</span>`
          : `<span></span>`;

        const roleBadge = captain
          ? `<span class="tl-badge is-captain" title="${isTh ? "กัปตันทีม" : "Captain"}">C</span>`
          : gk
          ? `<span class="tl-badge is-gk" title="${isTh ? "ผู้รักษาประตู" : "Goalkeeper"}"><img src="assets/images/gk-glove.svg" alt="GK" /></span>`
          : `<span></span>`;

        const nameHtml = resolved?.id
          ? `<a href="player-profile.html?id=${encodeURIComponent(resolved.id)}&team=${encodeURIComponent(resolved.team || "men")}" class="tl-player-link tl-player-name-text" title="${escapeHtml(cleanName)}">${escapeHtml(shortName)}</a>`
          : `<span class="tl-player-name-text" title="${escapeHtml(cleanName)}">${escapeHtml(shortName)}</span>`;

        nodes.push(`
          <div class="tl-player-node">
            <div class="tl-avatar-wrap">
              <div class="tl-avatar ${cardType === "red" || cardType === "second-yellow" ? "is-red-carded" : ""}">${avatarInner}</div>
              <div class="tl-badge-col left">${cardBadge}${subBadge}</div>
              <div class="tl-badge-col right">${goalBadge}${roleBadge}</div>
            </div>
            <div class="tl-player-name">
              ${pNum !== "" ? `<span class="tl-player-num">${escapeHtml(pNum)}</span>` : ""}
              ${nameHtml}
            </div>
            <div class="tl-player-pos">${escapeHtml(posTag)}</div>
          </div>
        `);
      }
      return `<div class="tl-tactical-col">${nodes.join("")}</div>`;
    }).join("");

    return `<div class="tl-pitch-half ${side === "home" ? "left" : "right"}">${colsHtml}</div>`;
  }

  function renderSubListHTML(side, subs, isChelsea, options) {
    const { isTh, teamType, resolveChelseaPlayer } = options;
    if (!subs || subs.length === 0) {
      return `<div class="tl-empty-note">${isTh ? "ไม่มีข้อมูลตัวสำรอง" : "No substitutes listed"}</div>`;
    }
    return subs.map((s) => {
      const rawName = s.name || s.player_name || "";
      const cleanName = rawName.replace(/\s*\(C\)/gi, "").replace(/\s*\(GK\)/gi, "").trim();
      const pNum = s.number ?? s.shirt_number ?? "-";
      const gk = isPlayerGK(s, -1);
      const posLabel = isTh ? (s.sub_pos_th || s.sub_pos_en || "") : (s.sub_pos_en || s.sub_pos_th || "");

      const resolved = typeof resolveChelseaPlayer === "function"
        ? resolveChelseaPlayer(cleanName, pNum, teamType, isChelsea)
        : null;

      const nameEl = resolved?.id
        ? `<a href="player-profile.html?id=${encodeURIComponent(resolved.id)}&team=${encodeURIComponent(resolved.team || "men")}">${escapeHtml(cleanName)}</a>`
        : `<span>${escapeHtml(cleanName)}</span>`;

      const cardType = s._card || s.card || "";
      const cardEl = cardType
        ? `<span class="tl-card-icon ${escapeHtml(cardType)}" title="${cardType}"></span>`
        : "";
      const subGoals = Number(s._goals ?? s.goals ?? 0) || 0;
      const subAssists = Number(s._assists ?? s.assists ?? 0) || 0;
      const subContribIcons = `${"⚽".repeat(subGoals)}${"👟".repeat(subAssists)}`;
      const goalEl = subContribIcons
        ? `<span class="tl-sub-contrib">${subContribIcons}</span>`
        : "";
      const gkEl = gk
        ? `<img src="assets/images/gk-glove.svg" alt="GK" style="width:14px;height:14px;" />`
        : "";

      const subLine = s._subIn
        ? `<div class="tl-sub-meta">↳ ${escapeHtml(s._subIn)} <span class="tl-sub-out">${isTh ? "แทน" : "Off:"} ${escapeHtml(s._replaced || "-")}</span></div>`
        : "";

      return `
        <div class="tl-sub-item">
          <div class="tl-sub-left">
            <span class="tl-sub-num ${side}">${escapeHtml(pNum)}</span>
            <div class="tl-sub-player-main">
              <div class="tl-sub-player-line">
                ${nameEl}
                ${gkEl}
                ${goalEl}
                ${cardEl}
              </div>
              ${subLine}
            </div>
          </div>
          ${posLabel ? `<div class="tl-sub-right-badges"><span class="tl-inline-pos">${escapeHtml(posLabel)}</span></div>` : ""}
        </div>
      `;
    }).join("");
  }

  function renderTacticalLineupsHTML(match, options = {}) {
    const isTh = options.isTh !== false;
    if (!match || !match.lineups || (!match.lineups.home && !match.lineups.away)) {
      return `
        <div class="empty-tab-box">
          <div style="font-size: 1.5rem; margin-bottom: 8px;">📋</div>
          <strong style="color: var(--ink);">${isTh ? "ยังไม่มีการประกาศรายชื่อผู้เล่น" : "Official lineups not yet announced"}</strong>
          <p>${isTh ? "รายชื่อ 11 ตัวจริงและตัวสำรองจะประกาศประมาณ 1 ชั่วโมงก่อนเวลาเริ่มการแข่งขัน" : "Lineups are usually announced 1 hour before kick-off."}</p>
        </div>
      `;
    }

    const homeTeamName = match.home_team || "Home";
    const awayTeamName = match.away_team || "Away";
    const isHomeChelsea = homeTeamName.toLowerCase().includes("chelsea");
    const isAwayChelsea = awayTeamName.toLowerCase().includes("chelsea");

    const kits = getTeamKitPalette(homeTeamName, awayTeamName);
    const homeData = enrichSideWithEvents(match.lineups.home, "home", match);
    const awayData = enrichSideWithEvents(match.lineups.away, "away", match);

    const homeParsed = parseFormationLines(homeData.formation, homeData.starting);
    const awayParsed = parseFormationLines(awayData.formation, awayData.starting);

    const cssVars = [
      `--tl-home-primary:${kits.home.primary}`,
      `--tl-home-secondary:${kits.home.secondary}`,
      `--tl-home-ink:${kits.home.ink}`,
      `--tl-away-primary:${kits.away.primary}`,
      `--tl-away-secondary:${kits.away.secondary}`,
      `--tl-away-ink:${kits.away.ink}`,
    ].join(";");

    const homeDisplay = global.renderTeamNameHTML ? global.renderTeamNameHTML(homeTeamName) : escapeHtml(homeTeamName);
    const awayDisplay = global.renderTeamNameHTML ? global.renderTeamNameHTML(awayTeamName) : escapeHtml(awayTeamName);

    const normalizeOfficials = () => {
      if (Array.isArray(match.lineups.officials) && match.lineups.officials.length > 0) {
        return match.lineups.officials;
      }
      if (Array.isArray(match.officials) && match.officials.length > 0) {
        return match.officials;
      }
      if (match.officials && typeof match.officials === "object") {
        const list = [];
        const off = match.officials;
        if (off.referee) list.push({ role: isTh ? "ผู้ตัดสิน" : "Referee", name: off.referee });
        if (Array.isArray(off.assistant_referees) && off.assistant_referees.length > 0) {
          off.assistant_referees.forEach((ar, i) => {
            if (ar) list.push({ role: isTh ? `ผู้ช่วยผู้ตัดสิน ${i + 1}` : `Assistant Referee ${i + 1}`, name: ar });
          });
        }
        if (off.fourth_official) list.push({ role: isTh ? "ผู้ตัดสินที่ 4" : "Fourth Official", name: off.fourth_official });
        if (off.var) list.push({ role: "VAR", name: off.var });
        if (off.avar) list.push({ role: isTh ? "ผู้ช่วย VAR" : "AVAR", name: off.avar });
        return list;
      }
      if (match.referee) {
        return [{ role: isTh ? "ผู้ตัดสิน" : "Referee", name: match.referee }];
      }
      return [];
    };

    const officials = normalizeOfficials();
    const officialsHtml = officials.length > 0
      ? `
        <div class="tl-card">
          <div class="tl-section-title">${isTh ? "คณะผู้ตัดสิน (Match Officials)" : "Match Officials"}</div>
          <div class="tl-officials-grid">
            ${officials.map((o) => `
              <div class="tl-official-item">
                <span class="tl-official-role">${escapeHtml(o.role || "")}</span>
                <strong class="tl-official-name">${escapeHtml(o.name || "-")}</strong>
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    return `
      <div class="tactical-lineup-wrap" style="${cssVars}">
        <div class="tl-card">
          <div class="tl-teams-header">
            <div class="tl-team-box home">
              <div class="tl-team-identity">
                <img src="${escapeHtml(match.home_logo || "assets/images/placeholder-team.svg")}" alt="${escapeHtml(homeTeamName)}" class="tl-team-crest" onerror="this.src='assets/images/placeholder-team.svg'">
                <strong class="tl-team-name">${homeDisplay}</strong>
              </div>
              <span class="tl-formation-badge">${escapeHtml(homeParsed.displayFormation || "-")}</span>
            </div>

            <div class="tl-team-box away">
              <div class="tl-team-identity">
                <img src="${escapeHtml(match.away_logo || "assets/images/placeholder-team.svg")}" alt="${escapeHtml(awayTeamName)}" class="tl-team-crest" onerror="this.src='assets/images/placeholder-team.svg'">
                <strong class="tl-team-name">${awayDisplay}</strong>
              </div>
              <span class="tl-formation-badge">${escapeHtml(awayParsed.displayFormation || "-")}</span>
            </div>
          </div>

          <div class="tl-pitch-container">
            <svg class="tl-pitch-svg tl-pitch-svg-desktop" viewBox="0 0 800 440" preserveAspectRatio="none" aria-hidden="true">
              <circle cx="400" cy="220" r="56" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <circle cx="400" cy="220" r="3" fill="rgba(255,255,255,0.5)" />
              <rect x="0" y="102" width="102" height="236" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="0" y="160" width="38" height="120" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="698" y="102" width="102" height="236" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="762" y="160" width="38" height="120" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
            </svg>
            <svg class="tl-pitch-svg tl-pitch-svg-mobile" viewBox="0 0 400 760" preserveAspectRatio="none" aria-hidden="true">
              <circle cx="200" cy="380" r="52" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <circle cx="200" cy="380" r="3" fill="rgba(255,255,255,0.5)" />
              <rect x="92" y="0" width="216" height="92" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="142" y="0" width="116" height="36" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="92" y="668" width="216" height="92" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
              <rect x="142" y="724" width="116" height="36" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="2" />
            </svg>
            ${renderPitchHalfHTML("home", homeData, isHomeChelsea, options)}
            ${renderPitchHalfHTML("away", awayData, isAwayChelsea, options)}
          </div>
        </div>

        <div class="tl-card">
          <div class="tl-section-title">${isTh ? "ผู้จัดการทีม (Managers)" : "Managers"}</div>
          <div class="tl-split-grid">
            <div class="tl-split-col">
              <div class="tl-col-kit-bar home">
                <div class="tl-col-kit-team">
                  <img src="${escapeHtml(match.home_logo || "assets/images/placeholder-team.svg")}" alt="" onerror="this.src='assets/images/placeholder-team.svg'">
                  <span>${escapeHtml(homeTeamName)}</span>
                </div>
              </div>
              <div class="tl-col-body">
                <div class="tl-manager-name">${escapeHtml(homeData.manager || "-")}</div>
              </div>
            </div>
            <div class="tl-split-col">
              <div class="tl-col-kit-bar away">
                <div class="tl-col-kit-team">
                  <img src="${escapeHtml(match.away_logo || "assets/images/placeholder-team.svg")}" alt="" onerror="this.src='assets/images/placeholder-team.svg'">
                  <span>${escapeHtml(awayTeamName)}</span>
                </div>
              </div>
              <div class="tl-col-body">
                <div class="tl-manager-name">${escapeHtml(awayData.manager || "-")}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="tl-card">
          <div class="tl-section-title">${isTh ? "การเปลี่ยนตัว & ตัวสำรอง (Substitutions & Bench)" : "Substitutions & Bench"}</div>
          <div class="tl-split-grid">
            <div class="tl-split-col">
              <div class="tl-col-kit-bar home">
                <div class="tl-col-kit-team">
                  <img src="${escapeHtml(match.home_logo || "assets/images/placeholder-team.svg")}" alt="" onerror="this.src='assets/images/placeholder-team.svg'">
                  <span>${escapeHtml(homeTeamName)}</span>
                </div>
                <span>${escapeHtml(homeParsed.displayFormation || "")}</span>
              </div>
              <div class="tl-col-body">
                ${renderSubListHTML("home", homeData.substitutes, isHomeChelsea, options)}
              </div>
            </div>
            <div class="tl-split-col">
              <div class="tl-col-kit-bar away">
                <div class="tl-col-kit-team">
                  <img src="${escapeHtml(match.away_logo || "assets/images/placeholder-team.svg")}" alt="" onerror="this.src='assets/images/placeholder-team.svg'">
                  <span>${escapeHtml(awayTeamName)}</span>
                </div>
                <span>${escapeHtml(awayParsed.displayFormation || "")}</span>
              </div>
              <div class="tl-col-body">
                ${renderSubListHTML("away", awayData.substitutes, isAwayChelsea, options)}
              </div>
            </div>
          </div>
        </div>

        ${officialsHtml}
      </div>
    `;
  }

  global.TacticalLineup = {
    getTeamKitPalette,
    enrichSideWithEvents,
    parseFormationLines,
    renderTacticalLineupsHTML,
  };
})(window);

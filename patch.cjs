const fs = require('fs');
let html = fs.readFileSync('player-profile.html', 'utf8');
const startIdx = html.indexOf('<!-- ==================== HERO SECTION ==================== -->');
const endIdx = html.indexOf('<!-- ==================== FOOTER ==================== -->');
const newContent = `<!-- ==================== PLAYER HERO ==================== -->
  <section class="player-hero">
    <div class="player-hero-bg" id="playerHeroBg"></div>
    <div class="player-hero-content">
      <div class="player-image-wrapper">
        <img src="assets/images/placeholder-player.svg" alt="Player Image" id="playerImage" class="player-main-image">
      </div>
      <div class="player-header-info">
        <div class="player-hero-badge" id="playerTeamBadge">TEAM</div>
        <h1 id="playerName">Loading...</h1>
        <div class="player-meta">
          <span class="player-number" id="playerNumber">#--</span>
          <span class="player-position" id="playerPosition">--</span>
          <span class="player-nationality" id="playerNationality">--</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== MAIN CONTENT ==================== -->
  <main class="main-container player-profile-main">
    
    <div class="profile-grid">
      <!-- Left Column: Personal Details & Bio -->
      <div class="profile-left">
        <section class="profile-section">
          <h2>Personal Details</h2>
          <ul class="personal-details-list">
            <li><strong>Date of Birth:</strong> <span id="playerDob">--</span> <span id="playerAge"></span></li>
            <li><strong>Height:</strong> <span id="playerHeight">--</span></li>
            <li><strong>Preferred Foot:</strong> <span id="playerFoot">--</span></li>
            <li><strong>Joined:</strong> <span id="playerJoined">--</span></li>
            <li><strong>Signed From:</strong> <span id="playerSignedFrom">--</span></li>
            <li><strong>Market Value:</strong> <span id="playerMarketValue">--</span></li>
          </ul>
        </section>

        <section class="profile-section" id="bioSection">
          <h2>Biography</h2>
          <div class="player-bio" id="playerBio">
            <p>No biography available.</p>
          </div>
        </section>
      </div>

      <!-- Right Column: Season Stats -->
      <div class="profile-right">
        <section class="profile-section stats-section">
          <h2>Season Stats</h2>
          <div class="stats-grid">
            <div class="stat-box">
              <span class="stat-value" id="statApps">0</span>
              <span class="stat-label">Appearances</span>
            </div>
            <div class="stat-box">
              <span class="stat-value" id="statGoals">0</span>
              <span class="stat-label">Goals</span>
            </div>
            <div class="stat-box">
              <span class="stat-value" id="statAssists">0</span>
              <span class="stat-label">Assists</span>
            </div>
          </div>
        </section>
        
        <section class="profile-section social-section" id="socialSection" style="display: none;">
          <h2>Social Media</h2>
          <div class="social-links">
            <a href="#" target="_blank" id="socialInstagram" class="social-link instagram" style="display: none;">Instagram</a>
            <a href="#" target="_blank" id="socialTwitter" class="social-link twitter" style="display: none;">Twitter (X)</a>
          </div>
        </section>
      </div>
    </div>

  </main>
  `;
fs.writeFileSync('player-profile.html', html.substring(0, startIdx) + newContent + html.substring(endIdx));

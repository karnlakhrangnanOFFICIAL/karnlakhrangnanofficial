const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldContent = `<style>#newsCarousel::-webkit-scrollbar { display: none; }</style>
        <div style="padding: 1rem; background: var(--card-bg); border-radius: var(--radius-lg); border: 1px solid var(--border-color); font-size: 0.9rem; color: var(--text-muted); width: 100%;">
          Loading latest news...
        </div>`;

const newContent = `<style>
          #newsCarousel::-webkit-scrollbar { display: none; }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          .skeleton-bg {
            background: linear-gradient(90deg, var(--border-color) 25%, rgba(128,128,128,0.2) 50%, var(--border-color) 75%);
            background-size: 400% 100%;
            animation: shimmer 1.5s ease-in-out infinite;
          }
        </style>
        <!-- Skeleton Items -->
        <div style="flex: 0 0 280px; scroll-snap-align: start; height: 260px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--card-bg);">
          <div class="skeleton-bg" style="height: 150px; width: 100%;"></div>
          <div style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <div class="skeleton-bg" style="height: 16px; width: 90%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 70%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 40%; border-radius: 4px;"></div>
            </div>
            <div class="skeleton-bg" style="height: 12px; width: 30%; border-radius: 4px; margin-top: 12px;"></div>
          </div>
        </div>
        <div style="flex: 0 0 280px; scroll-snap-align: start; height: 260px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--card-bg);">
          <div class="skeleton-bg" style="height: 150px; width: 100%;"></div>
          <div style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <div class="skeleton-bg" style="height: 16px; width: 90%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 70%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 40%; border-radius: 4px;"></div>
            </div>
            <div class="skeleton-bg" style="height: 12px; width: 30%; border-radius: 4px; margin-top: 12px;"></div>
          </div>
        </div>
        <div style="flex: 0 0 280px; scroll-snap-align: start; height: 260px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); border-radius: var(--radius-lg); background: var(--card-bg);">
          <div class="skeleton-bg" style="height: 150px; width: 100%;"></div>
          <div style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between;">
            <div>
              <div class="skeleton-bg" style="height: 16px; width: 90%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 70%; margin-bottom: 8px; border-radius: 4px;"></div>
              <div class="skeleton-bg" style="height: 16px; width: 40%; border-radius: 4px;"></div>
            </div>
            <div class="skeleton-bg" style="height: 12px; width: 30%; border-radius: 4px; margin-top: 12px;"></div>
          </div>
        </div>`;

html = html.replace(oldContent, newContent);
fs.writeFileSync('index.html', html);

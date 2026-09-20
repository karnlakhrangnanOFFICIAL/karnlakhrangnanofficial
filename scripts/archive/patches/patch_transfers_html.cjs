const fs = require('fs');

let html = fs.readFileSync('transfers.html', 'utf8');

// Insert tab styling
const tabStyles = `
    /* TABS */
    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-color);
    }
    .tab-btn {
      background: transparent;
      color: var(--text-muted);
      border: none;
      padding: 1rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
      font-family: var(--font-heading);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tab-btn:hover {
      color: var(--text-color);
    }
    .tab-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }
    .tab-content {
      display: none;
      animation: fadeIn 0.3s ease;
    }
    .tab-content.active {
      display: block;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
`;

html = html.replace('</style>', tabStyles + '\n  </style>');

const tabsHTML = `
    <div class="tabs">
      <button class="tab-btn active" data-tab="men">MEN'S TEAM</button>
      <button class="tab-btn" data-tab="women">WOMEN'S TEAM</button>
    </div>
    
    <div id="tab-men" class="tab-content active">
      <div id="transferContainerMen">
        <div style="text-align: center; padding: 3rem;">
          <p>Loading transfer data...</p>
        </div>
      </div>
    </div>
    
    <div id="tab-women" class="tab-content">
      <div id="transferContainerWomen">
        <div style="text-align: center; padding: 3rem;">
          <p>Loading transfer data...</p>
        </div>
      </div>
    </div>
`;

html = html.replace(/<div id="transferContainer">[\s\S]*?<\/div>\s*<\/main>/, tabsHTML + '\n  </main>');

// Replace javascript loading logic
const scriptLogic = `
    async function loadTransfers() {
      const containerMen = document.getElementById('transferContainerMen');
      const containerWomen = document.getElementById('transferContainerWomen');
      try {
        const res = await fetch('data/transfers_26_27.json');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        
        function renderTable(cats, isWomen) {
          let html = '';
          let hasData = false;
          cats.forEach(cat => {
            const categoryData = data.categories[cat.key];
            if (!categoryData || !categoryData.players || categoryData.players.length === 0) return;
            hasData = true;
            let tableRows = '';
            categoryData.players.forEach(p => {
              let detailCol = '';
              if (cat.key.includes('in')) {
                detailCol = \`<td>From: <strong>\${p.from}</strong></td><td><span class="fee-badge">\${p.fee}</span></td>\`;
              } else if (cat.key.includes('out')) {
                detailCol = \`<td>To: <strong>\${p.to || 'Released'}</strong></td><td><span class="fee-badge">\${p.fee || ''}</span></td>\`;
              } else if (cat.key === 'loan_out') {
                detailCol = \`<td>To: <strong>\${p.to}</strong></td><td>Term: \${p.loan_term}</td>\`;
              }
              tableRows += \`
                <tr>
                  <td><span class="player-name">\${p.player}</span></td>
                  <td><span class="badge">\${p.position || '-'}</span></td>
                  \${detailCol}
                </tr>
              \`;
            });
            html += \`
              <div class="transfer-section">
                <div class="transfer-header \${cat.class}">
                  <h3>\${categoryData.label}</h3>
                  <span style="font-size: 0.9rem; font-weight: normal; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px;">\${categoryData.players.length} Players</span>
                </div>
                <div class="transfer-list">
                  <table>
                    <tbody>
                      \${tableRows}
                    </tbody>
                  </table>
                </div>
              </div>
            \`;
          });
          
          if (!hasData) {
            html = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No transfer data available for this category yet.</div>';
          }
          
          return html;
        }
        
        // Render Men
        const menCats = [
          { key: 'in', class: '' },
          { key: 'out_permanent', class: 'out' },
          { key: 'loan_out', class: 'loan' }
        ];
        containerMen.innerHTML = renderTable(menCats, false);
        
        // Render Women
        const womenCats = [
          { key: 'women_in', class: '' },
          { key: 'women_out', class: 'out' }
        ];
        containerWomen.innerHTML = renderTable(womenCats, true);
        
        // Footer sources
        const sourcesHtml = \`
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem; clear: both;">
            <strong>Sources:</strong> \${data.sources.join(', ')}<br>
            Last Updated: \${data.snapshot}
          </div>
        \`;
        
        containerMen.innerHTML += sourcesHtml;
        containerWomen.innerHTML += sourcesHtml;
        
      } catch (err) {
        console.error(err);
        containerMen.innerHTML = '<div style="text-align: center; color: red; padding: 2rem;">Error loading transfer data.</div>';
        containerWomen.innerHTML = '<div style="text-align: center; color: red; padding: 2rem;">Error loading transfer data.</div>';
      }
    }

    // Tabs logic
    function setupTabs() {
      const tabBtns = document.querySelectorAll('.tab-btn');
      const tabContents = document.querySelectorAll('.tab-content');
      
      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          // Remove active class from all
          tabBtns.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab
          btn.classList.add('active');
          const tabId = btn.getAttribute('data-tab');
          document.getElementById('tab-' + tabId).classList.add('active');
        });
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadTransfers();
      setupTabs();
    });
`;

html = html.replace(/async function loadTransfers\(\) \{[\s\S]*?document\.addEventListener\('DOMContentLoaded', loadTransfers\);/, scriptLogic);

fs.writeFileSync('transfers.html', html);

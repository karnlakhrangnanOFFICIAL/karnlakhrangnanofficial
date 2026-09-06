const fs = require('fs');
let code = fs.readFileSync('assets/js/main.js', 'utf8');

const newTooltipLogic = `
  const getTooltipText = (target) => {
    const isTh = (window.currentLang || 'th') === 'th';
    let text = null;
    if (isTh) {
      text = target.getAttribute('data-tooltip-th') || target.getAttribute('data-tooltip') || target.getAttribute('data-tooltip-en') || target.getAttribute('title') || target.getAttribute('data-original-title');
    } else {
      text = target.getAttribute('data-tooltip-en') || target.getAttribute('data-tooltip') || target.getAttribute('data-tooltip-th') || target.getAttribute('title') || target.getAttribute('data-original-title');
    }
    
    // Auto-generate tooltips for specific elements if no explicit tooltip is provided
    if (!text) {
        if (target.tagName === 'IMG') {
            text = target.getAttribute('alt');
            // Check if there is data-i18n in parent or something? No, alt is usually the name
        } else if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('tab-btn')) {
            // Avoid extracting large text blocks from card links
            if (!target.classList.contains('card-link') && target.children.length <= 1) {
                const content = target.textContent.trim();
                if (content && content.length < 50) text = content;
            }
        } else if (target.classList.contains('flag-icon')) {
             text = target.getAttribute('title');
        }
    }
    return text;
  };

  document.body.addEventListener('mouseover', (e) => {
    // We add .flag-icon to catch CSS flags
    const target = e.target.closest('[data-tooltip-th], [data-tooltip-en], [data-tooltip], [title], [data-original-title], a, button, img, .tab-btn, .lang-toggle, .flag-icon');
    if (target) {
      // Ignore some structural wrappers
      if (target.tagName === 'A' && (target.classList.contains('card-link') || target.classList.contains('nav-logo') || target.classList.contains('match-info-pill'))) {
         if (!target.hasAttribute('title') && !target.hasAttribute('data-tooltip-th') && !target.hasAttribute('data-tooltip-en') && !target.hasAttribute('data-original-title')) {
             return; 
         }
      }
      
      const text = getTooltipText(target);
      if (text) {
        // Prevent default title tooltip
        if (target.hasAttribute('title')) {
           target.setAttribute('data-original-title', target.getAttribute('title'));
           target.removeAttribute('title');
        }
        tooltip.innerHTML = text;
        tooltip.classList.add('show');
        
        // Initial positioning
        let x = e.pageX + 15;
        let y = e.pageY + 15;
        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
      }
    }
  });

  document.body.addEventListener('mousemove', (e) => {
    if (tooltip.classList.contains('show')) {
      let x = e.pageX + 15;
      let y = e.pageY + 15;
      const rect = tooltip.getBoundingClientRect();
      if (e.clientX + 15 + rect.width > window.innerWidth) {
        x = e.pageX - rect.width - 10;
      }
      if (e.clientY + 15 + rect.height > window.innerHeight) {
        y = e.pageY - rect.height - 10;
      }
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip-th], [data-tooltip-en], [data-tooltip], [data-original-title], a, button, img, .tab-btn, .lang-toggle, .flag-icon');
    if (target) {
      tooltip.classList.remove('show');
      // Restore title if we removed it
      if (target.hasAttribute('data-original-title')) {
        target.setAttribute('title', target.getAttribute('data-original-title'));
        target.removeAttribute('data-original-title');
      }
    }
  });
`;

code = code.replace(/const getTooltipText = \(target\) => \{[\s\S]*?document\.body\.addEventListener\('mouseout', \(e\) => \{[\s\S]*?\}\);/m, newTooltipLogic.trim());

fs.writeFileSync('assets/js/main.js', code);

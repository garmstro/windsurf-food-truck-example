// ============================================================
//  Matt's Potats — script.js
//  Handles: menu rendering from menu.json, hamburger menu,
//           active nav link on scroll, tab switching
// ============================================================

// --- Hamburger Menu Toggle ---
export function closeMobileMenu(hamburger, navLinks) {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// --- Active Nav Link on Scroll ---
export function updateActiveLink(sections, navItems, scrollY, navHeight) {
  let currentId = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 20;
    if (scrollY >= sectionTop) {
      currentId = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === `#${currentId}`);
  });
}

// --- Menu Tab Switching ---
export function activateTab(target, tabBtns, tabPanels) {
  tabBtns.forEach(b => b.classList.remove('active'));
  tabPanels.forEach(p => p.classList.remove('active'));

  const activeBtn = Array.from(tabBtns).find(b => b.dataset.tab === target);
  if (activeBtn) activeBtn.classList.add('active');

  const activePanel = document.getElementById(`tab-${target}`);
  if (activePanel) activePanel.classList.add('active');
}

// --- Menu Data Validation ---
export function validateMenu(data) {
  if (!data || typeof data !== 'object') return false;

  const sections = ['signatures', 'bases', 'proteins', 'cheeses', 'sauces', 'extras', 'drinks'];
  for (const key of sections) {
    const section = data[key];
    if (!section || typeof section !== 'object') return false;
    if (typeof section.intro !== 'string') return false;
    if (!Array.isArray(section.items)) return false;
  }

  if (!data.signatures.items.every(item =>
    typeof item.name === 'string' && typeof item.price === 'string' &&
    typeof item.base === 'string' && typeof item.toppings === 'string'
  )) return false;

  if (!data.bases.items.every(item =>
    typeof item.name === 'string' && typeof item.price === 'string' && typeof item.desc === 'string'
  )) return false;

  if (!data.proteins.items.every(item =>
    typeof item.name === 'string' && typeof item.price === 'string' && typeof item.desc === 'string'
  )) return false;

  if (!data.cheeses.items.every(item =>
    typeof item.name === 'string' && typeof item.desc === 'string'
  )) return false;

  if (!data.sauces.items.every(item =>
    typeof item.name === 'string' && typeof item.desc === 'string'
  )) return false;

  if (!data.extras.items.every(item => typeof item === 'string')) return false;

  if (!data.drinks.items.every(item =>
    typeof item.name === 'string' && typeof item.price === 'string'
  )) return false;

  const ps = data.pricingSummary;
  if (!ps || typeof ps !== 'object') return false;
  if (typeof ps.heading !== 'string') return false;
  if (!Array.isArray(ps.rows)) return false;
  if (typeof ps.note !== 'string') return false;

  return true;
}

// --- Trusted Menu Source Whitelist ---
export function isTrustedMenuSrc(src) {
  if (typeof src !== 'string' || src.trim() === '') return false;
  if (/^[a-z][a-z\d+\-.]*:/i.test(src)) return false;
  if (src.startsWith('//')) return false;
  if (src.startsWith('/')) return false;
  if (src.includes('..')) return false;
  if (!/^[\w\-./]+$/.test(src)) return false;
  if (!src.endsWith('.json')) return false;
  return true;
}

// --- Menu Error Display ---
function showMenuError() {
  const tabbar = document.getElementById('menu-tabbar');
  const panels = document.querySelector('.menu-panels');
  const errorPanel = document.getElementById('menu-error');
  if (tabbar) tabbar.hidden = true;
  if (panels) panels.hidden = true;
  if (errorPanel) errorPanel.hidden = false;
}

// --- Menu Rendering ---
const heatLabels = {
  'mild':     '🌶 Mild',
  'medium':   '🌶🌶 Medium',
  'mild-med': '🌶 Mild-Med',
};

export function renderMenu(menu) {
  renderSignatures(menu.signatures);
  renderBases(menu.bases);
  renderProteins(menu.proteins);
  renderCheeses(menu.cheeses);
  renderSauces(menu.sauces);
  renderExtras(menu.extras);
  renderDrinks(menu.drinks);
  renderPricingSummary(menu.pricingSummary);
}

function renderSignatures({ intro, items }) {
  const panel = document.getElementById('tab-signatures');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid--signatures');
  grid.innerHTML = items.map(item => `
    <article class="menu-card menu-card--signature">
      <div class="menu-card__top">
        <span class="menu-card__sig-badge">Signature</span>
        <span class="menu-card__price">${item.price}</span>
      </div>
      <h3 class="menu-card__name">${item.name}</h3>
      <p class="menu-card__base"><span class="base-label">Base:</span> ${item.base}</p>
      <p class="menu-card__toppings">${item.toppings}</p>
    </article>
  `).join('');
}

function renderBases({ intro, items }) {
  const panel = document.getElementById('tab-bases');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.innerHTML = items.map(item => `
    <article class="menu-card">
      <div class="menu-card__top">
        <h3 class="menu-card__name">${item.name}</h3>
        <span class="menu-card__price">${item.price}</span>
      </div>
      <p class="menu-card__desc">${item.desc}</p>
    </article>
  `).join('');
}

function renderProteins({ intro, items }) {
  const panel = document.getElementById('tab-proteins');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.innerHTML = items.map(item => `
    <article class="menu-card">
      <div class="menu-card__top">
        <h3 class="menu-card__name">${item.name}${item.vegetarian ? ' <span class="veg-badge">V</span>' : ''}</h3>
        <span class="menu-card__price">${item.price}</span>
      </div>
      <p class="menu-card__desc">${item.desc}</p>
    </article>
  `).join('');
}

function renderCheeses({ intro, items }) {
  const panel = document.getElementById('tab-cheeses');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.innerHTML = items.map(item => `
    <article class="menu-card${item.muted ? ' menu-card--muted' : ''}">
      <h3 class="menu-card__name">${item.name}</h3>
      <p class="menu-card__desc">${item.desc}</p>
    </article>
  `).join('');
}

function renderSauces({ intro, items }) {
  const panel = document.getElementById('tab-sauces');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.innerHTML = items.map(item => {
    const heatBadge = item.heat
      ? `<span class="heat-badge heat-${item.heat.replace('-med', '')}">${heatLabels[item.heat]}</span>`
      : '';
    const top = heatBadge
      ? `<div class="menu-card__top"><h3 class="menu-card__name">${item.name}</h3>${heatBadge}</div>`
      : `<h3 class="menu-card__name">${item.name}</h3>`;
    return `
    <article class="menu-card">
      ${top}
      <p class="menu-card__desc">${item.desc}</p>
    </article>
    `;
  }).join('');
}

function renderExtras({ intro, items }) {
  const panel = document.getElementById('tab-extras');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.extras-grid');
  grid.innerHTML = items.map(name => `<span class="extra-tag">${name}</span>`).join('');
}

function renderDrinks({ intro, items }) {
  const panel = document.getElementById('tab-drinks');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.innerHTML = items.map(item => `
    <article class="menu-card">
      <div class="menu-card__top">
        <h3 class="menu-card__name">${item.name}</h3>
        <span class="menu-card__price">${item.price}</span>
      </div>
      ${item.desc ? `<p class="menu-card__desc">${item.desc}</p>` : ''}
    </article>
  `).join('');
}

function renderPricingSummary({ heading, rows, note }) {
  const callout = document.querySelector('.pricing-callout');
  if (!callout) return;
  callout.querySelector('.pricing-callout__heading').textContent = heading;
  const grid = callout.querySelector('.pricing-callout__grid');
  grid.innerHTML = rows.map(row => `
    <div class="pricing-row${row.highlight ? ' pricing-row--highlight' : ''}">
      <span class="pricing-row__label">${row.label}</span>
      <span class="pricing-row__price">${row.price}</span>
    </div>
  `).join('');
  callout.querySelector('.pricing-callout__note').textContent = note;
}

// --- Initialization (DOM querying and event wiring) ---
async function init() {
  const nav      = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!nav || !hamburger || !navLinks) return;

  const navItems  = Array.from(navLinks.querySelectorAll('a'));
  const sections  = Array.from(document.querySelectorAll('section[id]'));

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile nav when a link is tapped
  navItems.forEach(link => {
    link.addEventListener('click', () => closeMobileMenu(hamburger, navLinks));
  });

  // Close mobile nav when clicking outside the panel
  document.addEventListener('click', (e) => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      closeMobileMenu(hamburger, navLinks);
    }
  });

  window.addEventListener('scroll', () => {
    updateActiveLink(sections, navItems, window.scrollY, nav.offsetHeight);
  }, { passive: true });
  updateActiveLink(sections, navItems, window.scrollY, nav.offsetHeight);

  // Fetch menu data and render
  const rawSrc = document.documentElement.dataset.menuSrc;
  const menuSrc = (rawSrc !== undefined && isTrustedMenuSrc(rawSrc)) ? rawSrc : 'menu.json';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(menuSrc, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!validateMenu(data)) throw new Error('Menu data failed schema validation');
    renderMenu(data);
  } catch (err) {
    clearTimeout(timeoutId);
    showMenuError();
    return;
  }

  const tabBtns   = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab, tabBtns, tabPanels);
    });
  });
}

if (typeof process === 'undefined' || !process.env.VITEST) {
  init();
}

// ============================================================
//  Matt's Potats — script.js
//  Handles: menu rendering from menu.json, hamburger menu,
//           active nav link on scroll, tab switching
// ============================================================

import { fetchMenu, validateMenu, isTrustedMenuSrc } from './menuService.js';

// Re-export validation helpers so existing imports from script.js keep working
export { validateMenu, isTrustedMenuSrc };

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
  tabBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  tabPanels.forEach(p => p.classList.remove('active'));

  const activeBtn = Array.from(tabBtns).find(b => b.dataset.tab === target);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  }

  const activePanel = document.getElementById(`tab-${target}`);
  if (activePanel) activePanel.classList.add('active');
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
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = 'menu-card menu-card--signature';

    const top = document.createElement('div');
    top.className = 'menu-card__top';
    const badge = document.createElement('span');
    badge.className = 'menu-card__sig-badge';
    badge.textContent = 'Signature';
    const price = document.createElement('span');
    price.className = 'menu-card__price';
    price.textContent = item.price;
    top.append(badge, price);

    const name = document.createElement('h3');
    name.className = 'menu-card__name';
    name.textContent = item.name;

    const base = document.createElement('p');
    base.className = 'menu-card__base';
    const baseLabel = document.createElement('span');
    baseLabel.className = 'base-label';
    baseLabel.textContent = 'Base:';
    base.append(baseLabel, ` ${item.base}`);

    const toppings = document.createElement('p');
    toppings.className = 'menu-card__toppings';
    toppings.textContent = item.toppings;

    article.append(top, name, base, toppings);
    return article;
  }));
}

function renderBases({ intro, items }) {
  const panel = document.getElementById('tab-bases');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = 'menu-card';

    const top = document.createElement('div');
    top.className = 'menu-card__top';
    const name = document.createElement('h3');
    name.className = 'menu-card__name';
    name.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'menu-card__price';
    price.textContent = item.price;
    top.append(name, price);

    const desc = document.createElement('p');
    desc.className = 'menu-card__desc';
    desc.textContent = item.desc;

    article.append(top, desc);
    return article;
  }));
}

function renderProteins({ intro, items }) {
  const panel = document.getElementById('tab-proteins');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = 'menu-card';

    const top = document.createElement('div');
    top.className = 'menu-card__top';
    const name = document.createElement('h3');
    name.className = 'menu-card__name';
    name.textContent = item.name;
    if (item.vegetarian) {
      const vegBadge = document.createElement('span');
      vegBadge.className = 'veg-badge';
      vegBadge.textContent = 'V';
      name.append(' ', vegBadge);
    }
    const price = document.createElement('span');
    price.className = 'menu-card__price';
    price.textContent = item.price;
    top.append(name, price);

    const desc = document.createElement('p');
    desc.className = 'menu-card__desc';
    desc.textContent = item.desc;

    article.append(top, desc);
    return article;
  }));
}

function renderCheeses({ intro, items }) {
  const panel = document.getElementById('tab-cheeses');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = item.muted ? 'menu-card menu-card--muted' : 'menu-card';

    const name = document.createElement('h3');
    name.className = 'menu-card__name';
    name.textContent = item.name;

    const desc = document.createElement('p');
    desc.className = 'menu-card__desc';
    desc.textContent = item.desc;

    article.append(name, desc);
    return article;
  }));
}

function renderSauces({ intro, items }) {
  const panel = document.getElementById('tab-sauces');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = 'menu-card';

    if (item.heat) {
      const top = document.createElement('div');
      top.className = 'menu-card__top';
      const name = document.createElement('h3');
      name.className = 'menu-card__name';
      name.textContent = item.name;
      const heatBadge = document.createElement('span');
      heatBadge.className = `heat-badge heat-${item.heat.replace('-med', '')}`;
      heatBadge.textContent = heatLabels[item.heat];
      top.append(name, heatBadge);
      article.append(top);
    } else {
      const name = document.createElement('h3');
      name.className = 'menu-card__name';
      name.textContent = item.name;
      article.append(name);
    }

    const desc = document.createElement('p');
    desc.className = 'menu-card__desc';
    desc.textContent = item.desc;
    article.append(desc);

    return article;
  }));
}

function renderExtras({ intro, items }) {
  const panel = document.getElementById('tab-extras');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.extras-grid');
  grid.replaceChildren(...items.map(name => {
    const span = document.createElement('span');
    span.className = 'extra-tag';
    span.textContent = name;
    return span;
  }));
}

function renderDrinks({ intro, items }) {
  const panel = document.getElementById('tab-drinks');
  if (!panel) return;
  panel.querySelector('.panel-intro').textContent = intro;
  const grid = panel.querySelector('.menu-grid');
  grid.replaceChildren(...items.map(item => {
    const article = document.createElement('article');
    article.className = 'menu-card';

    const top = document.createElement('div');
    top.className = 'menu-card__top';
    const name = document.createElement('h3');
    name.className = 'menu-card__name';
    name.textContent = item.name;
    const price = document.createElement('span');
    price.className = 'menu-card__price';
    price.textContent = item.price;
    top.append(name, price);
    article.append(top);

    if (item.desc) {
      const desc = document.createElement('p');
      desc.className = 'menu-card__desc';
      desc.textContent = item.desc;
      article.append(desc);
    }

    return article;
  }));
}

function renderPricingSummary({ heading, rows, note }) {
  const callout = document.querySelector('.pricing-callout');
  if (!callout) return;
  callout.querySelector('.pricing-callout__heading').textContent = heading;
  const grid = callout.querySelector('.pricing-callout__grid');
  grid.replaceChildren(...rows.map(row => {
    const div = document.createElement('div');
    div.className = row.highlight ? 'pricing-row pricing-row--highlight' : 'pricing-row';

    const label = document.createElement('span');
    label.className = 'pricing-row__label';
    label.textContent = row.label;

    const price = document.createElement('span');
    price.className = 'pricing-row__price';
    price.textContent = row.price;

    div.append(label, price);
    return div;
  }));
  callout.querySelector('.pricing-callout__note').textContent = note;
}

// --- Initialization (DOM querying and event wiring) ---
async function init() {
  const nav       = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!nav || !hamburger || !navLinks) return;

  const navItems = Array.from(navLinks.querySelectorAll('a'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

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

  // ESC closes mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMobileMenu(hamburger, navLinks);
      hamburger.focus();
    }
  });

  // Focus trap for mobile menu
  navLinks.addEventListener('keydown', (e) => {
    if (!navLinks.classList.contains('open') || e.key !== 'Tab') return;
    const focusable = Array.from(navLinks.querySelectorAll('a, button'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('scroll', () => {
    updateActiveLink(sections, navItems, window.scrollY, nav.offsetHeight);
  }, { passive: true });
  updateActiveLink(sections, navItems, window.scrollY, nav.offsetHeight);

  // Fetch menu data and render
  const rawSrc  = document.documentElement.dataset.menuSrc;
  const menuSrc = (rawSrc !== undefined && isTrustedMenuSrc(rawSrc)) ? rawSrc : 'menu.json';

  try {
    const data = await fetchMenu(menuSrc);
    renderMenu(data);
  } catch (err) {
    console.error("[Matt's Potats] Menu load failed:", err.message);
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

  // Keyboard navigation for tab bar (ArrowLeft/Right, Home, End)
  const tabBar = document.querySelector('.menu-tabbar__inner');
  if (tabBar) {
    tabBar.addEventListener('keydown', (e) => {
      const currentIndex = tabBtns.findIndex(b => b === document.activeElement);
      if (currentIndex < 0) return;
      let nextIndex = -1;
      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % tabBtns.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + tabBtns.length) % tabBtns.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabBtns.length - 1;
      }
      if (nextIndex >= 0) {
        e.preventDefault();
        tabBtns[nextIndex].focus();
        activateTab(tabBtns[nextIndex].dataset.tab, tabBtns, tabPanels);
      }
    });
  }

  // Global error logging
  window.addEventListener('error', (event) => {
    console.error("[Matt's Potats] Unexpected error:", event.message);
  });
}

if (typeof process === 'undefined' || !process.env.VITEST) {
  init();
}

// ============================================================
//  Matt's Potats — script.js
//  Handles: hamburger menu, active nav link on scroll
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

// --- Initialization (DOM querying and event wiring) ---
function init() {
  const nav      = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!nav || !hamburger || !navLinks) return;

  const navItems  = Array.from(navLinks.querySelectorAll('a'));
  const sections  = Array.from(document.querySelectorAll('section[id]'));
  const tabBtns   = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

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

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activateTab(btn.dataset.tab, tabBtns, tabPanels);
    });
  });
}

init();

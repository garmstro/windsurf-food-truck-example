// ============================================================
//  Matt's Potats — script.js
//  Handles: hamburger menu, active nav link on scroll
// ============================================================

const nav        = document.getElementById('main-nav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navItems   = navLinks.querySelectorAll('a');
const sections   = document.querySelectorAll('section[id]');

// --- Hamburger Menu Toggle ---
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile nav when a link is tapped
navItems.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close mobile nav when clicking outside the panel
document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileMenu();
  }
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// --- Active Nav Link on Scroll ---
function updateActiveLink() {
  const scrollY    = window.scrollY;
  const navHeight  = nav.offsetHeight;
  let currentId    = '';

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

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// --- Menu Tab Switching ---
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

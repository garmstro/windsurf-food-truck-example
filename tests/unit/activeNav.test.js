import { describe, it, expect, beforeEach } from 'vitest';
import { updateActiveLink } from '../../script.js';

function makeElements() {
  document.body.innerHTML = `
    <ul id="nav-links">
      <li><a href="#hero">Home</a></li>
      <li><a href="#menu">Menu</a></li>
      <li><a href="#story">Story</a></li>
    </ul>
    <section id="hero"></section>
    <section id="menu"></section>
    <section id="story"></section>
  `;

  const sections = Array.from(document.querySelectorAll('section[id]'));
  Object.defineProperty(sections[0], 'offsetTop', { value: 0,    configurable: true });
  Object.defineProperty(sections[1], 'offsetTop', { value: 500,  configurable: true });
  Object.defineProperty(sections[2], 'offsetTop', { value: 1000, configurable: true });

  return {
    sections,
    navItems: Array.from(document.querySelectorAll('#nav-links a')),
  };
}

describe('updateActiveLink', () => {
  it('activates the hero link at scrollY 0', () => {
    const { sections, navItems } = makeElements();
    updateActiveLink(sections, navItems, 0, 0);
    expect(navItems[0].classList.contains('active')).toBe(true);
    expect(navItems[1].classList.contains('active')).toBe(false);
    expect(navItems[2].classList.contains('active')).toBe(false);
  });

  it('activates the menu link when scrolled past the menu section', () => {
    const { sections, navItems } = makeElements();
    // sectionTop for menu = 500 - 0 - 20 = 480; scrollY 520 clears it
    updateActiveLink(sections, navItems, 520, 0);
    expect(navItems[0].classList.contains('active')).toBe(false);
    expect(navItems[1].classList.contains('active')).toBe(true);
    expect(navItems[2].classList.contains('active')).toBe(false);
  });

  it('activates the story link when scrolled past the story section', () => {
    const { sections, navItems } = makeElements();
    // sectionTop for story = 1000 - 0 - 20 = 980; scrollY 1020 clears it
    updateActiveLink(sections, navItems, 1020, 0);
    expect(navItems[2].classList.contains('active')).toBe(true);
  });

  it('accounts for nav height in the threshold calculation', () => {
    const { sections, navItems } = makeElements();
    // navHeight=60: sectionTop for menu = 500 - 60 - 20 = 420
    // scrollY=450 should activate menu
    updateActiveLink(sections, navItems, 450, 60);
    expect(navItems[1].classList.contains('active')).toBe(true);
  });

  it('does not activate menu when scrollY is just below the threshold', () => {
    const { sections, navItems } = makeElements();
    // sectionTop for menu = 500 - 0 - 20 = 480; scrollY 479 should NOT activate menu
    updateActiveLink(sections, navItems, 479, 0);
    expect(navItems[1].classList.contains('active')).toBe(false);
  });

  it('only one nav link is active at a time', () => {
    const { sections, navItems } = makeElements();
    updateActiveLink(sections, navItems, 520, 0);
    const activeLinks = navItems.filter(l => l.classList.contains('active'));
    expect(activeLinks).toHaveLength(1);
  });

  it('removes previously active class when scrolling back up', () => {
    const { sections, navItems } = makeElements();
    updateActiveLink(sections, navItems, 520, 0);
    expect(navItems[1].classList.contains('active')).toBe(true);
    updateActiveLink(sections, navItems, 0, 0);
    expect(navItems[1].classList.contains('active')).toBe(false);
    expect(navItems[0].classList.contains('active')).toBe(true);
  });
});

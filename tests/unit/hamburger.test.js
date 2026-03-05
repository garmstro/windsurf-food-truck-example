import { describe, it, expect, beforeEach } from 'vitest';
import { closeMobileMenu } from '../../script.js';

function makeElements() {
  document.body.innerHTML = `
    <button id="hamburger" aria-expanded="true" class="open"></button>
    <ul id="nav-links" class="open"></ul>
  `;
  return {
    hamburger: document.getElementById('hamburger'),
    navLinks:  document.getElementById('nav-links'),
  };
}

describe('closeMobileMenu', () => {
  beforeEach(() => {
    document.body.style.overflow = 'hidden';
  });

  it('removes the open class from hamburger', () => {
    const { hamburger, navLinks } = makeElements();
    closeMobileMenu(hamburger, navLinks);
    expect(hamburger.classList.contains('open')).toBe(false);
  });

  it('removes the open class from navLinks', () => {
    const { hamburger, navLinks } = makeElements();
    closeMobileMenu(hamburger, navLinks);
    expect(navLinks.classList.contains('open')).toBe(false);
  });

  it('sets aria-expanded to "false"', () => {
    const { hamburger, navLinks } = makeElements();
    closeMobileMenu(hamburger, navLinks);
    expect(hamburger.getAttribute('aria-expanded')).toBe('false');
  });

  it('restores body scroll', () => {
    const { hamburger, navLinks } = makeElements();
    closeMobileMenu(hamburger, navLinks);
    expect(document.body.style.overflow).toBe('');
  });

  it('is idempotent — calling twice leaves state correct', () => {
    const { hamburger, navLinks } = makeElements();
    closeMobileMenu(hamburger, navLinks);
    closeMobileMenu(hamburger, navLinks);
    expect(hamburger.classList.contains('open')).toBe(false);
    expect(hamburger.getAttribute('aria-expanded')).toBe('false');
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { renderMenu } from '../../src/script.js';

// Build the full DOM structure that renderMenu depends on
function setupDOM() {
  document.body.innerHTML = `
    <div id="tab-signatures" class="tab-panel active">
      <p class="panel-intro"></p>
      <div class="menu-grid menu-grid--signatures"></div>
    </div>
    <div id="tab-bases" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="menu-grid"></div>
    </div>
    <div id="tab-proteins" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="menu-grid"></div>
    </div>
    <div id="tab-cheeses" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="menu-grid"></div>
    </div>
    <div id="tab-sauces" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="menu-grid"></div>
    </div>
    <div id="tab-extras" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="extras-grid"></div>
    </div>
    <div id="tab-drinks" class="tab-panel">
      <p class="panel-intro"></p>
      <div class="menu-grid"></div>
    </div>
    <div class="pricing-callout">
      <h3 class="pricing-callout__heading"></h3>
      <div class="pricing-callout__grid"></div>
      <p class="pricing-callout__note"></p>
    </div>
  `;
}

// Menu fixture with XSS payloads embedded in every string field
const xssPayload = '<script>alert("xss")<\/script>';
const imgPayload = '<img src=x onerror=alert(1)>';

const xssMenu = {
  signatures: {
    intro: `Intro ${xssPayload}`,
    items: [{ name: `Sig ${xssPayload}`, price: `$${imgPayload}`, base: `Base ${xssPayload}`, toppings: `Toppings ${imgPayload}` }],
  },
  bases: {
    intro: 'Bases intro',
    items: [{ name: `Base ${xssPayload}`, price: '$6', desc: `Desc ${imgPayload}` }],
  },
  proteins: {
    intro: 'Proteins intro',
    items: [{ name: `Protein ${xssPayload}`, price: '+$3', desc: `Desc ${imgPayload}`, vegetarian: false }],
  },
  cheeses: {
    intro: 'Cheeses intro',
    items: [{ name: `Cheese ${xssPayload}`, desc: `Desc ${imgPayload}`, muted: false }],
  },
  sauces: {
    intro: 'Sauces intro',
    items: [{ name: `Sauce ${xssPayload}`, desc: `Desc ${imgPayload}`, heat: null }],
  },
  extras: {
    intro: 'Extras intro',
    items: [`Extra ${xssPayload}`],
  },
  drinks: {
    intro: 'Drinks intro',
    items: [{ name: `Drink ${xssPayload}`, price: '$2', desc: null }],
  },
  pricingSummary: {
    heading: `Heading ${xssPayload}`,
    rows: [{ label: `Label ${imgPayload}`, price: `$${xssPayload}`, highlight: false }],
    note: `Note ${xssPayload}`,
  },
};

describe('renderMenu — XSS regression', () => {
  beforeEach(setupDOM);

  it('renders signature name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-signatures .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders signature toppings as text, not HTML — no actual img element injected', () => {
    renderMenu(xssMenu);
    const toppings = document.querySelector('.menu-card__toppings');
    expect(toppings.textContent).toContain('onerror');
    // Must be escaped text, not a real element
    expect(toppings.querySelectorAll('img[onerror]')).toHaveLength(0);
  });

  it('renders base name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-bases .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders protein name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-proteins .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders cheese name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-cheeses .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders sauce name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-sauces .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders extra tag as text, not HTML', () => {
    renderMenu(xssMenu);
    const tag = document.querySelector('.extra-tag');
    expect(tag.textContent).toContain('<script>');
    expect(tag.innerHTML).not.toContain('<script>');
  });

  it('renders drink name as text, not HTML', () => {
    renderMenu(xssMenu);
    const name = document.querySelector('#tab-drinks .menu-card__name');
    expect(name.textContent).toContain('<script>');
    expect(name.innerHTML).not.toContain('<script>');
  });

  it('renders pricing label as text, not HTML — no actual img element injected', () => {
    renderMenu(xssMenu);
    const label = document.querySelector('.pricing-row__label');
    expect(label.textContent).toContain('onerror');
    expect(label.querySelectorAll('img[onerror]')).toHaveLength(0);
  });

  it('no unescaped <script> tags anywhere in rendered output', () => {
    renderMenu(xssMenu);
    expect(document.body.innerHTML).not.toContain('<script>alert');
  });

  it('no actual img[onerror] elements injected anywhere in rendered output', () => {
    renderMenu(xssMenu);
    expect(document.querySelectorAll('img[onerror]')).toHaveLength(0);
  });
});

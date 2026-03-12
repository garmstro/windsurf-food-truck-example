import { describe, it, expect } from 'vitest';
import { validateMenu } from '../../script.js';

// Minimal valid menu fixture used as the baseline
function validMenu() {
  return {
    signatures: {
      intro: 'Sigs intro',
      items: [{ name: 'Classic', price: '$12', base: 'Fries', toppings: 'Everything' }],
    },
    bases: {
      intro: 'Bases intro',
      items: [{ name: 'Curly Fries', price: '$6', desc: 'Crispy' }],
    },
    proteins: {
      intro: 'Proteins intro',
      items: [{ name: 'Chicken', price: '+$3', desc: 'Grilled' }],
    },
    cheeses: {
      intro: 'Cheeses intro',
      items: [{ name: 'Cheddar', desc: 'Sharp' }],
    },
    sauces: {
      intro: 'Sauces intro',
      items: [{ name: 'Ranch', desc: 'Creamy' }],
    },
    extras: {
      intro: 'Extras intro',
      items: ['Sour Cream'],
    },
    drinks: {
      intro: 'Drinks intro',
      items: [{ name: 'Water', price: '$1' }],
    },
    pricingSummary: {
      heading: 'How It Works',
      rows: [{ label: 'Base', price: '$6', highlight: false }],
      note: 'Prices subject to change.',
    },
  };
}

describe('validateMenu', () => {
  it('accepts a valid menu object', () => {
    expect(validateMenu(validMenu())).toBe(true);
  });

  it('rejects null', () => {
    expect(validateMenu(null)).toBe(false);
  });

  it('rejects a string', () => {
    expect(validateMenu('menu')).toBe(false);
  });

  it('rejects an empty object', () => {
    expect(validateMenu({})).toBe(false);
  });

  it('rejects when a required section is missing', () => {
    const menu = validMenu();
    delete menu.bases;
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects when a section intro is not a string', () => {
    const menu = validMenu();
    menu.bases.intro = 42;
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects when a section items is not an array', () => {
    const menu = validMenu();
    menu.bases.items = {};
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a signature item missing name', () => {
    const menu = validMenu();
    menu.signatures.items[0] = { price: '$12', base: 'Fries', toppings: 'X' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a signature item missing price', () => {
    const menu = validMenu();
    menu.signatures.items[0] = { name: 'X', base: 'Fries', toppings: 'X' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a signature item missing base', () => {
    const menu = validMenu();
    menu.signatures.items[0] = { name: 'X', price: '$12', toppings: 'X' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a base item missing desc', () => {
    const menu = validMenu();
    menu.bases.items[0] = { name: 'Fries', price: '$6' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a protein item with non-string name', () => {
    const menu = validMenu();
    menu.proteins.items[0].name = 99;
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a cheese item missing desc', () => {
    const menu = validMenu();
    menu.cheeses.items[0] = { name: 'Cheddar' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a sauce item missing desc', () => {
    const menu = validMenu();
    menu.sauces.items[0] = { name: 'Ranch' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects extras items that are not strings', () => {
    const menu = validMenu();
    menu.extras.items = [{ name: 'Sour Cream' }];
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects a drink item missing price', () => {
    const menu = validMenu();
    menu.drinks.items[0] = { name: 'Water' };
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects missing pricingSummary', () => {
    const menu = validMenu();
    delete menu.pricingSummary;
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects pricingSummary missing heading', () => {
    const menu = validMenu();
    delete menu.pricingSummary.heading;
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects pricingSummary with non-array rows', () => {
    const menu = validMenu();
    menu.pricingSummary.rows = 'not an array';
    expect(validateMenu(menu)).toBe(false);
  });

  it('rejects pricingSummary missing note', () => {
    const menu = validMenu();
    delete menu.pricingSummary.note;
    expect(validateMenu(menu)).toBe(false);
  });

  it('accepts signatures with empty items array', () => {
    const menu = validMenu();
    menu.signatures.items = [];
    expect(validateMenu(menu)).toBe(true);
  });
});

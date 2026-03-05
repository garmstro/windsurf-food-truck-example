import { describe, it, expect, beforeEach } from 'vitest';
import { activateTab } from '../../script.js';

function makeElements() {
  document.body.innerHTML = `
    <button class="tab-btn active" data-tab="signatures">Signatures</button>
    <button class="tab-btn" data-tab="bases">Bases</button>
    <button class="tab-btn" data-tab="proteins">Proteins</button>
    <div class="tab-panel active" id="tab-signatures"></div>
    <div class="tab-panel" id="tab-bases"></div>
    <div class="tab-panel" id="tab-proteins"></div>
  `;
  return {
    tabBtns:   Array.from(document.querySelectorAll('.tab-btn')),
    tabPanels: Array.from(document.querySelectorAll('.tab-panel')),
  };
}

describe('activateTab', () => {
  it('adds active class to the target button', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('bases', tabBtns, tabPanels);
    const basesBtn = tabBtns.find(b => b.dataset.tab === 'bases');
    expect(basesBtn.classList.contains('active')).toBe(true);
  });

  it('removes active class from all other buttons', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('bases', tabBtns, tabPanels);
    const others = tabBtns.filter(b => b.dataset.tab !== 'bases');
    others.forEach(b => expect(b.classList.contains('active')).toBe(false));
  });

  it('adds active class to the target panel', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('bases', tabBtns, tabPanels);
    expect(document.getElementById('tab-bases').classList.contains('active')).toBe(true);
  });

  it('removes active class from all other panels', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('bases', tabBtns, tabPanels);
    expect(document.getElementById('tab-signatures').classList.contains('active')).toBe(false);
    expect(document.getElementById('tab-proteins').classList.contains('active')).toBe(false);
  });

  it('only one panel is active at a time', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('proteins', tabBtns, tabPanels);
    const activePanels = tabPanels.filter(p => p.classList.contains('active'));
    expect(activePanels).toHaveLength(1);
  });

  it('only one button is active at a time', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('proteins', tabBtns, tabPanels);
    const activeBtns = tabBtns.filter(b => b.classList.contains('active'));
    expect(activeBtns).toHaveLength(1);
  });

  it('switching tabs twice lands on the last selected tab', () => {
    const { tabBtns, tabPanels } = makeElements();
    activateTab('bases', tabBtns, tabPanels);
    activateTab('proteins', tabBtns, tabPanels);
    expect(document.getElementById('tab-proteins').classList.contains('active')).toBe(true);
    expect(document.getElementById('tab-bases').classList.contains('active')).toBe(false);
  });
});

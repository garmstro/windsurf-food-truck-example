// ============================================================
//  menuService.js
//  Handles: menu schema validation, trusted-source whitelist,
//           and async menu fetching.
// ============================================================

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

// --- Menu Fetcher ---
export async function fetchMenu(src) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(src, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!validateMenu(data)) throw new Error('Menu data failed schema validation');
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

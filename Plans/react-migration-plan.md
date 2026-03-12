# React Migration Plan — Matt's Potats

**Status:** Planning  
**Date:** March 2026  
**Current Stack:** Vanilla HTML + CSS + JS, Vite, Vitest (unit), Playwright (e2e)  
**Target Stack:** React 19 + Vite, existing CSS (ported to modules or kept global), Vitest + React Testing Library (unit), Playwright (e2e)

---

## Important Considerations Before Starting

### Is React the right call?

The current site is a single-page static site with ~430 lines of JS, ~300 lines of HTML, and ~25KB of CSS. It works well as vanilla JS. React adds:

- **~140KB** of additional JavaScript (react + react-dom, gzipped ~45KB)
- Build complexity (JSX compilation, React-specific Vite plugin)
- A learning curve for future maintainers

**Recommendation:** If the client plans to add features (online ordering, user accounts, a CMS dashboard), React is a reasonable foundation. If the site will stay as-is, the migration adds cost with little benefit. **Confirm with Matt before proceeding.**

---

## What We're Working With

### Source Files to Migrate
| File | Lines | Migration Target |
|------|-------|-----------------|
| `src/index.html` | 304 | `index.html` (shell) + React components |
| `src/script.js` | 430 | Split into React components + hooks |
| `src/menuService.js` | 84 | Keep as-is (framework-agnostic data layer) |
| `src/style.css` | ~750 | Keep global or split into CSS modules per component |
| `src/menu.json` | ~170 | No change (static data) |
| `src/logo.svg` | — | No change |

### Test Files to Rewrite
| Type | Files | New Approach |
|------|-------|-------------|
| Unit (6 files) | activeNav, hamburger, menuRendering, menuSrc, menuValidation, tabs | React Testing Library + Vitest |
| E2E (6 files) | accessibility, catering-form, menu-edge-cases, menu-tabs, mobile-responsiveness, navigation | Keep Playwright (mostly unchanged) |
| Fixtures | menu-edge-cases.json | No change |

### Config Files to Update
- `package.json` — add React deps, update scripts
- `vite.config.js` — add `@vitejs/plugin-react`
- `vitest.config.js` — update test environment for React
- `_headers` — review CSP for any changes

---

## Migration Phases

### Phase 1 — Scaffold React Inside the Existing Project

**No visual changes. The site should look and behave identically after this phase.**

1. **Install dependencies**
   - `react`, `react-dom` (runtime)
   - `@vitejs/plugin-react` (dev)
   - `@testing-library/react`, `@testing-library/jest-dom` (dev, for unit tests)

2. **Update Vite config**
   - Add `@vitejs/plugin-react` to plugins
   - Keep `root: 'src'` and existing build config

3. **Create the React entry point**
   - Slim down `src/index.html` to a shell: `<div id="root"></div>` + script tag
   - Create `src/main.jsx` as the React entry that renders `<App />`

4. **Create `<App />` component**
   - Single component that renders the full page (copy HTML structure from current `index.html`)
   - Wire up existing `style.css` as a global import
   - At this point, the site is "React" but still one big component — identical output

---

### Phase 2 — Break Into Components

Extract sections into a clean component tree. Suggested structure:

```
src/
├── components/
│   ├── Nav/
│   │   ├── Nav.jsx            (sticky nav + hamburger)
│   │   └── Nav.css            (scoped styles, optional)
│   ├── Hero/
│   │   └── Hero.jsx
│   ├── Menu/
│   │   ├── Menu.jsx           (section wrapper, fetches data)
│   │   ├── MenuTabBar.jsx     (tab buttons)
│   │   ├── MenuPanel.jsx      (generic panel renderer)
│   │   ├── SignatureCard.jsx
│   │   ├── MenuCard.jsx       (bases, proteins, cheeses, sauces, drinks)
│   │   ├── ExtrasGrid.jsx
│   │   ├── PricingSummary.jsx
│   │   └── MenuError.jsx
│   ├── Story/
│   │   └── Story.jsx
│   └── FindUs/
│       ├── FindUs.jsx
│       ├── LocationCard.jsx
│       └── CateringForm.jsx
├── hooks/
│   ├── useActiveSection.js    (scroll spy → replaces updateActiveLink)
│   ├── useMobileMenu.js      (hamburger open/close/trap focus)
│   └── useMenu.js            (fetch + validate menu data)
├── services/
│   └── menuService.js         (unchanged — already framework-agnostic)
├── App.jsx
├── main.jsx
├── style.css                   (global styles, brand tokens)
├── menu.json
└── logo.svg
```

**Key mapping from vanilla JS → React:**

| Vanilla JS Feature | React Equivalent |
|---|---|
| `renderSignatures()`, `renderBases()`, etc. | `<SignatureCard />`, `<MenuCard />` JSX components |
| `activateTab()` + DOM class toggling | `useState` for active tab in `<Menu />` |
| `updateActiveLink()` + scroll listener | `useActiveSection()` custom hook with `IntersectionObserver` |
| `closeMobileMenu()` + hamburger event listeners | `useMobileMenu()` custom hook |
| `fetchMenu()` + `validateMenu()` | `useMenu()` hook wrapping existing `menuService.js` |
| `init()` function | Component lifecycle (`useEffect`) |
| `data-menu-src` attribute | Prop or env variable |

---

### Phase 3 — Rewrite Unit Tests

Replace DOM-manipulation-based Vitest tests with React Testing Library:

| Current Test File | New Test |
|---|---|
| `hamburger.test.js` | Test `<Nav />` — toggle, ESC close, outside click, focus trap |
| `activeNav.test.js` | Test `useActiveSection` hook |
| `tabs.test.js` | Test `<Menu />` — tab switching, keyboard nav |
| `menuRendering.test.js` | Test `<SignatureCard />`, `<MenuCard />`, etc. with props |
| `menuValidation.test.js` | **Keep as-is** (tests `menuService.js` which doesn't change) |
| `menuSrc.test.js` | **Keep as-is** (tests `isTrustedMenuSrc` which doesn't change) |

---

### Phase 4 — Update E2E Tests

Playwright tests operate against the running site, so most should pass without changes. Review and update:

- **Selectors** — if any `id` or class names change, update selectors
- **Accessibility tests** — re-verify; React's virtual DOM can sometimes affect landmark roles
- **Catering form** — ensure `mailto:` action still works (React form handling)
- **Menu tabs** — verify ARIA attributes are still correct

---

### Phase 5 — Cleanup and Verify

1. Delete the old `src/script.js` (all logic now lives in components/hooks)
2. Run full unit test suite — all green
3. Run full Playwright e2e suite — all green
4. Lighthouse audit — performance, accessibility, SEO scores match or exceed current
5. Verify CSP headers still work (React doesn't require `unsafe-inline` if configured correctly with Vite)
6. Test on mobile — hamburger menu, tab scrolling, form submission
7. Cross-browser spot check (Chrome, Safari, Firefox)

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Bundle size increase (~45KB gzipped) | Slower first load on 3G | Lazy-load below-fold sections; monitor with Lighthouse |
| SEO/crawlability | Client-rendered content not indexed | This is a single-page brochure — crawlers handle React fine now; add `<noscript>` fallback if concerned |
| Broken accessibility | Screen readers miss content | Keep all existing ARIA attributes; test with axe-core in Playwright |
| Scope creep | Migration takes longer than expected | Phase 1 alone gives us a working React app; later phases can be incremental |

---

## Estimated Effort

| Phase | Effort |
|-------|--------|
| Phase 1 — Scaffold | ~1 hour |
| Phase 2 — Components | ~2–3 hours |
| Phase 3 — Unit tests | ~1–2 hours |
| Phase 4 — E2E updates | ~30 min |
| Phase 5 — Cleanup/QA | ~1 hour |
| **Total** | **~5–7 hours** |

---

## Files That Don't Change
- `src/menu.json`
- `src/logo.svg`
- `src/menuService.js` (framework-agnostic)
- `tests/fixtures/menu-edge-cases.json`
- `tests/unit/menuValidation.test.js`
- `tests/unit/menuSrc.test.js`
- `Plans/*` (all plan/brief docs)
- `_headers`
- `playwright.config.js` (minor baseURL tweak at most)

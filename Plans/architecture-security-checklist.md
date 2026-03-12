# Architecture & Security Upgrade Checklist

## Phase 1 – Data validation & error resilience
- [ ] Add schema validation for `menu.json` before rendering (e.g., Zod or manual checks).
- [ ] Build a user-facing fallback panel when validation fails (e.g., "Menu temporarily unavailable").
- [ ] Wrap the menu fetch in `try/catch`, add timeout/error handling, and surface status messages.
- [ ] Validate/whitelist the `data-menu-src` attribute so only trusted relative paths are fetched.

## Phase 2 – Rendering & state structure
- [ ] Extract fetching/validation logic into a dedicated `menuService` (or similar) module.
- [ ] Keep rendering helpers pure so they accept validated data and return DOM structures.
- [ ] Replace raw `innerHTML` usage with DOM APIs or sanitize content before insertion.
- [ ] Add regression tests that prove HTML input is escaped or sanitized.

## Phase 3 – Accessibility & UX polish
- [ ] Implement ARIA roles/attributes (`role="tablist"`, `aria-controls`, `aria-selected`) for the tab system.
- [ ] Support keyboard navigation and focus management when switching tabs.
- [ ] Enhance the mobile menu: trap focus, allow ESC to close, and ensure screen-reader announcements.

## Phase 4 – Security headers & deployment hygiene
- [ ] Configure CSP with a restrictive default-src and explicit allowances for fonts/styles.
- [ ] Enable HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and a strict `Permissions-Policy`.
- [ ] Add Subresource Integrity hashes (or self-host fonts) and avoid inline scripts where possible.
- [ ] Introduce a bundler (e.g., Vite) to minify assets, emit hashed filenames, and support CSP nonces/hashes.

## Phase 5 – Testing & monitoring
- [ ] Expand unit/e2e tests to cover menu validation, error UI, tab accessibility, and mobile menu focus trap.
- [ ] Add lightweight logging/telemetry for fetch failures and unexpected render errors to aid debugging.

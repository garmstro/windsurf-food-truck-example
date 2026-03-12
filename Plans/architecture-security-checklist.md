# Architecture & Security Upgrade Checklist

## Phase 1 – Data validation & error resilience
- [x] Add schema validation for `menu.json` before rendering (e.g., Zod or manual checks).
- [x] Build a user-facing fallback panel when validation fails (e.g., "Menu temporarily unavailable").
- [x] Wrap the menu fetch in `try/catch`, add timeout/error handling, and surface status messages.
- [x] Validate/whitelist the `data-menu-src` attribute so only trusted relative paths are fetched.

## Phase 2 – Rendering & state structure
- [x] Extract fetching/validation logic into a dedicated `menuService` (or similar) module.
- [x] Keep rendering helpers pure so they accept validated data and return DOM structures.
- [x] Replace raw `innerHTML` usage with DOM APIs or sanitize content before insertion.
- [x] Add regression tests that prove HTML input is escaped or sanitized.

## Phase 3 – Accessibility & UX polish
- [x] Implement ARIA roles/attributes (`role="tablist"`, `aria-controls`, `aria-selected`) for the tab system.
- [x] Support keyboard navigation and focus management when switching tabs.
- [x] Enhance the mobile menu: trap focus, allow ESC to close, and ensure screen-reader announcements.

## Phase 4 – Security headers & deployment hygiene
- [x] Configure CSP with a restrictive default-src and explicit allowances for fonts/styles.
- [x] Enable HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and a strict `Permissions-Policy`.
- [x] Add Subresource Integrity hashes (or self-host fonts) and avoid inline scripts where possible.
- [x] Introduce a bundler (e.g., Vite) to minify assets, emit hashed filenames, and support CSP nonces/hashes.

## Phase 5 – Testing & monitoring
- [x] Expand unit/e2e tests to cover menu validation, error UI, tab accessibility, and mobile menu focus trap.
- [x] Add lightweight logging/telemetry for fetch failures and unexpected render errors to aid debugging.

# Matt's Potats Website Build Plan

A single-page static website for Matt's Potats food truck, built with HTML, CSS, and vanilla JavaScript per the client's budget and tech preferences.

---

## Approach

**Single-page scrolling site** — one `index.html` with four anchored sections, sticky nav, and smooth scrolling. Cleaner than four separate pages for a small food truck site and better on mobile.

**Stack:** Plain HTML + CSS + vanilla JS (no frameworks, no build tools — client approved static)

---

## File Structure

```
Session 1/
├── index.html        ← Main page (all 4 sections)
├── style.css         ← All styles, brand guide tokens
├── script.js         ← Sticky nav, menu tabs, smooth scroll, form
├── logo.svg          ← Already provided ✅
```

---

## Sections

### 1. Hero
- Full-viewport section, dark overlay on Peach Tint/Brown bg with placeholder food imagery block
- `logo.svg` top-left in sticky nav
- Headline: **"Potatoes. Elevated."** (Fredoka One, 64–80px)
- Subheading: *"Spud-tacular eats on wheels — Kansas City's favorite build-your-own potato truck."*
- Two CTA buttons: **"Build Your Potat"** (scrolls to menu) + **"Find Us"** (scrolls to location)

### 2. Menu
- Sticky tab bar: `Signatures | Bases | Proteins | Cheeses | Sauces | Extras | Drinks`
- **Signatures** is the default tab — 6 cards with name, base, toppings, price (highlighted in Amber Gold)
- Other tabs show ingredient cards with descriptions and prices
- Pricing summary callout at the bottom of the section

### 3. Our Story
- Warm Cream background section, centered text layout
- Copy **drafted by us** in Matt's brand voice (casual, confident, cheeky — per brand guide tone)
- Placeholder image block (Peach Tint `#FFE8C8` with 🥔 emoji centered)
- Contact line at bottom: `matt@mattspotats.com | (816) 555-0123`

### 4. Find Us
- Two columns (stacks on mobile): **Location & Hours** + **Book Us for an Event**
- Location: Power & Light District, downtown KC — weekdays
- Hours: placeholder **Mon–Fri 11am–3pm** (note to Matt: confirm before going live)
- Address text only — no map embed for now
- **Catering inquiry form**: Name, Email, Phone, Event Date, Guest Count, Message → `mailto:` action (no backend needed)

---

## Navigation
- **Sticky nav bar**: Potato Brown `#5C3D1E` bg, logo left, nav links right (Menu | Our Story | Find Us)
- Hamburger menu on mobile
- Active link highlight in Amber Gold on scroll

---

## Brand Implementation
- Colors: All 7 brand tokens as CSS custom properties in `:root`
- Fonts: Fredoka One + Nunito via Google Fonts `<link>` (from brand guide)
- Cards: `border-radius: 20px`, `box-shadow: 0 4px 24px rgba(92,61,30,0.08)`
- Buttons: Pill shape (`border-radius: 50px`), Amber Gold primary, Spicy Orange hover
- Section padding: `80px` desktop / `48px` mobile
- Max content width: `1100px` centered

---

## Nice-to-Haves (all included)
- ✅ Sticky navigation
- ✅ Tabbed menu with JS tab switching
- ✅ Catering inquiry form (`mailto:` — no backend)
- ✅ Mobile-responsive throughout (CSS Grid + media queries)

---

## What's NOT Included (out of scope per brief)
- No CMS or backend
- No real photography (placeholder blocks used)
- No social media links (placeholder `#` hrefs)
- No online ordering system

---

## Decisions Confirmed

- **Hours:** Mon–Fri 11am–3pm placeholder
- **About copy:** We write it in Matt's brand voice
- **Map:** Address text only (no embed)

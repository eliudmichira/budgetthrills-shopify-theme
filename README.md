# BudgetThrills Shopify Theme

A custom Liquid theme that ports the BudgetThrills brand design to Shopify.

## What's inside

```
theme/
├── assets/             — CSS (Liquid-templated), JS, logos, favicon
├── config/             — settings_schema.json (editor controls) + defaults
├── layout/             — theme.liquid (base shell)
├── locales/            — en.default.json (UI strings)
├── sections/           — modular page sections
├── snippets/           — reusable pieces (product-card, price, pagination)
└── templates/          — page-level templates
    └── customers/      — customer account pages
```

## Upload to Shopify

A pre-zipped version lives at `../budgetthrills-theme.zip` (one level up). Upload that to:

**Shopify Admin → Online Store → Themes → Add theme → Upload zip file**

Once uploaded, **preview** before publishing. When happy, click **Publish**.

## Customization

Everything visual is driven by Theme Settings (no code editing needed):

- **Colors** — canvas, ink, lime, orange
- **Typography** — body font, display font, letter-spacing
- **Layout** — max page width, section padding
- **Logo** — upload your own, sets size
- **Theme toggle** — show/hide the light/dark switch in nav
- **Animations** — toggle scroll reveals and card hover crossfade
- **Social links** — Instagram, TikTok, Twitter, Facebook URLs

Edit via **Shopify Admin → Online Store → Themes → Customize**.

## Required Shopify setup before launch

The theme reads from Shopify data, so make sure:

- **Navigation menus exist:**
  - Main menu: `Online Store → Navigation → Main menu` (Shopify ships with this — add Shoes / Phones / Accessories / Tech / etc.)
  - Footer menu: create one called "footer"
- **Collections set as smart collections** (the theme reads `collection.products` automatically)
- **Currency:** USD (set in Settings → Markets)
- **Customer accounts:** enabled if you want Sign-in to show in nav

## Theme sections reference

| Section | Where it appears | What it does |
|---|---|---|
| `announcement.liquid` | Every page (top strip) | Up to 4 short messages |
| `header.liquid` | Every page (nav) | Logo, menu, search, account, cart, theme toggle |
| `footer.liquid` | Every page (bottom) | Logo, social, menu columns, legal links |
| `hero.liquid` | Homepage | The big 4-line headline |
| `categories.liquid` | Homepage | The 4-column category strip |
| `featured-collection.liquid` | Homepage | Trending grid of products from a chosen collection |
| `deal-of-day.liquid` | Homepage | Countdown + featured single product |
| `featured-drop.liquid` | Homepage | "The Neon Collection" big hero + image |
| `ugc.liquid` | Homepage | 4-tile UGC wall (9:16 ratio) |
| `newsletter.liquid` | Homepage | Email capture (Shopify customer form) |
| `main-product.liquid` | PDP | Gallery, swatches, sizes, add-to-cart, info columns |
| `related-products.liquid` | PDP | "More from this drop" |
| `main-collection.liquid` | Collection page | Header + grid + sort + pagination |
| `main-cart.liquid` | Cart page | Line items, qty steppers, totals, checkout |

## Tested flows

The theme handles these Shopify behaviors out of the box:

- Add to cart (AJAX, updates cart count badge)
- Variant selection by Color (swatch) and Size (pill)
- Cart line qty updates
- Newsletter signup → adds to Shopify customer list with `newsletter` tag
- Customer login / signup / password reset
- Search results with pagination
- 404 page
- Coming-soon password page (used when store is password-protected)
- Light/dark theme persists in localStorage as `bt-theme`

## Known limitations

- **No predictive search dropdown** — search uses standard form submission. Easy to add later via Predictive Search API.
- **No cart drawer** — clicking Cart goes to `/cart` page. Cart drawer is a future enhancement.
- **No mobile menu drawer** — the hamburger button is wired but the mobile drawer needs a section to be added.
- **No quick view on product cards** — clicking goes to PDP.
- **Single language** — `locales/en.default.json` only. Add more locale files for multi-language support.

These are all incremental additions if needed.

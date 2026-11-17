# Abood Auto Parts — project handover

**Repository:** https://github.com/shahdkhaderch/abood-auto-parts (branch `main`)
**Last updated:** 2026-11-17
**What it is:** an Arabic, right-to-left **catalogue** website for **عبود عبد ربه — قطع مرسيدس** (Mercedes-Benz spare parts and accessories). Customers browse parts and enquire on WhatsApp. There is no cart, checkout or account.

This file is the single source of truth for continuing the work. It describes the code as it is now; if the code and this file disagree, trust the code and update this file.

---

## 0. Owner decisions (confirmed — these override everything else)

1. **Catalogue, not a store.** No cart, checkout, payment, orders or user accounts.
2. **WhatsApp is the enquiry path.** Every product has a WhatsApp button with a prefilled message: product name, model, product page URL. (No item code — see 5. No condition line yet — the sheet has no condition column.)
3. **Each product has its own page** with Open Graph metadata (title, description, image) so WhatsApp shows the product photo as a link preview.
4. **No Account button/route.** Favorites may come later, browser storage only.
5. **No counts, numbers or item codes are shown to customers anywhere.** No product/result counts, no chip counts, no image counters ("1/2"), no `رقم الصنف` in the UI, link previews or the WhatsApp message. Screen-reader labels use words ("الصورة الثانية"), not digits. Product data itself (chassis such as W205, years in product names) is fine. **Exception still open:** the product URL contains the code (`/products/bg2j0020`) — see Pending tasks.
6. **Deployment:** VS Code → GitHub `main` → Vercel auto-deploy. Progress is shown to the shop owner on the Vercel URL.

---

## 1. Stack and commands

- Next.js `16.1.4` (App Router, Turbopack), React `19.2.3`, TypeScript (strict), Tailwind CSS v4, ESLint 9 (`eslint-config-next`). No database, no auth, no state library. Do not upgrade versions casually.
- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`. `predev`, `prebuild` and `prelint` run `npm run images` (`scripts/gen-product-images.mjs`, see Images).
- `@/*` → project root. Fonts: Geist via `next/font`; generated images use Cairo (`assets/fonts`, OFL).
- `next.config.ts`: `allowedDevOrigins`; `turbopack.root` + `outputFileTracingRoot` pinned to the project folder (there is a stray lockfile in the user's home folder); `images.remotePatterns` allows `https://res.cloudinary.com/uw678pyp/image/upload/**`.

### Environment variables (names only — values live in `.env.local`, never committed, and in Vercel → Project Settings → Environment Variables)

| Name | Used for |
|---|---|
| `PRODUCTS_CSV_URL` | Published Google Sheet CSV with the products (server-only, read at runtime). |
| `NEXT_PUBLIC_SITE_URL` | Public base URL without trailing slash; used in WhatsApp messages, canonical URLs and link previews. Inlined at build time → redeploy after changing it. Defaults to `http://localhost:3000`. |

`.env.example` documents both. `.gitignore` ignores `.env*` except `.env.example`.

---

## 2. Data: the Google Sheet

- Products come only from the **published Google Sheet CSV** (`PRODUCTS_CSV_URL`). Sheet edits appear on the site within **5 minutes** (no push, no redeploy). Google's published CSV itself can lag a few minutes behind edits.
- **Read products only through `getProducts()` / `getProductBySlug()` in `lib/products.ts`.** It fetches the CSV (`revalidate: 300`, tag `products`), parses it (`csvToProducts` in `lib/catalog.ts`), logs warnings, then drops photos that are not on Cloudinary (`lib/image-check.ts`). If a required column is missing it throws, so Next keeps serving the last good page.
- **Failure handling:** in production a missing `PRODUCTS_CSV_URL`, a failed fetch, an HTML response (sheet unpublished) or a CSV with 0 products **throws** — the build fails or, on a background refresh, Next keeps the last good data. Only in development does a missing variable give an empty catalogue (with a warning). There is no hardcoded fallback URL.
- Columns are found **by header name** (BOM, zero-width/RTL marks removed, whitespace collapsed and trimmed, so `"حالة الصورة "` matches); column order does not matter and **every other column is ignored**.

| Column | Required | Values | Used for |
|---|---|---|---|
| `رقم الصنف` | yes | item code, e.g. `BG2J0019` | URL slug (lowercase), search. Never displayed. |
| `اسم الصنف` | yes | product name | display, part type, chassis, category, search |
| `الموديل` | yes | e.g. `C Class`, or several: `C Class, E Class` | model filter `?model=c-class`, model chips/dropdown |
| `صور مرجعية` | optional | one or more Cloudinary `.jpg` file names, comma-separated; or `عرض الصور` (old Google search link, ignored) | product photos (see Images) |
| `القسم` | optional (not in the sheet now) | a category label from the table in §3 | overrides the category detected from the name |
| `عرض` | optional (not in the sheet now) | `نعم` or empty | offers filter `?offer=1`, "عروض" badge/link |

- **Ignored on purpose** (present in the sheet as of 2026-11-17): `#`, `الصورة`, `حالة الصورة` (header has a trailing space; internal photo review: صحيحة / غلط / بحاجة تأكيد — must never hide or mark a product). Earlier versions had `كلمات البحث`, `مراجعة`, `اسم الصورة المقترح` — all ignored/removed.
- Values are compared after normalisation (`lib/text.ts`), so `اضوية` = `أضوية`. Unknown `القسم`/`عرض` values log a warning.
- Rows without a code are skipped; duplicate codes: first row wins (both log a warning).
- **Sheet status 2026-11-17:** 699 products. 3 rows have a code but no name (`BGRE0035`, `LIAH0031`, `LIAH0061`) — they show their code as the name until the sheet is fixed. 696 products have a file name in `صور مرجعية` (697 file names; `LI2J0038` has two); **188 of those files exist on Cloudinary, 509 are not uploaded yet** (they show the placeholder automatically).

---

## 3. Derived product fields (`lib/catalog.ts`, pure, no Next imports)

- `slug` = code lowercased (`codeToSlug`). `models` = `الموديل` split on `,`/`،` with slugs (`c-class`).
- **Part type** (`detectPartType`, first word of the normalised name): `دفيوزر` → diffuser; `طبون`/`بمبر`/`صدام` + `خلفي` → rear bumper, + `امامي` → front bumper; otherwise `other`. Bumpers/diffusers are shown with their part-type label; other parts with their category label (`productLabel`).
- **Chassis** (`detectChassis`): first standalone 3-digit number in the name via `CHASSIS_LOOKUP` (117→C117, 253→X253, 167→V167, 205→W205 …); unknown numbers → `W` + number.
- **Category** (`CATEGORY_RULES` / `matchCategoryRule` / `detectCategory`): the `القسم` column wins if filled; bumpers/diffusers (by part type) are always كماليات خارجية; otherwise rules are checked top to bottom on the normalised name and the first match wins.

| Category (label → `?category=`) | Rule | Count 2026-11-17 |
|---|---|---|
| شعارات وإشارات → `emblems` | name **starts with** اشارة | 14 |
| قطع الأضوية → `light-parts` | name **starts with** طقم اصلاح ضوء, زجاجة ضوء, كتوت زينون, عين ضوء, جسر عين ضوء, طوق كشاف, غماز | 87 |
| أضوية → `lights` | complete lights only; name **starts with** ضوء امامي, ضوء خلفي, ضوء خزانة, ضوء بريك, كشاف, طقم ضوء تحويل (also طقم ضوء خلفي/امامي تحويل) | 203 |
| كماليات داخلية → `interior` | a word **starts with** طارة, اير باك, ايرباك, لوحة كبسات, فرش, دواسات, مقود, قاعدة سكرة, تابلو, كرسي, مسند | 9 |
| كماليات خارجية → `exterior` | bumpers/diffusers, or a word starts with طبون, دفيوزر, شل, بودي كيت, مرشات, مراية, نجل, اكزوزت, جناح, جنحان, شفة, سبويلر, حساسات, شبك, بلاستيك حماية, واجهة | 262 |
| قطع بودي وغيار → `parts` | everything else (default) | 124 |

  Known edge cases: `كتوت ضوء خلفي CLA117` matches no light rule → قطع بودي وغيار (owner may want قطع الأضوية); `زجاجة مراية مع غماز` (×4) → كماليات خارجية (mirror glass). `CATEGORY_LABELS` order = display order everywhere.
- `onOffer` from `عرض`. `imageFiles` from `صور مرجعية` (`parseImageFiles`: split on `,`/`،`, trim, keep plain names ending in `.jpg`, keep order, drop duplicates; other formats log a warning).

---

## 4. Images

- **Priority:** Cloudinary photos from `صور مرجعية` → local `public/products/<CODE>.jpg` (none exist today) → designed placeholder. `getProductPhotos(product)` (all, main first) / `getProductPhoto(product)` (main only) in `lib/product-images.ts`.
- **Cloudinary URL** = `cloudinaryBaseUrl` (`https://res.cloudinary.com/uw678pyp/image/upload`, in `lib/site.ts`) + `/` + file name, **without a version number**. File names must match the Cloudinary public ID exactly (Cloudinary sometimes adds a random suffix on upload — then the photo is "missing").
- **Existence check** (`lib/image-check.ts`, inside `getProducts()`): every file gets a HEAD request; 404/410 → removed from `imageFiles` → placeholder. Errors/timeouts/5xx count as present (a Cloudinary hiccup must not hide every photo; the client fallback still covers it). The result is cached with `unstable_cache` (300 s, tag `products`, keyed by the sorted file list) because Next's fetch cache only stores 200 responses — a plain cached HEAD would re-check every 404 on every render. Concurrency 16, 8 s timeout, in-process de-duplication.
- **Client fallback:** if a photo still fails to load, the card swaps in the placeholder (`components/ProductPhoto.tsx`) and the gallery drops that photo (placeholder if none load). Verified: with all 699 products on one page, 0 broken images.
- **Where photos appear:** the **first** file is the main image (product card, WhatsApp preview). The product page shows **all** files in `components/ProductGallery.tsx`: scroll-snap main image (swipe on touch, `IntersectionObserver` tracks the active slide, works in RTL), thumbnails under it only when there are 2+ photos (click → `scrollIntoView`), active thumbnail outlined orange, others dimmed with a hover effect. No counter (decision 5).
- **Logo badge** (`components/PhotoBadge.tsx`): logo + "عبود عبد ربه" in a dark glass pill (`bg-neutral-950/70`, white ring, blur) in the top-right corner of every real photo — card, every gallery slide, and the WhatsApp preview. Smaller on cards and on phones so it doesn't cover the part. Thumbnails have no badge. Photos are `object-contain` on white (catalogue shots are square on white).
- **Placeholder** (`components/ProductImage.tsx`): dark card with orange glow, logo + name, part-type/category label, icon (`components/PartIcon.tsx`, one per part type and category), model + chassis in large text, product name. No item code.
- **WhatsApp/OG preview** (`app/products/[slug]/opengraph-image.tsx`, 1200×630 PNG): with a photo → photo (`c_limit,w_1000,h_1000,f_jpg,q_80` Cloudinary transform, falls back to the original) above a dark strip with model + chassis and the part-type label, plus the logo badge top-right; without → the placeholder design. Satori gotchas: Noto Arabic crashes it, so Cairo is used; Arabic must go through `lib/arabic-shaping.ts` (pre-joined letters, right-to-left word order — only for generated images, never site text); no fragments or conditional `false` children inside `<svg>`.
- `scripts/gen-product-images.mjs` writes the git-ignored `lib/product-images.generated.ts` from `public/products` (local photos need a push).

---

## 5. Pages and features

### Layout (`app/layout.tsx`)
`lang="ar" dir="rtl"`. Fetches products to build the navigation (`getNavData` in `lib/filters.ts`): **only models, categories and the offers link that have products are shown**. Renders `Navbar`, page, `Footer`, `MobileBottomNav`.

- **Navbar** (`components/Navbar.tsx`, client): sticky; logo; desktop search box (`SearchForm`); WhatsApp button; favorites heart → `/favorites`; mobile 🔍 toggles a search bar. Orange bar: "مرسيدس" dropdown with every model (→ `/products?model=…`, no counts), "كل القطع", every category, "عروض" if any, "تواصل معنا". Mobile drawer with the same links. No Account button.
- **Footer**: logo, description, quick links (home, all parts, categories, offers), location, delivery note, WhatsApp/Facebook/Instagram. No year (decision 5).
- **MobileBottomNav**: الرئيسية `/`, القطع `/products`, المفضلة `/favorites`.
- **Hero** (`components/A1Hero.tsx`): 4 slides, auto-advance every 6 s, pauses on hover/touch, off for reduced motion; dots and swipe; buttons go to `/products`. Decorative layers must stay `pointer-events-none`. Dot labels are ordinal words.

### `/` — homepage (`app/page.tsx`)
Hero, then the product grid with **load more**, and a small "عرض كل القطع ‹" link to `/products` in the section header. Reads `searchParams` (`?show=`), so it renders per request (the sheet fetch is still cached).

### `/products` — all products (`app/products/page.tsx`)
- Filters live in the URL and can be shared: `q` (search), `model` (slug), `category` (`interior|exterior|lights|light-parts|emblems|parts`), `show` (load more). `type=front|rear|diffuser` and `offer=1` still work for old links/the offers link but have no chip row.
- Two chip rows only: **الموديل** and **القسم** (no counts). Options respect the other active filters, so a chip never leads to 0 results. Chips are `Link`s with `prefetch={false}` and `scroll={false}`.
- Heading: search text, or "قطع مرسيدس <model>[ - <category>]", or the category name, or "كل القطع". **No results count.**
- Clear links: مسح الفلاتر / مسح البحث / مسح الكل. Friendly empty state with a WhatsApp link that includes the search text.

### Load more (homepage and `/products`, including filters and search)
- 24 products first (`SHOW_STEP` in `lib/filters.ts`); "عرض المزيد" (`components/LoadMoreButton.tsx`) adds 24 per click; hidden when everything is shown.
- The amount is in the URL (`?show=48`; `parseShow` rounds up to a multiple of 24, caps at 2400, invalid → 24), so opening a product and pressing Back restores the list and scroll position.
- The button is a `Link` with `replace` (no history entry per click), `scroll={false}`, `prefetch={false}`; shows "جاري التحميل…" while pending (`useLinkStatus`). Works without JavaScript.
- Changing a filter or searching drops `show` → starts again from 24. No counts anywhere.

### `/products/[slug]` — product page (`app/products/[slug]/page.tsx`)
Gallery (or placeholder), label badge, offer badge, name, details table (الماركة, الموديل → filtered list, الشاصي, نوع القطعة as plain text, القسم → filtered list), big WhatsApp button. No item code and no note under the button. Metadata: title/description, canonical, OG + Twitter (`summary_large_image`); og:image from `opengraph-image.tsx`. `revalidate = 300`; `generateStaticParams` prebuilds every product; new codes render on first visit; unknown slugs → 404.

### `/favorites`
"قريباً" placeholder page only.

### Search (`lib/search.ts`; form: `components/SearchForm.tsx`, a GET form to `/products?q=` used in the header, the mobile bar and on `/products`, where it keeps the active model/category)
- Searches name, code, model, chassis, part-type label, category label and offer. Every query word must match, any order, Arabic/English mixed, case-insensitive. Results ranked (exact > prefix > typo), ties in sheet order.
- Normalisation: `normalizeText` (أ إ آ ٱ → ا, ة → ه, ى → ي, no tashkeel/tatweel, lowercase) + `normalizeSearch` (removes ء ؤ ئ; search only).
- A query word matches a product word it equals or **starts** ("ضو" → "ضوء"). Words containing digits also match inside a token ("117" → "cla117"), never with typos (c205 ≠ c204).
- **One typo** for letter-only words of 4+ letters, only when the word matches nothing as typed, and only on the typed word (synonyms are never typo-matched).
- **Synonym groups** (`SYNONYM_GROUPS`): ضوء = ضو = ضواو = اضواء = اضويه = فانوس; طبون = بمبر = صدام = دعاميه; شل = شبك = جريل = كريل; امامي = قدام = قدامي; خلفي = ورا = وراني; شمال = يسار; مرايه = مراه = مرآه; غطاء مطور = كبوت = كابوت; نجل اكزوزت = اكزوز = اكزوست; دفيوزر = ديفيوزر. Multi-word members are matched as phrases. A typed word (3+ letters) that starts a member, or (4+) is one typo from one, pulls in its group.
- A full model name in the query ("C Class") restricts results to that model.
- Reference counts on the live sheet (2026-11-12, after the category split): ضواو 269, ضو خلفي 80, بمبر قدام 67, شبك c205 7, كبوت 10, فانوس e212 22.

### Config (`lib/site.ts`)
Single source for business name/tagline, WhatsApp number, social links, location, `siteUrl`, `cloudinaryBaseUrl`, and link builders (`whatsappLink`, `productWhatsAppLink`, `productPath`, `absoluteUrl`). Product WhatsApp message: `مرحبا، بدي استفسر عن هالقطعة:` / name / `الموديل: …` / product URL. Confirm with the owner before changing any business detail.

---

## 6. File map (source)

```text
app/layout.tsx · app/page.tsx · app/globals.css · app/favorites/page.tsx
app/products/page.tsx · app/products/[slug]/page.tsx · app/products/[slug]/opengraph-image.tsx
components/ A1Hero, Navbar, Footer, MobileBottomNav, SearchForm, ProductCard, ProductImage (placeholder + chooses photo/gallery),
            ProductPhoto (card photo), ProductGallery, PhotoBadge, PartIcon, LoadMoreButton, WhatsAppIcon
lib/ products.ts (only data entry point) · catalog.ts (CSV parsing, derivation, categories) · image-check.ts (Cloudinary HEAD check)
     product-images.ts · filters.ts (URL filters, facets, nav data, load more) · search.ts · text.ts · site.ts · arabic-shaping.ts
scripts/gen-product-images.mjs · assets/fonts (Cairo, OFL) · public/abood-logo.png · public/slider/ · public/products/ (local photos, empty)
```

---

## 7. Pending tasks (not done)

1. **Code-free product URL — waiting for the owner's approval; do not implement before.** Proposal: `/products/<readable>-<id>`, e.g. `/products/c-class-w205-front-bumper-k7q2m9`. Readable part (Latin, from model + chassis + part type/category) is cosmetic; the 6-character `id` is a one-way hash of the code and is what the page is looked up by, so renames don't break links (mismatched readable part → redirect to the canonical URL). Old `/products/<code>` URLs redirect permanently. Build warns on hash collisions. Open question for the owner: without the code in the message or URL, shop staff identify the item by name + link only.
2. **Photos not uploaded yet:** 509 of 697 file names in `صور مرجعية` return 404 on Cloudinary. Nothing to code — they appear within 5 minutes of being uploaded under exactly the name in the sheet.
3. **Sheet fixes for the owner:** names for `BGRE0035`, `LIAH0031`, `LIAH0061`; decide whether `كتوت ضوء خلفي CLA117` belongs in قطع الأضوية.
4. **Favorites:** placeholder page only; when built, browser storage only (decision 4).
5. **Condition (new/used):** no sheet column yet; add to product page and WhatsApp message once it exists (decision 2).
6. **Optional, offered but not requested:** a search synonym so ضو/فانوس also find قطع الأضوية (غماز, طوق كشاف); on mobile, scroll the active category chip into view in the sideways-scrolling filter row.
7. `README.md` is still the create-next-app default.

---

## 8. Working rules for the next session

1. Check `git status`/`git log` first; trust the code over this file, and update this file when architecture, routes, data model, integrations or status change.
2. Follow §0. Never show counts, numbers or item codes to customers; keep WhatsApp as the enquiry path; no cart/checkout/accounts/database without the owner's agreement.
3. Don't invent business details, compatibility, prices or stock. Ask only about decisions that block work; otherwise propose and label it a proposal.
4. Preserve RTL; verify desktop and **390px** after UI changes; run `npm run lint` and `npm run build` and report real results.
5. Keep contact details in `lib/site.ts`; read products only via `lib/products.ts`; keep `lib/catalog.ts` pure.
6. Testing notes (Windows): the owner often has `next dev` running on port 3000 — don't kill it; a second `next dev` in this folder fails on the `.next/dev` lock, so test with `npm run build` + `npx next start -p <other port>`. Playwright is not a project dependency; browser checks used `playwright-core` installed in a temp folder outside the repo, driving the installed Microsoft Edge (`channel: "msedge"`). Keep scratch/test files outside the repo.

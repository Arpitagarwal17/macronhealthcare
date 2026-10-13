# CODEBASE GUIDE FOR CODEX - Macron Health Care Website

This guide is for future Codex work on the Macron Health Care website. The site is a Next.js App Router project for product portfolio viewing, doctor visual-aid presentation, basket creation, and PDF/PPT export.

## Core Rules

- Do not redesign, recolor, crop, stretch, filter, or recreate the official Macron Health Care logo.
- Use the existing logo image exactly as provided in `public/logo.png`.
- Macron Health Care is a pharmaceutical company, not a manufacturer. Do not add manufacturing, GMP, ISO, or other certification claims without verified company evidence. Do not identify Macron as a manufacturer in structured data.
- Do not add random medical claims, indications, benefits, dosage advice, mechanisms, or invented product descriptions.
- Product information must come from `data/products.ts`.
- Keep product data consistent across Product Portfolio, Doctor Presentation, Basket, PPT View, PDF export, and PPT export.
- Visual aid images must use `object-contain` in UI previews/details.
- Export logic must use original image files directly, not DOM screenshots or `html2canvas`.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Client-side basket stored in `localStorage`
- PDF export with `jsPDF`
- PPT export with `pptxgenjs`
- Drag-and-drop basket ordering with `@dnd-kit`

## Important Routes

- `/` - Homepage
- `/about` - Canonical About Us page
- `/product-portfolio` - Canonical Product Portfolio and downloadable Product Card/MRP List PDFs
- `/product-portfolio/[slug]` - Product information detail page
- `/doctor-presentation` - Visual aid selection and basket creation
- `/doctor-presentation/[slug]` - Product visual aid detail page
- `/basket` - Presentation basket, drag reorder, PPT view, PDF/PPT export
- `/company-info` - Company registration, address, and contact details
- `/contact` - Contact details
- `/product-list` and `/products` redirect to `/product-portfolio`; `/products/[slug]` redirects to the matching `/product-portfolio/[slug]`.
- `/visual-aids` and `/visual-aids/[slug]` redirect to the matching Doctor Presentation routes.
- `/info` redirects to `/company-info`.

## Key Files

- `app/layout.tsx` - Root layout
- `app/page.tsx` - Homepage
- `app/about/page.tsx` - About Us page
- `app/product-portfolio/page.tsx` - Product Portfolio page
- `app/product-portfolio/[slug]/page.tsx` - Product information detail page
- `app/doctor-presentation/page.tsx` - Doctor Presentation listing
- `app/doctor-presentation/[slug]/page.tsx` - Visual aid detail view
- `app/basket/page.tsx` - Basket route wrapper
- `components/Header.tsx` - Sticky responsive header
- `components/Footer.tsx` - Responsive footer
- `components/CompanyCore.tsx` - Interactive homepage principles around the official logo, with a continuous clockwise ring and pause/play controls
- `components/HeritageSection.tsx` - Compact homepage heritage band with a unified Since 1999 pill
- `components/CompanySections.tsx` - About principles and shared patient/doctor values section
- `components/ProductPortfolioClient.tsx` - Read-only product portfolio cards and filters
- `components/ProductGrid.tsx` - Doctor Presentation product grid
- `components/ProductCard.tsx` - Doctor Presentation product card
- `components/BasketPageClient.tsx` - Basket management, drag reorder, export controls
- `components/PresentationViewer.tsx` - Full-screen PPT-style view
- `components/exportBasket.ts` - PDF/PPT export logic
- `components/useBasket.ts` - Basket localStorage logic
- `data/products.ts` - Single product data source
- `data/productCategories.ts` - Dosage grouping/filter logic
- `data/downloads.ts` - Product Card/Product List PDF links
- `data/company.ts` - Company contact, address, registration data

## Homepage and About Us

- Open the homepage with concise human-centred copy: "Behind every prescription, there is a person." Follow with a dedicated Since 1999 section and the interactive company core.
- Keep the heritage section compact: one readable "Since 1999" pill, the heading "A legacy of quality and service.", concise quality/service copy, and an "Our story" link to `/about`. Use `company.servingSince` for the year. Do not reintroduce giant year digits, a separated "Since" label, or a timeline.
- Keep Product Portfolio and Doctor Presentation sections further down the homepage so visitors meet the company before using the professional tools.
- The About Us page uses established company facts from `data/company.ts`; avoid invented history, scale, facilities, or accreditation claims.
- Keep the official logo unchanged in the header and footer.
- Use one clean navigation bar. Do not add a utility strip above it. Contact details belong in the footer. The footer summary is exactly "Committed to quality and services since 1999." The homepage also has its own Since 1999 section.
- Home and About use scoped CSS modules. Keep the homepage company introduction first and product/presentation tools farther down.
- The website is shown to doctors by the medical team. Use concise company and product copy; avoid trade-partner, healthcare-audience and enquiry marketing pitches. Do not repeat the company name above the homepage headline; the original logo establishes the brand.
- Use rounded pill buttons with clear labels, circular arrow accents, accessible focus states and consistent hover feedback on Home/About/navigation.
- Use `public/images/macron-doctors-hero-v3.webp` for the homepage hero and `public/images/macron-medical-dialogue-v3.webp` for company imagery. These are illustrative images, not photographs of actual Macron employees, doctors, clients or facilities. Prompts are recorded in `assets/website-image-prompts-v3.json` and the copyable `assets/IMAGE-PROMPTS.txt`.
- `components/PageMotion.tsx` adds one-time scroll reveals to Home/About via `data-reveal`. Content is visible without JavaScript; reduced-motion preferences disable animations.
- The company core keeps the official logo intact at its centre. At every width, arrange the nodes clockwise around one ring: Mission at the top, Vision on the right, Values at the bottom, and Promise on the left. Do not add numeric counters or segmented progress indicators.
- Drive the company core with one continuous `requestAnimationFrame` clock, taking 6.5 seconds to reach each next node. Update the selected node and detail copy when the ring indicator arrives at that node; do not use separate clocks for the ring and copy. Provide manual Pause/Play, respect reduced motion, and stop automatic motion off-screen and in background tabs. Pointer selection keeps automatic cycling active; keyboard focus on selectors or focus in the detail content pauses cycling until focus leaves.
- Use the shared company sections and four-column footer consistently. Care content describes patients' dignity, respect for doctors' clinical judgement and responsible service. Do not replace it with product-information or visual-aid feature lists, and do not imply laboratory testing, manufacturing facilities, certification or product efficacy.
- Use bold Manrope (700) for company-page headings, with regular body text. Avoid italic serif headlines, oversized tablet headings, and repeated commitment slogans. The About page has no separate cities/locations section; addresses remain in the footer and contact information.
- Keep the About title short and on one line. Use normal-flow image frames on mobile and tablet, with both subjects visible; do not overlay text on the About image. Home uses a dedicated tablet split hero and stacked phone hero. At widths of 899px and below, stack the company-core wheel above its detail panel. On phones, keep a compact wheel with the same four directional nodes; do not replace it with a two-by-two grid. The shared care image is one rectangular frame at every size. Keep About principles in compact icon rows on smaller screens.

## Product Data Rules

Each product in `data/products.ts` follows:

```ts
export type Product = {
  slug: string;
  brandName: string;
  composition: string;
  dosageForm: string;
  productImages?: { src: string; width: number; height: number; label: string }[];
  visualAidImage: string;
  visualAidWidth?: number;
  visualAidHeight?: number;
};
```

When adding or updating a product:

- Use exact brand spelling requested by the user.
- Do not guess composition from images unless the user explicitly confirms it.
- If composition is unknown, use `Composition to be added`.
- If dosage form is unknown, use `Dosage form to be added`.
- Visual aid image paths should be public paths, for example `/visual-aids/product-name.jpg`.
- Set `visualAidWidth` and `visualAidHeight` when artwork differs from the
  standard 1672 x 941 visual-aid size used by metadata fallbacks.

Current special corrections:

- Product photos in `/product-photos/` are separate from visual aids. Portfolio
  cards/details and homepage product cards show the photo; Doctor Presentation,
  Basket, PDF and PPT continue using the visual aid. All previews use object-contain.
- ETR-90 and ETR-120, Metoron-XL-25 and Metoron-XL-50, Vtrocef-250 and Vtrocef-500
  are separate products, each with its own photo. Each pair shares one visual aid.
- Myovit tablets are now Vitabank tablets (`vitabank-tablets`). The previous
  Vitabank capsule (`vitabank`) is removed. Legacy Myovit links redirect; saved
  Myovit selections migrate to tablets while obsolete capsule selections drop.
- Emifurt-500 is an injection. Emifurt-500, M-TROX 1500 SB and Molly-Forte injection
  deliberately have blank product photo frames. Retain their visual aids.
- Supplied revised visual aids have versioned paths to avoid immutable-image
  cache collisions. Downloadable PDFs use a version query in `data/downloads.ts`.

- `Curix-200` uses `/visual-aids/curix-200.jpg`.
- `PPZOL-DSR` dosage form is `Sustained Release Capsules`.
- Softgel products should display as `Soft Gelatin Capsules`.

## Product Portfolio Page

The Product Portfolio page is for viewing product data and downloading PDFs only.

Product cards must show only:

- Product photo (blank when none supplied)
- Brand name
- Composition
- Dosage form tag

Do not show basket or presentation actions on Product Portfolio cards.

Do not show:

- `View Presentation`
- `Add to Basket`
- `Added` confirmation states

The page keeps:

- Product Card PDF view/download
- Product List PDF view/download
- Search
- Dosage filters
- Category-wise product cards

## Doctor Presentation Page

The Doctor Presentation page is where users select visual aids for MR doctor visits.

Product cards show:

- Visual aid preview
- Brand name
- Composition
- Dosage form
- View Presentation button
- Add to Basket button

Basket and presentation actions belong here, not on Product Portfolio.

## Basket Rules

- Basket is stored in `localStorage`.
- No login, password, backend, or doctor data collection.
- Basket order controls PPT View, PDF export, and PPT export order.
- Drag-and-drop reorder must remain mobile-friendly.
- When basket is empty, hide export and PPT controls.

Empty basket text:

- `Your presentation basket is empty.`
- `Add products from Doctor Presentation to create a quick presentation.`

## PPT View Rules

The in-browser PPT view should be clean and doctor-friendly:

- Official logo at top exactly unchanged
- One product per screen
- Large centered visual aid image
- White background
- Previous / Next / Exit controls
- Slide counter
- Mobile swipe and desktop keyboard arrow support
- Do not crop visual aid images

## PDF/PPT Export Rules

Export logic lives in `components/exportBasket.ts`.

Current export behavior:

- First PDF page / PPT slide is always `/visual-aids/visual-aid-cover-2026.jpg`.
- Page/slide 2 onward shows only the selected product visual aid image.
- Export uses the original image file from `product.visualAidImage`.
- Export does not capture DOM.
- Export does not use `html2canvas`.
- Export does not add repeated headers, footers, product text, or logo overlays after the cover.
- Every page/slide is 16:9 landscape.
- Images are placed full-page/full-slide with no margins.

Current export filenames:

- `Macron-Health-Care-Visual-Aid.pdf`
- `Macron-Health-Care-Visual-Aid.pptx`

## Public Assets

- Official logo: `public/logo.png`
- Homepage pharmaceutical image: `public/images/macron-doctors-hero-v3.webp`
- About Us image: `public/images/macron-medical-dialogue-v3.webp`
- Patient/doctor values image: `public/macron-doctor-patient-trust-hero-2026.webp` (illustrative consultation; preserve both faces in responsive crops)
- Cover slide: `public/visual-aids/visual-aid-cover-2026.jpg`
- Visual aids: `public/visual-aids/`
- Curix-200 official image: `public/visual-aids/curix-200.jpg`
- Product Card PDF: `public/assets/pdfs/macron-product-card.pdf`
- Updated MRP List 2026: `public/downloads/macron-healthcare-updated-mrp-list-2026.pdf`

## Styling Rules

Use a premium, clean pharma style:

- One pale background `#F4F8FA` with white sections and cards
- Macron navy blue `#063B78`
- Teal accent `#00796B`
- White cards
- Shared border `#D8E5EC` and muted text `#526579`
- 24px card corners, pill buttons, circular icon controls
- Soft shadows
- Readable product composition text
- Mobile-first spacing and touch-friendly buttons
- Reuse CSS tokens in `app/globals.css` and their Tailwind mappings; do not introduce a different palette for individual sections or product tools.

Avoid:

- Harsh gradients
- Random stock/AI medical imagery
- Unrelated decorative icons; use consistent line icons when explaining company principles or actions
- Tiny text
- Joined contact details
- Overcrowded product cards
- One-off styling that breaks consistency

## Local Commands

```bash
npm install
npm run dev
npm run build
```

Default local URL:

```text
http://localhost:3000
```

This workspace often uses:

```text
http://127.0.0.1:3001
```

## Deployment

The project is pushed to GitHub and deployed on Vercel.

Repository remote:

```text
https://github.com/Arpitagarwal17/macronhealthcare.git
```

Production website:

```text
https://www.macronhealthcare.com/
```

After changes:

```bash
npm run build
git status
git add .
git commit -m "Clear commit message"
git push origin main
```

## Final QA Checklist

Before finishing meaningful UI/export changes, verify:

- `npm run build` passes.
- Homepage text is clean and not overcrowded.
- Header mobile hamburger works.
- Product Portfolio is read-only and has no basket actions.
- Doctor Presentation can add products to basket.
- Basket empty state hides export controls.
- Drag reorder works.
- PPT View shows selected visual aids.
- PDF export includes cover first, then selected visual aids.
- PPT export includes cover first, then selected visual aids.
- Curix-200 uses `/visual-aids/curix-200.jpg`.
- Footer contact details are not joined into one line.
- No logo modifications were made.

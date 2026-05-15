# CODEBASE GUIDE FOR CODEX - Macron Health Care Website

This guide is for future Codex work on the Macron Health Care website. The site is a Next.js App Router project for product portfolio viewing, doctor visual-aid presentation, basket creation, and PDF/PPT export.

## Core Rules

- Do not redesign, recolor, crop, stretch, filter, or recreate the official Macron Health Care logo.
- Use the existing logo image exactly as provided in `public/logo.png`.
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
- `/product-list` - Product Portfolio and downloadable Product Card/Product List PDFs
- `/doctor-presentation` - Visual aid selection and basket creation
- `/doctor-presentation/[slug]` - Product visual aid detail page
- `/basket` - Presentation basket, drag reorder, PPT view, PDF/PPT export
- `/info` - Company information
- `/contact` - Contact details
- `/visual-aids` and `/products` are legacy redirect routes.

## Key Files

- `app/layout.tsx` - Root layout
- `app/page.tsx` - Homepage
- `app/product-list/page.tsx` - Product Portfolio page
- `app/doctor-presentation/page.tsx` - Doctor Presentation listing
- `app/doctor-presentation/[slug]/page.tsx` - Visual aid detail view
- `app/basket/page.tsx` - Basket route wrapper
- `components/Header.tsx` - Sticky responsive header
- `components/Footer.tsx` - Responsive footer
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

## Product Data Rules

Each product in `data/products.ts` follows:

```ts
export type Product = {
  slug: string;
  brandName: string;
  composition: string;
  dosageForm: string;
  visualAidImage: string;
};
```

When adding or updating a product:

- Use exact brand spelling requested by the user.
- Do not guess composition from images unless the user explicitly confirms it.
- If composition is unknown, use `Composition to be added`.
- If dosage form is unknown, use `Dosage form to be added`.
- Visual aid image paths should be public paths, for example `/visual-aids/product-name.png`.

Current special corrections:

- `Curix-200` uses `/curix-200-visual-aid.png`.
- `PPZOL-DSR` dosage form is `Sustained Release Capsules`.
- Softgel products should display as `Soft Gelatin Capsules`.

## Product Portfolio Page

The Product Portfolio page is for viewing product data and downloading PDFs only.

Product cards must show only:

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

- First PDF page / PPT slide is always `/visual-aids/visual-aid-cover.png`.
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
- Cover slide: `public/visual-aids/visual-aid-cover.png`
- Visual aids: `public/visual-aids/`
- Curix-200 official image: `public/curix-200-visual-aid.png`
- Product Card PDF: `public/assets/pdfs/macron-product-card.pdf`
- Product List PDF: `public/downloads/macron-product-list-2026 (1)(1).pdf`

## Styling Rules

Use a premium, clean pharma style:

- Light background
- Macron navy blue `#063B78`
- Teal accent `#009688`
- White cards
- Soft light-blue borders
- Rounded corners
- Soft shadows
- Readable product composition text
- Mobile-first spacing and touch-friendly buttons

Avoid:

- Harsh gradients
- Random stock/AI medical imagery
- Decorative medical icons unless needed for contact/footer clarity
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
https://macronhealthcare.vercel.app/
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
- Curix-200 uses `/curix-200-visual-aid.png`.
- Footer contact details are not joined into one line.
- No logo modifications were made.

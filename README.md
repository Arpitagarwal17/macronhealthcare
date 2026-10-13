# Macron Health Care Website

A Next.js, TypeScript, Tailwind CSS website for Macron Health Care company information, Product Portfolio downloads, and Visual Aid Portfolio presentations.

## Add a product photo or visual aid

Product packaging photos belong in `public/product-photos/` and the product's
`productImages` array in `data/products.ts` (source path, width, height and label).
They appear in the homepage portfolio, Product Portfolio cards and product details.
Leave `productImages` unset when no photo has been provided; do not substitute a
visual aid. Emifurt-500, M-TROX 1500 SB and Molly-Forte injection currently have
blank product photo areas.

Keep each strength as a separate product. ETR-90/120, Metoron-XL-25/50 and
Vtrocef-250/500 each have two entries with individual photos and a shared visual
aid within the pair. Visual Aid Portfolio, basket and exports use `visualAidImage`.

For a visual aid:

1. Add the product visual-aid image to `public/visual-aids/`.
2. Use a lowercase JPEG filename with hyphens, for example `rabron-dsr.jpg`.
3. Keep the original visual-aid aspect ratio. The website displays images with `object-contain` so they are not cropped.
4. Use a new, versioned filename when replacing deployed artwork instead of
   overwriting an existing path; optimized images are cached long-term by the CDN.

## Add product data

Add a matching entry in `data/products.ts`.

```ts
{
  slug: "rabron-dsr",
  brandName: "Rabron-DSR",
  composition: "Composition to be added",
  dosageForm: "Dosage form to be added",
  productImages: [{
    src: "/product-photos/rabron-dsr.jpg",
    width: 3342,
    height: 1882,
    label: "Rabron-DSR Capsules",
  }],
  visualAidImage: "/visual-aids/rabron-dsr.jpg",
  visualAidWidth: 1672,
  visualAidHeight: 941,
}
```

Only add manually confirmed product data. If composition is not manually provided, use `Composition to be added`. If dosage form is not clear, use `Dosage form to be added`.

## Update downloadable PDFs

Replace these files when new PDFs are ready:

- `public/assets/pdfs/macron-product-card.pdf` for Product Card
- `public/downloads/macron-healthcare-updated-mrp-list-2026.pdf` for Product List

The Product Portfolio page uses direct download links for both files, configured
in `data/downloads.ts`. Bump their version query when replacing a PDF. The current
files are the supplied five-page old-style Product Card and three-page MRP List.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. If that port is busy, use the local URL printed by Next.js.

## Deploy on Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Deploy with the default build command, `npm run build`.

## Build the Android app

The Android app loads the production website and adds native file sharing,
hardware Back handling, splash-screen behavior, and an offline error page.
Building requires JDK 21 with `JAVA_HOME` configured and an Android SDK.

```bash
npm run android:sync
npm run android:apk
```

For a signed Play Store bundle:

1. Create a private release keystore.
2. Copy `android/keystore.properties.example` to
   `android/keystore.properties` and replace every example value.
3. Store the keystore at the configured `storeFile` path. Neither file is
   tracked by Git.
4. Choose a new integer `VERSION_CODE` for every Play upload and a user-facing
   version name.
5. Run `cd android` and then
   `gradlew.bat bundleRelease -PVERSION_CODE=2 -PVERSION_NAME=1.1.0`.

The release task intentionally fails when signing credentials or a release
version code are absent, so an unsigned or duplicate-version bundle cannot be
mistaken for a Play-ready artifact.

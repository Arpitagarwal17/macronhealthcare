# Macron Health Care Website

A Next.js, TypeScript, Tailwind CSS website for Macron Health Care company information, Product List / Card downloads, and Visual Aids.

## Add a new product image

1. Add the product visual-aid image to `public/visual-aids/`.
2. Use a lowercase filename with hyphens, for example `rabron-dsr.png`.
3. Keep the original visual-aid aspect ratio. The website displays images with `object-contain` so they are not cropped.

## Add product data

Add a matching entry in `data/products.ts`.

```ts
{
  slug: "rabron-dsr",
  brandName: "Rabron-DSR",
  composition: "Composition to be added",
  dosageForm: "Dosage form to be added",
  visualAidImage: "/visual-aids/rabron-dsr.png",
}
```

Only add manually confirmed product data. If composition is not manually provided, use `Composition to be added`. If dosage form is not clear, use `Dosage form to be added`.

## Update downloadable PDFs

Replace these files when new PDFs are ready:

- `public/assets/pdfs/macron-product-card.pdf` for Product Card
- `public/downloads/macron-product-list-2026 (1)(1).pdf` for Product List

The Product List / Card page uses direct download links for both files.

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

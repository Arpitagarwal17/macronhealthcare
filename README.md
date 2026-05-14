# Macron Health Care Website

A Next.js, TypeScript, Tailwind CSS website for Macron Health Care company information and product visual-aid display.

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

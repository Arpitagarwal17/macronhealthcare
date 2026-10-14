export type ProductPhoto = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export type Product = {
  slug: string;
  brandName: string;
  composition: string;
  dosageForm: string;
  productImages?: ProductPhoto[];
  visualAidImage: string;
  visualAidWidth?: number;
  visualAidHeight?: number;
};

export const products: Product[] = [
  {
    slug: "apcon",
    brandName: "Apcon",
    composition:
      "Each 5 ml: Sorbitol Solution 70% 3.575 gm + Tricholine Citrate 275 mg + Cyproheptadine 2 mg (Sugar Free)",
    dosageForm: "Syrup",
    productImages: [
      {
        src: "/product-photos/apcon-200ml.jpg",
        width: 1671,
        height: 941,
        label: "Apcon Syrup",
      },
    ],
    visualAidImage: "/visual-aids/apcon.jpg",
  },
  {
    slug: "cloper",
    brandName: "Cloper",
    composition: "Chlordiazepoxide 10 mg + Trifluoperazine HCl 1 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/cloper.jpg",
        width: 3344,
        height: 1882,
        label: "Cloper Tablets",
      },
    ],
    visualAidImage: "/visual-aids/cloper.jpg",
  },
  {
    slug: "curix-200",
    brandName: "Curix-200",
    composition:
      "Cefixime 200 mg + Lactobacillus 60 Million Spores",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/curix-200.jpg",
        width: 3344,
        height: 1882,
        label: "Curix-200 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/curix-200.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "curix-oc",
    brandName: "Curix-OC",
    composition: "Cefixime 200 mg + Ofloxacin 200 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/curix-oc.jpg",
        width: 3344,
        height: 1882,
        label: "Curix-OC Tablets",
      },
    ],
    visualAidImage: "/visual-aids/curix-oc.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "drt",
    brandName: "DRT",
    composition: "Drotaverine HCl 80 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/drt.jpg",
        width: 3344,
        height: 1882,
        label: "DRT Tablets",
      },
    ],
    visualAidImage: "/visual-aids/drt.jpg",
  },
  {
    slug: "drt-plus",
    brandName: "DRT-PLUS",
    composition: "Drotaverine HCl 80 mg + Mefenamic Acid 250 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/drt-plus.jpg",
        width: 3344,
        height: 1882,
        label: "DRT-PLUS Tablets",
      },
    ],
    visualAidImage: "/visual-aids/drt-plus.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "ecitron-plus",
    brandName: "Ecitron-Plus",
    composition: "Escitalopram Oxalate 10 mg + Clonazepam 0.5 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/ecitron-plus.jpg",
        width: 3344,
        height: 1882,
        label: "Ecitron-Plus Tablets",
      },
    ],
    visualAidImage: "/visual-aids/ecitron-plus.jpg",
  },
  {
    slug: "emifurt-500",
    brandName: "Emifurt-500",
    composition: "Amikacin 500 mg",
    dosageForm: "Injection",
    visualAidImage: "/visual-aids/emifurt-500-v2.jpg",
    visualAidWidth: 1672,
    visualAidHeight: 941,
  },
  {
    slug: "etr-90",
    brandName: "ETR-90",
    composition: "Etoricoxib 90 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/etr-90.jpg",
        width: 3346,
        height: 1880,
        label: "ETR-90 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/etr-90-120.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 853,
  },
  {
    slug: "etr-120",
    brandName: "ETR-120",
    composition: "Etoricoxib 120 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/etr-120.jpg",
        width: 3344,
        height: 1882,
        label: "ETR-120 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/etr-90-120.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 853,
  },
  {
    slug: "etr-plus",
    brandName: "ETR-PLUS",
    composition: "Etoricoxib 60 mg + Paracetamol 325 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/etr-plus.jpg",
        width: 3344,
        height: 1882,
        label: "ETR-PLUS Tablets",
      },
    ],
    visualAidImage: "/visual-aids/etr-plus.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "etr-th",
    brandName: "ETR-TH",
    composition: "Etoricoxib 60 mg + Thiocolchicoside 4 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/etr-th.jpg",
        width: 3344,
        height: 1882,
        label: "ETR-TH Tablets",
      },
    ],
    visualAidImage: "/visual-aids/etr-th.jpg",
  },
  {
    slug: "ferronica-syrup",
    brandName: "Ferronica-XT",
    composition:
      "Each 5 ml: Ferrous Ascorbate 100 mg + Zinc Sulphate 22.5 mg + Folic Acid 200 mcg + Vitamin B12 (Cyanocobalamin) 1 mcg + Vitamin B2 (Riboflavin) 1.5 mg + Biotin 10 mcg + DHA 500 mcg",
    dosageForm: "Suspension",
    productImages: [
      {
        src: "/product-photos/ferronica-xt-200ml-20261014.jpg",
        width: 1672,
        height: 941,
        label: "Ferronica-XT 200 ml Suspension",
      },
    ],
    visualAidImage: "/visual-aids/ferronica-xt-20261014-v2.jpg",
  },
  {
    slug: "ferronica-drop",
    brandName: "Ferronica Drops",
    composition:
      "Each ml (approx. 20 drops): Ferrous Ascorbate 10 mg + Folic Acid 100 mcg",
    dosageForm: "Drops",
    productImages: [
      {
        src: "/product-photos/ferronica-drops-15ml.jpg",
        width: 1672,
        height: 941,
        label: "Ferronica Drops",
      },
    ],
    visualAidImage: "/visual-aids/ferronica-drop.jpg",
  },
  {
    slug: "flt-20",
    brandName: "FLT-20",
    composition:
      "Fluoxetine HCl 20 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/flt-20.jpg",
        width: 3344,
        height: 1882,
        label: "FLT-20 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/flt-20.jpg",
  },
  {
    slug: "furakast-l",
    brandName: "Furakast-L",
    composition:
      "Levocetirizine 5 mg + Montelukast Sodium 10 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/furakast-l.jpg",
        width: 3344,
        height: 1882,
        label: "Furakast-L Tablets",
      },
    ],
    visualAidImage: "/visual-aids/furakast-l.jpg",
  },
  {
    slug: "gabonza-m",
    brandName: "Gabonza-M",
    composition: "Gabapentin 300 mg + Methylcobalamin 500 mcg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/gabonza-m.jpg",
        width: 1672,
        height: 941,
        label: "Gabonza-M Tablets",
      },
    ],
    visualAidImage: "/visual-aids/gabonza-m.jpg",
  },
  {
    slug: "heptamac",
    brandName: "Heptamac",
    composition:
      "Each 5 ml Aqueous Extract: Bhui Amla 400 mg + Kalmegh 125 mg + Bhringraj 250 mg + Kutki 60 mg + Kasni 350 mg + Punarnava 300 mg + Daru Haldi 100 mg + Surpunkha 250 mg + Haritaki 200 mg + Guduchi 125 mg + Tulsi 100 mg (Ayurvedic, Sugar Free)",
    dosageForm: "Ayurvedic Liver Tonic",
    productImages: [
      {
        src: "/product-photos/hepta-mac-200ml.jpg",
        width: 1672,
        height: 941,
        label: "Hepta-Mac DS Ayurvedic Liver Tonic",
      },
    ],
    visualAidImage: "/visual-aids/heptamac.jpg",
  },
  {
    slug: "lycron-cap",
    brandName: "Lycron",
    composition:
      "Lycopene 10% 4000 mcg + Lutein 10% 4000 mcg + Beta Carotene 30% 5.17 mg + Zinc Sulphate Monohydrate 10 mg + Selenium Dioxide Monohydrate 25 mcg + Black Grape Seed Extract 10 mg",
    dosageForm: "Soft Gelatin Capsules",
    productImages: [
      {
        src: "/product-photos/lycron.jpg",
        width: 1672,
        height: 941,
        label: "Lycron Soft Gelatin Capsules",
      },
    ],
    visualAidImage: "/visual-aids/lycron-cap.jpg",
  },
  {
    slug: "lycron-syrup",
    brandName: "Lycron",
    composition:
      "Each 5 ml: L-Lysine HCl 10 mg + Vit C 10 mg + Niacinamide 8 mg + Zinc Sulphate 5 mg + Vit B5 1.6 mg + Vit B2 1.2 mg + Vit B1 1.1 mg + Vit B6 1 mg + Manganese 0.5 mg + Copper 0.1 mg + Lycopene 10% 1000 mcg + Folic Acid 200 mcg + Selenium 100 mcg + Iodide 20 mcg + Vit B12 1 mcg + Vit A 1000 IU + Vit E 5 IU",
    dosageForm: "Syrup",
    productImages: [
      {
        src: "/product-photos/lycron-syrup-200ml.jpg",
        width: 3344,
        height: 1882,
        label: "Lycron Syrup",
      },
    ],
    visualAidImage: "/visual-aids/lycron-syrup.jpg",
  },
  {
    slug: "m-trox-1500-sb",
    brandName: "M-TROX 1500 SB",
    composition: "Ceftriaxone Sodium 1000 mg + Sulbactam Sodium 500 mg",
    dosageForm: "Injection",
    visualAidImage: "/visual-aids/m-trox-1500-sb.jpg",
  },
  {
    slug: "maclo-p",
    brandName: "Maclo-P",
    composition: "Aceclofenac 100 mg + Paracetamol 325 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/maclo-p.jpg",
        width: 1672,
        height: 941,
        label: "Maclo-P Tablets",
      },
    ],
    visualAidImage: "/visual-aids/maclo-p.jpg",
  },
  {
    slug: "maclo-th",
    brandName: "Maclo-TH",
    composition: "Aceclofenac 100 mg + Thiocolchicoside 4 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/maclo-th.jpg",
        width: 3344,
        height: 1882,
        label: "Maclo-TH Tablets",
      },
    ],
    visualAidImage: "/visual-aids/maclo-th.jpg",
  },
  {
    slug: "maclodase-p",
    brandName: "Maclodase-P",
    composition:
      "Aceclofenac 100 mg + Paracetamol 325 mg + Serratiopeptidase 15 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/maclodase-p.jpg",
        width: 3344,
        height: 1882,
        label: "Maclodase-P Tablets",
      },
    ],
    visualAidImage: "/visual-aids/maclodase-p.jpg",
  },
  {
    slug: "macrifa-400",
    brandName: "Macrifa-400",
    composition: "Rifaximin 400 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/macrifa-400.jpg",
        width: 1672,
        height: 941,
        label: "Macrifa-400 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/macrifa-400.jpg",
  },
  {
    slug: "macron-oil-60-ml",
    brandName: "Macron Oil",
    composition:
      "Peppermint (Mentha arvensis) 7% w/v + Kapura 7% w/v + Gandhapura 12% w/v + Nilgiri 7% w/v + Lavang 1% w/v + Dalchini 1% w/v + Pudina 1% w/v + Water Miscible Base q.s.",
    dosageForm: "Ayurvedic Pain Relief Oil",
    productImages: [
      {
        src: "/product-photos/macron-oil.jpg",
        width: 3344,
        height: 1882,
        label: "Macron Oil Ayurvedic Pain Relief Oil",
      },
    ],
    visualAidImage: "/visual-aids/macron-oil-60-ml.jpg",
  },
  {
    slug: "macron-cv-457",
    brandName: "MACRON-CV 457",
    composition:
      "Each 5 ml: Amoxycillin 400 mg + Clavulanic Acid 57 mg",
    dosageForm: "Dry Syrup",
    productImages: [
      {
        src: "/product-photos/macron-cv-457-30ml.jpg",
        width: 1672,
        height: 940,
        label: "MACRON-CV 457 Dry Syrup",
      },
    ],
    visualAidImage: "/visual-aids/macron-cv-457.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "macron-cv-625",
    brandName: "MACRON-CV 625",
    composition:
      "Amoxycillin 500 mg + Clavulanic Acid 125 mg + Lactobacillus Spores",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/macron-cv-625-lb.jpg",
        width: 3344,
        height: 1882,
        label: "Macron-CV 625 LB Tablets",
      },
    ],
    visualAidImage: "/visual-aids/macron-cv-625.jpg",
  },
  {
    slug: "macron-pro",
    brandName: "Macron-Pro",
    composition:
      "Per 100 g: Protein (Skimmed Milk Powder) 20 g + DHA 50 mg + Calcium 21 mg + Iron 10 mg + Magnesium 10 mg + Potassium 5 mg + Zinc 5 mg + Niacinamide 15 mg + L-Lysine 10 mg + Vitamin B1 3 mg + Vitamin B2 2.5 mg + Vitamin B6 1 mg + Vitamin E 500 mcg + Folic Acid 400 mcg + Vitamin D3 500 I.U. + Vitamin A 500 I.U.",
    dosageForm: "Protein Powder",
    productImages: [
      {
        src: "/product-photos/macron-pro.jpg",
        width: 3342,
        height: 1882,
        label: "Macron-Pro Protein Powder",
      },
    ],
    visualAidImage: "/visual-aids/macron-pro.jpg",
  },
  {
    slug: "macroncal",
    brandName: "Macroncal",
    composition:
      "Calcium Citrate Malate 1000 mg + Magnesium 150 mg + L-Lysine 25 mg + Zinc 5 mg + Boron Proteonate 1 mg + Copper 1 mg + Selenium 35 mcg + Vitamin D 600 I.U.",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/macroncal.jpg",
        width: 3344,
        height: 1882,
        label: "Macroncal Tablets",
      },
    ],
    visualAidImage: "/visual-aids/macroncal-2026-v2.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "macroncal-drop",
    brandName: "Macroncal Drops",
    composition:
      "Each 0.5 ml contains: Vitamin D3 (Cholecalciferol) 800 I.U.",
    dosageForm: "Drops",
    productImages: [
      {
        src: "/product-photos/macroncal-d3-30ml.jpg",
        width: 3342,
        height: 1882,
        label: "Macroncal Drops",
      },
    ],
    visualAidImage: "/visual-aids/macroncal-drop.jpg",
  },
  {
    slug: "macroncef-200",
    brandName: "Macroncef-200",
    composition:
      "Cefpodoxime Proxetil Dispersible 200 mg",
    dosageForm: "Dispersible Tablets",
    productImages: [
      {
        src: "/product-photos/macroncef-200.jpg",
        width: 1672,
        height: 941,
        label: "Macroncef-200 Dispersible Tablets",
      },
    ],
    visualAidImage: "/visual-aids/macroncef-200.jpg",
    visualAidWidth: 1280,
    visualAidHeight: 720,
  },
  {
    slug: "macroncef-50",
    brandName: "Macroncef-50",
    composition:
      "Each 5 ml: Cefpodoxime Proxetil 50 mg",
    dosageForm: "Dry Syrup",
    productImages: [
      {
        src: "/product-photos/macroncef-50-30ml.jpg",
        width: 1672,
        height: 941,
        label: "Macroncef-50 Dry Syrup",
      },
    ],
    visualAidImage: "/visual-aids/macroncef-50.jpg",
  },
  {
    slug: "macronliv-300",
    brandName: "Macronliv-300",
    composition: "Ursodeoxycholic Acid 300 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/macronliv-300.jpg",
        width: 1672,
        height: 941,
        label: "Macronliv-300 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/macronliv-300.jpg",
  },
  {
    slug: "mactuss",
    brandName: "Mactuss",
    composition:
      "Each 5 ml: Dextromethorphan HBr 10 mg + Phenylephrine HCl 5 mg + Chlorpheniramine Maleate 2 mg (Sugar Free)",
    dosageForm: "Cough Syrup",
    productImages: [
      {
        src: "/product-photos/mactuss.jpg",
        width: 1672,
        height: 941,
        label: "Mactuss Cough Syrup",
      },
    ],
    visualAidImage: "/visual-aids/mactuss.jpg",
  },
  {
    slug: "metoron-xl-25",
    brandName: "Metoron-XL-25",
    composition: "Metoprolol Succinate equivalent to Metoprolol Tartrate 25 mg",
    dosageForm: "Extended Release Tablets",
    productImages: [
      {
        src: "/product-photos/metoron-xl-25.jpg",
        width: 3344,
        height: 1882,
        label: "Metoron-XL-25 Extended Release Tablets",
      },
    ],
    visualAidImage: "/visual-aids/metoron.jpg",
  },
  {
    slug: "metoron-xl-50",
    brandName: "Metoron-XL-50",
    composition: "Metoprolol Succinate equivalent to Metoprolol Tartrate 50 mg",
    dosageForm: "Extended Release Tablets",
    productImages: [
      {
        src: "/product-photos/metoron-xl-50.jpg",
        width: 3344,
        height: 1882,
        label: "Metoron-XL-50 Extended Release Tablets",
      },
    ],
    visualAidImage: "/visual-aids/metoron.jpg",
  },
  {
    slug: "molly-forte-injection",
    brandName: "Molly-Forte",
    composition: "Methylcobalamin 1500 mcg",
    dosageForm: "Injection Dispo Pack",
    visualAidImage: "/visual-aids/molly-forte-injection.jpg",
  },
  {
    slug: "molly-forte-tablet",
    brandName: "Molly-Forte",
    composition:
      "Mecobalamin 1500 mcg + Alpha Lipoic Acid 100 mg + Vitamin D3 1000 IU + Pyridoxine Hydrochloride 3 mg + Folic Acid 1.5 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/molly-forte.jpg",
        width: 3342,
        height: 1882,
        label: "Molly-Forte Tablets",
      },
    ],
    visualAidImage: "/visual-aids/molly-forte-tablet-2026-v2.jpg",
    visualAidWidth: 1672,
    visualAidHeight: 941,
  },
  {
    slug: "myflez",
    brandName: "Myflez",
    composition: "Deflazacort 6 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/myflez-6.jpg",
        width: 3344,
        height: 1882,
        label: "Myflez-6 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/myflez.jpg",
  },
  {
    slug: "myorab-dsr",
    brandName: "Myorab-DSR",
    composition:
      "Rabeprazole Sodium 20 mg (Gastro-resistant pellets) + Domperidone 10 mg (Immediate Release) + Domperidone 20 mg (Sustained Release)",
    dosageForm: "Capsules",
    productImages: [
      {
        src: "/product-photos/myorab-dsr.jpg",
        width: 3344,
        height: 1882,
        label: "Myorab-DSR Capsules",
      },
    ],
    visualAidImage: "/visual-aids/myorab-dsr.jpg",
  },
  {
    slug: "myotral",
    brandName: "Myotral",
    composition:
      "Calcitriol 0.25 mcg + Calcium Carbonate 500 mg + Zinc Sulphate Monohydrate 7.50 mg",
    dosageForm: "Soft Gelatin Capsules",
    productImages: [
      {
        src: "/product-photos/myotral.jpg",
        width: 1672,
        height: 941,
        label: "Myotral Soft Gelatin Capsules",
      },
    ],
    visualAidImage: "/visual-aids/myotral.jpg",
  },
  {
    slug: "myotral-k27",
    brandName: "Myotral-K27",
    composition:
      "Calcitriol 0.25 mcg + Calcium Carbonate 500 mg + Zinc Sulphate 7.5 mg + Magnesium 50 mg + Vitamin K27 45 mcg + Methylcobalamin 1500 mcg + L-Methyl Folate 800 mcg",
    dosageForm: "Soft Gelatin Capsules",
    productImages: [
      {
        src: "/product-photos/myotral-k27.jpg",
        width: 3344,
        height: 1882,
        label: "Myotral-K27 Soft Gelatin Capsules",
      },
    ],
    visualAidImage: "/visual-aids/myotral-k27.jpg",
  },
  {
    slug: "nimtek-p",
    brandName: "Nimtek-P",
    composition: "Nimesulide 100 mg + Paracetamol 325 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/nimtek-p.jpg",
        width: 3344,
        height: 1882,
        label: "Nimtek-P Tablets",
      },
    ],
    visualAidImage: "/visual-aids/nimtek-p.jpg",
  },
  {
    slug: "nucis-plus",
    brandName: "Nucis-Plus",
    composition:
      "Cissus Quadrangularis 750 mg + Moringa Oleifera 100 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/nucis-plus.jpg",
        width: 1672,
        height: 941,
        label: "Nucis-Plus Tablets",
      },
    ],
    visualAidImage: "/visual-aids/nucis-plus.jpg",
  },
  {
    slug: "ppday",
    brandName: "PP-DAY",
    composition:
      "Instant Energy & Immunity Booster Powder (Refreshing Orange Flavour). Each 25 g sachet contains: Energy 95 kcal + Carbohydrate 24.5 g + Zinc Sulphate 10 mg + Magnesium Sulphate 2.5 mg + Vitamin C 25 mg + Vitamin D3 75 I.U. + Vitamin B1 0.5 mg + Vitamin B2 0.37 mg + Vitamin B6 0.5 mg + Cyanocobalamin 1.75 mcg + Creatine 100 mg + Potassium Citrate 25 mg + Calcium Citrate 125 mg",
    dosageForm: "Powder",
    productImages: [
      {
        src: "/product-photos/ppday-25g.jpg",
        width: 1672,
        height: 941,
        label: "PP-DAY Powder",
      },
    ],
    visualAidImage: "/visual-aids/ppday.jpg",
  },
  {
    slug: "ppzol-dsr",
    brandName: "PPZOL-DSR",
    composition:
      "Pantoprazole Sodium 40 mg + Domperidone Sustained Release 30 mg",
    dosageForm: "Sustained Release Capsules",
    productImages: [
      {
        src: "/product-photos/ppzol-dsr.jpg",
        width: 1672,
        height: 941,
        label: "PPZOL-DSR Sustained Release Capsules",
      },
    ],
    visualAidImage: "/visual-aids/ppzol-dsr.jpg",
  },
  {
    slug: "propra-az",
    brandName: "Propra-AZ",
    composition:
      "Propranolol HCl 20 mg + Alprazolam 0.25 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/propra-az.jpg",
        width: 1671,
        height: 941,
        label: "Propra-AZ Tablets",
      },
    ],
    visualAidImage: "/visual-aids/propra-az.jpg",
  },
  {
    slug: "rabiday-dsr",
    brandName: "Rabiday-DSR",
    composition:
      "Rabeprazole Sodium 20 mg (Gastro-resistant pellets) + Domperidone 10 mg (Immediate Release) + Domperidone 20 mg (Sustained Release)",
    dosageForm: "Capsules",
    productImages: [
      {
        src: "/product-photos/rabiday-dsr.jpg",
        width: 3344,
        height: 1882,
        label: "Rabiday-DSR Capsules",
      },
    ],
    visualAidImage: "/visual-aids/rabiday-dsr.jpg",
  },
  {
    slug: "rabron-d",
    brandName: "Rabron-D",
    composition: "Rabeprazole 20 mg + Domperidone 10 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/rabron-d.jpg",
        width: 3344,
        height: 1882,
        label: "Rabron-D Tablets",
      },
    ],
    visualAidImage: "/visual-aids/rabron-d.jpg",
  },
  {
    slug: "rabron-dsr",
    brandName: "Rabron-DSR",
    composition:
      "Rabeprazole 20 mg + Domperidone Sustained Release 30 mg",
    dosageForm: "Sustained Release Capsules",
    productImages: [
      {
        src: "/product-photos/rabron-dsr.jpg",
        width: 3342,
        height: 1882,
        label: "Rabron-DSR Sustained Release Capsules",
      },
    ],
    visualAidImage: "/visual-aids/rabron-dsr.jpg",
  },
  {
    slug: "ravista-m",
    brandName: "Ravista-M",
    composition: "Flupentixol 0.5 mg + Melitracen 10 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/ravista-m.jpg",
        width: 3344,
        height: 1882,
        label: "Ravista-M Tablets",
      },
    ],
    visualAidImage: "/visual-aids/ravista-m.jpg",
  },
  {
    slug: "turpiron",
    brandName: "Turpiron",
    composition: "Curcumin 100 mg + Turmeric Root Powder 200 mg + Piperine 95% 10 mg",
    dosageForm: "Ayurvedic Capsule",
    productImages: [
      {
        src: "/product-photos/turpiron.jpg",
        width: 1672,
        height: 941,
        label: "Turpiron Ayurvedic Capsule",
      },
    ],
    visualAidImage: "/visual-aids/turpiron.jpg",
  },
  {
    slug: "vertitop-16",
    brandName: "Vertitop-16",
    composition: "Betahistine Dihydrochloride 16 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/vertitop-16.jpg",
        width: 3344,
        height: 1882,
        label: "Vertitop-16 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/vertitop-16.jpg",
  },
  {
    slug: "vitabank-tablets",
    brandName: "Vitabank",
    composition:
      "Magnesium 100 mg + Vitamin C 60 mg + Grape Seed Extract 50% 50 mg + Vitamin B3 11 mg + Zinc 10 mg + Iron 10 mg + Vitamin E 10 mg + Vitamin B5 5 mg + Vitamin B2 1.6 mg + Vitamin B6 1.5 mg + Vitamin B1 1.4 mg + Manganese 2 mg + Copper 1 mg + Vitamin A 600 mcg + Folic Acid 200 mcg + Iodine 100 mcg + Chromium 25 mcg + Selenium 40 mcg + Biotin 30 mcg + Vitamin D3 (As Lichen) 600 I.U. + Vitamin B12 2.2 mcg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/vitabank.jpg",
        width: 3344,
        height: 1882,
        label: "Vitabank Tablets",
      },
    ],
    visualAidImage: "/visual-aids/vitabank-tablets-2026-v2.jpg",
    visualAidWidth: 1672,
    visualAidHeight: 941,
  },
  {
    slug: "vtrocef-250",
    brandName: "Vtrocef-250",
    composition: "Cefuroxime Axetil equivalent to Cefuroxime 250 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/vtrocef-250.jpg",
        width: 1672,
        height: 941,
        label: "Vtrocef-250 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/vtrocef.jpg",
  },
  {
    slug: "vtrocef-500",
    brandName: "Vtrocef-500",
    composition: "Cefuroxime Axetil equivalent to Cefuroxime 500 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/vtrocef-500.jpg",
        width: 1672,
        height: 941,
        label: "Vtrocef-500 Tablets",
      },
    ],
    visualAidImage: "/visual-aids/vtrocef.jpg",
  },
  {
    slug: "walex",
    brandName: "Walex",
    composition: "Serratiopeptidase 10 mg + Diclofenac Potassium 50 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/walex.jpg",
        width: 3344,
        height: 1882,
        label: "Walex Tablets",
      },
    ],
    visualAidImage: "/visual-aids/walex.jpg",
  },
  {
    slug: "walex-p",
    brandName: "Walex-P",
    composition:
      "Serratiopeptidase 10 mg + Diclofenac Potassium 50 mg + Paracetamol 325 mg",
    dosageForm: "Tablets",
    productImages: [
      {
        src: "/product-photos/walex-p.jpg",
        width: 1672,
        height: 941,
        label: "Walex-P Tablets",
      },
    ],
    visualAidImage: "/visual-aids/walex-p.jpg",
  },
  {
    slug: "zymopan",
    brandName: "Zymopan",
    composition:
      "Each 5 ml: Diastase (1:1200) 50 mg + Pepsin (1:3000) 10 mg",
    dosageForm: "Syrup",
    productImages: [
      {
        src: "/product-photos/zymopan-200ml.jpg",
        width: 3342,
        height: 1882,
        label: "Zymopan Syrup",
      },
    ],
    visualAidImage: "/visual-aids/zymopan.jpg",
  },
];

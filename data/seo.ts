export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.macronhealthcare.com";

export const SITE_LAST_UPDATED = new Date();

export const SEO_KEYWORDS = [
  "Macron Health Care",
  "Macron Healthcare",
  "pharmaceutical company in India",
  "Indian pharmaceutical company",
  "branded pharmaceutical formulations",
  "pharmaceutical products India",
  "healthcare products India",
];

export const HOME_TITLE =
  "Macron Health Care | Pharmaceutical Company in India";

export const HOME_DESCRIPTION =
  "Macron Health Care is an Indian pharmaceutical company offering branded formulations across multiple therapeutic areas, trusted since 1999.";

export const OG_TITLE = HOME_TITLE;

export const OG_DESCRIPTION = HOME_DESCRIPTION;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

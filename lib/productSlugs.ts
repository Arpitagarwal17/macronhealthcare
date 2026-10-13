// Keep saved tablet selections after the Myovit rename. The former Vitabank
// capsule is discontinued and must not become a tablet selection implicitly.
const renamedSlugs: Record<string, string> = {
  myovit: "vitabank-tablets",
  // A saved family selection keeps its shared visual aid once after splitting
  // the catalogue into strengths, through the first strength in that family.
  etr: "etr-90",
  metoron: "metoron-xl-25",
  vtrocef: "vtrocef-250",
};

export function normalizeProductSlugs(slugs: unknown[]): string[] {
  return [...new Set(slugs.flatMap((slug) => {
    if (typeof slug !== "string" || !slug.trim() || slug === "vitabank") {
      return [];
    }
    return [renamedSlugs[slug] ?? slug];
  }))];
}

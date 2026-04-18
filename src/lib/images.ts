export const ASSETS = {
  hero: "/images/hero-gift.svg",
  heroSecondary: "/images/marwar.svg",
  artisan: "/images/artisan.svg",
  marwar: "/images/marwar.svg",
  textileStack: "/images/textile-stack.svg",
  fragrance: "/images/fragrance.svg",
  monogram: "/images/monogram.svg",
  curations: [
    "/images/curation-1.svg",
    "/images/curation-2.svg",
    "/images/curation-3.svg",
    "/images/curation-4.svg",
  ],
  craft: "/images/placeholder-decor.svg",
  textile: "/images/placeholder-accessories.svg",
  pottery: "/images/placeholder-decor.svg",
  workshop: "/images/hero-gift.svg",
  placeholders: {
    product: "/images/placeholder-product.svg",
    decor: "/images/placeholder-decor.svg",
    accessories: "/images/placeholder-accessories.svg",
    art: "/images/placeholder-art.svg",
  }
};

export const getPlaceholderImage = (category?: string) => {
  const cat = category?.toLowerCase();
  if (cat?.includes("decor")) return ASSETS.placeholders.decor;
  if (cat?.includes("access")) return ASSETS.placeholders.accessories;
  if (cat?.includes("art")) return ASSETS.placeholders.art;
  return ASSETS.placeholders.product;
};

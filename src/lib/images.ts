export const ASSETS = {
  hero: "/images/hero-gift.jpeg",
  heroSecondary: "/images/marwar.jpeg",
  artisan: "/images/artisan.jpeg",
  marwar: "/images/marwar.jpeg",
  textileStack: "/images/textile-stack.jpeg",
  fragrance: "/images/fragrance.jpeg",
  monogram: "/images/monogram.jpeg",
  curations: [
    "/images/curation-1.jpeg",
    "/images/curation-2.jpeg",
    "/images/curation-3.jpeg",
    "/images/curation-4.jpeg",
  ],
  craft: "/images/placeholder-decor.jpeg",
  textile: "/images/placeholder-accessories.jpeg",
  pottery: "/images/placeholder-decor.jpeg",
  workshop: "/images/hero-gift.jpeg",
  placeholders: {
    product: "/images/placeholder-product.jpeg",
    decor: "/images/placeholder-decor.jpeg",
    accessories: "/images/placeholder-accessories.jpeg",
    art: "/images/placeholder-art.jpeg",
  }
};

export const getPlaceholderImage = (category?: string) => {
  const cat = category?.toLowerCase();
  if (cat?.includes("decor")) return ASSETS.placeholders.decor;
  if (cat?.includes("access")) return ASSETS.placeholders.accessories;
  if (cat?.includes("art")) return ASSETS.placeholders.art;
  return ASSETS.placeholders.product;
};

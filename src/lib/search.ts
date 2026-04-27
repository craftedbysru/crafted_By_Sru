import Fuse from "fuse.js";

/**
 * Product search utility with typo tolerance
 */
export function searchProducts(products: any[], query: string) {
  if (!query) return products;

  const options = {
    keys: [
      { name: "name", weight: 0.7 },
      { name: "description", weight: 0.3 },
      { name: "category", weight: 0.2 }
    ],
    threshold: 0.3, // Slightly stricter typo tolerance
    includeScore: true
  };

  const fuse = new Fuse(products, options);
  const result = fuse.search(query);
  return result.map(r => r.item);
}

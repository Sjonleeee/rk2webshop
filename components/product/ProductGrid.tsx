import ProductCard from "./ProductCard";

interface ProductImage {
  url: string;
  altText: string | null;
}

interface ProductVariant {
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
  quantityAvailable: number;
}

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  productType: string;
  images: {
    edges: { node: ProductImage }[];
  };
  variants: {
    edges: { node: ProductVariant }[];
  };
}

interface ProductEdge {
  node: ProductNode;
}

interface ProductGridProps {
  products: ProductEdge[];
  selectedCategory: string | null;
}

export default function ProductGrid({
  products,
  selectedCategory,
}: ProductGridProps) {
  // Sorteer zodat producten van hetzelfde type (productType) bij elkaar staan
  const sortedProducts = [...products].sort((a, b) => {
    const typeA = a.node.productType?.toLowerCase() || "";
    const typeB = b.node.productType?.toLowerCase() || "";

    if (typeA < typeB) return -1;
    if (typeA > typeB) return 1;

    // Als type gelijk is, sorteer op titel
    const titleA = a.node.title.toLowerCase();
    const titleB = b.node.title.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  });

  // Houd bij voor welk type we al een anchor hebben gezet,
  // zodat we bij elke category een scroll-doel hebben.
  const seenTypes = new Set<string>();

  return (
    <div className="grid grid-cols-5 ">
      {sortedProducts.map(({ node }) => {
        const isDimmed =
          selectedCategory &&
          selectedCategory !== "" &&
          node.productType !== selectedCategory;

        const typeKey = node.productType?.toLowerCase() || "";
        const slug = typeKey.replace(/\s+/g, "-");
        const isFirstOfType = !seenTypes.has(typeKey);
        if (isFirstOfType) {
          seenTypes.add(typeKey);
        }

        return (
          <div
            key={node.id}
            id={isFirstOfType ? `category-${slug}` : undefined}
            className={`transition-opacity duration-200 ${
              isDimmed ? "opacity-15" : "opacity-100"
            }`}
          >
            <ProductCard product={node} />
          </div>
        );
      })}
    </div>
  );
}

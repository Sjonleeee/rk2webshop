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
  allProducts?: ProductEdge[];
  hoveredCategory?: string | null;
}

export default function ProductGrid({ products, allProducts, hoveredCategory }: ProductGridProps) {
  // Toon altijd alle producten als hoveredCategory is gezet, anders alleen filtered
  const displayProducts = hoveredCategory && allProducts ? allProducts : products;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-0">
      {displayProducts.map(({ node }) => {
        let opacityClass = "opacity-100";
        // Alleen op sm+ opacity effect
        if (hoveredCategory) {
          opacityClass = node.productType === hoveredCategory
            ? "opacity-100"
            : "sm:opacity-30 opacity-100";
        }
        return (
          <div key={node.id} className={`transition-opacity duration-200 ${opacityClass}`}>
            <ProductCard product={node} />
          </div>
        );
      })}
    </div>
  );
}

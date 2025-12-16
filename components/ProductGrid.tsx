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
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-0">
      {products.map(({ node }) => {
        const isDimmed =
          selectedCategory &&
          selectedCategory !== "" &&
          node.productType !== selectedCategory;
        return (
          <div
            key={node.id}
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

import ProductCard from "./ProductCard";

interface ProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string | null;
    images: {
      edges: { node: { url: string; altText: string | null } }[];
    };
    variants: {
      edges: {
        node: {
          priceV2: { amount: string; currencyCode: string };
          selectedOptions: { name: string; value: string }[];
          quantityAvailable: number;
        };
      }[];
    };
  };
}

interface ProductGridProps {
  products: ProductEdge[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(({ node }) => (
        <ProductCard key={node.id} product={node} />
      ))}
    </div>
  );
}
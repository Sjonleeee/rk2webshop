import { storefront } from "@/lib/shopify/client";
import { PRODUCT_QUERY } from "@/lib/shopify/queries/products";
import ProductDetails from "@/components/product/ProductDetails";

interface ProductPageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // ✅ Next.js 16 compliant
  const { handle } = await params;

  if (!handle) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  const data = await storefront(
    PRODUCT_QUERY,
    { handle },
    { revalidate: 60 }
  );

  const product = data.productByHandle;

  if (!product) {
    return <div className="p-10 text-red-600">Product not found</div>;
  }

  return <ProductDetails product={product} />;
}

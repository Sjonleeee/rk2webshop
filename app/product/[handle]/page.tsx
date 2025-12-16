import { storefront } from "@/lib/shopify";
import { PRODUCT_QUERY } from "@/lib/queries";
import ProductDetails from "@/components/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
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

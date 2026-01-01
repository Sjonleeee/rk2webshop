import { storefront } from "@/lib/shopify/client";
import { GET_PRODUCTS_QUERY } from "@/lib/shopify/queries/products";
import ArchiveSurface from "@/components/archive/ArchiveSurface";
import { ArchiveProduct } from "@/components/archive/types";

/* -----------------------------
   Shopify response typing
------------------------------ */

interface ShopifyImageNode {
  url: string;
  altText?: string | null;
}

interface ShopifyImageEdge {
  node: ShopifyImageNode;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  productType?: string | null;
  images: {
    edges: ShopifyImageEdge[];
  };
}

interface ShopifyProductEdge {
  node: ShopifyProductNode;
}

interface ShopifyProductsResponse {
  products: {
    edges: ShopifyProductEdge[];
  };
}

export default async function ArchivePage() {
  const data = (await storefront(
    GET_PRODUCTS_QUERY,
    {},
    { revalidate: 120 }
  )) as ShopifyProductsResponse;

  const products: ArchiveProduct[] = data.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    productType: node.productType,
    image: node.images.edges[0]?.node
      ? {
          url: node.images.edges[0].node.url,
          altText: node.images.edges[0].node.altText,
        }
      : undefined,
  }));

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      <ArchiveSurface items={products} />
    </section>
  );
}

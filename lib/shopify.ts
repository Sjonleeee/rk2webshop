const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!;
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function storefront(
  query: string,
  variables: Record<string, unknown> = {},
  options?: { revalidate?: number }
) {
  const res = await fetch(`https://${domain}/api/2025-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    // Revalidation goes in fetch options, not GraphQL variables
    ...(options?.revalidate !== undefined ? { next: { revalidate: options.revalidate } } : {}),
  });

  const data = await res.json();
  if (data.errors) {
    console.error("Shopify error:", data.errors);
    throw new Error(`Shopify API error: ${JSON.stringify(data.errors)}`);
  }
  return data.data;
}

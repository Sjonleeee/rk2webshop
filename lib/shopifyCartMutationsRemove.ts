export const REMOVE_FROM_CART_MUTATION = `#graphql
mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                  featuredImage {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

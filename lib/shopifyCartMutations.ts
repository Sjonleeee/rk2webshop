export const CREATE_CART_MUTATION = `#graphql
mutation CreateCart($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) {
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

export const ADD_TO_CART_MUTATION = `#graphql
mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
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

export const GET_CART_QUERY = `#graphql
query GetCart($cartId: ID!) {
  cart(id: $cartId) {
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
}`;

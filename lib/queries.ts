export const GET_PRODUCTS_QUERY = `
  query {
    products(first: 12) {
      edges {
        node {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                priceV2 {
                  amount
                  currencyCode
                }
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            quantityAvailable
            selectedOptions {
              name
              value
            }
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

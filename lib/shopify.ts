import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2025-07",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_TOKEN!,
});

export type ShopifyVariant = {
  id: string;
  title: string;
  quantityAvailable: number;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: Array<{ url: string; altText: string | null }>;
  variants: ShopifyVariant[];
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string };
    product: {
      title: string;
      images: { edges: Array<{ node: { url: string; altText: string | null } }> };
    };
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
};

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 1) {
            edges { node { url altText } }
          }
          variants(first: 30) {
            edges {
              node {
                id
                title
                quantityAvailable
                availableForSale
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText } }
      }
      variants(first: 30) {
        edges {
          node {
            id
            title
            quantityAvailable
            availableForSale
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount }
              product {
                title
                images(first: 1) {
                  edges { node { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($variantId: ID!, $quantity: Int!) {
    cartCreate(input: {
      lines: [{ quantity: $quantity, merchandiseId: $variantId }]
    }) {
      cart { ...CartFields }
    }
  }
`;

const CART_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $variantId: ID!, $quantity: Int!) {
    cartLinesAdd(cartId: $cartId, lines: [{ quantity: $quantity, merchandiseId: $variantId }]) {
      cart { ...CartFields }
    }
  }
`;

const CART_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineId: ID!) {
    cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
      cart { ...CartFields }
    }
  }
`;

const CART_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
      cart { ...CartFields }
    }
  }
`;

const CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) { ...CartFields }
  }
`;

function normalizeProduct(node: Record<string, unknown>): ShopifyProduct {
  const imagesEdges = (
    node.images as { edges: Array<{ node: { url: string; altText: string | null } }> }
  ).edges;
  const variantsEdges = (
    node.variants as {
      edges: Array<{
        node: {
          id: string;
          title: string;
          quantityAvailable: number;
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    }
  ).edges;

  return {
    id: node.id as string,
    handle: node.handle as string,
    title: node.title as string,
    description: node.description as string,
    priceRange: node.priceRange as ShopifyProduct["priceRange"],
    images: imagesEdges.map((e) => e.node),
    variants: variantsEdges.map((e) => e.node),
  };
}

function normalizeCart(cart: Record<string, unknown>): ShopifyCart {
  const linesEdges = (
    cart.lines as { edges: Array<{ node: ShopifyCartLine }> }
  ).edges;
  return {
    id: cart.id as string,
    checkoutUrl: cart.checkoutUrl as string,
    lines: linesEdges.map((e) => e.node),
  };
}

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const { data, errors } = await shopifyClient.request(PRODUCTS_QUERY, {
    variables: { first },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const edges = (
    data as { products: { edges: Array<{ node: Record<string, unknown> }> } }
  ).products.edges;
  return edges.map((e) => normalizeProduct(e.node));
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const { data, errors } = await shopifyClient.request(
    PRODUCT_BY_HANDLE_QUERY,
    { variables: { handle } }
  );
  if (errors) throw new Error(JSON.stringify(errors));
  const node = (data as { productByHandle: Record<string, unknown> | null })
    .productByHandle;
  if (!node) return null;
  return normalizeProduct(node);
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const { data, errors } = await shopifyClient.request(CART_QUERY, {
    variables: { cartId },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const cart = (data as { cart: Record<string, unknown> | null }).cart;
  if (!cart) return null;
  return normalizeCart(cart);
}

export async function createCart(
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  const { data, errors } = await shopifyClient.request(CART_CREATE_MUTATION, {
    variables: { variantId, quantity },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const cart = (data as { cartCreate: { cart: Record<string, unknown> } })
    .cartCreate.cart;
  return normalizeCart(cart);
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<ShopifyCart> {
  const { data, errors } = await shopifyClient.request(CART_ADD_MUTATION, {
    variables: { cartId, variantId, quantity },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const cart = (data as { cartLinesAdd: { cart: Record<string, unknown> } })
    .cartLinesAdd.cart;
  return normalizeCart(cart);
}

export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const { data, errors } = await shopifyClient.request(CART_REMOVE_MUTATION, {
    variables: { cartId, lineId },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const cart = (
    data as { cartLinesRemove: { cart: Record<string, unknown> } }
  ).cartLinesRemove.cart;
  return normalizeCart(cart);
}

export async function updateCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart> {
  const { data, errors } = await shopifyClient.request(CART_UPDATE_MUTATION, {
    variables: { cartId, lineId, quantity },
  });
  if (errors) throw new Error(JSON.stringify(errors));
  const cart = (
    data as { cartLinesUpdate: { cart: Record<string, unknown> } }
  ).cartLinesUpdate.cart;
  return normalizeCart(cart);
}

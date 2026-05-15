import {
  createCart,
  addToCart,
  getCart,
  removeFromCart,
  updateCartLine,
  type ShopifyCartLine,
} from "../../../lib/shopify";

function serializeLines(lines: ShopifyCartLine[]) {
  return lines.map((line) => ({
    id: line.id,
    quantity: line.quantity,
    variantId: line.merchandise.id,
    productTitle: line.merchandise.product.title,
    variantTitle: line.merchandise.title,
    price: line.merchandise.price.amount,
    imageUrl: line.merchandise.product.images.edges[0]?.node.url ?? null,
    imageAlt: line.merchandise.product.images.edges[0]?.node.altText ?? null,
  }));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");
  if (!cartId) return Response.json({ lines: [], checkoutUrl: null });
  const cart = await getCart(cartId);
  if (!cart) return Response.json({ lines: [], checkoutUrl: null });
  return Response.json({
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: serializeLines(cart.lines),
  });
}

export async function POST(request: Request) {
  const { variantId, quantity, cartId } = await request.json();
  const cart = cartId
    ? await addToCart(cartId, variantId, quantity ?? 1)
    : await createCart(variantId, quantity ?? 1);
  return Response.json({
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: serializeLines(cart.lines),
  });
}

export async function PATCH(request: Request) {
  const { cartId, lineId, quantity } = await request.json();
  const cart = await updateCartLine(cartId, lineId, quantity);
  return Response.json({
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: serializeLines(cart.lines),
  });
}

export async function DELETE(request: Request) {
  const { cartId, lineId } = await request.json();
  const cart = await removeFromCart(cartId, lineId);
  return Response.json({
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: serializeLines(cart.lines),
  });
}

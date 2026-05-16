import {
  createCart,
  addToCart,
  getCart,
  removeFromCart,
  updateCartLine,
  type ShopifyCartLine,
} from "../../../lib/shopify";

const VARIANT_IMAGE_MAP: Record<string, Record<string, string>> = {
  "embroidered-longsleeves": { White: "longsleeve_3", Black: "longsleeve_2" },
  "graphic-tee":             { White: "graphic_2",    Black: "graphic_1" },
  "embroidered-tee":         { White: "embroid_3",    Black: "embroid_2" },
  "plaid":                   { Longsleeves: "plaid_1", Polo: "plaid_2" },
};

function findImageByStem(
  images: Array<{ url: string; altText: string | null }>,
  stem: string
) {
  const lower = stem.toLowerCase();
  return images.find((img) => img.url.split("?")[0].toLowerCase().includes(lower)) ?? null;
}

function serializeLines(lines: ShopifyCartLine[]) {
  return lines.map((line) => {
    const productImages = line.merchandise.product.images.edges.map((e) => e.node);

    let imageUrl: string | null = line.merchandise.image?.url ?? null;
    let imageAlt: string | null = line.merchandise.image?.altText ?? null;

    if (!imageUrl) {
      const handle = line.merchandise.product.handle;
      const firstOption = line.merchandise.title.split(" / ")[0].trim();
      const stem = VARIANT_IMAGE_MAP[handle]?.[firstOption];
      if (stem) {
        const match = findImageByStem(productImages, stem);
        if (match) { imageUrl = match.url; imageAlt = match.altText; }
      }
    }

    if (!imageUrl) {
      imageUrl = productImages[0]?.url ?? null;
      imageAlt = productImages[0]?.altText ?? null;
    }

    return {
      id: line.id,
      quantity: line.quantity,
      variantId: line.merchandise.id,
      productTitle: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      price: line.merchandise.price.amount,
      imageUrl,
      imageAlt,
    };
  });
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

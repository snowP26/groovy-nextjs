import { createDraftOrder } from "../../../lib/shopify-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contact, shipping, paymentMethod, referenceNumber, lines } = body;

    const note = [
      `Payment Method: ${paymentMethod}`,
      `Reference Number: ${referenceNumber}`,
    ].join("\n");

    const tags = ["manual-payment", paymentMethod.toLowerCase().replace(/\s+/g, "-")];

    const draftOrder = await createDraftOrder({
      lineItems: lines.map((l: { variantId: string; quantity: number }) => ({
        variantId: l.variantId,
        quantity: l.quantity,
      })),
      shippingAddress: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        address1: shipping.address,
        address2: shipping.address2 || undefined,
        city: shipping.city,
        province: shipping.province,
        zip: shipping.zip,
        phone: contact.phone,
        countryCode: "PH",
      },
      email: contact.email,
      note,
      tags,
    });

    return Response.json({ orderId: draftOrder.id, orderName: draftOrder.name });
  } catch (err) {
    console.error("[/api/orders]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

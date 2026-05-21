const ADMIN_API_URL = `https://${process.env.SHOPIFY_ADMIN_DOMAIN ?? process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/graphql.json`;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN!;

async function adminRequest(query: string, variables?: Record<string, unknown>) {
  const res = await fetch(ADMIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error("[shopify-admin] response:", JSON.stringify(json));
    throw new Error(json.errors?.[0]?.message ?? `HTTP ${res.status}`);
  }
  return json;
}

type DraftOrderInput = {
  lineItems: Array<{ variantId: string; quantity: number }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    phone: string;
    countryCode: string;
  };
  email: string;
  note: string;
  tags: string[];
  shippingLine?: { title: string; price: string };
};

const DRAFT_ORDER_CREATE = `
  mutation DraftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        name
        totalPriceSet { shopMoney { amount currencyCode } }
      }
      userErrors { field message }
    }
  }
`;

export async function createDraftOrder(input: DraftOrderInput) {
  const data = await adminRequest(DRAFT_ORDER_CREATE, { input });
  const { draftOrder, userErrors } = data.data.draftOrderCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  return draftOrder as {
    id: string;
    name: string;
    totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  };
}

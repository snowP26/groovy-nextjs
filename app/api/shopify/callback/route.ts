export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const shop = searchParams.get("shop")!;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID!;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET!;

  if (!code) {
    return Response.json({ error: "Missing code" }, { status: 400 });
  }

  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const raw = await res.text();
  console.log("[shopify-callback] status:", res.status, "body:", raw);

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Shopify returned non-JSON", status: res.status, body: raw }, { status: 500 });
  }

  if (!res.ok || !data.access_token) {
    return Response.json({ error: "Token exchange failed", detail: data }, { status: 500 });
  }

  console.log("\n========================================");
  console.log("SHOPIFY ADMIN TOKEN (copy to .env.local):");
  console.log(data.access_token);
  console.log("Scopes:", data.scope);
  console.log("========================================\n");

  return Response.json({
    message: "Copy this token to .env.local as SHOPIFY_ADMIN_TOKEN",
    access_token: data.access_token,
    scope: data.scope,
  });
}

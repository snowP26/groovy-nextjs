import { redirect } from "next/navigation";
import crypto from "crypto";

export async function GET() {
  const shop = process.env.SHOPIFY_STORE_DOMAIN!;
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID!;
  const redirectUri = process.env.SHOPIFY_OAUTH_REDIRECT_URI!;
  const scopes = "write_draft_orders,read_draft_orders";
  const state = crypto.randomBytes(16).toString("hex");

  const url =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${clientId}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  redirect(url);
}

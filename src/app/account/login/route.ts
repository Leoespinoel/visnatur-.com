import { NextResponse, type NextRequest } from "next/server";
import { loginUrl } from "@/lib/customer-account";

/** /account/login[?return=/path]: off to Shopify's sign-in (email and code), then back via /account/callback. */
export async function GET(req: NextRequest) {
  const back = req.nextUrl.searchParams.get("return") ?? "";
  // Only a path on this site, never another site.
  const returnTo = /^\/(?![/\\])/.test(back) ? back : "/account";
  return NextResponse.redirect(await loginUrl(returnTo));
}

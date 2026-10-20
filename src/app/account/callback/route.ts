import type { NextRequest } from "next/server";
import { finishLogin, redirectTo } from "@/lib/customer-account";

/** Shopify sends the customer back here after signing in (the Callback URI in the Headless storefront's settings). */
export async function GET(req: NextRequest) {
  // Read before the try, so the build's prerender bail-out isn't caught below as a failed sign-in.
  const params = req.nextUrl.searchParams;
  try {
    return redirectTo(await finishLogin(params));
  } catch (err) {
    console.error("Customer sign-in failed", err);
    return redirectTo("/account?signin=failed");
  }
}

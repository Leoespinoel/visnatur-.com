import { clearSession, logoutUrl, redirectTo } from "@/lib/customer-account";

/** The Sign out button posts here: signs out on the site, then on Shopify, which comes back to the home page. */
export async function POST() {
  const idToken = await clearSession();
  return redirectTo(await logoutUrl(idToken), 303);
}

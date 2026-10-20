import { asCustomer, customerApi } from "@/lib/customer-account";
import { availableCountries } from "@/lib/shopify";

/**
 * The signed-in customer's profile for /account/profile: name, email and addresses, kept on Shopify. GET reads it with
 * the countries the store sells to; POST { action } changes it: "name", "address" (add or edit), "default" or "delete".
 */

type Address = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zoneCode: string | null;
  zip: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
  formatted: string[];
};

const PROFILE = /* GraphQL */ `
  query Profile {
    customer {
      firstName
      lastName
      emailAddress { emailAddress }
      defaultAddress { id }
      addresses(first: 20) {
        nodes { id firstName lastName company address1 address2 city zoneCode zip countryCode phoneNumber formatted(withName: true) }
      }
    }
  }
`;

type Profile = {
  customer: {
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string | null } | null;
    defaultAddress: { id: string } | null;
    addresses: { nodes: Address[] };
  };
};

export async function GET() {
  return asCustomer("We couldn't load your profile.", async (token) => {
    const [{ customer }, countries] = await Promise.all([customerApi<Profile>(token, PROFILE), availableCountries()]);
    return Response.json({
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.emailAddress?.emailAddress ?? "",
      defaultAddressId: customer.defaultAddress?.id ?? null,
      addresses: customer.addresses.nodes,
      countries,
    });
  });
}

type UserErrors = { userErrors: { field: string[] | null; message: string }[] };

const text = (v: unknown, max = 120) => (typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, max) : "");
const addressId = (v: unknown) => (typeof v === "string" && v.startsWith("gid://shopify/") ? v : null);

/** The fields the address form sends, cleaned for Shopify's CustomerAddressInput. */
function addressInput(raw: unknown) {
  const a = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const input: Record<string, string> = {
    firstName: text(a.firstName),
    lastName: text(a.lastName),
    company: text(a.company),
    address1: text(a.address1, 200),
    address2: text(a.address2, 200),
    city: text(a.city),
    zip: text(a.zip, 20),
    countryCode: text(a.countryCode, 2).toUpperCase(),
    zoneCode: text(a.zoneCode, 10).toUpperCase(),
    phoneNumber: text(a.phoneNumber, 20).replace(/[\s()-]/g, ""),
  };
  // Empty optional fields are left out rather than sent blank.
  return Object.fromEntries(Object.entries(input).filter(([, v]) => v));
}

const MUTATIONS = {
  name: `mutation Name($input: CustomerUpdateInput!) { customerUpdate(input: $input) { userErrors { field message } } }`,
  create: `mutation AddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) { customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { userErrors { field message } } }`,
  update: `mutation AddressUpdate($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) { customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { userErrors { field message } } }`,
  delete: `mutation AddressDelete($addressId: ID!) { customerAddressDelete(addressId: $addressId) { userErrors { field message } } }`,
};

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  return asCustomer("We couldn't save that. Please try again.", async (token) => {
    let result: Record<string, UserErrors>;
    const id = addressId(body.id);
    switch (body.action) {
      case "name":
        result = await customerApi(token, MUTATIONS.name, { input: { firstName: text(body.firstName), lastName: text(body.lastName) } });
        break;
      case "address": {
        const address = addressInput(body.address);
        if (!address.address1 || !address.city || !address.countryCode) return Response.json({ error: "Please fill in the street, town and country." }, { status: 422 });
        const defaultAddress = body.makeDefault === true;
        result = id
          ? await customerApi(token, MUTATIONS.update, { addressId: id, address, defaultAddress })
          : await customerApi(token, MUTATIONS.create, { address, defaultAddress });
        break;
      }
      case "default":
        if (!id) return Response.json({ error: "Bad request." }, { status: 400 });
        result = await customerApi(token, MUTATIONS.update, { addressId: id, defaultAddress: true });
        break;
      case "delete":
        if (!id) return Response.json({ error: "Bad request." }, { status: 400 });
        result = await customerApi(token, MUTATIONS.delete, { addressId: id });
        break;
      default:
        return Response.json({ error: "Bad request." }, { status: 400 });
    }
    const errors = Object.values(result).flatMap((r) => r.userErrors);
    if (errors.length) return Response.json({ error: errors.map((e) => e.message).join(" ") }, { status: 422 });
    return Response.json({ ok: true });
  });
}

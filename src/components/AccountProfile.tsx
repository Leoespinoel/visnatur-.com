"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@/data/site";
import { updateAccount, useAccountData } from "@/lib/account-sync";
import { AccountGate } from "./AccountGate";

/** /account/profile: the signed-in customer's name, email and addresses, in the site's own design and kept on Shopify. */

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

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  defaultAddressId: string | null;
  addresses: Address[];
  countries: { code: string; name: string }[];
};

/** Countries whose addresses need a region, with an example of Shopify's region codes. */
const REGION_HINTS: Record<string, string> = {
  IT: "Province code, e.g. MI for Milano, RM for Roma",
  ES: "Province code, e.g. M for Madrid, B for Barcelona",
  IE: "County code, e.g. D for Dublin, CO for Cork",
  US: "State code, e.g. NY, CA",
  CA: "Province code, e.g. ON, QC",
  AU: "State code, e.g. NSW, VIC",
};

async function send(body: Record<string, unknown>): Promise<string | null> {
  try {
    const res = await fetch("/api/account/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) return null;
    if (res.status === 401) {
      updateAccount({ status: "signed-out" });
      return "You've been signed out. Please sign in again.";
    }
    return ((await res.json()) as { error?: string }).error ?? "We couldn't save that. Please try again.";
  } catch {
    return "We couldn't save that. Please check your connection and try again.";
  }
}

export function AccountProfile() {
  return (
    <AccountGate title="Your profile" what="your profile" path="/account/profile">
      <ProfileBody />
    </AccountGate>
  );
}

function ProfileBody() {
  const { data, error, loading, reload } = useAccountData<Profile>("/api/account/profile");

  return (
    <section className="container-x max-w-4xl py-12 md:py-16">
      <p className="eyebrow mb-3">Account</p>
      <h1 className="display text-4xl md:text-5xl">Profile.</h1>
      {loading ? (
        <div className="min-h-96" aria-busy="true" />
      ) : error || !data ? (
        <p role="alert" className="mt-8 text-ink-2">
          {error}
        </p>
      ) : (
        <div className="mt-10 space-y-14">
          <NameForm profile={data} />
          <Addresses profile={data} reload={reload} />
        </div>
      )}
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass = "w-full border border-line bg-transparent p-2.5 text-sm focus:border-ink focus:outline-none";

function NameForm({ profile }: { profile: Profile }) {
  const [first, setFirst] = useState(profile.firstName);
  const [last, setLast] = useState(profile.lastName);
  const [status, setStatus] = useState<{ saving?: boolean; message?: string; error?: boolean }>({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus({ saving: true });
    const err = await send({ action: "name", firstName: first, lastName: last });
    if (!err) updateAccount({ firstName: first.trim() });
    setStatus(err ? { message: err, error: true } : { message: "Saved." });
  }

  return (
    <form onSubmit={submit}>
      <fieldset>
        <legend className="eyebrow mb-4">Your details</legend>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field label="First name">
            <input value={first} onChange={(e) => setFirst(e.target.value)} autoComplete="given-name" maxLength={120} className={inputClass} />
          </Field>
          <Field label="Last name">
            <input value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" maxLength={120} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium">Email</p>
            <p className="mt-2 text-sm">{profile.email}</p>
            <p className="mt-1 text-xs text-muted">
              You sign in with this address. To change it, write to{" "}
              <a href={`mailto:${site.email}`} className="underline">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </fieldset>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status.saving} className="btn btn-primary">
          Save details
        </button>
        <p role="status" className={`text-sm ${status.error ? "text-red" : "text-ink-2"}`}>
          {status.message}
        </p>
      </div>
    </form>
  );
}

function Addresses({ profile, reload }: { profile: Profile; reload: () => Promise<unknown> }) {
  // null: no form open; "new": adding one; otherwise the id of the address being edited.
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function done(saved: boolean) {
    if (saved) await reload();
    setEditing(null);
  }

  async function act(body: Record<string, unknown>, id: string) {
    setBusy(id);
    setError(null);
    const err = await send(body);
    setError(err);
    if (!err) await reload();
    setBusy(null);
  }

  const sorted = [...profile.addresses].sort((a, b) => Number(b.id === profile.defaultAddressId) - Number(a.id === profile.defaultAddressId));

  return (
    <section aria-labelledby="addresses">
      <h2 id="addresses" className="eyebrow mb-4">
        Addresses
      </h2>
      {sorted.length === 0 && editing !== "new" && <p className="max-w-xl text-sm text-ink-2">No addresses yet. The one you use at checkout is saved here, or add one now.</p>}

      <ul className="grid gap-4 sm:grid-cols-2">
        {sorted.map((a) =>
          editing === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm profile={profile} address={a} onDone={done} />
            </li>
          ) : (
            <li key={a.id} className="border border-line p-5 text-sm">
              {a.id === profile.defaultAddressId && <p className="eyebrow mb-3 !text-ink">Default</p>}
              <address className="not-italic leading-relaxed text-ink-2">
                {a.formatted.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                <button type="button" onClick={() => setEditing(a.id)} className="link-underline !text-ink">
                  Edit
                </button>
                {a.id !== profile.defaultAddressId && (
                  <button type="button" disabled={busy === a.id} onClick={() => act({ action: "default", id: a.id }, a.id)} className="link-underline !text-ink">
                    Make default
                  </button>
                )}
                <button type="button" disabled={busy === a.id} onClick={() => act({ action: "delete", id: a.id }, a.id)} className="link-underline !text-ink">
                  Remove
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red">
          {error}
        </p>
      )}

      {editing === "new" ? (
        <div className="mt-6">
          <AddressForm profile={profile} onDone={done} />
        </div>
      ) : (
        editing === null && (
          <button type="button" onClick={() => setEditing("new")} className="btn btn-outline mt-6">
            Add an address
          </button>
        )
      )}
    </section>
  );
}

function AddressForm({ profile, address, onDone }: { profile: Profile; address?: Address; onDone: (saved: boolean) => void }) {
  const [draft, setDraft] = useState({
    firstName: address?.firstName ?? profile.firstName,
    lastName: address?.lastName ?? profile.lastName,
    company: address?.company ?? "",
    address1: address?.address1 ?? "",
    address2: address?.address2 ?? "",
    city: address?.city ?? "",
    zip: address?.zip ?? "",
    countryCode: address?.countryCode ?? "",
    zoneCode: address?.zoneCode ?? "",
    phoneNumber: address?.phoneNumber ?? "",
  });
  const [makeDefault, setMakeDefault] = useState(!profile.addresses.length || address?.id === profile.defaultAddressId);
  const [status, setStatus] = useState<{ saving?: boolean; error?: string }>({});
  const set = (k: keyof typeof draft) => (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const region = REGION_HINTS[draft.countryCode];

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus({ saving: true });
    const err = await send({ action: "address", id: address?.id, address: region ? draft : { ...draft, zoneCode: "" }, makeDefault });
    if (err) return setStatus({ error: err });
    onDone(true);
  }

  return (
    <form onSubmit={submit} className="border border-ink p-5 md:p-6">
      <p className="eyebrow mb-5 !text-ink">{address ? "Edit address" : "New address"}</p>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        <Field label="First name">
          <input value={draft.firstName} onChange={set("firstName")} autoComplete="given-name" maxLength={120} className={inputClass} />
        </Field>
        <Field label="Last name">
          <input value={draft.lastName} onChange={set("lastName")} autoComplete="family-name" maxLength={120} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Street and number">
            <input value={draft.address1} onChange={set("address1")} required autoComplete="address-line1" maxLength={200} className={inputClass} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Apartment, floor (optional)">
            <input value={draft.address2} onChange={set("address2")} autoComplete="address-line2" maxLength={200} className={inputClass} />
          </Field>
        </div>
        <Field label="Town or city">
          <input value={draft.city} onChange={set("city")} required autoComplete="address-level2" maxLength={120} className={inputClass} />
        </Field>
        <Field label="Postcode">
          <input value={draft.zip} onChange={set("zip")} autoComplete="postal-code" maxLength={20} className={inputClass} />
        </Field>
        <Field label="Country">
          {profile.countries.length ? (
            <select value={draft.countryCode} onChange={set("countryCode")} required autoComplete="country" className={inputClass}>
              <option value="" disabled>
                Choose a country
              </option>
              {profile.countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input value={draft.countryCode} onChange={set("countryCode")} required placeholder="Two-letter code, e.g. FR" maxLength={2} className={inputClass} />
          )}
        </Field>
        {region && (
          <Field label="Region" hint={region}>
            <input value={draft.zoneCode} onChange={set("zoneCode")} required maxLength={10} className={`${inputClass} uppercase`} />
          </Field>
        )}
        <Field label="Phone (optional)" hint="With the country code, e.g. +33 6 12 34 56 78">
          <input value={draft.phoneNumber} onChange={set("phoneNumber")} type="tel" autoComplete="tel" maxLength={20} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Company (optional)">
            <input value={draft.company} onChange={set("company")} autoComplete="organization" maxLength={120} className={inputClass} />
          </Field>
        </div>
      </div>
      <label className="mt-5 flex items-center gap-3 text-sm">
        <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} className="size-4 accent-ink" />
        Use as my default address
      </label>
      {status.error && (
        <p role="alert" className="mt-4 text-sm text-red">
          {status.error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={status.saving} className="btn btn-primary">
          Save address
        </button>
        <button type="button" onClick={() => onDone(false)} className="btn btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}

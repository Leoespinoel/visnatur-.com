import type { Metadata } from "next";
import { site } from "@/data/site";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = { title: "Contact", description: "Write to Vis Naturæ about sizing, orders or anything else." };

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Write to us." lede="Sizing questions, order updates, repairs, or just to say hello. We answer within two working days." />
      <section className="container-x grid gap-12 pb-24 md:grid-cols-12">
        <form action={`mailto:${site.email}`} method="post" encType="text/plain" className="space-y-5 md:col-span-6">
          <Field id="name" label="Name" />
          <Field id="email" label="Email" type="email" />
          <Field id="order" label="Order number (optional)" />
          <div>
            <label htmlFor="message" className="eyebrow mb-2 block">
              Message
            </label>
            <textarea id="message" name="message" required rows={6} className="w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-ink focus:outline-none" />
          </div>
          <button type="submit" className="btn btn-primary">
            Send
          </button>
          <p className="text-xs text-muted">This opens your email app addressed to {site.email}.</p>
        </form>
        <div className="space-y-8 text-sm text-ink-2 md:col-span-4 md:col-start-8">
          <div>
            <p className="eyebrow mb-2">Email</p>
            <a href={`mailto:${site.email}`} className="font-serif text-2xl text-ink link-underline">
              {site.email}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-2">Instagram</p>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="font-serif text-2xl text-ink link-underline">
              @visnaturae
            </a>
          </div>
          <div>
            <p className="eyebrow mb-2">Hours</p>
            <p>Monday to Friday, 9:00–17:00 CET.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, type = "text" }: { id: string; label: string; type?: string }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label}
      </label>
      <input id={id} name={id} type={type} required={!label.includes("optional")} className="h-12 w-full border border-line bg-transparent px-4 text-sm focus:border-ink focus:outline-none" />
    </div>
  );
}

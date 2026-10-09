import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy."
      updated="October 2026"
      sections={[
        { heading: "What we collect", body: ["When you order, we collect your name, email, shipping address and the details of what you bought. Payment details are collected and stored by Stripe, never by us."] },
        { heading: "What we use it for", body: ["To make and ship your order, to contact you about it, and, if you subscribe, to send occasional letters. We do not sell or share your data for advertising."] },
        { heading: "Cookies", body: ["This site uses no tracking cookies. Your bag is stored in your own browser (local storage) and never sent to us until you check out."] },
        { heading: "Processors", body: ["Stripe (payments), our hosting provider, and our shipping carriers receive only what they need to do their part."] },
        { heading: "Your rights", body: ["Under the GDPR you may access, correct or delete your data at any time. Write to hello@visnaturae.com."] },
      ]}
    />
  );
}

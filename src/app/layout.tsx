import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ClassicIntro, ClassicOnly } from "@/components/SiteChrome";
import { SiteMusic } from "@/components/SiteMusic";
import { AccountSync } from "@/lib/account-sync";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_IE",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {site.intro && <ClassicIntro />}
        <ClassicOnly>
          <SiteMusic />
        </ClassicOnly>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        {/* Signed in: keeps My sizes and the wishlist on the customer's account. */}
        <AccountSync />
        <CartProvider>
          {/* /v2 (the streetwear version) brings its own header, footer and bag: see src/app/v2/layout.tsx */}
          <ClassicOnly>
            <Header />
          </ClassicOnly>
          <main id="main" className="flex-1">
            {children}
          </main>
          <ClassicOnly>
            <Footer />
            <CartDrawer />
          </ClassicOnly>
        </CartProvider>
      </body>
    </html>
  );
}

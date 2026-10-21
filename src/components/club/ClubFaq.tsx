import { clubFaqs } from "@/data/members";
import { SectionHeading } from "@/components/SectionHeading";

/** The club's questions, grouped as on nude-project.com's member pages. Red, above the footer. */
export function ClubFaq() {
  return (
    <section id="faq" className="theme-dark scroll-mt-40">
      <div className="container-x py-16 md:py-24">
        <SectionHeading eyebrow="FAQ" title="Asked often." />
        {/* Two columns on screens, filled like a newspaper so neither runs on with gaps. */}
        <div className="md:columns-2 md:gap-x-12 lg:gap-x-20">
          {clubFaqs.map((g) => (
            <div key={g.group} className="mb-10 break-inside-avoid last:mb-0">
              <p className="eyebrow mb-3">{g.group}</p>
              <div className="divide-y divide-line border-y border-line">
                {g.items.map((f) => (
                  <details key={f.q} className="group py-5">
                    <summary className="flex items-center justify-between gap-6 font-serif text-xl md:text-2xl">
                      {f.q}
                      <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </summary>
                    <p className="pt-4 text-sm leading-relaxed text-ink-2 md:max-w-2xl">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

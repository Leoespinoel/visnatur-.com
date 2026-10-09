import { PageIntro } from "./PageIntro";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <>
      <PageIntro eyebrow={`Last updated ${updated}`} title={title} />
      <section className="container-x pb-24">
        <div className="max-w-3xl space-y-10">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-serif text-2xl md:text-3xl">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-2 md:text-base">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}
          <p className="text-xs text-muted">
            This is a starting template, not legal advice. Have it reviewed before launch and adapt it to the laws of the country the business is registered in.
          </p>
        </div>
      </section>
    </>
  );
}

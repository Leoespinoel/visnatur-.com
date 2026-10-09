export function PageIntro({ eyebrow, title, lede, variant = "editorial" }: { eyebrow?: string; title: string; lede?: string; variant?: "editorial" | "listing" }) {
  if (variant === "listing") {
    return (
      <div className="container-x pt-10 pb-6 md:pt-14 md:pb-8">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="headline text-4xl md:text-6xl">{title}</h1>
        {lede && <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-2">{lede}</p>}
      </div>
    );
  }
  return (
    <div className="container-x pt-14 pb-10 md:pt-20 md:pb-14">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="display max-w-4xl text-5xl md:text-7xl">{title}</h1>
      {lede && <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">{lede}</p>}
    </div>
  );
}

import { tickerLines } from "@/data/v2";

/** A black strip of plain facts scrolling sideways; pauses on hover, stands still for reduced motion. */
export function V2Ticker({
  lines = tickerLines,
  tone = "black",
  reverse = false,
  className = "",
}: {
  lines?: string[];
  tone?: "black" | "red" | "paper";
  reverse?: boolean;
  className?: string;
}) {
  const colours = { black: "bg-ink text-paper", red: "bg-red text-white", paper: "bg-paper text-ink border-y-[1.5px] border-ink" };
  // Two copies side by side; the track slides by half its width, so the loop is seamless.
  const run = [...lines, ...lines];
  return (
    <div className={`v2-ticker overflow-hidden ${colours[tone]} ${reverse ? "v2-ticker-reverse" : ""} ${className}`} role="marquee" aria-label={lines.join(". ")}>
      <div className="v2-ticker-track" aria-hidden="true">
        {[0, 1].map((half) => (
          <ul key={half} className="flex shrink-0">
            {run.map((line, i) => (
              <li key={i} className="v2-mono flex items-center gap-4 whitespace-nowrap py-2 pr-4">
                {line}
                <span className={tone === "red" ? "text-ink" : "text-red"}>✺</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

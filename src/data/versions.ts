/**
 * The versions of the site shown side by side on /versions (Leo, 2026-10-29: "present all the versions of the site on tiles …
 * to show people and ask which one they prefer"). Letters only, so people judge the site and not a name like "new":
 *   A  the site as it is live, from its shop homepage /home (Leo, 2026-10-29: "it should open on the shop"; the domain itself
 *      opens on Origins)
 *   B  the new website (~/Desktop/Vis Naturæ blank)
 *   C  the version after representclo.com (~/Desktop/Vis Naturæ represent)
 *   D  the version built from Leo's screen recording of row.representclo.com (~/Desktop/Vis Naturæ fourth; added the same day)
 * The streetwear version at /v2 was the first D until Leo took it off the page the same day.
 * `href` is where each lives online: visnaturæ.com/a forwards to /home, and /b, /c and /d are static copies of the other
 * versions in public/, like the pitch deck (Leo, 2026-10-29: "like you did for the pitch", in place of b./c./d. subdomains;
 * see next.config.ts). `local` is where each runs on Leo's Mac, used when the page is opened on localhost.
 * `image` is a screenshot of its first screen at 1440 × 900.
 */
export type SiteVersion = { letter: string; href: string; local: string; image: string };

export const versions: SiteVersion[] = [
  { letter: "A", href: "/a", local: "/home", image: "/images/versions/a.jpg" },
  { letter: "B", href: "/b", local: "http://localhost:3001", image: "/images/versions/b.jpg" },
  { letter: "C", href: "/c", local: "http://localhost:3002", image: "/images/versions/c.jpg" },
  { letter: "D", href: "/d", local: "http://localhost:3003", image: "/images/versions/d.jpg" },
];

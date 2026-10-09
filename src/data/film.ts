/**
 * The homepage film: "Dressed for it".
 * Treatment, shot list and cue sheet live in docs/film/treatment.md.
 *
 * While `sources` are empty the hero shows a placeholder. Drop the encoded files
 * into public/film/ (see public/film/README.md) and fill in the paths.
 */

export type Cue = { start: number; end: number; text: string };

export const film = {
  title: "Dressed for it",
  /** Shown under the wordmark while the film plays, next to today's date. */
  location: "Shot on location",
  sources: {
    landscape: "/film/hero-landscape.mp4",
    portrait: "", // e.g. "/film/hero-portrait.mp4"
  },
  poster: {
    landscape: "/film/poster-landscape.jpg",
    portrait: "", // e.g. "/film/poster-portrait.jpg"
  },
  /** Subtitle cues in seconds, burnt into the film by scripts/assemble-film.mjs. Keep in sync with the treatment. */
  captions: [
    { start: 0.8, end: 3.2, text: "My grandfather dressed for dinner" },
    { start: 3.2, end: 5.6, text: "every night of his life." },
    { start: 8.0, end: 11.0, text: "Even the night the storm took the roof." },
    { start: 14.4, end: 16.6, text: "He came down the stairs in a jacket." },
    { start: 17.0, end: 19.3, text: "My grandmother said, what are you doing." },
    { start: 19.6, end: 20.9, text: "He said," },
    { start: 21.6, end: 23.8, text: "the house is the house." },
    { start: 24.6, end: 26.4, text: "I am me." },
    { start: 27.6, end: 30.0, text: "I thought that was vanity." },
    { start: 30.4, end: 32.6, text: "For years I thought that." },
    { start: 32.9, end: 35.3, text: "Now I think it was the opposite." },
    { start: 36.7, end: 39.0, text: "The weather doesn't get a vote." },
  ] as Cue[],
};

/** The making-of shown in the full-width film block (scripts/assemble-film.mjs with CUT=atelier). */
export const atelierFilm = {
  title: "Made by hand",
  src: "/film/atelier-landscape.mp4",
  poster: "/film/atelier-poster.jpg",
};

export const hasFilm = film.sources.landscape.length > 0;

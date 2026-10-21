import { active, moments, type Picture } from "./moments";

/**
 * The community wall on /stories, once modelled on Dito Collective's carousel: tall cards of people in the clothes,
 * each with a handle, some looping as video.
 *
 * The cards show one person each in a real moment after or between sessions, cast to the model standard and
 * unbothered (Leo, 2026-10-21: "more unbothered models"; shots p1–p12 and w1–w6 in scripts/stills-shots.mjs, look
 * "community"), plus five film stills that play as video. All are AI-generated, not real customers, so `handle` is
 * left empty and the card shows the discipline instead. When real people share photos, swap in their image and set `handle` (with
 * their permission) to their Instagram handle.
 */
export type CommunityPost = {
  image: string;
  /** Short muted clip that plays when the card is clicked. */
  video?: string;
  /** Instagram handle without the @, only for real people who agreed to be featured. */
  handle?: string;
  /** Shown when there is no handle. */
  label: string;
};

export const communityPosts: CommunityPost[] = [
  { image: "/community/p1.jpg?v=u1021", label: "Rugby" },
  { image: "/community/w1.jpg?v=u1021", label: "Surf" },
  { image: "/community/a1.jpg", video: "/community/a1.mp4", label: "Rugby" },
  { image: "/community/p2.jpg?v=u1021", label: "Cycling" },
  { image: "/community/w3.jpg?v=u1021", label: "Golf" },
  { image: "/community/a4.jpg?v=2", video: "/community/a4.mp4?v=2", label: "Surf" },
  { image: "/community/p3.jpg?v=u1021", label: "Golf" },
  { image: "/community/w2.jpg?v=u1021", label: "Kitesurf" },
  { image: "/community/p4.jpg?v=u1021", label: "Surf" },
  { image: "/community/a5.jpg?v=2", video: "/community/a5.mp4?v=2", label: "Kitesurf" },
  { image: "/community/p5.jpg?v=u1021", label: "Kitesurf" },
  { image: "/community/w5.jpg?v=u1021", label: "Sailing" },
  { image: "/community/p6.jpg?v=u1021", label: "Wakeboard" },
  { image: "/community/a7.jpg", video: "/community/a7.mp4", label: "Skate" },
  { image: "/community/p7.jpg?v=u1021", label: "Skate" },
  { image: "/community/w4.jpg?v=u1021", label: "Trail" },
  { image: "/community/p8.jpg?v=u1021", label: "Snowboard" },
  { image: "/community/a8.jpg", video: "/community/a8.mp4", label: "Snowboard" },
  { image: "/community/p9.jpg?v=u1021", label: "Downhill" },
  { image: "/community/w6.jpg?v=u1021", label: "Freedive" },
  { image: "/community/p10.jpg?v=u1021", label: "Freeride" },
  { image: "/community/p11.jpg?v=u1021", label: "Trail" },
  { image: "/community/p12.jpg?v=u1021", label: "Climbing" },
];

/** One cell of the community wall: a post, a moments picture across two columns, or the red "tag us" tile. */
export type WallTile = { kind: "post"; post: CommunityPost } | { kind: "moment"; picture: Picture; size: "big" | "wide" } | { kind: "tag" };

/**
 * The wall, in blocks of three rows on four columns: a 4:5 moment over two columns and two rows ("big"), a 16:9 one over two
 * columns ("wide") and six posts. The big picture sits left or right in turn, and every row holds posts, which set its height,
 * so the grid never leaves a hole. The tag tile takes the last post cell of the second block, the last one shown before "Show
 * more". Posts beyond the four blocks follow as plain cells.
 */
const blocks: { big: Picture; wide: Picture; side: "left" | "right" }[] = [
  { big: moments.firstLight, wide: moments.surfLineup, side: "left" },
  { big: moments.courtyard, wide: moments.djNight, side: "right" },
  { big: moments.readyAgain, wide: active.barrel, side: "left" },
  { big: moments.sunriseWalk, wide: moments.kitchenParty, side: "right" },
];

function buildWall(posts: CommunityPost[]): WallTile[][] {
  const queue = [...posts];
  const cells = (n: number): WallTile[] => queue.splice(0, n).map((post) => ({ kind: "post", post }));
  const wall = blocks.map(({ big, wide, side }, i): WallTile[] => {
    const own = cells(i === 1 ? 5 : 6);
    if (i === 1) own.push({ kind: "tag" });
    const bigTile: WallTile = { kind: "moment", picture: big, size: "big" };
    const wideTile: WallTile = { kind: "moment", picture: wide, size: "wide" };
    return side === "left"
      ? [bigTile, ...own.slice(0, 4), wideTile, ...own.slice(4)]
      : [...own.slice(0, 2), bigTile, ...own.slice(2), wideTile];
  });
  return queue.length ? [...wall, cells(queue.length)] : wall;
}

export const communityWall = buildWall(communityPosts);

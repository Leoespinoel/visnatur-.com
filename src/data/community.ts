/**
 * Homepage "Community" carousel, modelled on Dito Collective's: tall cards of people in the clothes,
 * each with a handle, some playable as video.
 *
 * The cards currently show the athletes from the brand film (AI-generated, not real customers), so
 * `handle` is left empty and the card shows the discipline instead. When real people share photos,
 * swap in their image and set `handle` (with their permission) to their Instagram handle.
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
  { image: "/community/p1.jpg?v=2", label: "Rugby" },
  { image: "/community/a1.jpg", video: "/community/a1.mp4", label: "Rugby" },
  { image: "/community/p2.jpg?v=2", label: "Cycling" },
  { image: "/community/a4.jpg", video: "/community/a4.mp4", label: "Surf" },
  { image: "/community/p3.jpg?v=2", label: "Golf" },
  { image: "/community/p4.jpg?v=2", label: "Surf" },
  { image: "/community/a5.jpg", video: "/community/a5.mp4", label: "Kitesurf" },
  { image: "/community/p5.jpg?v=2", label: "Kitesurf" },
  { image: "/community/p6.jpg?v=2", label: "Wakeboard" },
  { image: "/community/a7.jpg", video: "/community/a7.mp4", label: "Skate" },
  { image: "/community/p7.jpg?v=2", label: "Skate" },
  { image: "/community/p8.jpg?v=2", label: "Snowboard" },
  { image: "/community/a8.jpg", video: "/community/a8.mp4", label: "Snowboard" },
  { image: "/community/p9.jpg?v=2", label: "Downhill" },
  { image: "/community/p10.jpg?v=2", label: "Freeride" },
  { image: "/community/p11.jpg?v=2", label: "Trail" },
  { image: "/community/p12.jpg?v=2", label: "Climbing" },
];

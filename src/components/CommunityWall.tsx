"use client";

import { useState } from "react";
import Image from "next/image";
import type { WallTile } from "@/data/community";
import { CommunityCard } from "./CommunityCard";

/** Where each kind of tile sits: posts are one 4:5 cell, moments span two columns (and two rows when "big", from lg). */
const span = { post: "", big: "col-span-2 lg:row-span-2", wide: "col-span-2", tag: "" };
/** On phones the spanning tiles fill whole rows, so they keep their own shape; from lg they fill the cells the posts size. */
const shape = { big: "aspect-[4/5] lg:aspect-auto lg:h-full", wide: "aspect-[16/10] lg:aspect-auto lg:h-full" };

/**
 * The community wall, edge to edge: posts and moments in blocks (see `communityWall`), the first `shown` blocks at first and
 * the rest behind "Show more".
 */
export function CommunityWall({ blocks, shown = 2, instagram, handle }: { blocks: WallTile[][]; shown?: number; instagram: string; handle: string }) {
  const [all, setAll] = useState(false);
  const tiles = (all ? blocks : blocks.slice(0, shown)).flat();

  return (
    <>
      <ul className="grid grid-flow-dense grid-cols-2 gap-1.5 md:gap-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const kind = tile.kind === "moment" ? tile.size : tile.kind;
          const key = tile.kind === "post" ? tile.post.image : tile.kind === "moment" ? tile.picture.image : "tag";
          return (
            <li key={key} className={span[kind]}>
              {tile.kind === "post" && <CommunityCard post={tile.post} />}
              {tile.kind === "moment" && (
                <div className={`group image-frame ${shape[tile.size]}`}>
                  <Image
                    src={tile.picture.image}
                    alt={tile.picture.alt}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              {tile.kind === "tag" && (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-red flex aspect-[4/5] flex-col justify-between p-4 transition-opacity hover:opacity-90 md:p-5 xl:p-6"
                >
                  <span className="eyebrow">Your picture here</span>
                  <span className="display break-words text-2xl md:text-3xl xl:text-4xl">Tag @{handle}</span>
                  <span className="w-fit border-b border-current pb-1 text-[11px] uppercase tracking-[0.18em]">Follow on Instagram</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
      {!all && blocks.length > shown && (
        <div className="container-x mt-10 flex justify-center md:mt-12">
          <button type="button" onClick={() => setAll(true)} className="btn btn-outline">
            Show more
          </button>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { club, rewards, type Reward } from "@/data/members";
import type { ClubView, WalletItem } from "@/lib/club-ledger";
import { BandHeading } from "./BandHeading";
import { longDate, pts } from "./format";
import type { ClubAct } from "./ClubMember";

const rewardOf = (id: string) => rewards.find((r) => r.id === id)!;

function CopyCode({ code, big = false }: { code: string; big?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4">
      <code className={`font-mono tracking-[0.18em] ${big ? "text-2xl md:text-3xl" : "text-base"}`}>{code}</code>
      <button
        type="button"
        onClick={() => navigator.clipboard?.writeText(code).then(() => (setCopied(true), setTimeout(() => setCopied(false), 1800)))}
        className="eyebrow link-underline shrink-0 !text-current"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

const walletLine: Record<WalletItem["status"], (w: WalletItem) => string> = {
  ready: (w) => (w.endsAt ? `Use by ${longDate(w.endsAt)}, signed in, once.` : "Ready to use."),
  used: (w) => `Used on order ${w.usedOn}.`,
  expired: () => "This code has run out.",
  requested: () => "Requested. We'll be in touch by email.",
  preparing: () => "Being prepared…",
};

/** The empty wallet: the badger, asleep, keeping the member's place. */
function SleepingBadger() {
  return (
    <div className="flex flex-col items-center py-6 text-center md:py-10">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/badger-mark.svg" alt="" className="w-56 origin-bottom animate-[club-breathe_4.5s_ease-in-out_infinite] motion-reduce:animate-none md:w-72" />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute -top-3 right-[22%] font-serif text-2xl italic text-muted opacity-0 animate-[club-zzz_3.6s_ease-out_infinite] motion-reduce:hidden"
            style={{ animationDelay: `${i * 1.2}s` }}
          >
            z
          </span>
        ))}
      </div>
      <p className="mt-8 font-serif text-3xl">Nothing claimed yet.</p>
      <p className="mt-2 text-sm text-ink-2">
        The badger&rsquo;s keeping your place.{" "}
        <a href="#rewards" className="link-underline">
          See the rewards
        </a>
      </p>
    </div>
  );
}

/** Your rewards: what the member has claimed, with its code. Grey. */
export function ClubWallet({ view }: { view: ClubView }) {
  return (
    <section id="your-rewards" className="scroll-mt-40 bg-surface py-16 md:py-24">
      <div className="container-x">
        <BandHeading eyebrow="Your rewards" title="Yours to use.">
          Codes work at checkout when you are signed in, once each. Requests come back to you by email.
        </BandHeading>
        {view.wallet.length === 0 ? (
          <SleepingBadger />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {view.wallet.map((w) => {
              const r = rewardOf(w.reward);
              const faded = w.status === "used" || w.status === "expired";
              return (
                <li key={w.id} className={`voucher flex flex-col bg-white text-[#0a0a0a] ${faded ? "opacity-55" : ""}`}>
                  <div className="flex-1 p-6">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a7a7a]">Claimed {longDate(w.at)}</p>
                    <p className="mt-5 font-serif text-5xl leading-none text-[#c8102e]">{r.face}</p>
                    <p className="mt-2 text-sm text-[#3d3d3d]">{r.caption}</p>
                  </div>
                  <div className="mx-6 flex h-[4.75rem] flex-col justify-center gap-1 border-t border-dashed border-[#d0d0d0]">
                    {w.code && w.status === "ready" ? <CopyCode code={w.code} /> : null}
                    <p className="text-xs text-[#7a7a7a]">{walletLine[w.status](w)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

type Step = { at: "confirm" } | { at: "working" } | { at: "code"; code: string; endsAt: string } | { at: "requested" } | { at: "note"; text: string };

/** Rewards: the vouchers, drawn in CSS, and the claim. Black (Leo, 2026-10-21). */
export function ClubRewards({ view, act }: { view: ClubView; act: ClubAct }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [step, setStep] = useState<Step>({ at: "confirm" });

  const open = (r: Reward) => {
    setReward(r);
    setStep({ at: "confirm" });
    dialog.current?.showModal();
  };
  const claim = async () => {
    if (!reward) return;
    setStep({ at: "working" });
    const res = await act({ action: "claim", reward: reward.id });
    if (res.code && res.endsAt) setStep({ at: "code", code: res.code, endsAt: res.endsAt });
    else if (res.requested) setStep({ at: "requested" });
    else setStep({ at: "note", text: res.error ?? res.message ?? "Something went wrong. Please try again." });
  };
  const until = new Date();
  until.setUTCMonth(until.getUTCMonth() + club.codeMonths);

  return (
    <>
      <section id="rewards" className="theme-dark scroll-mt-40 py-16 md:py-24">
        <div className="container-x">
          <BandHeading eyebrow="Rewards" title="What points turn into.">
            You have {pts(view.balance)} points to spend. Codes are made the moment you claim, for you alone.
          </BandHeading>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((r, i) => {
              const short = r.cost - view.balance;
              return (
                <li key={r.id} className="voucher flex flex-col bg-white text-[#0a0a0a]">
                  {/* Out of reach for now: the ticket stays white, its face fades. */}
                  <div className={`relative flex-1 p-6 transition-opacity md:p-7 ${short > 0 ? "opacity-40" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#7a7a7a]">Members only · No. {String(i + 1).padStart(2, "0")}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/brand/badger-mark.svg" alt="" className="w-12 opacity-80" />
                    </div>
                    <p className="mt-8 font-serif text-7xl leading-none text-[#c8102e]">{r.face}</p>
                    <p className="mt-3 text-sm text-[#3d3d3d]">{r.caption}</p>
                  </div>
                  <div className="mx-6 flex h-[4.75rem] items-center justify-between gap-4 border-t border-dashed border-[#d0d0d0] md:mx-7">
                    <span className="text-[11px] uppercase tracking-[0.18em]">{r.points} points</span>
                    {!view.live ? (
                      <span className="text-xs text-[#7a7a7a]">Opens soon</span>
                    ) : short > 0 ? (
                      <span className="text-xs text-[#7a7a7a]">{pts(short)} more points</span>
                    ) : (
                      <button type="button" onClick={() => open(r)} className="h-10 bg-[#0a0a0a] px-5 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#c8102e]">
                        Claim
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Outside the red band, so it keeps the page's own colours. */}
      <dialog
        ref={dialog}
        aria-label="Claim a reward"
        className="m-auto w-[min(92vw,32rem)] bg-paper p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-sm"
        onClose={() => setReward(null)}
      >
        {reward && (
          <div className="p-7 md:p-9">
            {step.at === "confirm" && (
              <>
                <p className="eyebrow">Claim a reward</p>
                <p className="mt-4 font-serif text-3xl leading-tight">
                  Spend {reward.points} points on {reward.reward.charAt(0).toLowerCase() + reward.reward.slice(1)}?
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">
                  {reward.kind === "experience"
                    ? "We'll be in touch by email to arrange it."
                    : `A one-use code is made for you straight away. It works at checkout when you're signed in, until ${longDate(until.toISOString())}.`}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={claim} className="btn btn-primary">
                    Claim it
                  </button>
                  <button type="button" onClick={() => dialog.current?.close()} className="btn btn-outline">
                    Not now
                  </button>
                </div>
              </>
            )}
            {step.at === "working" && (
              <p className="py-6 font-serif text-2xl" role="status">
                {reward.kind === "experience" ? "Sending your request…" : "Making your code…"}
              </p>
            )}
            {step.at === "code" && (
              <>
                <p className="eyebrow">Yours</p>
                <p className="mt-4 font-serif text-3xl">{reward.reward}</p>
                <div className="mt-6 border-y border-dashed border-line py-5" role="status">
                  <CopyCode code={step.code} big />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">Use it at checkout, signed in. One use, until {longDate(step.endsAt)}. It&rsquo;s under Your rewards too.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/shop" className="btn btn-primary">
                    Shop now
                  </Link>
                  <button type="button" onClick={() => dialog.current?.close()} className="btn btn-outline">
                    Close
                  </button>
                </div>
              </>
            )}
            {(step.at === "requested" || step.at === "note") && (
              <>
                <p className="font-serif text-2xl leading-snug" role="status">
                  {step.at === "requested" ? "Requested. We'll be in touch by email within a few days." : step.text}
                </p>
                <button type="button" onClick={() => dialog.current?.close()} className="btn btn-outline mt-8">
                  Close
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}

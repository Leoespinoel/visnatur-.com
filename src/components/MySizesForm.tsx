"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signInHref } from "@/data/account";
import { FIT_LABELS, type Fit } from "@/lib/adjust";
import { useAccount } from "@/lib/account-sync";
import { BOTTOM_SIZES, MEASURE_RANGES, SIZES_NOTE_MAX, TOP_SIZES, hasSizes, useMySizes, type MeasureField, type MySizes } from "@/lib/sizes";

/** The form on /account/sizes: the customer's measurements and usual sizes, saved in this browser. */
export function MySizesForm() {
  const { sizes, hydrated, save, clear } = useMySizes();
  // Mounted once the saved sizes are read, so the form starts from them; saving keeps the form (and its "Saved" note) as it is.
  return hydrated ? <Form initial={sizes} onSave={save} onClear={clear} /> : <div className="min-h-96" />;
}

function Form({ initial, onSave, onClear }: { initial: MySizes; onSave: (s: MySizes) => void; onClear: () => void }) {
  const account = useAccount();
  const [draft, setDraft] = useState<MySizes>(initial);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof MySizes, v: string | number | undefined) => {
    setSaved(false);
    setDraft((d) => ({ ...d, [k]: v === "" ? undefined : v }));
  };

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(draft);
    setSaved(true);
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <fieldset>
        <legend className="eyebrow mb-4">Measurements (cm)</legend>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(MEASURE_RANGES) as MeasureField[]).map((f) => {
            const r = MEASURE_RANGES[f];
            return (
              <label key={f} className="block">
                <span className="text-sm font-medium">{r.label}</span>
                <span className="block text-xs text-muted">{r.hint}</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={r.min}
                  max={r.max}
                  value={draft[f] ?? ""}
                  onChange={(e) => set(f, e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={`${r.min}–${r.max}`}
                  className="mt-2 w-full border border-line bg-transparent p-2.5 text-sm tabular-nums focus:border-ink focus:outline-none"
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">Usual sizes</legend>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Choice label="Tops" options={TOP_SIZES} value={draft.top} onChange={(v) => set("top", v)} />
          <Choice label="Trousers and shorts (waist, inches)" options={BOTTOM_SIZES} value={draft.bottom} onChange={(v) => set("bottom", v)} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-4">How you like it to fit</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FIT_LABELS) as Fit[]).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={(draft.fit ?? "as-cut") === f}
              onClick={() => set("fit", f)}
              className={`border px-3 py-2 text-xs transition-colors ${(draft.fit ?? "as-cut") === f ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
            >
              {FIT_LABELS[f]}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="eyebrow mb-2 block">Note (optional)</span>
        <textarea
          value={draft.note ?? ""}
          onChange={(e) => set("note", e.target.value)}
          maxLength={SIZES_NOTE_MAX}
          rows={2}
          placeholder="Anything a tailor should know, e.g. broad shoulders, long arms"
          className="w-full border border-line bg-transparent p-2.5 text-sm focus:border-ink focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary">
          Save my sizes
        </button>
        {hasSizes(initial) && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setDraft({});
              setSaved(false);
            }}
            className="btn btn-outline"
          >
            Clear
          </button>
        )}
        <p role="status" className="text-sm text-ink-2">
          {saved ? "Saved. Made to order will use these sizes." : initial.updated ? `Last saved ${initial.updated}.` : ""}
        </p>
      </div>

      <p className="max-w-xl text-xs leading-relaxed text-muted">
        {account.status === "signed-in" ? (
          "Saved to your account, so your sizes are there on any device. "
        ) : (
          <>
            Saved in this browser.{" "}
            <Link href={`${signInHref}?return=/account/sizes`} className="underline">
              Sign in
            </Link>{" "}
            to keep your sizes on your account.{" "}
          </>
        )}
        Your sizes fill in the size and the{" "}
        <Link href="/made-to-order" className="underline">
          Made to order
        </Link>{" "}
        fields on each piece, and go with any order that has a made to order piece. See the{" "}
        <Link href="/made-to-order#sizing" className="underline">
          size guide
        </Link>{" "}
        for how to measure.
      </p>
    </form>
  );
}

function Choice({ label, options, value, onChange }: { label: string; options: string[]; value?: string; onChange: (v: string | undefined) => void }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(value === o ? undefined : o)}
            className={`min-w-12 border px-3 py-2.5 text-xs transition-colors ${value === o ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

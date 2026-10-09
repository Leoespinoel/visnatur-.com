import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const BagIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M6 8h12l-1 13H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const ArrowIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
);
export const ChevronIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const LeafIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15Z" />
    <path d="M5 19c3-5 7-8 11-10" />
  </svg>
);
export const NeedleIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M4 20 18 6" />
    <path d="M16 4a2.5 2.5 0 1 1 3.5 3.5L18 9l-3-3 1-2Z" />
    <path d="M4 20c4-1 6-3 7-6" />
  </svg>
);
export const TruckIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="1.5" />
    <circle cx="17" cy="18" r="1.5" />
  </svg>
);
export const LockIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="1" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
);
export const FilterIcon = (p: P) => (
  <svg {...base} {...p} aria-hidden="true">
    <path d="M4 7h16M7 12h10M10 17h4" />
  </svg>
);

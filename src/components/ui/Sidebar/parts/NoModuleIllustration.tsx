import type { SVGProps } from "react";

/**
 * Decorative spot illustration for the Sidebar's "no module selected"
 * empty state — a purple folder with assorted module cards peeking out,
 * framed by a few sparkles. Purely presentational and `aria-hidden`; the
 * empty state's text carries the meaning.
 *
 * Colours are drawn from the purple brand scale so the illustration sits
 * naturally on the `bg-purple-50` empty-state card.
 */
export function NoModuleIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 184 130"
      fill="none"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="nm-folder-back" x1="34" y1="48" x2="150" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DEC4F2" />
          <stop offset="1" stopColor="#CFA8EC" />
        </linearGradient>
        <linearGradient id="nm-folder-front" x1="30" y1="66" x2="154" y2="116" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CCA3EB" />
          <stop offset="1" stopColor="#B581DF" />
        </linearGradient>
      </defs>

      {/* Folder back panel + tab */}
      <path
        d="M40 48v-4a6 6 0 0 1 6-6h26a6 6 0 0 1 6 6v4Z"
        fill="url(#nm-folder-back)"
      />
      <rect x="34" y="48" width="116" height="68" rx="14" fill="url(#nm-folder-back)" />

      {/* Cards peeking out — drawn behind the folder's front pocket */}
      {/* Right card (peach) */}
      <g transform="rotate(13 116 60)">
        <rect x="100" y="22" width="34" height="52" rx="6" fill="#F8CDA8" />
        <rect x="106" y="33" width="22" height="3.5" rx="1.75" fill="#E8A977" />
        <rect x="106" y="41" width="14" height="3.5" rx="1.75" fill="#F0BC91" />
      </g>

      {/* Left card (purple) with avatar */}
      <g transform="rotate(-12 73 62)">
        <rect x="54" y="20" width="38" height="54" rx="6" fill="#C9A4EC" />
        <circle cx="73" cy="36" r="8" fill="#FFFFFF" />
        <circle cx="73" cy="33.6" r="2.8" fill="#5B3B7A" />
        <path d="M67.8 41.4a5.4 4.8 0 0 1 10.4 0Z" fill="#5B3B7A" />
      </g>

      {/* Center card (mint header + check) — sits in front */}
      <g transform="rotate(2 94 40)">
        <rect x="74" y="8" width="40" height="66" rx="7" fill="#FFFFFF" stroke="#E6D8F4" strokeWidth="1.5" />
        <path d="M74 15a7 7 0 0 1 7-7h26a7 7 0 0 1 7 7v9H74Z" fill="#BFEFD9" />
        <path
          d="m85.5 16.5 3.8 3.8 8-8"
          stroke="#2FA87A"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="82" y="34" width="24" height="3.5" rx="1.75" fill="#E6D8F4" />
        <rect x="82" y="42" width="16" height="3.5" rx="1.75" fill="#F0E8F8" />
      </g>

      {/* Folder front pocket */}
      <rect x="30" y="66" width="124" height="50" rx="14" fill="url(#nm-folder-front)" />
      <path d="M30 80a14 14 0 0 1 14-14h96a14 14 0 0 1 14 14" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />

      {/* 3D cube glyph on the pocket */}
      <g stroke="#5B1F8E" strokeOpacity="0.85" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M92 82 106 90v12L92 110 78 102V90Z" />
        <path d="M92 96 92 82M92 96 106 90M92 96 78 90M92 96 92 110" />
      </g>

      {/* Sparkles */}
      <g fill="#B57BE0">
        <path d="M52 32c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" />
        <path d="M134 30c.5 2.7 1.3 3.5 4 4-2.7.5-3.5 1.3-4 4-.5-2.7-1.3-3.5-4-4 2.7-.5 3.5-1.3 4-4Z" />
        <path d="M44 84c.4 2.2 1 2.8 3.2 3.2-2.2.4-2.8 1-3.2 3.2-.4-2.2-1-2.8-3.2-3.2 2.2-.4 2.8-1 3.2-3.2Z" />
      </g>
      <g fill="#CDA6EC">
        <circle cx="124" cy="54" r="2.4" />
        <circle cx="146" cy="92" r="2" />
        <circle cx="38" cy="58" r="2" />
      </g>
    </svg>
  );
}

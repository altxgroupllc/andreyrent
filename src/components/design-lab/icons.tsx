/**
 * Domain icon set drawn for this business: the eight things a Pattaya renter actually asks
 * about. Deliberately not a generic UI pack — Lucide appears only inside borrowed primitives
 * (calendar chevrons, command search), never as the product's icon identity.
 *
 * Stroke weight is a prop so each direction can set its own drawing character:
 * A uses 1.5 (technical), B uses 2.25 (poster), C uses 1.75 (compact).
 */
type P = React.SVGProps<SVGSVGElement> & { size?: number; sw?: number };

const base = (size = 20, sw = 1.75): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: sw,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const Helmet = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <path d="M3.5 14a8.5 8.5 0 0 1 17 0" />
    <path d="M3.5 14v1.5a1.5 1.5 0 0 0 1.5 1.5h9.2a3 3 0 0 0 2.6-1.5L20.5 10" />
    <path d="M8 14a4 4 0 0 1 4-4h8" />
  </svg>
);

export const KeyFob = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <rect x="7" y="3" width="10" height="14" rx="3" />
    <circle cx="12" cy="8" r="1.4" />
    <path d="M12 17v4M10.5 19.5h3" />
  </svg>
);

export const Deposit = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 9v6M18 9v6" />
  </svg>
);

export const Scooter = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <circle cx="5.5" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M8 17h7.5M18 14.5V8h-3" />
    <path d="M5.5 14.5 8 9h4l2.5 5.5M11 5h2.5" />
  </svg>
);

export const Passport = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6.5A1.5 1.5 0 0 1 5 19.5z" />
    <circle cx="12" cy="10" r="2.8" />
    <path d="M9.5 16h5" />
  </svg>
);

export const Engine = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <path d="M4 10h2V8h4l2-2h4v4h2.5L21 12v4h-3v3H9l-2-2H4z" />
    <path d="M12 6v4" />
  </svg>
);

export const Pin = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Clock = ({ size, sw, ...p }: P) => (
  <svg {...base(size, sw)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3 1.8" />
  </svg>
);

/** Channel marks. Green is reserved for these and nothing else. */
export const WhatsApp = ({ size = 20, ...p }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.95L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2m0 1.8a8.1 8.1 0 1 1-4.2 15.03l-.3-.18-3.08.89.9-3-.2-.31A8.1 8.1 0 0 1 12.04 3.8m-3.2 4c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.7 4.2 3.68 2.08.82 2.5.66 2.96.62.45-.04 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.28s-1.46-.72-1.68-.8c-.23-.08-.39-.12-.55.12s-.63.8-.77.96c-.14.16-.28.18-.52.06s-1.04-.38-1.98-1.22c-.73-.65-1.23-1.46-1.37-1.7-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42s.16-.24.24-.4c.08-.16.04-.3-.02-.42s-.55-1.33-.75-1.82c-.2-.47-.4-.41-.55-.41z" />
  </svg>
);

export const LineApp = ({ size = 20, ...p }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 3C6.9 3 2.8 6.4 2.8 10.5c0 3.7 3.2 6.8 7.6 7.4.3.06.7.2.8.45.1.23.06.58.03.81l-.13.78c-.04.23-.18.9.8.49s5.3-3.12 7.22-5.34c1.33-1.46 1.97-2.94 1.97-4.59C21.1 6.4 17 3 12 3M8.3 12.9h-1.8a.24.24 0 0 1-.24-.24V9.05c0-.13.11-.24.24-.24h.46c.13 0 .24.11.24.24v2.9H8.3c.13 0 .24.1.24.24v.46c0 .13-.11.25-.24.25m1.66-.24c0 .13-.11.24-.24.24h-.46a.24.24 0 0 1-.24-.24V9.05c0-.13.1-.24.24-.24h.46c.13 0 .24.11.24.24zm3.98 0c0 .13-.1.24-.24.24h-.5l-.07-.02-.03-.02-1.65-2.23v2.03c0 .13-.1.24-.24.24h-.46a.24.24 0 0 1-.24-.24V9.05c0-.13.11-.24.24-.24h.52l.05.02.02.02 1.66 2.23V9.05c0-.13.11-.24.24-.24h.46c.13 0 .24.11.24.24zm3.2-2.9c0 .14-.11.25-.24.25h-1.36v.53h1.36c.13 0 .24.1.24.24v.46c0 .13-.11.24-.24.24h-1.36v.53h1.36c.13 0 .24.1.24.24v.46c0 .13-.11.24-.24.24H15.2a.24.24 0 0 1-.24-.24V9.05c0-.13.11-.24.24-.24h1.66c.13 0 .24.11.24.24z" />
  </svg>
);

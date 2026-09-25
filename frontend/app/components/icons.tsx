import { colors } from "./theme";

export type IconName =
  | "search"
  | "menu"
  | "candle"
  | "dots"
  | "caretDown"
  | "caretUp"
  | "info"
  | "history"
  | "eye"
  | "arrowDown"
  | "arrowUp"
  | "swap"
  | "earn"
  | "scan"
  | "refresh"
  | "support"
  | "gift"
  | "chat"
  | "ticket"
  | "referral"
  | "bag"
  | "deposit"
  | "more"
  | "home"
  | "markets"
  | "trade"
  | "futures"
  | "assets"
  | "emptyDoc"
  | "emptyCoin"
  | "globe"
  | "close"
  | "filter"
  | "walletCard"
  | "fullscreen";

const PATHS: Record<IconName, string[]> = {
  search: ["M11 4a7 7 0 100 14 7 7 0 000-14z", "M20 20l-3.6-3.6"],
  menu: ["M3 6h18", "M3 12h18", "M3 18h18"],
  candle: ["M8 4v3M8 17v3M16 3v4M16 16v5", "M5.5 7h5v10h-5zM13.5 7h5v9h-5z"],
  dots: [],
  caretDown: ["M6 9l6 6 6-6"],
  caretUp: ["M6 15l6-6 6 6"],
  info: ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M12 8h.01M12 11v5"],
  history: ["M4 4h10l6 6v10H4z", "M16 14.4V16l1.2.9"],
  eye: [
    "M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z",
    "M12 9.6a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8z",
  ],
  arrowDown: ["M12 4v13", "M6.5 11.5L12 17.5l5.5-6"],
  arrowUp: ["M12 20V7", "M6.5 12.5L12 6.5l5.5 6"],
  swap: ["M3 9h16l-3.5-3.5M21 15H5l3.5 3.5"],
  earn: [
    "M5 9h14l1 11H4z",
    "M12 11.5a2 2 0 100 4 2 2 0 000-4z",
    "M12 5.5V9M10.5 4L12 5.5 13.5 4",
  ],
  scan: [
    "M4 8V5.5A1.5 1.5 0 015.5 4H8M16 4h2.5A1.5 1.5 0 0120 5.5V8M20 16v2.5A1.5 1.5 0 0118.5 20H16M8 20H5.5A1.5 1.5 0 014 18.5V16",
  ],
  refresh: [
    "M4 11a7 7 0 0111.8-4.6M20 13A7 7 0 018.2 17.6",
    "M4 5.5V11h5M20 18.5V13h-5",
  ],
  support: ["M4 13a8 8 0 0116 0v3a3 3 0 01-3 3h-1", "M2.5 12h4v6h-4zM17.5 12h4v6h-4z"],
  gift: [
    "M4 11h16v9H4zM4 7.5h16V11H4z",
    "M12 7.5V20M12 7.5S10.5 3.5 8 4.5s.5 3 4 3zM12 7.5s1.5-4 4-3-.5 3-4 3z",
  ],
  chat: ["M4 5h16v11H9l-5 4z"],
  ticket: [
    "M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z",
    "M12 10.5l1.5 1.5-1.5 1.5-1.5-1.5z",
  ],
  referral: [
    "M10 5.3a3.2 3.2 0 100 6.4 3.2 3.2 0 000-6.4z",
    "M4 19c0-3.3 2.7-5 6-5s6 1.7 6 5",
    "M19 7v6M16 10h6",
  ],
  bag: [
    "M6 8.5h12l1.6 11H4.4z",
    "M12 5v3.5M10 3.6L12 5l2-1.4",
    "M12 12.5l1.4 1.4-1.4 1.4-1.4-1.4z",
  ],
  deposit: ["M12 4v10", "M7.5 9.5L12 14l4.5-4.5", "M6 19h12"],
  more: ["M4 4h6v6H4zM17 4l3 3-3 3-3-3zM4 14h6v6H4zM14 14h6v6h-6z"],
  home: [
    "M12 3l4.2 4.2L12 11.4 7.8 7.2z",
    "M6 9.5l2.6 2.6L6 14.7 3.4 12.1zM18 9.5l2.6 2.6L18 14.7l-2.6-2.6zM12 13l2.6 2.6L12 18.2 9.4 15.6z",
  ],
  markets: ["M3 18l5-6 4 3 5-7", "M17 8h4v4"],
  trade: [
    "M4 9a8 8 0 0113.5-3M20 15A8 8 0 016.5 18",
    "M4 5v4h4M20 19v-4h-4",
    "M12 10.5l1.5 1.5-1.5 1.5-1.5-1.5z",
  ],
  futures: [
    "M6 3.5h12a2 2 0 012 2v13a2 2 0 01-2 2H6a2 2 0 01-2-2v-13a2 2 0 012-2z",
    "M8 8.5h6M8 12.5h4",
    "M15.5 14l1.8 1.8-1.8 1.8-1.8-1.8z",
  ],
  assets: [
    "M5.5 6h13a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-8A2.5 2.5 0 015.5 6z",
    "M3 10h18",
    "M15.5 13.5l1.5 1.5-1.5 1.5-1.5-1.5z",
  ],
  emptyDoc: [
    "M7.6 4h8.4v11H7.6z",
    "M15.5 11a4.5 4.5 0 100 9 4.5 4.5 0 000-9z",
    "M15.5 13.6v2M15.5 17.6h.01",
  ],
  emptyCoin: [
    "M12 3.4a8.6 8.6 0 100 17.2 8.6 8.6 0 000-17.2z",
    "M12 6.4a5.6 5.6 0 100 11.2 5.6 5.6 0 000-11.2z",
    "M12 9.6l2.4 2.4-2.4 2.4L9.6 12z",
  ],
  globe: ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M2 12h20", "M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"],
  close: ["M18 6L6 18", "M6 6l12 12"],
  filter: ["M3 6h18", "M7 12h10", "M10 18h4"],
  walletCard: ["M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2", "M16 12h5v4h-5z"],
  fullscreen: ["M8 3H5a2 2 0 00-2 2v3", "M21 8V5a2 2 0 00-2-2h-3", "M21 16v3a2 2 0 01-2 2h-3", "M3 16v3a2 2 0 002 2h3"],
};

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Single stroked-path icon set, matching the app's 1.7px line weight. */
export function Icon({ name, size = 22, color = colors.text, strokeWidth = 1.7 }: Props) {
  if (name === "dots") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <g fill={color}>
          <circle cx={5} cy={12} r={1.6} />
          <circle cx={12} cy={12} r={1.6} />
          <circle cx={19} cy={12} r={1.6} />
        </g>
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[name].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** The app's rotated-square "plus" affordance next to Avbl. */
export function YellowPlus({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx={12} cy={12} r={11} fill={colors.yellow} />
      <path
        d="M12 7v10M7 12h10"
        stroke={colors.onYellow}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}
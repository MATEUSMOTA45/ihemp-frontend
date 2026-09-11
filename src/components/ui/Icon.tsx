import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home"
  | "store"
  | "heart"
  | "orders"
  | "user"
  | "cart"
  | "help"
  | "location"
  | "search"
  | "plus"
  | "star"
  | "chevron-down"
  | "menu"
  | "close"
  | "logout"
  | "flower"
  | "edible"
  | "pre-roll"
  | "concentrate"
  | "vape"
  | "topical"
  | "accessory";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  name: IconName;
  size?: number;
  title?: string;
}

// Retorna apenas o desenho interno de cada ícone.
function getIconContent(name: IconName): ReactNode {
  switch (name) {
    case "home":
      return (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </>
      );

    case "store":
      return (
        <>
          <path d="M4 10v10h16V10" />
          <path d="M3 10 5 4h14l2 6" />
          <path d="M8 20v-6h8v6" />
          <path d="M3 10c0 2 3 2 4 0 1 2 4 2 5 0 1 2 4 2 5 0 1 2 4 2 4 0" />
        </>
      );

    case "heart":
      return <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />;

    case "orders":
      return (
        <>
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <path d="M9 4V2h6v2" />
          <path d="M9 10h6M9 14h6M9 18h4" />
        </>
      );

    case "user":
      return (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      );

    case "cart":
      return (
        <>
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
          <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
        </>
      );

    case "help":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.4 2.4 0 1 1 3.2 2.3c-.7.3-1 1-1 1.7" />
          <path d="M12 17h.01" />
        </>
      );

    case "location":
      return (
        <>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      );

    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </>
      );

    case "plus":
      return <path d="M12 5v14M5 12h14" />;

    case "star":
      return <path d="m12 2 3 6 6.5 1-4.8 4.7 1.2 6.5L12 17l-5.9 3.2 1.2-6.5L2.5 9 9 8Z" />;

    case "chevron-down":
      return <path d="m6 9 6 6 6-6" />;

    case "menu":
      return <path d="M4 6h16M4 12h16M4 18h16" />;

    case "close":
      return <path d="m6 6 12 12M18 6 6 18" />;

    case "logout":
      return (
        <>
          <path d="M10 17l5-5-5-5M15 12H3" />
          <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
        </>
      );

    case "flower":
      return (
        <>
          <path d="M12 22v-9" />
          <path d="M12 13C7 13 5 10 5 7c3 0 6 1 7 4" />
          <path d="M12 13c5 0 7-3 7-6-3 0-6 1-7 4" />
          <path d="M12 9c-2-2-2-5 0-7 2 2 2 5 0 7Z" />
        </>
      );

    case "edible":
      return (
        <>
          <rect x="7" y="7" width="10" height="10" rx="3" />
          <path d="m7 9-4-2 1 4-1 4 4-2M17 9l4-2-1 4 1 4-4-2" />
        </>
      );

    case "pre-roll":
      return (
        <>
          <path d="m5 19 4-1L20 7l-3-3L6 15Z" />
          <path d="m15 6 3 3M5 19l1-4" />
        </>
      );

    case "concentrate":
      return <path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z" />;

    case "vape":
      return (
        <>
          <rect x="8" y="6" width="8" height="15" rx="2" />
          <path d="M10 6V2h4v4M10 16h4" />
        </>
      );

    case "topical":
      return (
        <>
          <path d="M5 8h14v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z" />
          <path d="M6 4h12v4M9 14h6" />
        </>
      );

    case "accessory":
      return (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
        </>
      );
  }
}

function Icon({
  name,
  size = 24,
  title,
  className = "",
  ...rest
}: IconProps) {
  return (
    <svg
      {...rest}
      className={["ihemp-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
    >
      {title && <title>{title}</title>}
      {getIconContent(name)}
    </svg>
  );
}

export default Icon;

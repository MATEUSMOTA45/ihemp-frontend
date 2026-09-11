export type CategoryIconName =
  | "flower"
  | "edible"
  | "pre-roll"
  | "concentrate"
  | "vape"
  | "topical"
  | "accessory";

type CategoryIconProps = {
  name: CategoryIconName;
  size?: number;
};

const commonProps = {
  stroke: "#163720",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
};

function CategoryIcon({ name, size = 42 }: CategoryIconProps) {
  const icon = {
    flower: (
      <>
        <path d="M24 42V19" {...commonProps} />
        <path d="M24 27C19 24 16 20 15 15c5 1 8 4 9 8" fill="#78c96b" {...commonProps} />
        <path d="M24 27c5-3 8-7 9-12-5 1-8 4-9 8" fill="#50ad56" {...commonProps} />
        <path d="M24 22c-3-5-4-10 0-16 4 6 3 11 0 16Z" fill="#39a84c" {...commonProps} />
        <path d="M21 30c-5-1-9 0-12 4 5 2 9 1 13-2" fill="#9ddc75" {...commonProps} />
        <path d="M27 30c5-1 9 0 12 4-5 2-9 1-13-2" fill="#67c665" {...commonProps} />
      </>
    ),
    edible: (
      <>
        <circle cx="16" cy="12" r="4" fill="#a9d96f" {...commonProps} />
        <circle cx="32" cy="12" r="4" fill="#a9d96f" {...commonProps} />
        <path d="M14 20c0-7 4-11 10-11s10 4 10 11c0 4-2 7-5 9 4 3 6 7 6 12H13c0-5 2-9 6-12-3-2-5-5-5-9Z" fill="#bce67b" {...commonProps} />
        <circle cx="20" cy="19" r="1.2" fill="#163720" stroke="none" />
        <circle cx="28" cy="19" r="1.2" fill="#163720" stroke="none" />
        <path d="M21 24c2 1.5 4 1.5 6 0M15 31l-6 5m24-5 6 5M18 41l-2 4m14-4 2 4" {...commonProps} />
      </>
    ),
    "pre-roll": (
      <g transform="rotate(-38 24 24)">
        <path d="M20 8h8l-1.5 29h-5Z" fill="#f2dfb0" {...commonProps} />
        <path d="M21.5 37h5L26 44h-4Z" fill="#9ecb75" {...commonProps} />
        <path d="M20 8h8" {...commonProps} />
        <path d="M22 12c2 1 4 1 6 0" stroke="#c18b43" strokeWidth="1.4" />
      </g>
    ),
    concentrate: (
      <>
        <ellipse cx="24" cy="36" rx="15" ry="6" fill="#f1c94d" {...commonProps} />
        <path d="M18 35c1-7 4-13 7-18 3 5 5 10 5 14 0 5-3 8-7 8-2 0-4-1-5-4Z" fill="#f6d85e" {...commonProps} />
        <path d="M31 9 21 26" stroke="#596c61" strokeWidth="2.4" strokeLinecap="round" />
        <path d="m31 9 4-5" stroke="#163720" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M12 36c4 2 8 2 12 0 4 2 8 2 12 0" stroke="#d39422" strokeWidth="1.5" fill="none" />
      </>
    ),
    vape: (
      <>
        <rect x="17" y="12" width="14" height="31" rx="4" fill="#277848" {...commonProps} />
        <path d="M20 12V7h8v5" fill="#152b1d" {...commonProps} />
        <rect x="21" y="4" width="6" height="4" rx="1.5" fill="#202d24" {...commonProps} />
        <circle cx="24" cy="22" r="2.2" fill="#b9df72" {...commonProps} />
        <path d="M21 35h6" stroke="#b9df72" strokeWidth="1.8" />
      </>
    ),
    topical: (
      <>
        <rect x="15" y="17" width="18" height="27" rx="4" fill="#d9a744" {...commonProps} />
        <path d="M18 17v-5h12v5" fill="#21392a" {...commonProps} />
        <path d="M20 12V8h8v4" fill="#173722" {...commonProps} />
        <rect x="18" y="25" width="12" height="11" rx="2" fill="#dff1c2" {...commonProps} />
        <path d="M24 28c-2 2-3 4 0 6 3-2 2-4 0-6Z" fill="#45a84e" {...commonProps} />
      </>
    ),
    accessory: (
      <>
        <path d="M23 41C14 37 10 29 11 17c10 3 15 10 12 24Z" fill="#a8d96b" {...commonProps} />
        <path d="M25 41c9-4 13-12 12-24-10 3-15 10-12 24Z" fill="#68bd5d" {...commonProps} />
        <path d="M24 42c-2-11-5-17-10-21m10 21c2-11 5-17 10-21" {...commonProps} />
        <path d="M16 27h5m11 0h-5M18 33h4m8 0h-4" stroke="#4b934d" strokeWidth="1.4" />
      </>
    ),
  }[name];

  return (
    <svg
      aria-hidden="true"
      className="ihemp-category-icon"
      fill="none"
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      {icon}
    </svg>
  );
}

export default CategoryIcon;
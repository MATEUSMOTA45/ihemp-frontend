import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export type BadgeSize = "small" | "medium";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

function Badge({
  children,
  variant = "neutral",
  size = "small",
  dot = false,
  className = "",
  ...rest
}: BadgeProps) {
  // Define a aparência pelas propriedades recebidas.
  const badgeClasses = [
    "ihemp-badge",
    `ihemp-badge--${variant}`,
    `ihemp-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span {...rest} className={badgeClasses}>
      {dot && (
        <span
          className="ihemp-badge__dot"
          aria-hidden="true"
        />
      )}

      {children}
    </span>
  );
}

export default Badge;
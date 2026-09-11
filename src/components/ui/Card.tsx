import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "outlined"
  | "soft";

export type CardPadding =
  | "none"
  | "small"
  | "medium"
  | "large";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
}

function Card({
  children,
  variant = "default",
  padding = "medium",
  interactive = false,
  className = "",
  ...rest
}: CardProps) {
  // Monta as classes visuais escolhidas para o card.
  const cardClasses = [
    "ihemp-card",
    `ihemp-card--${variant}`,
    `ihemp-card--padding-${padding}`,
    interactive ? "ihemp-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...rest} className={cardClasses}>
      {children}
    </div>
  );
}

export default Card;
import type { HTMLAttributes, ReactNode } from "react";

export type ContainerSize =
  | "narrow"
  | "default"
  | "wide";

interface ContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
}

function Container({
  children,
  size = "default",
  className = "",
  ...rest
}: ContainerProps) {
  // Define a largura máxima do conteúdo.
  const containerClasses = [
    "ihemp-container",
    `ihemp-container--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...rest} className={containerClasses}>
      {children}
    </div>
  );
}

export default Container;
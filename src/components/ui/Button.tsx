import type { ButtonHTMLAttributes, ReactNode } from "react";

// Variações visuais disponíveis para o botão.
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

// Tamanhos padronizados pelo Design System.
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  // Monta as classes de acordo com as propriedades recebidas.
  const buttonClasses = [
    "ihemp-button",
    `ihemp-button--${variant}`,
    `ihemp-button--${size}`,
    fullWidth ? "ihemp-button--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && (
        <span
          className="ihemp-button__spinner"
          aria-hidden="true"
        />
      )}

      <span>{children}</span>
    </button>
  );
}

export default Button;
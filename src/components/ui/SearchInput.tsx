import type { InputHTMLAttributes } from "react";

interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

function SearchInput({
  containerClassName = "",
  className = "",
  placeholder = "Buscar produtos, lojas ou marcas...",
  ...rest
}: SearchInputProps) {
  const containerClasses = [
    "ihemp-search",
    containerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    "ihemp-search__input",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {/* Ícone de busca decorativo */}
      <svg
        className="ihemp-search__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      <input
        {...rest}
        type="search"
        className={inputClasses}
        placeholder={placeholder}
      />
    </div>
  );
}

export default SearchInput;
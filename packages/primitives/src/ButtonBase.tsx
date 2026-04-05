import { forwardRef, type CSSProperties } from "react";

import { primitiveVars } from "./styles";
import type { ButtonBaseProps } from "./types";

const baseButtonStyle: CSSProperties = {
  alignItems: "center",
  appearance: "none",
  background: `var(${primitiveVars.foreground})`,
  border: `1px solid var(${primitiveVars.foreground})`,
  borderRadius: `var(${primitiveVars.radius})`,
  color: `var(${primitiveVars.surface})`,
  cursor: "pointer",
  display: "inline-flex",
  font: "inherit",
  fontWeight: 600,
  gap: "0.5rem",
  justifyContent: "center",
  minHeight: "2.5rem",
  padding: "0.625rem 1rem",
  transition: "opacity 120ms ease, transform 120ms ease"
};

const spinnerStyle: CSSProperties = {
  animation: "domglyph-spin 0.8s linear infinite",
  border: "2px solid currentColor",
  borderBottomColor: "transparent",
  borderRadius: "999px",
  display: "inline-block",
  height: "0.9rem",
  width: "0.9rem"
};

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (
    {
      children,
      className,
      disabled = false,
      loading = false,
      loadingLabel = "Loading",
      style,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        {...rest}
        aria-busy={loading || undefined}
        className={className}
        disabled={isDisabled}
        ref={ref}
        style={{
          ...baseButtonStyle,
          opacity: isDisabled ? 0.64 : 1,
          ...style
        }}
        type={type}
      >
        {loading ? (
          <>
            <span aria-hidden="true" style={spinnerStyle} />
            <span>{loadingLabel}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

ButtonBase.displayName = "ButtonBase";

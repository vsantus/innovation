"use client";

import { forwardRef } from "react";
import type { CSSProperties, InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  leftIcon?: ReactNode;
};

const baseStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid var(--border)",
  background: "rgba(255, 255, 255, 0.9)",
  padding: "0.9rem 1rem",
  color: "var(--text)",
  outline: "none",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, label, id, leftIcon, style, ...props },
  ref,
) {
  return (
    <label htmlFor={id} style={{ display: "grid", gap: "0.5rem" }}>
      {label ? (
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>
          {label}
        </span>
      ) : null}
      <span style={{ position: "relative", display: "block" }}>
        {leftIcon ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "3.4rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#676767",
              width: "1.35rem",
              height: "1.35rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.35rem",
              lineHeight: 1,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={id}
          style={{
            ...baseStyle,
            borderColor: error ? "var(--danger)" : "var(--border)",
            ...style,
            ...(leftIcon ? { paddingLeft: "5.9rem" } : {}),
          }}
          {...props}
        />
      </span>
      {error ? (
        <span style={{ fontSize: "0.85rem", color: "var(--danger)" }}>{error}</span>
      ) : null}
    </label>
  );
});

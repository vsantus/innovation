"use client";

import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
};

const baseStyle = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid var(--border)",
  background: "rgba(255, 255, 255, 0.9)",
  padding: "0.9rem 1rem",
  color: "var(--text)",
  outline: "none",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, label, id, style, ...props },
  ref,
) {
  return (
    <label htmlFor={id} style={{ display: "grid", gap: "0.5rem" }}>
      {label ? (
        <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text)" }}>
          {label}
        </span>
      ) : null}
      <input
        ref={ref}
        id={id}
        style={{
          ...baseStyle,
          borderColor: error ? "var(--danger)" : "var(--border)",
          ...style,
        }}
        {...props}
      />
      {error ? (
        <span style={{ fontSize: "0.85rem", color: "var(--danger)" }}>{error}</span>
      ) : null}
    </label>
  );
});

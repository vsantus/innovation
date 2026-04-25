"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export function Button({ fullWidth, disabled, style, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        width: fullWidth ? "100%" : undefined,
        border: "none",
        borderRadius: "14px",
        padding: "0.95rem 1.2rem",
        fontWeight: 700,
        color: "#ffffff",
        background: disabled ? "#89b7a8" : "var(--primary)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s ease, transform 0.2s ease",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

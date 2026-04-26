import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          green: "#8ec605",
          greenHover: "#7caf04",
        },
        product: {
          badge: "#02aeca",
          border: "#e3e8e4",
          divider: "#edf1ee",
          text: "#202020",
          titleCode: "#4e4e4e",
          body: "#4f5d57",
          muted: "#52635c",
          subtle: "#66756e",
          label: "#5a625d",
          price: "#353535",
          note: "#666f69",
          panel: "#f7f9f6",
          control: "#d8e2dc",
          favorite: "#f6b800",
          favoriteMuted: "#b8c2bd",
        },
      },
      boxShadow: {
        product: "0 8px 22px rgba(31, 55, 45, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;

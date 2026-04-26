import type { Metadata } from "next";

import favicon from "@/assets/faviconbrind.png";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovation Brindes",
  description: "Painel Innovation Brindes",
  icons: {
    icon: favicon.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

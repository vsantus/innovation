import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovation - Login",
  description: "Painel Innovation Brindes",
  icons: {
    icon: "/icon.svg",
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

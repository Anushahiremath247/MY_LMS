import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lazy Learning",
  description: "AI-powered learning platform with structured courses and calm, modern UI."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

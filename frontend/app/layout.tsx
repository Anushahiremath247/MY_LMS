import type { Metadata } from "next";
import "./globals.css";
import { ToastRegion } from "@/components/ui/toast-region";

export const metadata: Metadata = {
  title: "Lazy Learning",
  description: "AI-powered learning platform with structured courses and calm, modern UI.",
  icons: {
    icon: [
      { url: "/panda-logo.svg", type: "image/svg+xml" },
      { url: "/panda-logo.png", type: "image/png" }
    ],
    shortcut: "/panda-logo.svg",
    apple: "/panda-logo.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastRegion />
      </body>
    </html>
  );
}

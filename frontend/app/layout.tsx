import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthBootstrap } from "@/components/auth-bootstrap";
import { CommerceHydrator } from "@/components/commerce-hydrator";
import { MotionProvider } from "@/components/ui/motion-provider";
import { ToastRegion } from "@/components/ui/toast-region";

export const metadata: Metadata = {
  title: "Lazy Learning",
  description: "AI-powered learning platform with structured courses and calm, modern UI.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthBootstrap />
        <CommerceHydrator />
        <MotionProvider>{children}</MotionProvider>
        <ToastRegion />
      </body>
    </html>
  );
}

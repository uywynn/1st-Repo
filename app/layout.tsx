import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photo Wall",
  description: "Share photos and videos from one event.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// app/layout.js (Server)
import "./globals.css";
import ClientWrapper from "./clientWrapper";
import { Analytics } from "@vercel/analytics/next";
// import { icons } from "lucide-react";

export const metadata = {
  title: "Persona AI",
  description: "Talk with any persona you can imagine.",
  icons: {
    icon: "/favi.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        {/* <link rel="icon" href="/logo.png" /> */}
      </head>
      <body>
        <Analytics />
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

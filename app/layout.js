// app/layout.js (Server)
import "./globals.css";
import ClientWrapper from "./clientWrapper";

export const metadata = {
  title: "Persona AI",
  description: "Talk with any persona you can imagine.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

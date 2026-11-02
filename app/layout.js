import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import SiteNav from "./components/SiteNav";

export const metadata = {
  title: "OpenPinas",
  description: "Open data platform for Philippine power structures.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SiteNav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

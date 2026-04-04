import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata = {
  title: "OpenPinas",
  description: "Open data platform for Philippine power structures.",
};

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 clamp(20px, 5vw, 64px)",
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid #e5e5e3",
  boxSizing: "border-box",
};

const navLinkStyle = {
  fontSize: 14,
  color: "#6b7280",
  textDecoration: "none",
  fontWeight: 500,
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
        <nav style={navStyle} aria-label="Site navigation">
          <a href="/" style={{ fontWeight: 700, fontSize: 16, color: "#0d0d0d", textDecoration: "none", letterSpacing: "-0.01em" }}>
            OpenPinas
          </a>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            <a href="/weekly-reviews/index.html" style={navLinkStyle}>Reviews</a>
            <a href="/dynasties-network-visualization.html" style={navLinkStyle}>Map</a>
            <a href="/interactive-timeline/index.html" style={navLinkStyle}>Timeline</a>
            <a href="https://github.com/dat-angel/openpinas" target="_blank" rel="noopener noreferrer" style={navLinkStyle}>GitHub</a>
          </div>
        </nav>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

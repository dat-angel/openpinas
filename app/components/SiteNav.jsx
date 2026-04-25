"use client";

import { useState } from "react";

const navStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderBottom: "1px solid #e5e5e3",
  boxSizing: "border-box",
};

const innerStyle = {
  height: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 clamp(20px, 5vw, 64px)",
};

const linkStyle = {
  fontSize: 14,
  color: "#6b7280",
  textDecoration: "none",
  fontWeight: 500,
};

const LINKS = [
  { href: "/visualizations/index.html", label: "Visuals" },
  { href: "/weekly-reviews/index.html", label: "Reviews" },
  { href: "/dynasties-network-visualization.html", label: "Map" },
  { href: "/interactive-timeline/index.html", label: "Timeline" },
  { href: "https://github.com/dat-angel/openpinas", label: "GitHub", external: true },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={navStyle} aria-label="Site navigation">
      <div style={innerStyle}>
        <a
          href="/"
          style={{ fontWeight: 700, fontSize: 16, color: "#0d0d0d", textDecoration: "none", letterSpacing: "-0.01em" }}
        >
          OpenPinas
        </a>

        {/* Desktop links */}
        <div
          style={{ display: "flex", gap: 28, alignItems: "center" }}
          className="site-nav-desktop"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={linkStyle}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="site-nav-hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 4px",
            color: "#0d0d0d",
          }}
        >
          {open ? (
            /* X icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <line x1="3" y1="5" x2="17" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="3" y1="15" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          id="site-nav-mobile-menu"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px clamp(20px, 5vw, 64px) 20px",
            borderTop: "1px solid #e5e5e3",
            gap: 4,
          }}
          className="site-nav-mobile-menu"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                ...linkStyle,
                padding: "10px 0",
                fontSize: 15,
                borderBottom: "1px solid #f0f0ee",
              }}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 639px) {
          .site-nav-desktop { display: none !important; }
          .site-nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

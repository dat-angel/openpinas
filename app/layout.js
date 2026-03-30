import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "OpenPinas",
  description: "Open data platform for Philippine power structures.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

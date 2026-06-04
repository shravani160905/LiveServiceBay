import React from "react";

export const metadata = {
  title: "Live Service Bay System",
  description: "Professional Service Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, height: "100%" }}>
      <body style={{ margin: 0, padding: 0, height: "100%" }}>
        {children}
      </body>
    </html>
  );
}
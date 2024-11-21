import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Unified Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>Header!</div>
        <Suspense>{children}</Suspense>
        <div>Footer!</div>
      </body>
    </html>
  );
}

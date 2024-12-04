import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/page-components/Header/Header";
import EnsureSession from "@/page-components/EnsureSession/EnsureSession";
import "./global.css";
import Providers from "./providers";

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
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/lbk1xay.css" />
      </head>
      <body>
        <Providers>
          <Header />
          <Suspense>
            <EnsureSession />
            <main>{children}</main>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}

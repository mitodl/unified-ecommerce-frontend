import type { Metadata } from "next";
import { Suspense } from "react";
import { ThemeProvider } from "@mitodl/smoot-design";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Header } from "@/components/Header/Header";
import "./global.css";

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
        <AppRouterCacheProvider>
          <ThemeProvider>
            <Header />
            <Suspense>{children}</Suspense>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

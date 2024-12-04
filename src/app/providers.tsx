"use client";

import { ThemeProvider } from "@mitodl/smoot-design";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./getQueryClient";
import { useEffect } from "react";
import { devSameSiteCheck } from "@/services/ecommerce/client";

const Providers: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient();
  useEffect(() => {
    devSameSiteCheck();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouterCacheProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AppRouterCacheProvider>
    </QueryClientProvider>
  );
};

export default Providers;

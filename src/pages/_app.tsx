import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import PageLayout from "@/components/layout/PageLayout";
import { ThemeProvider } from "@/context/ThemeContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <PageLayout>
            <Component {...pageProps} />
            <Toaster />
          </PageLayout>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

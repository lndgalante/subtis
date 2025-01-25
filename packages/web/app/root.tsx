import type { LinksFunction } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/remix";

// layout
import { HomeFooter } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";

// ui
import { Toaster } from "~/components/ui/toaster";
import { TooltipProvider } from "~/components/ui/tooltip";

// lib
import "~/lib/analytics";
import { queryClient } from "~/lib/react-query";

// internals
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NuqsAdapter>
          <Header />
          <main className="min-h-screen bg-right-top bg-[url('/hero-bg.webp')] bg-contain bg-no-repeat selection:text-zinc-950 selection:bg-zinc-50">
            <div className="container mx-auto px-4 min-h-screen flex flex-col">
              <Outlet />
              <HomeFooter />
            </div>
            <Toaster />
          </main>
        </NuqsAdapter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

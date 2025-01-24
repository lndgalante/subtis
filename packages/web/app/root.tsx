import type { LinksFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/remix";

// layout
import { HomeFooter } from "~/components/layout/footer";
import { SearchButton } from "~/components/layout/search-button";

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
          <main className="min-h-screen bg-right-top bg-[url('/hero-bg.webp')] bg-contain bg-no-repeat selection:text-zinc-950 selection:bg-zinc-50">
            <div className="container mx-auto px-4 min-h-screen flex flex-col">
              <nav className="flex items-center justify-between py-4">
                <Link to="/" className="cursor-pointer">
                  <img
                    src="/logo.webp"
                    alt="Subtis"
                    className="w-20 h-[32.27px] hover:scale-105 transition-all ease-in-out"
                  />
                </Link>
                <SearchButton />
              </nav>
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

import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";
import { musicGroupLd } from "@/lib/band";

const favicon = "/favicon.png";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold" style={{ color: "var(--color-globo)" }}>
          404
        </h1>
        <h2 className="mt-4 text-xl font-display font-semibold">
          La memoria no llega tan lejos
        </h2>
        <p className="mt-2 text-sm opacity-70" style={{ color: "var(--color-teal)" }}>
          La página que buscas no existe o se borró con la luz del mediodía.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 font-display uppercase tracking-widest text-sm hard-shadow"
            style={{ background: "var(--color-globo)", color: "var(--color-arena)" }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Club Mediodía — Un globo en la terraza" },
      {
        name: "description",
        content:
          "Club Mediodía. Psicodelia doméstica desde la terraza. Nuevo álbum: Un globo en la terraza.",
      },
      { name: "author", content: "Club Mediodía" },
      {
        name: "google-site-verification",
        content: "n9Y52v1RM5CIckSDJmTYLYLM38GWwVAj4-TY41tpRCE",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Club Mediodía — Un globo en la terraza" },
      {
        property: "og:description",
        content:
          "Psicodelia doméstica desde una terraza de Barcelona. Nuevo álbum «Un globo en la terraza», 1 de mayo de 2026.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://clubmediodia.es/og-default.jpg" },
      { property: "og:image:secure_url", content: "https://clubmediodia.es/og-default.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "1200" },
      { property: "og:image:alt", content: "Club Mediodía" },
      { name: "twitter:image", content: "https://clubmediodia.es/og-default.jpg" },
    ],
    links: [
      { rel: "icon", href: favicon },
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: "/fonts/space-grotesk-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [{ type: "application/ld+json", children: musicGroupLd() }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <GrainOverlay />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </>
  );
}


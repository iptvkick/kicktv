import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import "../styles.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "KickTV SaaS",
      },
      { property: "og:title", content: "KickTV SaaS" },
      { name: "twitter:title", content: "KickTV SaaS" },
      { name: "description", content: "KickTV is a SaaS application for generating and managing single-page websites." },
      { property: "og:description", content: "KickTV is a SaaS application for generating and managing single-page websites." },
      { name: "twitter:description", content: "KickTV is a SaaS application for generating and managing single-page websites." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/352ca504-6ef8-478d-aa37-770ccea12888/id-preview-8ddcf891--7ca0b1f1-196c-4073-8eb3-769066a39131.lovable.app-1780946574636.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/352ca504-6ef8-478d-aa37-770ccea12888/id-preview-8ddcf891--7ca0b1f1-196c-4073-8eb3-769066a39131.lovable.app-1780946574636.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { AlertCircle, FileQuestion } from "lucide-react";
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
        title: "KickTV - O Futuro do Entretenimento IPTV",
      },
      { property: "og:title", content: "KickTV - O Futuro do Entretenimento IPTV" },
      { name: "twitter:title", content: "KickTV - O Futuro do Entretenimento IPTV" },
      { name: "description", content: "Assista filmes, séries e canais ao vivo em alta definição com a KickTV. O melhor do entretenimento IPTV em qualquer dispositivo." },
      { property: "og:description", content: "Assista filmes, séries e canais ao vivo em alta definição com a KickTV. O melhor do entretenimento IPTV em qualquer dispositivo." },
      { name: "twitter:description", content: "Assista filmes, séries e canais ao vivo em alta definição com a KickTV. O melhor do entretenimento IPTV em qualquer dispositivo." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/352ca504-6ef8-478d-aa37-770ccea12888/id-preview-8ddcf891--7ca0b1f1-196c-4073-8eb3-769066a39131.lovable.app-1780946574636.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/352ca504-6ef8-478d-aa37-770ccea12888/id-preview-8ddcf891--7ca0b1f1-196c-4073-8eb3-769066a39131.lovable.app-1780946574636.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function NotFoundComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background text-foreground font-sans">
        <FileQuestion className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2">Página não encontrada</h1>
        <p className="text-foreground/60 mb-8">Parece que você se perdeu, ou a página foi removida.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
          Voltar para a Home
        </Link>
      </div>
    </RootDocument>
  );
}

function ErrorComponent() {
  return (
    <RootDocument>
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background text-foreground font-sans">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-4xl font-bold mb-2">Ops! Algo deu errado</h1>
        <p className="text-foreground/60 mb-8">Ocorreu um erro inesperado. Tente novamente mais tarde.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
          Voltar para a Home
        </Link>
      </div>
    </RootDocument>
  );
}

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

import "./globals.css";
import { bricolage, inter } from "./fonts";

// Requests outside /en and /es (rare: the proxy redirects most). Bilingual by design.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <head>
        <title>404 | JK Speedy Driving School</title>
        <meta name="robots" content="noindex" />
      </head>
      <body className="grid min-h-svh place-items-center bg-asphalt p-6 text-paper">
        <main className="max-w-xl text-center">
          <p className="font-display text-7xl font-extrabold text-yellow">404</p>
          <h1 className="mt-4 text-h2">Wrong turn. <span lang="es">Te equivocaste de salida.</span></h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a className="btn btn-primary" href="/en">Back to home</a>
            <a className="btn btn-ghost-dark" href="/es" lang="es">Volver al inicio</a>
          </div>
        </main>
      </body>
    </html>
  );
}

import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import AnimatedBackground from "@/components/animated-background"
import { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cifras y Letras Online | Juego de Palabras y Números",
  description:
    "Juega a Cifras y Letras online gratis. El clásico juego de palabras y números ahora disponible para jugar en línea. Crea partidas online y desafía a tus amigos.",
  keywords:
    "cifras y letras online, cifras y letras juego, cifras y letras juego online, cifras y letras partida online, juego de palabras, juego de números, concurso televisión",
  authors: [{ name: "Rafael Anguita" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://cifras-y-letras.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Cifras y Letras Online",
              description:
                "Juego online basado en el concurso de televisión Cifras y Letras. Juega partidas online y desafía a tus amigos.",
              applicationCategory: "GameApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              author: {
                "@type": "Person",
                name: "Rafael Anguita",
                email: "rafa.anguita00@gmail.com",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnimatedBackground />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

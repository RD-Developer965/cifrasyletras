import type { Metadata } from "next"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, Calculator, Gamepad2, Users, Clock, Trophy, Star, Share2, Mail, ItalicIcon as AlphabetIcon, } from "lucide-react"
import OpenModalButton from "./OpenModalButton"

export const metadata: Metadata = {
  title: "Cifras y Letras Online | Juego de Palabras y Números Gratis",
  description:
    "Juega a Cifras y Letras online gratis. El clásico concurso de televisión ahora disponible como juego online. Crea partidas online y desafía a tus amigos con pruebas de palabras y números.",
  keywords:
    "cifras y letras online, cifras y letras juego, cifras y letras juego online, cifras y letras partida online, juego educativo, concurso, matemáticas, vocabulario",
  authors: [{ name: "Rafael Anguita" }],
  openGraph: {
    title: "Cifras y Letras Online | Juego Gratis",
    description:
      "Juega al clásico concurso de televisión Cifras y Letras en versión online. Crea partidas y compite con amigos.",
    type: "website",
    siteName: "Cifras y Letras Online",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cifras y Letras Online | Juego Gratis",
    description:
      "Juega al clásico concurso de televisión Cifras y Letras en versión online. Crea partidas y compite con amigos.",
  },
  alternates: {
    canonical: "https://cifras-y-letras.vercel.app",
  },
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Cifras y Letras</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto py-8">
        <section className="py-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            Juega a <span className="text-primary">Cifras y Letras</span> Gratis
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8 text-muted-foreground">
            El clásico concurso de televisión, crea partidas y pon a prueba
            tus habilidades lingüísticas y matemáticas en este desafiante juego.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <OpenModalButton text="Crear Partida" />
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <a href="#como-jugar">Cómo Jugar</a>
            </Button>
          </div>
        </section>

        <section className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <AlphabetIcon className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Prueba de Letras</h3>
              <p className="text-muted-foreground text-center">
                Forma la palabra más larga posible con las letras proporcionadas. Cuanto más
                larga sea la palabra, más puntos obtendrás.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Desafío de Números</h3>
              <p className="text-muted-foreground text-center">
                Utiliza operaciones matemáticas para acercarte lo más posible al número objetivo
                utilizando los números disponibles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Gamepad2 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Multijugador Local</h3>
              <p className="text-muted-foreground text-center">
                Juega a Cifras y Letras online con amigos o familiares en el mismo dispositivo y demuestra quién tiene las mejores habilidades
                en este clásico juego.
              </p>
            </CardContent>
          </Card>
        </section>

        <section id="como-jugar" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Cómo Jugar a Cifras y Letras</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <AlphabetIcon className="mr-2 h-5 w-5 text-primary" />
                Prueba de Letras
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Se generan 9 letras aleatorias (vocales y consonantes).</li>
                <li>Tienes un tiempo limitado para formar la palabra más larga posible.</li>
                <li>Solo puedes usar las letras mostradas.</li>
                <li>Cuantas más letras tenga tu palabra, más puntos obtendrás en el juego.</li>
                <li>La palabra debe existir en el diccionario del juego.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Desafío de Números
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Se generan 6 números aleatorios y un número objetivo.</li>
                <li>Tienes un tiempo limitado para acercarte lo más posible al número objetivo.</li>
                <li>Puedes usar las operaciones básicas: suma, resta, multiplicación y división.</li>
                <li>Cuanto más cerca estés del objetivo, más puntos obtendrás en el juego.</li>
              </ol>
            </div>
          </div>

          <div className="text-center mt-12">
            <OpenModalButton text="Jugar Ahora" />
          </div>
        </section>

        <section className="py-16 bg-primary/5 rounded-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Características del Juego</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multijugador</h3>
                <p className="text-sm text-muted-foreground">
                  Juega a Cifras y Letras con hasta 4 jugadores en el mismo dispositivo
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tiempo Configurable</h3>
                <p className="text-sm text-muted-foreground">
                  Ajusta el tiempo de cada ronda en tu partida según tu preferencia
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Trophy className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sistema de Puntuación</h3>
                <p className="text-sm text-muted-foreground">Compite por la puntuación más alta en este juego</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Cifras y Letras Online</h2>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cifras y Letras Juego Online. Todos los derechos reservados.
              <h3 className="font-semibold mb-2">Contacto</h3>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:rafa.anguita00@gmail.com" className="hover:text-primary transition-colors">
                    rafa.anguita00@gmail.com
                  </a>
                </p>
                <p className="mt-2 text-xs">
                  ¿Tienes preguntas o sugerencias sobre el juego? No dudes en contactar con el desarrollador.
                </p>
            </div>
          </div>
        </div>
      </footer>
      
    </div>
  )
}

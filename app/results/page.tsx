"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Home, RefreshCw } from "lucide-react"
import { useGameStore } from "@/lib/store"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ResultsPage() {
  const router = useRouter()
  const { gameState, resetGame } = useGameStore()
  const { config } = gameState

  // Ordenar las puntuaciones de mayor a menor
  const sortedPlayers = [...config.players].sort((a, b) => b.score - a.score)

  useEffect(() => {
    // Si no hay configuración, redirigir a la página principal
    if (!config || config.players.length === 0) {
      router.push("/")
    } else {
      // Mostrar notificación con el ganador
      if (sortedPlayers.length > 0) {
        const winner = sortedPlayers[0]
        toast.success(`¡Felicidades ${winner.name}!`, {
          description: `Has ganado con ${winner.score} puntos.`,
        })
      }
    }
  }, [config, router, sortedPlayers])

  const handleNewGame = () => {
    // Reiniciar el juego y volver a la página principal
    resetGame()
    toast.info("Preparando nueva partida...")
    router.push("/")
  }

  const getIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-8 w-8 text-yellow-500" />
      case 1:
        return <Medal className="h-8 w-8 text-gray-400" />
      case 2:
        return <Award className="h-8 w-8 text-amber-700" />
      default:
        return null
    }
  }

  if (!config) {
    return null
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
            Resultados finales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700"
                style={{
                  backgroundColor: index === 0 ? "rgba(250, 204, 21, 0.1)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  {getIcon(index)}
                  <span className="text-lg font-medium">{player.name}</span>
                </div>
                <span className="text-2xl font-bold">{player.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <Button onClick={handleNewGame} className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Nueva partida
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
            <Home className="mr-2 h-4 w-4" />
            Menú principal
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

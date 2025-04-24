"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LettersRound from "@/components/letters-round"
import NumbersRound from "@/components/numbers-round"
import ScoreBoard from "@/components/score-board"
import GameTimer from "@/components/newGameModal/game-timer"
import { useGameStore } from "@/lib/store"
import { toast } from "sonner"
import { ThemeToggle } from "@/components/theme-toggle"
import { Play, ArrowRight, Home, ItalicIcon as AlphabetLatin, Calculator } from "lucide-react"

export default function GameBoard() {
  const router = useRouter()
  const { gameState, startRound, activateRound, nextRound } = useGameStore()

  const { config, currentRound, currentType, roundState } = gameState

  const [playerOrder, setPlayerOrder] = useState<string[]>([...gameState.config.players].sort(() => Math.random() - 0.5).map((p) => p.id))
  const [currentPlayer, setCurrentPlayer] = useState<number>(0)

  function getActivePlayerId(): string {
    return playerOrder[currentPlayer || 0]
  }

  useEffect(() => {
    // Si no hay configuración, redirigir a la página principal
    if (!config || config.players.length === 0) {
      router.push("/")
    }
  }, [config, router])

  const handleStartRound = () => {
    startRound()
    toast.info(`¡Comienza la ronda de ${currentType === "letters" ? "letras" : "números"}!`, {
      description: `Tienes ${currentType === "letters" ? config.lettersRoundTime : config.numbersRoundTime
        } segundos para encontrar la mejor solución.`,
    })
  }

  const handleEndTimer = () => {
    activateRound()
    toast.success("¡Tiempo finalizado!", {
      description: "Ahora puedes introducir tu solución.",
    })
  }

  const handleNextRound = () => {
    nextRound()
    if (currentRound < config.rounds) {
      setPlayerOrder([...gameState.config.players].sort(() => Math.random() - 0.5).map((p) => p.id))
      setCurrentPlayer(0)
      toast.info("Preparando siguiente ronda...")
    } else {
      // Fin del juego
      toast.success("¡Juego completado!", {
        description: "Vamos a ver los resultados finales.",
      })
      router.push("/results")
    }
  }

  const handleHome = () => {
    if (confirm("¿Estás seguro de que quieres volver al menú principal? Se perderá el progreso actual.")) {
      router.push("/")
    }
  }

  // Determinar el tiempo de la ronda según el tipo
  const roundTime = currentType === "letters" ? config.lettersRoundTime : config.numbersRoundTime

  if (!config || !currentType) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleHome} className="mr-2">
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            Ronda {currentRound} de {config.rounds}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {roundState === 'initiated' && (
            <Button onClick={handleStartRound}>
              <Play className="mr-2 h-4 w-4" /> Comenzar ronda
            </Button>
          )}
          {roundState === 'started' && <GameTimer duration={roundTime} onTimeEnd={handleEndTimer} />}
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {currentType === "letters" ? (
                <>
                  <AlphabetLatin className="mr-2 h-5 w-5" /> Ronda de Letras
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" /> Ronda de Números
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>{currentType === "letters" ?
            <LettersRound activePlayerId={getActivePlayerId()} nextPlayer={() => setCurrentPlayer((prev) => prev + 1)} currentPlayerIndex={currentPlayer} /> :
            <NumbersRound activePlayerId={getActivePlayerId()} nextPlayer={() => setCurrentPlayer((prev) => prev + 1)} currentPlayerIndex={currentPlayer} />
          }
          </CardContent>
          <CardFooter className="flex justify-end">
            {roundState === 'completed' && (
              <Button onClick={handleNextRound}>
                {currentRound < config.rounds ? (
                  <>
                    Siguiente ronda <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Ver resultados"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <ScoreBoard />
      </div>
    </div>
  )
}

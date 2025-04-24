"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/store"
import { toast } from "sonner"
import { Check, X, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { generateRandomLetters, validateWord } from "@/lib/utils"

export default function LettersRound({ activePlayerId, nextPlayer, currentPlayerIndex }: LettersRoundProps) {

  const gameStore = useGameStore()
  const { gameState } = gameStore

  const [letters, setLetters] = useState<string[]>(generateRandomLetters(5, 4))

  // Estado para las letras seleccionadas por cada jugador
  const [playerSelectedLetters, setPlayerSelectedLetters] = useState<Record<string, string[]>>({})
  const [validations, setValidations] = useState<Record<string, boolean>>({})



  useEffect(() => {
    // Inicializar los inputs de los jugadores
    if (gameState.config.players) {
      const initialSelectedLetters: Record<string, string[]> = {}
      gameState.config.players.forEach((player) => {
        initialSelectedLetters[player.id] = []
      })
      setPlayerSelectedLetters(initialSelectedLetters)
      setValidations({})
    }
  }, [])

  // Función para seleccionar una letra
  const selectLetter = (letter: string, index: number) => {

    setPlayerSelectedLetters((prev) => {
      // Verificar si la letra ya está seleccionada
      const currentLetters = [...(prev[activePlayerId] || [])]

      // Añadir la letra con su índice original para poder deseleccionarla correctamente
      currentLetters.push(`${letter}-${index}`)

      return {
        ...prev,
        [activePlayerId]: currentLetters,
      }
    })
  }

  // Función para deseleccionar una letra
  const deselectLetter = (indexToRemove: number) => {
    if (!activePlayerId) return

    setPlayerSelectedLetters((prev) => {
      const currentLetters = [...(prev[activePlayerId] || [])]
      currentLetters.splice(indexToRemove, 1)

      return {
        ...prev,
        [activePlayerId]: currentLetters,
      }
    })
  }

  // Función para limpiar todas las letras seleccionadas
  const clearSelectedLetters = () => {
    if (!activePlayerId) return

    setPlayerSelectedLetters((prev) => ({
      ...prev,
      [activePlayerId]: [],
    }))
  }

  // Función para validar la palabra formada
  const validatePlayerWord = () => {
    if (!activePlayerId) return

    // Obtener solo las letras sin los índices
    const selectedLetters = playerSelectedLetters[activePlayerId] || []
    const word = selectedLetters
      .map((item) => item.split("-")[0])
      .join("")
      .toUpperCase()

    if (word.length === 0) {
      toast.error("No has seleccionado ninguna letra", {
        description: "Selecciona letras para formar una palabra.",
      })
      return
    }

    const isValid = validateWord(word)

    setValidations((prev) => ({
      ...prev,
      [activePlayerId]: isValid,
    }))

    // Guardar la palabra en el store
    gameStore.setPlayerWord(activePlayerId, word)

    // Asignar puntuación automáticamente (1 punto por letra si es válida)
    if (isValid) {
      const points = word.length
      gameStore.setPlayerRoundScore(activePlayerId, points)
      toast.success(`¡Palabra válida!`, {
        description: `${gameState.config.players.find((p) => p.id === activePlayerId)?.name} ha conseguido ${points} puntos.`,
      })
    } else {
      gameStore.setPlayerRoundScore(activePlayerId, 0)
      toast.error(`Palabra no válida`, {
        description: "La palabra no es válida o no se puede formar con las letras disponibles.",
      })
    }

    // Pasar al siguiente jugador si existe
    if (currentPlayerIndex < gameState.config.players.length - 1) {
      nextPlayer()
    } else {
      gameStore.completeRound()
    }
  }

  // Verificar si una letra está disponible (no ha sido seleccionada)
  const isLetterAvailable = (index: number) => {
    if (!activePlayerId) return true

    const selectedLetters = playerSelectedLetters[activePlayerId] || []
    return !selectedLetters.some((item) => item.includes(`-${index}`))
  }

  // Obtener el nombre del jugador activo
  const getActivePlayerName = () => {
    if (!activePlayerId) return ""
    const player = gameState.config.players.find((p) => p.id === activePlayerId)
    return player ? player.name : ""
  }

  return (
    <div className="space-y-6">

      {(gameState.roundState === 'started' || gameState.roundState === 'active') &&
        < div className="flex flex-wrap gap-2 justify-center">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              whileHover={gameState.roundState === 'active' && isLetterAvailable(index) ? { scale: 1.1 } : {}}
              whileTap={gameState.roundState === 'active' && isLetterAvailable(index) ? { scale: 0.95 } : {}}
              animate={{
                opacity: isLetterAvailable(index) ? 1 : 0.3,
                scale: isLetterAvailable(index) ? 1 : 0.9,
              }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`w-12 h-12 flex items-center justify-center text-2xl font-bold cursor-pointer ${gameState.roundState === 'active' && isLetterAvailable(index) ? "hover:bg-primary/10" : ""
                  }`}
                onClick={() => gameState.roundState === 'active' && isLetterAvailable(index) && selectLetter(letter, index)}
              >
                {letter}
              </Card>
            </motion.div>
          ))}
        </div>
      }

      <div className="space-y-6">
        {gameState.roundState === 'active' &&
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              Turno de {getActivePlayerName()}:
            </h3>

            {/* Área para mostrar las letras seleccionadas */}
            <div className="min-h-16 p-4 border rounded-md bg-muted/10">
              <div className="flex flex-wrap gap-2 mb-4">
                {(playerSelectedLetters[activePlayerId] || []).map((item, index) => {
                  const letter = item.split("-")[0]
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className="w-10 h-10 flex items-center justify-center text-xl font-bold cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => deselectLetter(index)}
                      >
                        {letter}
                      </Card>
                    </motion.div>
                  )
                })}
                {(playerSelectedLetters[activePlayerId] || []).length === 0 && (
                  <p className="text-muted-foreground text-sm italic">Selecciona letras para formar una palabra</p>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelectedLetters}
                  disabled={(playerSelectedLetters[activePlayerId] || []).length === 0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Limpiar
                </Button>
                <Button
                  onClick={validatePlayerWord}
                  disabled={(playerSelectedLetters[activePlayerId] || []).length === 0}
                >
                  Validar palabra
                </Button>
              </div>
            </div>
          </div>
        }
        {gameState.roundState === 'completed' &&

          <div className="text-center p-4">
            <h3 className="text-lg font-medium mb-2">Todos los jugadores han completado su turno</h3>
            <p>Pulsa "Siguiente ronda" para continuar</p>
          </div>
        }

        {/* Resumen de palabras formadas */}
        {
          Object.keys(validations).length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Palabras formadas:</h3>
              <div className="space-y-3">
                {gameState.config.players.map(
                  (player) =>
                    validations[player.id] !== undefined && <div key={player.id} className="space-y-2">
                      <div className="p-2 border rounded-md">
                        <div className="font-medium">{player.name} - {playerSelectedLetters[player.id]?.map((item) => item.split("-")[0]).join("") || ""}    </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className={`p-3 rounded-md flex items-center ${validations[player.id]
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                          }`}
                      >
                        {validations[player.id] ? (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            ¡Palabra válida! ({(playerSelectedLetters[player.id] || []).length} puntos)
                          </>
                        ) : (
                          <>
                            <X className="h-5 w-5 mr-2" />
                            Palabra no válida.
                          </>
                        )}

                      </motion.div>
                    </div>
                )}
              </div>
            </div>
          )
        }
      </div >
    </div >
  )
}

interface LettersRoundProps {
  activePlayerId: string
  nextPlayer: () => void
  currentPlayerIndex: number
}
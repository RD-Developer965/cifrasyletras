"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGameStore } from "@/lib/store"
import { toast } from "sonner"
import { Check, X, ItalicIcon as AlphabetLatin } from "lucide-react"

export default function LettersRound() {
  const { gameState, setPlayerWord, setPlayerRoundScore, validateWord } = useGameStore()
  const { isRoundActive, isRoundCompleted, letters, config } = gameState

  const [playerInputs, setPlayerInputs] = useState<Record<string, string>>({})
  const [validations, setValidations] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Inicializar los inputs de los jugadores
    if (config.players) {
      const initialInputs: Record<string, string> = {}
      config.players.forEach((player) => {
        initialInputs[player.id] = ""
      })
      setPlayerInputs(initialInputs)
      setValidations({})
    }
  }, [config.players, isRoundActive])

  const handleInputChange = (playerId: string, value: string) => {
    setPlayerInputs((prev) => ({
      ...prev,
      [playerId]: value,
    }))
  }

  const validatePlayerWord = (playerId: string) => {
    const word = playerInputs[playerId].toUpperCase()
    const isValid = validateWord(word, letters)

    setValidations((prev) => ({
      ...prev,
      [playerId]: isValid,
    }))

    // Guardar la palabra en el store
    setPlayerWord(playerId, word)

    // Asignar puntuación automáticamente (1 punto por letra si es válida)
    if (isValid) {
      const points = word.length
      setPlayerRoundScore(playerId, points)
      toast.success(`¡Palabra válida!`, {
        description: `${config.players.find((p) => p.id === playerId)?.name} ha conseguido ${points} puntos.`,
      })
    } else {
      setPlayerRoundScore(playerId, 0)
      toast.error(`Palabra no válida`, {
        description: "La palabra no es válida o no se puede formar con las letras disponibles.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {letters.map((letter, index) => (
          <Card key={index} className="w-12 h-12 flex items-center justify-center text-2xl font-bold">
            {letter}
          </Card>
        ))}
      </div>

      {isRoundCompleted && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center">
            <AlphabetLatin className="mr-2 h-5 w-5" />
            Palabras formadas:
          </h3>

          {config.players.map((player) => (
            <div key={player.id} className="space-y-2">
              <div className="font-medium">{player.name}</div>
              <div className="flex gap-2">
                <Input
                  value={playerInputs[player.id] || ""}
                  onChange={(e) => handleInputChange(player.id, e.target.value)}
                  placeholder="Escribe tu palabra"
                  className="flex-1"
                />
                <Button onClick={() => validatePlayerWord(player.id)}>Validar</Button>
              </div>

              {validations[player.id] !== undefined && (
                <div
                  className={`p-3 rounded-md flex items-center ${
                    validations[player.id]
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }`}
                >
                  {validations[player.id] ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      ¡Palabra válida! ({playerInputs[player.id].length} puntos)
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 mr-2" />
                      Palabra no válida. Verifica que uses solo las letras mostradas y que la palabra exista en el
                      diccionario.
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

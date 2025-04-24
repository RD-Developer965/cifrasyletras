"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useGameStore } from "@/lib/store"
import {
  PlusCircle,
  MinusCircle,
  ItalicIcon as AlphabetLatin,
  Calculator,
  Shuffle,
  Clock,
  Users,
  Play,
} from "lucide-react"
import { toast } from "sonner"

interface GameConfigFormProps {
  onClose?: () => void
}

export default function GameConfigForm({ onClose }: GameConfigFormProps) {
  const router = useRouter()
  const { gameState, setConfig, startGame } = useGameStore()

  const [players, setPlayers] = useState(gameState.config.players.map((p) => ({ id: p.id, name: p.name })))
  const [rounds, setRounds] = useState(gameState.config.rounds)
  const [gameType, setGameType] = useState(gameState.config.gameType)
  const [lettersRoundTime, setLettersRoundTime] = useState(gameState.config.lettersRoundTime)
  const [numbersRoundTime, setNumbersRoundTime] = useState(gameState.config.numbersRoundTime)

  const handleAddPlayer = () => {
    if (players.length < 4) {
      setPlayers([
        ...players,
        { id: Math.random().toString(36).substring(2, 9), name: `Jugador ${players.length + 1}` },
      ])
    }
  }

  const handleRemovePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = [...players]
      const removedName = newPlayers[index].name
      newPlayers.splice(index, 1)
      setPlayers(newPlayers)
    }
  }

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = { ...newPlayers[index], name }
    setPlayers(newPlayers)
  }

  const handleStartGame = () => {
    // Verificar que todos los jugadores tienen nombre
    const emptyNames = players.some((p) => !p.name.trim())
    if (emptyNames) {
      toast.error("Nombres incompletos", {
        description: "Todos los jugadores deben tener un nombre.",
      })
      return
    }

    // Actualizar la configuración en el store
    setConfig({
      players: players.map((p) => ({ id: p.id, name: p.name, score: 0 })),
      rounds,
      gameType: gameType as "letters" | "numbers" | "mixed",
      lettersRoundTime,
      numbersRoundTime,
    })

    // Iniciar el juego
    startGame()

    toast.success("¡Juego iniciado!", {
      description: `${rounds} rondas configuradas.`,
    })

    // Cerrar el modal si existe la función onClose
    if (onClose) {
      onClose()
    }

    // Navegar a la página del juego
    router.push("/game")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            Tipo de juego
          </h3>
          <RadioGroup  value={gameType} onValueChange={ a => setGameType(a as typeof gameType)} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="letters" id="letters" />
              <Label htmlFor="letters" className="flex items-center">
                <AlphabetLatin className="mr-2 h-4 w-4" />
                Solo letras
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="numbers" id="numbers" />
              <Label htmlFor="numbers" className="flex items-center">
                <Calculator className="mr-2 h-4 w-4" />
                Solo números
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed" className="flex items-center">
                <Shuffle className="mr-2 h-4 w-4" />
                Mixto (letras y números)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Número de rondas: {rounds}
          </h3>
          <Slider
            value={[rounds]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setRounds(value[0])}
            className="py-4"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <AlphabetLatin className="mr-2 h-5 w-5" />
            Tiempo para rondas de letras: {lettersRoundTime} segundos
          </h3>
          <Slider
            value={[lettersRoundTime]}
            min={15}
            max={120}
            step={5}
            onValueChange={(value) => setLettersRoundTime(value[0])}
            className="py-4"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Tiempo para rondas de números: {numbersRoundTime} segundos
          </h3>
          <Slider
            value={[numbersRoundTime]}
            min={15}
            max={180}
            step={5}
            onValueChange={(value) => setNumbersRoundTime(value[0])}
            className="py-4"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Jugadores
          </h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div key={player.id} className="flex items-center space-x-2">
                <Input
                  value={player.name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Jugador ${index + 1}`}
                  className="flex-1"
                />
                {players.length > 2 && (
                  <Button variant="outline" size="icon" onClick={() => handleRemovePlayer(index)} className="h-10 w-10">
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {players.length < 4 && (
            <Button variant="outline" onClick={handleAddPlayer} className="w-full mt-2">
              <PlusCircle className="h-4 w-4 mr-2" /> Añadir jugador
            </Button>
          )}
        </div>
      </div>

      <Button onClick={handleStartGame} className="w-full">
        <Play className="mr-2 h-4 w-4" /> Comenzar juego
      </Button>
    </div>
  )
}

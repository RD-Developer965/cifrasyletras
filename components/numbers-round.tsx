"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/lib/store"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, Minus, X, Divide, RefreshCw } from "lucide-react"
import { toast } from "sonner"

// Tipos para el drag and drop
const ItemTypes = {
  NUMBER: "number",
  OPERATION: "operation",
}

export default function NumbersRound() {
  const { gameState, setPlayerSolution, setPlayerRoundScore } = useGameStore()
  const { isRoundActive, isRoundCompleted, numbers, targetNumber, config } = gameState

  // Estado para almacenar las expresiones y resultados de cada jugador
  const [playerResults, setPlayerResults] = useState<Record<string, number | null>>({})
  const [playerOperations, setPlayerOperations] = useState<Record<string, string[]>>({})
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null)

  useEffect(() => {
    // Inicializar las expresiones de los jugadores
    if (config.players) {
      const initialResults: Record<string, number | null> = {}
      const initialOperations: Record<string, string[]> = {}
      config.players.forEach((player) => {
        initialResults[player.id] = null
        initialOperations[player.id] = []
      })
      setPlayerResults(initialResults)
      setPlayerOperations(initialOperations)

      // Establecer el primer jugador como actual si hay jugadores
      if (config.players.length > 0 && isRoundCompleted) {
        setCurrentPlayerId(config.players[0].id)
      } else {
        setCurrentPlayerId(null)
      }
    }
  }, [config.players, isRoundCompleted])

  // Función para evaluar la solución del jugador actual
  const evaluateCurrentPlayerSolution = () => {
    if (!currentPlayerId) return

    const result = playerResults[currentPlayerId]

    if (result === null) {
      toast.error("No hay solución", {
        description: "Debes realizar al menos una operación primero.",
      })
      return
    }

    // Guardar la solución en el store (como texto de las operaciones realizadas)
    const operationsText = playerOperations[currentPlayerId].join(" → ")
    setPlayerSolution(currentPlayerId, operationsText)

    // Calcular puntuación automáticamente
    const difference = Math.abs(targetNumber - result)

    // Puntuación basada en la cercanía al objetivo
    let points = 0
    if (difference === 0) {
      points = 10 // Solución exacta
      toast.success(`¡Solución exacta!`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} ha conseguido 10 puntos.`,
      })
    } else if (difference <= 5) {
      points = 7 // Muy cerca
      toast.success(`¡Muy cerca!`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} ha conseguido 7 puntos.`,
      })
    } else if (difference <= 10) {
      points = 5 // Cerca
      toast.success(`¡Cerca!`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} ha conseguido 5 puntos.`,
      })
    } else if (difference <= 25) {
      points = 3 // No tan lejos
      toast.info(`Solución aceptable`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} ha conseguido 3 puntos.`,
      })
    } else if (difference <= 50) {
      points = 1 // Lejos
      toast.info(`Solución lejana`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} ha conseguido 1 punto.`,
      })
    } else {
      toast.error(`Solución muy lejana`, {
        description: `${config.players.find((p) => p.id === currentPlayerId)?.name} no ha conseguido puntos.`,
      })
    }

    setPlayerRoundScore(currentPlayerId, points)

    // Pasar al siguiente jugador si existe
    const currentPlayerIndex = config.players.findIndex((p) => p.id === currentPlayerId)
    if (currentPlayerIndex < config.players.length - 1) {
      setCurrentPlayerId(config.players[currentPlayerIndex + 1].id)
    } else {
      setCurrentPlayerId(null) // Todos los jugadores han terminado
    }
  }

  // Función para actualizar las operaciones y resultado del jugador actual
  const updatePlayerOperations = (operation: string, result: number) => {
    if (!currentPlayerId) return

    setPlayerOperations((prev) => ({
      ...prev,
      [currentPlayerId]: [...(prev[currentPlayerId] || []), operation],
    }))

    setPlayerResults((prev) => ({
      ...prev,
      [currentPlayerId]: result,
    }))
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        {targetNumber > 0 && (
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Número objetivo:</h3>
            <Card className="inline-block px-6 py-3">
              <span className="text-3xl font-bold">{targetNumber}</span>
            </Card>
          </div>
        )}

        {/* Durante la ronda activa, solo mostrar los números disponibles */}
        {isRoundActive && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-center">Números disponibles:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {numbers.map((number, index) => (
                <Card key={index} className="w-16 h-16 flex items-center justify-center text-xl font-bold">
                  {number}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Cuando la ronda termina, mostrar la herramienta de cálculo para cada jugador */}
        {isRoundCompleted && (
          <div className="space-y-6">
            {currentPlayerId ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">
                    Turno de {config.players.find((p) => p.id === currentPlayerId)?.name}:
                  </h3>
                  <Button onClick={evaluateCurrentPlayerSolution} variant="outline">
                    Confirmar solución
                  </Button>
                </div>

                <SimpleNumbersCalculator
                  initialNumbers={numbers}
                  targetNumber={targetNumber}
                  onOperationComplete={(operation, result) => updatePlayerOperations(operation, result)}
                  operations={playerOperations[currentPlayerId] || []}
                  currentResult={playerResults[currentPlayerId]}
                />
              </>
            ) : (
              <div className="text-center p-4">
                <h3 className="text-lg font-medium mb-2">Todos los jugadores han completado su turno</h3>
                <p>Pulsa "Siguiente ronda" para continuar</p>
              </div>
            )}

            {/* Resumen de soluciones */}
            {Object.keys(playerResults).some((id) => playerResults[id] !== null) && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Soluciones:</h3>
                <div className="space-y-2">
                  {config.players.map(
                    (player) =>
                      playerResults[player.id] !== null && (
                        <div key={player.id} className="p-2 border rounded-md">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm">
                            {playerOperations[player.id]?.join(" → ")} = {playerResults[player.id]}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Diferencia: {Math.abs(targetNumber - (playerResults[player.id] || 0))}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  )
}

// Componente simplificado para el cálculo numérico
function SimpleNumbersCalculator({
  initialNumbers,
  targetNumber,
  onOperationComplete,
  operations = [],
  currentResult = null,
}: {
  initialNumbers: number[]
  targetNumber: number
  onOperationComplete: (operation: string, result: number) => void
  operations?: string[]
  currentResult?: number | null
}) {
  // Estado para los números disponibles (iniciales + resultados intermedios)
  const [availableNumbers, setAvailableNumbers] = useState<{ id: string; value: number }[]>([])

  // Estado para la operación actual
  const [firstNumber, setFirstNumber] = useState<{ id: string; value: number } | null>(null)
  const [secondNumber, setSecondNumber] = useState<{ id: string; value: number } | null>(null)
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null)

  // Inicializar los números disponibles
  useEffect(() => {
    resetAvailableNumbers()
  }, [initialNumbers])

  // Función para resetear los números disponibles a los iniciales
  const resetAvailableNumbers = () => {
    const initialAvailable = initialNumbers.map((num, index) => ({
      id: `initial-${index}`,
      value: num,
    }))
    setAvailableNumbers(initialAvailable)
  }

  // Limpiar la selección actual
  const clearSelection = () => {
    setFirstNumber(null)
    setSecondNumber(null)
    setSelectedOperator(null)
  }

  // Limpiar todo y reiniciar
  const clearAll = () => {
    clearSelection()
    resetAvailableNumbers()

    // Notificar que se ha limpiado todo
    onOperationComplete("", 0)
    toast.info("Operaciones limpiadas", {
      description: "Se han reiniciado todas las operaciones.",
    })
  }

  // Seleccionar un número
  const selectNumber = (number: { id: string; value: number }) => {
    if (!firstNumber) {
      setFirstNumber(number)
    } else if (selectedOperator && !secondNumber && number.id !== firstNumber.id) {
      setSecondNumber(number)
    }
  }

  // Seleccionar un operador
  const selectOperator = (operator: string) => {
    if (firstNumber && !selectedOperator) {
      setSelectedOperator(operator)
    }
  }

  // Realizar la operación
  const performOperation = () => {
    if (!firstNumber || !secondNumber || !selectedOperator) return

    let result: number
    let operationText: string

    switch (selectedOperator) {
      case "+":
        result = firstNumber.value + secondNumber.value
        operationText = `${firstNumber.value} + ${secondNumber.value} = ${result}`
        break
      case "-":
        result = firstNumber.value - secondNumber.value
        operationText = `${firstNumber.value} - ${secondNumber.value} = ${result}`
        break
      case "×":
        result = firstNumber.value * secondNumber.value
        operationText = `${firstNumber.value} × ${secondNumber.value} = ${result}`
        break
      case "÷":
        // Verificar división por cero o resultado no entero
        if (secondNumber.value === 0 || firstNumber.value % secondNumber.value !== 0) {
          toast.error("Operación inválida", {
            description: "La división debe dar un resultado entero y no puede ser por cero.",
          })
          return
        }
        result = firstNumber.value / secondNumber.value
        operationText = `${firstNumber.value} ÷ ${secondNumber.value} = ${result}`
        break
      default:
        return
    }

    // Eliminar los números usados de los disponibles
    const updatedNumbers = availableNumbers.filter((num) => num.id !== firstNumber.id && num.id !== secondNumber.id)

    // Añadir el resultado como un nuevo número disponible
    const newNumberId = `result-${Date.now()}`
    updatedNumbers.push({ id: newNumberId, value: result })
    setAvailableNumbers(updatedNumbers)

    // Notificar la operación completada
    onOperationComplete(operationText, result)
    toast.info(`Operación: ${operationText}`)

    // Si alcanzamos el número objetivo, mostrar una notificación especial
    if (result === targetNumber) {
      toast.success("¡Has alcanzado el número objetivo!", {
        description: "¡Felicidades! Has encontrado la solución exacta.",
      })
    }

    // Limpiar la selección actual
    clearSelection()
  }

  return (
    <div className="space-y-4">
      {/* Lista de operaciones realizadas */}
      {operations.length > 0 && (
        <div className="p-4 border rounded-md bg-muted/20">
          <div className="text-sm font-medium mb-2">Operaciones realizadas:</div>
          <ol className="list-decimal pl-5 space-y-1">
            {operations.map((op, index) => (
              <li key={index} className="text-sm">
                {op}
              </li>
            ))}
          </ol>
          {currentResult !== null && (
            <div className="mt-3 pt-2 border-t border-dashed">
              <div className="flex justify-between items-center">
                <span className="font-medium">Resultado actual:</span>
                <span className="font-bold">{currentResult}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Diferencia con el objetivo: {Math.abs(targetNumber - currentResult)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Números disponibles */}
      <div>
        <h4 className="text-sm font-medium mb-2">Números disponibles:</h4>
        <div className="flex flex-wrap gap-2">
          {availableNumbers.map((number) => (
            <div
              key={number.id}
              onClick={() => selectNumber(number)}
              className={`cursor-pointer transition-all ${
                firstNumber?.id === number.id
                  ? "ring-2 ring-primary"
                  : secondNumber?.id === number.id
                    ? "ring-2 ring-secondary"
                    : "hover:scale-105"
              }`}
            >
              <Card className="w-14 h-14 flex items-center justify-center text-lg font-bold">{number.value}</Card>
            </div>
          ))}
        </div>
      </div>

      {/* Operadores */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant="outline"
          onClick={() => selectOperator("+")}
          disabled={!firstNumber || selectedOperator}
          className={selectedOperator === "+" ? "bg-primary text-primary-foreground" : ""}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => selectOperator("-")}
          disabled={!firstNumber || selectedOperator}
          className={selectedOperator === "-" ? "bg-primary text-primary-foreground" : ""}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => selectOperator("×")}
          disabled={!firstNumber || selectedOperator}
          className={selectedOperator === "×" ? "bg-primary text-primary-foreground" : ""}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => selectOperator("÷")}
          disabled={!firstNumber || selectedOperator}
          className={selectedOperator === "÷" ? "bg-primary text-primary-foreground" : ""}
        >
          <Divide className="h-4 w-4" />
        </Button>

        <Button
          onClick={performOperation}
          disabled={!firstNumber || !secondNumber || !selectedOperator}
          className="ml-2"
        >
          =
        </Button>

        <Button
          variant="destructive"
          onClick={clearAll}
          disabled={operations.length === 0 && !firstNumber && !secondNumber && !selectedOperator}
          className="ml-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Limpiar
        </Button>
      </div>

      {/* Selección actual */}
      <div className="p-3 border rounded-md bg-muted/10 flex items-center justify-center text-lg">
        <span className={firstNumber ? "font-bold" : "text-muted-foreground"}>{firstNumber?.value || "_"}</span>
        <span className={`mx-2 ${selectedOperator ? "font-bold" : "text-muted-foreground"}`}>
          {selectedOperator || "?"}
        </span>
        <span className={secondNumber ? "font-bold" : "text-muted-foreground"}>{secondNumber?.value || "_"}</span>
      </div>
    </div>
  )
}

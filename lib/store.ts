import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateRandomLetters, shuffle } from "@/lib/utils"


// Números grandes y pequeños para el juego
const LARGE_NUMBERS = [25, 50, 75, 100]
const SMALL_NUMBERS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10]

export type Player = {
  id: string
  name: string
  score: number
}

// Modificar el tipo GameConfig para incluir tiempos separados
export type GameConfig = {
  players: Player[]
  rounds: number
  gameType: "letters" | "numbers" | "mixed"
  lettersRoundTime: number
  numbersRoundTime: number
}

export type Operation = {
  id: string
  value: number
  expression: string
  used: boolean
}

export type GameState = {
  config: GameConfig
  currentRound: number
  currentType: "letters" | "numbers"
  isRoundActive: boolean
  isRoundCompleted: boolean
  letters: string[]
  numbers: number[]
  operations: Operation[]
  targetNumber: number
  playerWords: Record<string, string>
  playerSolutions: Record<string, string>
  playerRoundScores: Record<string, number>
}

type GameStore = {
  // Estado del juego
  gameState: GameState

  // Acciones de configuración
  setConfig: (config: GameConfig) => void

  // Acciones de juego
  startGame: () => void
  startRound: () => void
  endRound: () => void
  nextRound: () => void
  resetGame: () => void

  // Acciones específicas de letras
  setPlayerWord: (playerId: string, word: string) => void

  // Acciones específicas de números
  addOperation: (value: number, expression: string, id?: string) => void
  markOperationAsUsed: (id: string) => void
  setPlayerSolution: (playerId: string, solution: string) => void

  // Puntuaciones
  updateScore: (playerId: string, points: number) => void
  setPlayerRoundScore: (playerId: string, points: number) => void
}

// Función para generar un ID único
const generateId = () => Math.random().toString(36).substring(2, 9)

// Crear la tienda Zustand
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Actualizar el estado inicial en la tienda
      gameState: {
        config: {
          players: [
            { id: generateId(), name: "Jugador 1", score: 0 },
            { id: generateId(), name: "Jugador 2", score: 0 },
          ],
          rounds: 3,
          gameType: "mixed",
          lettersRoundTime: 60,
          numbersRoundTime: 90,
        },
        currentRound: 1,
        currentType: "letters",
        isRoundActive: false,
        isRoundCompleted: false,
        letters: [],
        numbers: [],
        operations: [],
        targetNumber: 0,
        playerWords: {},
        playerSolutions: {},
        playerRoundScores: {},
      },

      setConfig: (config) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            config,
          },
        })),

      startGame: () =>
        set((state) => {
          const { gameType } = state.gameState.config
          return {
            gameState: {
              ...state.gameState,
              currentRound: 1,
              currentType: gameType === "numbers" ? "numbers" : "letters",
              isRoundActive: false,
              isRoundCompleted: false,
              letters: [],
              numbers: [],
              operations: [],
              targetNumber: 0,
              playerWords: {},
              playerSolutions: {},
              playerRoundScores: {},
              // Reiniciar puntuaciones
              config: {
                ...state.gameState.config,
                players: state.gameState.config.players.map((player) => ({
                  ...player,
                  score: 0,
                })),
              },
            },
          }
        }),      

      startRound: () =>
        set((state) => {
          const { currentType } = state.gameState

          if (currentType === "letters") {
            // Generar letras aleatorias (5 vocales y 4 consonantes)
            const letters = generateRandomLetters(5, 4)

            return {
              gameState: {
                ...state.gameState,
                isRoundActive: true,
                isRoundCompleted: false,
                letters,
                playerWords: {},
                playerRoundScores: {},
              },
            }
          } else {
            // Generar números aleatorios (2 grandes y 4 pequeños)
            const largeNumbers = shuffle([...LARGE_NUMBERS]).slice(0, 2)
            const smallNumbers = shuffle([...SMALL_NUMBERS]).slice(0, 4)
            const numbers = [...largeNumbers, ...smallNumbers]

            // Generar un número objetivo entre 100 y 999
            const targetNumber = Math.floor(Math.random() * 900) + 100

            return {
              gameState: {
                ...state.gameState,
                isRoundActive: true,
                isRoundCompleted: false,
                numbers,
                operations: numbers.map((num) => ({
                  id: generateId(),
                  value: num,
                  expression: num.toString(),
                  used: false,
                })),
                targetNumber,
                playerSolutions: {},
                playerRoundScores: {},
              },
            }
          }
        }),

      endRound: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            isRoundActive: false,
            isRoundCompleted: true,
          },
        })),

      nextRound: () =>
        set((state) => {
          const { currentRound, config, playerRoundScores } = state.gameState

          // Aplicar las puntuaciones de la ronda a las puntuaciones totales
          const updatedPlayers = config.players.map((player) => ({
            ...player,
            score: player.score + (playerRoundScores[player.id] || 0),
          }))

          if (currentRound >= config.rounds) {
            // Fin del juego
            return {
              gameState: {
                ...state.gameState,
                config: {
                  ...config,
                  players: updatedPlayers,
                },
              },
            }
          }

          // Determinar el tipo de la siguiente ronda
          let nextType = state.gameState.currentType
          if (config.gameType === "mixed") {
            nextType = nextType === "letters" ? "numbers" : "letters"
          }

          return {
            gameState: {
              ...state.gameState,
              currentRound: currentRound + 1,
              currentType: nextType,
              isRoundActive: false,
              isRoundCompleted: false,
              letters: [],
              numbers: [],
              operations: [],
              targetNumber: 0,
              playerWords: {},
              playerSolutions: {},
              playerRoundScores: {},
              config: {
                ...config,
                players: updatedPlayers,
              },
            },
          }
        }),

      resetGame: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentRound: 1,
            isRoundActive: false,
            isRoundCompleted: false,
            letters: [],
            numbers: [],
            operations: [],
            targetNumber: 0,
            playerWords: {},
            playerSolutions: {},
            playerRoundScores: {},
          },
        })),

      setPlayerWord: (playerId, word) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            playerWords: {
              ...state.gameState.playerWords,
              [playerId]: word,
            },
          },
        })),

      addOperation: (value: number, expression: string, id?: string) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            operations: [
              ...state.gameState.operations,
              {
                id: id || generateId(),
                value,
                expression,
                used: false,
              },
            ],
          },
        })),

      markOperationAsUsed: (id) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            operations: state.gameState.operations.map((op) => (op.id === id ? { ...op, used: true } : op)),
          },
        })),

      setPlayerSolution: (playerId, solution) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            playerSolutions: {
              ...state.gameState.playerSolutions,
              [playerId]: solution,
            },
          },
        })),

      updateScore: (playerId, points) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            config: {
              ...state.gameState.config,
              players: state.gameState.config.players.map((player) =>
                player.id === playerId ? { ...player, score: player.score + points } : player,
              ),
            },
          },
        })),

      setPlayerRoundScore: (playerId, points) =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            playerRoundScores: {
              ...state.gameState.playerRoundScores,
              [playerId]: points,
            },
          },
        })),
    }),
    {
      name: "cifras-letras-storage",
    },
  ),
)

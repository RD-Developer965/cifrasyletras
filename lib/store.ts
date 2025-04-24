import { create } from "zustand"
import { persist } from "zustand/middleware"

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


export type GameState = {
  config: GameConfig
  currentRound: number
  currentType?: "letters" | "numbers"
  roundState: 'initiated' | 'started' | 'active' | 'completed'
  playerWords: Record<string, string>
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
  activateRound: () => void
  completeRound: () => void
  nextRound: () => void
  resetGame: () => void

  // Acciones específicas de letras
  setPlayerWord: (playerId: string, word: string) => void


  // Puntuaciones
  updateScore: (playerId: string, points: number) => void
  setPlayerRoundScore: (playerId: string, points: number) => void

}


// Crear la tienda Zustand
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Actualizar el estado inicial en la tienda
      gameState: {
        config: {
          players: [
            { id: "1", name: "Jugador 1", score: 0 },
            { id: "2", name: "Jugador 2", score: 0 },
          ],
          rounds: 3,
          gameType: "mixed",
          lettersRoundTime: 60,
          numbersRoundTime: 90,
        },
        currentRound: 1,
        roundState: 'initiated',
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
              playerWords: {},
              playerRoundScores: {},
              roundState: 'initiated',
              // Reiniciar puntuaciones
              config: {
                ...state.gameState.config,
                players: state.gameState.config.players.map((player) => ({
                  ...player,
                  score: 0,
                })),
              },
            },
          } satisfies Partial<GameStore>
        }),      


      startRound: () =>
        set((state) => {
          const { currentType } = state.gameState

          if (currentType === "letters") {

            return {
              gameState: {
                ...state.gameState,
                roundState: 'started',
                playerWords: {},
                playerRoundScores: {},
              },
            } satisfies Partial<GameStore>
          } else {
            

            return {
              gameState: {
                ...state.gameState,
                roundState: 'started',
                playerRoundScores: {},
              },
            } satisfies Partial<GameStore>
          }
        }),

      activateRound: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            roundState: 'active'
          },
        } satisfies Partial<GameStore>)
      ),

      completeRound: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            roundState: 'completed'
          },
        } satisfies Partial<GameStore>)
      ),

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
                roundState: 'initiated',
                playerRoundScores: {}
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
              roundState: 'initiated',
              playerWords: {},
              playerRoundScores: {},
              config: {
                ...config,
                players: updatedPlayers,
              },
            },
          } satisfies Partial<GameStore>
        }),

      resetGame: () =>
        set((state) => ({
          gameState: {
            ...state.gameState,
            currentRound: 1,
            roundState: 'started',
            playerWords: {},
            playerRoundScores: {},
          },
        }) satisfies Partial<GameStore> ),

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

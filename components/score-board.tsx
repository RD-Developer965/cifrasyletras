"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGameStore } from "@/lib/store"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

export default function ScoreBoard() {
  const { gameState } = useGameStore()
  const { config, playerRoundScores } = gameState

  // Ordenar las puntuaciones de mayor a menor
  const sortedPlayers = [...config.players].sort((a, b) => {
    // Calcular puntuación total (puntuación acumulada + puntuación de la ronda actual)
    const totalScoreA = a.score + (playerRoundScores[a.id] || 0)
    const totalScoreB = b.score + (playerRoundScores[b.id] || 0)
    return totalScoreB - totalScoreA
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          Puntuaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            // Puntuación total (acumulada + ronda actual)
            const totalScore = player.score + (playerRoundScores[player.id] || 0)
            const roundScore = playerRoundScores[player.id] || 0

            return (
              <div
                key={player.id}
                className="flex justify-between items-center p-2 rounded-md"
                style={{
                  backgroundColor: index === 0 ? "rgba(250, 204, 21, 0.1)" : "transparent",
                  fontWeight: index === 0 ? "bold" : "normal",
                }}
              >
                <div className="flex items-center">
                  {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 mr-2" />}
                  {index === 1 && <Medal className="h-5 w-5 text-gray-400 mr-2" />}
                  {index === 2 && <Award className="h-5 w-5 text-amber-700 mr-2" />}
                  <span>{player.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {roundScore > 0 && <span className="text-sm text-green-600 dark:text-green-400">+{roundScore}</span>}
                  <span className="text-lg">{totalScore}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

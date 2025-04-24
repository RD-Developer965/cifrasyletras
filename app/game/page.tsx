import { Suspense } from "react"
import GameBoard from "@/app/game/game-board"
import GameLoading from "@/app/game/game-loading"

export default function GamePage() {
  return (
    <div className="container py-8 min-h-screen">
      <Suspense fallback={<GameLoading />}>
        <GameBoard />
      </Suspense>
    </div>
  )
}

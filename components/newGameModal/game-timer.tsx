"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface GameTimerProps {
  duration: number
  onTimeEnd: () => void
}

export default function GameTimer({ duration, onTimeEnd }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeEnd])

  useEffect(() => {
    setProgress((timeLeft / duration) * 100)
  }, [timeLeft, duration])

  // Determinar el color basado en el tiempo restante
  const getColorClass = () => {
    const percentage = (timeLeft / duration) * 100
    if (percentage > 60) return "text-green-600 dark:text-green-400"
    if (percentage > 30) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="w-64 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Tiempo:
        </span>
        <span className={`text-lg font-bold ${getColorClass()}`}>{timeLeft}s</span>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  )
}

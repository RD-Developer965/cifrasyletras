import { Loader2 } from "lucide-react"

export default function GameLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <h2 className="mt-4 text-xl font-medium">Cargando el juego...</h2>
    </div>
  )
}

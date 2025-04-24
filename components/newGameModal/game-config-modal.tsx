"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import GameConfigForm from "@/components/newGameModal/game-config-form"

interface GameConfigModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function GameConfigModal({ isOpen, onOpenChange }: GameConfigModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Nueva Partida</DialogTitle>
        </DialogHeader>
        <GameConfigForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

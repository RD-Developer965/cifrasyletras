"use client"

import GameConfigModal from "@/components/newGameModal/game-config-modal";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useState } from "react";


export default function OpenModalButton({ text }: OpenModalButtonProps) {

    const [isModalOpen, setIsModalOpen] = useState(false)

    return <>
        <Button size="lg" className="text-lg px-8" onClick={() => setIsModalOpen(true)}>
            <Play className="mr-2 h-5 w-5" /> {text}
        </Button>
        <GameConfigModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
}

interface OpenModalButtonProps {
    text: string
}
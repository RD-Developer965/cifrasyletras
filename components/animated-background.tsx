"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Necesario para evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Crear elementos para la animación (letras y números)
    const elements: {
      x: number
      y: number
      size: number
      speed: number
      value: string
      opacity: number
      direction: number
    }[] = []

    // Letras y números para mostrar
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const chars = letters + numbers

    // Crear elementos iniciales
    for (let i = 0; i < 50; i++) {
      elements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.1,
        value: chars[Math.floor(Math.random() * chars.length)],
        opacity: Math.random() * 0.2 + 0.05,
        direction: Math.random() > 0.5 ? 1 : -1,
      })
    }

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Determinar el color basado en el tema
      const isDark = resolvedTheme === "dark"
      const textColor = isDark ? "255, 255, 255" : "0, 0, 0"

      // Dibujar cada elemento
      elements.forEach((el) => {
        ctx.font = `${el.size}px monospace`
        ctx.fillStyle = `rgba(${textColor}, ${el.opacity})`
        ctx.fillText(el.value, el.x, el.y)

        // Mover el elemento
        el.y += el.speed * el.direction

        // Si el elemento sale de la pantalla, reposicionarlo
        if (el.y > canvas.height + el.size) {
          el.y = -el.size
          el.x = Math.random() * canvas.width
        } else if (el.y < -el.size) {
          el.y = canvas.height + el.size
          el.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [mounted, resolvedTheme])

  if (!mounted) {
    return null
  }

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
}

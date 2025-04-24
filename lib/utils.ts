import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para desordenar un array
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Función para validar si una palabra se puede formar con las letras disponibles
export function validateWord(word: string, letters: string[]): boolean {
  const lettersCopy = [...letters]

  for (const char of word.toUpperCase()) {
    const index = lettersCopy.indexOf(char)
    if (index === -1) {
      return false
    }
    lettersCopy.splice(index, 1)
  }

  return true
}

// Función para evaluar una expresión matemática
export function evaluateExpression(expression: string): number | null {
  try {
    // Reemplazar × por * y ÷ por / para la evaluación
    const evalString = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/\s/g, "")
    // Evaluar la expresión
    return eval(evalString)
  } catch (error) {
    return null
  }
}

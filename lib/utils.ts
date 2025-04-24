import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WORDS } from "./wordlist"

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
export function validateWord(word: string): boolean {
  for (const dicWord of WORDS) {
    if (dicWord.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === word.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
      return true
    }
  }

  return false
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


// Frecuencia aproximada de letras en español
const VOWELS = "AAAAAAAEEEEEEEIIIIIIOOOOOOUUUU"
const CONSONANTS = "BBCCCDDDDFFGGHHHJJLLLLMMNNNNÑPPPQRRRRRSSSSTTTTTVVXYZ"

export function generateRandomLetters(vowelCount: number, consonantCount: number) {
  const vowels = Array.from({ length: vowelCount }, () =>
    VOWELS.charAt(Math.floor(Math.random() * VOWELS.length)),
  )

  const consonants = Array.from({ length: consonantCount }, () =>
    CONSONANTS.charAt(Math.floor(Math.random() * CONSONANTS.length)),
  )

  return shuffle([...vowels, ...consonants])
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getSignatureDimension = (signature: string, fontSize = 16) => {
  const lineHeight = fontSize * 1.333;
  const textWidth = fontSize * signature.length * 0.5;
  const textHeight = lineHeight;
  return { textWidth, textHeight };
}

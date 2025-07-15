import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bright(c: string) {
    c = c.replace(/^#/, '')
    if (c.length == 3) c = c.replace(/./g, x => x + x)
    let [r, g, b] = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16))
    return .299 * r + .587 * g + .114 * b < 70
}
import { User } from "#types/user"

export interface Pixel {
    x: number
    y: number
    color: string
    userId: string
    user?: User
    createdAt?: string
    updatedAt?: string
}

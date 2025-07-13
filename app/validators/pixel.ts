import { pixelColors } from '#models/pixel'
import env from '#start/env'
import vine from '@vinejs/vine'

export const createPixelValidator = vine.compile(
    vine.object({
        pixel: vine.object({
            x: vine.number().min(0).max(env.get('WIDTH')).withoutDecimals(),
            y: vine.number().min(0).max(env.get('HEIGHT')).withoutDecimals()
        }),
        color: vine.string().hexCode().in(pixelColors)
    })
)
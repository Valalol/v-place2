import type { HttpContext } from '@adonisjs/core/http'

import Pixel from "#models/pixel"
import PixelHistory from "#models/pixel_history"
import env from '#start/env'

export default class PixelsController {
    index() {
        return Pixel.all()
    }

    history() {
        return PixelHistory.all()
    }

    new_pixel() {
        // return 
    }

    async main({ inertia }: HttpContext) {
        const width = env.get('WIDTH')
        const height = env.get('HEIGHT')
        const pixels = await Pixel.query().orderBy('x').orderBy('y')
        const pixelsMap: Record<number, Record<number, Pixel>> = {}
        for (const pixel of pixels) {
            if (!pixelsMap[pixel.x]) {
            pixelsMap[pixel.x] = {}
            }
            pixelsMap[pixel.x][pixel.y] = pixel
        }

        return inertia.render('main', { width, height, pixelsMap })
    }
}
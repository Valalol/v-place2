import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'

import env from '#start/env'
import Pixel, { pixelColors } from "#models/pixel"
import PixelHistory from "#models/pixel_history"
import { createPixelValidator } from '#validators/pixel'
import { TransmitService } from '#services/transmit_service'

@inject()
export default class PixelsController {
    constructor(
        protected transmitService: TransmitService,
    ) { }

    async index() {
        return await Pixel.query().orderBy('y').orderBy('x')
    }

    async history() {
        return await PixelHistory.query().orderBy('created_at', 'desc')
    }

    async new_pixel({ request, response, auth }: HttpContext) {
        const data = request.all()
        const payload = await createPixelValidator.validate(data)
        const auth_user = auth.user
        if (!auth_user) return
        // TODO check for timeout

        await Pixel.query()
            .where('x', payload.pixel.x)
            .andWhere('y', payload.pixel.y)
            .update({
                color: payload.color,
                userId: auth_user.id
            })

        const new_pixel = {
            x: payload.pixel.x,
            y: payload.pixel.y,
            color: payload.color,
            userId: auth_user.id,
        }

        await PixelHistory.create(new_pixel)
        this.transmitService.send_new_pixel(new_pixel)

        console.log(`Pixel at (${payload.pixel.x}, ${payload.pixel.y}) updated`)
        response.redirect().back()
    }

    async main({ inertia }: HttpContext) {
        const width = env.get('WIDTH')
        const height = env.get('HEIGHT')
        const colors = pixelColors
        const pixels = await Pixel.query().orderBy('y').orderBy('x')

        return inertia.render('main', { width, height, colors, pixels })
    }
}
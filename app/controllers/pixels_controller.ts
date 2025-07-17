import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'

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


    async new_pixel({ session, request, response, auth }: HttpContext) {
        const data = request.all()
        const payload = await createPixelValidator.validate(data)
        const auth_user = auth.user

        if (!auth_user) {
            session.flash('error', "Vous devez être connecté pour poser un pixel")
            return response.redirect().back()
        }

        const now = DateTime.now()
        if (now < auth_user.nextPixelTime) {
            const remainingSeconds = Math.ceil(auth_user.nextPixelTime.diff(now, 'seconds').seconds)
            session.flash('error', `Vous devez attendre encore ${remainingSeconds} secondes avant de poser un nouveau pixel`)
            return response.redirect().back()
        }

        await Pixel.query()
            .where('x', payload.pixel.x)
            .andWhere('y', payload.pixel.y)
            .update({
                color: payload.color,
                userId: auth_user.id,
            })

        auth_user.lastPixelTime = now
        // TODO use real timeout    env.get('TIMEOUT')
        auth_user.nextPixelTime = now.plus({ seconds: 10 })
        await auth_user.save()

        await PixelHistory.create({
            x: payload.pixel.x,
            y: payload.pixel.y,
            color: payload.color,
            userId: auth_user.id,
        })

        // Send update via transmit service with string timestamp
        this.transmitService.send_new_pixel({
            x: payload.pixel.x,
            y: payload.pixel.y,
            color: payload.color,
            userId: auth_user.id,
            user: { name: auth_user.name },
        })

        // console.log(`Pixel at (${payload.pixel.x}, ${payload.pixel.y}) updated`)
        session.flash('success', "Pixel posé avec succès")
        return response.redirect().back()
    }


    async main({ inertia }: HttpContext) {
        const width = env.get('WIDTH')
        const height = env.get('HEIGHT')
        const colors = pixelColors
        const pixels = (await Pixel.query()
            .orderBy('y')
            .orderBy('x')
            .preload('user'))
            .map(pixel => {
                const pixelJson = pixel.toJSON()
                return {
                    ...pixelJson,
                    user: pixel.user ? { name: pixel.user.name } : null
                }
            })

        return inertia.render('main', { width, height, colors, pixels })
    }


    async timeview({ session, response, inertia, auth }: HttpContext) {
        const width = env.get('WIDTH')
        const height = env.get('HEIGHT')
        const auth_user = auth.user

        if (!auth_user) {
            session.flash('error', "Vous devez être connecté pour poser un pixel")
            return response.redirect('/')
        }

        const pixels = await PixelHistory.query()
            // .where('userId', auth_user.id)
            // .orWhereNull('userId')
            .orderBy('created_at', 'asc')

        return inertia.render('timeview', { width, height, pixels })
    }
}
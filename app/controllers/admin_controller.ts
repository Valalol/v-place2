import env from '#start/env'
import { changeGridSizeValidator } from '#validators/admin'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
    async update_grid_size({ session, request, response }: HttpContext) {
        const data = request.all()
        const payload = await changeGridSizeValidator.validate(data)

        // TODO change grid size (width and height)

        session.flash('success', "Pixel posé avec succès")
        return response.redirect().back()
    }

    async main({ inertia }: HttpContext) {
        const width = env.get('WIDTH')
        const height = env.get('HEIGHT')

        return inertia.render('admin', { width, height })
    }
}
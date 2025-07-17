import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

const admin_ids: string[] = ["414312535748116481"]

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const user = ctx.auth.user
    if (!user) {
      return ctx.response.unauthorized({
        message: 'Authentification requise',
      })
    }
    if (!admin_ids.includes(user.id)) {
      return ctx.response.forbidden({
        message: 'Accès réservé aux admins',
      })
    }
    return await next()
  }
}
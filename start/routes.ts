/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'


router.group(() => {
    router.get('/redirect', [AuthController, 'discordRedirect'])
    router.get('/callback', [AuthController, 'discordCallback'])
}).prefix('/discord')


router.group(() => {
    router.get("/", [UsersController, 'index'])
}).prefix('/users')


router.get('/', async (ctx) => {
    console.log(ctx.auth.user)

    return ctx.inertia.render('main')
}).use([middleware.silent_auth()])

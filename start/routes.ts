/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from '#start/kernel'
import AuthController from '#controllers/auth_controller'
import UsersController from '#controllers/users_controller'
import PixelsController from '#controllers/pixels_controller'


router.group(() => {
    router.get('/redirect', [AuthController, 'discordRedirect']).use(middleware.guest())
    router.get('/callback', [AuthController, 'discordCallback'])
    router.get('/logout', [AuthController, 'logout']).use(middleware.auth())
}).prefix('/discord')


router.group(() => {
    router.get("/users", [UsersController, 'index'])
    router.get("/pixels", [PixelsController, 'index'])
    router.get("/pixels_history", [PixelsController, 'history'])
})
.prefix('/admin')
.use(middleware.auth()) // TODO check is admin


router.post('/pixels', [PixelsController, 'new_pixel']).use(middleware.auth())
router.get('/', [PixelsController, 'main'])

transmit.registerRoutes()
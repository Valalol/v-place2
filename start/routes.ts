/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'


router.group(() => {
    router.get('/redirect', ({ ally }) => {
        ally.use('discord').redirect()
    })

    router.get('/callback', async ({ ally }) => {
        const discord = ally.use('discord')

        if (discord.accessDenied()) return 'You have cancelled the login process'
        if (discord.stateMisMatch()) return 'We are unable to verify the request. Please try again'
        if (discord.hasError()) return discord.getError()

        const user = await discord.user()
        return user
    })
}).prefix('/discord')


router.group(() => {
    router.get("/", [UsersController, 'index'])
}).prefix('/users')


router.on('/').renderInertia('main')
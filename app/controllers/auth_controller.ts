import { UserService } from '#services/user_service'
import { DiscordToken } from '@adonisjs/ally/types'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'


export interface UserCallbackInfo {
    token: DiscordToken
    id: string
    name: string
    nickName: string
    avatarUrl: string
    email: string
    emailVerificationState: "verified" | "unverified" | "unsupported"
    original: {
        id: string
        username: string
        avatar: string | null
        discriminator: string
        public_flags: number
        flags: number
        banner: any | null
        accent_color: number | null
        global_name: string |null
        avatar_decoration_data: any | null
        collectibles: any | null
        display_name_styles: any | null
        banner_color: string | null
        clan: any | null
        primary_guild: any | null
        mfa_enabled: boolean
        locale: string
        premium_type: number
        email: string | null
        verified: boolean
    }
}


@inject()
export default class AuthController {
    constructor(
        protected userService: UserService,
    ) { }

    discordRedirect({ ally }: HttpContext) {
        return ally.use('discord').redirect()
    }

    async discordCallback({ ally, auth, response }: HttpContext) {
        const discord = ally.use('discord')

        if (discord.accessDenied()) return 'You have cancelled the login process'
        if (discord.stateMisMatch()) return 'We are unable to verify the request. Please try again'
        if (discord.hasError()) return discord.getError()

        const user = await discord.user() as UserCallbackInfo
        const existingUser = await this.userService.getById(user.id)

        if (existingUser) {
            await auth.use('web').login(existingUser)
        } else {
            const userInDb = await this.userService.create(user)
            await auth.use('web').login(userInDb)
        }
        return response.redirect('/')
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        response.redirect('/')
    }
}
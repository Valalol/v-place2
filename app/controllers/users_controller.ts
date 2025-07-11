// import type { HttpContext } from '@adonisjs/core/http'

import { UserService } from "#services/user_service";
import { inject } from "@adonisjs/core";

@inject()
export default class UsersController {
    constructor(
        protected userService: UserService,
    ) { }

    async index() {
        return await this.userService.index()
    }
}
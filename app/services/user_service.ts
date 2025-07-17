import { UserCallbackInfo } from '#controllers/auth_controller'
import User from '#models/user'

export class UserService {
    async create(user : UserCallbackInfo) {
        return await User.create({
            id: user.id,
            name: user.original.global_name ?? user.nickName,
            email: user.email,
            avatarUrl: user.avatarUrl
        })
    }

    async index() {
        return User.all()
    }

    async getById(id: string) {
        return User.find(id)
    }
}
import { Pixel } from "#types/pixel"
import transmit from "@adonisjs/transmit/services/main"

export class TransmitService {
    send(channel: string, content: any) {
        transmit.broadcast(channel, { message: content })
    }

    send_new_pixel(pixel: Pixel) {
        this.send('global', pixel)
    }
}
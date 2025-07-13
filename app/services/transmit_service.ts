import transmit from "@adonisjs/transmit/services/main"

export class TransmitService {
    send(channel: string, content: any) {
        transmit.broadcast(channel, { message: content })
    }


}
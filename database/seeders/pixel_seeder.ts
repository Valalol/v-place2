import { BaseSeeder } from '@adonisjs/lucid/seeders'
import env from '#start/env'
import Pixel from '#models/pixel'

export default class PixelSeeder extends BaseSeeder {
  async run() {
    const height = env.get('HEIGHT')
    const width = env.get('WIDTH')

    const pixels = []

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        pixels.push({ x, y, 'color': '#ffffff' })
      }
    }

    await Pixel.createMany(pixels)
  }
}
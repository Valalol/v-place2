import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export const pixelColors = [
  '#ff0000', // red
  '#ffa500', // orange
  '#ffff00', // yellow
  '#60ff00', // lime
  '#008000', // green dark
  '#00a0ff', // cyan
  '#0000ae', // dark blue
  '#b400ff', // purple
  '#ff98cc', // pink
  '#ffffff', // white
  '#808080', // grey
  '#000000', // black
  '#8b4513', // brown
]



export default class Pixel extends BaseModel {
  @column({ isPrimary: true })
  declare x: number

  @column({ isPrimary: true })
  declare y: number

  @column()
  declare color: string

  @column()
  declare userId: string

  @belongsTo(() => User, {foreignKey: 'userId'})
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
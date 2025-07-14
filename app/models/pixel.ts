import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export const pixelColors = [
  '#e6194b', // red
  '#f58231', // orange
  '#ffe119', // yellow
  '#bfef45', // lime
  '#3cb44b', // green
  '#469990', // teal
  '#42d4f4', // cyan
  '#4363d8', // blue
  '#000075', // navy
  '#911eb4', // purple
  '#dcbeff', // light purple
  '#f032e6', // magenta
  '#fabed4', // light pink
  '#ffd8b1', // peach
  '#800000', // dark red
  '#9a6324', // brown
  '#808000', // olive
  '#a9a9a9', // grey
  '#ffffff', // white
  '#000000', // black
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
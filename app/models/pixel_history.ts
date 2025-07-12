import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class PixelHistory extends BaseModel {
  @column({ isPrimary: true })
  declare x: number

  @column({ isPrimary: true })
  declare y: number

  @column()
  declare color: string

  @column()
  declare userId: number

  @belongsTo(() => User, {foreignKey: 'userId'})
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
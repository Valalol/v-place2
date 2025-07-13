import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pixels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('x').notNullable()
      table.integer('y').notNullable()
      table.string('color').notNullable()
      table.string('user_id').references('id').inTable('users').nullable()
      table.primary(['x', 'y'])
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
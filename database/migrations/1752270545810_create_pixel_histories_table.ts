import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pixel_histories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('x').notNullable()
      table.integer('y').notNullable()
      table.string('color').notNullable()
      table.string('user_id').references('id').inTable('users').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()

      table.primary(['x', 'y', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
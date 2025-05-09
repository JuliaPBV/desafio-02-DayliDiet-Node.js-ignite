import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
return knex.schema.createTable('diet', (table) => {
    table.uuid('id').primary()
    table.uuid('user_id').references('users.id').notNullable()
    table.string('name').notNullable()
    table.string('description').notNullable() 
    table.boolean('is_on_diet').notNullable() 
    table.date('date').notNullable() // data da refeição
    table.timestamps(true, true) // cria os campos created_at e updated_at
})
}

export async function down(knex: Knex): Promise<void> {
return knex.schema.dropTable('diet')
}
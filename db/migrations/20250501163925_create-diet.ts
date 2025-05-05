import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("diet", (table) => {
        table.uuid('id').primary()
        table.text('name').notNullable() //notnullable para indicar que o campo é obrigatório/ não pode ficar vazio
        table.text('description').notNullable() 
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() 
        table.boolean('is_on_diet').notNullable()
})
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("diet")
}

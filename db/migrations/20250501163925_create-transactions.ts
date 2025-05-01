import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("transactions", (table) => {
        table.uuid('id').primary()
        table.text('title').notNullable() //notnullable para indicar que o campo é obrigatório/ não pode ficar vazio
})
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("transactions")
}

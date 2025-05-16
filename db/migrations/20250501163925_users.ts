import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.uuid('id').primary()
        table.string('session_id').notNullable().unique() //notnullable para indicar que o campo é obrigatório/ não pode ficar vazio
        table.string('name').notNullable() 
        table.string('email').notNullable().unique() //não pode ter dois emails iguais
        table.timestamps(true, true) //cria os campos created_at e updated_at
})
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users")
}

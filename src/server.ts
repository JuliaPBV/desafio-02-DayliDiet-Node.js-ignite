import fastify from "fastify"
import crypto from "node:crypto"
import {knex} from "./database" 

const app = fastify() //base da aplicação

app.get('/hello', async () => {
    const diet = await knex('diet').insert({
        id: crypto.randomUUID(),
        name: "Julia",
        description: "Dieta para emagrecimento",
        created_at: new Date(),
        is_on_diet: true,
    })
    .returning('*') //retorna todos os dados do registro inserido

    return diet
})

//oubir uma porta
app.listen({ 
    port: 3333,
}).then(() => {
    console.log('HTTP server running')
})
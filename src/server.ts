import fastify from "fastify";
import {knex} from "./database" 

const app = fastify() //base da aplicação

app.get('/hello', async () => {
    const tables = await knex("sqlite_schema").select ('*')

    return tables
})

//oubir uma porta
app.listen({ 
    port: 3333,
}).then(() => {
    console.log('HTTP server running')
})
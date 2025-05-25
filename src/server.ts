import fastify from "fastify"
import { env } from "./env"
import { dietRoutes } from "./routes/diets"
import cookie from '@fastify/cookie'

const app = fastify() //base da aplicação

app.register(cookie)


//oubir uma porta
    app.register(dietRoutes, {
        prefix: 'diets', //prefixo da rota
    })

app.listen({ 
    port: env.PORT,
}).then(() => {
    console.log('HTTP server running')
})


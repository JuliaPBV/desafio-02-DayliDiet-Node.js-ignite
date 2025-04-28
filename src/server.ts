import fastify from "fastify";

const app = fastify() //base da aplicação

app.get('/hello', () => {
    return 'Hello World!'
})

//oubir uma porta
app.listen({ 
    port: 3333,
}).then(() => {
    console.log('HTTP server running')
})
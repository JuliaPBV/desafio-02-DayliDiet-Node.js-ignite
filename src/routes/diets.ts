import { FastifyInstance } from "fastify"
import { date, z } from "zod"
import { randomUUID } from "node:crypto"
import {knex} from "../database" 
import { checkSessionIdExists } from "../middlaweres/check-session-id-exists"

export async function dietRoutes(app: FastifyInstance) {
app.post('/', { preHandler: [checkSessionIdExists] }, //checkSessionIdExists é um hook que verifica se o session_id existe no banco de dados
    async (request, reply) => {

    const createDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
    })

    const { name, description, isOnDiet, date } = createDietBodySchema.parse(
        request.body, 
    )

    await knex('diet').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(), // Converte a data para timestamp
        user_id: request.user?.id, // Pega o id do usuário logado
    })

    return reply.status(201).send() // Retorna o status 201 (Created) para indicar que o recurso foi criado com sucesso
},
)

app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const diet = await knex('diet')
    .where({ user_id: request.user?.id }) // Pega o id do usuário logado
    .orderBy('date', 'desc') // Ordena os resultados pela data em ordem decrescente

    return reply.send({ diet }) // Retorna os resultados encontrados
},
)
}
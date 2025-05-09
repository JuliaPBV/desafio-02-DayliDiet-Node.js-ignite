import { FastifyInstance } from "fastify"
import { date, z } from "zod"
import { randomUUID } from "node:crypto"
import {knex} from "../database" 

export async function dietRoutes(app: FastifyInstance) {
app.post('/', { preHandler: [checkSessionIdExists] }, //checkSessionIdExists é um hook que verifica se o session_id existe no banco de dados
    async (request, reply) => {

    const createDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date
    })

    const { name, description, createdAt, is_on_diet } = createDietBodySchema.parse(request.body)
    return diet
})

const diet = await knex('diet')
    .insert({
        id: randomUUID(),
        name, 
    })
}
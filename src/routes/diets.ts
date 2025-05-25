import { FastifyInstance } from "fastify"
import { date, z } from "zod"
import { randomUUID } from "node:crypto"
import {knex} from "../database" 
import { checkSessionIdExists } from "../middlaweres/check-session-id-exists"


export async function dietRoutes(app: FastifyInstance) {
    app.get('/', async () => {
        const diet = await knex('diet').select('*')

        return { diet }
    })


    //criar uma refeição relacionada ao usuario 
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

// lista todas as refeição de um usuário
app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const diet = await knex('diet')
    .where({ user_id: request.user?.id }) // Pega o id do usuário logado
    .orderBy('date', 'desc') // Ordena os resultados pela data em ordem decrescente

    return reply.send({ diet }) // Retorna os resultados encontrados
},
)

// buscando por uma unica refeição
 app.get(
    '/:dietId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ dietId: z.string().uuid() })

      const { dietId } = paramsSchema.parse(request.params)

      const diet = await knex('diet').where({ id: dietId }).first()

      if (!diet) {
        return reply.status(404).send({ error: 'diet not found' })
      }

      return reply.send({ diet })
    },
  )

  //atualizando a refeição
  app.put(
    '/:dietId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ dietId: z.string().uuid() })

      const { dietId } = paramsSchema.parse(request.params)

      const updateDietBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = updateDietBodySchema.parse(
        request.body,
      )

      const diet = await knex('diet').where({ id: dietId }).first()

      if (!diet) {
        return reply.status(404).send({ error: 'Diet not found' })
      }

      await knex('diet').where({ id: dietId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      })

      return reply.status(204).send()
    },
  )

    //deletando uma refeição
    app.delete(
    '/:dietId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ dietId: z.string().uuid() })

      const { dietId } = paramsSchema.parse(request.params)

      const diet = await knex('diet').where({ id: dietId }).first()

      if (!diet) {
        return reply.status(404).send({ error: 'Diet not found' })
      }

      await knex('Diet').where({ id: dietId }).delete()

      return reply.status(204).send()
    },
  )

    //buscandoa métrica/todas as refeições de um usuário
  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMealsOnDiet = await knex('diets')
        .where({ user_id: request.user?.id, is_on_diet: true })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('diets')
        .where({ user_id: request.user?.id, is_on_diet: false })
        .count('id', { as: 'total' })
        .first()

      const totalMeals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, diet) => {
          if (diet.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      })
    },
  )
}
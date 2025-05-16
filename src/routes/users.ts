import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
        })

        let sessionId = request.cookies.sessionId 

        if(!sessionId) {
            sessionId = randomUUID() 

            reply.setCookie('sessionId', sessionId, { 
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias // Tempo de expiração do cookie
            })
        }

        const { name, email } = createUserBodySchema.parse(request.body)

        const userByEmail = await knex('users').where({ email }).first()

        if(userByEmail){
            return reply.status(409).send({ message: 'Email already exists' }) // Retorna o status 409 (Conflict) para indicar que o email já existe
        }

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId, // Adiciona o session_id ao usuário
        })
        return reply.status(201).send() // Retorna o status 201 (Created) para indicar que o recurso foi criado com sucesso
    })
}


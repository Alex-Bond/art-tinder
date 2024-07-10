import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { Voting } from './api/voting'

export const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Hello from the root route!' }
  })

  fastify.register(Voting, { prefix: '/api/voting' })
}

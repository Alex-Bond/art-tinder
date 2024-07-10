import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { GetPictures } from './api/get-pictures'

export const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Hello from the root route!' }
  })

  fastify.register(GetPictures, { prefix: '/api/get-pictures' })
}

import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { VotingModule } from './api/voting/voting.module'
import { AuthModule } from './api/auth/auth.module'
import { ArtModule } from './api/art/art.module'

export const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: 'Hello from the root route!' }
  })

  fastify.register(VotingModule, { prefix: '/api/voting' })
  fastify.register(AuthModule, { prefix: '/api/auth' })
  fastify.register(ArtModule, { prefix: '/api/art' })
}

import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { LoginRequest, LoginRequestType } from './requests/login.request'
import { AuthService } from '../../../services/auth.service'

export const AuthModule: FastifyPluginAsync = async (fastify) => {


  fastify.post('/login', {
    handler: async (request: FastifyRequest<{ Body: LoginRequestType }>, reply) => {
      const login = request.body.login.trim()
      const password = request.body.password.trim()

      if (login != process.env.ADMIN_LOGIN || password != process.env.ADMIN_PASSWORD) {
        return reply.status(403).send({
          status: 'error',
          message: 'Bad login or password',
        })
      }

      reply.header('Authorization', `Bearer ${AuthService.generateJWT({ ...request.session, admin: true })}`)

      return {
        status: 'ok',
      }
    },
    schema: {
      body: LoginRequest,
    },
  })
}

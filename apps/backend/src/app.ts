import 'dotenv/config'
import fastify, { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import * as ejs from 'ejs'
import * as path from 'path'
import createError from 'http-errors'
import { router } from './routes/router'
import { fastifyJwt } from '@fastify/jwt'
import { v4 as uuidv4 } from 'uuid'
import multipart from '@fastify/multipart'
import { AuthService } from './services/auth.service'
import cors from '@fastify/cors'

const app: FastifyInstance = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

app.register(cors, {
  exposedHeaders: ['Authorization', 'Content-Type'],
})

app.register(multipart, { attachFieldsToBody: true, limits: { fileSize: 1024 * 1024 * 10 } })

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'bad_key',
})

// view engine setup
app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
  root: path.join(__dirname, 'views'),
})

// Serve static files
app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
})

app.addHook('onRequest', async (request, reply) => {
  try {
    await request.jwtVerify()
    request.session = await request.jwtDecode<{ id: string; admin?: boolean }>() || {}
  } catch (err) {
    // If JWT is not available or invalid, create a new one
    const sessionId = uuidv4()
    const token = AuthService.generateJWT({ id: sessionId })

    // Set the new token in the response header
    reply.header('Authorization', `Bearer ${token}`)

    // Decode and set the session object
    request.session = app.jwt.decode<{ id: string; admin?: boolean }>(token) || { id: sessionId }
  }
})

app.decorate('admin_only', async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const isAdmin = request.session.admin

  if (!isAdmin) {
    return reply.status(401).send({ message: 'Authentication required' })
  }

  done()
})

// Routes
app.register(router)

// catch 404 and forward to error handler
app.setNotFoundHandler((request, reply) => {
  reply.code(404).send(createError(404))
})

// error handler
app.setErrorHandler((error, request, reply) => {
  const statusCode = error.statusCode || 500
  const dev = process.env.NODE_ENV === 'development'

  reply.status(statusCode).view('error', {
    message: error.message,
    error: dev ? error : {},
  })
})

const start = async () => {
  try {
    await app.listen({ port: 3000 })
    app.log.info(`Server listening on ${app.server.address()}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

export default app

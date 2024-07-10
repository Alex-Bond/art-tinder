import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from '@fastify/static'
import fastifyView from '@fastify/view'
import * as ejs from 'ejs'
import * as path from 'path'
import createError from 'http-errors'
import router from './routes/router'

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

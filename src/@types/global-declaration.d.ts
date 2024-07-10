export {}

declare module 'fastify' {
  interface FastifyRequest {
    session: {
      id?: string;
      sessionId?: string;
    }
  }
}

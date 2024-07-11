export {}

declare module 'fastify' {
  interface FastifyRequest {
    session: {
      id: string;
      admin?: boolean;
    }
  }

  export interface FastifyInstance {
    admin_only: any //preHandlerMetaHookHandler
  }
}

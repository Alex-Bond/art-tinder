import { FastifyPluginAsync } from 'fastify'
import { db } from '../../db'

export const GetPictures: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async () => {
    const items = await db.selectFrom('art').orderBy('votes asc').limit(10).execute()
    return {
      status: 'ok',
      items,
    }
  })
}

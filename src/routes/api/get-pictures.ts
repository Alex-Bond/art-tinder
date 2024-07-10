import { FastifyPluginAsync } from 'fastify'
import { db } from '../../db'

export const GetPictures: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    const sessionId = request.session?.sessionId || ''

    const items = await db
      .selectFrom('art')
      .leftJoin('votes', (join) =>
        join
          .onRef('votes.art_id', '=', 'art.id')
          .on('votes.session_id', '=', sessionId),
      )
      .where('votes.id', 'is', null)
      .orderBy('art.votes', 'asc')
      .limit(10)
      .selectAll('art')
      .execute()


    return {
      status: 'ok',
      items,
    }
  })
}

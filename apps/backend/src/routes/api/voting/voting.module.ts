import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { db } from '../../../db'
import { sql } from 'kysely'
import { ArtWithUrlUtil } from '../../../db/utils/art-with-url.util'
import { VoteRequest, VoteRequestType } from './requests/vote.request'


export const VotingModule: FastifyPluginAsync = async (fastify) => {
  fastify.get('/list-to-vote', async (request, reply) => {
    const sessionId = request.session?.id || ''

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
      items: await ArtWithUrlUtil(items),
    }
  })

  fastify.post('/vote',
    {
      schema: {
        body: VoteRequest,
      },
    },
    async (request: FastifyRequest<{ Body: VoteRequestType }>, reply) => {
      const artId = request.body.art_id

      const sessionId = request.session?.id
      if (!sessionId) return reply.status(403)

      const art = await db.selectFrom('art').where('art.id', '=', artId).executeTakeFirst()
      if (!art) return reply.status(401).send({ status: 'error', message: 'Bad Art ID' })

      const alreadyVoted = await db.selectFrom('votes').where('art_id', '=', artId).where('session_id', '=', sessionId).executeTakeFirst()
      if (alreadyVoted) return reply.status(401).send({ status: 'error', message: 'You already voted for this art' })

      const newRecord = await db.transaction().execute(async trx => {
        await trx.insertInto('votes').values({
          art_id: artId,
          session_id: sessionId,
          vote: request.body.is_positive ? 1 : -1,
        }).returning(['id']).executeTakeFirstOrThrow()

        return await trx.updateTable('art')
          .where('art.id', '=', artId)
          .set({
            votes: sql`votes + 1`,
            rating: sql`rating + ${request.body.is_positive ? 1 : -1}`,
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      })

      return {
        status: 'ok',
        entity: newRecord,
      }
    },
  )
}

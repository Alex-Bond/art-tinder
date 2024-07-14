import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { db } from '../../../db'
import { ArtWithUrlUtil } from '../../../db/utils/art-with-url.util'
import { CreateArtRequestType } from './requests/create-art.request'
import { FileStorageService } from '../../../services/file-storage.service'
import { v4 } from 'uuid'
import { DeleteArt, DeleteArtType } from './requests/delete-art.request'

export const ArtModule: FastifyPluginAsync = async (fastify) => {
  fastify.get('/list', {
      preHandler: [fastify.admin_only],
    },
    async (request, reply) => {
      const items = await db.selectFrom('art').selectAll().orderBy('created_at', 'desc').execute()

      return {
        status: 'ok',
        items: await ArtWithUrlUtil(items),
      }
    },
  )

  fastify.post('/create', {
      preHandler: [fastify.admin_only],
    },
    async (request: FastifyRequest<{ Body: CreateArtRequestType }>, reply) => {
      const name = request.body.name.value
      if (!name || name.length < 5) {
        return reply.status(400).send({
          status: 'error',
          message: 'No art name or less than 5 symbols',
        })
      }

      // const data = await request.file()
      const data = request.body.file
      if (!data) return reply.status(400).send({ status: 'error', message: 'No file detected' })
      if (!['images/jpeg', 'image/jpeg'].includes(data.mimetype)) {
        return reply.status(400).send({
          status: 'error',
          message: 'Only JPG files supported',
        })
      }

      const buffer = await data.toBuffer()

      const id = v4()

      await FileStorageService.getInstance().upload(buffer, `${id}.jpg`, { mimeType: 'image/jpeg' })

      const item = await db.insertInto('art')
        .values({
          id,
          name: name,
          votes: 0,
          rating: 0,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      return {
        status: 'ok',
        item: (await ArtWithUrlUtil([item]))[0],
      }
    },
  )

  fastify.post('/delete', {
      preHandler: [fastify.admin_only],
      schema: {
        body: DeleteArt,
      },
    },
    async (request: FastifyRequest<{ Body: DeleteArtType }>, reply) => {
      const item = await db.selectFrom('art').selectAll().where('id', '=', request.body.art_id).executeTakeFirstOrThrow()

      await FileStorageService.getInstance().delete(`${item.id}.jpg`)

      await db.deleteFrom('art').where('id', '=', request.body.art_id).execute()

      return {
        status: 'ok',
      }
    })
}

import { Static, Type } from '@sinclair/typebox'
import { MultipartFile, MultipartValue } from '@fastify/multipart'

export const CreateArtRequest = Type.Object({
  name: Type.String({ minLength: 5 }),
})

export type CreateArtRequestType = {
  name: MultipartValue<string>
  file: MultipartFile
}

import { Static, Type } from '@sinclair/typebox'

export const DeleteArt = Type.Object({
  art_id: Type.String({ format: 'uuid' }),
})

export type DeleteArtType = Static<typeof DeleteArt>

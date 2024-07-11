import { Static, Type } from '@sinclair/typebox'

export const VoteRequest = Type.Object({
  art_id: Type.String({ format: 'uuid' }),
  is_positive: Type.Boolean(),
})

export type VoteRequestType = Static<typeof VoteRequest>

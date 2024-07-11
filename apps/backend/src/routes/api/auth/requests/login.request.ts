import { Static, Type } from '@sinclair/typebox'

export const LoginRequest = Type.Object({
  login: Type.String({ minLength: 5 }),
  password: Type.String({ minLength: 5 }),
})

export type LoginRequestType = Static<typeof LoginRequest>

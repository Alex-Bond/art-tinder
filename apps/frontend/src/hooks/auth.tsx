import { JwtUtil } from '@/utils/jwt.util'

export const useAuth = (): { id?: string, isAdmin?: boolean } => {
  const token = localStorage?.getItem('authorization')
  if (!token) return {}
  const parsed = JwtUtil.parseJwt<{ id: string, admin?: boolean }>(token)
  return { id: parsed.id, isAdmin: parsed.admin }
}

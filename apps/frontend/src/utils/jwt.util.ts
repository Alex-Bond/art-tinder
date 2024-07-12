export class JwtUtil {
  static parseJwt<T = object>(token: string): T {
    if (!token) throw new Error('Token must be provided')
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(window.atob(base64)) as T
  }
}

import app from '../app'

export class AuthService {
  static generateJWT(options: { id: string, admin?: boolean }) {
    return app.jwt.sign(options)
  }
}

import { FileStorageInterface } from './interfaces/file-storage.interface'
import * as Minio from 'minio'

export class MinioClient implements FileStorageInterface {
  private client = new Minio.Client({
    endPoint: process.env.MINIO_HOST || 'localhost',
    port: parseInt(process.env.MINIO_API_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL == 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || '',
    secretKey: process.env.MINIO_SECRET_KEY || '',
  })

  private defaultBucket = process.env.MINIO_DEFAULT_BUCKET || 'bucket'

  private static instance = new MinioClient()

  static getInstance() {
    return this.instance
  }

  async upload(file: Buffer, path: string, options?: { bucket?: string }) {
    return false
  }

  async delete(path: string, options?: { bucket?: string }) {
    return false
  }

  async getPreSignedUrl(path: string, options?: { bucket?: string }) {
    const bucket = options?.bucket || this.defaultBucket
    return await this.client.presignedUrl('GET', bucket, path, 3 * 60)
  }

}

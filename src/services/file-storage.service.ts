import { FileStorageInterface } from './interfaces/file-storage.interface'
import { MinioClient } from './file-storage-clients/minio.client'

export class FileStorageService implements FileStorageInterface {
  private client: FileStorageInterface

  private static instance = new FileStorageService()

  static getInstance() {
    return this.instance
  }

  constructor() {
    switch (process.env.STORAGE_TYPE?.toLowerCase()) {
      case 'minio':
        this.client = new MinioClient()
        break
      default:
        throw new Error('Bad STORAGE TYPE')
    }
  }

  upload: FileStorageInterface['upload'] = async (file, path, options) => {
    return this.client.upload(file, path, options)
  }

  delete: FileStorageInterface['delete'] = async (path, options) => {
    return this.client.delete(path, options)
  }

  getPreSignedUrl: FileStorageInterface['getPreSignedUrl'] = async (path, options) => {
    return await this.client.getPreSignedUrl(path, options)
  }
}

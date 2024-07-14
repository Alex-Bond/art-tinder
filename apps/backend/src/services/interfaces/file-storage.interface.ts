import { Readable } from 'node:stream'

export interface FileStorageInterface {
  upload: (file: Buffer | Readable, path: string, options?: { bucket?: string, mimeType?: string }) => Promise<void>
  delete: (path: string, options?: { bucket?: string }) => Promise<void>
  getPreSignedUrl: (path: string, options?: { bucket?: string }) => Promise<string>
}

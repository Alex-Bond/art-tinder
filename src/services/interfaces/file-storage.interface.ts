export interface FileStorageInterface {
  upload: (file: Buffer, path: string) => Promise<boolean>
  delete: (path: string) => Promise<boolean>
  getPreSignedUrl: (path: string) => Promise<string>
}

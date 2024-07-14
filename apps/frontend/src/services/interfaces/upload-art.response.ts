import { ApiResponse } from '@/services/interfaces/api.response'
import { ArtEntity } from '@/services/interfaces/art-entity'

export interface UploadArtResponse extends ApiResponse {
  item?: ArtEntity
}

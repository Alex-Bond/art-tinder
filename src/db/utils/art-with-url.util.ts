import { MinioClient } from '../../services/minio.client'
import { ArtEntity } from '../entities/art.entity'
import { Selectable } from 'kysely'

export const ArtWithUrlUtil = async (art: Selectable<ArtEntity>[]) => {
  const addImageUrl = async <U extends Selectable<ArtEntity>>(item: U): Promise<U & { imageUrl: string }> => ({
    ...item,
    imageUrl: await MinioClient.getInstance().getPreSignedUrl(`${item.id}.jpg`),
  })

  return await Promise.all(art.map(addImageUrl))
}


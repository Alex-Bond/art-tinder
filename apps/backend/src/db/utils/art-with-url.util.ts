import { ArtEntity } from '../entities/art.entity'
import { Selectable } from 'kysely'
import { FileStorageService } from '../../services/file-storage.service'

export const ArtWithUrlUtil = async (art: Selectable<ArtEntity>[]) => {
  const addImageUrl = async <U extends Selectable<ArtEntity>>(item: U): Promise<U & { imageUrl: string }> => ({
    ...item,
    imageUrl: await FileStorageService.getInstance().getPreSignedUrl(`${item.id}.jpg`),
  })

  return await Promise.all(art.map(addImageUrl))
}


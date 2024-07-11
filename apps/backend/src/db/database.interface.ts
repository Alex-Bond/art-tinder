import { ArtEntity } from './entities/art.entity'
import { VoteEntity } from './entities/vote.entity'

export interface DatabaseInterface {
  art: ArtEntity,
  votes: VoteEntity
}

import { ColumnType, Generated } from 'kysely'

export interface ArtEntity {
  id: Generated<string>
  name: string
  rating: number
  votes: number
  created_at: ColumnType<Date, string | undefined, never>
}


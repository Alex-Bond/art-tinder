import { Generated } from 'kysely'

export interface VoteEntity {
  id: Generated<string>; // UUID
  session_id: string; // UUID
  art_id: string; // UUID
  vote: number; // smallint
  created_at: Generated<Date>; // timestamptz
}

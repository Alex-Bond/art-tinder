export interface VoteEntity {
  id: string; // UUID
  session_id: string; // UUID
  art_id: string; // UUID
  vote: number; // smallint
  created_at: Date; // timestamptz
}

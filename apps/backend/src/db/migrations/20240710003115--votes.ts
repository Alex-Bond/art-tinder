import { Kysely, sql } from 'kysely'
import { DatabaseInterface } from '../database.interface'

export async function up(db: Kysely<DatabaseInterface>): Promise<void> {
  await db.schema
    .createTable('votes')
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('session_id', 'uuid', c => c.notNull())
    .addColumn('art_id', 'uuid', c => c.notNull())
    .addColumn('vote', 'smallint', c => c.notNull())
    .addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute()
  await db.schema.createIndex('IDX-votes-session_art').on('votes').columns(['session_id', 'art_id']).ifNotExists().execute()
}

export async function down(db: Kysely<DatabaseInterface>): Promise<void> {
  await db.schema.dropTable('votes').ifExists().execute()
}

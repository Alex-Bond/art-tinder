import { Kysely, sql } from 'kysely'
import { DatabaseInterface } from '../database.interface'

export async function up(db: Kysely<DatabaseInterface>): Promise<void> {
  await db.schema
    .createTable('art')
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn('name', 'varchar', c => c.notNull())
    .addColumn('rating', 'integer', c => c.notNull().defaultTo(0))
    .addColumn('votes', 'integer', c => c.notNull().defaultTo(0))
    .addColumn('created_at', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute()
  await db.schema.createIndex('IDX-art-rating').on('art').column('rating').ifNotExists().execute()
  await db.schema.createIndex('IDX-art-votes').on('art').column('votes').ifNotExists().execute()
}

export async function down(db: Kysely<DatabaseInterface>): Promise<void> {
  await db.schema.dropTable('art').ifExists().execute()
}

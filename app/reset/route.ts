import { db } from '@vercel/postgres';

const client = await db.connect();

export async function GET() {
    try {
        await client.sql`BEGIN`;
        await Promise.all([
            client.sql`DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "users" CASCADE`,
            client.sql`DROP TYPE IF EXISTS user_role CASCADE`,
            client.sql`DROP TABLE IF EXISTS "verification_token" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "accounts" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "sessions" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "customers" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "invoices" CASCADE`,
            client.sql`DROP TABLE IF EXISTS "revenue" CASCADE`,
        ]);
        await client.sql`COMMIT`;

        return Response.json({ message: 'Database reset successfully' });
    } catch (error) {
        await client.sql`ROLLBACK`;
        return Response.json({ error }, { status: 500 });
    }
}

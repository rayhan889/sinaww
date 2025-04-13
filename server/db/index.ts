import { drizzle } from 'drizzle-orm/postgres-js'
import { config } from 'dotenv'
import postgres from 'postgres'

config({ path: '.env.local' })

const client = postgres(process.env.DATABASE_URL as string)
const db = drizzle({ client })

export { db }

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("CRITICAL: DATABASE_URL is missing in environment variables!");
  }
  
  // Trên serverless (Vercel), mỗi instance chỉ xử lý một request tại một thời điểm,
  // nên pool nhỏ giúp cold start nhanh hơn và không làm cạn connection của Supabase pooler.
  const pool = new Pool({
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 3 : 10,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
// Trigger reload after schema update

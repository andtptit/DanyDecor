import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Ưu tiên DATABASE_URL (nên trỏ tới Pooler port 6543 trên Vercel)
  const connectionString = process.env.DATABASE_URL
  
  if (process.env.NODE_ENV === 'production') {
    const pool = new Pool({ 
      connectionString,
      max: 10, // Giới hạn số lượng kết nối trong pool cho mỗi Lambda function
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }
  
  // Ở môi trường local, dùng Prisma mặc định cho đơn giản
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

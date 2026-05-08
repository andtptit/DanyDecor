const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const settings = await prisma.setting.findMany()
    console.log('Settings:', settings)
  } catch (e) {
    console.error('Error:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()

import prisma from './src/lib/prisma.ts'

async function main() {
  console.log('🧪 Checking database connectivity...')
  try {
    const categories = await prisma.category.findMany()
    console.log(`✅ Successfully connected! Found ${categories.length} categories.`)
    
    if (categories.length === 0) {
      console.log('📝 Database is empty. Creating a test category...')
      const newCat = await prisma.category.create({
        data: {
          name: 'Test Category',
          slug: 'test-category',
          description: 'Created to test connection'
        }
      })
      console.log('✨ Created category:', newCat)
    }
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    process.exit()
  }
}

main()

import prisma from '@/lib/prisma'

async function main() {
  const categories = await prisma.category.findMany();
  
  const findId = (name: string) => categories.find(c => c.name.toLowerCase().trim() === name.toLowerCase().trim())?.id;

  const canvasId = findId('Tranh Canvas');
  const spaId = findId('Tranh Tráng Gương Spa');

  console.log('Canvas ID:', canvasId);
  console.log('Spa ID:', spaId);

  if (canvasId) {
    const children = ['Tranh chân dung', 'Tranh cưới', 'Tranh gia đình'];
    for (const name of children) {
      const id = findId(name);
      if (id && id !== canvasId) {
        await prisma.category.update({
          where: { id },
          data: { parentId: canvasId }
        });
        console.log(`Linked ${name} to Tranh Canvas`);
      }
    }
  }

  if (spaId) {
    const children = ['Tranh tiệm nail', 'Tranh tiệm tóc'];
    for (const name of children) {
      const id = findId(name);
      if (id && id !== spaId) {
        await prisma.category.update({
          where: { id },
          data: { parentId: spaId }
        });
        console.log(`Linked ${name} to Tranh Tráng Gương Spa`);
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

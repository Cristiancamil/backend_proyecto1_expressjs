const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      { name: 'Camilo', email: 'camilo@example.com' },
      { name: 'Cristina', email: 'cristina@example.com' },
    ],
  });

  console.log('Datos insertados correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

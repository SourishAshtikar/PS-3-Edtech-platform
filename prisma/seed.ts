import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seed script is currently empty.');
  // Add future seeding logic here
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

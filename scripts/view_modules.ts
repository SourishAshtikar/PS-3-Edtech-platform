import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const mods = await prisma.module.findMany({ include: { subtopics: true } });
  for (const m of mods) {
    console.log(`Module ${m.moduleNo}: ${m.title} (ID: ${m.id})`);
    for (const s of m.subtopics) {
      console.log(`  Subtopic: ${s.title} (ID: ${s.id})`);
    }
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());

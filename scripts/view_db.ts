import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const qs = await prisma.question.findMany();
  qs.forEach(q => console.log(q.id + " | " + q.questionText.substring(0, 50) + "... | " + JSON.stringify(q.options)));
}

check().catch(console.error).finally(() => prisma.$disconnect());

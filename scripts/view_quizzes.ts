import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const qs = await prisma.quiz.findMany();
  qs.forEach(q => console.log(q.id + " | " + q.title + " | Subtopic: " + q.subtopicId));
}

check().catch(console.error).finally(() => prisma.$disconnect());

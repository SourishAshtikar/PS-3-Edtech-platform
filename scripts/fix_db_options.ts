import { PrismaClient } from '@prisma/client';
import { module1Quizzes } from '../src/data/module1QuizData';
import { module2Quizzes } from '../src/data/module2QuizData';

const prisma = new PrismaClient();

async function fix() {
  const dbQuestions = await prisma.question.findMany();
  
  // Flatten all local questions into one array
  const allLocalQuestions = [
    ...Object.values(module1Quizzes).flatMap(q => q.questions),
    ...Object.values(module2Quizzes).flatMap(q => q.questions)
  ];

  let updateCount = 0;

  for (const dbq of dbQuestions) {
    // Find matching local question by starting text (or exactly)
    const local = allLocalQuestions.find(lq => 
      dbq.questionText.trim() === lq.questionText.trim() ||
      dbq.questionText.trim().startsWith(lq.questionText.trim().substring(0, 50))
    );

    if (local) {
      await prisma.question.update({
        where: { id: dbq.id },
        data: {
          options: local.options,
          correctAnswer: local.correctAnswer,
          explanation: local.explanation
        }
      });
      updateCount++;
    }
  }

  console.log(`Updated ${updateCount} questions from local data.`);
}

fix().catch(console.error).finally(() => prisma.$disconnect());

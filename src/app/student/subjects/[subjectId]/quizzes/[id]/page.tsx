import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizContainer } from "./QuizContainer";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";
import { LocalQuizWrapper } from "./LocalQuizWrapper";

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Intercept local module 1 quizzes
  if (id in module1Quizzes) {
    return <LocalQuizWrapper quiz={module1Quizzes[id]} />;
  }

  // Intercept local module 2 quizzes
  if (id in module2Quizzes) {
    return <LocalQuizWrapper quiz={module2Quizzes[id]} />;
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      module: true,
      questions: {
        orderBy: { id: 'asc' }
      }
    }
  });

  if (!quiz) {
    notFound();
  }

  // Cast type to match QuizContainer expectations
  const typedQuiz = {
    id: quiz.id,
    moduleId: quiz.moduleId,
    title: quiz.title,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    xpReward: quiz.xpReward,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      marks: q.marks,
    })),
    module: {
      moduleNo: quiz.module.moduleNo,
    }
  };

  return <QuizContainer quiz={typedQuiz} />;
}


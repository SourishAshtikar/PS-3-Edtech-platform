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

  // Shuffle questions randomly
  const shuffledQuestions = [...quiz.questions].sort(() => Math.random() - 0.5);
  
  // Slice to totalQuestionsToAsk if defined
  const displayQuestions = quiz.totalQuestionsToAsk 
    ? shuffledQuestions.slice(0, quiz.totalQuestionsToAsk)
    : shuffledQuestions;

  // Cast type to match QuizContainer expectations
  const typedQuiz = {
    id: quiz.id,
    moduleId: quiz.moduleId,
    title: quiz.title,
    difficulty: quiz.difficulty,
    timeLimit: quiz.timeLimit,
    xpReward: quiz.xpReward,
    questions: displayQuestions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      marks: q.marks,
    })),
    module: {
      moduleNo: quiz.module.moduleNo,
    }
  };

  return <QuizContainer quiz={typedQuiz} />;
}


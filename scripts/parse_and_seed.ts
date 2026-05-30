import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const moduleMap: Record<string, string> = {
  "1": "cmpplod0h0002h2qdk9xzhrp6",
  "2": "cmpplqlq40007h2qdsqpwwb6s",
  "3": "cmpprbkvb0006smq6prl6zpa3"
};

const subtopicMap: Record<string, string> = {
  "1.3": "cmppr9ani0004smq6wyerk4zx",
  "2.2": "cmppr7rif0000smq67uy75lqr",
  "2.3": "cmppr7rif0001smq6mnae7vzt",
  "2.4": "cmppr7rif0002smq6z1c645n6",
  "3.1": "cmpprbkvb0007smq6cy7rxiej",
  "3.2": "cmpprbkvb0008smq60cx9w7t2",
  "3.3": "cmpprbkvc0009smq65mcsu5fd",
  "3.4": "cmpprbkvc000asmq6qrq20l4z"
};

async function parseAndSeed() {
  const filePath = path.join(__dirname, 'raw_questions.txt');
  const text = fs.readFileSync(filePath, 'utf-8');
  
  const lines = text.split('\n').map(l => l.trim());
  
  let currentQuizId = "";
  let currentQuizTitle = "";
  let currentModuleId = "";
  let currentSubtopicId = "";
  
  let currentQuestionText = "";
  let currentOptions: string[] = [];
  let currentAnswer = "";
  let currentExplanation = "";
  let state = "SEARCHING"; // SEARCHING, QUESTION, OPTIONS, ANSWER

  let questionsAdded = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") continue;

    // Detect Header (e.g., "1.3 Human Considerations in Design" or "Module 3: Web Interface Design (Final Mastery Level)")
    const headerMatch = line.match(/^(?:Module.*?)?(\d\.\d)\s+(.*)/);
    if (headerMatch && !line.match(/^\d+\.\s+/)) { // Exclude if it's "21. A logistics..."
      const numPrefix = headerMatch[1]; // e.g. "1.3"
      const title = headerMatch[2];
      
      currentSubtopicId = subtopicMap[numPrefix];
      currentModuleId = moduleMap[numPrefix.split('.')[0]];
      
      console.log(`Found Header: ${numPrefix} - ${title}`);
      
      if (currentSubtopicId) {
        let quiz = await prisma.quiz.findFirst({ where: { subtopicId: currentSubtopicId } });
        if (!quiz) {
          quiz = await prisma.quiz.create({
            data: {
              moduleId: currentModuleId,
              subtopicId: currentSubtopicId,
              title: title,
              difficulty: "Medium",
              timeLimit: 15,
              xpReward: 150
            }
          });
          console.log(`Created Quiz: ${quiz.title}`);
        }
        currentQuizId = quiz.id;
        currentQuizTitle = quiz.title;
        console.log(`Matched/Created Quiz ID: ${currentQuizId}`);
      } else {
        console.log(`Failed to find Subtopic ID for: ${numPrefix}`);
      }
      continue;
    }

    // Detect Question Start
    const qMatch = line.match(/^\d+\.\s+(.*)/);
    if (qMatch && state === "SEARCHING") {
      state = "QUESTION";
      currentQuestionText = qMatch[1];
      currentOptions = [];
      currentAnswer = "";
      currentExplanation = "";
      continue;
    }

    if (state === "QUESTION") {
      if (line.match(/^[A-D]\)/)) {
        state = "OPTIONS";
        currentOptions.push(line.replace(/^[A-D]\)\s*/, ''));
      } else {
        currentQuestionText += " " + line;
      }
      continue;
    }

    if (state === "OPTIONS") {
      if (line.match(/^[A-D]\)/)) {
        currentOptions.push(line.replace(/^[A-D]\)\s*/, ''));
      } else if (line.startsWith("Answer:")) {
        state = "ANSWER";
        const ansMatch = line.match(/^Answer:\s+([A-D])\.?\s*(.*)/);
        if (ansMatch) {
          currentAnswer = ansMatch[1];
          currentExplanation = ansMatch[2];
        }
      }
      continue;
    }

    if (state === "ANSWER") {
      if (line.match(/^\d+\.\s+/) || line.match(/^(?:Module.*?)?(\d\.\d)\s+(.*)/)) {
        if (currentQuizId && currentQuestionText && currentOptions.length > 0) {
          await prisma.question.create({
            data: {
              quizId: currentQuizId,
              questionText: currentQuestionText,
              options: currentOptions,
              correctAnswer: currentAnswer || "A",
              explanation: currentExplanation,
              difficulty: "Medium",
              marks: 1
            }
          });
          questionsAdded++;
          console.log(`Added question to ${currentQuizTitle}`);
        }
        state = "SEARCHING";
        i--;
      } else {
        currentExplanation += " " + line;
      }
    }
  }

  if (state === "ANSWER" && currentQuizId && currentQuestionText && currentOptions.length > 0) {
    await prisma.question.create({
      data: {
        quizId: currentQuizId,
        questionText: currentQuestionText,
        options: currentOptions,
        correctAnswer: currentAnswer || "A",
        explanation: currentExplanation,
        difficulty: "Medium",
        marks: 1
      }
    });
    questionsAdded++;
    console.log(`Added final question to ${currentQuizTitle}`);
  }

  console.log(`Done! Added ${questionsAdded} questions.`);
}

parseAndSeed().catch(console.error).finally(() => prisma.$disconnect());

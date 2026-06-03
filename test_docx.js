const fs = require('fs');
const mammoth = require('mammoth');

async function test() {
  const result = await mammoth.extractRawText({ path: "D:\\Projects\\Edtech Platform\\UX_Flashcards.docx" });
  const text = result.value;
  
  const newCards = [];
  const blocks = text.split(/\n(?=\d+\.\s)/).filter(b => b.trim());

  blocks.forEach(block => {
    // Make newline optional before Answer:
    const qMatch = block.match(/^(?:\d+\.\s+)?([\s\S]*?)(?=\s*Answer:)/i);
    if (!qMatch) return;
    const question = qMatch[1].trim();

    const answerMatch = block.match(/Answer:\s*([\s\S]*)/i);
    const answer = answerMatch ? answerMatch[1].trim() : "";

    if (question && answer) {
      newCards.push({ question, answer });
    }
  });

  console.log("PARSED CARDS:");
  console.log(newCards);
}

test().catch(console.error);

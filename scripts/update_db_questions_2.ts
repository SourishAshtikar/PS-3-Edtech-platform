import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    keyword: "streaming",
    questionText: `A streaming service offers 10,000 movies. Analytics show users spend an average of 35 minutes scrolling before selecting a title, or they abandon the app entirely. The design team introduces a "Pick for me based on 3 quick questions" feature. What human characteristic law is driving this design change?`,
    options: [
      `Fitts's Law; making the buttons larger.`,
      `Hick’s Law; trading a slight increase in interaction cost (a 3-step quiz) for a massive reduction in decision paralysis.`,
      `Miller's Law; chunking the 10,000 movies into 7 categories.`,
      `Jakob's Law; mimicking a competitor's feature.`
    ],
    correctAnswer: "B",
    explanation: `Hick’s Law dictates that decision time increases exponentially with the volume of choices. Bypassing the massive list and narrowing the parameters reduces cognitive overload.`
  },
  {
    keyword: "Delete Clip",
    questionText: `A desktop video editing software places the highly destructive "Delete Clip" tool as a tiny, 12x12 pixel icon in the exact center of a crowded top toolbar. Editors frequently misclick and delete the wrong assets. This interface is violating:`,
    options: [
      `The Pareto Principle`,
      `Tesler's Law`,
      `Fitts’s Law`,
      `The Zeigarnik Effect`
    ],
    correctAnswer: "C",
    explanation: `Fitts’s Law states that target acquisition time is a function of distance and size. Destructive or primary actions need large, isolated touch targets, or should leverage infinite screen edges to prevent motor errors.`
  },
  {
    keyword: "16-character",
    questionText: `A global shipping portal requires dock workers to enter a 16-character alphanumeric container manifest code into a single, continuous text field. The workers, wearing gloves in a fast-paced environment, constantly lose their place in the string and make typos. How should human short-term memory constraints be accommodated here?`,
    options: [
      `Implement Hick's Law by removing options from the screen.`,
      `Implement Miller’s Law via visual formatting (e.g., auto-spacing the input string as MSCU - 1938 - 4726 - 89B2).`,
      `Use the Gestalt principle of Similarity to color-code the letters versus the numbers.`,
      `Apply the Gutenberg Diagram to move the input field to the bottom right of the tablet.`
    ],
    correctAnswer: "B",
    explanation: `The human brain struggles to hold more than 7 (±2) discrete items in working memory. Grouping (chunking) a long, meaningless string of data into blocks of four makes it vastly easier to read, verify, and type.`
  },
  {
    keyword: "dashboard colors healthy servers",
    questionText: `An enterprise dashboard displays 50 different server metrics tightly packed in a grid. The designer makes all "Healthy" servers a distinct blue and all "Failing" servers a vibrant orange. A system admin can instantly spot the 3 failing servers without scanning every row. Which psychological principle overrides the dense spatial layout here?`,
    options: [
      `Proximity`,
      `Closure`,
      `Continuity`,
      `Similarity`
    ],
    correctAnswer: "D",
    explanation: `While the tight grid groups everything together physically (Proximity), Similarity (specifically via strong color contrast) is a stronger visual cue. It allows the brain to instantly categorize scattered elements into distinct functional groups.`
  },
  {
    keyword: "Taxes",
    questionText: `A travel booking app updates the final "Taxes and Fees" cost in a small font at the absolute bottom of the screen while the user is actively typing their credit card details at the top of the screen. The user complains later they were overcharged. What human limitation caused this?`,
    options: [
      `Saccadic masking`,
      `Visual Hierarchy failure`,
      `Change Blindness`,
      `Fitts's Law`
    ],
    correctAnswer: "C",
    explanation: `Humans are remarkably poor at noticing changes in their visual field if their active attention is focused elsewhere (the keyboard/input fields). State changes disconnected from the focal point require animation or clear notifications to be perceived.`
  },
  {
    keyword: "warning",
    questionText: `A critical system warning is placed inside a vibrant, animated carousel banner at the very top of a corporate intranet homepage. Metrics show that 95% of employees scroll completely past it without reading. What psychological phenomenon explains this?`,
    options: [
      `Change Blindness`,
      `Selective Attention (Banner Blindness)`,
      `Sensory Adaptation`,
      `Cognitive Dissonance`
    ],
    correctAnswer: "B",
    explanation: `Users have been conditioned over decades of web browsing that wide, animated rectangles at the top of pages are advertisements. They subconsciously tune out this spatial area and styling, regardless of the actual content.`
  },
  {
    keyword: "EV",
    questionText: `An electric vehicle dashboard uses a digital representation of a traditional swinging gas needle (E to F) to display the battery level, rather than a smartphone-style battery icon. What is the primary UX justification for this?`,
    options: [
      `It reduces the processing power required by the car's computer.`,
      `It leverages a legacy mental model, significantly reducing the learning curve for drivers transitioning from combustion engines to EVs.`,
      `It is a requirement of international accessibility standards.`,
      `It violates Jakob's Law to appear more innovative.`
    ],
    correctAnswer: "B",
    explanation: `Mental models are deeply ingrained. Using a familiar conceptual metaphor (the gas gauge) helps users instantly understand a new underlying technology (battery state of charge) without friction.`
  },
  {
    keyword: "Meditation",
    questionText: `A high-end meditation app features smooth, 60fps flowing water animations, soft color gradients, and gentle, synchronized haptic feedback the moment it launches. Users report feeling immediately calmer before they even start a session. According to Don Norman, this design successfully appeals to the:`,
    options: [
      `Reflective level`,
      `Behavioral level`,
      `Visceral level`,
      `Conceptual level`
    ],
    correctAnswer: "C",
    explanation: `The visceral level is about immediate, subconscious sensory reactions—the raw aesthetics, feel, and initial visual/tactile impact before any conscious interaction or task execution occurs.`
  },
  {
    keyword: "I Agree",
    questionText: `A text-heavy Terms of Service page forces users to scroll to the bottom. The designer places the primary "I Agree" button isolated in the bottom-left corner of the layout. Based on established scanning patterns for western readers, why will this cause a momentary visual stutter?`,
    options: [
      `The bottom-left is the Primary Optical Area.`,
      `The bottom-left is the Weak Fallow Area; the eye naturally sweeps across and down to terminate in the bottom-right corner.`,
      `It forces a Z-Pattern instead of an F-Pattern.`,
      `It violates the Gestalt principle of symmetry.`
    ],
    correctAnswer: "B",
    explanation: `The Gutenberg Diagram maps reading gravity. The bottom-left is a blind spot during a sweeping scan. Concluding actions belong in the Terminal Area (bottom-right) or explicitly centered.`
  },
  {
    keyword: "two words",
    questionText: `Eye-tracking studies on a news aggregator website reveal that users are reading the first two words of every headline and entirely ignoring the summaries beneath them. To optimize the layout for this behavior, the designer should:`,
    options: [
      `Implement a Z-pattern layout with alternating images.`,
      `Design for F-pattern scanning by front-loading the most critical keywords at the absolute beginning of every headline.`,
      `Force users to read by removing the images.`,
      `Convert the list into a masonry grid.`
    ],
    correctAnswer: "B",
    explanation: `When users are hunting for information, they scan vertically down the left edge (the F-pattern). Placing critical information at the end of a sentence ensures it will not be seen.`
  }
];

async function fix() {
  const qs = await prisma.question.findMany();
  let updated = 0;

  for (const q of qs) {
    const match = updates.find(u => q.questionText.includes(u.keyword));
    if (match) {
      await prisma.question.update({
        where: { id: q.id },
        data: {
          questionText: match.questionText,
          options: match.options,
          correctAnswer: match.correctAnswer,
          explanation: match.explanation
        }
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} questions!`);
}

fix().catch(console.error).finally(() => prisma.$disconnect());

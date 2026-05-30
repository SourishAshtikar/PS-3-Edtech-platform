import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  {
    keyword: "drone",
    questionText: `A user is operating a drone via a mobile app. The left joystick controls altitude. The user enters "Camera Mode" to adjust the lens angle, intuitively pushes the left joystick up to tilt the camera, and the drone unexpectedly shoots 50 feet into the air. What systemic issue caused this failure?`,
    options: [
      `A Gulf of Execution; the user could not physically manipulate the joystick.`,
      `A Mode Error; the user executed an action appropriate for one state, while the system was in a visually indistinct but functionally different state.`,
      `A failure of Natural Mapping; up should always mean down in camera controls.`,
      `Cognitive Friction; the drone has too many features.`
    ],
    correctAnswer: "B",
    explanation: `Mode errors are among the most dangerous UX failures. They occur when the same control does two entirely different things depending on a hidden or poorly communicated system state.`
  },
  {
    keyword: "finance manager",
    questionText: `A finance manager accidentally submits a massive payroll run with a misplaced decimal point. The system immediately processes it, but provides a highly detailed error log on the next screen and a phone number to call IT support. What is the fundamental UX failure regarding error handling?`,
    options: [
      `The system failed to provide active, immediate system-level recovery (such as a temporary reversal or "Undo" state) over passive documentation.`,
      `The system's error log lacked sufficient technical jargon to explain the database failure.`,
      `The system violated the Gestalt principle of Closure.`,
      `The system failed to utilize a forgiving format for the decimal input.`
    ],
    correctAnswer: "A",
    explanation: `Providing documentation after a catastrophic action is a failure of Error Recovery. Good UX dictates that systems should either prevent the error via friction (confirmation) or provide an immediate, user-controlled reversal mechanism.`
  },
  {
    keyword: "deletes a critical",
    questionText: `A user accidentally deletes a critical, shared folder in a cloud storage workspace. Which post-error recovery mechanism is empirically most effective for minimizing user anxiety and interaction cost?`,
    options: [
      `A multi-step process requiring the user to navigate to a global "Recycle Bin," search for the folder, and click "Restore."`,
      `A modal pop-up forcing the user to type the word "DELETE" to confirm the action beforehand.`,
      `A non-intrusive, 10-second contextual "Undo" notification that floats at the bottom of the screen immediately after the action.`,
      `An automated email sent to the workspace administrator requesting permission to undelete the file.`
    ],
    correctAnswer: "C",
    explanation: `While (B) is error prevention, (C) is the gold standard for Error Recovery. A contextual "Undo" toast allows the user to immediately fix a motor error with a single click, completely bypassing the friction of a multi-step recycle bin.`
  },
  {
    keyword: "thermostat",
    questionText: `A designer for a smart-home thermostat removes all text labels from the interface. Instead, they use a custom line-drawing of a leaf, a snowflake, and a wavy line. Support calls skyrocket because users cannot figure out how to set a schedule. The designer has unknowingly implemented:`,
    options: [
      `A Skeuomorphic interface`,
      `An interface with excessively high discoverability friction, forcing users to click elements just to learn what they do.`,
      `Progressive Disclosure`,
      `The Golden Ratio`
    ],
    correctAnswer: "B",
    explanation: `This is the functional definition of "Mystery Meat Navigation" (without using the giveaway term). Relying solely on non-standard, unlabeled iconography forces the user to expend cognitive effort to decode the interface, severely damaging learnability.`
  },
  {
    keyword: "car seat",
    questionText: `A car seat adjuster uses four identical buttons arranged in a perfect horizontal row on the door panel. From left to right, they control: Seat Height, Backrest Tilt, Forward/Backward slide, and Lumbar support. Why do users constantly press the wrong button?`,
    options: [
      `The controls lack haptic feedback.`,
      `The spatial arrangement of the physical controls does not correlate to the spatial dimensions of the physical seat.`,
      `The buttons are violating Fitts's Law.`,
      `The system lacks an escape hatch.`
    ],
    correctAnswer: "B",
    explanation: `This is a failure of Natural Mapping. A horizontal row of buttons provides zero spatial cues for vertical height or rotational tilt. The controls must map to the physical reality they manipulate.`
  },
  {
    keyword: "Submit Payment",
    questionText: `A user attempts to pay a utility bill online. They click the "Submit Payment" button. The button visually depresses, but the screen remains static for six seconds before loading the confirmation page. The user panics, clicks the button twice more, and double-charges their account. What usability gap occurred?`,
    options: [
      `The system failed to bridge the Gulf of Execution.`,
      `The system failed to bridge the Gulf of Evaluation by lacking immediate state-change visibility (e.g., a loading spinner or disabling the button).`,
      `The system failed to provide a forgiving data format.`,
      `The system suffered from Feature Creep.`
    ],
    correctAnswer: "B",
    explanation: `The user successfully executed the action, but the system failed to communicate back (evaluate) that it was currently processing the request. In the absence of feedback, users assume failure and repeat the action.`
  },
  {
    keyword: "note app",
    questionText: `A simple, beloved note-taking application is acquired by a larger company. Over two years, the developers add task dependencies, Gantt charts, team chat, and CRM integrations. Core users begin abandoning the app, complaining it is "too heavy." This is the direct result of:`,
    options: [
      `The system's conceptual model shifting too far, overwhelming the user's original mental model via scope expansion.`,
      `A violation of the LATCH principle.`,
      `Sensory Adaptation.`,
      `The Zeigarnik Effect.`
    ],
    correctAnswer: "A",
    explanation: `This is the practical impact of Feature Creep. Continual addition of features without ruthless pruning clutters the UI, destroying the primary workflow and imposing a massive cognitive load on users who only wanted a simple tool.`
  },
  {
    keyword: "hospital portal",
    questionText: `A hospital patient portal uses a bright red highlight to indicate "Urgent Action Required" on the main dashboard. However, in the "Past Visits" tab, bright red is used to highlight appointments that were "Canceled." What usability principle is failing here?`,
    options: [
      `External Consistency; the system does not match other hospital portals.`,
      `Internal Consistency; the system forces the user to context-switch the meaning of a primary visual signifier within the same application.`,
      `Error Prevention; canceled appointments should not be shown.`,
      `Defensive Design; red should never be used in medical software.`
    ],
    correctAnswer: "B",
    explanation: `Internal consistency dictates that UI elements and colors must behave predictably throughout a single ecosystem. Changing the meaning of "Red" from 'Action Needed' to 'Inactive/Canceled' guarantees confusion.`
  },
  {
    keyword: "hamburger graphic",
    questionText: `A touchscreen kiosk for ordering food has a beautifully rendered, 3D graphic of a hamburger that looks exactly like a physical, pushable button. However, the system only registers a selection if the user performs a "swipe right" gesture on the graphic. What is the diagnosis?`,
    options: [
      `The interface lacks a forgiving format.`,
      `The perceived visual affordance (push) directly conflicts with the required interaction model (swipe).`,
      `The screen violates the Gestalt principle of Closure.`,
      `The system fails the heuristic of "Help and Documentation."`
    ],
    correctAnswer: "B",
    explanation: `Affordances are cues that tell a user how to interact with an object. If a digital object visually begs to be tapped, but functionally requires a swipe, the resulting cognitive friction is entirely the designer's fault.`
  },
  {
    keyword: "government form",
    questionText: `A user is filling out a complex, multi-page government application. If they accidentally hit the "Back" button on their browser, all 40 fields of data are wiped out. From a defensive design perspective, what is the most robust systemic fix?`,
    options: [
      `Place a warning label at the top of the page telling users not to use the browser back button.`,
      `Implement continuous background auto-saving (session storage) so the data persists regardless of user navigation errors.`,
      `Make the "Next" button larger and green.`,
      `Break the 40 fields into 40 separate pages to limit data loss.`
    ],
    correctAnswer: "B",
    explanation: `Good error recovery anticipates that users will make mistakes (like hitting the browser back button). Auto-saving protects the user's labor without requiring them to change their natural browsing behavior.`
  }
];

async function fix() {
  const qs = await prisma.question.findMany();
  let updated = 0;

  for (const q of qs) {
    const match = updates.find(u => q.questionText.includes(u.keyword) || q.questionText.toLowerCase().includes(u.keyword.toLowerCase()));
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

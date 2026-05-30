export interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
}

export interface SubtopicQuiz {
  subtopicId: string;
  title: string;
  questions: Question[];
}

export const module1Quizzes: Record<string, SubtopicQuiz> = {
  "st1-1": {
    subtopicId: "st1-1",
    title: "Common Problems with Usability",
    questions: [
      {
        id: 1,
        questionText: "A user is operating a drone via a mobile app. The left joystick controls altitude. The user enters Camera Mode to adjust the lens angle, intuitively pushes the left joystick up to tilt the camera, and the drone unexpectedly shoots 50 feet into the air. What systemic issue caused this failure?",
        options: ["A Gulf of Execution; the user could not physically manipulate the joystick.", "A Mode Error; the user executed an action appropriate for one state, while the system was in a visually indistinct but functionally different state.", "A failure of Natural Mapping; up should always mean down in camera controls.", "Cognitive Friction; the drone has too many features."],
        correctAnswer: "B",
        explanation: "Mode errors occur when the same control does different things depending on a hidden or poorly communicated system state."
      },
      {
        id: 2,
        questionText: "A finance manager accidentally submits a massive payroll run with a misplaced decimal point. The system immediately processes it, but provides a highly detailed error log on the next screen and a phone number to call IT support. What is the fundamental UX failure regarding error handling?",
        options: ["The system failed to provide active, immediate recovery such as Undo.", "The error log lacked technical jargon.", "The system violated Gestalt Closure.", "The system failed to use forgiving decimal input."],
        correctAnswer: "A",
        explanation: "Good UX should prevent catastrophic errors or provide immediate recovery."
      },
      {
        id: 3,
        questionText: "A user accidentally deletes a critical shared folder in a cloud workspace. Which post-error recovery mechanism is most effective?",
        options: ["Multi-step Recycle Bin restore.", "Type DELETE before deleting.", "A non-intrusive 10-second contextual Undo notification.", "Email admin for undelete permission."],
        correctAnswer: "C",
        explanation: "Contextual Undo gives immediate recovery with minimum friction."
      },
      {
        id: 4,
        questionText: "A thermostat removes text labels and uses only custom icons. Users cannot figure out scheduling. The designer has implemented:",
        options: ["Skeuomorphic interface.", "High discoverability friction.", "Progressive Disclosure.", "Golden Ratio."],
        correctAnswer: "B",
        explanation: "Non-standard unlabeled icons force users to guess."
      },
      {
        id: 5,
        questionText: "A car seat adjuster has four identical horizontal buttons controlling height, tilt, slide, and lumbar. Why do users press the wrong button?",
        options: ["No haptic feedback.", "Spatial controls do not match the physical seat dimensions.", "Violation of Fitts’s Law.", "No escape hatch."],
        correctAnswer: "B",
        explanation: "This is failure of Natural Mapping."
      },
      {
        id: 6,
        questionText: "A user clicks Submit Payment. The button depresses but screen stays static for six seconds. User clicks again and gets double charged. What gap occurred?",
        options: ["Gulf of Execution.", "Gulf of Evaluation due to lack of feedback.", "No forgiving format.", "Feature creep."],
        correctAnswer: "B",
        explanation: "The system failed to show that payment was processing."
      },
      {
        id: 7,
        questionText: "A simple note app adds Gantt charts, chat, CRM, etc. Users abandon it as too heavy. This is due to:",
        options: ["Conceptual model shifting too far due to feature creep.", "LATCH violation.", "Sensory Adaptation.", "Zeigarnik Effect."],
        correctAnswer: "A",
        explanation: "Feature creep increases cognitive load and damages the core workflow."
      },
      {
        id: 8,
        questionText: "A hospital portal uses red for Urgent Action on dashboard and red for Canceled in Past Visits. What principle fails?",
        options: ["External consistency.", "Internal consistency.", "Error prevention.", "Defensive design."],
        correctAnswer: "B",
        explanation: "The same color should not mean different things in the same app."
      },
      {
        id: 9,
        questionText: "A hamburger graphic looks tappable but works only by swipe right. Diagnosis?",
        options: ["No forgiving format.", "Visual affordance conflicts with interaction model.", "Gestalt Closure issue.", "Help documentation issue."],
        correctAnswer: "B",
        explanation: "The object suggests tap but requires swipe, causing cognitive friction."
      },
      {
        id: 10,
        questionText: "A government form loses all 40 fields when browser Back is pressed. Best systemic fix?",
        options: ["Warning label.", "Continuous background auto-save.", "Larger green Next button.", "Split into 40 pages."],
        correctAnswer: "B",
        explanation: "Auto-save protects user work from natural navigation mistakes."
      }
    ]
  },
  "st1-2": {
    subtopicId: "st1-2",
    title: "Human Characteristics in Design",
    questions: [
      {
        id: 11,
        questionText: "A streaming app with 10,000 movies adds “Pick for me based on 3 questions.” Which law?",
        options: ["Fitts’s Law.", "Hick’s Law.", "Miller’s Law.", "Jakob’s Law."],
        correctAnswer: "B",
        explanation: "Hick’s Law says decision time increases with number of choices."
      },
      {
        id: 12,
        questionText: "A destructive Delete Clip icon is tiny and placed in a crowded toolbar. Which law is violated?",
        options: ["Pareto Principle.", "Tesler’s Law.", "Fitts’s Law.", "Zeigarnik Effect."],
        correctAnswer: "C",
        explanation: "Important or destructive targets should not be tiny and hard to click."
      },
      {
        id: 13,
        questionText: "A 16-character container code is entered in one long field. Workers lose their place. Best fix?",
        options: ["Remove options.", "Chunk the input like MSCU - 1938 - 4726 - 89B2.", "Color letters and numbers.", "Move input bottom-right."],
        correctAnswer: "B",
        explanation: "Miller’s Law supports chunking long data."
      },
      {
        id: 14,
        questionText: "A dashboard colors healthy servers blue and failing servers orange. Admins instantly spot failures. Principle?",
        options: ["Proximity.", "Closure.", "Continuity.", "Similarity."],
        correctAnswer: "D",
        explanation: "Similarity through color groups related elements quickly."
      },
      {
        id: 15,
        questionText: "Taxes update at screen bottom while user types card details at top. User misses it. Cause?",
        options: ["Saccadic masking.", "Visual hierarchy failure.", "Change Blindness.", "Fitts’s Law."],
        correctAnswer: "C",
        explanation: "Users miss visual changes outside their focus."
      },
      {
        id: 16,
        questionText: "A warning is inside an animated top banner and users ignore it. Phenomenon?",
        options: ["Change Blindness.", "Selective Attention / Banner Blindness.", "Sensory Adaptation.", "Cognitive Dissonance."],
        correctAnswer: "B",
        explanation: "Users ignore banner-like areas due to learned behavior."
      },
      {
        id: 17,
        questionText: "EV dashboard uses traditional E-F gas needle for battery. Why?",
        options: ["Saves processing power.", "Uses familiar mental model.", "Accessibility requirement.", "Violates Jakob’s Law."],
        correctAnswer: "B",
        explanation: "Familiar mental models reduce learning effort."
      },
      {
        id: 18,
        questionText: "Meditation app uses smooth animations, gradients, and haptics; users feel calm instantly. Don Norman level?",
        options: ["Reflective.", "Behavioral.", "Visceral.", "Conceptual."],
        correctAnswer: "C",
        explanation: "Visceral design creates immediate sensory/emotional response."
      },
      {
        id: 19,
        questionText: "“I Agree” button is placed bottom-left after Terms page. Why visual stutter?",
        options: ["Bottom-left is Primary Optical Area.", "Bottom-left is Weak Fallow Area.", "Forces Z-pattern.", "Violates symmetry."],
        correctAnswer: "B",
        explanation: "Gutenberg Diagram suggests final action belongs near bottom-right or center."
      },
      {
        id: 20,
        questionText: "Users read first two words of headlines and ignore summaries. Optimize by:",
        options: ["Z-pattern layout.", "Front-load important keywords for F-pattern scanning.", "Remove images.", "Use masonry grid."],
        correctAnswer: "B",
        explanation: "F-pattern scanning focuses on the left and start of text lines."
      }
    ]
  },
  "st1-3": {
    subtopicId: "st1-3",
    title: "Human Considerations in Design",
    questions: [
      {
        id: 21,
        questionText: "Truck drivers miss audio navigation chimes in loud diesel trucks. Design failed to consider:",
        options: ["Progressive impairments.", "Situational impairments.", "Cognitive impairments.", "Pareto Principle."],
        correctAnswer: "B",
        explanation: "Loud environments create situational impairment."
      },
      {
        id: 22,
        questionText: "Checkout asks billing address, then asks same shipping address again. Cognitive load impact?",
        options: ["Intrinsic load.", "Unnecessary extraneous load.", "Germane load.", "Prevents saccadic masking."],
        correctAnswer: "B",
        explanation: "Repeated input creates unnecessary friction."
      },
      {
        id: 23,
        questionText: "English e-commerce buttons are fixed at 150px. What happens in German?",
        options: ["Buttons change color.", "Text truncates or overflows.", "Buttons become RTL.", "CSS fails."],
        correctAnswer: "B",
        explanation: "German translations often require more space."
      },
      {
        id: 24,
        questionText: "Gray #999999 text on white background causes readability complaints. Standard violated?",
        options: ["Fitts’s Law.", "WCAG AA 4.5:1 contrast ratio for normal text.", "ARIA label requirement.", "LATCH."],
        correctAnswer: "B",
        explanation: "Low contrast text fails accessibility requirements."
      },
      {
        id: 25,
        questionText: "Crypto chart uses only green/red lines with no labels or arrows. Who is affected?",
        options: ["Tritanopia users.", "Deuteranomaly red-green color blindness users.", "Screen magnifier users.", "Motor impaired users."],
        correctAnswer: "B",
        explanation: "Critical information should not rely only on red/green color."
      },
      {
        id: 26,
        questionText: "Submit button stays disabled until Issue Description has 10 characters. Strategy?",
        options: ["Poka-Yoke / mistake-proofing.", "Mystery Meat Navigation.", "Dark Pattern.", "Progressive Disclosure."],
        correctAnswer: "A",
        explanation: "The design prevents the error before it happens."
      },
      {
        id: 27,
        questionText: "A right-handed mobile app puts Confirm in the extreme top-left. What is ignored?",
        options: ["Text expansion.", "Mobile thumb-zone ergonomics.", "Gestalt Proximity.", "Screen reader accessibility."],
        correctAnswer: "B",
        explanation: "Top-left is hard to reach on large phones."
      },
      {
        id: 28,
        questionText: "User enters $55,000.00 but system says invalid, numeric only. Principle failed?",
        options: ["LATCH.", "Progressive Disclosure.", "Forgiving Format.", "Graceful Degradation."],
        correctAnswer: "C",
        explanation: "The system should accept common human input formats and clean them."
      },
      {
        id: 29,
        questionText: "A custom slider is built only with div and span, works with mouse but not semantic. What is damaged?",
        options: ["Mobile responsiveness.", "Accessibility for keyboard and screen reader users.", "Cognitive load for experts.", "Fitts’s Law."],
        correctAnswer: "B",
        explanation: "Semantic HTML is necessary for assistive technologies."
      },
      {
        id: 30,
        questionText: "Professional 3D software has dense UI, tiny icons, shortcuts, and hidden menus. Why is this correct?",
        options: ["Prioritizes visceral level.", "Uses Zeigarnik Effect.", "Aligns with expert persona needing speed, density, and flexibility.", "Conway’s Law."],
        correctAnswer: "C",
        explanation: "Expert tools can prioritize efficiency over beginner simplicity."
      }
    ]
  }
};

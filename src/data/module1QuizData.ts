export interface Question {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
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
        optionA: "A Gulf of Execution; the user could not physically manipulate the joystick.",
        optionB: "A Mode Error; the user executed an action appropriate for one state, while the system was in a visually indistinct but functionally different state.",
        optionC: "A failure of Natural Mapping; up should always mean down in camera controls.",
        optionD: "Cognitive Friction; the drone has too many features.",
        correctAnswer: "B",
        explanation: "Mode errors occur when the same control does different things depending on a hidden or poorly communicated system state."
      },
      {
        id: 2,
        questionText: "A finance manager accidentally submits a massive payroll run with a misplaced decimal point. The system immediately processes it, but provides a highly detailed error log on the next screen and a phone number to call IT support. What is the fundamental UX failure regarding error handling?",
        optionA: "The system failed to provide active, immediate recovery such as Undo.",
        optionB: "The error log lacked technical jargon.",
        optionC: "The system violated Gestalt Closure.",
        optionD: "The system failed to use forgiving decimal input.",
        correctAnswer: "A",
        explanation: "Good UX should prevent catastrophic errors or provide immediate recovery."
      },
      {
        id: 3,
        questionText: "A user accidentally deletes a critical shared folder in a cloud workspace. Which post-error recovery mechanism is most effective?",
        optionA: "Multi-step Recycle Bin restore.",
        optionB: "Type DELETE before deleting.",
        optionC: "A non-intrusive 10-second contextual Undo notification.",
        optionD: "Email admin for undelete permission.",
        correctAnswer: "C",
        explanation: "Contextual Undo gives immediate recovery with minimum friction."
      },
      {
        id: 4,
        questionText: "A thermostat removes text labels and uses only custom icons. Users cannot figure out scheduling. The designer has implemented:",
        optionA: "Skeuomorphic interface.",
        optionB: "High discoverability friction.",
        optionC: "Progressive Disclosure.",
        optionD: "Golden Ratio.",
        correctAnswer: "B",
        explanation: "Non-standard unlabeled icons force users to guess."
      },
      {
        id: 5,
        questionText: "A car seat adjuster has four identical horizontal buttons controlling height, tilt, slide, and lumbar. Why do users press the wrong button?",
        optionA: "No haptic feedback.",
        optionB: "Spatial controls do not match the physical seat dimensions.",
        optionC: "Violation of Fitts’s Law.",
        optionD: "No escape hatch.",
        correctAnswer: "B",
        explanation: "This is failure of Natural Mapping."
      },
      {
        id: 6,
        questionText: "A user clicks Submit Payment. The button depresses but screen stays static for six seconds. User clicks again and gets double charged. What gap occurred?",
        optionA: "Gulf of Execution.",
        optionB: "Gulf of Evaluation due to lack of feedback.",
        optionC: "No forgiving format.",
        optionD: "Feature creep.",
        correctAnswer: "B",
        explanation: "The system failed to show that payment was processing."
      },
      {
        id: 7,
        questionText: "A simple note app adds Gantt charts, chat, CRM, etc. Users abandon it as too heavy. This is due to:",
        optionA: "Conceptual model shifting too far due to feature creep.",
        optionB: "LATCH violation.",
        optionC: "Sensory Adaptation.",
        optionD: "Zeigarnik Effect.",
        correctAnswer: "A",
        explanation: "Feature creep increases cognitive load and damages the core workflow."
      },
      {
        id: 8,
        questionText: "A hospital portal uses red for Urgent Action on dashboard and red for Canceled in Past Visits. What principle fails?",
        optionA: "External consistency.",
        optionB: "Internal consistency.",
        optionC: "Error prevention.",
        optionD: "Defensive design.",
        correctAnswer: "B",
        explanation: "The same color should not mean different things in the same app."
      },
      {
        id: 9,
        questionText: "A hamburger graphic looks tappable but works only by swipe right. Diagnosis?",
        optionA: "No forgiving format.",
        optionB: "Visual affordance conflicts with interaction model.",
        optionC: "Gestalt Closure issue.",
        optionD: "Help documentation issue.",
        correctAnswer: "B",
        explanation: "The object suggests tap but requires swipe, causing cognitive friction."
      },
      {
        id: 10,
        questionText: "A government form loses all 40 fields when browser Back is pressed. Best systemic fix?",
        optionA: "Warning label.",
        optionB: "Continuous background auto-save.",
        optionC: "Larger green Next button.",
        optionD: "Split into 40 pages.",
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
        optionA: "Fitts’s Law.",
        optionB: "Hick’s Law.",
        optionC: "Miller’s Law.",
        optionD: "Jakob’s Law.",
        correctAnswer: "B",
        explanation: "Hick’s Law says decision time increases with number of choices."
      },
      {
        id: 12,
        questionText: "A destructive Delete Clip icon is tiny and placed in a crowded toolbar. Which law is violated?",
        optionA: "Pareto Principle.",
        optionB: "Tesler’s Law.",
        optionC: "Fitts’s Law.",
        optionD: "Zeigarnik Effect.",
        correctAnswer: "C",
        explanation: "Important or destructive targets should not be tiny and hard to click."
      },
      {
        id: 13,
        questionText: "A 16-character container code is entered in one long field. Workers lose their place. Best fix?",
        optionA: "Remove options.",
        optionB: "Chunk the input like MSCU - 1938 - 4726 - 89B2.",
        optionC: "Color letters and numbers.",
        optionD: "Move input bottom-right.",
        correctAnswer: "B",
        explanation: "Miller’s Law supports chunking long data."
      },
      {
        id: 14,
        questionText: "A dashboard colors healthy servers blue and failing servers orange. Admins instantly spot failures. Principle?",
        optionA: "Proximity.",
        optionB: "Closure.",
        optionC: "Continuity.",
        optionD: "Similarity.",
        correctAnswer: "D",
        explanation: "Similarity through color groups related elements quickly."
      },
      {
        id: 15,
        questionText: "Taxes update at screen bottom while user types card details at top. User misses it. Cause?",
        optionA: "Saccadic masking.",
        optionB: "Visual hierarchy failure.",
        optionC: "Change Blindness.",
        optionD: "Fitts’s Law.",
        correctAnswer: "C",
        explanation: "Users miss visual changes outside their focus."
      },
      {
        id: 16,
        questionText: "A warning is inside an animated top banner and users ignore it. Phenomenon?",
        optionA: "Change Blindness.",
        optionB: "Selective Attention / Banner Blindness.",
        optionC: "Sensory Adaptation.",
        optionD: "Cognitive Dissonance.",
        correctAnswer: "B",
        explanation: "Users ignore banner-like areas due to learned behavior."
      },
      {
        id: 17,
        questionText: "EV dashboard uses traditional E-F gas needle for battery. Why?",
        optionA: "Saves processing power.",
        optionB: "Uses familiar mental model.",
        optionC: "Accessibility requirement.",
        optionD: "Violates Jakob’s Law.",
        correctAnswer: "B",
        explanation: "Familiar mental models reduce learning effort."
      },
      {
        id: 18,
        questionText: "Meditation app uses smooth animations, gradients, and haptics; users feel calm instantly. Don Norman level?",
        optionA: "Reflective.",
        optionB: "Behavioral.",
        optionC: "Visceral.",
        optionD: "Conceptual.",
        correctAnswer: "C",
        explanation: "Visceral design creates immediate sensory/emotional response."
      },
      {
        id: 19,
        questionText: "“I Agree” button is placed bottom-left after Terms page. Why visual stutter?",
        optionA: "Bottom-left is Primary Optical Area.",
        optionB: "Bottom-left is Weak Fallow Area.",
        optionC: "Forces Z-pattern.",
        optionD: "Violates symmetry.",
        correctAnswer: "B",
        explanation: "Gutenberg Diagram suggests final action belongs near bottom-right or center."
      },
      {
        id: 20,
        questionText: "Users read first two words of headlines and ignore summaries. Optimize by:",
        optionA: "Z-pattern layout.",
        optionB: "Front-load important keywords for F-pattern scanning.",
        optionC: "Remove images.",
        optionD: "Use masonry grid.",
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
        optionA: "Progressive impairments.",
        optionB: "Situational impairments.",
        optionC: "Cognitive impairments.",
        optionD: "Pareto Principle.",
        correctAnswer: "B",
        explanation: "Loud environments create situational impairment."
      },
      {
        id: 22,
        questionText: "Checkout asks billing address, then asks same shipping address again. Cognitive load impact?",
        optionA: "Intrinsic load.",
        optionB: "Unnecessary extraneous load.",
        optionC: "Germane load.",
        optionD: "Prevents saccadic masking.",
        correctAnswer: "B",
        explanation: "Repeated input creates unnecessary friction."
      },
      {
        id: 23,
        questionText: "English e-commerce buttons are fixed at 150px. What happens in German?",
        optionA: "Buttons change color.",
        optionB: "Text truncates or overflows.",
        optionC: "Buttons become RTL.",
        optionD: "CSS fails.",
        correctAnswer: "B",
        explanation: "German translations often require more space."
      },
      {
        id: 24,
        questionText: "Gray #999999 text on white background causes readability complaints. Standard violated?",
        optionA: "Fitts’s Law.",
        optionB: "WCAG AA 4.5:1 contrast ratio for normal text.",
        optionC: "ARIA label requirement.",
        optionD: "LATCH.",
        correctAnswer: "B",
        explanation: "Low contrast text fails accessibility requirements."
      },
      {
        id: 25,
        questionText: "Crypto chart uses only green/red lines with no labels or arrows. Who is affected?",
        optionA: "Tritanopia users.",
        optionB: "Deuteranomaly red-green color blindness users.",
        optionC: "Screen magnifier users.",
        optionD: "Motor impaired users.",
        correctAnswer: "B",
        explanation: "Critical information should not rely only on red/green color."
      },
      {
        id: 26,
        questionText: "Submit button stays disabled until Issue Description has 10 characters. Strategy?",
        optionA: "Poka-Yoke / mistake-proofing.",
        optionB: "Mystery Meat Navigation.",
        optionC: "Dark Pattern.",
        optionD: "Progressive Disclosure.",
        correctAnswer: "A",
        explanation: "The design prevents the error before it happens."
      },
      {
        id: 27,
        questionText: "A right-handed mobile app puts Confirm in the extreme top-left. What is ignored?",
        optionA: "Text expansion.",
        optionB: "Mobile thumb-zone ergonomics.",
        optionC: "Gestalt Proximity.",
        optionD: "Screen reader accessibility.",
        correctAnswer: "B",
        explanation: "Top-left is hard to reach on large phones."
      },
      {
        id: 28,
        questionText: "User enters $55,000.00 but system says invalid, numeric only. Principle failed?",
        optionA: "LATCH.",
        optionB: "Progressive Disclosure.",
        optionC: "Forgiving Format.",
        optionD: "Graceful Degradation.",
        correctAnswer: "C",
        explanation: "The system should accept common human input formats and clean them."
      },
      {
        id: 29,
        questionText: "A custom slider is built only with div and span, works with mouse but not semantic. What is damaged?",
        optionA: "Mobile responsiveness.",
        optionB: "Accessibility for keyboard and screen reader users.",
        optionC: "Cognitive load for experts.",
        optionD: "Fitts’s Law.",
        correctAnswer: "B",
        explanation: "Semantic HTML is necessary for assistive technologies."
      },
      {
        id: 30,
        questionText: "Professional 3D software has dense UI, tiny icons, shortcuts, and hidden menus. Why is this correct?",
        optionA: "Prioritizes visceral level.",
        optionB: "Uses Zeigarnik Effect.",
        optionC: "Aligns with expert persona needing speed, density, and flexibility.",
        optionD: "Conway’s Law.",
        correctAnswer: "C",
        explanation: "Expert tools can prioritize efficiency over beginner simplicity."
      }
    ]
  }
};

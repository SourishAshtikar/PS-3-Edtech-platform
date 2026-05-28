export interface Simulation {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  xpReward: number;
}

export const simulations: Simulation[] = [
  { id: "sim1", title: "Usability Error Finder", description: "Spot the hidden usability errors in a mock e-commerce checkout flow.", category: "Module 1", difficulty: "Beginner", xpReward: 50 },
  { id: "sim2", title: "Good UI vs Bad UI Comparison", description: "Analyze two interfaces and identify the principles that make one better.", category: "Module 1", difficulty: "Beginner", xpReward: 40 },
  { id: "sim3", title: "Persona Matching Game", description: "Match user personas to their optimal UI configurations.", category: "Module 1", difficulty: "Intermediate", xpReward: 60 },
  { id: "sim4", title: "Accessibility Checker", description: "Fix contrast and aria-labels in a broken form.", category: "Module 1", difficulty: "Advanced", xpReward: 100 },
  { id: "sim5", title: "Sitemap Builder", description: "Drag and drop cards to build a logical information architecture.", category: "Module 2", difficulty: "Intermediate", xpReward: 70 },
  { id: "sim6", title: "Breadcrumb Builder", description: "Construct the correct breadcrumb trail for complex nested pages.", category: "Module 2", difficulty: "Beginner", xpReward: 30 },
  { id: "sim7", title: "Drag-and-Drop Layout Builder", description: "Arrange UI elements on a grid to create a balanced layout.", category: "Module 2", difficulty: "Intermediate", xpReward: 80 },
  { id: "sim8", title: "Grid Alignment Challenge", description: "Fix the alignment of misaligned UI components.", category: "Module 2", difficulty: "Advanced", xpReward: 90 },
  { id: "sim9", title: "Inline Editing Simulator", description: "Implement single-field and multi-field inline editing patterns.", category: "Module 3", difficulty: "Intermediate", xpReward: 75 },
  { id: "sim10", title: "Modal vs Inlay Decision Game", description: "Choose the right overlay pattern based on user context.", category: "Module 3", difficulty: "Beginner", xpReward: 45 },
  { id: "sim11", title: "Search Autocomplete Simulator", description: "Design an autocomplete dropdown with forgiving formatting.", category: "Module 3", difficulty: "Intermediate", xpReward: 85 },
  { id: "sim12", title: "Form Design Simulator", description: "Redesign a long, complex form into manageable chunks.", category: "Module 4", difficulty: "Advanced", xpReward: 110 },
  { id: "sim13", title: "Password Strength Meter", description: "Build visual feedback rules for a password creation field.", category: "Module 4", difficulty: "Intermediate", xpReward: 65 },
  { id: "sim14", title: "Data Visualization Dashboard", description: "Apply Overview plus Detail patterns to a data dashboard.", category: "Module 4", difficulty: "Advanced", xpReward: 120 },
  { id: "sim15", title: "Tooltip Simulator", description: "Configure datatips and contextual help triggers.", category: "Module 4", difficulty: "Beginner", xpReward: 40 },
  { id: "sim16", title: "Mobile Navigation Builder", description: "Design a bottom tab bar and hamburger menu hierarchy.", category: "Module 5", difficulty: "Intermediate", xpReward: 80 },
  { id: "sim17", title: "Infinite Scroll vs Pagination", description: "Decide when to use infinite scroll vs traditional pagination.", category: "Module 5", difficulty: "Beginner", xpReward: 50 },
  { id: "sim18", title: "Carousel Grid Builder", description: "Organize thumbnail lists and film strips for mobile screens.", category: "Module 5", difficulty: "Intermediate", xpReward: 70 },
  { id: "sim19", title: "Responsive UI Simulator", description: "Resize a browser window and adjust the layout breakpoints.", category: "Module 5", difficulty: "Advanced", xpReward: 130 },
  { id: "sim20", title: "Touch Target Size Challenge", description: "Identify and fix buttons that are too small for touch interfaces.", category: "Module 5", difficulty: "Beginner", xpReward: 60 },
];

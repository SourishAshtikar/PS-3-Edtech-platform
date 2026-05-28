export interface StudentProfile {
  id: string;
  name: string;
  role: "student";
  avatarUrl: string;
  xp: number;
  streak: number;
  rank: number;
  badges: { id: string; name: string; icon: string; dateEarned: string }[];
  progress: {
    moduleId: string;
    completedSubtopics: string[];
  }[];
}

export const currentUser: StudentProfile = {
  id: "u123",
  name: "Jainam Davda",
  role: "student",
  avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Jainam",
  xp: 1250,
  streak: 5,
  rank: 12,
  badges: [
    { id: "b1", name: "UI Scholar", icon: "book-open", dateEarned: "2026-05-10" },
    { id: "b2", name: "Perfect Alignment", icon: "layout-grid", dateEarned: "2026-05-15" },
    { id: "b3", name: "Accessibility Advocate", icon: "eye", dateEarned: "2026-05-20" },
  ],
  progress: [
    { moduleId: "m1", completedSubtopics: ["st1-1", "st1-2", "st1-3"] },
    { moduleId: "m2", completedSubtopics: ["st2-1", "st2-2"] },
  ],
};

export const leaderboardData = [
  { rank: 1, name: "Sourish Ashtikar", xp: 3450, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sourish" },
  { rank: 2, name: "Chinmay Chavan", xp: 3120, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Chinmay" },
  { rank: 3, name: "Rohan Patil", xp: 2980, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Rohan" },
  { rank: 4, name: "Michael Chang", xp: 2800, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Michael" },
  { rank: 5, name: "Sophia Patel", xp: 2650, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sophia" },
  { rank: 12, name: "Jainam Davda", xp: 1250, avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Jainam" },
];

export const facultyStats = {
  totalStudents: 145,
  activeModules: 5,
  totalQuizzes: 12,
  totalSimulations: 20,
  averageProgress: 42,
};

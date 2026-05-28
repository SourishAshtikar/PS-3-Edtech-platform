export interface Subtopic {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  readingMaterial?: string;
}

export interface Module {
  id: string;
  title: string;
  hours: number;
  co: string;
  description: string;
  subtopics: Subtopic[];
}

export const modules: Module[] = [
  {
    id: "m1",
    title: "Understanding User",
    hours: 6,
    co: "CO1",
    description: "Learn about the fundamentals of human considerations and user characteristics in design.",
    subtopics: [
      { id: "st1-1", title: "1.1 Common problems with usability", description: "Identify everyday usability problems in digital interfaces." },
      { id: "st1-2", title: "1.2 Human Characteristics in Design", description: "Understand perception, memory, and cognitive load." },
      { id: "st1-3", title: "1.3 Human Considerations in Design", description: "Physical and psychological factors affecting interface use." },
    ],
  },
  {
    id: "m2",
    title: "Principles of Good Screen Design",
    hours: 10,
    co: "CO2",
    description: "Master the structure, navigation, and layout principles that make screens intuitive.",
    subtopics: [
      { id: "st2-1", title: "2.1 Information Architecture and Application Structure", description: "Structuring content logically for optimal navigation." },
      { id: "st2-2", title: "2.2 Navigation, Signposts and Wayfinding Patterns", description: "Helping users understand where they are and where they can go." },
      { id: "st2-3", title: "2.3 Layout of Page Element", description: "Grids, alignment, and visual hierarchy." },
      { id: "st2-4", title: "2.4 Arranging content in list", description: "Best practices for lists and tables." },
    ],
  },
  {
    id: "m3",
    title: "Web Interface Design",
    hours: 16,
    co: "CO3",
    description: "Deep dive into specific web interaction patterns including editing, overlays, and feedback.",
    subtopics: [
      { id: "st3-1", title: "3.1 In-Page Editing", description: "Single-Field, Multi-Field, Overlay, Table, Group Edit, Drag and Drop." },
      { id: "st3-2", title: "3.2 Contextual Tools, Overlays and Inlays", description: "Designing tooltips, popovers, and inline expansions." },
      { id: "st3-3", title: "3.3 Static and Dynamic Invitation, Transition Patterns", description: "Guiding user attention through motion and prompts." },
      { id: "st3-4", title: "3.4 Lookup and Feedback Patterns", description: "Auto-suggest, searching, and providing system status." },
    ],
  },
  {
    id: "m4",
    title: "Interface Design for Data Handling",
    hours: 6,
    co: "CO4",
    description: "Patterns for taking actions, rendering graphics, form design, and social content.",
    subtopics: [
      { id: "st4-1", title: "4.1 Patterns for actions and commands", description: "Buttons, menus, and command palettes." },
      { id: "st4-2", title: "4.2 Patterns for information graphics", description: "Overview plus Detail, Datatips, Data Spotlight, Dynamic Queries." },
      { id: "st4-3", title: "4.3 Patterns with form design", description: "Forgiving Format, Fill-in-the-Blanks, Input Hints, Password Strength, Autocomplete." },
      { id: "st4-4", title: "4.4 Pattern with social content production", description: "Editorial Mix, Personal Voices, Repost and Comment, Inverted Nano-pyramid." },
    ],
  },
  {
    id: "m5",
    title: "Pattern with Mobile Interface Design",
    hours: 7,
    co: "CO5",
    description: "Adapting patterns for smaller screens, touch interactions, and mobile contexts.",
    subtopics: [
      { id: "st5-1", title: "5.1 Display of Information", description: "Vertical List, Thumbnail List, Fisheye List, Carousel Grid, Film Strip, Slideshow." },
      { id: "st5-2", title: "5.2 Pattern for Lateral access and Drill down", description: "Tabs, Peel Away, Pagination, Location Within, Link, Button, Indicator, Icon." },
      { id: "st5-3", title: "5.3 Pattern for Labels, Indicators and Information Control", description: "Ordered Data, Tooltip, Avatar, Wait Indicator, Reload, Synch, Stop." },
      { id: "st5-4", title: "5.4 Patterns for Navigation", description: "Global Navigation, Contextual Navigation, Secondary Actions, In-Content Messages." },
    ],
  },
];

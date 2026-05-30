import { SubtopicQuiz } from "./module1QuizData";

export const module2Quizzes: Record<string, SubtopicQuiz> = {
  "st2-1": {
    subtopicId: "st2-1",
    title: "Information Architecture and Application Structure",
    questions: [
      {
        id: 1,
        questionText: "A municipal government tax portal has a deeply nested hierarchical structure (6 levels deep). To reduce interaction cost, the UX team proposes \"flattening\" the architecture to 2 levels. However, this creates a top-level menu with 25 items. Which two principles are in tension, and what is the optimal structural tradeoff?",
        options: ["Miller's Law vs. Fitts's Law; the tradeoff is to implement a matrix structure to bypass the menu entirely.", "Interaction Cost (click depth) vs. Cognitive Load (Hick's Law); the tradeoff is a \"Hub-and-Spoke\" model with progressive disclosure, grouping the 25 items into 5-7 distinct functional hubs.", "The LATCH principle vs. Spatial Memory; the tradeoff is to sort the 25 items alphabetically to eliminate cognitive load.", "Safe Exploration vs. Error Prevention; the tradeoff is to implement a strict sequential flow to force users down a single path."],
        correctAnswer: "B",
        explanation: "Flattening reduces clicks (Interaction Cost) but overwhelms working memory and decision time (Hick's Law). Grouping into functional hubs balances click depth with manageable cognitive load."
      },
      {
        id: 2,
        questionText: "A fintech platform requires users to complete a complex, 10-step mortgage application. Principle A states users need \"Safe Exploration\" (the ability to move freely). Principle B dictates a \"Sequential Flow\" is best for multi-step tasks. To resolve this tension without causing data loss, the architecture should:",
        options: ["Utilize a polyhierarchical structure so users can complete the steps in any order they choose.", "Use a strict sequential wizard that disables all global navigation until the 10 steps are completed.", "Implement a flexible sequential wizard with a persistent \"Stepper\" (Step 1-10) that allows backward navigation, combined with a continuous auto-save mechanism.", "Convert the 10 steps into a single, infinitely scrolling page to remove the need for navigation entirely."],
        correctAnswer: "C",
        explanation: "Locking the user in (B) violates autonomy. Free movement (A) risks data dependency errors. A stepper with auto-save provides the guidance of a sequence while preserving the safety of exploration and recovery."
      },
      {
        id: 3,
        questionText: "In a faceted search architecture for a real estate platform, users can filter by Bedrooms, Bathrooms, and Neighborhood. When a user selects \"2 Beds\" and \"3 Beds\" within the Bedroom category, and \"Downtown\" in Neighborhood, how must the underlying boolean logic operate to prevent user frustration?",
        options: ["AND logic across all categories, and AND logic within categories.", "OR logic across categories (Bedrooms OR Neighborhood), but AND logic within categories.", "XOR (Exclusive OR) logic across all selections to prevent conflicting data.", "OR logic within the same category (2 Beds OR 3 Beds), but AND logic across different categories (Bedrooms AND Neighborhood)."],
        correctAnswer: "D",
        explanation: "This is the standard rule for faceted IA. Selecting multiple items in one facet broadens the search (OR), while adding a new facet category narrows it (AND). Any other logic yields zero results or overwhelming noise."
      },
      {
        id: 4,
        questionText: "A closed card sort reveals that 50% of users place \"Diet Plans\" under \"Fitness,\" and 50% place it under \"Nutrition.\" The stakeholder demands it be placed under \"Premium Subscriptions,\" as that team monetizes them. What is the most resilient IA solution?",
        options: ["Align with the stakeholder to maintain internal database consistency, as users will eventually learn the system's implementation model.", "Implement a Polyhierarchical structure, allowing \"Diet Plans\" to be accessed via both \"Fitness\" and \"Nutrition.\"", "Force a tie-breaker by changing the label to \"Paid Meal Guides\" to manipulate the users' mental model.", "Place it on the homepage as a standalone spoke, bypassing the taxonomy entirely."],
        correctAnswer: "B",
        explanation: "When user mental models are equally split between two logical categories, polyhierarchy satisfies both paths without resorting to Conway's Law (internal business structure)."
      },
      {
        id: 5,
        questionText: "You are designing the IA for a live event ticketing platform. You must organize events using the LATCH principle. The business goal is to keep users engaged with \"trending\" concerts, but user research shows buyers primarily want events localized to their city. What is the best structural prioritization?",
        options: ["Primary: Location; Secondary: Time; Tertiary: Category.", "Primary: Hierarchy (Most popular); Secondary: Alphabetical; Tertiary: Time.", "Primary: Category (Rock, Comedy); Secondary: Hierarchy; Tertiary: Location.", "Primary: Time (Soonest first); Secondary: Category; Tertiary: Alphabetical."],
        correctAnswer: "A",
        explanation: "If the user's primary mental anchor is their city, Location must be the primary scheme, filtered secondarily by Time to satisfy the business goal of pushing relevant, upcoming events."
      },
      {
        id: 6,
        questionText: "A music history wiki transitions from a hierarchical tree to a Matrix structure, allowing users to jump directly via hyperlinks from Artist -> Associated Genre -> Common Instruments -> Frequent Collaborators. What severe usability risk is introduced, and how is it mitigated?",
        options: ["Risk: Hick's Law violation. Mitigation: Limit hyperlinks to 3 per page.", "Risk: Loss of spatial memory and wayfinding (\"Lost in space\"). Mitigation: Robust path-based breadcrumbs and a persistent global search/home anchor.", "Risk: Mode errors. Mitigation: Open every hyperlink in a new browser tab.", "Risk: Banner blindness. Mitigation: Make all hyperlinks visually prominent using red text."],
        correctAnswer: "B",
        explanation: "Matrix structures allow endless horizontal leaps, which destroys the user's mental map of where they are. Path-based breadcrumbs (history) and a persistent anchor are required to prevent them from getting lost."
      },
      {
        id: 7,
        questionText: "When designing an auto parts catalog's taxonomy, which scenario explicitly justifies abandoning a \"Hub-and-Spoke\" architecture in favor of a \"Strict Hierarchical\" tree?",
        options: ["The application features five primary driving tools (Maps, Music, Phone, Weather, Diagnostics) that do not interact with each other.", "The user needs to drill down from broad categories (Vehicle Make) to highly specific sub-categories (Engine Components) to find a single, distinct replacement part.", "The user flow requires them to complete a payment process without distraction.", "The content is entirely user-generated and highly dynamic, like a forum feed."],
        correctAnswer: "B",
        explanation: "Hub-and-Spoke is for distinct, unrelated tasks where the user returns to the center. Deep classification of physical inventory requires a hierarchical tree to progressively narrow the scope."
      },
      {
        id: 8,
        questionText: "An airline application places \"In-Flight Wi-Fi\" under the \"Baggage Fees\" portal because the development team utilized the same backend payment gateway for both. This structural failure is a classic example of:",
        options: ["The Zeigarnik Effect", "Conway’s Law (Implementation Model overriding Mental Model)", "A Polyhierarchical paradox", "The Gestalt principle of Common Region"],
        correctAnswer: "B",
        explanation: "Conway's Law in UX refers to interfaces and architectures that mirror the internal organizational or technical structures rather than the user's logical mental model."
      }
    ]
  },
  "st2-2": {
    subtopicId: "st2-2",
    title: "Navigation, Signposts and Wayfinding Patterns",
    questions: [
      {
        id: 9,
        questionText: "The sales team wants a \"Mega Menu\" (a massive dropdown showing all 50 corporate training courses) to maximize discoverability. The UX team argues it causes cognitive overload. What is the most effective navigational tradeoff?",
        options: ["Replace the Mega Menu with a hamburger menu to hide the complexity completely.", "Use the Mega Menu, but group the 50 links into clear, macro-whitespace separated categories (chunking) with bold headers, rather than a single alphabetized list.", "Implement a sequential flow, forcing users to click through 5 pages to see all 50 links.", "Remove global navigation entirely and rely strictly on contextual inlays."],
        correctAnswer: "B",
        explanation: "Mega Menus are not inherently bad; they fail when they lack visual hierarchy. Applying Miller's Law (chunking) via layout transforms a wall of text into scannable, logical groups."
      },
      {
        id: 10,
        questionText: "A user navigates: Home > Europe > France > Paris. They apply a filter for \"4-Star Hotels\". They then click \"France\" in the breadcrumb trail. If the breadcrumbs are Location-based, what should happen?",
        options: ["They return to the \"France\" page, and the \"4-Star Hotels\" filter remains active because it is part of their session history.", "They return to the default \"France\" page; the filter is cleared because location-based breadcrumbs move up the static site hierarchy, ignoring user history.", "An error occurs because breadcrumbs cannot navigate up more than one level at a time.", "The system opens a modal asking them to confirm the loss of their filter."],
        correctAnswer: "B",
        explanation: "Location-based breadcrumbs reflect the site's structural architecture, not the user's temporal path. Clicking a higher node resets the environment to that node's default state."
      },
      {
        id: 11,
        questionText: "You are designing a mobile app for a fitness tracker. Screen real estate is critical, but so is rapid switching between 4 core modules (Workout, Diet, Progress, Social). Which navigation pattern represents the best tradeoff?",
        options: ["A hamburger menu (hidden global navigation) to maximize screen space for data.", "A persistent Bottom Tab Bar for the 4 core modules, sacrificing a small amount of vertical space for instant discoverability and one-tap switching.", "A contextual floating action button (FAB) that expands into a radial menu.", "Swipe gestures (left/right) to move between the 4 modules without any visible UI."],
        correctAnswer: "B",
        explanation: "For core, frequently used modules, the interaction cost of opening a hamburger menu repeatedly is too high. A bottom tab bar uses minimal space while providing constant signposting and immediate access."
      },
      {
        id: 12,
        questionText: "On a long, scrolling legal privacy policy document, a \"Sticky Header\" guarantees access to global navigation but consumes 15% of the mobile viewport. What pattern resolves this tension between wayfinding and reading ergonomics?",
        options: ["A standard static header that disappears when the user scrolls down.", "A \"Scrollspy\" header that only shows the current section name, not the navigation links.", "A \"Smart\" or \"Hide-on-Scroll\" sticky header that retracts when the user scrolls down (reading intent) and reappears the moment they scroll up (navigational intent).", "Moving all navigation to the footer."],
        correctAnswer: "C",
        explanation: "This pattern intelligently reacts to user intent, providing maximum reading space when progressing, but instantly providing wayfinding tools the moment the user signals they want to navigate elsewhere."
      },
      {
        id: 13,
        questionText: "A designer replaces standard text labels in a smart home control panel with abstract, minimalist glyphs to achieve a \"cleaner aesthetic.\" Interaction times immediately increase. What signposting principle was violated?",
        options: ["The icons were likely skeuomorphic, which alienated younger users.", "The designer relied on \"Mystery Meat Navigation,\" assuming users would expend cognitive effort to decode non-standard icons without text labels.", "The icons violated the F-Pattern layout.", "The icons created a false bottom on the screen."],
        correctAnswer: "B",
        explanation: "Unless an icon is a universal idiom (e.g., magnifying glass for search), it requires a text label. Sacrificing clarity for aesthetics creates friction, forcing users to guess the destination."
      },
      {
        id: 14,
        questionText: "In a complex government visa application flow, the user reaches Step 3 (Payment) and realizes they need to change their Passport Number (Step 1). The interface only offers \"Submit\" and \"Cancel\" buttons. The absence of which specific pattern caused this trap?",
        options: ["Contextual Inlays", "Location Breadcrumbs", "Wizard Step Indicator (Stepper) with backward navigation capability", "A Fat Footer"],
        correctAnswer: "C",
        explanation: "Sequential flows (wizards) must provide an escape hatch. A clickable stepper not only shows progress but acts as navigational signposting to safely return to previous states."
      },
      {
        id: 15,
        questionText: "A social media application features a critical \"Delete Account\" button. To keep the profile page clean, the designer places it inside the global navigation dropdown header. Why is this a dangerous wayfinding anti-pattern?",
        options: ["It violates the principle of Proximity; destructive actions must be placed directly next to the item they affect (contextual navigation) so the user knows exactly what is being deleted.", "Global navigation should only use OR logic, not AND logic.", "It makes the button too large on mobile devices.", "It violates the LATCH principle by mixing Time and Location."],
        correctAnswer: "A",
        explanation: "Placing a specific destructive action in a global menu divorces the action from its object. The button must be contextually located near the profile settings it affects."
      },
      {
        id: 16,
        questionText: "When designing \"Contextual Navigation\" (e.g., \"Wines that pair well with this recipe\"), what is the fundamental difference in its wayfinding purpose compared to \"Global Navigation\"?",
        options: ["Contextual navigation is fixed and identical on every page; global navigation changes dynamically.", "Contextual navigation promotes vertical movement up the site hierarchy; global navigation promotes lateral movement.", "Contextual navigation supports serendipitous, lateral exploration based on the user's current specific focus; global navigation provides consistent, structural anchoring.", "Contextual navigation is only required for accessibility compliance."],
        correctAnswer: "C",
        explanation: "Global nav says \"Here is everything we offer.\" Contextual nav says \"Based on what you are looking at right now, you might also care about this.\""
      }
    ]
  },
  "st2-3": {
    subtopicId: "st2-3",
    title: "Layout of Page Element",
    questions: [
      {
        id: 17,
        questionText: "A mobile crypto wallet requires the user to input a long transfer address. Ergonomics (Fitts's Law / Thumb Zone) suggests placing the \"Send\" button at the bottom. However, the onscreen keyboard pushes the button out of the viewport. What is the optimal layout tradeoff?",
        options: ["Place the \"Send\" button at the top-right of the screen, forcing the user to reach for it.", "Keep the button at the bottom and require the user to explicitly dismiss the keyboard before they can see or tap it.", "Anchor the \"Send\" button to the top edge of the onscreen keyboard, so it remains visible and within the thumb zone while the user is typing.", "Automatically send the funds the moment a valid address length is reached, removing the need for a button."],
        correctAnswer: "C",
        explanation: "Anchoring the primary action above the keyboard satisfies visibility (preventing a false bottom) and ergonomics (keeping it in the primary touch target zone). Auto-submit (D) is highly dangerous for financial actions."
      },
      {
        id: 18,
        questionText: "A hospital triage dashboard utilizes a 12-column grid. The designer creates three status cards: Patient A (5 cols), Patient B (4 cols), Patient C (3 cols). The head nurse complains that Patient A looks like the most critical priority, even though all three are stable. What is the layout failure?",
        options: ["The designer failed to use the Golden Ratio within the cards.", "The designer ignored Visual Hierarchy; in grid systems, spatial width inherently communicates importance. Asymmetrical columns imply unequal value.", "The designer used micro-whitespace instead of macro-whitespace.", "12-column grids cannot mathematically support equal divisions of three."],
        correctAnswer: "B",
        explanation: "Size equals weight. If elements are functionally equal in hierarchy, they must be structurally equal in the grid (e.g., 4 cols - 4 cols - 4 cols)."
      },
      {
        id: 19,
        questionText: "A B2B SaaS pricing page optimized for western readers has a strong \"Upgrade Now\" button placed in the bottom-left corner of the tier description block. Heatmaps show users are reading the features but missing the button. According to the Gutenberg Diagram, why is this placement failing?",
        options: ["The bottom-left is the \"Primary Optical Area,\" which users scan too quickly.", "The bottom-left is the \"Strong Fallow Area,\" which users completely ignore.", "The bottom-left is the \"Weak Fallow Area\"; the eye naturally sweeps from top-left to bottom-right, expecting the concluding action in the \"Terminal Area\" (bottom-right).", "The layout is forcing a Z-Pattern instead of an F-Pattern."],
        correctAnswer: "C",
        explanation: "The Gutenberg Diagram maps reading gravity. The bottom-left is a blind spot (Weak Fallow) during a sweeping scan. CTAs belong in the Terminal Area (bottom-right) or centered below the content."
      },
      {
        id: 20,
        questionText: "A designer wants to group related form fields (e.g., Vehicle Info vs Driver Info) on an insurance quote without adding visual clutter. Principle A suggests using subtle border lines. Principle B (Gestalt) suggests a different approach. What is the most cognitively efficient layout technique?",
        options: ["Use alternating background colors (zebra striping) for each form field.", "Use Macro-whitespace (proximity) to group related fields closely together, with larger gaps between unrelated sections.", "Place a heavy 2px black border around related groups.", "Align all labels to the right and all inputs to the left."],
        correctAnswer: "B",
        explanation: "Whitespace is an active design element. Using the Gestalt principle of Proximity organizes content without adding the cognitive load and visual noise of explicit borders or background colors."
      },
      {
        id: 21,
        questionText: "A recipe blog features a full-width, high-resolution photo of the finished meal perfectly placed above the fold, followed by a 40px white gap. Analytics show an 80% user drop-off exactly at that photo before they reach the ingredients. What layout phenomenon has occurred?",
        options: ["Banner Blindness", "Change Blindness", "A False Bottom (Illusion of Completeness)", "The Fold Paradox"],
        correctAnswer: "C",
        explanation: "When a horizontal element (like a full-width image) aligns perfectly across the viewport and is followed by whitespace, it breaks visual continuity. The user's brain interprets it as the end of the page."
      },
      {
        id: 22,
        questionText: "You are designing an expert-level, high-frequency inventory scanning app for warehouse workers. Speed is the absolute highest priority. Which label alignment layout is empirically proven to yield the fastest completion times, and what is its visual tradeoff?",
        options: ["Left-aligned labels; tradeoff is a ragged right edge that is hard to scan.", "Right-aligned labels; tradeoff is the disconnect from the left margin.", "Top-aligned labels; tradeoff is that it consumes significantly more vertical screen real estate, requiring more scrolling.", "Placeholder text inside the input; tradeoff is that the label disappears once typing begins."],
        correctAnswer: "C",
        explanation: "Eye-tracking proves top-aligned labels require the fewest saccades (eye movements) because the eye drops straight down. However, it doubles the vertical height of the form."
      },
      {
        id: 23,
        questionText: "A responsive productivity app moves from a desktop 3-column Kanban board to a mobile single-column feed. The desktop layout relied on horizontal proximity to show which cards belonged to which columns (To Do, Doing, Done). In the vertical stack, users can no longer tell which cards belong to which group. How must the layout adapt?",
        options: ["Revert to a horizontal layout and force the mobile user to pan left and right.", "Introduce explicit visual containers (like Card UI or subtle background bounding boxes with headers) to replace the lost horizontal proximity.", "Decrease the font size until all three columns fit on the mobile screen.", "Hide secondary elements to maintain the single column without grouping."],
        correctAnswer: "B",
        explanation: "When spatial layout (proximity) is destroyed by viewport constraints, designers must fall back on other Gestalt principles, such as \"Common Region\" (cards/boxes), to re-establish the relationships."
      }
    ]
  },
  "st2-4": {
    subtopicId: "st2-4",
    title: "Arranging Content in List",
    questions: [
      {
        id: 24,
        questionText: "A stock photo library debates using \"Infinite Scroll\" versus \"Pagination\" for their search results (yielding 5,000 \"office backgrounds\"). Infinite scroll reduces interaction cost, but Pagination provides statefulness. Which hybrid pattern represents the best UX tradeoff for goal-oriented browsing?",
        options: ["Auto-loading infinite scroll that abruptly stops after 100 items.", "\"Load More\" button; it removes the cognitive break of a new page load while maintaining user control, preventing false bottoms, and allowing access to the footer.", "A Carousel grid that forces horizontal scrolling.", "An alphabetical scrubber bar on the side of the screen."],
        correctAnswer: "B",
        explanation: "\"Load More\" gives the seamless feel of infinite scroll but requires an explicit user action. This prevents the footer from running away, gives the user a sense of volume, and stops uncontrolled data fetching."
      },
      {
        id: 25,
        questionText: "A mobile travel app displays a flight arrival board. The designer must show: Airline Logo, Flight #, Origin, Time, Gate, and Status. A horizontal data table will not fit. What is the optimal list arrangement pattern?",
        options: ["A Thumbnail Grid, prioritizing the Airline's logo.", "A \"Fat Row\" (Multi-line list) where the 6 data points are stacked vertically and hierarchically within a single, distinct horizontal row per flight.", "A Fisheye List that magnifies text on tap.", "Accordion rows where only the Flight # is visible until tapped."],
        correctAnswer: "B",
        explanation: "Fat rows solve mobile density problems by utilizing vertical space within a single list item, allowing complex data arrays to be scanned without horizontal scrolling or hidden accordions."
      },
      {
        id: 26,
        questionText: "You are designing a global logistics tracking table with 25 columns. Users must compare the Container ID in Column 2 with the Destination Port in Column 22. What specific list pattern is required to prevent extreme cognitive load and physical tracking errors?",
        options: ["Zebra striping combined with a Sticky Left Column (pinned column), allowing horizontal scroll while keeping the primary identifier visible.", "An Infinite Area layout that allows panning in all directions.", "Converting the table into a massive Carousel.", "Forcing the user to download the data as a CSV."],
        correctAnswer: "A",
        explanation: "Without a pinned primary column, scrolling to Column 22 removes context. Zebra striping ensures the eye doesn't slip to the wrong row while tracking horizontally across that wide gap."
      },
      {
        id: 27,
        questionText: "A mobile productivity app uses a standard vertical list view for daily habits. To mark a habit complete, users must tap the habit, open it, tap the menu, and tap 'Complete' (4 interactions). How can list arrangement be altered to reduce this to 1 interaction while preserving screen space?",
        options: ["Add a permanent checkbox and a \"Delete\" button to every single row, cutting the row text space in half.", "Implement a Swipe-to-Reveal pattern, hiding contextual actions (Complete, Skip) behind a horizontal gesture on the list item itself.", "Use an overlay edit mode triggered by a long-press.", "Change the list to a grid view."],
        correctAnswer: "B",
        explanation: "Swipe-to-reveal is the optimal mobile list tradeoff. It maintains high data density (clean rows) while providing instant access to contextual tools via native touch gestures."
      },
      {
        id: 28,
        questionText: "An alphabetical index scrubber (A-Z bar on the right side) is highly efficient for a Contacts app. Why is applying this exact same list pattern to a \"Recent Price Alerts\" list in a stock market app a critical design failure?",
        options: ["Scrubber bars violate mobile accessibility touch target guidelines.", "The pattern requires the data to be natively sorted alphabetically AND the user to know the exact string they are looking for. Alerts are time-series data; sorting them alphabetically destroys their contextual meaning.", "Scrubber bars only work on desktop, not mobile.", "It creates visual noise that distracts from the alert icons."],
        correctAnswer: "B",
        explanation: "UI patterns are not universally transferable. An A-Z index fails completely if the user's mental model for retrieving the data relies on Time (recency) rather than a specific known Name."
      },
      {
        id: 29,
        questionText: "A streaming platform has a \"Watchlist\" tab. When a new user clicks it, they see a beautifully designed, minimalist, entirely blank dark screen. What list pattern opportunity has been missed, and what is the UX cost?",
        options: ["The missing pattern is an \"Empty State\" (Blank Slate); the cost is a missed onboarding opportunity, leaving the user confused about how the feature works or how to populate it.", "The missing pattern is a Skeleton Screen; the cost is the user thinking the app is broken.", "The missing pattern is Pagination; the cost is infinite scrolling of nothing.", "The missing pattern is Zebra Striping; the cost is poor aesthetics."],
        correctAnswer: "A",
        explanation: "Blank slates are prime real estate. A completely blank screen provides no wayfinding. An effective empty state explains the feature, shows its value, and provides a direct Call-to-Action to add a movie or show."
      },
      {
        id: 30,
        questionText: "Scenario: A doctor must select one diagnosis from a dropdown list of 300 medical ICD-10 codes. Principle A says \"Show all options so the user can browse.\" Principle B says \"Minimize scrolling and interaction cost.\" What is the best pattern to resolve this tension?",
        options: ["A standard native dropdown menu, allowing fast scrolling.", "A segmented control displaying all 300 options as buttons.", "A Typeahead/Autocomplete combobox; it allows users who know the code to filter instantly, while still allowing browsing if they type partial string descriptions.", "A multi-page wizard, breaking the 300 codes into alphabetical pages."],
        correctAnswer: "C",
        explanation: "For massive lists, manual scrolling is too high an interaction cost. Typeahead bridges the gap between searching and browsing, drastically reducing time-to-completion for both expert and novice users."
      }
    ]
  }
};

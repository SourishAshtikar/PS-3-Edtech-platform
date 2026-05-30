import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Starting to seed database...');

  // 1. Seed Modules
  const modulesToSeed = [
    {
      id: 'm1',
      moduleNo: 1,
      title: 'Understanding User',
      hours: 6,
      co: 'CO1',
      description: 'Fundamentals of human characteristics and usability in design.'
    },
    {
      id: 'm2',
      moduleNo: 2,
      title: 'Principles of Good Screen Design',
      hours: 10,
      co: 'CO2',
      description: 'Information architecture and effective screen layout patterns.'
    },
    {
      id: 'm3',
      moduleNo: 3,
      title: 'Web Interface Design',
      hours: 16,
      co: 'CO3',
      description: 'Advanced in-page editing and contextual web patterns.'
    },
    {
      id: 'm4',
      moduleNo: 4,
      title: 'Interface Design for Data Handling',
      hours: 6,
      co: 'CO4',
      description: 'Patterns for forms, data graphics, and social content.'
    },
    {
      id: 'm5',
      moduleNo: 5,
      title: 'Pattern with Mobile Interface Design',
      hours: 7,
      co: 'CO5',
      description: 'Mobile-specific UI patterns and navigation.'
    }
  ];

  for (const m of modulesToSeed) {
    await prisma.module.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        hours: m.hours,
        co: m.co,
        description: m.description
      },
      create: m
    });
  }

  const subtopicsToSeed = [
    // Module 1 subtopics
    {
      id: 'st1-1',
      moduleId: 'm1',
      subtopicNo: '1.1',
      title: 'Common problems with usability',
      description: 'Analyze common UX failures.',
      videoUrl: 'https://www.youtube.com/watch?v=n8MnoJyl3W4',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1pwd-GH8-P0XHkgJT2iNjAszJChV0XGvh'
    },
    {
      id: 'st1-2',
      moduleId: 'm1',
      subtopicNo: '1.2',
      title: 'Human Characteristics in Design',
      description: 'Cognitive and physical constraints.',
      videoUrl: 'https://www.youtube.com/watch?v=0MLwuhpwRiE',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1vuRK9oHTsRRc1A6Kmionye7fxfGu28sa'
    },
    {
      id: 'st1-3',
      moduleId: 'm1',
      subtopicNo: '1.3',
      title: 'Human Considerations in Design',
      description: 'Memory, learning, and perception.',
      videoUrl: 'https://www.youtube.com/watch?v=sqi0-Lz_ZTY',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1U-4uIvYd7C3VzRWCT6Z7Fujal9Qmo5K0'
    },
    // Module 2 subtopics
    {
      id: 'st2-1',
      moduleId: 'm2',
      subtopicNo: '2.1',
      title: 'Information Architecture and Application Structure',
      description: 'Organizing complex information.',
      videoUrl: 'https://www.youtube.com/watch?v=v39z0JPeIc8',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/16jCm_2GoBAWHiriapf8QgmLG27ILVGqW'
    },
    {
      id: 'st2-2',
      moduleId: 'm2',
      subtopicNo: '2.2',
      title: 'Navigation, Signposts and Wayfinding Patterns',
      description: 'Guiding users through applications.',
      videoUrl: 'https://www.youtube.com/watch?v=Vp77JWjjaiQ',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1fkqLfPimRoJnS4Cam-CM4IT_nx1fag4f'
    },
    {
      id: 'st2-3',
      moduleId: 'm2',
      subtopicNo: '2.3',
      title: 'Layout of Page Element',
      description: 'Grids and visual hierarchy.',
      videoUrl: 'https://www.youtube.com/watch?v=b8pS6p5GScw',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1MWLzK5UF774rm6_tb66ZhqKweJIH66vS'
    },
    {
      id: 'st2-4',
      moduleId: 'm2',
      subtopicNo: '2.4',
      title: 'Arranging Content in List',
      description: 'Displaying items effectively.',
      videoUrl: 'https://www.youtube.com/watch?v=7MjvBqlRzCY',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1DJJpc-DXofQaGkljYL3V2V-TPEDLSBwk'
    },
    // Module 3 subtopics
    {
      id: 'st3-1',
      moduleId: 'm3',
      subtopicNo: '3.1',
      title: 'In-page editing, table edit, drag and drop',
      description: 'Single-Field, Multi-Field, Drag and Drop editing.',
      videoUrl: 'https://www.youtube.com/watch?v=xCrhKzyxp0M',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/118ICJl2vMPuRz2e1vNNjBgN9tiACVhNx'
    },
    {
      id: 'st3-2',
      moduleId: 'm3',
      subtopicNo: '3.2',
      title: 'Contextual tools, overlays and inlays',
      description: 'Providing tools without leaving context.',
      videoUrl: 'https://www.youtube.com/watch?v=xCrhKzyxp0M',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1y53XWu9hy5nmmvE_NH7UG8R8kii9IoBU'
    },
    {
      id: 'st3-3',
      moduleId: 'm3',
      subtopicNo: '3.3',
      title: 'Static/Dynamic invitation and transition patterns',
      description: 'Guiding user interactions dynamically.',
      videoUrl: 'https://www.youtube.com/watch?v=u6wPJifxvvw',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1KY4vIaj4Ho1D0o-WZxMmyF6wHMCSQttv'
    },
    {
      id: 'st3-4',
      moduleId: 'm3',
      subtopicNo: '3.4',
      title: 'Lookup and feedback patterns',
      description: 'Search lookup and user confirmation patterns.',
      videoUrl: 'https://www.youtube.com/watch?v=b7CxLVHMLOc',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1igviPAsDq_ZLxHBEBoSRQIXFScNlaCAW'
    },
    // Module 4 subtopics
    {
      id: 'st4-1',
      moduleId: 'm4',
      subtopicNo: '4.1',
      title: 'Patterns for actions and commands',
      description: 'Buttons, menus, and controls.',
      videoUrl: 'https://www.youtube.com/watch?v=7MjvBqlRzCY',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1ORA38UBpkVWnkRfefl695PSzf08-qOMv'
    },
    {
      id: 'st4-2',
      moduleId: 'm4',
      subtopicNo: '4.2',
      title: 'Information graphics, overview plus detail, datatips, dynamic queries',
      description: 'Data display patterns, detail tooltips.',
      videoUrl: 'https://www.youtube.com/watch?v=b7CxLVHMLOc',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1-kSrMtBpv4ivfnHVucqXyjyAbXaAdufV'
    },
    {
      id: 'st4-3',
      moduleId: 'm4',
      subtopicNo: '4.3',
      title: 'Form design, input hints, prompts, autocomplete, password strength meter',
      description: 'Form usability patterns and input validation.',
      videoUrl: 'https://www.youtube.com/watch?v=xCrhKzyxp0M',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/14YVRR-lGVe8vcDZTkxv4XbYyLBXVT94Q'
    },
    {
      id: 'st4-4',
      moduleId: 'm4',
      subtopicNo: '4.4',
      title: 'Social content production patterns',
      description: 'Review systems, comment inputs and sharing.',
      videoUrl: 'https://www.youtube.com/watch?v=CBm9gdwshf8',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1hEulwjiMSCC39-l_tsoHfArBFiislxQ8'
    },
    // Module 5 subtopics
    {
      id: 'st5-1',
      moduleId: 'm5',
      subtopicNo: '5.1',
      title: 'Vertical list, infinite list, thumbnail list, carousel, slideshow',
      description: 'Scroll lists and layout patterns on mobile.',
      videoUrl: 'https://www.youtube.com/watch?v=dfy_8llodDE',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1QFKiDc8dAo7BfulLJXi8ZV9oId8_feWe'
    },
    {
      id: 'st5-2',
      moduleId: 'm5',
      subtopicNo: '5.2',
      title: 'Tabs, pagination, drill down, button, indicator, icon',
      description: 'Navigation mechanisms on mobile.',
      videoUrl: 'https://www.youtube.com/watch?v=OZRczPw1BBw',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1FKyAvjIXZtStZfbSbIT-6z3wDF2SfSM4'
    },
    {
      id: 'st5-3',
      moduleId: 'm5',
      subtopicNo: '5.3',
      title: 'Labels, indicators, tooltip, avatar, wait indicator, reload, sync, stop',
      description: 'Status patterns and identifiers.',
      videoUrl: 'https://www.youtube.com/watch?v=xCrhKzyxp0M',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1RgHBHTyASelsilwZcIQR8swxpnshH1Fq'
    },
    {
      id: 'st5-4',
      moduleId: 'm5',
      subtopicNo: '5.4',
      title: 'Global navigation, contextual navigation, user interactions, secondary actions',
      description: 'Global drawer structures and quick options.',
      videoUrl: 'https://www.youtube.com/watch?v=PlSFEn97FgM',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1v2aEYi5lH0UoodT_NpDWMdQ0dBJhg32z'
    },
    {
      id: 'st5-5',
      moduleId: 'm5',
      subtopicNo: '5.5',
      title: 'Mobile components and information display',
      description: 'Information hierarchy and layout guidelines.',
      videoUrl: 'https://www.youtube.com/watch?v=bTleDi-G8hE',
      notesUrl: 'https://drive.google.com/drive/u/0/folders/1rJbz0TnIGmUb1m0JJowa0GfJjhyR0cHX'
    }
  ];

  for (const st of subtopicsToSeed) {
    await prisma.subtopic.upsert({
      where: { id: st.id },
      update: {
        title: st.title,
        description: st.description,
        videoUrl: st.videoUrl,
        notesUrl: st.notesUrl
      },
      create: st
    });
  }

  // 2. Seed Simulations
  await prisma.simulation.upsert({
    where: { id: 'sim1' },
    update: {},
    create: {
      id: 'sim1',
      moduleId: 'm1',
      subtopicId: 'st1-1',
      title: 'Usability Audit Simulator',
      description: 'Identify 5 critical usability flaws in a mocked e-commerce checkout page.',
      difficulty: 'Intermediate',
      xpReward: 150,
      estimatedTime: '20 mins',
      learningOutcome: 'Ability to spot cognitive overload and friction points.',
    },
  });

  await prisma.simulation.upsert({
    where: { id: 'sim2' },
    update: {},
    create: {
      id: 'sim2',
      moduleId: 'm2',
      title: 'Information Architecture Builder',
      description: 'Drag and drop cards to create a logical site map for a university portal.',
      difficulty: 'Advanced',
      xpReward: 250,
      estimatedTime: '30 mins',
    },
  });

  // 3. Seed Badges
  await prisma.badge.upsert({
    where: { id: 'badge1' },
    update: {},
    create: {
      id: 'badge1',
      name: 'UI Scholar',
      description: 'Completed Module 1: Understanding User',
      icon: 'book-open',
      condition: 'Complete Module 1',
    },
  });

  // 4. Seed Quizzes
  await prisma.quiz.upsert({
    where: { id: 'quiz1' },
    update: {},
    create: {
      id: 'quiz1',
      moduleId: 'm1',
      title: 'Module 1 Assessment',
      difficulty: 'Easy',
      timeLimit: 15,
      xpReward: 100,
      questions: {
        create: [
          {
            questionText: 'What is a common problem with usability?',
            optionA: 'Too much white space',
            optionB: 'Cognitive overload',
            optionC: 'High contrast',
            optionD: 'Clear navigation',
            correctAnswer: 'B',
            marks: 1,
          },
          {
            questionText: 'Which is a human consideration in design?',
            optionA: 'Server speed',
            optionB: 'Short-term memory limits',
            optionC: 'Database structure',
            optionD: 'Code optimization',
            correctAnswer: 'B',
            marks: 1,
          },
        ],
      },
    },
  });

  // 5. Seed Flashcards
  await prisma.flashcard.upsert({
    where: { id: 'fc1' },
    update: {},
    create: {
      id: 'fc1',
      question: "What is Fitts' Law?",
      answer: "The time to acquire a target is a function of the distance to and size of the target."
    }
  });

  await prisma.flashcard.upsert({
    where: { id: 'fc2' },
    update: {},
    create: {
      id: 'fc2',
      question: "What is the Peak-End Rule?",
      answer: "Humans judge an experience largely based on how they felt at its peak and at its end, rather than the total sum or average of every moment."
    }
  });

  await prisma.flashcard.upsert({
    where: { id: 'fc3' },
    update: {},
    create: {
      id: 'fc3',
      question: "What is Jakob's Law?",
      answer: "Users spend most of their time on other sites. This means users prefer your site to work the same way as all the other sites they already know."
    }
  });

  const resourcesToSeed = [
    {
      id: 'qp1',
      title: 'UI 2025 Question Paper ',
      type: 'paper',
      link: 'https://drive.google.com/drive/u/0/folders/1WLx7vcx2B8DqW4ikQtDEjzvIi2MNW80L',
      detail: 'Sem V - Regular & K.T.'
    },
    {
      id: 'qp2',
      title: 'UI 2024 Question Paper',
      type: 'paper',
      link: 'https://drive.google.com/drive/folders/1abcDEfgHIJklMNoPQRstUVwxyZ123456',
      detail: 'Sem V - Regular'
    },
    {
      id: 'qp3',
      title: 'HCI Term End Exam - May 2025',
      type: 'paper',
      link: 'https://drive.google.com/drive/folders/1abcDEfgHIJklMNoPQRstUVwxyZ123456',
      detail: 'Sem V - Regular'
    },
    {
      id: 'rb1',
      title: 'Designing the User Interface',
      type: 'book',
      link: 'https://drive.google.com/drive/folders/1abcDEfgHIJklMNoPQRstUVwxyZ123456',
      detail: 'Ben Shneiderman - 6th Edition'
    },
    {
      id: 'rb2',
      title: 'About Face: Interaction Design Essentials',
      type: 'book',
      link: 'https://drive.google.com/drive/folders/1abcDEfgHIJklMNoPQRstUVwxyZ123456',
      detail: 'Alan Cooper - 4th Edition'
    },
    {
      id: 'rb3',
      title: "Don't Make Me Think: Web Usability Approach",
      type: 'book',
      link: 'https://drive.google.com/drive/folders/1abcDEfgHIJklMNoPQRstUVwxyZ123456',
      detail: 'Steve Krug - 3rd Edition'
    }
  ];

  for (const res of resourcesToSeed) {
    await prisma.resource.upsert({
      where: { id: res.id },
      update: {
        title: res.title,
        link: res.link,
        detail: res.detail,
        type: res.type
      },
      create: res
    });
  }

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

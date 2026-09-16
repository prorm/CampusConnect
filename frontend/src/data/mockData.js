// CampusConnect - Mock Data
// Pre-populated realistic initial data matching the Project Synopsis

export const initialUsers = [
  {
    id: 'u1',
    name: 'Pranav R Mane',
    email: 'pranav.mane@college.edu',
    role: 'student',
    usn: '1MS24CI091',
    department: 'Computer Science & Engg',
    year: '3rd Year',
    interests: ['AI/ML', 'Web Development', 'Competitive Coding', 'Hackathons'],
    avatar: '👨‍💻'
  },
  {
    id: 'u2',
    name: 'Sinchana Jeppu',
    email: 'sinchana.jeppu@college.edu',
    role: 'student',
    usn: '1MS24CI124',
    department: 'Information Science & Engg',
    year: '3rd Year',
    interests: ['Data Science', 'AI/ML', 'Design & UI/UX', 'Literary'],
    avatar: '👩‍💻'
  },
  {
    id: 'u3',
    name: 'Prajwal N',
    email: 'prajwal.n@college.edu',
    role: 'student',
    usn: '1MS24CI090',
    department: 'Computer Science & Engg',
    year: '3rd Year',
    interests: ['Cybersecurity', 'Cloud Computing', 'Robotics', 'Gaming'],
    avatar: '🧑‍💻'
  },
  {
    id: 'u4',
    name: 'Dr. Rajesh Sharma',
    email: 'coordinator.coding@college.edu',
    role: 'coordinator',
    usn: 'FAC-CS-104',
    department: 'Computer Science & Engg',
    year: 'Faculty Lead',
    clubId: 'c1',
    clubName: 'CodeCraft - Developers Society',
    interests: ['Software Architecture', 'Web Technologies'],
    avatar: '👨‍🏫'
  },
  {
    id: 'u5',
    name: 'Prof. Ananya Sen',
    email: 'admin.studentaffairs@college.edu',
    role: 'admin',
    usn: 'ADM-DEAN-01',
    department: 'Dean of Student Affairs Office',
    year: 'Administration',
    interests: ['Campus Analytics', 'Club Governance'],
    avatar: '🏛️'
  }
];

export const initialClubs = [
  {
    id: 'c1',
    name: 'CodeCraft - Developers Society',
    category: 'Technical',
    leadName: 'Dr. Rajesh Sharma',
    membersCount: 245,
    description: 'The premier coding community hosting weekly hackathons, algorithm workshops, open-source projects, and technical meetups.',
    tags: ['Coding', 'Web Development', 'Open Source', 'Hackathons'],
    bannerColor: '#2563eb',
    icon: '💻',
    status: 'active',
    founded: '2019'
  },
  {
    id: 'c2',
    name: 'Cognitive Minds AI & Robotics',
    category: 'Technical',
    leadName: 'Prof. Vikram Hegde',
    membersCount: 190,
    description: 'Exploring machine learning, computer vision, autonomous bots, and intelligent agent systems through hands-on labs.',
    tags: ['AI/ML', 'Robotics', 'Data Science', 'Deep Learning'],
    bannerColor: '#7c3aed',
    icon: '🤖',
    status: 'active',
    founded: '2021'
  },
  {
    id: 'c3',
    name: 'Dhvani Cultural & Music Society',
    category: 'Cultural',
    leadName: 'Meera Deshmukh',
    membersCount: 175,
    description: 'Bringing music, rhythm, classical & fusion bands, and grand festive cultural celebrations alive across campus.',
    tags: ['Music', 'Cultural', 'Band', 'Performance'],
    bannerColor: '#ec4899',
    icon: '🎵',
    status: 'active',
    founded: '2018'
  },
  {
    id: 'c4',
    name: 'Eloquence Literary & Debating Club',
    category: 'Literary',
    leadName: 'Arjun Nambiar',
    membersCount: 120,
    description: 'Fostering public speaking, parliamentary debate, creative writing, and literary quizzes with inter-college championships.',
    tags: ['Debate', 'Public Speaking', 'Literary', 'Writing'],
    bannerColor: '#f59e0b',
    icon: '🎙️',
    status: 'active',
    founded: '2017'
  },
  {
    id: 'c5',
    name: 'Apex Sports & Fitness League',
    category: 'Sports',
    leadName: 'Coach Sanjeev Roy',
    membersCount: 280,
    description: 'Promoting athletic excellence, inter-department tournaments, football, basketball, badminton, and physical wellness.',
    tags: ['Sports', 'Football', 'Badminton', 'Fitness'],
    bannerColor: '#10b981',
    icon: '⚽',
    status: 'active',
    founded: '2016'
  },
  {
    id: 'c6',
    name: 'GreenShield Social Service & NSS',
    category: 'Social',
    leadName: 'Rohan Varma',
    membersCount: 155,
    description: 'Community outreach, blood donation drives, eco-sustainability campaigns, and tree plantation across the district.',
    tags: ['Social Work', 'Volunteering', 'Eco-friendly', 'Community'],
    bannerColor: '#14b8a6',
    icon: '🌱',
    status: 'active',
    founded: '2020'
  }
];

export const initialEvents = [
  {
    id: 'e1',
    title: 'HackMatrix 2026: 24-Hour AI & Web Hackathon',
    clubId: 'c1',
    clubName: 'CodeCraft - Developers Society',
    category: 'Technical',
    date: '2026-09-28',
    time: '09:00 AM - Next Day',
    venue: 'Main Seminar Hall & APJ Lab Complex',
    description: 'Build innovative generative AI, full-stack, or automation solutions in teams of 2-4. Free food, mentor guidance, and prizes worth ₹50,000!',
    capacity: 120,
    registeredCount: 98,
    tags: ['AI/ML', 'Coding', 'Web Development', 'Hackathons'],
    status: 'upcoming',
    coordinator: 'Dr. Rajesh Sharma'
  },
  {
    id: 'e2',
    title: 'Hands-on Computer Vision & Edge AI Bootcamp',
    clubId: 'c2',
    clubName: 'Cognitive Minds AI & Robotics',
    category: 'Technical',
    date: '2026-09-22',
    time: '02:00 PM - 05:30 PM',
    venue: 'Robotics Lab 304, Tech Block',
    description: 'Practical workshop on training YOLO models, object detection on Raspberry Pi, and building intelligent real-time camera tracking.',
    capacity: 60,
    registeredCount: 54,
    tags: ['AI/ML', 'Robotics', 'Python'],
    status: 'upcoming',
    coordinator: 'Prof. Vikram Hegde'
  },
  {
    id: 'e3',
    title: 'Battle of the Bands: Campus Acoustic Night',
    clubId: 'c3',
    clubName: 'Dhvani Cultural & Music Society',
    category: 'Cultural',
    date: '2026-09-25',
    time: '06:00 PM - 09:30 PM',
    venue: 'Open Air Amphitheatre',
    description: 'Experience an electrifying musical evening featuring 8 student bands performing rock, pop, and regional classical fusion.',
    capacity: 350,
    registeredCount: 310,
    tags: ['Music', 'Cultural', 'Live Performance'],
    status: 'upcoming',
    coordinator: 'Meera Deshmukh'
  },
  {
    id: 'e4',
    title: 'Full-Stack MERN Architecture Masterclass',
    clubId: 'c1',
    clubName: 'CodeCraft - Developers Society',
    category: 'Technical',
    date: '2026-09-10',
    time: '10:00 AM - 01:00 PM',
    venue: 'CS Seminar Hall 2',
    description: 'End-to-end walkthrough on architecting production-ready REST APIs, React frontend state management, and MongoDB pipelines.',
    capacity: 100,
    registeredCount: 92,
    tags: ['Web Development', 'Coding', 'MERN'],
    status: 'completed',
    coordinator: 'Dr. Rajesh Sharma'
  },
  {
    id: 'e5',
    title: 'Inter-Department Parliamentary Debate Championship',
    clubId: 'c4',
    clubName: 'Eloquence Literary & Debating Club',
    category: 'Literary',
    date: '2026-09-14',
    time: '01:30 PM - 05:00 PM',
    venue: 'Auditorium Block C',
    description: 'Spirited parliamentary debates on technology ethics, global economics, and higher education policies with faculty judges.',
    capacity: 80,
    registeredCount: 72,
    tags: ['Debate', 'Literary', 'Public Speaking'],
    status: 'completed',
    coordinator: 'Arjun Nambiar'
  }
];

export const initialRegistrations = [
  {
    id: 'reg-1',
    studentId: 'u1', // Pranav R Mane
    studentName: 'Pranav R Mane',
    studentUsn: '1MS24CI091',
    department: 'Computer Science & Engg',
    eventId: 'e4', // Full-Stack MERN
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    clubName: 'CodeCraft - Developers Society',
    eventDate: '2026-09-10',
    attended: true,
    certificateIssued: true,
    feedbackSubmitted: true
  },
  {
    id: 'reg-2',
    studentId: 'u1', // Pranav R Mane
    studentName: 'Pranav R Mane',
    studentUsn: '1MS24CI091',
    department: 'Computer Science & Engg',
    eventId: 'e1', // HackMatrix
    eventTitle: 'HackMatrix 2026: 24-Hour AI & Web Hackathon',
    clubName: 'CodeCraft - Developers Society',
    eventDate: '2026-09-28',
    attended: false,
    certificateIssued: false,
    feedbackSubmitted: false
  },
  {
    id: 'reg-3',
    studentId: 'u2', // Sinchana Jeppu
    studentName: 'Sinchana Jeppu',
    studentUsn: '1MS24CI124',
    department: 'Information Science & Engg',
    eventId: 'e4',
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    clubName: 'CodeCraft - Developers Society',
    eventDate: '2026-09-10',
    attended: true,
    certificateIssued: true,
    feedbackSubmitted: true
  },
  {
    id: 'reg-4',
    studentId: 'u2', // Sinchana Jeppu
    studentName: 'Sinchana Jeppu',
    studentUsn: '1MS24CI124',
    department: 'Information Science & Engg',
    eventId: 'e2',
    eventTitle: 'Hands-on Computer Vision & Edge AI Bootcamp',
    clubName: 'Cognitive Minds AI & Robotics',
    eventDate: '2026-09-22',
    attended: false,
    certificateIssued: false,
    feedbackSubmitted: false
  },
  {
    id: 'reg-5',
    studentId: 'u3', // Prajwal N
    studentName: 'Prajwal N',
    studentUsn: '1MS24CI090',
    department: 'Computer Science & Engg',
    eventId: 'e4',
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    clubName: 'CodeCraft - Developers Society',
    eventDate: '2026-09-10',
    attended: true,
    certificateIssued: true,
    feedbackSubmitted: false
  },
  {
    id: 'reg-6',
    studentId: 'u3', // Prajwal N
    studentName: 'Prajwal N',
    studentUsn: '1MS24CI090',
    department: 'Computer Science & Engg',
    eventId: 'e1',
    eventTitle: 'HackMatrix 2026: 24-Hour AI & Web Hackathon',
    clubName: 'CodeCraft - Developers Society',
    eventDate: '2026-09-28',
    attended: false,
    certificateIssued: false,
    feedbackSubmitted: false
  }
];

export const initialFeedbacks = [
  {
    id: 'fb-1',
    eventId: 'e4',
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    studentName: 'Pranav R Mane',
    rating: 5,
    comment: 'Exceptional hands-on session! Loved how database indexes and REST controller structures were explained step-by-step.',
    sentiment: 'positive'
  },
  {
    id: 'fb-2',
    eventId: 'e4',
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    studentName: 'Sinchana Jeppu',
    rating: 5,
    comment: 'Clear explanations and very well-paced practical demo. Would love a follow-up bootcamp on deployment & Docker.',
    sentiment: 'positive'
  },
  {
    id: 'fb-3',
    eventId: 'e4',
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    studentName: 'Kavya Rao',
    rating: 4,
    comment: 'Great insights on fullstack workflow. Please allocate 15 more minutes for individual Q&A and error debugging.',
    sentiment: 'constructive'
  }
];

// Pre-computed AI Summaries and Engagement Analytics according to Synopsis Step 6 & 7
export const initialAiInsights = {
  feedbackSummary: {
    eventTitle: 'Full-Stack MERN Architecture Masterclass',
    totalReviews: 28,
    averageRating: 4.8,
    positiveRatio: '96% Positive Feedback',
    keyStrengths: [
      'Interactive hands-on coding walkthroughs received unanimous praise.',
      'Clear explanations of MongoDB schemas and Express routing logic.',
      'Active mentoring and helpful responses during the live coding exercise.'
    ],
    improvementAreas: [
      'Request for 20 extra minutes of lab debugging assistance.',
      'High student demand for sharing slides and starter repositories in advance.'
    ],
    aiRecommendation: 'High student retention predicted for the upcoming HackMatrix 2026 hackathon. Consider setting up mentor desks for rapid bug fixes.'
  },
  engagementAnalytics: {
    totalClubs: 12,
    activeMembers: 840,
    totalEvents: 38,
    totalRegistrations: 1420,
    overallAttendanceRate: 88.5,
    departmentParticipation: [
      { dept: 'Computer Science', count: 480, percentage: 34 },
      { dept: 'Info Science', count: 320, percentage: 23 },
      { dept: 'AI & Data Science', count: 260, percentage: 18 },
      { dept: 'Electronics (ECE)', count: 210, percentage: 15 },
      { dept: 'Mechanical / Civil', count: 150, percentage: 10 }
    ],
    yearParticipation: [
      { year: '1st Year', count: 290, percentage: 20 },
      { year: '2nd Year', count: 430, percentage: 30 },
      { year: '3rd Year', count: 510, percentage: 36 },
      { year: '4th Year', count: 190, percentage: 14 }
    ],
    monthlyAttendanceTrend: [
      { month: 'Jun', rate: 82 },
      { month: 'Jul', rate: 85 },
      { month: 'Aug', rate: 91 },
      { month: 'Sep', rate: 88 }
    ],
    popularEvents: [
      { name: 'HackMatrix 2026', registrations: 98, capacity: 120, fillRate: 82 },
      { name: 'Acoustic Night', registrations: 310, capacity: 350, fillRate: 88 },
      { name: 'Full-Stack Masterclass', registrations: 92, capacity: 100, fillRate: 92 },
      { name: 'Edge AI Bootcamp', registrations: 54, capacity: 60, fillRate: 90 }
    ],
    aiPredictiveInsights: [
      'Peak event attendance occurs on Friday afternoons between 2:00 PM and 5:00 PM.',
      'Technical workshops focused on AI and Full-Stack development fill 85% capacity within 48 hours of announcement.',
      '3rd Year students exhibit the highest repeat participation rate (3.4 events per semester).'
    ]
  }
};

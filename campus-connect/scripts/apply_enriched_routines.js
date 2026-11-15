const fs = require('fs');
const path = require('path');

const initialDataPath = path.join(__dirname, '../frontend/src/data/initialData.js');
let content = fs.readFileSync(initialDataPath, 'utf8');

// Require the existing initialData
// To require it in CommonJS, let's create a temporary cjs version or transform export
const esmContent = content;

// Replace all instances of batch with ranges in existing routines:
// 'B.Tech CSE 2024-28' -> 'B.Tech CSE 2024'
// 'B.Tech CSE 2023-27' -> 'B.Tech CSE 2023'
// 'B.Tech CSE 2022-26' -> 'B.Tech CSE 2022'
// 'B.Tech CSE 2021-25' -> 'B.Tech CSE 2021'

content = content.replace(/batch:\s*'B\.Tech CSE 2024-28'/g, "stream: 'B.Tech',\n    branch: 'CSE',\n    batchYear: '2024',\n    batch: 'B.Tech CSE 2024'");
content = content.replace(/batch:\s*'B\.Tech CSE 2023-27'/g, "stream: 'B.Tech',\n    branch: 'CSE',\n    batchYear: '2023',\n    batch: 'B.Tech CSE 2023'");
content = content.replace(/batch:\s*'B\.Tech CSE 2022-26'/g, "stream: 'B.Tech',\n    branch: 'CSE',\n    batchYear: '2022',\n    batch: 'B.Tech CSE 2022'");
content = content.replace(/batch:\s*'B\.Tech CSE 2021-25'/g, "stream: 'B.Tech',\n    branch: 'CSE',\n    batchYear: '2021',\n    batch: 'B.Tech CSE 2021'");

// Also clean up any comment headers referring to 2024-28, 2023-27, 2022-26, 2021-25
content = content.replace(/Batch:\s*B\.Tech CSE 2024-28/g, "Batch: B.Tech CSE 2024");
content = content.replace(/Batch:\s*B\.Tech CSE 2023-27/g, "Batch: B.Tech CSE 2023");
content = content.replace(/Batch:\s*B\.Tech CSE 2022-26/g, "Batch: B.Tech CSE 2022");
content = content.replace(/Batch:\s*B\.Tech CSE 2021-25/g, "Batch: B.Tech CSE 2021");

// Now append Sem 2, Sem 6, Sem 8, and 2025 Branch additions right before `export const INITIAL_LOST_FOUND`
const enrichModule = require('./enrich_routines.js');

// Read enrich_routines.js text or define the json
const additionalRoutinesStr = `
  // =========================================================================
  // SEMESTER 2 (1st Year Even Semester)
  // Batch: B.Tech CSE 2024
  // =========================================================================
  {
    id: 'rt-s2-mon-1',
    subject: 'Data Structures & Algorithms',
    code: 'CS102',
    faculty: 'CS Faculty',
    room: 'Room 2118',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-mon-2',
    subject: 'Digital Logic Design',
    code: 'EC101',
    faculty: 'ECE Faculty',
    room: 'Room 2118',
    day: 'Monday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-mon-3',
    subject: 'Data Structures Lab',
    code: 'CS102L',
    faculty: 'CS Faculty & Lab Staff',
    room: 'Computing Lab 1',
    day: 'Monday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-tue-1',
    subject: 'Discrete Mathematics',
    code: 'MA102',
    faculty: 'Maths Faculty',
    room: 'Room 2118',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-tue-2',
    subject: 'Physics II (Electromagnetism & Optics)',
    code: 'SC102',
    faculty: 'Physics Faculty',
    room: 'Room 2118',
    day: 'Tuesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-wed-1',
    subject: 'Data Structures & Algorithms',
    code: 'CS102',
    faculty: 'CS Faculty',
    room: 'Room 2118',
    day: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-wed-2',
    subject: 'Web Development Fundamentals',
    code: 'IT102',
    faculty: 'IT Faculty',
    room: 'Room 2118',
    day: 'Wednesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-wed-3',
    subject: 'Digital Electronics Lab',
    code: 'EC101L',
    faculty: 'ECE Faculty & Lab Staff',
    room: 'HARDWARE LAB',
    day: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-thu-1',
    subject: 'Discrete Mathematics',
    code: 'MA102',
    faculty: 'Maths Faculty',
    room: 'Room 2118',
    day: 'Thursday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-thu-2',
    subject: 'Digital Logic Design',
    code: 'EC101',
    faculty: 'ECE Faculty',
    room: 'Room 2118',
    day: 'Thursday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-fri-1',
    subject: 'Physics II (Electromagnetism & Optics)',
    code: 'SC102',
    faculty: 'Physics Faculty',
    room: 'Room 2118',
    day: 'Friday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },
  {
    id: 'rt-s2-fri-2',
    subject: 'Web Development Lab',
    code: 'IT102L',
    faculty: 'IT Faculty',
    room: 'Computing Lab 2',
    day: 'Friday',
    startTime: '10:30 AM',
    endTime: '12:30 PM',
    type: 'Lab',
    semester: 'Semester 2',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2024',
    batch: 'B.Tech CSE 2024'
  },

  // =========================================================================
  // SEMESTER 6 (3rd Year Even Semester)
  // Batch: B.Tech CSE 2022
  // =========================================================================
  {
    id: 'rt-s6-mon-1',
    subject: 'Computer Networks',
    code: 'CS302',
    faculty: 'Prof. A. Shah',
    room: 'Room 2115',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-mon-2',
    subject: 'Compiler Design',
    code: 'CS304',
    faculty: 'Dr. V. Trivedi',
    room: 'Room 2115',
    day: 'Monday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-mon-3',
    subject: 'Network Socket Programming Lab',
    code: 'CS302L',
    faculty: 'Prof. A. Shah',
    room: 'Computing Lab 3',
    day: 'Monday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-tue-1',
    subject: 'Software Engineering & Agile Lifecycle',
    code: 'CS306',
    faculty: 'Prof. P. Patel',
    room: 'Room 2115',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-tue-2',
    subject: 'Machine Learning & Pattern Recognition',
    code: 'CS308',
    faculty: 'Dr. S. Kulkarni',
    room: 'Room 2115',
    day: 'Tuesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-wed-1',
    subject: 'Computer Networks',
    code: 'CS302',
    faculty: 'Prof. A. Shah',
    room: 'Room 2115',
    day: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-wed-2',
    subject: 'Compiler Design',
    code: 'CS304',
    faculty: 'Dr. V. Trivedi',
    room: 'Room 2115',
    day: 'Wednesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-wed-3',
    subject: 'Machine Learning & AI Lab',
    code: 'CS308L',
    faculty: 'Dr. S. Kulkarni',
    room: 'Computing Lab 3',
    day: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-thu-1',
    subject: 'Software Engineering & Architecture',
    code: 'CS306',
    faculty: 'Prof. P. Patel',
    room: 'Room 2115',
    day: 'Thursday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-thu-2',
    subject: 'Distributed Systems & Cloud Platforms',
    code: 'CS310',
    faculty: 'Prof. R. Mehta',
    room: 'Room 2115',
    day: 'Thursday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-fri-1',
    subject: 'Compiler Lex/Yacc Implementation Lab',
    code: 'CS304L',
    faculty: 'Dr. V. Trivedi',
    room: 'Computing Lab 1',
    day: 'Friday',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    type: 'Lab',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },
  {
    id: 'rt-s6-fri-2',
    subject: 'Technical Seminar & Capstone Prep',
    code: 'CS312',
    faculty: 'Department Committee',
    room: 'Seminar Hall',
    day: 'Friday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Tutorial',
    semester: 'Semester 6',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2022',
    batch: 'B.Tech CSE 2022'
  },

  // =========================================================================
  // SEMESTER 8 (4th Year Even Semester)
  // Batch: B.Tech CSE 2021
  // =========================================================================
  {
    id: 'rt-s8-mon-1',
    subject: 'Cloud Computing & Virtualization',
    code: 'CS402',
    faculty: 'Cloud Faculty',
    room: 'Room 2109',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-mon-2',
    subject: 'B.Tech Major Capstone Mentorship',
    code: 'CS499',
    faculty: 'Project Review Board',
    room: 'Project Lab 4',
    day: 'Monday',
    startTime: '10:30 AM',
    endTime: '01:00 PM',
    type: 'Lab',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-tue-1',
    subject: 'Cyber Security & Digital Forensics',
    code: 'CS404',
    faculty: 'Security Faculty',
    room: 'Room 2109',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-tue-2',
    subject: 'High Performance & GPU Computing',
    code: 'CS406',
    faculty: 'Systems Faculty',
    room: 'Room 2109',
    day: 'Tuesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-wed-1',
    subject: 'B.Tech Capstone Project Progress Reviews',
    code: 'CS499',
    faculty: 'Project Review Board',
    room: 'Project Lab 4',
    day: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '01:00 PM',
    type: 'Lab',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-thu-1',
    subject: 'Cloud Computing & Virtualization',
    code: 'CS402',
    faculty: 'Cloud Faculty',
    room: 'Room 2109',
    day: 'Thursday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-thu-2',
    subject: 'Cyber Security & Digital Forensics',
    code: 'CS404',
    faculty: 'Security Faculty',
    room: 'Room 2109',
    day: 'Thursday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },
  {
    id: 'rt-s8-fri-1',
    subject: 'Industry Internship / Research Colloquium',
    code: 'CS408',
    faculty: 'Training & Placement Cell',
    room: 'Auditorium',
    day: 'Friday',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    type: 'Lecture',
    semester: 'Semester 8',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2021',
    batch: 'B.Tech CSE 2021'
  },

  // =========================================================================
  // 2025 NEW BRANCH CURRICULA: AI, CYBER SECURITY, ECE
  // =========================================================================
  // AI Branch (Semester 1 / 2)
  {
    id: 'rt-ai-mon-1',
    subject: 'Artificial Intelligence & Search Strategies',
    code: 'AI201',
    faculty: 'Dr. AI Specialist',
    room: 'Room 2110',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'AI',
    batchYear: '2025',
    batch: 'B.Tech AI 2025'
  },
  {
    id: 'rt-ai-tue-1',
    subject: 'Foundations of Data Science & Probabilistic Models',
    code: 'DS201',
    faculty: 'Data Science Faculty',
    room: 'Room 2110',
    day: 'Tuesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'AI',
    batchYear: '2025',
    batch: 'B.Tech AI 2025'
  },
  {
    id: 'rt-ai-wed-1',
    subject: 'Python AI & Deep Learning Lab',
    code: 'AI201L',
    faculty: 'AI Lab Staff',
    room: 'AI & GPU Lab',
    day: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'AI',
    batchYear: '2025',
    batch: 'B.Tech AI 2025'
  },

  // Cyber Security Branch
  {
    id: 'rt-cyber-mon-1',
    subject: 'Introduction to Cyber Defense & Security Principles',
    code: 'CY201',
    faculty: 'Cyber Security Lead',
    room: 'Room 2112',
    day: 'Monday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'Cyber Security',
    batchYear: '2025',
    batch: 'B.Tech Cyber Security 2025'
  },
  {
    id: 'rt-cyber-thu-1',
    subject: 'Network Security Protocols & Cryptography',
    code: 'CY202',
    faculty: 'Security Faculty',
    room: 'Room 2112',
    day: 'Thursday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'Cyber Security',
    batchYear: '2025',
    batch: 'B.Tech Cyber Security 2025'
  },
  {
    id: 'rt-cyber-fri-1',
    subject: 'Ethical Hacking & Network Defense Lab',
    code: 'CY201L',
    faculty: 'Cyber Lab Staff',
    room: 'Cyber Security Lab',
    day: 'Friday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'Cyber Security',
    batchYear: '2025',
    batch: 'B.Tech Cyber Security 2025'
  },

  // ECE Branch
  {
    id: 'rt-ece-tue-1',
    subject: 'Signals & Linear Systems',
    code: 'EC201',
    faculty: 'ECE Faculty',
    room: 'Room 2114',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'ECE',
    batchYear: '2025',
    batch: 'B.Tech ECE 2025'
  },
  {
    id: 'rt-ece-wed-1',
    subject: 'Analog & Digital Communication Engineering',
    code: 'EC202',
    faculty: 'ECE Faculty',
    room: 'Room 2114',
    day: 'Wednesday',
    startTime: '10:30 AM',
    endTime: '11:45 AM',
    type: 'Lecture',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'ECE',
    batchYear: '2025',
    batch: 'B.Tech ECE 2025'
  },
  {
    id: 'rt-ece-thu-1',
    subject: 'DSP & Communication Hardware Lab',
    code: 'EC201L',
    faculty: 'ECE Lab Staff',
    room: 'DSP & Circuits Lab',
    day: 'Thursday',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'Lab',
    semester: 'Semester 1',
    stream: 'B.Tech',
    branch: 'ECE',
    batchYear: '2025',
    batch: 'B.Tech ECE 2025'
  }
`;

// Insert additional routines right before the closing `];\n\nexport const INITIAL_LOST_FOUND`
const targetClosing = `  }\n];\n\nexport const INITIAL_LOST_FOUND`;
const replacementClosing = `  },\n${additionalRoutinesStr}\n];\n\nexport const INITIAL_LOST_FOUND`;

if (!content.includes(targetClosing)) {
  console.error('Target closing bracket not found in initialData.js!');
  process.exit(1);
}

content = content.replace(targetClosing, replacementClosing);
fs.writeFileSync(initialDataPath, content, 'utf8');
console.log('Successfully enriched initialData.js with Sem 2, 6, 8, AI, Cyber, ECE routines!');


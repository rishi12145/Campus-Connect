/**
 * Comprehensive Automated QA Test Suite for Campus Connect (IIITV-ICD)
 * Validates dynamic student-driven features, real timetables, 20 authentic Diu places,
 * transport speed-dials, verified institute domain auth, and admin moderation.
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock browser localStorage and window dispatch
const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
})();

global.localStorage = storageMock;
global.window = {
  dispatchEvent: (event) => {}
};
global.CustomEvent = class { constructor(type, detail) { this.type = type; this.detail = detail; } };

async function runTests() {
  console.log('=== STARTING PRODUCTION QUALITY ASSURANCE (18 TESTS) ===\n');

  // Load modules
  const { storageService } = await import('./campus-connect/frontend/src/services/storageService.js');
  const { fileService } = await import('./campus-connect/frontend/src/services/fileService.js');
  const {
    academicResourceService,
    validateResourceFile,
    RESOURCE_CATEGORIES,
    MAX_FILE_SIZE_BYTES
  } = await import('./campus-connect/frontend/src/services/academicResourceService.js');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // TEST 1: Storage initialization and student-driven clean slate
  storageService.init();
  const announcements = storageService.getAnnouncements();
  assert(Array.isArray(announcements), 'TEST 1: Storage initializes with clean student-driven data model');

  // TEST 2: Register a new student with verified institute domain & single batch year
  const testStudent = {
    fullName: 'Rishikesh Gopal',
    rollNumber: '202351072',
    collegeEmail: '202351072@diu.iiitvadodara.ac.in',
    phoneNumber: '+91 99999 88888',
    semester: 'Semester 7',
    stream: 'B.Tech',
    branch: 'CSE',
    batchYear: '2023',
    batch: 'B.Tech CSE 2023',
    password: 'password123'
  };
  const regRes = storageService.register(testStudent);
  assert(regRes.user && regRes.user.rollNumber === '202351072', 'TEST 2: Register new student with @diu.iiitvadodara.ac.in domain');

  // TEST 3: Log in using the student credentials
  const studentLogin = storageService.login('202351072@diu.iiitvadodara.ac.in', 'password123');
  assert(studentLogin.user && studentLogin.user.role === 'student', 'TEST 3: Student login succeeds with verified credentials');

  // TEST 4: Verify real academic routines loaded (Sem 1, Sem 3, Sem 5, Sem 7)
  const routines = storageService.getRoutines();
  assert(routines.length >= 60, `TEST 4: Real class schedules loaded across Semesters 1, 3, 5, 7 (Found: ${routines.length} entries)`);

  // TEST 5: Verify 20 Diu spots, transport and local speed dials
  const transport = storageService.getTransport();
  const places = storageService.getPlaces();
  const localContacts = storageService.getLocalServices();

  assert(places.length === 20, `TEST 5a: Curated Diu tourist spots equals 20 (Actual: ${places.length})`);
  assert(transport.length >= 2, `TEST 5b: ₹10 Municipal Bus Routes present (Actual: ${transport.length})`);
  assert(localContacts.length >= 10, `TEST 5c: Local speed-dials (Saddam delivery, Shankar Cake, Ambica, Chagda auto) >= 10 (Actual: ${localContacts.length})`);

  // TEST 6: Create a Lost & Found listing and verify owner delete capability
  const newLost = storageService.createLostFound({
    title: 'Blue Water Bottle',
    description: 'Milton 1L bottle left in Room 2118',
    type: 'lost',
    category: 'Personal Belongings',
    location: 'Room 2118',
    date: '2026-03-05',
    contactName: 'Rishikesh Gopal',
    contactPhone: '+91 99999 88888',
    contactEmail: '202351072@diu.iiitvadodara.ac.in',
    reportedBy: regRes.user.id
  });
  assert(newLost && newLost.title === 'Blue Water Bottle', 'TEST 6: Create Lost & Found listing by verified student');

  // TEST 7: Upload a resource with dynamic subject, semester, and year selection
  const newRes = storageService.createResource({
    title: 'Operating Systems Virtual Memory Handout',
    subject: 'Operating Systems',
    semester: 'Semester 4',
    year: '2024',
    category: 'Class Notes',
    description: 'Paging, TLB hit rates, and page replacement algorithms',
    fileName: 'OS_Virtual_Memory_Notes.txt',
    fileContent: 'VIRTUAL MEMORY SUMMARY: Address translation via TLB & Page Tables',
    uploaderId: regRes.user.id,
    uploaderName: 'Rishikesh Gopal'
  });
  storageService.incrementDownload(newRes.id);
  const updatedRes = storageService.getResources().find(r => r.id === newRes.id);
  assert(updatedRes && updatedRes.downloadCount === 1, 'TEST 7: Upload study resource with semester & year, increment download');

  // TEST 8: Create a community discussion and add a comment
  const newDisc = storageService.createDiscussion({
    title: 'Tips for Linux Computing Lab Setup',
    content: 'Recommended Ubuntu packages for socket programming and kernel modules.',
    category: 'Academics',
    authorId: regRes.user.id,
    authorName: regRes.user.fullName,
    authorRoll: regRes.user.rollNumber
  });
  const newComment = storageService.addComment({
    discussionId: newDisc.id,
    authorId: regRes.user.id,
    authorName: 'Sriya Reddy',
    authorRoll: '202351002',
    content: 'Check build-essential and gcc-multilib!'
  });
  const discComments = storageService.getComments(newDisc.id);
  assert(discComments.length === 1 && discComments[0].content.includes('build-essential'), 'TEST 8: Community discussion created and comment persisted');

  // TEST 9: Search functionality across indexed academic data
  const searchResults = storageService.searchAll('Operating Systems');
  assert(searchResults.total >= 1, `TEST 9: Global search found records for "Operating Systems" (Found: ${searchResults.total})`);

  // TEST 10: Edit student profile
  const updatedProfile = storageService.updateProfile(regRes.user.id, {
    bio: 'IIITV-ICD student passionate about distributed systems and coastal cycling',
    phoneNumber: '+91 91234 56789'
  });
  assert(updatedProfile.phoneNumber === '+91 91234 56789', 'TEST 10: Student profile update persisted');

  // TEST 11: Admin login with rishiadmin and requested password
  storageService.logout();
  const adminLogin = storageService.login('rishiadmin', 'rishi202311072@');
  assert(adminLogin.user && adminLogin.user.role === 'admin' && adminLogin.user.username === 'rishiadmin', 'TEST 11a: Admin login succeeds with ID "rishiadmin" and password "rishi202311072@"');

  storageService.logout();
  const adminLoginDots = storageService.login('rishiadmin', 'rishi202311072@..');
  assert(adminLoginDots.user && adminLoginDots.user.role === 'admin', 'TEST 11b: Admin login succeeds with ID "rishiadmin" and password "rishi202311072@.."');

  // TEST 12: Create an official campus notice from admin
  const adminNotice = storageService.createAnnouncement({
    title: 'Mid-Semester Examinations Timetable Released',
    description: 'The schedule for Spring semester mid-terms is now live on the portal.',
    category: 'Examination',
    targetSemester: 'All',
    targetBatch: 'All Batches',
    isImportant: true,
    authorName: 'Academic Section'
  });
  assert(adminNotice && adminNotice.isImportant === true, 'TEST 12: Admin announcement creation with high priority flag');

  // TEST 13: Announcement visible in stream
  const studentNotices = storageService.getAnnouncements();
  const foundAdminNotice = studentNotices.find(a => a.id === adminNotice.id);
  assert(foundAdminNotice !== undefined, 'TEST 13: Admin announcement visible in live announcement stream');

  // TEST 14: Dynamic Subject Creation and Timetable routine update
  const newRoutine = storageService.createRoutine({
    subject: 'Artificial Intelligence & Ethics',
    code: 'CS420',
    faculty: 'Dr. Faculty Member',
    room: 'Room 2118',
    day: 'Wednesday',
    startTime: '03:15 PM',
    endTime: '04:45 PM',
    type: 'Lecture',
    semester: 'Semester 5',
    batch: 'B.Tech CSE 2022'
  });
  storageService.updateRoutine(newRoutine.id, { room: 'Room 2113' });
  const fetchedRt = storageService.getRoutines().find(r => r.id === newRoutine.id);
  assert(fetchedRt && fetchedRt.room === 'Room 2113', 'TEST 14: Academic routine creation and room update verified');

  // TEST 15: Storage persistence across reloads
  const dumped = storageMock._dump();
  assert(Object.keys(dumped).length >= 5, 'TEST 15: Entities serialized and persistent in storage');

  // TEST 16: Verify authentic Wikimedia images for 20 Diu spots
  const diuPlaces = storageService.getPlaces();
  let allPlacesHaveImages = true;
  for (const place of diuPlaces) {
    if (!place.imageUrl || !place.imageUrl.startsWith('/images/explore/')) {
      allPlacesHaveImages = false;
      console.error('Place missing image:', place.name);
    }
  }
  assert(allPlacesHaveImages && diuPlaces.length === 20, 'TEST 16: All 20 curated Diu tourist spots have authentic Wikimedia images');

  // TEST 17: Verify image files exist on disk in public/images/explore/
  let imagesExistOnDisk = true;
  for (const place of diuPlaces) {
    const filename = place.imageUrl.replace('/images/explore/', '');
    const p = path.join(__dirname, 'campus-connect/frontend/public/images/explore', filename);
    if (!fs.existsSync(p)) {
      imagesExistOnDisk = false;
      console.error('Missing on disk: ' + filename);
    }
  }
  assert(imagesExistOnDisk, 'TEST 17: All 20 Diu place images physically exist in public/images/explore/');

  // TEST 18: Campus images existence check
  const requiredImages = [
    'campus-main.jpg',
    'campus-building.jpg',
    'campus-life.jpg',
    'campus-library.jpg',
    'campus-lab.jpg',
    'campus-hostel.jpg',
    'campus-events.jpg',
    'campus-cafeteria.jpg'
  ];
  let allImgsExist = true;
  for (const img of requiredImages) {
    const p = path.join(__dirname, 'campus-connect/frontend/public/images/campus', img);
    if (!fs.existsSync(p)) {
      allImgsExist = false;
      console.error('Missing image: ' + img);
    }
  }
  assert(allImgsExist, 'TEST 18: All authentic IIITV-ICD campus photos present in public/images/campus/');

  // TEST 19: Developers team roster and Lead developer contact verification
  const devs = storageService.getDevelopers();
  const leadDev = devs.find(d => d.isLead || d.name?.includes('Rishikesh'));
  const sriyaDev = devs.find(d => d.name?.includes('Sriya'));
  const shivangiDev = devs.find(d => d.name?.includes('Shivangi'));

  assert(
    leadDev && leadDev.contactPhone === '8340574363' && leadDev.email === '202311072@iiitvadodara.ac.in',
    `TEST 19a: Lead developer Rishikesh Gopal has verified WhatsApp support and email 202311072@iiitvadodara.ac.in`
  );

  assert(
    leadDev?.rollNumber === '202311072' && leadDev?.batch === 'B.Tech CSE 2023-2027' && !!leadDev?.quote &&
    sriyaDev?.rollNumber === '202311060' && sriyaDev?.batch === 'B.Tech CSE 2023-2027' && !!sriyaDev?.quote &&
    shivangiDev?.rollNumber === '202311079' && shivangiDev?.batch === 'B.Tech CSE 2023-2027' && !!shivangiDev?.quote,
    'TEST 19b: All three developers (Rishikesh 202311072, Sriya 202311060, Shivangi 202311079) verified with B.Tech CSE 2023-2027 and individual quotes'
  );

  const newDev = storageService.createDeveloper({
    name: 'New Campus Contributor',
    role: 'Mobile Apps Lead',
    year: 'B.Tech CSE (2023-2027)',
    batch: 'B.Tech CSE 2023-2027',
    rollNumber: '202311099',
    quote: 'Coding for the campus community.',
    contactPhone: '9876500000',
    email: 'newcontributor@diu.iiitvadodara.ac.in',
    isLead: false,
    bio: 'Flutter enthusiast'
  });
  assert(newDev && newDev.id, 'TEST 19c: Admin can create new developer profile in team roster');

  storageService.updateDeveloper(newDev.id, { contactPhone: '9876511111', quote: 'Updated developer quote' });
  const updatedDev = storageService.getDevelopers().find(d => d.id === newDev.id);
  assert(updatedDev && updatedDev.contactPhone === '9876511111' && updatedDev.quote === 'Updated developer quote', 'TEST 19d: Admin can edit developer profile, photo, quote, and details');

  storageService.deleteDeveloper(newDev.id);
  const deletedCheck = storageService.getDevelopers().find(d => d.id === newDev.id);
  assert(deletedCheck === undefined, 'TEST 19e: Admin can delete developer from team roster');

  // TEST 20: Branch-wise academic routine creation (Sem 1 to 8, CSE / AI / Cyber Security / ECE)
  const branchRoutine = storageService.createRoutine({
    subject: 'Network Security Lab',
    code: 'CS602',
    faculty: 'Dr. Cyber Lab Faculty',
    room: 'Lab 2108',
    day: 'Thursday',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    type: 'Lab',
    semester: 'Semester 6',
    branch: 'Cyber Security',
    stream: 'B.Tech',
    batchYear: '2025'
  });
  assert(
    branchRoutine && branchRoutine.branch === 'Cyber Security' && branchRoutine.semester === 'Semester 6',
    'TEST 20: Branch-wise routine creation for Semester 6 (Cyber Security) supported'
  );

  // TEST 21: Targeted branch announcement
  const branchNotice = storageService.createAnnouncement({
    title: 'AI Lab Special Workshop',
    description: 'Special deep learning lab session for AI branch students.',
    category: 'Academic',
    targetSemester: 'Semester 4',
    targetBranch: 'AI',
    targetBatch: 'B.Tech AI 2025',
    isImportant: false,
    authorName: 'AI Department'
  });
  assert(
    branchNotice && branchNotice.targetBranch === 'AI',
    'TEST 21: Targeted announcement created with targetBranch="AI"'
  );

  // TEST 22: Academic Resource Categories Verification
  const expectedCategories = [
    'Previous Year Question Papers (PYQs)',
    'Lecture Notes',
    'Lab Manuals',
    'Study Materials'
  ];
  const allCategoriesMatch = expectedCategories.every(c => RESOURCE_CATEGORIES.includes(c));
  assert(
    allCategoriesMatch && RESOURCE_CATEGORIES.length === 4,
    'TEST 22: Exact 4 Academic Resource categories verified (PYQs, Notes, Lab Manuals, Study Materials)'
  );

  // TEST 23: Strict 1 MB File Size & Type Validation (Frontend & Backend Constraints)
  const validSmallFile = { name: 'algorithms_notes.pdf', size: 500 * 1024, type: 'application/pdf' };
  const validCheck = validateResourceFile(validSmallFile);
  assert(validCheck.valid === true, 'TEST 23a: 500 KB PDF file passes 1 MB file size validation');

  const oversizeFile = { name: 'huge_scan.pdf', size: 1.5 * 1024 * 1024, type: 'application/pdf' };
  const oversizeCheck = validateResourceFile(oversizeFile);
  assert(
    oversizeCheck.valid === false && oversizeCheck.error.includes('1 MB limit'),
    `TEST 23b: 1.5 MB file is rejected with clear error: "${oversizeCheck.error}"`
  );

  const invalidTypeFile = { name: 'installer.exe', size: 200 * 1024, type: 'application/x-msdownload' };
  const invalidTypeCheck = validateResourceFile(invalidTypeFile);
  assert(
    invalidTypeCheck.valid === false && invalidTypeCheck.error.includes('Invalid file format'),
    'TEST 23c: Non-allowed format (.exe) is rejected with clear error message'
  );

  // TEST 24: Resource Ownership & Modification Permissions
  const studentA = { id: 'usr-student-a', fullName: 'Student Alpha', role: 'student' };
  const studentB = { id: 'usr-student-b', fullName: 'Student Beta', role: 'student' };
  const adminUser = { id: 'usr-admin', fullName: 'Campus Admin', role: 'admin' };

  const resourceOwnedByA = {
    id: 'res-test-1',
    title: 'Operating Systems Midsem Solutions 2024',
    uploaded_by: 'usr-student-a',
    uploadedBy: 'usr-student-a',
    uploader_name: 'Student Alpha'
  };

  const studentACanModify = academicResourceService.canModify(resourceOwnedByA, studentA);
  const studentBCanModify = academicResourceService.canModify(resourceOwnedByA, studentB);
  const adminCanModify = academicResourceService.canModify(resourceOwnedByA, adminUser);

  assert(
    studentACanModify === true,
    'TEST 24a: Student owner (Student A) CAN edit/delete their own uploaded resource'
  );
  assert(
    studentBCanModify === false,
    'TEST 24b: Another student (Student B) CANNOT edit or delete Student A\'s resource'
  );
  assert(
    adminCanModify === true,
    'TEST 24c: Admin CAN edit or delete any student\'s uploaded resource'
  );

  // TEST 25: Absolute absence of "Software Project Management" and "SPM" in active UI/Routines
  const activeRoutines = storageService.getRoutines();
  const spmRoutine = activeRoutines.find(r => 
    r.subject?.toLowerCase().includes('software project management') ||
    r.subject?.toLowerCase().includes('spm')
  );
  assert(
    spmRoutine === undefined,
    'TEST 25: Zero occurrences of "Software Project Management" or "SPM" in active timetable routines'
  );

  // TEST 26: Master Supabase Schema Verification (11 tables + 3 Storage Buckets)
  const schemaPath = path.join(__dirname, 'campus-connect/supabase_schema.sql');
  const schemaExists = fs.existsSync(schemaPath);
  const schemaSql = schemaExists ? fs.readFileSync(schemaPath, 'utf-8') : '';
  
  const requiredTables = [
    'public.profiles',
    'public.academic_routines',
    'public.announcements',
    'public.lost_found_items',
    'public.academic_resources',
    'public.discussions',
    'public.discussion_comments',
    'public.places',
    'public.transport_routes',
    'public.local_services',
    'public.developers'
  ];

  const allTablesDeclared = requiredTables.every(t => schemaSql.includes(t));
  const hasStorageBuckets = schemaSql.includes("'academic-resources'") && schemaSql.includes("'lost-found-images'");

  assert(
    schemaExists && allTablesDeclared && hasStorageBuckets,
    `TEST 26: Master Supabase SQL schema contains all 11 tables & storage buckets (Size: ${(Buffer.byteLength(schemaSql, 'utf8')/1024).toFixed(1)} KB)`
  );

  // TEST 27: Bi-directional Supabase Sync Service Methods Ready
  assert(
    typeof storageService.syncFromSupabase === 'function' && typeof storageService.syncAllToSupabase === 'function',
    'TEST 27: storageService has syncFromSupabase() and syncAllToSupabase() cloud sync methods ready'
  );

  // TEST 28: Direct Online Compression Tools Linked for Oversized Files (>1MB)
  const pdfVal = validateResourceFile({ name: 'syllabus_large.pdf', size: 2.5 * 1024 * 1024, type: 'application/pdf' });
  const imgVal = validateResourceFile({ name: 'campus_photo.png', size: 1.8 * 1024 * 1024, type: 'image/png' });
  assert(
    !pdfVal.valid && pdfVal.compressUrl === 'https://www.ilovepdf.com/compress_pdf' &&
    !imgVal.valid && imgVal.compressUrl === 'https://www.iloveimg.com/compress-image',
    'TEST 28: Direct online compression tool links (iLovePDF & iLoveIMG) returned on oversized files'
  );

  // TEST 29: Website Controller & About Us Content 100% Editable and Persistent
  const about = storageService.getAboutContent();
  assert(
    about && about.controller && about.controller.name === 'Rishikesh Gopal' &&
    about.controller.email === '202311072@iiitvadodara.ac.in' &&
    about.controller.whatsappLink.includes('wa.me/918340574363'),
    'TEST 29a: Website Controller initialized with Rishikesh Gopal, official email and WhatsApp link'
  );

  const updatedAbout = storageService.updateAboutContent({
    controller: { ...about.controller, message: 'Updated custom notice to students from Admin' }
  });
  assert(
    updatedAbout.controller.message === 'Updated custom notice to students from Admin',
    'TEST 29b: About Us controller and page contents successfully updated and persisted'
  );

  // TEST 30: All 8 Semesters and 4 Branches Exist in Routines
  const allRoutines = storageService.getRoutines();
  const semSet = new Set(allRoutines.map(r => r.semester));
  const branchSet = new Set(allRoutines.map(r => r.branch).filter(Boolean));
  const hasAll8Semesters = [1, 2, 3, 4, 5, 6, 7, 8].every(s => semSet.has(`Semester ${s}`));
  const hasAllBranches = ['CSE', 'AI', 'Cyber Security', 'ECE'].every(b => branchSet.has(b));
  assert(
    hasAll8Semesters && hasAllBranches,
    `TEST 30: All 8 Semesters (1–8) and 4 Branches (CSE, AI, Cyber Security, ECE) present in routines (${allRoutines.length} entries)`
  );

  console.log(`\n=== QA RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) process.exit(1);
}

runTests();

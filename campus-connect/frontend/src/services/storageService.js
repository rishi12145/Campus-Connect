import { supabaseSyncService } from './supabaseSyncService.js';
import {
  INITIAL_USERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_ROUTINES,
  INITIAL_LOST_FOUND,
  INITIAL_TRANSPORT,
  INITIAL_RESOURCES,
  INITIAL_DISCUSSIONS,
  INITIAL_COMMENTS,
  INITIAL_PLACES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_DEVELOPERS,
  GOVT_BUS_DATA,
  LOCAL_SERVICES_CONTACTS,
  INITIAL_ABOUT_CONTENT
} from '../data/initialData.js';

const STORAGE_KEYS = {
  USERS: 'cc_users_v2',
  CURRENT_USER: 'cc_current_user_v2',
  AUTH_TOKEN: 'cc_auth_token_v2',
  ANNOUNCEMENTS: 'cc_announcements_v2',
  ROUTINES: 'cc_routines_v2',
  LOST_FOUND: 'cc_lost_found_v2',
  TRANSPORT: 'cc_transport_v2',
  LOCAL_SERVICES: 'cc_local_services_v2',
  DEVELOPERS: 'cc_developers_v2',
  RESOURCES: 'cc_resources_v2',
  DISCUSSIONS: 'cc_discussions_v2',
  COMMENTS: 'cc_comments_v2',
  PLACES: 'cc_places_v2',
  NOTIFICATIONS: 'cc_notifications_v2',
  ACTIVITY_LOGS: 'cc_activity_logs_v2',
  ABOUT_CONTENT: 'cc_about_content_v2'
};

// Simple event dispatcher for real-time reactivity across tabs/components
const notifyChange = (key, data) => {
  window.dispatchEvent(new CustomEvent('campus_connect_update', { detail: { key, data } }));
};

const getFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyChange(key, value);
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
    return false;
  }
};

// Initialize default data if not already present
export const initStorage = () => {
  let users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  // Ensure rishiadmin is always present as the administrator account
  const adminIndex = users.findIndex(u => u.role === 'admin' || u.username === 'rishiadmin');
  const adminData = {
    id: 'usr-admin-1',
    fullName: 'Rishikesh Gopal (Administrator)',
    username: 'rishiadmin',
    rollNumber: 'rishiadmin',
    collegeEmail: 'rishiadmin@diu.iiitvadodara.ac.in',
    phoneNumber: '+91 2875 252011',
    stream: 'Admin',
    branch: 'Administration',
    batchYear: '2023',
    semester: 'Administration',
    batch: 'Campus Admin Control',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Lead Platform Administrator & System Moderator, IIIT Vadodara International Campus Diu.',
    notificationPrefs: { email: true, announcements: true, community: true, lostFound: true }
  };
  if (adminIndex >= 0) {
    users[adminIndex] = { ...users[adminIndex], ...adminData };
  } else {
    users.push(adminData);
  }
  saveToStorage(STORAGE_KEYS.USERS, users);

  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROUTINES)) {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(INITIAL_ROUTINES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOST_FOUND)) {
    localStorage.setItem(STORAGE_KEYS.LOST_FOUND, JSON.stringify(INITIAL_LOST_FOUND));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSPORT)) {
    localStorage.setItem(STORAGE_KEYS.TRANSPORT, JSON.stringify(INITIAL_TRANSPORT));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCAL_SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_SERVICES, JSON.stringify(LOCAL_SERVICES_CONTACTS));
  }
  const storedDevs = getFromStorage(STORAGE_KEYS.DEVELOPERS, null);
  if (!storedDevs || !Array.isArray(storedDevs) || storedDevs.length === 0) {
    saveToStorage(STORAGE_KEYS.DEVELOPERS, INITIAL_DEVELOPERS);
  } else {
    // Ensure all 3 developers are updated with rollNumber, batch, and quotes
    INITIAL_DEVELOPERS.forEach(initDev => {
      const existing = storedDevs.find(d => d.id === initDev.id || (d.name && d.name.toLowerCase() === initDev.name.toLowerCase()));
      if (existing) {
        if (!existing.rollNumber) existing.rollNumber = initDev.rollNumber;
        if (!existing.batch) existing.batch = initDev.batch;
        if (!existing.quote) existing.quote = initDev.quote;
        if (initDev.email) existing.email = initDev.email;
        if (initDev.contactPhone) existing.contactPhone = initDev.contactPhone;
        if (initDev.role) existing.role = initDev.role;
        if (!existing.avatar) existing.avatar = initDev.avatar;
      } else {
        storedDevs.push(initDev);
      }
    });
    saveToStorage(STORAGE_KEYS.DEVELOPERS, storedDevs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(INITIAL_RESOURCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISCUSSIONS)) {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(INITIAL_DISCUSSIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLACES)) {
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(INITIAL_PLACES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ABOUT_CONTENT)) {
    localStorage.setItem(STORAGE_KEYS.ABOUT_CONTENT, JSON.stringify(INITIAL_ABOUT_CONTENT));
  }

  // Non-blocking background sync from Supabase if credentials are present
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      storageService.syncFromSupabase().catch(err => {
        console.warn('[Supabase Sync Notice]:', err.message);
      });
    }, 150);
  }
};

export const storageService = {
  init: initStorage,

  // ================= AUTH & USER SERVICES =================
  login(emailOrRoll, password) {
    let users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const cleanedIdentifier = (emailOrRoll || '').trim().toLowerCase();

    // Check credentials: match email, rollNumber, username, or 'rishiadmin' / 'admin'
    let found = users.find(u => 
      (u.collegeEmail && u.collegeEmail.toLowerCase() === cleanedIdentifier) || 
      (u.rollNumber && u.rollNumber.toLowerCase() === cleanedIdentifier) ||
      (u.username && u.username.toLowerCase() === cleanedIdentifier) ||
      (cleanedIdentifier === 'rishiadmin' && u.role === 'admin') ||
      (cleanedIdentifier === 'admin' && u.role === 'admin')
    );

    // If logging in as rishiadmin or admin, ensure the admin user exists
    if (!found && (cleanedIdentifier === 'rishiadmin' || cleanedIdentifier === 'admin' || cleanedIdentifier === 'admin@diu.iiitvadodara.ac.in')) {
      found = {
        id: 'usr-admin-1',
        fullName: 'Rishikesh Gopal (Administrator)',
        username: 'rishiadmin',
        rollNumber: 'rishiadmin',
        collegeEmail: 'rishiadmin@diu.iiitvadodara.ac.in',
        phoneNumber: '+91 2875 252011',
        stream: 'Admin',
        branch: 'Administration',
        batchYear: '2023',
        semester: 'Administration',
        batch: 'Campus Admin Control',
        role: 'admin',
        status: 'active',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Lead Platform Administrator & System Moderator, IIIT Vadodara International Campus Diu.',
        notificationPrefs: { email: true, announcements: true, community: true, lostFound: true }
      };
      users.push(found);
      saveToStorage(STORAGE_KEYS.USERS, users);
    }

    if (!found) {
      throw new Error('No account found with this email, roll number, or admin ID.');
    }

    if (found.status === 'disabled') {
      throw new Error('Your account has been deactivated by the administrator.');
    }

    // Verify passwords
    if (found.role === 'admin') {
      const validAdminPasswords = ['rishi202311072@', 'rishi202311072@..', 'admin123'];
      const isCustomMatch = found.customPassword && found.customPassword === password;
      if (!validAdminPasswords.includes(password) && !isCustomMatch) {
        throw new Error('Invalid administrator password. Please check your credentials.');
      }
    } else {
      if (password !== 'student123' && found.customPassword !== password) {
        throw new Error('Invalid password. Please enter the password you registered with.');
      }
    }

    const mockToken = `jwt-token-${found.id}-${Date.now()}`;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, found);
    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, mockToken);
    
    this.addActivityLog('User Logged In', found.fullName, found.role, 'Session started', 'Authentication');
    return { user: found, token: mockToken };
  },

  register(userData) {
    const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const emailExists = users.some(u => u.collegeEmail.toLowerCase() === userData.collegeEmail.trim().toLowerCase());
    if (emailExists) {
      throw new Error('An account with this college email already exists.');
    }
    const rollExists = users.some(u => u.rollNumber.toLowerCase() === userData.rollNumber.trim().toLowerCase());
    if (rollExists) {
      throw new Error('An account with this roll number already exists.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName.trim(),
      rollNumber: userData.rollNumber.trim(),
      collegeEmail: userData.collegeEmail.trim(),
      phoneNumber: userData.phoneNumber.trim(),
      semester: userData.semester || 'Semester 4',
      stream: userData.stream || 'B.Tech',
      branch: userData.branch || 'CSE',
      batchYear: userData.batchYear || '2023',
      batch: userData.batch || 'B.Tech CSE 2023',
      role: 'student',
      status: 'active',
      avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.fullName)}&backgroundColor=111111&textColor=b7f34a`,
      bio: userData.bio || 'IIITV-ICD Student',
      customPassword: userData.password,
      notificationPrefs: { email: true, announcements: true, community: true, lostFound: true }
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Auto login
    const mockToken = `jwt-token-${newUser.id}-${Date.now()}`;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    saveToStorage(STORAGE_KEYS.AUTH_TOKEN, mockToken);

    // Push new student profile to Supabase
    supabaseSyncService.upsert('profiles', {
      id: newUser.id,
      full_name: newUser.fullName,
      roll_number: newUser.rollNumber,
      college_email: newUser.collegeEmail,
      phone_number: newUser.phoneNumber,
      stream: newUser.stream || 'B.Tech',
      branch: newUser.branch || 'CSE',
      batch_year: newUser.batchYear || '2023',
      batch: newUser.batch,
      semester: newUser.semester,
      role: newUser.role,
      status: newUser.status,
      custom_password: newUser.customPassword
    });

    this.addActivityLog('Student Registered', newUser.fullName, 'student', `Roll: ${newUser.rollNumber}`, 'User Management');
    return { user: newUser, token: mockToken };
  },

  getCurrentUser() {
    return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    notifyChange('cc_auth_logout', null);
  },

  updateProfile(userId, updates) {
    const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found.');

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    saveToStorage(STORAGE_KEYS.USERS, users);

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
    return updatedUser;
  },

  getUsers() {
    return getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  toggleUserStatus(userId) {
    const users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found.');
    user.status = user.status === 'active' ? 'disabled' : 'active';
    saveToStorage(STORAGE_KEYS.USERS, users);
    return user;
  },

  deleteUser(userId) {
    let users = getFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    users = users.filter(u => u.id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return true;
  },

  // ================= ANNOUNCEMENTS =================
  getAnnouncements() {
    return getFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  createAnnouncement(data) {
    const announcements = this.getAnnouncements();
    const newAnn = {
      id: `ann-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category || 'General',
      targetBranch: data.targetBranch || 'All Branches',
      targetSemester: data.targetSemester || 'All Semesters',
      targetBatch: data.targetBatch || 'All Batches',
      isImportant: !!data.isImportant,
      publishedAt: new Date().toISOString(),
      authorName: data.authorName || 'Campus Administration'
    };
    announcements.unshift(newAnn);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);

    // Also push a global notification for students
    this.addNotification({
      title: `Notice: ${newAnn.title}`,
      message: newAnn.description.slice(0, 100) + '...',
      type: 'announcement',
      link: '/notifications'
    });

    // Persist announcement to Supabase
    supabaseSyncService.upsert('announcements', {
      id: newAnn.id,
      title: newAnn.title,
      description: newAnn.description,
      category: newAnn.category,
      target_branch: newAnn.targetBranch,
      target_semester: newAnn.targetSemester,
      target_batch: newAnn.targetBatch,
      is_important: newAnn.isImportant,
      author_name: newAnn.authorName,
      published_at: newAnn.publishedAt
    });

    this.addActivityLog('Announcement Created', newAnn.authorName, 'admin', newAnn.title, 'Announcements');
    return newAnn;
  },

  updateAnnouncement(id, updates) {
    const announcements = this.getAnnouncements();
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Announcement not found.');
    announcements[index] = { ...announcements[index], ...updates };
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    return announcements[index];
  },

  deleteAnnouncement(id) {
    let announcements = this.getAnnouncements();
    announcements = announcements.filter(a => a.id !== id);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    supabaseSyncService.remove('announcements', id);
    return true;
  },

  // ================= ACADEMIC ROUTINES =================
  getRoutines() {
    const routines = getFromStorage(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
    if (!routines || routines.length < INITIAL_ROUTINES.length) {
      saveToStorage(STORAGE_KEYS.ROUTINES, INITIAL_ROUTINES);
      return INITIAL_ROUTINES;
    }
    return routines;
  },

  createRoutine(data) {
    const routines = this.getRoutines();
    const stream = data.stream || 'B.Tech';
    const branch = data.branch || 'CSE';
    const batchYear = data.batchYear || '2023';
    const newRoutine = {
      id: `rt-${Date.now()}`,
      subject: data.subject,
      code: data.code,
      faculty: data.faculty,
      room: data.room,
      day: data.day,
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type || 'Lecture',
      semester: data.semester || 'Semester 4',
      stream,
      branch,
      batchYear,
      batch: data.batch || `${stream} ${branch} ${batchYear}`
    };
    routines.push(newRoutine);
    saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    // Persist routine to Supabase
    supabaseSyncService.upsert('academic_routines', {
      id: newRoutine.id,
      subject: newRoutine.subject,
      code: newRoutine.code,
      faculty: newRoutine.faculty,
      room: newRoutine.room,
      day: newRoutine.day,
      start_time: newRoutine.startTime,
      end_time: newRoutine.endTime,
      type: newRoutine.type,
      semester: newRoutine.semester,
      stream: newRoutine.stream,
      branch: newRoutine.branch,
      batch_year: newRoutine.batchYear,
      batch: newRoutine.batch
    });

    this.addActivityLog('Routine Added', 'Administrator', 'admin', `${newRoutine.subject} (${newRoutine.branch} ${newRoutine.semester}) on ${newRoutine.day}`, 'Academic');
    return newRoutine;
  },

  updateRoutine(id, updates) {
    const routines = this.getRoutines();
    const index = routines.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Routine not found.');
    routines[index] = { ...routines[index], ...updates };
    saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    return routines[index];
  },

  deleteRoutine(id) {
    let routines = this.getRoutines();
    routines = routines.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    supabaseSyncService.remove('academic_routines', id);
    return true;
  },

  // ================= LOST & FOUND =================
  getLostFound() {
    return getFromStorage(STORAGE_KEYS.LOST_FOUND, INITIAL_LOST_FOUND);
  },

  createLostFound(data) {
    const items = this.getLostFound();
    const newItem = {
      id: `lf-${Date.now()}`,
      title: data.title,
      description: data.description,
      type: data.type || 'lost',
      category: data.category || 'General',
      location: data.location,
      date: data.date || new Date().toISOString().split('T')[0],
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      imageUrl: data.imageUrl || (data.type === 'lost' 
        ? 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80'),
      status: 'open',
      reportedBy: data.reportedBy || 'usr-student-1',
      createdAt: new Date().toISOString()
    };
    items.unshift(newItem);
    saveToStorage(STORAGE_KEYS.LOST_FOUND, items);

    // Persist lost/found report to Supabase
    supabaseSyncService.upsert('lost_found_items', {
      id: newItem.id,
      title: newItem.title,
      description: newItem.description,
      type: newItem.type,
      category: newItem.category,
      location: newItem.location,
      date: newItem.date,
      contact_name: newItem.contactName,
      contact_phone: newItem.contactPhone,
      contact_email: newItem.contactEmail,
      image_url: newItem.imageUrl,
      reported_by: newItem.reportedBy,
      is_resolved: false
    });

    this.addActivityLog(
      newItem.type === 'lost' ? 'Lost Item Reported' : 'Found Item Reported',
      newItem.contactName,
      'student',
      newItem.title,
      'Lost & Found'
    );
    return newItem;
  },

  updateLostFound(id, updates) {
    const items = this.getLostFound();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found.');
    items[index] = { ...items[index], ...updates };
    saveToStorage(STORAGE_KEYS.LOST_FOUND, items);
    return items[index];
  },

  toggleResolveLostFound(id) {
    const items = this.getLostFound();
    const item = items.find(i => i.id === id);
    if (!item) throw new Error('Item not found.');
    item.status = item.status === 'resolved' ? 'open' : 'resolved';
    saveToStorage(STORAGE_KEYS.LOST_FOUND, items);
    return item;
  },

  deleteLostFound(id) {
    let items = this.getLostFound();
    items = items.filter(i => i.id !== id);
    saveToStorage(STORAGE_KEYS.LOST_FOUND, items);
    supabaseSyncService.remove('lost_found_items', id);
    return true;
  },

  // ================= TRANSPORT =================
  getTransport() {
    return getFromStorage(STORAGE_KEYS.TRANSPORT, INITIAL_TRANSPORT);
  },

  getGovtBusData() {
    return GOVT_BUS_DATA;
  },

  getLocalServices() {
    return getFromStorage(STORAGE_KEYS.LOCAL_SERVICES, LOCAL_SERVICES_CONTACTS);
  },

  createLocalService(data) {
    const services = this.getLocalServices();
    const newService = {
      id: `srv-${Date.now()}`,
      category: data.category || 'General Services',
      name: data.name,
      phone: data.phone,
      type: data.type || '',
      coverage: data.coverage || 'Kevdi Campus & Diu',
      badge: data.badge || '',
      notes: data.notes || ''
    };
    services.push(newService);
    saveToStorage(STORAGE_KEYS.LOCAL_SERVICES, services);
    return newService;
  },

  updateLocalService(id, updates) {
    const services = this.getLocalServices();
    const index = services.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service contact not found.');
    services[index] = { ...services[index], ...updates };
    saveToStorage(STORAGE_KEYS.LOCAL_SERVICES, services);
    return services[index];
  },

  deleteLocalService(id) {
    let services = this.getLocalServices();
    services = services.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.LOCAL_SERVICES, services);
    return true;
  },

  createTransport(data) {
    const routes = this.getTransport();
    const newRoute = {
      id: `tr-${Date.now()}`,
      routeName: data.routeName,
      source: data.source,
      destination: data.destination,
      stops: Array.isArray(data.stops) ? data.stops : (data.stops || '').split(',').map(s => s.trim()).filter(Boolean),
      departureTime: data.departureTime,
      frequency: data.frequency || 'Regular Schedule',
      busNumber: data.busNumber || 'DD-02-Campus',
      driverName: data.driverName || 'Staff Driver',
      driverContact: data.driverContact || '+91 2875 252000',
      daysOfOperation: data.daysOfOperation || 'Monday – Saturday',
      isDemo: !!data.isDemo,
      notes: data.notes || ''
    };
    routes.push(newRoute);
    saveToStorage(STORAGE_KEYS.TRANSPORT, routes);
    return newRoute;
  },

  updateTransport(id, updates) {
    const routes = this.getTransport();
    const index = routes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Route not found.');
    routes[index] = { ...routes[index], ...updates };
    saveToStorage(STORAGE_KEYS.TRANSPORT, routes);
    return routes[index];
  },

  deleteTransport(id) {
    let routes = this.getTransport();
    routes = routes.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.TRANSPORT, routes);
    return true;
  },

  // ================= RESOURCES =================
  getResources() {
    return getFromStorage(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  },

  createResource(data) {
    const resources = this.getResources();
    const newRes = {
      id: data.id || `res-${Date.now()}`,
      title: data.title,
      subject: data.subject,
      semester: data.semester || 'Semester 4',
      category: data.category || 'Study Materials',
      description: data.description || '',
      academic_year: data.academic_year || data.examYear || data.year || '2025',
      examYear: data.academic_year || data.examYear || data.year || '2025',
      fileName: data.fileName || data.file_name || `${data.title.replace(/\s+/g, '_')}.pdf`,
      filePath: data.filePath || data.file_path || '',
      fileType: data.fileType || data.file_type || 'application/pdf',
      fileSize: data.fileSize || data.file_size || '520 KB',
      fileBytes: data.fileBytes || data.file_bytes || 524288,
      fileContent: data.fileContent || `CAMPUS CONNECT RESOURCE ARCHIVE\nTitle: ${data.title}\nSubject: ${data.subject}\nContributed by: ${data.uploaderName || data.uploader_name}\nDate: ${new Date().toLocaleDateString()}\n\n${data.description}`,
      uploadedBy: data.uploadedBy || data.uploaded_by || 'usr-student-1',
      uploaded_by: data.uploaded_by || data.uploadedBy || 'usr-student-1',
      uploaderName: data.uploaderName || data.uploader_name || 'Student Contributor',
      uploader_name: data.uploader_name || data.uploaderName || 'Student Contributor',
      uploader_role: data.uploader_role || 'student',
      downloadCount: data.downloadCount || 0,
      download_count: data.download_count || 0,
      createdAt: data.createdAt || new Date().toISOString(),
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    resources.unshift(newRes);
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);

    this.addActivityLog('Resource Uploaded', newRes.uploaderName, 'student', newRes.title, 'Resources');
    return newRes;
  },

  updateResource(id, updates) {
    const resources = this.getResources();
    const index = resources.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Resource not found.');
    resources[index] = { ...resources[index], ...updates };
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);
    return resources[index];
  },

  incrementDownload(id) {
    const resources = this.getResources();
    const res = resources.find(r => r.id === id);
    if (res) {
      res.downloadCount = (res.downloadCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.RESOURCES, resources);
    }
    return res;
  },

  deleteResource(id) {
    let resources = this.getResources();
    resources = resources.filter(r => r.id !== id);
    saveToStorage(STORAGE_KEYS.RESOURCES, resources);
    return true;
  },

  // ================= COMMUNITY DISCUSSIONS =================
  getDiscussions() {
    return getFromStorage(STORAGE_KEYS.DISCUSSIONS, INITIAL_DISCUSSIONS);
  },

  createDiscussion(data) {
    const discussions = this.getDiscussions();
    const newDisc = {
      id: `disc-${Date.now()}`,
      title: data.title,
      content: data.content,
      category: data.category || 'General Questions',
      authorId: data.authorId || 'usr-student-1',
      authorName: data.authorName || 'Student',
      authorRoll: data.authorRoll || '202351001',
      authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    discussions.unshift(newDisc);
    saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);

    this.addActivityLog('Discussion Started', newDisc.authorName, 'student', newDisc.title, 'Community');
    return newDisc;
  },

  toggleLike(discussionId, userId) {
    const discussions = this.getDiscussions();
    const disc = discussions.find(d => d.id === discussionId);
    if (!disc) throw new Error('Discussion not found.');

    const alreadyLiked = disc.likes.includes(userId);
    if (alreadyLiked) {
      disc.likes = disc.likes.filter(id => id !== userId);
    } else {
      disc.likes.push(userId);
    }
    saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
    return { likesCount: disc.likes.length, isLiked: !alreadyLiked };
  },

  deleteDiscussion(id) {
    let discussions = this.getDiscussions();
    discussions = discussions.filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
    // Also delete child comments
    let comments = getFromStorage(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    comments = comments.filter(c => c.discussionId !== id);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);
    return true;
  },

  // ================= COMMENTS =================
  getComments(discussionId) {
    const comments = getFromStorage(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    return comments.filter(c => c.discussionId === discussionId);
  },

  addComment(data) {
    const comments = getFromStorage(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const newComment = {
      id: `com-${Date.now()}`,
      discussionId: data.discussionId,
      authorId: data.authorId || 'usr-student-1',
      authorName: data.authorName || 'Student',
      authorRoll: data.authorRoll || '202351001',
      authorAvatar: data.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: data.content,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);

    // Update parent discussion comments count
    const discussions = this.getDiscussions();
    const disc = discussions.find(d => d.id === data.discussionId);
    if (disc) {
      disc.commentsCount = (disc.commentsCount || 0) + 1;
      saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
    }
    return newComment;
  },

  deleteComment(commentId) {
    let comments = getFromStorage(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
    const target = comments.find(c => c.id === commentId);
    if (target) {
      comments = comments.filter(c => c.id !== commentId);
      saveToStorage(STORAGE_KEYS.COMMENTS, comments);

      const discussions = this.getDiscussions();
      const disc = discussions.find(d => d.id === target.discussionId);
      if (disc && disc.commentsCount > 0) {
        disc.commentsCount -= 1;
        saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
      }
    }
    return true;
  },

  // ================= PLACES (EXPLORE) =================
  getPlaces() {
    const places = getFromStorage(STORAGE_KEYS.PLACES, INITIAL_PLACES);
    if (!places || places.length < INITIAL_PLACES.length) {
      saveToStorage(STORAGE_KEYS.PLACES, INITIAL_PLACES);
      return INITIAL_PLACES;
    }
    return places;
  },

  createPlace(data) {
    const places = this.getPlaces();
    const newPlace = {
      id: `plc-${Date.now()}`,
      name: data.name,
      category: data.category || 'Academic Buildings',
      description: data.description,
      location: data.location || 'Education Hub, Kevdi, Diu',
      openingHours: data.openingHours || '08:00 AM – 08:00 PM',
      imageUrl: data.imageUrl || '/images/campus/campus-main.jpg',
      mapUrl: data.mapUrl || 'https://maps.google.com/?q=Education+Hub+Diu',
      isVerified: !!data.isVerified,
      features: Array.isArray(data.features) ? data.features : (data.features || '').split(',').map(f => f.trim()).filter(Boolean)
    };
    places.push(newPlace);
    saveToStorage(STORAGE_KEYS.PLACES, places);
    return newPlace;
  },

  updatePlace(id, updates) {
    const places = this.getPlaces();
    const index = places.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Place not found.');
    places[index] = { ...places[index], ...updates };
    saveToStorage(STORAGE_KEYS.PLACES, places);
    return places[index];
  },

  deletePlace(id) {
    let places = this.getPlaces();
    places = places.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PLACES, places);
    return true;
  },

  // ================= NOTIFICATIONS =================
  getNotifications(userId) {
    const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    if (!userId) return list;
    return list.filter(n => !n.userId || n.userId === userId);
  },

  markNotificationRead(id) {
    const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    }
    return item;
  },

  markAllNotificationsRead(userId) {
    const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    list.forEach(n => {
      if (!userId || n.userId === userId) {
        n.isRead = true;
      }
    });
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    return true;
  },

  addNotification(notifData) {
    const list = getFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif = {
      id: `ntf-${Date.now()}`,
      userId: notifData.userId || null,
      title: notifData.title,
      message: notifData.message,
      type: notifData.type || 'system',
      link: notifData.link || '/dashboard',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    return newNotif;
  },

  // ================= ACTIVITY LOGS & REPORTS =================
  getActivityLogs() {
    return getFromStorage(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
  },

  addActivityLog(action, actorName, actorRole, details, targetModule) {
    const logs = this.getActivityLogs();
    const newLog = {
      id: `act-${Date.now()}`,
      action,
      actorName,
      actorRole,
      details,
      targetModule,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep last 100 logs
    if (logs.length > 100) logs.pop();
    saveToStorage(STORAGE_KEYS.ACTIVITY_LOGS, logs);
    return newLog;
  },

  // ================= DEVELOPERS & TEAM =================
  getDevelopers() {
    return getFromStorage(STORAGE_KEYS.DEVELOPERS, INITIAL_DEVELOPERS);
  },

  createDeveloper(data) {
    const devs = this.getDevelopers();
    const newDev = {
      id: `dev-${Date.now()}`,
      name: data.name,
      role: data.role || 'Platform Developer',
      year: data.year || 'B.Tech CSE (2023-2027)',
      batch: data.batch || 'B.Tech CSE 2023-2027',
      rollNumber: data.rollNumber || '',
      quote: data.quote || '',
      contactPhone: data.contactPhone || '8340574363',
      email: data.email || 'developer@diu.iiitvadodara.ac.in',
      isLead: !!data.isLead,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: data.bio || ''
    };
    devs.push(newDev);
    saveToStorage(STORAGE_KEYS.DEVELOPERS, devs);
    this.addActivityLog('Developer Added', 'Administrator', 'admin', newDev.name, 'Platform Team');
    return newDev;
  },

  updateDeveloper(id, updates) {
    const devs = this.getDevelopers();
    const index = devs.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Developer not found.');
    devs[index] = { ...devs[index], ...updates };
    saveToStorage(STORAGE_KEYS.DEVELOPERS, devs);
    return devs[index];
  },

  deleteDeveloper(id) {
    let devs = this.getDevelopers();
    devs = devs.filter(d => d.id !== id);
    saveToStorage(STORAGE_KEYS.DEVELOPERS, devs);
    return true;
  },

  // ================= ABOUT US & WEBSITE CONTROLLER =================
  getAboutContent() {
    const content = getFromStorage(STORAGE_KEYS.ABOUT_CONTENT, INITIAL_ABOUT_CONTENT);
    if (!content || !content.controller) {
      saveToStorage(STORAGE_KEYS.ABOUT_CONTENT, INITIAL_ABOUT_CONTENT);
      return INITIAL_ABOUT_CONTENT;
    }
    return content;
  },

  updateAboutContent(updates) {
    const current = this.getAboutContent();
    const updated = {
      ...current,
      ...updates,
      controller: {
        ...current.controller,
        ...(updates.controller || {})
      },
      hero: {
        ...current.hero,
        ...(updates.hero || {})
      },
      vision: {
        ...current.vision,
        ...(updates.vision || {})
      },
      scope: {
        ...current.scope,
        ...(updates.scope || {})
      },
      showcaseImages: updates.showcaseImages || current.showcaseImages,
      benefits: updates.benefits || current.benefits
    };

    saveToStorage(STORAGE_KEYS.ABOUT_CONTENT, updated);
    this.addActivityLog('About Page Updated', 'Administrator', 'admin', 'Website Controller & About Content Modified', 'About Us');

    // Async sync to Supabase
    supabaseSyncService.upsert('about_content', {
      id: 'about-main-content',
      controller: updated.controller,
      hero: updated.hero,
      vision: updated.vision,
      scope: updated.scope,
      showcase_images: updated.showcaseImages,
      benefits: updated.benefits
    });

    return updated;
  },

  // ================= SUPABASE CLOUD DATABASE SYNC =================
  async syncFromSupabase() {
    if (!supabaseSyncService.isConfigured()) return false;

    try {
      // 1. Fetch routines
      const remoteRoutines = await supabaseSyncService.fetchAll('academic_routines', 'created_at', true);
      if (remoteRoutines && remoteRoutines.length > 0) {
        const mapped = remoteRoutines.map(r => ({
          id: r.id,
          subject: r.subject,
          code: r.code,
          faculty: r.faculty,
          room: r.room,
          day: r.day,
          startTime: r.start_time,
          endTime: r.end_time,
          type: r.type,
          semester: r.semester,
          stream: r.stream,
          branch: r.branch,
          batchYear: r.batch_year,
          batch: r.batch
        }));
        saveToStorage(STORAGE_KEYS.ROUTINES, mapped);
      }

      // 2. Fetch announcements
      const remoteAnnouncements = await supabaseSyncService.fetchAll('announcements', 'published_at', false);
      if (remoteAnnouncements && remoteAnnouncements.length > 0) {
        const mapped = remoteAnnouncements.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          category: a.category,
          targetBranch: a.target_branch,
          targetSemester: a.target_semester,
          targetBatch: a.target_batch,
          isImportant: a.is_important,
          publishedAt: a.published_at,
          authorName: a.author_name
        }));
        saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, mapped);
      }

      // 3. Fetch lost & found
      const remoteLost = await supabaseSyncService.fetchAll('lost_found_items', 'created_at', false);
      if (remoteLost && remoteLost.length > 0) {
        const mapped = remoteLost.map(l => ({
          id: l.id,
          title: l.title,
          description: l.description,
          type: l.type,
          category: l.category,
          location: l.location,
          date: l.date,
          contactName: l.contact_name,
          contactPhone: l.contact_phone,
          contactEmail: l.contact_email,
          imageUrl: l.image_url,
          status: l.is_resolved ? 'resolved' : 'open',
          reportedBy: l.reported_by,
          createdAt: l.created_at
        }));
        saveToStorage(STORAGE_KEYS.LOST_FOUND, mapped);
      }

      // 4. Fetch developers
      const remoteDevs = await supabaseSyncService.fetchAll('developers', 'created_at', true);
      if (remoteDevs && remoteDevs.length > 0) {
        const mapped = remoteDevs.map(d => ({
          id: d.id,
          name: d.name,
          role: d.role,
          year: d.year,
          batch: d.batch || 'B.Tech CSE 2023-2027',
          rollNumber: d.roll_number || '',
          quote: d.quote || '',
          contactPhone: d.contact_phone,
          email: d.email,
          isLead: d.is_lead,
          bio: d.bio,
          avatar: d.avatar
        }));
        saveToStorage(STORAGE_KEYS.DEVELOPERS, mapped);
      }

      // 5. Fetch discussions & comments
      const remoteDiscussions = await supabaseSyncService.fetchAll('discussions', 'created_at', false);
      if (remoteDiscussions && remoteDiscussions.length > 0) {
        const mapped = remoteDiscussions.map(d => ({
          id: d.id,
          title: d.title,
          content: d.content,
          category: d.category,
          authorId: d.author_id,
          authorName: d.author_name,
          authorRoll: d.author_roll,
          upvotes: d.upvotes,
          createdAt: d.created_at
        }));
        saveToStorage(STORAGE_KEYS.DISCUSSIONS, mapped);
      }

      const remoteComments = await supabaseSyncService.fetchAll('discussion_comments', 'created_at', true);
      if (remoteComments && remoteComments.length > 0) {
        const mapped = remoteComments.map(c => ({
          id: c.id,
          discussionId: c.discussion_id,
          content: c.content,
          authorId: c.author_id,
          authorName: c.author_name,
          authorRoll: c.author_roll,
          createdAt: c.created_at
        }));
        saveToStorage(STORAGE_KEYS.COMMENTS, mapped);
      }

      return true;
    } catch (err) {
      console.warn('[Supabase Sync Notice]:', err.message);
      return false;
    }
  },

  async syncAllToSupabase(onProgress) {
    if (!supabaseSyncService.isConfigured()) {
      throw new Error('Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured in your .env file.');
    }

    let total = 0;
    // 1. Routines
    const routines = this.getRoutines();
    if (onProgress) onProgress(`Syncing ${routines.length} routines...`, 15);
    for (const r of routines) {
      await supabaseSyncService.upsert('academic_routines', {
        id: r.id,
        subject: r.subject,
        code: r.code,
        faculty: r.faculty,
        room: r.room,
        day: r.day,
        start_time: r.startTime,
        end_time: r.endTime,
        type: r.type,
        semester: r.semester,
        stream: r.stream || 'B.Tech',
        branch: r.branch || 'CSE',
        batch_year: r.batchYear || '2023',
        batch: r.batch || `${r.stream || 'B.Tech'} ${r.branch || 'CSE'} ${r.batchYear || '2023'}`
      });
      total++;
    }

    // 2. Announcements
    const announcements = this.getAnnouncements();
    if (onProgress) onProgress(`Syncing ${announcements.length} announcements...`, 30);
    for (const a of announcements) {
      await supabaseSyncService.upsert('announcements', {
        id: a.id,
        title: a.title,
        description: a.description,
        category: a.category,
        target_branch: a.targetBranch,
        target_semester: a.targetSemester,
        target_batch: a.targetBatch,
        is_important: a.isImportant,
        author_name: a.authorName,
        published_at: a.publishedAt
      });
      total++;
    }

    // 3. Lost & Found
    const lost = this.getLostFound();
    if (onProgress) onProgress(`Syncing ${lost.length} lost & found items...`, 45);
    for (const l of lost) {
      await supabaseSyncService.upsert('lost_found_items', {
        id: l.id,
        title: l.title,
        description: l.description,
        type: l.type,
        category: l.category,
        location: l.location,
        date: l.date,
        contact_name: l.contactName,
        contact_phone: l.contactPhone,
        contact_email: l.contactEmail,
        image_url: l.imageUrl,
        reported_by: l.reportedBy,
        is_resolved: l.status === 'resolved'
      });
      total++;
    }

    // 4. Developers
    const devs = this.getDevelopers();
    if (onProgress) onProgress(`Syncing ${devs.length} developer profiles...`, 60);
    for (const d of devs) {
      await supabaseSyncService.upsert('developers', {
        id: d.id,
        name: d.name,
        role: d.role,
        year: d.year,
        batch: d.batch || 'B.Tech CSE 2023-2027',
        roll_number: d.rollNumber || '',
        quote: d.quote || '',
        contact_phone: d.contactPhone,
        email: d.email,
        is_lead: d.isLead,
        bio: d.bio,
        avatar: d.avatar
      });
      total++;
    }

    // 5. Places
    const places = this.getPlaces();
    if (onProgress) onProgress(`Syncing ${places.length} Diu spots...`, 75);
    for (const p of places) {
      await supabaseSyncService.upsert('places', {
        id: p.id,
        name: p.name,
        category: p.category,
        rating: p.rating,
        reviews: p.reviews,
        description: p.description,
        location: p.location,
        distance_from_kevdi: p.distanceFromKevdi,
        opening_hours: p.openingHours,
        image_url: p.imageUrl,
        map_url: p.mapUrl,
        website_url: p.websiteUrl,
        is_verified: p.isVerified,
        features: p.features
      });
      total++;
    }

    // 6. Transport
    const transport = this.getTransport();
    if (onProgress) onProgress(`Syncing ${transport.length} transit routes...`, 90);
    for (const t of transport) {
      await supabaseSyncService.upsert('transport_routes', {
        id: t.id,
        route_name: t.routeName,
        source: t.source,
        destination: t.destination,
        stops: t.stops,
        departure_time: t.departureTime,
        frequency: t.frequency,
        bus_number: t.busNumber,
        driver_name: t.driverName,
        driver_contact: t.driverContact,
        days_of_operation: t.daysOfOperation,
        notes: t.notes
      });
      total++;
    }

    // 7. Users
    const users = this.getUsers();
    if (onProgress) onProgress(`Syncing registered profiles...`, 98);
    for (const u of users) {
      await supabaseSyncService.upsert('profiles', {
        id: u.id,
        full_name: u.fullName,
        roll_number: u.rollNumber,
        college_email: u.collegeEmail,
        phone_number: u.phoneNumber,
        stream: u.stream,
        branch: u.branch,
        batch_year: u.batchYear,
        batch: u.batch,
        semester: u.semester,
        role: u.role,
        status: u.status,
        avatar_url: u.avatarUrl,
        bio: u.bio,
        notification_prefs: u.notificationPrefs
      });
      total++;
    }

    if (onProgress) onProgress(`All ${total} records successfully synchronized with Supabase!`, 100);
    return { success: true, count: total };
  },

  // ================= GLOBAL SEARCH =================
  searchAll(query) {
    if (!query || query.trim().length === 0) return { total: 0, results: [] };
    const q = query.toLowerCase().trim();

    const announcements = this.getAnnouncements()
      .filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .map(a => ({ type: 'Announcement', title: a.title, subtitle: a.category, link: '/notifications', date: a.publishedAt }));

    const resources = this.getResources()
      .filter(r => r.title.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
      .map(r => ({ type: 'Resource', title: r.title, subtitle: `${r.subject} • ${r.category}`, link: '/resources', date: r.createdAt }));

    const discussions = this.getDiscussions()
      .filter(d => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
      .map(d => ({ type: 'Discussion', title: d.title, subtitle: `By ${d.authorName} • ${d.category}`, link: '/community', date: d.createdAt }));

    const lostFound = this.getLostFound()
      .filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.description.toLowerCase().includes(q))
      .map(l => ({ type: 'Lost & Found', title: l.title, subtitle: `${l.type.toUpperCase()} at ${l.location}`, link: '/lost-found', date: l.date }));

    const places = this.getPlaces()
      .filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
      .map(p => ({ type: 'Explore Location', title: p.name, subtitle: `${p.category} • ${p.location}`, link: '/explore', date: null }));

    const routines = this.getRoutines()
      .filter(r => r.subject.toLowerCase().includes(q) || r.faculty.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
      .map(r => ({ type: 'Academic Class', title: `${r.code}: ${r.subject}`, subtitle: `${r.day} ${r.startTime} • ${r.room}`, link: '/academic', date: null }));

    const results = [
      ...announcements,
      ...resources,
      ...discussions,
      ...lostFound,
      ...places,
      ...routines
    ];

    return { total: results.length, results };
  }
};

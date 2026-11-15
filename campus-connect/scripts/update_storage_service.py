import re

with open('campus-connect/frontend/src/services/storageService.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add import for supabaseSyncService
if "import { supabaseSyncService }" not in code:
    code = code.replace(
        "import {\n  INITIAL_USERS,",
        "import { supabaseSyncService } from './supabaseSyncService.js';\nimport {\n  INITIAL_USERS,"
    )

# 2. Add background sync call in initStorage
if "storageService.syncFromSupabase()" not in code:
    init_marker = "if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {\n    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(INITIAL_ACTIVITY_LOGS));\n  }"
    replacement = init_marker + """\n
  // Non-blocking background sync from Supabase if credentials are present
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      storageService.syncFromSupabase().catch(err => {
        console.warn('[Supabase Sync Notice]:', err.message);
      });
    }, 150);
  }"""
    code = code.replace(init_marker, replacement)

# 3. Add Supabase sync calls to register
reg_target = "this.addActivityLog('Student Registered', newUser.fullName, 'student', `Roll: ${newUser.rollNumber}`, 'User Management');"
if "supabaseSyncService.upsert('profiles'" not in code:
    reg_replacement = """// Push new student profile to Supabase
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
    });\n\n    """ + reg_target
    code = code.replace(reg_target, reg_replacement)

# 4. Add Supabase sync call to updateProfile
prof_target = "this.addActivityLog('Profile Updated', updatedUser.fullName, updatedUser.role, 'Profile details modified', 'User Management');"
if "supabaseSyncService.upsert('profiles', {" not in code:
    prof_replacement = """// Sync profile changes to Supabase
    supabaseSyncService.upsert('profiles', {
      id: updatedUser.id,
      full_name: updatedUser.fullName,
      roll_number: updatedUser.rollNumber,
      college_email: updatedUser.collegeEmail,
      phone_number: updatedUser.phoneNumber,
      stream: updatedUser.stream,
      branch: updatedUser.branch,
      batch_year: updatedUser.batchYear,
      batch: updatedUser.batch,
      semester: updatedUser.semester,
      role: updatedUser.role,
      status: updatedUser.status,
      avatar_url: updatedUser.avatarUrl,
      bio: updatedUser.bio,
      notification_prefs: updatedUser.notificationPrefs
    });\n\n    """ + prof_target
    code = code.replace(prof_target, prof_replacement)

# 5. Add Supabase sync call to createAnnouncement
ann_target = "this.addActivityLog('Announcement Created', newAnn.authorName, 'admin', newAnn.title, 'Announcements');"
if "supabaseSyncService.upsert('announcements'" not in code:
    ann_replacement = """// Persist announcement to Supabase
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
    });\n\n    """ + ann_target
    code = code.replace(ann_target, ann_replacement)

# 6. Add Supabase sync call to updateAnnouncement
update_ann_target = "saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);\n    return announcements[index];"
if "supabaseSyncService.upsert('announcements', {" not in code:
    update_ann_replacement = """saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    const updatedAnn = announcements[index];
    supabaseSyncService.upsert('announcements', {
      id: updatedAnn.id,
      title: updatedAnn.title,
      description: updatedAnn.description,
      category: updatedAnn.category,
      target_branch: updatedAnn.targetBranch,
      target_semester: updatedAnn.targetSemester,
      target_batch: updatedAnn.targetBatch,
      is_important: updatedAnn.isImportant,
      author_name: updatedAnn.authorName,
      published_at: updatedAnn.publishedAt
    });
    return announcements[index];"""
    code = code.replace(update_ann_target, update_ann_replacement)

# 7. Add Supabase sync call to deleteAnnouncement
del_ann_target = "saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);\n    return true;"
if "supabaseSyncService.remove('announcements', id);" not in code:
    del_ann_replacement = """saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    supabaseSyncService.remove('announcements', id);
    return true;"""
    code = code.replace(del_ann_target, del_ann_replacement)

# 8. Add Supabase sync call to createRoutine
rt_target = "this.addActivityLog('Routine Added', 'Administrator', 'admin', `${newRoutine.subject} (${newRoutine.branch} ${newRoutine.semester}) on ${newRoutine.day}`, 'Academic');"
if "supabaseSyncService.upsert('academic_routines'" not in code:
    rt_replacement = """// Persist routine to Supabase
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
    });\n\n    """ + rt_target
    code = code.replace(rt_target, rt_replacement)

# 9. Add Supabase sync call to updateRoutine
update_rt_target = "saveToStorage(STORAGE_KEYS.ROUTINES, routines);\n    return routines[index];"
if "supabaseSyncService.upsert('academic_routines', {" not in code:
    update_rt_replacement = """saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    const updatedRt = routines[index];
    supabaseSyncService.upsert('academic_routines', {
      id: updatedRt.id,
      subject: updatedRt.subject,
      code: updatedRt.code,
      faculty: updatedRt.faculty,
      room: updatedRt.room,
      day: updatedRt.day,
      start_time: updatedRt.startTime,
      end_time: updatedRt.endTime,
      type: updatedRt.type,
      semester: updatedRt.semester,
      stream: updatedRt.stream,
      branch: updatedRt.branch,
      batch_year: updatedRt.batchYear,
      batch: updatedRt.batch
    });
    return routines[index];"""
    code = code.replace(update_rt_target, update_rt_replacement)

# 10. Add Supabase sync call to deleteRoutine
del_rt_target = "saveToStorage(STORAGE_KEYS.ROUTINES, routines);\n    return true;"
if "supabaseSyncService.remove('academic_routines', id);" not in code:
    del_rt_replacement = """saveToStorage(STORAGE_KEYS.ROUTINES, routines);
    supabaseSyncService.remove('academic_routines', id);
    return true;"""
    code = code.replace(del_rt_target, del_rt_replacement)

# 11. Add Supabase sync call to createLostFound
lf_target = "this.addActivityLog(\n      newItem.type === 'lost' ? 'Lost Item Reported' : 'Found Item Reported',"
if "supabaseSyncService.upsert('lost_found_items'" not in code:
    lf_replacement = """// Persist lost/found report to Supabase
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
    });\n\n    """ + lf_target
    code = code.replace(lf_target, lf_replacement)

# 12. Add Supabase sync call to deleteLostFound
del_lf_target = "saveToStorage(STORAGE_KEYS.LOST_FOUND, items);\n    return true;"
if "supabaseSyncService.remove('lost_found_items', id);" not in code:
    del_lf_replacement = """saveToStorage(STORAGE_KEYS.LOST_FOUND, items);
    supabaseSyncService.remove('lost_found_items', id);
    return true;"""
    code = code.replace(del_lf_target, del_lf_replacement)

# 13. Add syncFromSupabase and syncAllToSupabase methods before searchAll
search_target = "searchAll(query) {"
sync_methods = """// ================= SUPABASE CLOUD DATABASE SYNC =================
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

  """
if "syncFromSupabase()" not in code:
    code = code.replace(search_target, sync_methods + search_target)

with open('campus-connect/frontend/src/services/storageService.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated storageService.js successfully!")


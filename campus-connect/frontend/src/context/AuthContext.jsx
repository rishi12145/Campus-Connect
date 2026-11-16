import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile from Supabase by user_id or email
  const fetchSupabaseProfile = async (authUserId, email) => {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      if (authUserId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUserId)
          .maybeSingle();
        if (data && !error) return data;
      }
      if (email) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .ilike('college_email', email)
          .maybeSingle();
        if (data && !error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Profile fetch warning:', err.message);
    }
    return null;
  };

  // Helper to assemble normalized user object preserving registration semester
  const buildAppUser = (authUser, profile, overrideData = {}) => {
    if (!authUser && !profile) return null;
    const meta = authUser?.user_metadata || {};

    const effectiveSemester = overrideData.semester || meta.semester || profile?.semester || 'Semester 4';
    const effectiveBranch = overrideData.branch || meta.branch || profile?.branch || 'CSE';
    const effectiveStream = overrideData.stream || meta.stream || profile?.stream || 'B.Tech';
    const effectiveBatchYear = overrideData.batchYear || meta.batch_year || profile?.batch_year || profile?.batchYear || '2023';
    const effectiveBatch = overrideData.batch || meta.batch || profile?.batch || `${effectiveStream} ${effectiveBranch} ${effectiveBatchYear}`;
    const effectiveFullName = overrideData.fullName || profile?.full_name || profile?.fullName || meta.full_name || authUser?.email?.split('@')[0] || 'Student';
    const effectiveRoll = overrideData.rollNumber || profile?.roll_number || profile?.rollNumber || meta.roll_number || '';
    const effectiveEmail = overrideData.collegeEmail || profile?.college_email || authUser?.email || '';

    // If Supabase profile has outdated semester or missing link, sync in background
    if (profile?.id && isSupabaseConfigured() && supabase) {
      if (profile.semester !== effectiveSemester || (authUser?.id && !profile.user_id)) {
        supabase
          .from('profiles')
          .update({
            semester: effectiveSemester,
            branch: effectiveBranch,
            stream: effectiveStream,
            batch: effectiveBatch,
            batch_year: effectiveBatchYear,
            ...(authUser?.id && !profile.user_id ? { user_id: authUser.id } : {})
          })
          .eq('id', profile.id)
          .catch(() => {});
      }
    }

    return {
      ...(profile || {}),
      id: profile?.id || authUser?.id || `usr-${Date.now()}`,
      user_id: authUser?.id || profile?.user_id,
      email: effectiveEmail,
      collegeEmail: effectiveEmail,
      fullName: effectiveFullName,
      rollNumber: effectiveRoll,
      semester: effectiveSemester,
      branch: effectiveBranch,
      stream: effectiveStream,
      batchYear: effectiveBatchYear,
      batch: effectiveBatch,
      role: profile?.role || meta.role || 'student',
      status: profile?.status || 'active',
      phoneNumber: overrideData.phoneNumber || profile?.phone_number || meta.phone_number || '',
      avatarUrl: profile?.avatar_url || profile?.avatarUrl || meta.avatar_url || '',
      bio: profile?.bio || meta.bio || 'IIITV-ICD Student',
      notificationPrefs: profile?.notification_prefs || profile?.notificationPrefs || meta.notification_prefs || {
        email: true,
        announcements: true,
        community: true,
        lostFound: true
      }
    };
  };

  useEffect(() => {
    if (typeof storageService?.init === 'function') {
      storageService.init();
    }

    let authSubscription = null;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured() && supabase) {
          // 1. Get initial session from Supabase
          const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) {
            console.warn('[AuthContext] Initial session fetch notice:', sessionError.message);
          }

          if (initialSession?.user) {
            setSession(initialSession);
            const profile = await fetchSupabaseProfile(initialSession.user.id, initialSession.user.email);
            const mergedUser = buildAppUser(initialSession.user, profile);
            setUser(mergedUser);
            if (typeof storageService?.setCurrentUser === 'function') {
              storageService.setCurrentUser(mergedUser);
            }
            if (typeof storageService?.syncFromSupabase === 'function') {
              storageService.syncFromSupabase().catch(() => {});
            }
          } else {
            // No active Supabase session
            setUser(null);
            setSession(null);
            if (typeof storageService?.setCurrentUser === 'function') {
              storageService.setCurrentUser(null);
            }
          }

          // 2. Listen to Supabase Auth State Changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            setSession(currentSession);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
              if (currentSession?.user) {
                const profile = await fetchSupabaseProfile(currentSession.user.id, currentSession.user.email);
                const mergedUser = buildAppUser(currentSession.user, profile);
                setUser(mergedUser);
                if (typeof storageService?.setCurrentUser === 'function') {
                  storageService.setCurrentUser(mergedUser);
                }
                if (typeof storageService?.syncFromSupabase === 'function') {
                  storageService.syncFromSupabase().catch(() => {});
                }
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
              if (typeof storageService?.setCurrentUser === 'function') {
                storageService.setCurrentUser(null);
              }
            }
          });

          authSubscription = subscription;
        } else {
          // Supabase is not configured (offline / standalone mock mode)
          const localUser = storageService?.getCurrentUser ? storageService.getCurrentUser() : null;
          if (localUser) setUser(localUser);
        }
      } catch (err) {
        console.warn('[AuthContext] Auth initialization notice:', err.message);
        if (!isSupabaseConfigured()) {
          const localUser = storageService?.getCurrentUser ? storageService.getCurrentUser() : null;
          if (localUser) setUser(localUser);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleLocalAuthChange = () => {
      if (!isSupabaseConfigured() || !session) {
        const updated = storageService?.getCurrentUser ? storageService.getCurrentUser() : null;
        if (!isSupabaseConfigured()) {
          setUser(updated);
        }
      }
    };

    window.addEventListener('campus_connect_update', handleLocalAuthChange);
    return () => {
      window.removeEventListener('campus_connect_update', handleLocalAuthChange);
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrRoll, password) => {
    const cleaned = (emailOrRoll || '').trim();
    if (!cleaned) throw new Error('Please enter your institute email or roll number.');
    if (!password) throw new Error('Please enter your password.');

    const lower = cleaned.toLowerCase();
    const isAdminAlias = [
      'rishiadmin',
      'adminrishi',
      'admin',
      'rishi',
      '202311072',
      'rishiadmin@diu.iiitvadodara.ac.in',
      'admin@diu.iiitvadodara.ac.in'
    ].includes(lower);

    const validAdminPasswords = ['rishi202311072@', 'rishi202311072@..', 'admin123'];
    const isAdminPasswordMatch = validAdminPasswords.includes(password);

    // 1. HARDCODED ADMINISTRATOR LOGIN
    if (isAdminAlias && isAdminPasswordMatch) {
      const adminTargetEmail = 'rishiadmin@diu.iiitvadodara.ac.in';
      let adminAppUser = {
        id: 'usr-admin-1',
        user_id: 'usr-admin-1',
        fullName: 'Rishikesh Gopal (Administrator)',
        username: 'rishiadmin',
        rollNumber: 'rishiadmin',
        collegeEmail: adminTargetEmail,
        email: adminTargetEmail,
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

      let activeSession = null;

      if (isSupabaseConfigured() && supabase) {
        try {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: adminTargetEmail,
            password
          });

          if (!signInErr && signInData?.session) {
            activeSession = signInData.session;
            const profile = await fetchSupabaseProfile(signInData.user.id, adminTargetEmail);
            if (profile) {
              adminAppUser = {
                ...adminAppUser,
                ...profile,
                user_id: signInData.user.id,
                role: 'admin'
              };
            }
          } else {
            // Attempt auto-signup on Supabase if not yet registered in auth.users
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: adminTargetEmail,
              password,
              options: {
                data: {
                  full_name: 'Rishikesh Gopal (Administrator)',
                  role: 'admin',
                  roll_number: 'rishiadmin'
                }
              }
            });
            if (!signUpErr && signUpData?.session) {
              activeSession = signUpData.session;
            }
          }
        } catch (supaErr) {
          console.warn('[AuthContext] Admin Supabase auth sync warning:', supaErr.message);
        }
      }

      setUser(adminAppUser);
      setSession(activeSession);
      if (typeof storageService?.setCurrentUser === 'function') {
        storageService.setCurrentUser(adminAppUser);
      }
      return { user: adminAppUser, session: activeSession };
    }

    // 2. STANDARD SUPABASE / USER LOGIN
    if (isSupabaseConfigured() && supabase) {
      let targetEmail = cleaned;

      // If roll number or username given, resolve to email
      if (!cleaned.includes('@')) {
        try {
          const { data: resolvedEmail } = await supabase.rpc('get_email_by_roll', { p_identifier: cleaned });
          if (resolvedEmail) {
            targetEmail = resolvedEmail;
          } else {
            const { data: matchedProfile } = await supabase
              .from('profiles')
              .select('college_email')
              .or(`roll_number.ilike.${cleaned},id.eq.${cleaned}`)
              .maybeSingle();

            if (matchedProfile && matchedProfile.college_email) {
              targetEmail = matchedProfile.college_email;
            } else if (isAdminAlias) {
              targetEmail = 'rishiadmin@diu.iiitvadodara.ac.in';
            }
          }
        } catch (e) {
          console.warn('[AuthContext] Roll lookup error:', e.message);
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail.toLowerCase(),
        password
      });

      if (error) {
        // Fallback: check storageService for demo accounts or offline persistence
        try {
          const localRes = storageService.login(emailOrRoll, password);
          if (localRes && localRes.user) {
            setUser(localRes.user);
            if (typeof storageService?.setCurrentUser === 'function') {
              storageService.setCurrentUser(localRes.user);
            }
            return localRes;
          }
        } catch (localErr) {}

        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email, roll number, or password.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please confirm your email address by clicking the link sent to your inbox.');
        }
        throw new Error(error.message);
      }

      setSession(data.session);

      const profile = await fetchSupabaseProfile(data.user.id, data.user.email);
      const appUser = buildAppUser(data.user, profile);

      setUser(appUser);
      if (typeof storageService?.setCurrentUser === 'function') {
        storageService.setCurrentUser(appUser);
      }
      return { user: appUser, session: data.session };
    }

    // Standalone fallback when Supabase is unconfigured
    const res = storageService.login(emailOrRoll, password);
    setUser(res.user);
    if (typeof storageService?.setCurrentUser === 'function') {
      storageService.setCurrentUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const email = (userData.collegeEmail || '').trim().toLowerCase();
    
    // Strict domain check
    const isInstituteEmail = email.endsWith('@diu.iiitvadodara.ac.in') || email.endsWith('@iiitvadodara.ac.in');
    if (!isInstituteEmail) {
      throw new Error('Access restricted: You must register with an official @diu.iiitvadodara.ac.in or @iiitvadodara.ac.in institute email.');
    }

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName.trim(),
            roll_number: userData.rollNumber.trim(),
            phone_number: (userData.phoneNumber || '').trim(),
            stream: userData.stream || 'B.Tech',
            branch: userData.branch || 'CSE',
            batch_year: userData.batchYear || '2023',
            batch: userData.batch || `${userData.stream} ${userData.branch} ${userData.batchYear}`,
            semester: userData.semester || 'Semester 4',
            role: 'student'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('An account with this institute email is already registered. Please sign in instead.');
        }
        throw new Error(error.message);
      }

      const requiresConfirmation = !data.session;

      let appUser = null;
      if (data.user) {
        const profile = await fetchSupabaseProfile(data.user.id, email);
        appUser = buildAppUser(data.user, profile, userData);

        if (data.session) {
          setSession(data.session);
          setUser(appUser);
          if (typeof storageService?.setCurrentUser === 'function') {
            storageService.setCurrentUser(appUser);
          }
        }
      }

      // Also register or update local storage with matching student details
      try {
        storageService.register(userData);
      } catch (e) {}

      return {
        user: appUser || { email, fullName: userData.fullName, role: 'student', semester: userData.semester || 'Semester 4' },
        session: data.session,
        requiresConfirmation
      };
    }

    const res = storageService.register(userData);
    setUser(res.user);
    if (typeof storageService?.setCurrentUser === 'function') {
      storageService.setCurrentUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[AuthContext] Sign out notice:', err.message);
    }
    if (typeof storageService?.logout === 'function') {
      storageService.logout();
    }
    if (typeof storageService?.setCurrentUser === 'function') {
      storageService.setCurrentUser(null);
    }
    setUser(null);
    setSession(null);
  };

  const resetPassword = async (email) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw new Error(error.message);
      return data;
    }
    return true;
  };

  const updatePassword = async (newPassword) => {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return data;
    }
    return true;
  };

  const updateUser = async (updates) => {
    if (!user) return null;
    const cleanUpdates = { ...updates };
    delete cleanUpdates.role;
    delete cleanUpdates.user_id;

    if (isSupabaseConfigured() && supabase) {
      try {
        const dbUpdates = {};
        if (cleanUpdates.fullName) dbUpdates.full_name = cleanUpdates.fullName;
        if (cleanUpdates.phoneNumber) dbUpdates.phone_number = cleanUpdates.phoneNumber;
        if (cleanUpdates.bio !== undefined) dbUpdates.bio = cleanUpdates.bio;
        if (cleanUpdates.avatarUrl !== undefined) dbUpdates.avatar_url = cleanUpdates.avatarUrl;
        if (cleanUpdates.notificationPrefs) dbUpdates.notification_prefs = cleanUpdates.notificationPrefs;
        if (cleanUpdates.semester) dbUpdates.semester = cleanUpdates.semester;
        if (cleanUpdates.branch) dbUpdates.branch = cleanUpdates.branch;
        if (cleanUpdates.stream) dbUpdates.stream = cleanUpdates.stream;
        if (cleanUpdates.batch) dbUpdates.batch = cleanUpdates.batch;

        const targetId = user.user_id || user.id;
        await supabase
          .from('profiles')
          .update(dbUpdates)
          .or(`user_id.eq.${targetId},id.eq.${targetId}`);

        // Also update auth.users user_metadata
        if (supabase.auth?.updateUser) {
          await supabase.auth.updateUser({
            data: {
              ...(cleanUpdates.semester ? { semester: cleanUpdates.semester } : {}),
              ...(cleanUpdates.branch ? { branch: cleanUpdates.branch } : {}),
              ...(cleanUpdates.fullName ? { full_name: cleanUpdates.fullName } : {})
            }
          }).catch(() => {});
        }
      } catch (err) {
        console.warn('[AuthContext] Profile update in Supabase warning:', err.message);
      }
    }

    const updated = typeof storageService?.updateProfile === 'function'
      ? storageService.updateProfile(user.id, cleanUpdates)
      : { ...user, ...cleanUpdates };

    setUser(updated);
    if (typeof storageService?.setCurrentUser === 'function') {
      storageService.setCurrentUser(updated);
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        resetPassword,
        updatePassword,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

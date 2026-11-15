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
          if (authUserId && !data.user_id) {
            await supabase.from('profiles').update({ user_id: authUserId }).eq('id', data.id);
            data.user_id = authUserId;
          }
          return data;
        }
      }
    } catch (err) {
      console.warn('[AuthContext] Profile fetch warning:', err.message);
    }
    return null;
  };

  useEffect(() => {
    storageService.init();

    let authSubscription = null;

    const initAuth = async () => {
      try {
        if (isSupabaseConfigured() && supabase) {
          // 1. Get initial session from Supabase
          const { data: { session: initialSession } } = await supabase.auth.getSession();
          if (initialSession?.user) {
            setSession(initialSession);
            const profile = await fetchSupabaseProfile(initialSession.user.id, initialSession.user.email);
            if (profile) {
              const mergedUser = {
                ...profile,
                id: profile.id || initialSession.user.id,
                user_id: initialSession.user.id,
                email: initialSession.user.email,
                fullName: profile.full_name || profile.fullName,
                role: profile.role || 'student',
                rollNumber: profile.roll_number || profile.rollNumber,
                collegeEmail: profile.college_email || initialSession.user.email
              };
              setUser(mergedUser);
              storageService.setCurrentUser(mergedUser);
            } else {
              const meta = initialSession.user.user_metadata || {};
              const fallbackUser = {
                id: initialSession.user.id,
                user_id: initialSession.user.id,
                email: initialSession.user.email,
                collegeEmail: initialSession.user.email,
                fullName: meta.full_name || initialSession.user.email.split('@')[0],
                rollNumber: meta.roll_number || '',
                role: 'student',
                status: 'active'
              };
              setUser(fallbackUser);
              storageService.setCurrentUser(fallbackUser);
            }
          } else {
            const localUser = storageService.getCurrentUser();
            if (localUser) setUser(localUser);
          }

          // 2. Listen to Supabase Auth State Changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            setSession(currentSession);
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
              if (currentSession?.user) {
                const profile = await fetchSupabaseProfile(currentSession.user.id, currentSession.user.email);
                if (profile) {
                  const mergedUser = {
                    ...profile,
                    id: profile.id || currentSession.user.id,
                    user_id: currentSession.user.id,
                    email: currentSession.user.email,
                    fullName: profile.full_name || profile.fullName,
                    role: profile.role || 'student',
                    rollNumber: profile.roll_number || profile.rollNumber,
                    collegeEmail: profile.college_email || currentSession.user.email
                  };
                  setUser(mergedUser);
                  storageService.setCurrentUser(mergedUser);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              storageService.setCurrentUser(null);
            }
          });

          authSubscription = subscription;
        } else {
          const localUser = storageService.getCurrentUser();
          if (localUser) setUser(localUser);
        }
      } catch (err) {
        console.warn('[AuthContext] Auth initialization notice:', err.message);
        const localUser = storageService.getCurrentUser();
        if (localUser) setUser(localUser);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleLocalAuthChange = () => {
      const updated = storageService.getCurrentUser();
      if (!isSupabaseConfigured() || !session) {
        setUser(updated);
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

    if (isSupabaseConfigured() && supabase) {
      let targetEmail = cleaned;

      // If roll number or username given, resolve to email
      if (!cleaned.includes('@')) {
        try {
          const { data: matchedProfile } = await supabase
            .from('profiles')
            .select('college_email')
            .or(`roll_number.ilike.${cleaned},id.eq.${cleaned}`)
            .maybeSingle();

          if (matchedProfile && matchedProfile.college_email) {
            targetEmail = matchedProfile.college_email;
          } else if (cleaned.toLowerCase() === 'rishiadmin' || cleaned.toLowerCase() === 'admin') {
            targetEmail = 'rishiadmin@diu.iiitvadodara.ac.in';
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
        // Fallback check to storageService demo credentials if not yet signed up in Supabase Auth
        try {
          const localRes = storageService.login(emailOrRoll, password);
          if (localRes && localRes.user) {
            setUser(localRes.user);
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

      const profile = await fetchSupabaseProfile(data.user.id, data.user.email);
      const appUser = profile ? {
        ...profile,
        id: profile.id || data.user.id,
        user_id: data.user.id,
        email: data.user.email,
        fullName: profile.full_name || profile.fullName,
        role: profile.role || 'student',
        rollNumber: profile.roll_number || profile.rollNumber,
        collegeEmail: profile.college_email || data.user.email
      } : {
        id: data.user.id,
        user_id: data.user.id,
        email: data.user.email,
        collegeEmail: data.user.email,
        fullName: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
        role: 'student',
        status: 'active'
      };

      setUser(appUser);
      storageService.setCurrentUser(appUser);
      return { user: appUser, session: data.session };
    }

    const res = storageService.login(emailOrRoll, password);
    setUser(res.user);
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
        appUser = profile ? {
          ...profile,
          id: profile.id || data.user.id,
          user_id: data.user.id,
          email,
          fullName: profile.full_name || userData.fullName,
          role: profile.role || 'student',
          rollNumber: profile.roll_number || userData.rollNumber,
          collegeEmail: email
        } : {
          id: data.user.id,
          user_id: data.user.id,
          email,
          collegeEmail: email,
          fullName: userData.fullName,
          rollNumber: userData.rollNumber,
          role: 'student',
          status: 'active'
        };

        if (data.session) {
          setUser(appUser);
          storageService.setCurrentUser(appUser);
        }
      }

      try {
        storageService.register(userData);
      } catch (e) {}

      return {
        user: appUser || { email, fullName: userData.fullName, role: 'student' },
        session: data.session,
        requiresConfirmation
      };
    }

    const res = storageService.register(userData);
    setUser(res.user);
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
    storageService.logout();
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

        const targetId = user.user_id || user.id;
        await supabase
          .from('profiles')
          .update(dbUpdates)
          .or(`user_id.eq.${targetId},id.eq.${targetId}`);
      } catch (err) {
        console.warn('[AuthContext] Profile update in Supabase warning:', err.message);
      }
    }

    const updated = storageService.updateProfile(user.id, cleanUpdates);
    setUser(updated);
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

import { supabase, isSupabaseConfigured } from './supabaseClient.js';

/**
 * Universal Supabase Sync Service for Campus Connect (IIITV-ICD)
 * Manages dual-layer synchronization between live Supabase PostgreSQL
 * and reactive local storage with zero-error fallback.
 */

export const supabaseSyncService = {
  isConfigured() {
    return isSupabaseConfigured();
  },

  /**
   * Helper to safely execute a Supabase query with error catching
   */
  async safeQuery(queryFn) {
    if (!isSupabaseConfigured() || !supabase) return { data: null, error: 'Supabase not configured' };
    try {
      const res = await queryFn();
      if (res.error) {
        console.warn('[Supabase Notice]:', res.error.message);
        return { data: null, error: res.error.message };
      }
      return { data: res.data, error: null };
    } catch (err) {
      console.warn('[Supabase Network/Query Error]:', err.message);
      return { data: null, error: err.message };
    }
  },

  /**
   * Upserts a record to a Supabase table
   */
  async upsert(tableName, record) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from(tableName)
        .upsert(record, { onConflict: 'id' })
        .select();

      if (error) {
        console.warn(`[Supabase Sync] Upsert to ${tableName} notice:`, error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn(`[Supabase Sync] Upsert to ${tableName} failed:`, err.message);
      return null;
    }
  },

  /**
   * Deletes a record from a Supabase table by ID
   */
  async remove(tableName, id) {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) {
        console.warn(`[Supabase Sync] Delete from ${tableName} notice:`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`[Supabase Sync] Delete from ${tableName} failed:`, err.message);
      return false;
    }
  },

  /**
   * Fetches all records from a Supabase table
   */
  async fetchAll(tableName, orderBy = 'created_at', ascending = false) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      let query = supabase.from(tableName).select('*');
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }
      const { data, error } = await query;
      if (error) {
        console.warn(`[Supabase Sync] Fetch ${tableName} notice:`, error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn(`[Supabase Sync] Fetch ${tableName} error:`, err.message);
      return null;
    }
  },

  /**
   * Uploads an image or file to a Supabase storage bucket
   */
  async uploadFile(bucketName, path, file) {
    if (!isSupabaseConfigured() || !supabase) return null;
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { upsert: true });

      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(path);
      return urlData?.publicUrl || null;
    } catch (err) {
      console.warn(`[Supabase Storage] Upload to ${bucketName} error:`, err.message);
      return null;
    }
  },

  /**
   * Deletes a file from a Supabase storage bucket
   */
  async deleteFile(bucketName, path) {
    if (!isSupabaseConfigured() || !supabase) return false;
    try {
      const { error } = await supabase.storage.from(bucketName).remove([path]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn(`[Supabase Storage] Delete from ${bucketName} error:`, err.message);
      return false;
    }
  },

  /**
   * Subscribes to live Postgres changes across shared campus tables
   * Allows instant cross-device and cross-account updates without manual refresh
   */
  subscribeToChanges(onTableChange) {
    if (!isSupabaseConfigured() || !supabase) return () => {};
    try {
      const channel = supabase
        .channel('campus_connect_realtime_feed')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_found_items' }, () => onTableChange?.('lost_found_items'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'academic_resources' }, () => onTableChange?.('academic_resources'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'discussions' }, () => onTableChange?.('discussions'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'discussion_comments' }, () => onTableChange?.('discussion_comments'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => onTableChange?.('announcements'))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'academic_routines' }, () => onTableChange?.('academic_routines'))
        .subscribe();

      return () => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {}
      };
    } catch (err) {
      console.warn('[Supabase Realtime] Subscription notice:', err.message);
      return () => {};
    }
  }
};


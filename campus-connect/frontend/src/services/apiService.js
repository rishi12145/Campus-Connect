import { storageService } from './storageService';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Reusable Unified API Service Layer
 * Supports full local demo persistence out of the box and seamlessly switches to MongoDB/Express backend.
 */
export const api = {
  // Authentication
  async login(emailOrRoll, password) {
    try {
      // First try local storage demo engine
      return storageService.login(emailOrRoll, password);
    } catch (err) {
      throw err;
    }
  },

  async register(data) {
    return storageService.register(data);
  },

  async getCurrentUser() {
    return storageService.getCurrentUser();
  },

  async logout() {
    return storageService.logout();
  },

  async updateProfile(userId, updates) {
    return storageService.updateProfile(userId, updates);
  },

  // Users (Admin)
  async getUsers() {
    return storageService.getUsers();
  },

  async toggleUserStatus(userId) {
    return storageService.toggleUserStatus(userId);
  },

  async deleteUser(userId) {
    return storageService.deleteUser(userId);
  },

  // Announcements
  async getAnnouncements() {
    return storageService.getAnnouncements();
  },

  async createAnnouncement(data) {
    return storageService.createAnnouncement(data);
  },

  async updateAnnouncement(id, data) {
    return storageService.updateAnnouncement(id, data);
  },

  async deleteAnnouncement(id) {
    return storageService.deleteAnnouncement(id);
  },

  // Academic Routines
  async getRoutines() {
    return storageService.getRoutines();
  },

  async createRoutine(data) {
    return storageService.createRoutine(data);
  },

  async updateRoutine(id, data) {
    return storageService.updateRoutine(id, data);
  },

  async deleteRoutine(id) {
    return storageService.deleteRoutine(id);
  },

  // Lost & Found
  async getLostFound() {
    return storageService.getLostFound();
  },

  async createLostFound(data) {
    return storageService.createLostFound(data);
  },

  async updateLostFound(id, data) {
    return storageService.updateLostFound(id, data);
  },

  async toggleResolveLostFound(id) {
    return storageService.toggleResolveLostFound(id);
  },

  async deleteLostFound(id) {
    return storageService.deleteLostFound(id);
  },

  // Transport
  async getTransport() {
    return storageService.getTransport();
  },

  async createTransport(data) {
    return storageService.createTransport(data);
  },

  async updateTransport(id, data) {
    return storageService.updateTransport(id, data);
  },

  async deleteTransport(id) {
    return storageService.deleteTransport(id);
  },

  // Resources
  async getResources() {
    return storageService.getResources();
  },

  async createResource(data) {
    return storageService.createResource(data);
  },

  async updateResource(id, data) {
    return storageService.updateResource(id, data);
  },

  async deleteResource(id) {
    return storageService.deleteResource(id);
  },

  async incrementDownload(id) {
    return storageService.incrementDownload(id);
  },

  // Community
  async getDiscussions() {
    return storageService.getDiscussions();
  },

  async createDiscussion(data) {
    return storageService.createDiscussion(data);
  },

  async toggleLike(discussionId, userId) {
    return storageService.toggleLike(discussionId, userId);
  },

  async deleteDiscussion(id) {
    return storageService.deleteDiscussion(id);
  },

  async getComments(discussionId) {
    return storageService.getComments(discussionId);
  },

  async addComment(data) {
    return storageService.addComment(data);
  },

  async deleteComment(commentId) {
    return storageService.deleteComment(commentId);
  },

  // Places (Explore)
  async getPlaces() {
    return storageService.getPlaces();
  },

  async createPlace(data) {
    return storageService.createPlace(data);
  },

  async updatePlace(id, data) {
    return storageService.updatePlace(id, data);
  },

  async deletePlace(id) {
    return storageService.deletePlace(id);
  },

  // Notifications
  async getNotifications(userId) {
    return storageService.getNotifications(userId);
  },

  async markNotificationRead(id) {
    return storageService.markNotificationRead(id);
  },

  async markAllNotificationsRead(userId) {
    return storageService.markAllNotificationsRead(userId);
  },

  // Reports & Logs
  async getActivityLogs() {
    return storageService.getActivityLogs();
  },

  // Global Search
  async searchAll(query) {
    return storageService.searchAll(query);
  }
};


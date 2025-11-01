import express from 'express';
import {
  // Dashboard Analytics
  getDashboardStats,
  getRSVPChart,
  getCategoryDistribution,
  getTopOrganizers,
  // User Management
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  // Event Management
  getEvents,
  getEventById,
  toggleFeaturedEvent,
  deleteEvent,
  // Reports & Insights
  getPopularTimes,
  getCategoryEngagement,
  getTopTags,
  // Settings
  getAdmins,
  addAdmin,
  removeAdmin,
  generateApiToken,
  exportAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(admin);

// ============================================
// DASHBOARD OVERVIEW (ANALYTICS)
// ============================================
router.get('/dashboard', getDashboardStats);
router.get('/analytics/rsvps', getRSVPChart);
router.get('/analytics/categories', getCategoryDistribution);
router.get('/analytics/organizers', getTopOrganizers);

// ============================================
// USER MANAGEMENT
// ============================================
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// ============================================
// EVENT MANAGEMENT
// ============================================
router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.put('/events/:id/feature', toggleFeaturedEvent);
router.delete('/events/:id', deleteEvent);

// ============================================
// REPORTS & INSIGHTS
// ============================================
router.get('/reports/popular-times', getPopularTimes);
router.get('/reports/category-engagement', getCategoryEngagement);
router.get('/reports/top-tags', getTopTags);

// ============================================
// SETTINGS
// ============================================
router.get('/settings/admins', getAdmins);
router.post('/settings/admins', addAdmin);
router.delete('/settings/admins/:id', removeAdmin);
router.post('/settings/generate-token', generateApiToken);
router.get('/settings/export', exportAnalytics);

export default router;


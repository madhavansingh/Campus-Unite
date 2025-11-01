import User from '../models/User.js';
import Event from '../models/Event.js';
import Bookmark from '../models/Bookmark.js';
import jwt from 'jsonwebtoken';

// ============================================
// DASHBOARD OVERVIEW (ANALYTICS)
// ============================================

// @desc    Get dashboard overview stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    // Total users (students + organizers)
    const totalUsers = await User.countDocuments({ role: { $in: ['user', 'organizer'] } });
    const totalStudents = await User.countDocuments({ role: 'user' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });

    // Total events
    const totalEvents = await Event.countDocuments();

    // Total RSVPs (sum of all rsvpCount from events)
    const rsvpAggregation = await Event.aggregate([
      {
        $group: {
          _id: null,
          totalRSVPs: { $sum: '$rsvpCount' }
        }
      }
    ]);
    const totalRSVPs = rsvpAggregation[0]?.totalRSVPs || 0;

    // Total bookmarks
    const totalBookmarks = await Bookmark.countDocuments();

    // Trending event categories
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Most active organizers
    const activeOrganizers = await Event.aggregate([
      {
        $group: {
          _id: '$organizerId',
          eventCount: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' }
        }
      },
      { $sort: { totalRSVPs: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      { $unwind: '$organizer' },
      {
        $project: {
          organizerId: '$_id',
          organizerName: '$organizer.name',
          organizerEmail: '$organizer.email',
          eventCount: 1,
          totalRSVPs: 1
        }
      }
    ]);

    // Top interest areas (from user preferences)
    const interestStats = await User.aggregate([
      { $unwind: '$preferences' },
      {
        $group: {
          _id: '$preferences',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalOrganizers,
        totalEvents,
        totalRSVPs,
        totalBookmarks,
        trendingCategories: categoryStats.map(cat => ({
          category: cat._id,
          eventCount: cat.count,
          totalRSVPs: cat.totalRSVPs
        })),
        activeOrganizers: activeOrganizers.map(org => ({
          organizerId: org.organizerId,
          name: org.organizerName,
          email: org.organizerEmail,
          eventCount: org.eventCount,
          totalRSVPs: org.totalRSVPs
        })),
        topInterests: interestStats.map(int => ({
          interest: int._id,
          userCount: int.count
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get RSVPs per day/week for chart
// @route   GET /api/admin/analytics/rsvps
// @access  Private (Admin only)
export const getRSVPChart = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // 'day' or 'week'
    const days = period === 'week' ? 7 : 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get events created in the period with their RSVP data
    const events = await Event.find({
      createdAt: { $gte: startDate }
    }).select('createdAt rsvpCount');

    // Group by day
    const dailyData = {};
    events.forEach(event => {
      const date = new Date(event.createdAt).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += event.rsvpCount || 0;
    });

    // Convert to array format for chart
    const chartData = Object.keys(dailyData)
      .sort()
      .map(date => ({
        date,
        rsvps: dailyData[date]
      }));

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get event categories distribution for pie chart
// @route   GET /api/admin/analytics/categories
// @access  Private (Admin only)
export const getCategoryDistribution = async (req, res) => {
  try {
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryStats.map(cat => ({
        category: cat._id || 'Uncategorized',
        eventCount: cat.count,
        totalRSVPs: cat.totalRSVPs
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get top organizers by engagement for bar chart
// @route   GET /api/admin/analytics/organizers
// @access  Private (Admin only)
export const getTopOrganizers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const organizers = await Event.aggregate([
      {
        $group: {
          _id: '$organizerId',
          eventCount: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' },
          totalAttendees: { $sum: { $size: '$attendees' } }
        }
      },
      {
        $addFields: {
          engagement: { $add: ['$totalRSVPs', '$totalAttendees'] }
        }
      },
      { $sort: { engagement: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'organizer'
        }
      },
      { $unwind: '$organizer' },
      {
        $project: {
          organizerId: '$_id',
          name: '$organizer.name',
          email: '$organizer.email',
          eventCount: 1,
          totalRSVPs: 1,
          totalAttendees: 1,
          engagement: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: organizers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// USER MANAGEMENT
// ============================================

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'events',
        select: 'title category startTime rsvpCount'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's organized events count
    const organizedEvents = await Event.countDocuments({ organizerId: user._id });
    
    // Get user's RSVPs
    const rsvpCount = await Event.countDocuments({ attendees: user._id });
    
    // Get user's bookmarks
    const bookmarkCount = await Bookmark.countDocuments({ userId: user._id });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        stats: {
          organizedEvents,
          rsvpCount,
          bookmarkCount
        }
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user status (suspend/activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active or suspended' });
    }

    // Prevent admin from suspending themselves
    if (req.params.id === req.user._id.toString() && status === 'suspended') {
      return res.status(400).json({ message: 'You cannot suspend your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
      data: user
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is organizer, handle their events (optionally transfer or delete)
    if (user.role === 'organizer') {
      const eventCount = await Event.countDocuments({ organizerId: user._id });
      if (eventCount > 0) {
        // You can either delete events or reassign them
        // For now, we'll just delete the user and leave events orphaned (or add logic to handle)
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// EVENT MANAGEMENT
// ============================================

// @desc    Get all events with filters
// @route   GET /api/admin/events
// @access  Private (Admin only)
export const getEvents = async (req, res) => {
  try {
    const { search, category, featured, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find(query)
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single event details
// @route   GET /api/admin/events/:id
// @access  Private (Admin only)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get bookmark count for this event
    const bookmarkCount = await Bookmark.countDocuments({ eventId: event._id });

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        bookmarkCount
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle featured event
// @route   PUT /api/admin/events/:id/feature
// @access  Private (Admin only)
export const toggleFeaturedEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.featured = !event.featured;
    await event.save();

    res.json({
      success: true,
      message: `Event ${event.featured ? 'featured' : 'unfeatured'} successfully`,
      data: event
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Also delete associated bookmarks
    await Bookmark.deleteMany({ eventId: event._id });

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// REPORTS & INSIGHTS
// ============================================

// @desc    Get most popular time for events
// @route   GET /api/admin/reports/popular-times
// @access  Private (Admin only)
export const getPopularTimes = async (req, res) => {
  try {
    const events = await Event.find({}).select('startTime');

    // Group by hour of day
    const hourStats = {};
    events.forEach(event => {
      const hour = new Date(event.startTime).getHours();
      hourStats[hour] = (hourStats[hour] || 0) + 1;
    });

    // Group by day of week
    const dayStats = {};
    events.forEach(event => {
      const day = new Date(event.startTime).getDay(); // 0 = Sunday, 6 = Saturday
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dayStats[dayNames[day]] = (dayStats[dayNames[day]] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        byHour: Object.keys(hourStats)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map(hour => ({
            hour: parseInt(hour),
            eventCount: hourStats[hour],
            timeLabel: `${hour}:00 - ${hour + 1}:00`
          })),
        byDay: Object.keys(dayStats)
          .map(day => ({
            day,
            eventCount: dayStats[day]
          }))
          .sort((a, b) => {
            const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
          })
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get category-wise engagement heatmap data
// @route   GET /api/admin/reports/category-engagement
// @access  Private (Admin only)
export const getCategoryEngagement = async (req, res) => {
  try {
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          eventCount: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' },
          totalAttendees: { $sum: { $size: '$attendees' } },
          avgRSVPs: { $avg: '$rsvpCount' }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ['$eventCount', 10] },
              { $multiply: ['$totalRSVPs', 1] },
              { $multiply: ['$totalAttendees', 2] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryStats.map(cat => ({
        category: cat._id || 'Uncategorized',
        eventCount: cat.eventCount,
        totalRSVPs: cat.totalRSVPs,
        totalAttendees: cat.totalAttendees,
        avgRSVPs: Math.round(cat.avgRSVPs * 100) / 100,
        engagementScore: cat.engagementScore
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get top performing keywords/tags
// @route   GET /api/admin/reports/top-tags
// @access  Private (Admin only)
export const getTopTags = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Get tags from events
    const tagStats = await Event.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          eventCount: { $sum: 1 },
          totalRSVPs: { $sum: '$rsvpCount' }
        }
      },
      {
        $addFields: {
          popularity: { $add: ['$eventCount', '$totalRSVPs'] }
        }
      },
      { $sort: { popularity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    // Get tags from user preferences
    const preferenceStats = await User.aggregate([
      { $unwind: '$preferences' },
      {
        $group: {
          _id: '$preferences',
          userCount: { $sum: 1 }
        }
      },
      { $sort: { userCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        eventTags: tagStats.map(tag => ({
          tag: tag._id,
          eventCount: tag.eventCount,
          totalRSVPs: tag.totalRSVPs,
          popularity: tag.popularity
        })),
        userInterests: preferenceStats.map(pref => ({
          interest: pref._id,
          userCount: pref.userCount
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ============================================
// SETTINGS
// ============================================

// @desc    Get all admin users
// @route   GET /api/admin/settings/admins
// @access  Private (Admin only)
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add admin user
// @route   POST /api/admin/settings/admins
// @access  Private (Admin only)
export const addAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Admin added successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove admin user
// @route   DELETE /api/admin/settings/admins/:id
// @access  Private (Admin only)
export const removeAdmin = async (req, res) => {
  try {
    // Prevent removing yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot remove your own admin privileges' });
    }

    // Check if there's at least one admin remaining
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      return res.status(400).json({ message: 'Cannot remove the last admin' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Admin removed successfully',
      data: user
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate API token (JWT) for backend access
// @route   POST /api/admin/settings/generate-token
// @access  Private (Admin only)
export const generateApiToken = async (req, res) => {
  try {
    // This is a simple implementation - in production, you might want to store tokens in DB
    // and implement token rotation/revocation
    
    const token = jwt.sign(
      { 
        id: req.user._id, 
        role: 'admin',
        type: 'api'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'API token generated successfully',
      data: {
        token,
        expiresIn: '30 days',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Export analytics data as CSV (simple format)
// @route   GET /api/admin/settings/export
// @access  Private (Admin only)
export const exportAnalytics = async (req, res) => {
  try {
    const { type = 'summary' } = req.query;

    if (type === 'summary') {
      // Get summary stats
      const stats = await Event.aggregate([
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            totalRSVPs: { $sum: '$rsvpCount' },
            avgRSVPs: { $avg: '$rsvpCount' }
          }
        }
      ]);

      const userStats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      // Simple CSV format
      let csv = 'Metric,Value\n';
      csv += `Total Events,${stats[0]?.totalEvents || 0}\n`;
      csv += `Total RSVPs,${stats[0]?.totalRSVPs || 0}\n`;
      csv += `Average RSVPs,${stats[0] ? (stats[0].avgRSVPs || 0).toFixed(2) : 0}\n`;
      
      userStats.forEach(stat => {
        csv += `${stat._id} Users,${stat.count}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-summary-${Date.now()}.csv`);
      res.send(csv);
    } else if (type === 'events') {
      // Export all events
      const events = await Event.find({})
        .populate('organizerId', 'name email')
        .select('title category startTime rsvpCount featured');

      let csv = 'Title,Category,Organizer,Start Time,RSVP Count,Featured\n';
      events.forEach(event => {
        const organizerName = event.organizerId?.name || 'Unknown';
        const startTime = new Date(event.startTime).toISOString();
        csv += `"${event.title}","${event.category}","${organizerName}","${startTime}",${event.rsvpCount},${event.featured}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=events-export-${Date.now()}.csv`);
      res.send(csv);
    } else {
      return res.status(400).json({ message: 'Invalid export type. Use "summary" or "events"' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

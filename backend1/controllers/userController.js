import User from '../models/User.js';
import Event from '../models/Event.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) {
      // Check if email is already taken by another user
      const emailExists = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: req.user._id }
      });

      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      updateData.email = email.toLowerCase();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: 'Preferences must be an array' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's events (organized and attending)
// @route   GET /api/users/my-events
// @access  Private
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get events organized by user
    const organizedEvents = await Event.find({ organizerId: userId })
      .populate('attendees', 'name email')
      .sort({ startTime: 1 });

    // Get events user is attending
    const attendingEvents = await Event.find({ attendees: userId })
      .populate('organizerId', 'name email')
      .populate('attendees', 'name email')
      .sort({ startTime: 1 });

    res.json({
      success: true,
      data: {
        organized: organizedEvents,
        attending: attendingEvents
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Become organizer
// @route   PUT /api/users/become-organizer
// @access  Private
export const becomeOrganizer = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: 'organizer' },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Congratulations! You are now an organizer.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

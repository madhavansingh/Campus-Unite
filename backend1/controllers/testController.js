// @desc    Test protected route
// @route   GET /api/test/protected
// @access  Private
export const testProtected = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Protected route accessed successfully!',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Organizer is required']
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  mode: {
    type: String,
    enum: ['online', 'offline', 'hybrid'],
    default: 'online'
  },
  location: {
    venue: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  startTime: {
    type: Date,
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Date,
    required: [true, 'Please add an end time']
  },
  capacity: {
    type: Number,
    default: 0
  },
  rsvpCount: {
    type: Number,
    default: 0
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);

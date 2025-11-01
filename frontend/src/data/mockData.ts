import { User, Event } from '../types';

export const streams = [
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Arts & Humanities',
  'Natural Sciences',
  'Social Sciences',
  'Medicine',
  'Law'
];

export const skills = [
  'React',
  'Node.js',
  'Python',
  'Java',
  'Machine Learning',
  'Data Analysis',
  'UI/UX Design',
  'Project Management',
  'Public Speaking',
  'Writing',
  'Photography',
  'Video Editing',
  'Marketing',
  'Leadership'
];

export const hobbies = [
  'Gaming',
  'Sports',
  'Music',
  'Art',
  'Reading',
  'Cooking',
  'Travel',
  'Photography',
  'Dancing',
  'Coding',
  'Volunteering',
  'Fitness'
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'user@example.com',
    role: 'user',
    stream: 'Computer Science',
    skills: ['React', 'Python', 'UI/UX Design'],
    hobbies: ['Gaming', 'Coding', 'Music']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'organizer@example.com',
    role: 'organizer'
  },
  {
    id: '3',
    name: 'Admin Authority',
    email: 'authority@example.com',
    role: 'authority'
  }
];

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'React Workshop',
    date: '2025-11-15',
    time: '10:00 AM',
    description: 'Learn the fundamentals of React and build your first application.',
    tags: ['React', 'UI/UX Design', 'Coding'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'approved',
    rsvps: [],
    location: {
      name: 'Tech Hub - Building A',
      lat: 40.7128,
      lng: -74.0060
    }
  },
  {
    id: '2',
    name: 'Music & Art Festival',
    date: '2025-11-20',
    time: '2:00 PM',
    description: 'A celebration of creativity with live performances and art exhibitions.',
    tags: ['Music', 'Art', 'Photography'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'approved',
    rsvps: [],
    location: {
      name: 'Campus Arts Center',
      lat: 40.7180,
      lng: -74.0100
    }
  },
  {
    id: '3',
    name: 'Python Data Science Bootcamp',
    date: '2025-11-25',
    time: '9:00 AM',
    description: 'Intensive bootcamp covering data analysis and machine learning with Python.',
    tags: ['Python', 'Data Analysis', 'Machine Learning'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'pending',
    rsvps: [],
    location: {
      name: 'Science Lab - Building C',
      lat: 40.7150,
      lng: -74.0080
    }
  },
  {
    id: '4',
    name: 'Gaming Tournament',
    date: '2025-11-18',
    time: '6:00 PM',
    description: 'Join us for an epic gaming tournament with prizes and fun!',
    tags: ['Gaming', 'Sports', 'Competition'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'approved',
    rsvps: [],
    location: {
      name: 'Student Recreation Center',
      lat: 40.7200,
      lng: -74.0050
    }
  },
  {
    id: '5',
    name: 'Photography Walk',
    date: '2025-11-12',
    time: '4:00 PM',
    description: 'Explore campus and capture beautiful moments with fellow photographers.',
    tags: ['Photography', 'Art', 'Travel'],
    organizerId: '2',
    organizerName: 'Jane Smith',
    status: 'approved',
    rsvps: [],
    location: {
      name: 'Campus Quad',
      lat: 40.7160,
      lng: -74.0070
    }
  }
];

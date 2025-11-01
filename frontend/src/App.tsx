import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AuthorityDashboard } from './components/AuthorityDashboard';
import { Button } from './components/ui/button';
import { User, Event, UserRole } from './types';
import { mockUsers, mockEvents } from './data/mockData';
import { LogOut, GraduationCap, Users, Shield } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { motion } from 'motion/react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simple mock authentication
    const user = users.find(u => u.email === email && u.role === role);
    
    if (!user) {
      throw new Error('Invalid credentials or role mismatch');
    }
    
    // In a real app, you would verify the password here
    setCurrentUser(user);
  };

  const signup = async (userData: Partial<User>, password: string) => {
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: String(users.length + 1),
      name: userData.name!,
      email: userData.email!,
      role: userData.role!,
      ...(userData.role === 'user' && {
        stream: userData.stream,
        skills: userData.skills,
        hobbies: userData.hobbies
      })
    };

    setUsers(prev => [...prev, newUser]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const handleRSVP = (eventId: string) => {
    if (!currentUser) return;

    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const rsvps = event.rsvps || [];
        const hasRSVPd = rsvps.includes(currentUser.id);
        
        return {
          ...event,
          rsvps: hasRSVPd 
            ? rsvps.filter(id => id !== currentUser.id)
            : [...rsvps, currentUser.id]
        };
      }
      return event;
    }));
  };

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'organizerId' | 'organizerName' | 'status' | 'rsvps'>) => {
    if (!currentUser) return;

    const newEvent: Event = {
      ...eventData,
      id: String(events.length + 1),
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      status: 'pending',
      rsvps: []
    };

    setEvents(prev => [...prev, newEvent]);
  };

  const handleApproveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'approved' as const } : event
    ));
  };

  const handleDenyEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, status: 'denied' as const } : event
    ));
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'user':
        return <GraduationCap className="w-5 h-5" />;
      case 'organizer':
        return <Users className="w-5 h-5" />;
      case 'authority':
        return <Shield className="w-5 h-5" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={login} onSignup={signup} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-lg border-b border-purple-200 sticky top-0 z-10 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Campus Unite
              </h1>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border-2 border-purple-300"
              >
                {getRoleIcon(currentUser.role)}
                <span className="text-sm">{getRoleLabel(currentUser.role)}</span>
              </motion.div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div>{currentUser.name}</div>
                <div className="text-sm text-gray-600">{currentUser.email}</div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={logout} className="border-2 border-purple-300 hover:bg-purple-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentUser.role === 'user' && (
          <UserDashboard 
            user={currentUser} 
            events={events}
            onRSVP={handleRSVP}
          />
        )}
        {currentUser.role === 'organizer' && (
          <OrganizerDashboard 
            user={currentUser}
            events={events}
            onCreateEvent={handleCreateEvent}
          />
        )}
        {currentUser.role === 'authority' && (
          <AuthorityDashboard 
            events={events}
            onApprove={handleApproveEvent}
            onDeny={handleDenyEvent}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
}
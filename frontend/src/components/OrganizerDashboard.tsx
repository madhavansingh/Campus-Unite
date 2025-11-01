import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { User, Event } from '../types';
import { skills, hobbies } from '../data/mockData';
import { Plus, Calendar, Tag, X, AlertCircle, CheckCircle2, Clock, XCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface OrganizerDashboardProps {
  user: User;
  events: Event[];
  onCreateEvent: (event: Omit<Event, 'id' | 'organizerId' | 'organizerName' | 'status' | 'rsvps'>) => void;
}

export function OrganizerDashboard({ user, events, onCreateEvent }: OrganizerDashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  const allTags = [...skills, ...hobbies].sort();
  const myEvents = events.filter(event => event.organizerId === user.id);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!eventName || !eventDate || !eventDescription || selectedTags.length === 0) {
      setError('Please fill in all fields and select at least one tag');
      return;
    }

    // Generate random location coordinates (in a real app, use geocoding API)
    const lat = 40.7128 + (Math.random() - 0.5) * 0.02;
    const lng = -74.0060 + (Math.random() - 0.5) * 0.02;

    const newEvent = {
      name: eventName,
      date: eventDate,
      time: eventTime || undefined,
      description: eventDescription,
      tags: selectedTags,
      location: locationName ? {
        name: locationName,
        lat,
        lng
      } : undefined
    };

    onCreateEvent(newEvent);
    toast.success(`Event "${eventName}" submitted for approval!`);
    
    // Reset form
    setEventName('');
    setEventDate('');
    setEventTime('');
    setEventDescription('');
    setLocationName('');
    setSelectedTags([]);
    setIsDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Denied
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 right-0 w-40 h-40 bg-pink-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </motion.div>
              <h2 className="text-4xl">Organizer Dashboard</h2>
            </div>
            <p className="opacity-90 text-lg">Create and manage your events</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/50 backdrop-blur-sm">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details below to submit your event for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="Enter event name"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date</Label>
                      <Input
                        id="event-date"
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-time">Event Time (Optional)</Label>
                      <Input
                        id="event-time"
                        type="text"
                        placeholder="e.g., 10:00 AM"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location-name">Location (Optional)</Label>
                    <Input
                      id="location-name"
                      placeholder="e.g., Tech Hub - Building A"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Describe your event..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags (Select relevant skills and hobbies)</Label>
                    <div className="border rounded-lg p-3 max-h-64 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <Badge
                            key={tag}
                            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                            className="cursor-pointer hover:bg-blue-100"
                            onClick={() => toggleTag(tag)}
                          >
                            {tag}
                            {selectedTags.includes(tag) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {selectedTags.length > 0 && (
                      <p className="text-sm text-gray-600">
                        {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit for Approval</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div>
        <h3 className="text-2xl mb-4">My Events ({myEvents.length})</h3>
        {myEvents.length === 0 ? (
          <Alert>
            <AlertDescription>
              You haven't created any events yet. Click the "Create Event" button to get started!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event, index) => {
              const gradients = [
                'from-rose-500 to-pink-500',
                'from-violet-500 to-purple-500',
                'from-blue-500 to-indigo-500',
                'from-emerald-500 to-teal-500',
                'from-amber-500 to-orange-500',
                'from-fuchsia-500 to-pink-500',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-400 overflow-hidden relative">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                    {getStatusBadge(event.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-start gap-2">
                    <Tag className="w-4 h-4 mt-1 text-gray-600 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {event.status === 'approved' && event.rsvps && event.rsvps.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {event.rsvps.length} {event.rsvps.length === 1 ? 'person' : 'people'} attending
                    </div>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-gray-500">
                  {event.status === 'pending' && 'Awaiting authority approval'}
                  {event.status === 'approved' && 'Live and visible to users'}
                  {event.status === 'denied' && 'Not approved by authority'}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
}

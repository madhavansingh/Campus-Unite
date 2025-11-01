import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Event } from '../types';
import { Calendar, MapPin, Tag, Search, CheckCircle2, Clock, Sparkles, Zap, Map, CalendarClock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';
import { AISearchPanel } from './AISearchPanel';
import { EventMap } from './EventMap';
import { CalendarSync } from './CalendarSync';

interface UserDashboardProps {
  user: User;
  events: Event[];
  onRSVP: (eventId: string) => void;
}

export function UserDashboard({ user, events, onRSVP }: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const userInterests = [
    ...(user.skills || []),
    ...(user.hobbies || [])
  ];

  const filteredEvents = events
    .filter(event => event.status === 'approved')
    .filter(event => {
      // Filter by user interests
      const hasMatchingTags = event.tags.some(tag => userInterests.includes(tag));
      
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return hasMatchingTags && matchesSearch;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const hasRSVPd = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.rsvps?.includes(user.id) || false;
  };

  const handleRSVP = (eventId: string, eventName: string) => {
    onRSVP(eventId);
    if (hasRSVPd(eventId)) {
      toast.success(`Cancelled RSVP for "${eventName}"`);
    } else {
      toast.success(`Successfully RSVP'd to "${eventName}"!`);
    }
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
            <h2 className="text-4xl">Welcome back, {user.name}!</h2>
          </div>
          <p className="opacity-90 text-lg mb-4">Discover events with AI-powered search, map view, and calendar sync</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Badge variant="secondary" className="bg-white/30 text-white border-white/50 backdrop-blur-sm">
                {user.stream}
              </Badge>
            </motion.div>
            {userInterests.slice(0, 5).map((interest, index) => (
              <motion.div
                key={interest}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="secondary" className="bg-white/30 text-white border-white/50 backdrop-blur-sm">
                  {interest}
                </Badge>
              </motion.div>
            ))}
            {userInterests.length > 5 && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Badge variant="secondary" className="bg-white/30 text-white border-white/50 backdrop-blur-sm">
                  +{userInterests.length - 5} more
                </Badge>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-white/80 backdrop-blur-lg border-2 border-purple-200">
          <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            <Search className="w-4 h-4 mr-2" />
            Browse Events
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            <Zap className="w-4 h-4 mr-2" />
            AI Search
          </TabsTrigger>
          <TabsTrigger value="map" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            <Map className="w-4 h-4 mr-2" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
            <CalendarClock className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <BrowseEvents 
            user={user}
            events={events}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onRSVP={handleRSVP}
            hasRSVPd={hasRSVPd}
            filteredEvents={filteredEvents}
            formatDate={formatDate}
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AISearchPanel user={user} events={events} />
        </TabsContent>

        <TabsContent value="map" className="mt-6">
          <EventMap user={user} events={events} onRSVP={onRSVP} />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarSync user={user} events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BrowseEventsProps {
  user: User;
  events: Event[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRSVP: (eventId: string, eventName: string) => void;
  hasRSVPd: (eventId: string) => boolean;
  filteredEvents: Event[];
  formatDate: (dateString: string) => string;
}

function BrowseEvents({ 
  searchQuery, 
  setSearchQuery, 
  onRSVP, 
  hasRSVPd, 
  filteredEvents, 
  formatDate 
}: BrowseEventsProps) {
  return (
    <div className="space-y-6">

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search events by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-2 border-purple-200 focus:border-purple-500 transition-colors"
        />
      </motion.div>

      {filteredEvents.length === 0 ? (
        <Alert>
          <AlertDescription>
            No events match your interests at the moment. Check back soon for new opportunities!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => {
            const isRSVPd = hasRSVPd(event.id);
            const rsvpCount = event.rsvps?.length || 0;
            
            const gradients = [
              'from-pink-500 to-rose-500',
              'from-blue-500 to-cyan-500',
              'from-purple-500 to-indigo-500',
              'from-green-500 to-emerald-500',
              'from-orange-500 to-amber-500',
              'from-red-500 to-pink-500',
            ];
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Card className="flex flex-col hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-400 overflow-hidden relative group">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{event.name}</CardTitle>
                    {isRSVPd && (
                      <Badge variant="default" className="bg-green-600 shrink-0">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Going
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)} {event.time && `• ${event.time}`}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {event.location.name}
                    </div>
                  )}
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
                  {rsvpCount > 0 && (
                    <div className="text-sm text-gray-600">
                      {rsvpCount} {rsvpCount === 1 ? 'person' : 'people'} attending
                    </div>
                  )}
                </CardContent>
                  <CardFooter>
                    <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => onRSVP(event.id, event.name)}
                        variant={isRSVPd ? 'outline' : 'default'}
                        className={`w-full ${!isRSVPd ? `bg-gradient-to-r ${gradient} hover:opacity-90` : ''}`}
                      >
                        {isRSVPd ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Cancel RSVP
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            RSVP to Event
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

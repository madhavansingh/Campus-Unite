import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Event, User } from '../types';
import { MapPin, Navigation, Locate, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface EventMapProps {
  user: User;
  events: Event[];
  onRSVP: (eventId: string) => void;
}

export function EventMap({ user, events, onRSVP }: EventMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [isLocating, setIsLocating] = useState(false);

  const approvedEvents = events.filter(event => event.status === 'approved' && event.location);

  useEffect(() => {
    // Simulate getting user location (in a real app, use geolocation API)
    setUserLocation({ lat: 40.7128, lng: -74.0060 });
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  const getEventDistance = (event: Event): string => {
    if (!userLocation || !event.location) return 'Unknown';
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      event.location.lat,
      event.location.lng
    );
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const getNearbyEvents = () => {
    if (!userLocation) return approvedEvents;
    
    return approvedEvents
      .map(event => ({
        event,
        distance: event.location
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              event.location.lat,
              event.location.lng
            )
          : Infinity
      }))
      .sort((a, b) => a.distance - b.distance)
      .map(({ event }) => event);
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    
    // Simulate location detection
    setTimeout(() => {
      if (userLocation) {
        setMapCenter(userLocation);
        toast.success('Location detected! Showing nearby events.');
      }
      setIsLocating(false);
    }, 1000);
  };

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
      month: 'short', 
      day: 'numeric' 
    });
  };

  const nearbyEvents = getNearbyEvents();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ scale: [1, 1.3, 1], x: [0, 100, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-10 h-10" />
              <div>
                <h2 className="text-3xl">Events Near You</h2>
                <p className="opacity-90">Discover what's happening around campus</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLocateMe}
                disabled={isLocating}
                className="bg-white/20 hover:bg-white/30 border-2 border-white/50 backdrop-blur-sm"
              >
                <Locate className={`w-4 h-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Locating...' : 'Find Me'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Simulated Map View */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden border-4 border-white shadow-2xl"
      >
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 20px),
                           repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 20px)`
        }} />

        {/* User Location Marker */}
        {userLocation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg" />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 left-0 w-6 h-6 bg-blue-400 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Event Location Markers */}
        {approvedEvents.slice(0, 6).map((event, index) => {
          const angle = (index * 60) * (Math.PI / 180);
          const radius = 120;
          const x = 50 + radius * Math.cos(angle) / 3;
          const y = 50 + radius * Math.sin(angle) / 3;

          return (
            <motion.div
              key={event.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ scale: 1.3 }}
            >
              <div className={`relative ${selectedEvent?.id === event.id ? 'z-30' : ''}`}>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <MapPin className={`w-8 h-8 ${hasRSVPd(event.id) ? 'text-green-600' : 'text-red-600'} drop-shadow-lg`} fill="currentColor" />
                </motion.div>
                {selectedEvent?.id === event.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap"
                  >
                    <div className="bg-white px-3 py-1 rounded-lg shadow-lg border-2 border-purple-300">
                      <p className="text-sm text-purple-900">{event.name}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm mb-1">
            <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full" />
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <MapPin className="w-4 h-4 text-red-600" fill="currentColor" />
            <span>Available Events</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-green-600" fill="currentColor" />
            <span>RSVP'd Events</span>
          </div>
        </div>
      </motion.div>

      {/* Nearby Events List */}
      <div className="space-y-4">
        <h3 className="text-2xl">Events Sorted by Distance</h3>
        <div className="grid gap-4">
          {nearbyEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-xl transition-all duration-300 border-2 ${
                selectedEvent?.id === event.id ? 'border-purple-500 shadow-lg' : 'hover:border-purple-300'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {event.name}
                        {hasRSVPd(event.id) && (
                          <Badge className="bg-green-600">Going</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">{getEventDistance(event)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 whitespace-nowrap">
                      #{index + 1} Closest
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">{event.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {event.location && (
                      <Badge variant="outline" className="bg-orange-50">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-blue-50">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(event.date)}
                    </Badge>
                    {event.time && (
                      <Badge variant="outline" className="bg-purple-50">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleRSVP(event.id, event.name)}
                      variant={hasRSVPd(event.id) ? 'outline' : 'default'}
                      className={`w-full ${!hasRSVPd(event.id) ? 'bg-gradient-to-r from-green-500 to-teal-500' : ''}`}
                    >
                      {hasRSVPd(event.id) ? 'Cancel RSVP' : 'RSVP to Event'}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

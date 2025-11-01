import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Event, User } from '../types';
import { Calendar as CalendarIcon, Clock, MapPin, Bell, ExternalLink, Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface CalendarSyncProps {
  user: User;
  events: Event[];
}

export function CalendarSync({ user, events }: CalendarSyncProps) {
  const [syncedEvents, setSyncedEvents] = useState<Set<string>>(new Set());
  const [isSyncing, setIsSyncing] = useState(false);

  const rsvpdEvents = events.filter(event => 
    event.status === 'approved' && event.rsvps?.includes(user.id)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingEvents = rsvpdEvents.filter(event => 
    new Date(event.date) >= new Date()
  );

  const pastEvents = rsvpdEvents.filter(event => 
    new Date(event.date) < new Date()
  );

  const generateGoogleCalendarUrl = (event: Event): string => {
    const eventDate = new Date(event.date);
    const startDateTime = event.time 
      ? `${event.date}T${convertTo24Hour(event.time)}`
      : event.date;
    
    // Add 2 hours to the start time for end time
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.name,
      details: event.description + `\n\nTags: ${event.tags.join(', ')}`,
      location: event.location?.name || '',
      dates: `${formatDateForGoogle(startDateTime)}/${formatDateForGoogle(endDate.toISOString())}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const convertTo24Hour = (time: string): string => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (period === 'PM' && hours !== '12') {
      hours = String(parseInt(hours) + 12);
    } else if (period === 'AM' && hours === '12') {
      hours = '00';
    }
    
    return `${hours.padStart(2, '0')}:${minutes || '00'}:00`;
  };

  const formatDateForGoogle = (dateString: string): string => {
    return dateString.replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const handleSyncToGoogleCalendar = (event: Event) => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank');
    setSyncedEvents(prev => new Set([...prev, event.id]));
    toast.success(`Opening Google Calendar for "${event.name}"`);
  };

  const handleSyncAll = () => {
    setIsSyncing(true);
    
    setTimeout(() => {
      upcomingEvents.forEach(event => {
        setSyncedEvents(prev => new Set([...prev, event.id]));
      });
      setIsSyncing(false);
      toast.success(`${upcomingEvents.length} events ready to sync!`);
    }, 1000);
  };

  const generateICSFile = (event: Event): void => {
    const eventDate = new Date(event.date);
    const startDateTime = event.time 
      ? `${event.date}T${convertTo24Hour(event.time)}`
      : event.date;
    
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Campus Unite//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@campusunite.com
DTSTAMP:${formatDateForICS(new Date().toISOString())}
DTSTART:${formatDateForICS(startDateTime)}
DTEND:${formatDateForICS(endDate.toISOString())}
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.location?.name || ''}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`Downloaded calendar file for "${event.name}"`);
  };

  const formatDateForICS = (dateString: string): string => {
    return dateString.replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysUntilEvent = (dateString: string): string => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past event';
    return `In ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-400 via-cyan-400 to-purple-500 text-black rounded-2xl p-8 shadow-[0_0_25px_rgba(0,255,255,0.6)] relative overflow-hidden"
      > 
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.5, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-10 h-10" />
              <div>
                <h2 className="text-3xl">Calendar Sync</h2>
                <p className="opacity-90">Sync your RSVP'd events to Google Calendar</p>
              </div>
            </div>
            {upcomingEvents.length > 0 && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSyncAll}
                  disabled={isSyncing}
                  className="bg-white/20 hover:bg-white/30 border-2 border-white/50 backdrop-blur-sm"
                >
                  <Bell className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-bounce' : ''}`} />
                  {isSyncing ? 'Preparing...' : `Sync All (${upcomingEvents.length})`}
                </Button>
              </motion.div>
            )}
          </div>

          {upcomingEvents.length > 0 && (
            <Alert className="bg-white/20 border-white/30 backdrop-blur-sm">
              <AlertDescription className="text-white">
                <CheckCircle2 className="w-4 h-4 inline mr-2" />
                You have {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? 's' : ''} to sync
              </AlertDescription>
            </Alert>
          )}
        </div>
      </motion.div>

      {rsvpdEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl mb-2">No RSVP'd Events</h3>
          <p className="text-gray-600">
            Once you RSVP to events, they'll appear here for calendar syncing.
          </p>
        </Card>
      ) : (
        <>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl">Upcoming Events ({upcomingEvents.length})</h3>
              <div className="grid gap-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-400">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 mb-2">
                              {event.name}
                              {syncedEvents.has(event.id) && (
                                <Badge className="bg-green-600">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Synced
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-700">{getDaysUntilEvent(event.date)}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(event.date)} {event.time && `• ${event.time}`}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="w-4 h-4" />
                              {event.location.name}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {event.tags.map(tag => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleSyncToGoogleCalendar(event)}
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Add to Google Calendar
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => generateICSFile(event)}
                              variant="outline"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl text-gray-600">Past Events ({pastEvents.length})</h3>
              <div className="grid gap-4 opacity-60">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-gray-300">
                      <CardHeader>
                        <CardTitle className="text-gray-600">{event.name}</CardTitle>
                        <CardDescription>
                          {formatDate(event.date)} {event.time && `• ${event.time}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {event.location && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            {event.location.name}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

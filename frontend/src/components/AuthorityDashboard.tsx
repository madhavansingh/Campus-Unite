import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback } from './ui/avatar';
import { User, Event } from '../types';
import { Calendar, Tag, User as UserIcon, CheckCircle2, XCircle, Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface AuthorityDashboardProps {
  events: Event[];
  onApprove: (eventId: string) => void;
  onDeny: (eventId: string) => void;
}

export function AuthorityDashboard({ events, onApprove, onDeny }: AuthorityDashboardProps) {
  const pendingEvents = events.filter(event => event.status === 'pending');
  const reviewedEvents = events.filter(event => event.status !== 'pending');

  const handleApprove = (eventId: string, eventName: string) => {
    onApprove(eventId);
    toast.success(`Approved "${eventName}"`);
  };

  const handleDeny = (eventId: string, eventName: string) => {
    onDeny(eventId);
    toast.error(`Denied "${eventName}"`);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 left-0 w-40 h-40 bg-green-300 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Shield className="w-10 h-10 text-yellow-300" />
            </motion.div>
            <h2 className="text-4xl">Authority Dashboard</h2>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
          </div>
          <p className="opacity-90 text-lg mb-6">Review and approve event submissions</p>
          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm border border-white/30"
            >
              <div className="text-3xl">{pendingEvents.length}</div>
              <div className="text-sm opacity-90">Pending Review</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/20 rounded-xl px-6 py-3 backdrop-blur-sm border border-white/30"
            >
              <div className="text-3xl">{reviewedEvents.length}</div>
              <div className="text-sm opacity-90">Reviewed</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div>
        <h3 className="text-2xl mb-4">Pending Approvals ({pendingEvents.length})</h3>
        {pendingEvents.length === 0 ? (
          <Alert>
            <AlertDescription>
              No pending events to review. All caught up!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 border-2 border-yellow-200 hover:border-yellow-400 overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{event.name}</CardTitle>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 shrink-0">
                      Pending
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(event.organizerName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-sm">Organized by</span>
                      </div>
                      <div>{event.organizerName}</div>
                    </div>
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
                </CardContent>
                  <CardFooter className="flex gap-2">
                    <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={() => handleApprove(event.id, event.name)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </motion.div>
                    <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        onClick={() => handleDeny(event.id, event.name)}
                        variant="destructive"
                        className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Deny
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl mb-4">Review History ({reviewedEvents.length})</h3>
        {reviewedEvents.length === 0 ? (
          <Alert>
            <AlertDescription>
              No reviewed events yet.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewedEvents.map((event, index) => {
              const gradients = [
                'from-green-500 to-emerald-500',
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-violet-500',
                'from-orange-500 to-amber-500',
                'from-pink-500 to-rose-500',
                'from-teal-500 to-cyan-500',
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="flex flex-col hover:shadow-xl transition-all duration-300 border-2 hover:border-teal-400 overflow-hidden relative">
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
                  <div className="text-sm text-gray-600">
                    By {event.organizerName}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  {event.status === 'approved' && event.rsvps && event.rsvps.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {event.rsvps.length} attendees
                    </div>
                  )}
                  </CardContent>
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

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Event, User } from '../types';
import { Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AISearchPanelProps {
  user: User;
  events: Event[];
}

export function AISearchPanel({ user, events }: AISearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecommendations, setAiRecommendations] = useState<Event[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const userInterests = [
    ...(user.skills || []),
    ...(user.hobbies || [])
  ];

  // AI-powered recommendation algorithm
  const calculateRelevanceScore = (event: Event): number => {
    let score = 0;
    
    // Match tags with user interests
    const matchingTags = event.tags.filter(tag => userInterests.includes(tag));
    score += matchingTags.length * 10;
    
    // Bonus for multiple matches
    if (matchingTags.length > 2) score += 15;
    
    // Time proximity bonus (events happening soon)
    const eventDate = new Date(event.date);
    const today = new Date();
    const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilEvent >= 0 && daysUntilEvent <= 14) {
      score += 10 - (daysUntilEvent / 2);
    }
    
    // Popularity bonus (more RSVPs)
    const rsvpCount = event.rsvps?.length || 0;
    score += Math.min(rsvpCount * 2, 10);
    
    return score;
  };

  useEffect(() => {
    setIsAnalyzing(true);
    
    // Simulate AI processing
    const timeout = setTimeout(() => {
      const approvedEvents = events.filter(event => event.status === 'approved');
      
      // Calculate relevance scores and sort
      const scoredEvents = approvedEvents.map(event => ({
        event,
        score: calculateRelevanceScore(event)
      }));
      
      const recommendations = scoredEvents
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ event }) => event);
      
      setAiRecommendations(recommendations);
      setIsAnalyzing(false);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, [events, user]);

  const filteredRecommendations = aiRecommendations.filter(event => {
    if (!searchQuery) return true;
    
    return event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const getRecommendationReason = (event: Event): string => {
    const matchingTags = event.tags.filter(tag => userInterests.includes(tag));
    
    if (matchingTags.length > 2) {
      return `Highly matches your interests: ${matchingTags.slice(0, 3).join(', ')}`;
    } else if (matchingTags.length > 0) {
      return `Matches your interest in ${matchingTags[0]}`;
    } else {
      return 'Trending on campus';
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
        className="bg-gradient-to-br from-purple-500 via-blue-900 to-brown-500 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>
            <div>
              <h2 className="text-3xl">AI-Powered Recommendations</h2>
              <p className="opacity-0 text-black">Personalized events just for you</p>
            </div>
          </div>

          <div className="relative">
            <Input
              type="text"
              placeholder="Ask AI to find events for you..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/20 border-black text-black placeholder:text-black/70 backdrop-blur-sm"
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 p-4 bg-purple-100 rounded-xl border-2 border-purple-300"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-5 h-5 text-purple-600" />
            </motion.div>
            <span className="text-purple-900">AI is analyzing your preferences...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAnalyzing && (
        <div className="grid gap-4">
          {filteredRecommendations.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">No recommendations available at the moment.</p>
            </Card>
          ) : (
            filteredRecommendations.map((event, index) => {
              const matchingTags = event.tags.filter(tag => userInterests.includes(tag));
              const relevanceScore = calculateRelevanceScore(event);
              
              return (
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
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle>{event.name}</CardTitle>
                            {index === 0 && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Top Pick
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                          <CardDescription className="flex items-start gap-2">
                            <Target className="w-4 h-4 mt-0.5 text-purple-600 shrink-0" />
                            <span className="text-purple-700">{getRecommendationReason(event)}</span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="px-3 py-1 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full border-2 border-purple-300">
                            <span className="text-sm text-purple-900">
                              {relevanceScore}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700">{event.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50">
                          {formatDate(event.date)} {event.time && `• ${event.time}`}
                        </Badge>
                        {event.location && (
                          <Badge variant="outline" className="bg-green-50">
                            {event.location.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map(tag => {
                          const isMatch = matchingTags.includes(tag);
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={isMatch ? 'bg-purple-100 border-purple-400 text-purple-900' : ''}
                            >
                              {isMatch && <Sparkles className="w-3 h-3 mr-1" />}
                              {tag}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
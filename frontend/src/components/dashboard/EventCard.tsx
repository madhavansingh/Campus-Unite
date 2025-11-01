import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Bookmark, Share2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  organizer: string;
  attendees: number;
  price: string;
  aiScore: number;
  tags: string[];
}

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasRSVPd, setHasRSVPd] = useState(false);

  const handleRSVP = () => {
    setHasRSVPd(!hasRSVPd);
    toast({
      title: hasRSVPd ? "RSVP Cancelled" : "RSVP Confirmed!",
      description: hasRSVPd 
        ? "You've cancelled your RSVP" 
        : `See you at ${event.title}`,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from saved" : "Saved!",
      description: isBookmarked 
        ? "Event removed from your saved list" 
        : "Event added to your saved list",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link copied!",
      description: "Event link copied to clipboard",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group border-2 hover:border-primary/20 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* AI Score Badge */}
        <Badge className="absolute top-3 right-3 gradient-primary shadow-glow">
          <Sparkles className="w-3 h-3 mr-1" />
          {event.aiScore}% Match
        </Badge>
        {/* Price Badge */}
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
          {event.price}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>{event.attendees} attending</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button 
          className={`flex-1 rounded-xl ${hasRSVPd ? 'gradient-accent' : 'gradient-primary'}`}
          onClick={handleRSVP}
        >
          {hasRSVPd ? "RSVP'd ✓" : "RSVP Now"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`rounded-xl hover:scale-110 transition-transform ${isBookmarked ? 'bg-primary text-primary-foreground' : ''}`}
          onClick={handleBookmark}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl hover:scale-110 transition-transform"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;

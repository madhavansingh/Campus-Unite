import { Calendar, MapPin, Share2, Bookmark, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  image: string;
  tags: string[];
  date: string;
  location: string;
  isBookmarked?: boolean;
  isRsvped?: boolean;
}

interface EventCardProps {
  event: Event;
  onRsvp: (id: string) => void;
  onBookmark: (id: string) => void;
}

export function EventCard({ event, onRsvp, onBookmark }: EventCardProps) {
  const handleShare = () => {
    toast.success("Link copied to clipboard!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full w-9 h-9 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => onBookmark(event.id)}
          >
            <Bookmark
              className={`w-4 h-4 ${event.isBookmarked ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-bold text-xl mb-2 line-clamp-2">{event.title}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {event.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onRsvp(event.id)}
            className={`flex-1 ${event.isRsvped ? "bg-accent" : ""}`}
            variant={event.isRsvped ? "secondary" : "default"}
          >
            {event.isRsvped ? (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" />
                RSVP'd
              </>
            ) : (
              "RSVP"
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

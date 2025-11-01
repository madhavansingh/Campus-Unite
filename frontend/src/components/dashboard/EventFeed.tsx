import EventCard from "./EventCard";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface EventFeedProps {
  category: string;
  searchQuery: string;
}

// Mock AI-recommended events
const mockEvents = [
  {
    id: "1",
    title: "AI & Machine Learning Hackathon 2025",
    description: "Build innovative AI solutions in 48 hours. Win prizes up to ₹50,000!",
    category: "tech",
    date: "2025-02-15",
    time: "9:00 AM",
    venue: "Tech Hub, Main Campus",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    organizer: "Tech Club OIST",
    attendees: 245,
    price: "Free",
    aiScore: 98,
    tags: ["AI", "Hackathon", "Coding"]
  },
  {
    id: "2",
    title: "UI/UX Design Workshop",
    description: "Learn Figma and design thinking from industry experts",
    category: "design",
    date: "2025-02-10",
    time: "2:00 PM",
    venue: "Design Lab, Building A",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    organizer: "Design Society",
    attendees: 87,
    price: "₹199",
    aiScore: 95,
    tags: ["Design", "Workshop", "Figma"]
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    description: "Present your startup idea to VCs and win funding",
    category: "business",
    date: "2025-02-20",
    time: "10:00 AM",
    venue: "Innovation Center",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd",
    organizer: "E-Cell OIST",
    attendees: 156,
    price: "Free",
    aiScore: 92,
    tags: ["Startup", "Business", "Pitch"]
  },
  {
    id: "4",
    title: "Cultural Fest 2025: Sangam",
    description: "3-day cultural extravaganza with music, dance, and drama",
    category: "cultural",
    date: "2025-03-01",
    time: "5:00 PM",
    venue: "Open Auditorium",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
    organizer: "Cultural Committee",
    attendees: 1200,
    price: "₹299",
    aiScore: 88,
    tags: ["Cultural", "Music", "Dance"]
  },
  {
    id: "5",
    title: "Web3 & Blockchain Seminar",
    description: "Explore decentralized technologies and crypto trends",
    category: "tech",
    date: "2025-02-18",
    time: "3:00 PM",
    venue: "Seminar Hall",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    organizer: "Blockchain Club",
    attendees: 312,
    price: "Free",
    aiScore: 90,
    tags: ["Blockchain", "Web3", "Crypto"]
  },
  {
    id: "6",
    title: "Photography Exhibition & Contest",
    description: "Showcase your best shots and learn from professionals",
    category: "workshop",
    date: "2025-02-12",
    time: "11:00 AM",
    venue: "Art Gallery",
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d",
    organizer: "Photography Club",
    attendees: 94,
    price: "Free",
    aiScore: 85,
    tags: ["Photography", "Art", "Contest"]
  }
];

const EventFeed = ({ category, searchQuery }: EventFeedProps) => {
  // Filter events based on category and search
  const filteredEvents = mockEvents.filter(event => {
    const matchesCategory = category === "all" || event.category === category;
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-card p-4 rounded-2xl shadow-card border-2 border-primary/20 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold text-primary">AI Insights</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Based on your interests in AI, Design, and Startups, we've curated {filteredEvents.length} events perfect for you. 
          Events with higher AI match scores are shown first.
        </p>
      </div>

      {/* Section Headers */}
      {filteredEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Badge className="gradient-primary">Recommended for you</Badge>
          </h2>
        </div>
      )}

      {/* Event Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <div 
              key={event.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}

      {/* Trending Section */}
      {category === "all" && searchQuery === "" && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            Trending near you
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockEvents.slice(3, 5).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFeed;

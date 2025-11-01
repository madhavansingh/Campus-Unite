import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { OnboardingModal } from "./OnboardingModal"; // FIXED: Changed from @/components/OnboardingModal
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Dashboard } from "./Dashboard";
import { BadgesPage } from "./BadgesPage";
import { EventCard } from "./EventCard";
import { Chatbot } from "@/components/Chatbot";
import { AISearchBar } from "@/components/AISearchBar";
import hackathonImage from "@/assets/hackathon-event.jpg";
import musicFestImage from "@/assets/music-fest.jpg";
import artWorkshopImage from "@/assets/art-workshop.jpg";
import sportsMeetImage from "@/assets/sports-meet.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Calendar, Clock } from "lucide-react";

interface UserData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  college: string;
  year: string;
  branch: string;
  interests: string[];
}

interface Event {
  id: string;
  title: string;
  image: string;
  tags: string[];
  date: string;
  location: string;
  isBookmarked?: boolean;
  isRsvped?: boolean;
  isPast?: boolean;
}

interface IndexProps {
  onLogout: () => void;
  onboardingComplete: boolean;
  onOnboardingComplete: () => void;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Innovators Hackathon 2024",
    image: hackathonImage,
    tags: ["Technical", "Hackathon", "AI/ML"],
    date: "Nov 15-17, 2024",
    location: "IIT Delhi Campus",
  },
  {
    id: "2",
    title: "Spring Music Festival",
    image: musicFestImage,
    tags: ["Music", "Cultural", "Entertainment"],
    date: "Nov 20, 2024",
    location: "Open Air Theater",
  },
  {
    id: "3",
    title: "Creative Arts Workshop",
    image: artWorkshopImage,
    tags: ["Art", "Workshop", "Sketching"],
    date: "Nov 22, 2024",
    location: "Art Gallery, Main Campus",
  },
  {
    id: "4",
    title: "Inter-College Sports Championship",
    image: sportsMeetImage,
    tags: ["Sports", "Competition", "Athletics"],
    date: "Nov 25-27, 2024",
    location: "Sports Complex",
  },
  {
    id: "5",
    title: "AI & Machine Learning Symposium",
    image: hackathonImage,
    tags: ["Technical", "AI/ML", "Research"],
    date: "Dec 1, 2024",
    location: "Auditorium Block A",
  },
  {
    id: "6",
    title: "Photography Masterclass",
    image: artWorkshopImage,
    tags: ["Photography", "Workshop", "Art"],
    date: "Dec 5, 2024",
    location: "Media Center",
  },
];

const Index = ({ onLogout, onboardingComplete, onOnboardingComplete }: IndexProps) => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(!onboardingComplete);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [points, setPoints] = useState(250);
  const [events, setEvents] = useState(mockEvents);
  const [reminders, setReminders] = useState<string[]>([]);

  // Load saved user data if onboarding is complete
  useEffect(() => {
    if (onboardingComplete) {
      const savedUserData = localStorage.getItem("userData");
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
        setShowOnboarding(false);
      }
    }
  }, [onboardingComplete]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (userData && !showOnboarding) {
      setTimeout(() => {
        toast.success("🎉 New event added near you: Data Science Bootcamp!", {
          duration: 4000,
        });
      }, 2000);
    }
  }, [userData, showOnboarding]);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setShowOnboarding(false);
    localStorage.setItem("userData", JSON.stringify(data));
    onOnboardingComplete(); // Update parent state
    toast.success(`Welcome aboard, ${data.fullName.split(" ")[0]}! 🎉`);
  };

  const handleRsvp = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, isRsvped: !e.isRsvped } : e
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event && !event.isRsvped) {
      setPoints(prev => prev + 50);
      toast.success("RSVP confirmed! +50 points 🎉");
    }
  };

  const handleBookmark = (eventId: string) => {
    setEvents(events.map(e =>
      e.id === eventId ? { ...e, isBookmarked: !e.isBookmarked } : e
    ));
    
    const event = events.find(e => e.id === eventId);
    toast.success(event?.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks!");
  };

  const handleToggleReminder = (eventId: string) => {
    setReminders(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    
    const hasReminder = reminders.includes(eventId);
    toast.success(hasReminder ? "Reminder removed" : "Reminder set! 🔔");
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    onLogout();
    navigate("/");
    toast.success("Logged out successfully! 👋");
  };

  // FIRST: Show onboarding modal if not completed
  if (showOnboarding) {
    return <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />;
  }

  // THEN: Show dashboard after onboarding is complete
  const firstName = userData?.fullName.split(" ")[0] || "Student";
  const rsvpedEvents = events.filter(e => e.isRsvped);
  const bookmarkedEvents = events.filter(e => e.isBookmarked);
  const aiRecommendedEvents = events.slice(0, 4);

  const stats = {
    upcomingRsvps: rsvpedEvents.filter(e => !e.isPast).length,
    savedEvents: bookmarkedEvents.length,
    badgesEarned: 2,
    aiRecommendations: aiRecommendedEvents.length,
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <Navbar
        userName={firstName}
        points={points}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />

      <div className="flex w-full">
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-8">
          {activePage === "home" && <Dashboard userName={firstName} stats={stats} />}

          {activePage === "foryou" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">For You ✨</h1>
                <p className="text-muted-foreground">AI-curated events based on your interests</p>
              </div>
              
              {/* AI Search Bar */}
              <AISearchBar onSearch={(query) => {
                toast.success(`Searching for: ${query}`);
                // Filter logic would go here
              }} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiRecommendedEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRsvp={handleRsvp}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activePage === "rsvps" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">My RSVPs 📅</h1>
                <p className="text-muted-foreground">Events you're attending</p>
              </div>

              <Tabs defaultValue="upcoming">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4 mt-6">
                  {rsvpedEvents.filter(e => !e.isPast).length === 0 ? (
                    <Card className="p-12 text-center">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No upcoming RSVPs yet</p>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {rsvpedEvents.filter(e => !e.isPast).map(event => (
                        <Card key={event.id} className="p-6">
                          <div className="flex gap-4">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-32 h-32 rounded-xl object-cover"
                            />
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-bold text-xl">{event.title}</h3>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {event.date}
                                  </span>
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant={reminders.includes(event.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleToggleReminder(event.id)}
                                >
                                  {reminders.includes(event.id) ? (
                                    <>
                                      <Bell className="w-4 h-4 mr-2" />
                                      Reminder On
                                    </>
                                  ) : (
                                    <>
                                      <BellOff className="w-4 h-4 mr-2" />
                                      Set Reminder
                                    </>
                                  )}
                                </Button>
                                 <Button 
                                   variant="outline" 
                                   size="sm"
                                   onClick={() => {
                                     const calendarEvent = {
                                       id: event.id,
                                       title: event.title,
                                       date: event.date,
                                       location: event.location,
                                       description: event.tags.join(', ')
                                     };
                                     const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${encodeURIComponent(calendarEvent.date.replace(/[^0-9]/g, ''))}/${encodeURIComponent(calendarEvent.date.replace(/[^0-9]/g, ''))}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
                                     window.open(url, '_blank');
                                     toast.success('Opening Google Calendar...');
                                   }}
                                 >
                                   <Calendar className="w-4 h-4 mr-2" />
                                   Add to Calendar
                                 </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                  <Card className="p-12 text-center">
                    <p className="text-muted-foreground">No past events yet</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {activePage === "bookmarks" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl font-bold mb-2">Bookmarks 🔖</h1>
                <p className="text-muted-foreground">Events you've saved for later</p>
              </div>

              {bookmarkedEvents.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No bookmarked events yet</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRsvp={handleRsvp}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activePage === "badges" && <BadgesPage />}

          {activePage === "settings" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl font-bold mb-2">Settings ⚙️</h1>
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-4">Profile Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{userData?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{userData?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">College:</span>
                    <span className="font-medium">{userData?.college}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span className="font-medium">{userData?.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch:</span>
                    <span className="font-medium">{userData?.branch}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </main>
      </div>

      <Chatbot type="student" />
    </div>
  );
};

export default Index;
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiPlus,
  FiCalendar,
  FiBarChart2,
  FiBell,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch,
  FiUser,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMessageCircle,
  FiSun,
  FiMoon,
  FiLogOut,
} from "react-icons/fi";
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import confetti from "canvas-confetti";
import { Chatbot } from "@/components/Chatbot";

const Index = ({ onLogout }: { onLogout?: () => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    tags: [],
    category: "",
    location: "",
    date: "",
    time: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock data
  const stats = [
    { label: "Total Events", value: "24", change: "+12%", gradient: "from-[hsl(var(--gradient-teal))] to-[hsl(var(--gradient-purple))]" },
    { label: "Approved Events", value: "18", change: "+8%", gradient: "from-[hsl(var(--gradient-coral))] to-[hsl(var(--gradient-blue))]" },
    { label: "Pending Approvals", value: "6", change: "-2%", gradient: "from-[hsl(var(--gradient-pink))] to-[hsl(var(--gradient-orange))]" },
    { label: "Total Attendees", value: "1,247", change: "+23%", gradient: "from-purple-500 to-pink-500" },
  ];

  const mockEvents = [
    {
      id: 1,
      title: "AI Bootcamp 2025",
      date: "2025-02-15",
      status: "Approved",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
      attendees: 324,
    },
    {
      id: 2,
      title: "Startup Networking Night",
      date: "2025-02-20",
      status: "Pending",
      category: "Business",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
      attendees: 156,
    },
    {
      id: 3,
      title: "Design Thinking Workshop",
      date: "2025-02-25",
      status: "Approved",
      category: "Design",
      image: "https://images.unsplash.com/photo-1558403194-611308249627?w=400",
      attendees: 89,
    },
    {
      id: 4,
      title: "Blockchain Conference",
      date: "2025-03-01",
      status: "Approved",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
      attendees: 512,
    },
    {
      id: 5,
      title: "Marketing Masterclass",
      date: "2025-03-05",
      status: "Pending",
      category: "Business",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
      attendees: 203,
    },
    {
      id: 6,
      title: "Creative Coding Jam",
      date: "2025-03-10",
      status: "Approved",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      attendees: 145,
    },
  ];

  const attendanceData = [
    { month: "Jan", attendees: 450 },
    { month: "Feb", attendees: 680 },
    { month: "Mar", attendees: 820 },
    { month: "Apr", attendees: 1020 },
    { month: "May", attendees: 1247 },
  ];

  const categoryData = [
    { name: "Technology", value: 45 },
    { name: "Business", value: 30 },
    { name: "Design", value: 15 },
    { name: "Other", value: 10 },
  ];

  const engagementData = [
    { name: "Week 1", engagement: 65 },
    { name: "Week 2", engagement: 72 },
    { name: "Week 3", engagement: 81 },
    { name: "Week 4", engagement: 88 },
  ];

  const COLORS = ["#14b8a6", "#8b5cf6", "#f97316", "#ec4899"];

  const navItems = [
    { icon: FiHome, label: "Dashboard", view: "dashboard" },
    { icon: FiPlus, label: "Create Event", action: () => setShowCreateModal(true) },
    { icon: FiCalendar, label: "My Events", view: "events" },
    { icon: FiBarChart2, label: "Analytics", view: "analytics" },
    { icon: FiBell, label: "Notifications", view: "notifications" },
    { icon: FiSettings, label: "Settings", view: "settings" },
  ];

  const handleCreateEvent = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setShowCreateModal(false);
    setEventForm({
      title: "",
      description: "",
      tags: [],
      category: "",
      location: "",
      date: "",
      time: "",
    });
  };

  const generateAITags = () => {
    const aiTags = ["AI", "Machine Learning", "Innovation", "Networking"];
    setEventForm({ ...eventForm, tags: aiTags });
  };

  const addTag = () => {
    if (tagInput.trim() && !eventForm.tags.includes(tagInput.trim())) {
      setEventForm({ ...eventForm, tags: [...eventForm.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setEventForm({ ...eventForm, tags: eventForm.tags.filter((t) => t !== tag) });
  };

  const filteredEvents = mockEvents.filter((event) => {
    const statusMatch = filterStatus === "all" || event.status.toLowerCase() === filterStatus.toLowerCase();
    const categoryMatch = filterCategory === "all" || event.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-2xl font-bold gradient-text">EventHub</h1>
                  <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-2">
                  {navItems.map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => (item.action ? item.action() : setCurrentView(item.view!))}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        currentView === item.view
                          ? "bg-gradient-to-r from-[hsl(var(--gradient-teal))] to-[hsl(var(--gradient-purple))] text-white shadow-lg"
                          : "hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Logout Button */}
              <div className="p-6 border-t border-border mt-auto">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive transition-all font-medium"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          {/* Navbar */}
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <FiMenu className="w-6 h-6" />
                </button>
                <div className="relative hidden md:block">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search events or insights…"
                    className="pl-10 pr-4 py-2 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary w-80"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                  {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                </button>
                <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                  <FiBell className="w-6 h-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[hsl(var(--gradient-coral))] to-[hsl(var(--gradient-pink))] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {notifications}
                    </span>
                  )}
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-[hsl(var(--gradient-teal))] to-[hsl(var(--gradient-purple))] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  + New Event
                </motion.button>
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--gradient-pink))] to-[hsl(var(--gradient-orange))] rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6">
            <AnimatePresence mode="wait">
              {currentView === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Madhavan 👋</h2>
                  <p className="text-muted-foreground mb-8">Here's what's happening with your events today.</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                      >
                        <p className="text-white/80 text-sm font-medium mb-2">{stat.label}</p>
                        <p className="text-4xl font-bold mb-2">{stat.value}</p>
                        <p className="text-white/90 text-sm flex items-center gap-1">
                          <span className={stat.change.startsWith("+") ? "text-green-200" : "text-red-200"}>{stat.change}</span>
                          <span className="text-white/70">from last month</span>
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Calendar Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-2xl p-6 shadow-xl border border-border"
                  >
                    <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
                    <div className="grid gap-4">
                      {mockEvents.slice(0, 3).map((event, idx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === "Approved" ? "bg-green-500/20 text-green-600" : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {event.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {currentView === "events" && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">My Events</h2>
                    <div className="flex gap-3">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                      </select>
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Categories</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, idx) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-card rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-border"
                      >
                        <div className="relative">
                          <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                          <span
                            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                              event.status === "Approved"
                                ? "bg-green-500/80 text-white"
                                : "bg-yellow-500/80 text-white"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <FiCalendar className="w-4 h-4" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <FiUser className="w-4 h-4" />
                            <span>{event.attendees} attendees</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 text-sm">
                              <FiEdit className="w-4 h-4" />
                              Edit
                            </button>
                            <button className="flex-1 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 text-sm">
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                            <button className="flex-1 px-3 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors flex items-center justify-center gap-2 text-sm">
                              <FiEye className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentView === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-3xl font-bold mb-8">Analytics Dashboard</h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-card rounded-2xl p-6 shadow-xl border border-border"
                    >
                      <h3 className="text-xl font-bold mb-4">Attendance Over Time</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={attendanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                          <Legend />
                          <Line type="monotone" dataKey="attendees" stroke="hsl(var(--gradient-teal))" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-card rounded-2xl p-6 shadow-xl border border-border"
                    >
                      <h3 className="text-xl font-bold mb-4">Event Popularity by Category</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label>
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-card rounded-2xl p-6 shadow-xl border border-border lg:col-span-2"
                    >
                      <h3 className="text-xl font-bold mb-4">User Engagement Rate</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                          <YAxis stroke="hsl(var(--foreground))" />
                          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
                          <Legend />
                          <Bar dataKey="engagement" fill="hsl(var(--gradient-purple))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* Create Event Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowCreateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-border"
              >
                <div className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border p-6 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold">Create New Event</h2>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 p-6">
                  {/* Form Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Event Title</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="Enter event title..."
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Describe your event..."
                        rows={4}
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addTag()}
                          placeholder="Add a tag..."
                          className="flex-1 px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={generateAITags}
                          className="px-4 py-3 bg-gradient-to-r from-[hsl(var(--gradient-pink))] to-[hsl(var(--gradient-orange))] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
                        >
                          AI Suggest
                        </motion.button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {eventForm.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)} className="hover:bg-primary/30 rounded-full p-0.5">
                              <FiX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Category</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a category...</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Location</label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        placeholder="Enter location..."
                        className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Date</label>
                        <input
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Time</label>
                        <input
                          type="time"
                          value={eventForm.time}
                          onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                          className="w-full px-4 py-3 bg-muted rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateEvent}
                      className="w-full px-6 py-4 bg-gradient-to-r from-[hsl(var(--gradient-teal))] to-[hsl(var(--gradient-purple))] text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                    >
                      Create Event
                    </motion.button>
                  </div>

                  {/* Live Preview Section */}
                  <div className="bg-muted/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Live Preview</h3>
                    <div className="bg-card rounded-xl overflow-hidden shadow-lg border border-border">
                      <div className="h-48 bg-gradient-to-r from-[hsl(var(--gradient-teal))] to-[hsl(var(--gradient-purple))] flex items-center justify-center">
                        <FiCalendar className="w-16 h-16 text-white/50" />
                      </div>
                      <div className="p-5">
                        <h4 className="text-xl font-bold mb-2">{eventForm.title || "Event Title"}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{eventForm.description || "Event description will appear here..."}</p>
                        {eventForm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {eventForm.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {eventForm.category && (
                          <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold mb-3">
                            {eventForm.category}
                          </span>
                        )}
                        {eventForm.location && (
                          <p className="text-sm text-muted-foreground mb-2">📍 {eventForm.location}</p>
                        )}
                        {(eventForm.date || eventForm.time) && (
                          <p className="text-sm text-muted-foreground">
                            🗓️ {eventForm.date} {eventForm.time && `at ${eventForm.time}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chatbot */}
        <Chatbot type="organizer" />
      </div>
    </div>
  );
};

export default Index;
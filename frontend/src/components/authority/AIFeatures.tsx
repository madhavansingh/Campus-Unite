import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Trophy, Zap, Target, Users, BarChart3 } from "lucide-react";

export function AIAssistantCard() {
  const suggestions = [
    { icon: Sparkles, text: "AI Workshop Series recommended", color: "text-primary" },
    { icon: TrendingUp, text: "Tech events showing +35% demand", color: "text-success" },
    { icon: Users, text: "Weekend slots 67% more popular", color: "text-accent" },
    { icon: Target, text: "Hybrid format highly preferred", color: "text-warning" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="glass p-6 rounded-2xl shadow-glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-accent">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Smart recommendations for you</p>
          </div>
        </div>

        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
              >
                <Icon size={20} className={suggestion.color} />
                <p className="text-sm font-medium flex-1">{suggestion.text}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

export function PredictEngagementCard() {
  const predictions = [
    { event: "Robotics Symposium", score: 89, trend: "high", color: "success" },
    { event: "AI Workshop Series", score: 92, trend: "high", color: "success" },
    { event: "Design Sprint", score: 76, trend: "medium", color: "warning" },
    { event: "Green Campus Initiative", score: 68, trend: "medium", color: "warning" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="glass p-6 rounded-2xl shadow-glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success/70">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Predict Engagement</h3>
            <p className="text-sm text-muted-foreground">AI-powered success forecast</p>
          </div>
        </div>

        <div className="space-y-3">
          {predictions.map((pred, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="p-4 rounded-xl bg-muted/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{pred.event}</span>
                <Badge
                  variant={pred.color === "success" ? "default" : "secondary"}
                  className={pred.color === "success" ? "bg-success text-success-foreground" : "bg-warning/20 text-warning-foreground"}
                >
                  {pred.score}% Match
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    pred.color === "success" ? "bg-success" : "bg-warning"
                  }`}
                  style={{ width: `${pred.score}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full mt-4 bg-success hover:bg-success/90 text-success-foreground">
          <TrendingUp size={16} className="mr-2" />
          View Detailed Analysis
        </Button>
      </Card>
    </motion.div>
  );
}

export function TrendSummaryCard() {
  const trends = [
    { label: "Tech Events", value: "+35%", trend: "up", color: "text-success" },
    { label: "Hybrid Format", value: "67%", trend: "stable", color: "text-primary" },
    { label: "Weekend Attendance", value: "+42%", trend: "up", color: "text-success" },
    { label: "Student Engagement", value: "89%", trend: "up", color: "text-success" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass p-6 rounded-2xl shadow-glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Trend Summary</h3>
            <p className="text-sm text-muted-foreground">Real-time campus insights</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {trends.map((trend, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted cursor-pointer"
            >
              <p className="text-xs text-muted-foreground mb-1">{trend.label}</p>
              <p className={`text-2xl font-bold ${trend.color}`}>{trend.value}</p>
              {trend.trend === "up" && (
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={14} className="text-success" />
                  <span className="text-xs text-success">Trending</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

export function TopEventsCard() {
  const topEvents = [
    {
      rank: 1,
      title: "AI & ML Workshop",
      attendees: 324,
      engagement: 92,
      badge: "🏆 Most Popular",
    },
    {
      rank: 2,
      title: "Startup Pitch Competition",
      attendees: 234,
      engagement: 88,
      badge: "🔥 Trending",
    },
    {
      rank: 3,
      title: "Blockchain Conference",
      attendees: 512,
      engagement: 86,
      badge: "⭐ Top Rated",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="glass p-6 rounded-2xl shadow-glass">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-warning">
            <Trophy size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Top Events</h3>
            <p className="text-sm text-muted-foreground">Best performing this month</p>
          </div>
        </div>

        <div className="space-y-4">
          {topEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all cursor-pointer"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                  event.rank === 1
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                    : event.rank === 2
                    ? "bg-gradient-to-br from-gray-300 to-gray-500"
                    : "bg-gradient-to-br from-orange-400 to-orange-600"
                } text-white`}
              >
                {event.rank}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{event.title}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {event.attendees} RSVPs
                  </span>
                  <span>{event.engagement}% engagement</span>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {event.badge}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

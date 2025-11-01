import { Calendar, Bookmark, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface DashboardProps {
  userName: string;
  stats: {
    upcomingRsvps: number;
    savedEvents: number;
    badgesEarned: number;
    aiRecommendations: number;
  };
}

export function Dashboard({ userName, stats }: DashboardProps) {
  const statCards = [
    {
      title: "Upcoming RSVPs",
      value: stats.upcomingRsvps,
      icon: Calendar,
      gradient: "from-primary to-primary/80"
    },
    {
      title: "Saved Events",
      value: stats.savedEvents,
      icon: Bookmark,
      gradient: "from-secondary to-secondary/80"
    },
    {
      title: "Badges Earned",
      value: stats.badgesEarned,
      icon: Trophy,
      gradient: "from-accent to-accent/80"
    },
    {
      title: "AI Picks",
      value: stats.aiRecommendations,
      icon: Sparkles,
      gradient: "from-primary via-secondary to-accent"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold">
          Hey {userName} 👋
        </h1>
        <p className="text-xl text-muted-foreground">
          Ready to explore what's happening around you?
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <div className="relative p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 border border-border"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Insights</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Based on your interests in <span className="text-primary font-semibold">Technical, Music,</span> and <span className="text-primary font-semibold">Sports</span>, we've curated {stats.aiRecommendations} perfect events for you!
        </p>
        <div className="flex flex-wrap gap-2">
          <div className="px-4 py-2 bg-primary/20 rounded-full text-sm font-medium">
            🎯 3 Hackathons nearby
          </div>
          <div className="px-4 py-2 bg-secondary/20 rounded-full text-sm font-medium">
            🎵 2 Music events this week
          </div>
          <div className="px-4 py-2 bg-accent/20 rounded-full text-sm font-medium">
            ⚽ 1 Sports championship
          </div>
        </div>
      </motion.div>
    </div>
  );
}

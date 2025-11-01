import { motion } from "framer-motion";
import { Trophy, Lock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

const badges: Badge[] = [
  {
    id: "early-bird",
    name: "Early Bird",
    description: "RSVP to your first event",
    icon: "🕒",
    unlocked: true
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Attend 5+ events",
    icon: "🌍",
    unlocked: true,
    progress: 5,
    maxProgress: 5
  },
  {
    id: "connector",
    name: "Connector",
    description: "Share 3+ events with friends",
    icon: "🤝",
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: "enthusiast",
    name: "Enthusiast",
    description: "Attend 10+ events",
    icon: "🎉",
    unlocked: false,
    progress: 5,
    maxProgress: 10
  },
  {
    id: "influencer",
    name: "Influencer",
    description: "Invite 5 friends to events",
    icon: "⭐",
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: "champion",
    name: "Champion",
    description: "Attend events in all categories",
    icon: "🏆",
    unlocked: false,
    progress: 3,
    maxProgress: 6
  }
];

export function BadgesPage() {
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalPoints = unlockedCount * 100;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Your Achievements 🏆</h1>
        <p className="text-muted-foreground">Unlock badges and earn points by participating in events</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-primary via-secondary to-accent p-8 rounded-2xl text-primary-foreground"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">{totalPoints} Points</h2>
            <p className="opacity-90">{unlockedCount} of {badges.length} badges unlocked</p>
          </div>
          <Trophy className="w-16 h-16 opacity-80" />
        </div>
        <Progress value={(unlockedCount / badges.length) * 100} className="h-3 bg-background/20" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 relative overflow-hidden group transition-all duration-300 ${
              badge.unlocked
                ? "border-primary shadow-lg hover:shadow-2xl"
                : "opacity-75 hover:opacity-100"
            }`}>
              {badge.unlocked && (
                <div className="absolute top-0 right-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary transform rotate-45 translate-x-8 -translate-y-8" />
                  <Sparkles className="absolute top-2 right-2 w-5 h-5 text-primary-foreground" />
                </div>
              )}

              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 ${
                  badge.unlocked
                    ? "bg-gradient-to-br from-primary/20 to-secondary/20"
                    : "bg-muted"
                }`}>
                  {badge.unlocked ? badge.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
                </div>

                <h3 className="font-bold text-xl mb-2">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{badge.description}</p>

                {!badge.unlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2" />
                  </div>
                )}

                {badge.unlocked && (
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Trophy className="w-4 h-4" />
                    <span>Unlocked! +100 points</span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

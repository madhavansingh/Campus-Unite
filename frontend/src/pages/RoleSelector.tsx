import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createProfile } from "@/lib/supabase";
import { toast } from "sonner";

interface RoleSelectorProps {
  userId: string;
  email: string;
}

export default function RoleSelector({ userId, email }: RoleSelectorProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "student",
      title: "Student",
      icon: User,
      description: "Discover and attend campus events",
      route: "/student",
    },
    {
      id: "organizer",
      title: "Organizer",
      icon: Building2,
      description: "Create and manage events",
      route: "/organizer",
    },
    {
      id: "authority",
      title: "Authority",
      icon: Shield,
      description: "Approve events and view analytics",
      route: "/authority",
    },
  ];

  const handleContinue = async () => {
    if (!selected) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    const { error } = await createProfile(userId, {
      full_name: email.split('@')[0],
      email,
      role: selected,
      college: "Demo College",
      year: "2024",
      branch: "General",
      interests: [],
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const role = roles.find(r => r.id === selected);
    navigate(role?.route || "/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select how you'd like to use Campus Unite
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  className={`p-6 cursor-pointer transition-all ${
                    selected === role.id
                      ? "border-primary border-2 bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelected(role.id)}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selected === role.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full"
          size="lg"
        >
          Continue as {roles.find(r => r.id === selected)?.title || "..."}
        </Button>
      </motion.div>
    </div>
  );
}
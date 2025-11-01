import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Shield, Sparkles } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: "user" | "organizer" | "authority") => void;
}

const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "user" | "organizer" | "authority") => {
    onRoleSelect(role);
    navigate(`/${role}`);
  };

  const roles = [
    {
      id: "user",
      title: "Student",
      description: "Discover and join events tailored to your interests",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      id: "organizer",
      title: "Organizer",
      description: "Create, manage, and promote your campus events",
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      id: "authority",
      title: "Authority",
      description: "Oversee and manage all campus events and activities",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-hero">
      <div className="w-full max-w-4xl">
        <Card className="shadow-card-hover border-2 animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <CardTitle className="text-3xl font-bold">Choose Your Role</CardTitle>
            </div>
            <CardDescription className="text-lg">
              Select the role that best describes you on Campus Unite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div
                    key={role.id}
                    className="group cursor-pointer"
                    onClick={() => handleRoleSelect(role.id as "user" | "organizer" | "authority")}
                  >
                    <Card className={`${role.bgColor} h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-primary`}>
                      <CardContent className="pt-8 text-center">
                        <Icon className={`w-16 h-16 ${role.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                        <h3 className="text-2xl font-semibold mb-3">{role.title}</h3>
                        <p className="text-muted-foreground mb-6">{role.description}</p>
                        <Button
                          className="w-full gradient-primary rounded-xl py-6"
                          onClick={() => handleRoleSelect(role.id as "user" | "organizer" | "authority")}
                        >
                          Continue as {role.title}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;
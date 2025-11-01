import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Sparkles, User, Home, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  onToggleChatbot: () => void;
}

const DashboardHeader = ({ onToggleChatbot }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Campus Unite</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost" onClick={() => navigate("/dashboard")} className="font-medium">
              <Home className="w-4 h-4 mr-2" />
              For You
            </Button>
            <Button variant="ghost" onClick={() => navigate("/explore")} className="font-medium">
              Explore
            </Button>
            <Button variant="ghost" onClick={() => navigate("/my-events")} className="font-medium">
              My Events
            </Button>
            <Button variant="ghost" onClick={() => navigate("/saved")} className="font-medium">
              Saved
            </Button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-xl hover:scale-105 transition-transform"
              onClick={onToggleChatbot}
            >
              <MessageCircle className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 gradient-accent">
                AI
              </Badge>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="relative rounded-xl hover:scale-105 transition-transform"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

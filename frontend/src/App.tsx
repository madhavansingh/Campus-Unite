import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Authorization Pages ---
import Home from "./pages/authorization/Home";
import Auth from "./pages/authorization/Auth";
import NotFound from "./pages/authorization/NotFound";

// --- Dashboards ---
import UserDashboard from "./pages/user/Index";
import OrganizerDashboard from "./pages/organizer/Index";
import AuthorityDashboard from "./pages/authority/Index";

// --- Role Selector ---
import RoleSelector from "./pages/authorization/RoleSelector";

interface User {
  id: string;
  email: string;
  role?: "user" | "organizer" | "authority";
  onboardingComplete?: boolean;
}

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleRoleSelect = (role: "user" | "organizer" | "authority") => {
    if (user) {
      const updatedUser = { ...user, role, onboardingComplete: false };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleOnboardingComplete = () => {
    if (user) {
      const updatedUser = { ...user, onboardingComplete: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<Home />} />

            {/* Auth Route - redirect if already logged in */}
            <Route
              path="/auth"
              element={user ? <Navigate to="/select-role" /> : <Auth onLogin={handleLogin} />}
            />

            {/* Role Selection Route */}
            <Route
              path="/select-role"
              element={
                !user ? (
                  <Navigate to="/auth" />
                ) : user.role ? (
                  <Navigate to={`/${user.role}`} />
                ) : (
                  <RoleSelector onRoleSelect={handleRoleSelect} />
                )
              }
            />

            {/* User Dashboard */}
            <Route
              path="/user/*"
              element={
                !user || user.role !== "user" ? (
                  <Navigate to="/auth" />
                ) : (
                  <UserDashboard 
                    onLogout={handleLogout} 
                    onboardingComplete={user.onboardingComplete || false}
                    onOnboardingComplete={handleOnboardingComplete}
                  />
                )
              }
            />

            {/* Organizer Dashboard */}
            <Route
              path="/organizer/*"
              element={
                !user || user.role !== "organizer" ? (
                  <Navigate to="/auth" />
                ) : (
                  <OrganizerDashboard onLogout={handleLogout} />
                )
              }
            />

            {/* Authority Dashboard */}
            <Route
              path="/authority/*"
              element={
                !user || user.role !== "authority" ? (
                  <Navigate to="/auth" />
                ) : (
                  <AuthorityDashboard onLogout={handleLogout} />
                )
              }
            />

            {/* Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
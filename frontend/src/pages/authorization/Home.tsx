import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Calendar, Users, TrendingUp, Brain, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[120%] h-[120%] top-0 left-0 bg-gradient-to-r from-primary/40 via-blue-500/30 to-accent/40 opacity-70 blur-3xl animate-pulse" />
        <div className="absolute w-[100%] h-[100%] bottom-0 right-0 bg-gradient-to-br from-secondary/40 via-accent/30 to-primary/40 opacity-70 blur-2xl animate-[float_10s_ease-in-out_infinite]" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Event Discovery
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Never Miss a{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Campus Event
              </span>
              {" "}Again
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Campus Unite uses AI to recommend events tailored to your interests. 
              Discover workshops, hackathons and activities that matter to you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary via-blue-500 to-primary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-transform shadow-lg"
                onClick={() => navigate("/auth")}
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-2xl hover:scale-105 transition-transform border-2"
                onClick={() => navigate("/select-role")}
              >
                Explore Events
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { label: "Active Events", value: "50+", icon: Calendar },
              { label: "Colleges", value: "10K+", icon: Users },
              { label: "Accuracy", value: "95%", icon: TrendingUp },
              { label: "AI Matches", value: "50K+", icon: Brain },
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powered by AI</h2>
            <p className="text-xl text-muted-foreground">Smart features that learn from you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Personalized Feed",
                description: "AI learns your interests and recommends events you'll love",
                color: "text-primary"
              },
              {
                icon: Zap,
                title: "AI Recommendation Model",
                description: "Personalizes event discovery with intelligent insights",
                color: "text-accent"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Search Engine",
                description: "Smarter results. Faster discovery.",
                color: "text-primary"
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group"
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-3xl p-12 border shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
            <div className="relative text-center space-y-6">
              <h2 className="text-4xl font-bold">
                Ready to Transform Your Campus Experience?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of students discovering events they love
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

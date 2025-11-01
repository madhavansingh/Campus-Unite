import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface CampusBuddyProps {
  onClose: () => void;
}

const CampusBuddy = ({ onClose }: CampusBuddyProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm Campus Buddy, your AI assistant. I can help you find events, answer questions, and give recommendations. Try asking me something like 'Show me AI workshops this weekend' or 'What events are trending?'"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (ready for Lovable AI integration)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getAIResponse = (query: string) => {
    const q = query.toLowerCase();
    
    if (q.includes("ai") || q.includes("machine learning") || q.includes("hackathon")) {
      return "I found the AI & Machine Learning Hackathon 2025 happening on Feb 15th! It's a 48-hour event at Tech Hub with ₹50,000 in prizes. With a 98% AI match to your interests, I highly recommend this event. Would you like to RSVP?";
    }
    if (q.includes("design") || q.includes("ui") || q.includes("ux")) {
      return "There's a UI/UX Design Workshop on Feb 10th at the Design Lab! You'll learn Figma and design thinking from industry experts. It's ₹199 and has an 95% match with your profile. Interested?";
    }
    if (q.includes("trending") || q.includes("popular")) {
      return "The most trending events right now are:\n1. AI & Machine Learning Hackathon (245 attendees)\n2. Startup Pitch Competition (156 attendees)\n3. Cultural Fest 2025 (1200+ interested)\n\nWhich one catches your eye?";
    }
    if (q.includes("free") || q.includes("no cost")) {
      return "I found several free events for you:\n• AI & Machine Learning Hackathon\n• Startup Pitch Competition\n• Web3 & Blockchain Seminar\n• Photography Exhibition\n\nAll are highly matched to your interests!";
    }
    
    return "I understand you're looking for events. Could you be more specific? You can ask me about:\n• Specific event categories (AI, Design, Business, etc.)\n• Free vs paid events\n• Events by date or venue\n• Trending events\n• Recommendations based on your interests";
  };

  const quickPrompts = [
    "Show me AI events",
    "What's trending?",
    "Free events this week",
    "Design workshops"
  ];

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-card-hover border-2 border-primary/20 flex flex-col animate-slide-in-right z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b gradient-primary">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-foreground" />
          <div>
            <h3 className="font-semibold text-primary-foreground">Campus Buddy</h3>
            <Badge variant="secondary" className="text-xs">AI Assistant</Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-3 ${
                  message.role === "user"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {quickPrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              className="text-xs rounded-xl"
              onClick={() => {
                setInput(prompt);
                setTimeout(() => handleSend(), 100);
              }}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="rounded-xl"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="gradient-accent rounded-xl"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CampusBuddy;

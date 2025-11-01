import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotProps {
  type?: 'student' | 'organizer' | 'authority';
}

export function Chatbot({ type = 'student' }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: type === 'student' 
        ? '👋 Hi! I can help you discover events. Try asking "Show me AI hackathons" or "Find music events this weekend"'
        : type === 'organizer'
        ? '👋 Hi! I can help you manage your events. Ask me about engagement tips or event promotion strategies!'
        : '👋 Hi! I can help you with event approvals, engagement predictions, and trend analysis!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    if (type === 'student') {
      if (lower.includes('hackathon') || lower.includes('ai') || lower.includes('tech')) {
        return "🚀 I found 3 hackathons for you:\n\n1. **AI Innovators Hackathon** - Nov 15, Prize: ₹50,000\n2. **Tech Future Challenge** - Nov 20, Virtual\n3. **CodeFest 2024** - Nov 25, IIT Delhi\n\nWould you like to RSVP or get more details?";
      }
      if (lower.includes('music') || lower.includes('concert')) {
        return "🎵 Here are upcoming music events:\n\n1. **Spring Music Festival** - Nov 20\n2. **Rock Night** - Nov 22\n3. **Classical Evening** - Nov 28\n\nAll are near your campus!";
      }
      if (lower.includes('free') || lower.includes('no cost')) {
        return "💰 Found 5 free events:\n- Design Thinking Workshop (Nov 18)\n- Photography Walk (Nov 21)\n- Open Mic Night (Nov 23)\n\nShall I add them to your calendar?";
      }
    } else if (type === 'organizer') {
      if (lower.includes('engagement') || lower.includes('promote')) {
        return "📊 Tips to boost engagement:\n\n1. Post 2 weeks before event\n2. Use hashtags: #CampusEvents #StudentLife\n3. Share on social media daily\n4. Offer early bird perks\n5. Collaborate with other clubs\n\nYour avg engagement: 78% (+12% this month)";
      }
      if (lower.includes('best time') || lower.includes('when')) {
        return "⏰ Best time to host events:\n- Weekends: 67% higher attendance\n- Evening (6-8 PM): Most popular\n- Avoid exam weeks\n\nYour events perform best on Saturdays at 3 PM!";
      }
    } else if (type === 'authority') {
      if (lower.includes('predict') || lower.includes('engagement')) {
        return "📈 Engagement Prediction:\n\n**High Potential Events:**\n- Robotics Symposium (89% match)\n- AI Workshop Series (92% interest)\n\n**Low Risk Events:**\n- Design Sprint (76%)\n\nRecommend: Fast-track tech events!";
      }
      if (lower.includes('trend') || lower.includes('summary')) {
        return "📊 Current Trends:\n\n✅ Tech events: +35% demand\n✅ Hybrid format: 67% preference\n⚠️ Weekend slots filling fast\n📈 Student engagement: All-time high\n\nAction: Increase tech event capacity!";
      }
    }
    
    return "I'm here to help! Can you tell me more about what you're looking for?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="h-14 w-14 rounded-full shadow-2xl bg-gradient-to-br from-primary via-secondary to-accent hover:scale-110 transition-transform"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col"
          >
            <Card className="flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      AI Assistant
                    </h3>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

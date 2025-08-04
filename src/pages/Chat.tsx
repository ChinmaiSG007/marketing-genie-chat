import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User, LogOut, Sparkles, Zap } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "👋 Hello! I'm your Marketing AI Agent. I specialize in creating compelling campaign briefs that drive results. What marketing challenge can I help you solve today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
    navigate("/");
  };

  const generateCampaignBrief = async (prompt: string) => {
    // This would integrate with OpenAI API
    // For now, using a placeholder response structure
    const campaignTypes = [
      "Social Media Campaign",
      "Email Marketing Campaign", 
      "Content Marketing Campaign",
      "Influencer Partnership Campaign",
      "Product Launch Campaign"
    ];
    
    const randomType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
    
    return `🎯 **${randomType} Brief**

**Campaign Objective:**
Based on your request: "${prompt}", I recommend focusing on building brand awareness and driving engagement through targeted messaging.

**Target Audience:**
- Primary: Demographics 25-45, tech-savvy professionals
- Secondary: Early adopters and brand enthusiasts
- Psychographics: Value innovation, quality, and authentic brand connections

**Key Messages:**
1. **Primary Message:** Transform your approach with our innovative solution
2. **Supporting Messages:** 
   - Proven results that speak for themselves
   - Join thousands of satisfied customers
   - Experience the difference quality makes

**Channels & Tactics:**
📱 **Digital Channels:**
- Social media platforms (Instagram, LinkedIn, Facebook)
- Email marketing sequences
- Content marketing (blog posts, videos)
- Paid social advertising

🎨 **Creative Direction:**
- Modern, clean aesthetic with bold colors
- User-generated content integration
- Behind-the-scenes storytelling
- Customer testimonial highlights

**Success Metrics:**
- Engagement rate: Target 3.5%+
- Click-through rate: Target 2.8%+
- Conversion rate: Target 12%+
- Brand awareness lift: Target 25%+

**Budget Allocation:**
- Content creation: 40%
- Paid advertising: 35%
- Influencer partnerships: 15%
- Analytics & optimization: 10%

**Timeline:**
- Week 1-2: Creative development
- Week 3-4: Campaign launch
- Week 5-8: Optimization & scaling
- Week 9: Performance analysis

Ready to dive deeper into any specific aspect of this campaign? 🚀`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Simulate API call delay
      setTimeout(async () => {
        const aiResponse = await generateCampaignBrief(inputMessage);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: "Failed to generate campaign brief. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-chat">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Marketing AI Agent</h1>
              <p className="text-sm text-muted-foreground">Campaign Brief Generator</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-gradient-primary">
                  <AvatarFallback className="bg-gradient-primary text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[80%] p-4 ${
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground shadow-glow" 
                  : "bg-card border shadow-sm"
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </Card>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 bg-secondary">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar className="w-8 h-8 bg-gradient-primary">
                <AvatarFallback className="bg-gradient-primary text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">Generating campaign brief...</span>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-chat/80 backdrop-blur-sm pt-4">
          <Card className="p-4 shadow-elegant">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your marketing goals or campaign needs..."
                className="flex-1 transition-all duration-300 focus:shadow-glow"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Suggested Prompts */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              {[
                "Product launch strategy",
                "Social media campaign",
                "Email marketing",
                "Brand awareness"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs hover:bg-accent transition-all duration-300"
                  disabled={isLoading}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
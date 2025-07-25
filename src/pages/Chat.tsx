import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Database, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from '@/components/ChatBubble';
import DatabaseModal from '@/components/DatabaseModal';

interface ChatProps {
  category: string;
  onBack: () => void;
}

interface Message {
  id: number;
  message: string;
  isUser: boolean;
  timestamp: string;
}

const Chat = ({ category, onBack }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      message: `Hello! I'm your ${category} assistant. How can I help you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDatabase, setShowDatabase] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (category: string, userMessage: string) => {
    const responses = {
      Finance: [
        "I can help you track expenses, create budgets, and analyze your spending patterns.",
        "Let me suggest some investment strategies based on your financial goals.",
        "I notice some trends in your spending. Would you like me to create a savings plan?",
        "Your financial data shows good progress. Here are some optimization tips."
      ],
      Tasks: [
        "I'll help you organize your tasks by priority and deadline.",
        "Let me create a productivity schedule based on your current workload.",
        "I can break down that complex project into manageable steps.",
        "Your task completion rate is improving! Here's how to maintain momentum."
      ]
    };
    
    const categoryResponses = responses[category as keyof typeof responses] || responses.Tasks;
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      message: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        message: getRandomResponse(category, inputValue),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden animate-scale-in">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              animationDelay: `${i * 2}s`
            }}
          >
            <div className="w-2 h-2 rounded-full bg-primary opacity-40" />
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border glass-card p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">{category} Bot</h1>
            </div>
          </div>
          
          <Button
            onClick={() => setShowDatabase(true)}
            variant="outline"
            className="hover-glow"
          >
            <Database className="w-4 h-4 mr-2" />
            View Database
          </Button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message.message}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="glass-card p-4 rounded-2xl rounded-bl-sm max-w-[80%] animate-scale-in">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border glass-card p-4">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${category} Bot anything...`}
              className="flex-1 bg-input/50 border-glass-border focus:border-primary"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="hover-glow px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Database Modal */}
      <DatabaseModal
        isOpen={showDatabase}
        onClose={() => setShowDatabase(false)}
        category={category}
      />
    </div>
  );
};

export default Chat;
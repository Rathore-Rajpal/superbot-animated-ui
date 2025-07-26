import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { N8NChatWidget } from '@/components/N8NChatWidget';

interface ChatProps {
  category: string;
  onBack: () => void;
}

const Chat = ({ category, onBack }: ChatProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{category} Assistant</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* N8N Chat Widget */}
      <div style={{ height: 'calc(100vh - 64px)' }}>
        <N8NChatWidget />
      </div>
    </div>
  );
};

export default Chat;
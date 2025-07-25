import { useState } from 'react';
import { DollarSign, CheckSquare, Sparkles, Zap } from 'lucide-react';
import OptionCard from '@/components/OptionCard';
import FloatingParticles from '@/components/FloatingParticles';

interface HomeProps {
  onSelectOption: (option: string) => void;
}

const Home = ({ onSelectOption }: HomeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleOptionClick = (option: string) => {
    setIsVisible(false);
    setTimeout(() => onSelectOption(option), 300);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
    }`}>
      {/* Animated background */}
      <div className="absolute inset-0 cosmic-bg opacity-30" />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Title section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Welcome to SuperBot
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your intelligent AI assistant for productivity, finance, and task management. 
            Choose a category to get started.
          </p>
        </div>
        
        {/* Option cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <OptionCard
            title="Finance"
            icon={<DollarSign className="w-8 h-8" />}
            onClick={() => handleOptionClick('Finance')}
            className="animate-fade-in-up [animation-delay:0.1s]"
          />
          
          <OptionCard
            title="Tasks"
            icon={<CheckSquare className="w-8 h-8" />}
            onClick={() => handleOptionClick('Tasks')}
            className="animate-fade-in-up [animation-delay:0.2s]"
          />
          
          <OptionCard
            title="Smart Assistant"
            icon={<Sparkles className="w-8 h-8" />}
            isPlaceholder={true}
            className="animate-fade-in-up [animation-delay:0.3s]"
          />
          
          <OptionCard
            title="Analytics"
            icon={<Zap className="w-8 h-8" />}
            isPlaceholder={true}
            className="animate-fade-in-up [animation-delay:0.4s]"
          />
        </div>
        
        {/* Footer text */}
        <div className="mt-16 text-center animate-fade-in-up [animation-delay:0.5s]">
          <p className="text-sm text-muted-foreground">
            Powered by advanced AI • Built for the future
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
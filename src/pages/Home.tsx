import { useState, useEffect } from 'react';
import { DollarSign, CheckSquare, Sparkles, Zap, ArrowRight, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OptionCard from '@/components/OptionCard';
import FloatingParticles from '@/components/FloatingParticles';
import { ChatPage } from '@/components/ChatPage';

interface HomeProps {
  onSelectOption: (option: string) => void;
}

const Home = ({ onSelectOption }: HomeProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [chatCategory, setChatCategory] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    // For all options, open chat UI first
    setChatCategory(option);
  };

  const handleCloseChat = () => {
    setChatCategory(null);
  };

  // Animation variants with proper TypeScript types
  const container: { [key: string]: any } = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item: { [key: string]: any } = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#00081d] text-white">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00081d] via-[#0a1a3a] to-[#00081d]" />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.03]" />
      
      {/* Glow effects */}
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#119cff] rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#119cff] rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <img 
            src="https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//LOGO-02.png" 
            alt="Tasknova Logo" 
            className="h-16 md:h-20"
          />
        </motion.div>
        
        {/* Title section */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-[#119cff]/10 border border-[#119cff]/30 text-[#119cff] text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Introducing Tasknova Superbot
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a0c4ff] leading-tight">
            AI-Powered Productivity
            <br />
            <span className="text-[#119cff]">Supercharged</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Your intelligent AI assistant for finance, tasks, and productivity. 
            Experience the future of work with Tasknova's advanced AI technology.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#119cff] to-[#0d7acc] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#119cff]/30 transition-all duration-300"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </motion.div>
        
        {/* Features/Cards section */}
        <motion.div 
          className="w-full max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={item} className="group">
              <OptionCard
                title="Finance"
                icon={<DollarSign className="w-6 h-6" />}
                onClick={() => handleOptionClick('Finance')}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#119cff]/50 transition-all duration-300 group-hover:scale-105"
              />
            </motion.div>
            
            <motion.div variants={item} className="group">
              <OptionCard
                title="Tasks"
                icon={<CheckSquare className="w-6 h-6" />}
                onClick={() => handleOptionClick('Tasks')}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#119cff]/50 transition-all duration-300 group-hover:scale-105"
              />
            </motion.div>
            
            <motion.div variants={item} className="group">
              <OptionCard
                title="Smart Assistant"
                icon={<Sparkles className="w-6 h-6" />}
                onClick={() => handleOptionClick('Smart Assistant')}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#119cff]/50 transition-all duration-300 group-hover:scale-105"
              />
            </motion.div>
            
            <motion.div variants={item} className="group">
              <OptionCard
                title="Analytics"
                icon={<Zap className="w-6 h-6" />}
                onClick={() => handleOptionClick('Analytics')}
                className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#119cff]/50 transition-all duration-300 group-hover:scale-105"
              />
            </motion.div>
          </div>
          
          {/* View Database Button */}
          <motion.div 
            variants={item}
            className="mt-12 text-center"
          >
            <button
              onClick={() => onSelectOption('Database')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#119cff] to-[#0d7acc] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#119cff]/30 transition-all duration-300"
            >
              <Database className="w-5 h-5 mr-2" />
              View Database
            </button>
          </motion.div>
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-center space-x-6 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Tasknova. All rights reserved.
          </p>
        </motion.div>
      
      </div>

      {/* Chat Page - Rendered when a category is selected */}
      <AnimatePresence>
        {chatCategory && (
          <ChatPage 
            category={chatCategory} 
            onClose={handleCloseChat} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
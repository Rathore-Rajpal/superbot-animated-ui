import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface OptionCardProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  isPlaceholder?: boolean;
  className?: string;
}

const OptionCard = ({ title, icon, onClick, isPlaceholder = false, className = "" }: OptionCardProps) => {
  return (
    <motion.div
      onClick={isPlaceholder ? undefined : onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative p-6 rounded-xl transition-all duration-300 cursor-pointer
        ${isPlaceholder ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'}
        ${className}
      `}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 group-hover:border-[#119cff]/50 transition-all duration-300" />
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#119cff]/10 via-transparent to-transparent" />
      
      <div className="relative z-10 flex flex-col items-center h-full">
        {icon && (
          <div className="mb-4 p-3 rounded-full bg-[#119cff]/10 text-[#119cff] group-hover:bg-[#119cff]/20 transition-colors duration-300">
            {icon}
          </div>
        )}
        
        <h3 className={`text-lg font-medium text-center ${
          isPlaceholder ? 'text-gray-400' : 'text-white group-hover:text-[#119cff]'
        } transition-colors duration-300`}>
          {isPlaceholder ? 'Coming Soon' : title}
        </h3>
        
        {isPlaceholder && (
          <p className="mt-2 text-sm text-gray-500">
            Launching soon
          </p>
        )}
        
        {!isPlaceholder && (
          <div className="mt-4 text-[#119cff] text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Get started
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OptionCard;
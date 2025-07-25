import { ReactNode } from 'react';

interface OptionCardProps {
  title: string;
  icon?: ReactNode;
  onClick?: () => void;
  isPlaceholder?: boolean;
  className?: string;
}

const OptionCard = ({ title, icon, onClick, isPlaceholder = false, className = "" }: OptionCardProps) => {
  return (
    <div
      onClick={isPlaceholder ? undefined : onClick}
      className={`
        group relative glass-card p-8 transition-all duration-300 cursor-pointer
        hover-glow hover:scale-105 animate-fade-in-up
        ${isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary/50'}
        ${className}
      `}
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10" />
      
      <div className="relative z-10 text-center">
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="text-primary text-3xl group-hover:text-accent transition-colors duration-300">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {isPlaceholder ? 'Coming Soon' : title}
        </h3>
        
        {isPlaceholder && (
          <p className="text-sm text-muted-foreground mt-2">
            More features coming soon...
          </p>
        )}
      </div>
      
      {/* Electric glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 blur-xl" />
    </div>
  );
};

export default OptionCard;
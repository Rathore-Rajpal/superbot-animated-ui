import { useState } from 'react';
import Home from './Home';
import Chat from './Chat';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'chat'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSelectOption = (option: string) => {
    setSelectedCategory(option);
    setCurrentView('chat');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' ? (
        <Home onSelectOption={handleSelectOption} />
      ) : (
        <Chat category={selectedCategory} onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default Index;

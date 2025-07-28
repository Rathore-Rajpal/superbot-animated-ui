import { useState } from 'react';
import Home from './Home';
import Chat from './Chat';
import { DatabaseView } from '@/components/DatabaseView';

type ViewType = 'home' | 'chat' | 'database';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleSelectOption = (option: string) => {
    setSelectedCategory(option);
    if (option === 'Database') {
      setCurrentView('database');
    } else {
      setCurrentView('chat');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCategory('');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' ? (
        <Home onSelectOption={handleSelectOption} />
      ) : currentView === 'chat' ? (
        <Chat category={selectedCategory} onBack={handleBackToHome} />
      ) : (
        <div className="min-h-screen bg-[#00081d] text-white p-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="mb-6 flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Back to Home
            </button>
            <DatabaseView 
              initialTab="tasks"
              title="Database Management"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

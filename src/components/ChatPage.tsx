import { useEffect, useRef, useState } from 'react';
import { X, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { DatabaseView } from './DatabaseView';

declare global {
  interface Window {
    n8nChatInstance?: any;
    n8nChatInitialized?: boolean;
  }
  
  namespace JSX {
    interface IntrinsicElements {
      'n8nchatui-inpage': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ChatPageProps {
  onClose: () => void;
  category: string;
}

export const ChatPage = ({ onClose, category }: ChatPageProps): JSX.Element => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [showDatabase, setShowDatabase] = useState(false);

  // Determine the database context based on category
  const getDatabaseContext = () => {
    switch (category.toLowerCase()) {
      case 'tasks':
        return { initialTab: 'tasks' as const, title: 'Task Management System', showOnly: 'tasks' as const };
      case 'finance':
        return { initialTab: 'finances' as const, title: 'Finance Management System', showOnly: 'finances' as const };
      default:
        return { initialTab: 'tasks' as const, title: 'Database Management' };
    }
  };

  // Get category-specific chat configuration
  const getChatConfig = () => {
    switch (category.toLowerCase()) {
      case 'tasks':
        return {
          title: "Tasknova Task Assistant",
          welcomeMessage: "Hey there! I'm your Task assistant. How can I help you manage your tasks today?"
        };
      case 'finance':
        return {
          title: "Tasknova Finance Assistant",
          welcomeMessage: "Hey there! I'm your Finance assistant. How can I help you manage your finances today?"
        };
      default:
        return {
          title: "Tasknova Superbot",
          welcomeMessage: "Hey there! I'm your AI assistant. How can I help you today?"
        };
    }
  };

  const { initialTab, title, showOnly } = getDatabaseContext();
  const chatConfig = getChatConfig();

  useEffect(() => {
    // Create and append the chat element
    const chatContainer = document.getElementById('chat-container');
    if (!chatContainer) return;

    // Clean up any existing chat widget
    const existingChat = document.getElementById('n8n-chat-widget');
    if (existingChat) {
      existingChat.remove();
    }
    
    // Clean up any existing scripts
    const existingScripts = document.querySelectorAll('script[src*="n8nchatui"]');
    existingScripts.forEach(script => script.remove());

    // Reset the initialization flag
    if (window.n8nChatInitialized) {
      window.n8nChatInitialized = false;
    }

    // Create new chat element
    const chatElement = document.createElement('n8nchatui-inpage');
    chatElement.id = 'n8n-chat-widget';
    chatElement.style.width = '100%';
    chatElement.style.height = '100%';
    chatContainer.appendChild(chatElement);

    // Build the theme configuration
    const themeConfig = {
      button: {
        iconColor: "#119cff",
        backgroundColor: "#00081d"
      },
      chatWindow: {
        borderRadiusStyle: "rounded",
        avatarBorderRadius: 25,
        messageBorderRadius: 6,
        showTitle: true,
        title: chatConfig.title,
        titleAvatarSrc: "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589383843.png",
        avatarSize: 40,
        welcomeMessage: chatConfig.welcomeMessage,
        errorMessage: "Please connect me to n8n first",
        backgroundColor: "#010c27",
        height: 0,
        width: 0,
        fontSize: 16,
        starterPromptFontSize: 15,
        renderHTML: false,
        clearChatOnReload: true,
        showScrollbar: false,
        botMessage: {
          backgroundColor: "#119cff",
          textColor: "#fafafa",
          showAvatar: true,
          avatarSrc: "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589895884.gif"
        },
        userMessage: {
          backgroundColor: "#fff6f3",
          textColor: "#050505",
          showAvatar: true,
          avatarSrc: "https://www.svgrepo.com/show/532363/user-alt-1.svg"
        },
        textInput: {
          placeholder: "Type your query",
          backgroundColor: "#119cff",
          textColor: "#fff6f3",
          sendButtonColor: "#01061b",
          maxChars: 50,
          maxCharsWarningMessage: "You exceeded the characters limit. Please input less than 50 characters.",
          autoFocus: true,
          borderRadius: 6,
          sendButtonBorderRadius: 50
        },
        uploadsConfig: {
          enabled: true,
          acceptFileTypes: ["png", "jpeg", "jpg", "pdf"],
          maxSizeInMB: 5,
          maxFiles: 1
        },
        voiceInputConfig: {
          enabled: true,
          maxRecordingTime: 15,
          recordingNotSupportedMessage: "To record audio, use modern browsers like Chrome or Firefox that support audio recording"
        }
      }
    };

    // Create the script content using string concatenation
    const scriptContent = 
      '(function() {' +
        'if (window.n8nChatInstance) {' +
          'try {' +
            'window.n8nChatInstance.destroy();' +
          '} catch (e) {' +
            'console.warn("Error cleaning up previous chat instance:", e);' +
          '}' +
          'window.n8nChatInstance = null;' +
        '}' +
        'const initChat = () => {' +
          'if (window.n8nChatInitialized) return;' +
          'window.n8nChatInitialized = true;' +
          'const config = {' +
            'n8nChatUrl: "https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat",' +
            'metadata: { category: "' + category.replace(/"/g, '\\"') + '" },' +
            'theme: ' + JSON.stringify(themeConfig).replace(/</g, '\\u003c') +
          '};' +
          'const loadScript = () => {' +
            'if (window.Chatbot) {' +
              'window.n8nChatInstance = window.Chatbot.initFull(config);' +
              'return;' +
            '}' +
            'const script = document.createElement("script");' +
            'script.src = "https://cdn.n8nchatui.com/v1/embed.js";' +
            'script.type = "module";' +
            'script.onload = () => {' +
              'if (window.Chatbot) {' +
                'window.n8nChatInstance = window.Chatbot.initFull(config);' +
              '}' +
            '};' +
            'document.head.appendChild(script);' +
          '};' +
          'loadScript();' +
        '};' +
        'if (document.readyState === "loading") {' +
          'document.addEventListener("DOMContentLoaded", initChat);' +
        '} else {' +
          'initChat();' +
        '}' +
      '})();';

    // Create and append the script
    const script = document.createElement('script');
    script.type = 'module';
    script.defer = true;
    script.textContent = scriptContent;
    document.body.appendChild(script);
    scriptRef.current = script;

    // Auto-open the chat
    setTimeout(() => {
      const chatButton = chatElement.shadowRoot?.querySelector('button');
      if (chatButton) {
        (chatButton as HTMLElement).click();
      }
    }, 300);

    // Clean up function to remove the script and chat element
    return () => {
      // Clean up chat instance
      if (window.n8nChatInstance) {
        try {
          window.n8nChatInstance.destroy();
        } catch (e) {
          console.warn('Error cleaning up chat instance:', e);
        }
        window.n8nChatInstance = null;
      }

      // Remove the script element
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
      
      // Remove all n8n chat scripts
      const chatScripts = document.querySelectorAll('script[src*="n8nchatui"]');
      chatScripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      
      // Remove the chat element
      const chatElement = document.getElementById('n8n-chat-widget');
      if (chatElement && chatElement.parentNode) {
        chatElement.parentNode.removeChild(chatElement);
      }
      
      // Reset the initialization flag
      if (typeof window !== 'undefined') {
        window.n8nChatInitialized = false;
      }
    };
  }, [category, chatConfig]);



  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Chat Window */}
        <motion.div 
          className="relative w-full max-w-4xl h-[70vh] bg-card rounded-xl shadow-2xl overflow-hidden mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="relative w-full h-full">
            <div id="chat-container" className="w-full h-full"></div>
          </div>
        </motion.div>

        {/* Close Button - Outside Chat Container */}
        {!showDatabase && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 shadow-lg"
            >
              <X className="h-6 w-6 text-white font-bold" />
            </Button>
          </div>
        )}

        {/* View Database Button - Outside Chat UI */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => setShowDatabase(!showDatabase)}
            variant={showDatabase ? 'default' : 'outline'}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#119cff] to-[#0d7acc] hover:from-[#0d7acc] hover:to-[#119cff] text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Database className="h-5 w-5" />
            <span>{showDatabase ? 'Hide Database' : 'View Database'}</span>
          </Button>
        </motion.div>

        {/* Database Overlay */}
        <AnimatePresence>
          {showDatabase && (
            <motion.div 
              className="fixed inset-0 bg-black/90 z-60 overflow-y-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-white">{title}</h1>
                  <Button
                    onClick={() => setShowDatabase(false)}
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <DatabaseView 
                  initialTab={initialTab}
                  title={title}
                  showOnly={showOnly}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPage;

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

    // Create a properly escaped script content
    const escapedCategory = category.replace(/"/g, '\\"');
    const scriptContent = `
      (function() {
        // Clean up any existing chat instance
        if (window.n8nChatInstance) {
          try {
            window.n8nChatInstance.destroy();
          } catch (e) {
            console.warn('Error cleaning up previous chat instance:', e);
          }
          window.n8nChatInstance = null;
        }

        const initChat = () => {
          if (window.n8nChatInitialized) return;
          window.n8nChatInitialized = true;
          
          const config = {
            n8nChatUrl: "https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat",
            metadata: { category: "${escapedCategory}" },
            theme: ${JSON.stringify({
              button: {
                iconColor: "#119cff",
                backgroundColor: "#00081d"
              },
              chatWindow: {
                borderRadiusStyle: "rounded",
                avatarBorderRadius: 25,
                messageBorderRadius: 6,
                showTitle: true,
                title: "Tasknova Superbot",
                titleAvatarSrc: "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589383843.png",
                avatarSize: 40,
                welcomeMessage: "Hey there! I'm your Task assistant. How can I help you today?",
                errorMessage: "Please connect me to n8n first",
                backgroundColor: "#010c27",
                height: 0,
                width: 0,
                fontSize: 16,
                starterPrompts: [
                  "What are today's tasks?",
                  `Tell me about ${escapedCategory}`,
                  "How can you help me?"
                ],
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
            }).replace(/</g, '\\u003c')}
          };

          const loadScript = () => {
            if (window.Chatbot) {
              window.n8nChatInstance = window.Chatbot.initFull(config);
              return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.n8nchatui.com/v1/embed.js';
            script.type = 'module';
            script.onload = () => {
              if (window.Chatbot) {
                window.n8nChatInstance = window.Chatbot.initFull(config);
              }
            };
            document.head.appendChild(script);
          };

          loadScript();
        };

        // Initialize chat when DOM is ready
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initChat);
        } else {
          initChat();
        }
      })();
    `;

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
  }, [category]);



  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="relative w-full max-w-4xl h-[80vh] bg-card rounded-xl shadow-2xl overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="absolute top-4 right-4 z-50 flex space-x-2">
            <Button
              onClick={() => setShowDatabase(!showDatabase)}
              variant={showDatabase ? 'default' : 'outline'}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20"
            >
              <Database className="h-4 w-4" />
              <span>{showDatabase ? 'Hide Database' : 'View Database'}</span>
            </Button>
            <Button
              onClick={onClose}
              size="icon"
              variant="ghost"
              className="rounded-full w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <X className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div className="relative w-full h-full">
            <AnimatePresence>
              {showDatabase && (
                <motion.div 
                  className="absolute inset-0 bg-black/80 z-40 overflow-y-auto p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="max-w-6xl mx-auto">
                    <DatabaseView />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div id="chat-container" className="w-full h-full"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatPage;

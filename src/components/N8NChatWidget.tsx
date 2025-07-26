import { useEffect, useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'n8nchatui-inpage': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export const N8NChatWidget = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Add the chat widget element
    const chatElement = document.createElement('n8nchatui-inpage');
    document.body.appendChild(chatElement);

    // Create and append the script
    const script = document.createElement('script');
    script.type = 'module';
    script.defer = true;
    script.innerHTML = `
      import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
      Chatbot.initFull({
        "n8nChatUrl": "https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat",
        "metadata": {},
        "theme": {
          "button": {
            "iconColor": "#119cff",
            "backgroundColor": "#00081d"
          },
          "chatWindow": {
            "borderRadiusStyle": "rounded",
            "avatarBorderRadius": 25,
            "messageBorderRadius": 6,
            "showTitle": true,
            "title": "SuperBot 🚀",
            "titleAvatarSrc": "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589383843.png",
            "avatarSize": 40,
            "welcomeMessage": "Hey there! I'm Superbot, your AI assistant from Tasknova.",
            "errorMessage": "Please connect me to n8n first",
            "backgroundColor": "#010c27",
            "height": 0,
            "width": 0,
            "fontSize": 16,
            "starterPrompts": [
              "What are today's tasks ?",
              "What do you do?"
            ],
            "starterPromptFontSize": 15,
            "renderHTML": false,
            "clearChatOnReload": false,
            "showScrollbar": false,
            "botMessage": {
              "backgroundColor": "#119cff",
              "textColor": "#fafafa",
              "showAvatar": true,
              "avatarSrc": "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589895884.gif"
            },
            "userMessage": {
              "backgroundColor": "#fff6f3",
              "textColor": "#050505",
              "showAvatar": true,
              "avatarSrc": "https://www.svgrepo.com/show/532363/user-alt-1.svg"
            },
            "textInput": {
              "placeholder": "Type your query",
              "backgroundColor": "#119cff",
              "textColor": "#fff6f3",
              "sendButtonColor": "#01061b",
              "maxChars": 50,
              "maxCharsWarningMessage": "You exceeded the characters limit. Please input less than 50 characters.",
              "autoFocus": false,
              "borderRadius": 6,
              "sendButtonBorderRadius": 50
            },
            "uploadsConfig": {
              "enabled": true,
              "acceptFileTypes": [
                "png",
                "jpeg",
                "jpg",
                "pdf"
              ],
              "maxSizeInMB": 5,
              "maxFiles": 1
            },
            "voiceInputConfig": {
              "enabled": true,
              "maxRecordingTime": 15,
              "recordingNotSupportedMessage": "To record audio, use modern browsers like Chrome or Firefox that support audio recording"
            }
          }
        }
      });
    `;
    document.body.appendChild(script);
    scriptRef.current = script;

    // Clean up
    return () => {
      document.body.removeChild(chatElement);
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

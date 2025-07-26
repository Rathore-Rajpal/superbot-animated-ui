import React, { useEffect } from 'react';

export const EmbeddedChat: React.FC = () => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'module';
    script.defer = true;
    script.innerHTML = `
      import Chatbot from "https://cdn.n8nchatui.com/v1/embed.js";
      Chatbot.init({
        "n8nChatUrl": "https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat",
        "metadata": {},
        "theme": {
          "button": {
            "backgroundColor": "#00081d",
            "right": 20,
            "bottom": 20,
            "size": 50,
            "iconColor": "#119cff",
            "customIconSrc": "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589383843.png",
            "customIconSize": 60,
            "customIconBorderRadius": 15,
            "autoWindowOpen": {
              "autoOpen": false,
              "openDelay": 2
            },
            "borderRadius": "rounded"
          },
          "tooltip": {
            "showTooltip": true,
            "tooltipMessage": "🚀 Ready to unlock some AI magic?",
            "tooltipBackgroundColor": "#119cff",
            "tooltipTextColor": "#f9faff",
            "tooltipFontSize": 15
          },
          "chatWindow": {
            "borderRadiusStyle": "rounded",
            "avatarBorderRadius": 20,
            "messageBorderRadius": 6,
            "showTitle": true,
            "title": "SuperBot 🚀",
            "titleAvatarSrc": "https://mmadclhbsuvkcbibxcsp.supabase.co/storage/v1/object/public/avatars//357f28f4-9993-4f63-b609-c31f60111133_1752589383843.png",
            "avatarSize": 30,
            "welcomeMessage": " Hey there! I'm Superbot, your AI assistant from Tasknova.",
            "errorMessage": "Please connect me to n8n first",
            "backgroundColor": "#010c27",
            "height": 600,
            "width": 400,
            "fontSize": 16,
            "starterPrompts": [
              "What are today's tasks ?"
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
              "autoFocus": true,
              "borderRadius": 6,
              "sendButtonBorderRadius": 50
            },
            "uploadsConfig": {
              "enabled": true,
              "acceptFileTypes": [
                "png",
                "jpeg",
                "jpg",
                "pdf",
                "txt"
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

    // Add script to document
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything visible
};

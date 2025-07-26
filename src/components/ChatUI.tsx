// src/components/ChatUI.tsx
import React, { useState, useRef, useEffect } from 'react';

// Function to generate a session ID with username and random string
const generateSessionId = (): string => {
  const username = 'john_doe'; // Replace with actual username from auth when available
  const randomId = Math.random().toString(36).substr(2, 6);
  return `[session:${username}_${randomId}]`;
};

// Reusable function to send a chat message to the N8N webhook
export async function sendChatMessage(userMessage: string, sessionId: string): Promise<string> {
  // The message already includes the session ID, so we just use it as is
  const requestBody = { 
    chatInput: userMessage // This now includes the session ID prefix
  };
  
  const requestBodyArray = [requestBody];
  const requestBodyString = JSON.stringify(requestBodyArray);
  
  console.log('Request payload (object):', requestBody);
  console.log('Request payload (stringified):', requestBodyString);
  
  const response = await fetch('https://n8nautomation.site/webhook/cf1de04f-3e38-426c-89f0-3bdb110a5dcf/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBodyString,
  });
  
  console.log('Response status:', response.status);
  const data = await response.json();
  // Extract chatbot reply from response[0].json.output
  return data?.[0]?.json?.output || 'No response from bot.';
}

// Simple Chat UI component
const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on component mount
  useEffect(() => {
    // For now, we'll use 'john_doe' as the username
    // In a real app, this would come from your authentication system
    const username = 'john_doe';
    
    // Generate a new session ID with username and random string
    const newSessionId = `[session:${username}_${Math.random().toString(36).substr(2, 6)}]`;
    
    // Store in component state (will be lost on page refresh)
    setSessionId(newSessionId);
    
    // Log the session ID for debugging
    console.log('Generated new session ID:', newSessionId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    // Format the message with session ID in the required format
    const messageWithSession = `[${sessionId}] ${input}`;
    const userMsg = { sender: 'user' as const, text: input }; // Show original message in UI
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      console.log('Sending message with session:', messageWithSession);
      // Send the message with the session ID included in the text
      const botReply = await sendChatMessage(messageWithSession, sessionId);
      setMessages((prev) => [...prev, { sender: 'assistant', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'Error contacting bot.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container" style={{ maxWidth: 400, margin: '0 auto', border: '1px solid #ccc', borderRadius: 8, padding: 16, background: '#fff' }}>
      <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === 'user' ? 'user' : 'assistant'} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 16, background: msg.sender === 'user' ? '#e0e7ff' : '#f1f5f9', color: '#222' }}>{msg.text}</span>
          </div>
        ))}
        {loading && (
          <div className="assistant" style={{ textAlign: 'left', margin: '8px 0' }}>
            <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 16, background: '#f1f5f9', color: '#222' }}>Typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="chat-input"
          style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          className="send-btn"
          style={{ padding: '8px 16px', borderRadius: 8, background: '#6366f1', color: '#fff', border: 'none' }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatUI;

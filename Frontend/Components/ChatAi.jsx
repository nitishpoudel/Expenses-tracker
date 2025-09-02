import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PaperAirplaneIcon, SunIcon, UserIcon, WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { API_ENDPOINTS } from '../src/config/api.js';

const AI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check connection status on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.HEALTH, {
        method: 'GET',
        credentials: 'include',
      });
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!isConnected) {
      alert('Please check your connection to the AI service.');
      return;
    }

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.AI_GENERATE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          message: input
        }),
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const botMessage = result.response || "Sorry, I couldn't generate a response.";
        setMessages([...updatedMessages, { role: 'model', content: botMessage }]);
      } else {
        throw new Error(result.message || 'Failed to get AI response');
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages([...updatedMessages, { role: 'model', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans antialiased overflow-x-hidden">
      {/* Header */}
      <header className="p-4 bg-white shadow-md flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <SparklesIcon className="h-6 w-6 text-indigo-500 mr-2" />
          Personal AI
        </h1>
        <div className="flex items-center space-x-2">
          {/* Connection status indicator */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <WifiIcon className="h-5 w-5 text-green-500" title="Connected to AI service" />
            ) : (
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" title="Not connected to AI service" />
            )}
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <SunIcon className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
            <p className="text-lg">Start a conversation </p>
            <p className="text-sm">Enjoy!!</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl p-4 rounded-3xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              <div className="flex items-center mb-1">
                {msg.role === 'user' ? (
                  <UserIcon className="h-4 w-4 mr-2" />
                ) : (
                  <SparklesIcon className="h-4 w-4 mr-2 text-indigo-500" />
                )}
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI '}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center p-4 rounded-3xl shadow-sm bg-white text-gray-500 rounded-bl-none border border-gray-200">
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-2 border-indigo-500 mr-2"></span>
              <p>AI is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="p-4 bg-white shadow-inner flex items-center justify-center">
        {/* Confined input container to a max width and centered it */}
        <div className="flex w-full max-w-screen-xl items-center space-x-3">
          {isConnected ? (
            <WifiIcon className="h-6 w-6 text-green-500" title="AI service connected" />
          ) : (
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" title="AI service disconnected" />
          )}
          
          <textarea
            className="flex-1 p-3 text-1.5xl rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none overflow-hidden"
            rows="1"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow-md transform active:scale-95 disabled:bg-gray-400"
            disabled={!input.trim() || loading || !isConnected}
            title="Send"
          >
            <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AI;
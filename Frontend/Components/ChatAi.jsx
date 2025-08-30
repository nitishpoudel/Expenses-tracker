import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, PaperAirplaneIcon, SunIcon, UserIcon, WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const AI = () => {
  const [apiKey, setApiKey] = useState('AIzaSyBirSNInELM3XZHoD1DQz098doJZXq6KYM');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!apiKey) {
      alert('Please enter your API key.');
      return;
    }

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: input }] }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const botMessage = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      setMessages([...updatedMessages, { role: 'model', content: botMessage }]);

    } catch (error) {
      console.error('Error fetching from API:', error);
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
          Gemini AI Chat
        </h1>
        <div className="flex items-center space-x-2">
          {/* Made API key input responsive */}
          <input
            type="text"
            className="w-full sm:w-48 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Enter API Key here..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button
            onClick={() => setApiKey('')}
            className="p-2 text-sm text-gray-600 hover:text-red-500 transition duration-200"
            title="Clear API Key"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <SunIcon className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
            <p className="text-lg">Start a conversation with Gemini!</p>
            <p className="text-sm">Enter your API key above to begin.</p>
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
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'Gemini'}</span>
              </div>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center p-4 rounded-3xl shadow-sm bg-white text-gray-500 rounded-bl-none border border-gray-200">
              <span className="animate-spin h-4 w-4 rounded-full border-2 border-t-2 border-indigo-500 mr-2"></span>
              <p>Gemini is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="p-4 bg-white shadow-inner flex items-center justify-center">
        {/* Confined input container to a max width and centered it */}
        <div className="flex w-full max-w-screen-xl items-center space-x-3">
          {apiKey.length > 0 ? (
            <WifiIcon className="h-6 w-6 text-green-500" title="API Key provided" />
          ) : (
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" title="API Key is missing" />
          )}
          {/* Changed width to be flexible within the container */}
          <textarea
            className="flex-1 p-3 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none overflow-hidden"
            rows="1"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow-md transform active:scale-95 disabled:bg-gray-400"
            disabled={!input.trim() || loading}
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
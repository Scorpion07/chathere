import React, { useState, useEffect, useRef } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'Hi! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((msgs) => [
      ...msgs,
      { id: Date.now(), from: 'user', text: input.trim() },
    ]);
    setInput('');

    // Simulate bot response after 1 second (replace with API call later)
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { id: Date.now() + 1, from: 'bot', text: 'Sorry, I am still learning!' },
      ]);
    }, 1000);
  };

  // Send message on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto border rounded-lg shadow-md bg-white">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(({ id, from, text }) => (
          <div
            key={id}
            className={`flex ${from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-xs break-words ${
                from === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="border-t p-4 flex items-center gap-2"
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow resize-none border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

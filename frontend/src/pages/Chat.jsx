import React, { useState, useEffect, useRef } from "react";

export default function ChatApp() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! I’m your AI assistant. Choose a model and start chatting." },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking"); // "online" | "offline" | "checking"

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Manage dark mode
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  // Check backend connection once on load
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch("http://localhost:5000/ping");
        if (res.ok) setConnectionStatus("online");
        else setConnectionStatus("offline");
      } catch {
        setConnectionStatus("offline");
      }
    }
    checkConnection();
  }, []);

  // Voice recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.start();
  };
  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  // Send message to backend
  async function sendToBackend(message, model) {
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model }),
      });

      const text = await response.text();
      console.log('RAW backend response text:', text);

      if (!text) throw new Error('Empty response body');
      const data = JSON.parse(text);
      if (!data.reply) throw new Error(data.error || 'Empty reply');
      return data.reply;
    } catch (error) {
      console.error('Backend error:', error);
      return '⚠️ Unable to reach AI server.';
    }
  }


  // Handle send
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");

    const botReply = await sendToBackend(userMessage, selectedModel);
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🔹 Connection status indicator
  const getStatusColor = () => {
    if (connectionStatus === "online") return "bg-green-500";
    if (connectionStatus === "checking") return "bg-yellow-400 animate-pulse";
    return "bg-red-500";
  };

  const getStatusText = () => {
    if (connectionStatus === "online") return "Online";
    if (connectionStatus === "checking") return "Checking...";
    return "Offline";
  };

  return (
    <div className="chat-container" role="main" aria-label="Chat application">
      <header className="header" role="banner">
        {/* Dark mode toggle */}
        <button
          type="button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setDarkMode((d) => !d)}
          className="dark-toggle-btn"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Title */}
        <h1 className="header-title" tabIndex={-1}>
          🤖 AI Chatbot Experience
        </h1>

        {/* Model + Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor()}`}
            title={`Server status: ${getStatusText()}`}
          ></div>
          <span className="text-sm text-white/80">{getStatusText()}</span>

          <select
            className="bot-option"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="gemini-2.5-flash">🌟 Gemini 2.5 Flash</option>
            <option value="gpt-4o-mini">🧠 GPT-4o Mini</option>
            <option value="gpt-4.1">⚡ GPT-4.1</option>
            <option value="deepseek-r1">🤖 DeepSeek R1</option>
            <option value="claude-3-opus">🚀 Claude-3 Opus</option>
          </select>
        </div>
      </header>

      {/* Messages */}
      <section
        className="messages"
        aria-live="polite"
        aria-relevant="additions"
        role="log"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${msg.from === "user" ? "user" : "bot"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </section>

      {/* Input */}
      <form
        className="input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        role="search"
        aria-label="Message input area"
      >
        <textarea
          aria-label="Type your message"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          type="button"
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          onClick={isListening ? stopListening : startListening}
          className={`voice-btn ${isListening ? "listening" : ""}`}
          title="Voice input"
        >
          🎙️
        </button>
        <button
          type="submit"
          disabled={!input.trim()}
          aria-disabled={!input.trim()}
          className="send-btn"
          title="Send message"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

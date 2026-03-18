import { useState, useEffect, useRef } from "react";
import ChatBubble from "../components/ChatBubble";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you?" }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show typing
    setIsTyping(true);

    // Fake AI response
    setTimeout(() => {
      const aiMessage = {
        role: "assistant",
        content: "This is a demo AI response 🤖"
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#020617] p-4">
        <h1 className="text-xl font-bold">AI Chat</h1>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col flex-1">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((msg, i) => (
            <ChatBubble key={i} {...msg} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="text-gray-400 flex gap-1 italic">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          )}

          {/* Auto Scroll Anchor */}
          <div ref={bottomRef} />
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-lg bg-gray-800 outline-none text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 px-4 rounded-lg hover:bg-blue-700 transition active:scale-95"
            >
              Send
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatBubble from "../components/ChatBubble";
import useWebSocket from "../hooks/useWebSocket";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const bottomRef = useRef(null);

  const { sendMessage } = useWebSocket((message) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, message]);
      setIsTyping(false);
    }, 300);
  });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const content = input.trim();

    if (!content) return;

    const userMessage = {
      role: "user",
      content
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    sendMessage(userMessage);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-screen bg-[#0f172a] text-white"
    >
      <div className="w-64 bg-[#020617] p-4 border-r border-gray-800">
        <h1 className="text-xl font-bold mb-4">AI Chat</h1>

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded mb-4">
          + New Chat
        </button>

        <div className="space-y-2 text-gray-400">
          <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
            Chat 1
          </div>
          <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
            Chat 2
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="p-4 border-b border-gray-800 font-semibold">
          Chat
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((msg, i) => (
            <ChatBubble key={i} {...msg} />
          ))}

          {isTyping && (
            <div className="text-gray-400 flex items-center gap-2 ml-2 mt-2">
              <span className="text-sm">AI is typing</span>
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-gray-800">
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
              disabled={!input.trim()}
              className={`px-4 rounded-lg transition active:scale-95 ${
                input.trim()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

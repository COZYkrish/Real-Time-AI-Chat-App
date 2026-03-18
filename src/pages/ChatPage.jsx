import { useState } from "react";
import ChatBubble from "../components/ChatBubble";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you?" }
  ]);

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      <div className="w-64 bg-[#020617] p-4">
        <h1 className="text-xl font-bold">AI Chat</h1>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((msg, i) => (
            <ChatBubble key={i} {...msg} />
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          Input box here
        </div>
      </div>
    </div>
  );
}
export default function ChatPage() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* ================= SIDEBAR ================= */}
      <div className="w-64 bg-[#020617] border-r border-gray-800 flex flex-col">

        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-semibold">AI Chat</h1>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition p-2 rounded">
            + New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Chat 1
          </div>
          <div className="p-2 rounded hover:bg-gray-800 cursor-pointer">
            Chat 2
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
          Powered by AI ⚡
        </div>

      </div>

      {/* ================= MAIN CHAT AREA ================= */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Chat</h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-gray-400">Start a conversation...</div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 p-2 rounded bg-gray-800 outline-none"
            />
            <button className="bg-blue-600 px-4 rounded hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
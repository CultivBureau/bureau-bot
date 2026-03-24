// components/ChatWindow.tsx
import { Send, Smile, Paperclip, Mic, Search } from "lucide-react";
import { BotDetailsSidebar } from "../shared/BotDetailsSidebar";

export const ConversationsChatWindow = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#0b141a] relative">
      {/* Chat Header */}
      <div className="h-[60px] bg-[#202c33] flex items-center px-4 py-2 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
          <span className="text-white font-medium">Senior Devs Only</span>
        </div>
        <Search size={20} className="text-[#8696a0]" />
      </div>

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-[url('/whatsapp-bg.png')] bg-repeat opacity-90">
        <div className="max-w-md bg-[#005c4b] text-white p-2 rounded-lg ml-auto mb-2 text-sm shadow-sm">
          Has the PR been reviewed yet?
          <span className="block text-[10px] text-right mt-1 text-gray-300">12:46 PM</span>
        </div>
        <div className="max-w-md bg-[#202c33] text-white p-2 rounded-lg mr-auto mb-2 text-sm shadow-sm">
          Working on it now! The Next.js 15 features look solid.
          <span className="block text-[10px] text-right mt-1 text-gray-300">12:47 PM</span>
        </div>
      </div>

      {/* Input Bar */}
      <div className="h-[62px] bg-[#202c33] flex items-center px-4 gap-4">
        <Smile className="text-[#8696a0] cursor-pointer" />
        <Paperclip className="text-[#8696a0] cursor-pointer" />
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 bg-[#2a3942] text-white rounded-lg py-2 px-4 focus:outline-none"
        />
        <Mic className="text-[#8696a0] cursor-pointer" />
      </div>
    </div>
  );
};

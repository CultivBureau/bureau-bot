import { MessageSquare, MoreVertical, Search, Filter } from "lucide-react";

export const ConversationsSidebar = () => {
  return (
    <div className="w-[30%] min-w-[350px] border-r border-gray-700 flex flex-col bg-[#111b21]">
      {/* Header */}
      <div className="h-[60px] bg-[#202c33] flex items-center justify-between px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-gray-500 cursor-pointer" />
        <div className="flex gap-5 text-[#aebac1]">
          <MessageSquare size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-2 flex items-center gap-2">
        <div className="bg-[#202c33] flex items-center w-full px-3 py-1.5 rounded-lg">
          <Search size={18} className="text-[#8696a0]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent border-none focus:outline-none text-sm text-white px-4 w-full"
          />
        </div>
        <Filter size={20} className="text-[#8696a0] cursor-pointer" />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center p-3 hover:bg-[#202c33] cursor-pointer border-b border-[#222d34]"
          >
            <div className="w-12 h-12 bg-gray-600 rounded-full mr-4" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Dev Community</h3>
                <span className="text-xs text-[#8696a0]">12:45 PM</span>
              </div>
              <p className="text-[#8696a0] text-sm truncate">Pushing to production...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

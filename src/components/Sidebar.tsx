import { Menu, Sparkles, LayoutList } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-[108px] bg-[#171717] border-r border-gray-800 flex flex-col items-center py-3 gap-4">
      {/* Menu and Logo */}
      <div className="flex flex-col items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors">
          <Menu size={20} />
        </button>
        <div className="w-8 h-8 flex items-center justify-center">
          <Sparkles size={20} className="text-orange-500" fill="currentColor" />
        </div>
      </div>
      
      {/* Sidebar icon */}
      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors">
        <LayoutList size={20} />
      </button>
    </div>
  );
}

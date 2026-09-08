import React from 'react';
import { Home, Droplet, BellRing, BookOpen, Sparkles } from 'lucide-react';

export type ActiveTab = 'home' | 'blood' | 'health' | 'study' | 'tools';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'blood', label: 'রক্তদাতা', icon: Droplet },
    { id: 'health', label: 'স্বাস্থ্য ও অ্যালার্ম', icon: BellRing },
    { id: 'study', label: 'সূত্রাবলি', icon: BookOpen },
    { id: 'tools', label: 'AI ও টুলস', icon: Sparkles },
  ];

  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 shadow-2xl select-none" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}>
      <div className="max-w-md mx-auto grid grid-cols-5 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 transition-all duration-200 relative ${
                isActive ? 'text-rose-500 scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-8 h-1 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-semibold mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

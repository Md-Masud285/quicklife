import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, User, Globe } from 'lucide-react';
import type { UserProfile } from '../services/authService';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenAdminLogin: () => void;
  onOpenLandingPage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenEmergencyModal,
  onOpenAdminLogin,
  onOpenLandingPage
}) => {
  const [logoTapCount, setLogoTapCount] = useState(0);

  // Secret 4-tap on the Logo Heart Icon to open Owner Portal
  const handleLogoIconTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = logoTapCount + 1;
    setLogoTapCount(newCount);
    if (newCount >= 4) {
      setLogoTapCount(0);
      onOpenAdminLogin();
    }
  };

  // Regular click on the Logo text (opens User Profile if logged in)
  const handleBrandTextClick = () => {
    if (currentUser) {
      onOpenProfileModal();
    }
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 px-3 sm:px-4 pb-2.5 select-none" style={{ paddingTop: 'max(10px, env(safe-area-inset-top, 10px))' }}>
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Logo Icon Box (Secret 4-tap here opens admin login) */}
          <div 
            onClick={handleLogoIconTap}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/20 active:scale-95 transition cursor-pointer select-none shrink-0"
            title="QuickLife99"
          >
            <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse pointer-events-none" />
          </div>

          {/* Brand Text Area */}
          <div onClick={handleBrandTextClick} className="cursor-pointer">
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white m-0">
                QuickLife<span className="text-rose-500">99</span>
              </h1>
              
              {/* PRO badge: Only visible for logged-in users */}
              {currentUser && (
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-widest px-1 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 select-none">
                  PRO
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium -mt-0.5 hidden xs:block">সব সেবা ও রক্তদান</p>
          </div>
        </div>

        {/* Action Controls: Landing/Download + User Profile + 999 Help */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="px-2 sm:px-2.5 py-1.5 rounded-full bg-gradient-to-r from-rose-950/80 to-slate-900 hover:from-rose-900 hover:to-slate-800 text-rose-300 hover:text-white text-[10px] sm:text-[11px] font-bold border border-rose-500/40 flex items-center space-x-1 transition shadow-sm active:scale-95 cursor-pointer shrink-0"
              title="অফিসিয়াল ওয়েব পেজ খুলুন"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
              <span className="hidden sm:inline">ওয়েব পেজ</span>
              <span className="sm:hidden">ওয়েব</span>
            </button>
          )}

          {currentUser ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 pl-1.5 sm:pl-2 pr-2.5 sm:pr-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-slate-700 transition active:scale-95 shadow shrink-0"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center text-[10px] sm:text-[11px] font-bold shrink-0">
                {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
              </div>
              <span className="max-w-[55px] sm:max-w-[70px] truncate">{currentUser.name?.split(' ')[0]}</span>
              {currentUser.bloodGroup && (
                <span className="text-[8px] sm:text-[9px] bg-rose-950 text-rose-300 font-extrabold px-1 rounded">
                  {currentUser.bloodGroup}
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold border border-slate-700 transition active:scale-95 shadow shrink-0"
            >
              <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400" />
              <span>লগইন</span>
            </button>
          )}

          <button
            onClick={onOpenEmergencyModal}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-500 text-white px-2 sm:px-2.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-md shadow-red-600/30 transition active:scale-95 pulse-emergency cursor-pointer shrink-0"
          >
            <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>৯৯৯</span>
          </button>
        </div>

      </div>
    </div>
  );
};

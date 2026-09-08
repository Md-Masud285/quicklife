import React from 'react';
import { authService } from '../services/authService';
import { Megaphone } from 'lucide-react';

interface AdBannerProps {
  slotType?: 'banner' | 'card';
  title?: string;
  subtitle?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  title = 'স্পন্সরড অ্যাড স্পেস',
  subtitle = 'ভবিষ্যতে গুগল অ্যাডমব (AdMob) ও স্পন্সরশিপের জন্য সংরক্ষিত'
}) => {
  const currentUser = authService.getCurrentUser();
  if (currentUser?.role === 'admin') return null;
  return (
    <div className="w-full my-3 px-1">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/80 via-slate-800/40 to-slate-800/80 border border-slate-700/60 p-3 flex items-center justify-between text-left">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-200">{title}</span>
              <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">Ad</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

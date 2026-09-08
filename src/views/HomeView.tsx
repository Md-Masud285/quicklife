import React from 'react';
import { 
  Droplet, 
  BellRing, 
  BookOpen, 
  Sparkles, 
  PhoneCall, 
  ArrowRight,
  Clock,
  Sparkle
} from 'lucide-react';
import type { ActiveTab } from '../components/BottomNav';
import { AdBanner } from '../components/AdBanner';
import { DynamicAdRenderer } from '../components/DynamicAdRenderer';
import type { MedicineReminder } from '../types';
import { formatBanglaNumber } from '../utils/dateHelper';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  medicines: MedicineReminder[];
  onOpenEmergencyModal: () => void;
  donorsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  medicines,
  onOpenEmergencyModal,
  donorsCount
}) => {
  const activeMedicines = medicines.filter(m => m.isEnabled);

  return (
    <div className="space-y-4 pb-8 pt-1 animate-fadeIn text-left">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 p-5 border border-slate-700/60 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              <Sparkle className="w-3 h-3 text-rose-400" />
              <span>আপনার স্মার্ট লাইফ সঙ্গী</span>
            </span>
            <span className="text-xs text-slate-400">বাংলাদেশ 🇧🇩</span>
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">
            জীবনকে করুন সহজ, <br />
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
              সুরক্ষিত ও গতিশীল!
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5">
            রক্তদাতা সন্ধান, স্বাস্থ্য রিমাইন্ডার, সূত্র সম্ভার ও এআই টুলস।
          </p>

          {/* Quick Action Grid inside Hero */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={() => setActiveTab('blood')}
              className="flex items-center justify-between p-3 rounded-2xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500/40 text-left transition active:scale-95"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">রক্তদাতা খুঁজুন</div>
                  <div className="text-[10px] text-rose-300">{formatBanglaNumber(donorsCount)}+ ডোনার প্রস্তুত</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-rose-300" />
            </button>

            <button
              onClick={onOpenEmergencyModal}
              className="flex items-center justify-between p-3 rounded-2xl bg-red-600/30 hover:bg-red-600/40 border border-red-500/40 text-left transition active:scale-95"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">জরুরি হেল্পলাইন</div>
                  <div className="text-[10px] text-red-300">৯৯৯ ও অ্যাম্বুলেন্স</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-red-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Active Medicine Alert Preview */}
      <div className="rounded-2xl bg-slate-800/80 border border-slate-700/80 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">আজকের ওষুধের সময়সূচি</span>
          </div>
          <button
            onClick={() => setActiveTab('health')}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeMedicines.length > 0 ? (
          <div className="space-y-2">
            {activeMedicines.slice(0, 2).map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/40"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center text-xs font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{med.medicineName}</div>
                    <div className="text-[10px] text-slate-400">
                      {med.dosage} • {med.mealTime === 'before' ? 'খাওয়ার আগে' : 'খাওয়ার পরে'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                  {med.times && med.times.length > 0 ? med.times.join(' | ') : (med.time || '')}
                </span>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-slate-400">
            কোনো সক্রিয় ওষুধ সেট করা নেই। স্বাস্থ্য ট্যাবে গিয়ে যোগ করুন।
          </div>
        )}
      </div>

      {/* 4 Feature Cards Hub */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-300 px-1">মূল সেবাসমূহ (Core Modules)</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Blood Hub */}
          <div
            onClick={() => setActiveTab('blood')}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/70 hover:border-rose-500/50 cursor-pointer transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 group-hover:scale-110 transition">
              <Droplet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">রক্তদাতা হাব</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              থানা ও জেলা অনুযায়ী রক্তদাতা সন্ধান ও ডোনার রেজিস্ট্রেশন।
            </p>
          </div>

          {/* Card 2: Health & Alarm */}
          <div
            onClick={() => setActiveTab('health')}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/70 hover:border-emerald-500/50 cursor-pointer transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition">
              <BellRing className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">স্বাস্থ্য ও অ্যালার্ম</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              ওষুধের রিমাইন্ডার, নিজস্ব সাউন্ড ও থানার নম্বর সেভার।
            </p>
          </div>

          {/* Card 3: Study Formula Book */}
          <div
            onClick={() => setActiveTab('study')}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/70 hover:border-amber-500/50 cursor-pointer transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">সূত্র সম্ভার</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              গণিত, পদার্থ ও রসায়নের প্রয়োজনীয় সূত্র + ওয়ান-ট্যাপ কপি।
            </p>
          </div>

          {/* Card 4: AI Resume & Translator */}
          <div
            onClick={() => setActiveTab('tools')}
            className="p-4 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/70 hover:border-purple-500/50 cursor-pointer transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">AI সিভি, ফটো ও অনুবাদ</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              সিভি, দরখাস্ত, পাসপোর্ট ফটো স্টুডিও (300×300) ও অনুবাদক।
            </p>

          </div>
        </div>
      </div>

      {/* Ad Space */}
      <DynamicAdRenderer placement="home" />
      <AdBanner />
    </div>
  );
};

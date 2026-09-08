import React, { useState } from 'react';
import { BookOpen, Copy, Check, Search, Calculator, Atom, FlaskConical, Sparkles } from 'lucide-react';
import { studyFormulaService } from '../services/studyFormulaService';
import type { StudyFormula } from '../types';
import { AdBanner } from '../components/AdBanner';
import { DynamicAdRenderer } from '../components/DynamicAdRenderer';

import type { UserProfile } from '../services/authService';

interface StudyHubViewProps {
  currentUser?: UserProfile | null;
  onRequireLogin?: () => void;
}

export const StudyHubView: React.FC<StudyHubViewProps> = ({ currentUser, onRequireLogin }) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'math' | 'physics' | 'chemistry'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formulas, setFormulas] = useState<StudyFormula[]>(studyFormulaService.getAllFormulas());

  // Reload formulas when component renders & listen to cloud sync
  React.useEffect(() => {
    const refreshFormulas = () => {
      setFormulas(studyFormulaService.getAllFormulas());
    };
    refreshFormulas();

    window.addEventListener('ql_cloud_data_synced', refreshFormulas);
    return () => {
      window.removeEventListener('ql_cloud_data_synced', refreshFormulas);
    };
  }, []);

  const handleCopyFormula = (formulaItem: StudyFormula) => {
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    const textToCopy = `${formulaItem.title}\nসূত্র: ${formulaItem.formula}\n${formulaItem.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(formulaItem.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredFormulas = formulas.filter((item) => {
    if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.formula.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.explanation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSubjectBadge = (subject: 'math' | 'physics' | 'chemistry') => {
    switch (subject) {
      case 'math':
        return { label: 'গণিত (Math)', icon: Calculator, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
      case 'physics':
        return { label: 'পদার্থবিজ্ঞান (Physics)', icon: Atom, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' };
      case 'chemistry':
        return { label: 'রসায়ন (Chemistry)', icon: FlaskConical, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' };
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn text-left">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-5 text-white shadow-xl shadow-amber-900/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              স্টুডেন্ট স্পেশাল
            </span>
            <h2 className="text-xl font-bold mt-1">প্রয়োজনীয় সূত্র সম্ভার</h2>
            <p className="text-xs text-amber-100 mt-0.5">
              গণিত, পদার্থ ও রসায়নের সব সূত্র কার্ড আকারে ও ১-ট্যাপ কপি
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'সব সূত্র', icon: Sparkles },
          { id: 'math', label: 'গণিত', icon: Calculator },
          { id: 'physics', label: 'পদার্থবিজ্ঞান', icon: Atom },
          { id: 'chemistry', label: 'রসায়ন', icon: FlaskConical }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = selectedSubject === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSubject(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-extrabold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="সূত্র বা অধ্যায়ের নাম দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800/90 text-slate-100 text-xs rounded-2xl pl-9 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Formulas List */}
      <div className="space-y-3">
        {filteredFormulas.map((item) => {
          const badge = getSubjectBadge(item.subject);
          const BadgeIcon = badge.icon;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-800/80 border border-slate-700/70 p-4 shadow-md hover:border-slate-600 transition space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                  <BadgeIcon className="w-3 h-3" />
                  <span>{badge.label}</span>
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>

              {/* Highlighting Formula Box */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
                <span className="text-sm md:text-base font-mono font-black text-amber-300 tracking-wide select-all">
                  {item.formula}
                </span>

                {/* One-Tap Copy Button */}
                <button
                  onClick={() => handleCopyFormula(item)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 shadow ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
                  }`}
                  title="কপি করুন"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি</span>
                    </>
                  )}
                </button>
              </div>

              {item.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  <span className="font-semibold text-slate-400">ব্যাখ্যা:</span> {item.explanation}
                </p>
              )}
            </div>
          );
        })}

        {filteredFormulas.length === 0 && (
          <div className="text-center py-10 rounded-2xl bg-slate-800/40 border border-slate-700/40 p-6">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">কোনো সূত্র খুঁজে পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-1">অন্য কোনো কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন।</p>
          </div>
        )}
      </div>

      {/* Ad Space */}
      <DynamicAdRenderer placement="study" />
      <AdBanner title="পরীক্ষার সেরা প্রস্তুতির জন্য" subtitle="সূত্রগুলো বন্ধুদের সাথে শেয়ার করতে কপি বাটন ব্যবহার করুন" />
    </div>
  );
};

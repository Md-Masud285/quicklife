import { createPortal } from 'react-dom';
import React from 'react';
import { ShieldAlert, Phone, X, LogIn, Plus, UserCheck } from 'lucide-react';
import { NATIONAL_EMERGENCY_NUMBERS } from '../data/bangladeshData';
import type { PersonalEmergencyContact } from '../types';
import type { UserProfile } from '../services/authService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalContacts: PersonalEmergencyContact[];
  currentUser?: UserProfile | null;
  onRequireLogin?: () => void;
  onOpenHealthTab?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  personalContacts,
  currentUser,
  onRequireLogin,
  onOpenHealthTab,
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const handleLoginClick = () => {
    onClose();
    if (onRequireLogin) onRequireLogin();
  };

  const handleAddEditClick = () => {
    onClose();
    if (!currentUser) {
      if (onRequireLogin) onRequireLogin();
    } else {
      if (onOpenHealthTab) onOpenHealthTab();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-slate-900 border border-red-500/50 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/40 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">জরুরি হেল্পলাইন সেবা</h3>
              <p className="text-[11px] text-red-300 font-medium">১ ক্লিকেই সরাসরি ডায়াল করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status / Login Requirement Banner */}
        {!currentUser ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/70 to-slate-900 border border-red-500/40 space-y-2.5 text-left">
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">নিজস্ব এলাকার নম্বর সেভ করতে লগইন করুন</h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  আপনার থানা, ওসি ও লোকাল অ্যাম্বুলেন্স নম্বর আপনার নিজস্ব প্রোফাইলে সুরক্ষিত থাকবে।
                </p>
              </div>
            </div>
            <button
              onClick={handleLoginClick}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-lg flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন / অ্যাকাউন্ট তৈরি করুন</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
            <div className="flex items-center space-x-1.5 truncate">
              <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold truncate">{currentUser.name} এর সংরক্ষিত তালিকা</span>
            </div>
            <button
              onClick={handleAddEditClick}
              className="shrink-0 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-emerald-500/30 flex items-center space-x-1 transition"
            >
              <Plus className="w-3 h-3" />
              <span>যোগ / এডিট</span>
            </button>
          </div>
        )}

        {/* User's Personal Saved Emergency Numbers */}
        {currentUser && personalContacts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              আপনার সংরক্ষিত থানা ও লোকাল নম্বর
            </h4>
            <div className="space-y-1.5">
              {personalContacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-white truncate">{c.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {c.locationOrThana || 'নিজ এলাকা'} • {c.phone}
                    </div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow shrink-0 active:scale-95 transition"
                  >
                    <Phone className="w-3 h-3" />
                    <span>কল দিন</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* National Hotlines */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            জাতীয় সার্বক্ষণিক হটলাইন (National 24/7)
          </h4>
          <div className="space-y-2">
            {NATIONAL_EMERGENCY_NUMBERS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition"
              >
                <div>
                  <div className="text-xs font-bold text-white">{item.name}</div>
                  <div className="text-sm font-mono font-black text-rose-400 mt-0.5">{item.number}</div>
                </div>
                <a
                  href={`tel:${item.number}`}
                  className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-600/30 active:scale-95 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>,
    document.body
  );
};

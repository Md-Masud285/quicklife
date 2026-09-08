import { createPortal } from 'react-dom';
import React from 'react';
import { ShieldAlert, Phone, X } from 'lucide-react';
import { NATIONAL_EMERGENCY_NUMBERS } from '../data/bangladeshData';
import type { PersonalEmergencyContact } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  personalContacts: PersonalEmergencyContact[];
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  personalContacts
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 animate-fadeIn select-none" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-slate-900 border border-red-500/50 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 shadow-2xl space-y-4 text-left" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">জরুরি হেল্পলাইন সেবা</h3>
              <p className="text-[11px] text-red-300">১ ক্লিকেই সরাসরি ডায়াল করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User's Personal Saved Emergency Numbers */}
        {personalContacts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              আপনার সংরক্ষিত থানা ও লোকাল নম্বর
            </h4>
            <div className="space-y-1.5">
              {personalContacts.map(c => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{c.title}</div>
                    <div className="text-[10px] text-slate-400">{c.locationOrThana} • {c.phone}</div>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow"
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

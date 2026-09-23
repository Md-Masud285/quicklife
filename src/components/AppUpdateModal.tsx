import { createPortal } from 'react-dom';
import React from 'react';
import { Sparkles, Download, ArrowUpCircle, X, ShieldAlert } from 'lucide-react';
import { appUpdateService, type AppUpdateConfig, CURRENT_APP_VERSION } from '../services/appUpdateService';

interface AppUpdateModalProps {
  isOpen: boolean;
  updateConfig: AppUpdateConfig;
  onClose: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  updateConfig,
  onClose
}) => {
  if (!isOpen || typeof document === 'undefined') return null;

  const handleDownload = () => {
    if (updateConfig.downloadUrl) {
      window.open(updateConfig.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRemindLater = () => {
    appUpdateService.dismissUpdate(updateConfig.latestVersion);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !updateConfig.forceUpdate) {
          handleRemindLater();
        }
      }}
    >
      <div 
        className="relative w-full max-w-sm bg-slate-900 border border-indigo-500/50 rounded-3xl p-6 shadow-2xl text-left space-y-4 m-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon / Icon */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse">
              <ArrowUpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-white">নতুন আপডেট এসেছে!</h3>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-indigo-300 font-mono">
                v{CURRENT_APP_VERSION} ➔ <span className="font-bold text-emerald-400">v{updateConfig.latestVersion}</span>
              </p>
            </div>
          </div>

          {!updateConfig.forceUpdate && (
            <button
              onClick={handleRemindLater}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="পরে আপডেট করুন"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Update Notice Body */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">নতুন কী কী যোগ করা হয়েছে:</span>
            {updateConfig.releasedAt && (
              <span className="font-mono text-[10px] text-slate-500">রিলিজ: {updateConfig.releasedAt}</span>
            )}
          </div>

          <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 max-h-40 overflow-y-auto">
            {updateConfig.releaseNotes || '• পারফরম্যান্স ও সিকিউরিটি উন্নয়ন\n• নতুন ফিচার ও বাগ ফিক্স'}
          </div>
        </div>

        {updateConfig.forceUpdate && (
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-600/40 flex items-center space-x-2 text-[11px] text-amber-300 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>অ্যাপটি ব্যবহার চালিয়ে যেতে এই গুরুত্বপূর্ণ আপডেটটি আবশ্যক।</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-900/40 flex items-center justify-center space-x-2 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>🚀 এখনই ডাউনলোড ও আপডেট করুন</span>
          </button>

          {!updateConfig.forceUpdate && (
            <button
              onClick={handleRemindLater}
              className="w-full py-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-semibold transition"
            >
              পরে আপডেট করব
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};

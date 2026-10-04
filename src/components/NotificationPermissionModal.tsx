import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { BellRing, ShieldCheck, CheckCircle2, Clock, Smartphone, AlertTriangle, ChevronRight, X } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { alarmSoundManager } from '../utils/audioAlarm';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted?: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleAllowPermission = async () => {
    setIsRequesting(true);
    setStatusMessage(null);

    // Warm up audio system on user click
    alarmSoundManager.initContext();

    try {
      const granted = await notificationService.requestPermission();
      setIsRequesting(false);

      if (granted) {
        setIsSuccess(true);
        setStatusMessage('নোটিফিকেশন ও অ্যালার্ম সফলভাবে চালু হয়েছে!');
        // Play gentle test chime
        alarmSoundManager.playDefaultAlarm();
        setTimeout(() => {
          alarmSoundManager.stopAlarm();
        }, 1200);

        setTimeout(() => {
          if (onPermissionGranted) onPermissionGranted();
          onClose();
        }, 1600);
      } else {
        setStatusMessage('পারমিশন ডিনাই করা হয়েছে। অনুগ্রহ করে আপনার ফোনের সেটিংস থেকে নোটিফিকেশন অন করুন।');
        setShowAndroidGuide(true);
      }
    } catch (err) {
      setIsRequesting(false);
      setStatusMessage('পারমিশন চালু করতে সমস্যা হয়েছে। দয়া করে ফোনের সেটিংস চেক করুন।');
    }
  };

  const handleOpenSettings = () => {
    try {
      if (typeof window !== 'undefined') {
        window.location.href = 'intent:#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;package=com.quicklife.app;end';
      }
    } catch (e) {
      console.warn('Could not open settings:', e);
    }
  };

  const handleRemindIn2Hours = () => {
    notificationService.setRemindLater(2);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSuccess) {
          handleRemindIn2Hours();
        }
      }}
    >
      <div
        className="relative w-full max-w-sm bg-slate-900 border border-rose-500/50 rounded-3xl p-6 shadow-2xl text-left space-y-4 m-auto animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow background accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-red-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30 animate-pulse">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-black text-white">জরুরি অ্যালার্ম পারমিশন</h3>
              </div>
              <p className="text-[11px] text-rose-300/90 font-medium">ওষুধ ও নোটিফিকেশন সচল রাখতে</p>
            </div>
          </div>
          {!isSuccess && (
            <button
              onClick={handleRemindIn2Hours}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="পরে মনে করিয়ে দিন"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body content */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">পারমিশন সক্রিয় হয়েছে!</h4>
            <p className="text-xs text-emerald-300">এখন থেকে প্রতিটি ওষুধের অ্যালার্ম ও ১০ মিনিট আগের নোটিফিকেশন সঠিক সময়ে পাবেন।</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              সঠিক সময়ে ওষুধের রিংটোন এবং ১০ মিনিট আগে আগাম সতর্কতা পেতে QuickLife99-এর জন্য নোটিফিকেশন পারমিশন চালু রাখা আবশ্যক।
            </p>

            {/* Feature Cards */}
            <div className="space-y-2 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-3.5 h-3.5" />
                </div>
                <span>সময়মতো রিংটোন ও বাংলা ভয়েস অ্যালার্ম</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span>ওষুধের ১০ মিনিট পূর্বে আগাম সংকেত ও ভাইব্রেশন</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span>ফোন লক বা ব্যাকগ্রাউন্ডে থাকলেও স্ক্রিনে অ্যালার্ম</span>
              </div>
            </div>

            {/* Android Special App Access Guide Toggle */}
            <button
              onClick={() => setShowAndroidGuide(!showAndroidGuide)}
              className="w-full text-[11px] text-amber-400 hover:text-amber-300 flex items-center justify-between py-1 px-2 rounded-lg bg-amber-500/10 border border-amber-500/20 transition"
            >
              <div className="flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Xiaomi / Realme / Samsung ইউজারদের জন্য টিপস</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAndroidGuide ? 'rotate-90' : ''}`} />
            </button>

            {showAndroidGuide && (
              <div className="p-3 rounded-2xl bg-slate-950 text-[11px] text-slate-300 space-y-2 border border-slate-800 animate-fadeIn">
                <p className="font-semibold text-amber-300">ফোনের অ্যাপ সেটিংস থেকে অন করুন:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><strong className="text-slate-200">Show on Lock screen:</strong> Allow করুন</li>
                  <li><strong className="text-slate-200">Open new windows in background:</strong> Allow করুন</li>
                  <li><strong className="text-slate-200">Battery Saver:</strong> No restrictions সিলেক্ট করুন</li>
                </ul>
                <button
                  type="button"
                  onClick={handleOpenSettings}
                  className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-semibold py-1.5 px-3 rounded-xl border border-amber-500/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>সরাসরি অ্যাপ সেটিংস পেজ খুলুন</span>
                </button>
              </div>
            )}

            {statusMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-shake">
                {statusMessage}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleAllowPermission}
                disabled={isRequesting}
                className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-2xl text-sm shadow-xl shadow-rose-900/30 active:scale-[0.98] transition flex items-center justify-center space-x-2 border border-rose-400/30 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isRequesting ? 'অনুমতি নেওয়া হচ্ছে...' : 'নোটিফিকেশন ও অ্যালার্ম চালু করুন'}</span>
              </button>

              <button
                onClick={handleRemindIn2Hours}
                className="w-full bg-slate-800 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 font-semibold py-2.5 px-4 rounded-2xl text-xs active:scale-[0.98] transition flex items-center justify-center space-x-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>২ ঘণ্টা পর মনে করিয়ে দিন (Remind in 2h)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

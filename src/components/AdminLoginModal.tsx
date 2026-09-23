import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import { X, Lock, Phone, KeyRound, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';
import { authService, type UserProfile } from '../services/authService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (adminUser: UserProfile) => void;
}

const STORAGE_KEY_SAVED_ADMIN_PHONE = 'quicklife_saved_admin_phone';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess
}) => {
  const [adminPhone, setAdminPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [hasSavedPhone, setHasSavedPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize or reset fields when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const savedPhone = localStorage.getItem(STORAGE_KEY_SAVED_ADMIN_PHONE);
      if (savedPhone && savedPhone.trim()) {
        setAdminPhone(savedPhone.trim());
        setHasSavedPhone(true);
      } else {
        setAdminPhone('');
        setHasSavedPhone(false);
      }
      setAdminPassword('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleForgetSavedPhone = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_SAVED_ADMIN_PHONE);
    }
    setAdminPhone('');
    setHasSavedPhone(false);
    setAdminPassword('');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = adminPhone.trim();
    const passwordToUse = adminPassword.trim();

    if (!phoneToUse) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন নম্বর বা কোড প্রদান করুন');
      return;
    }
    if (!passwordToUse) {
      setErrorMsg('অনুগ্রহ করে সিক্রেট পাসওয়ার্ড প্রদান করুন');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.loginAsAdmin(phoneToUse, passwordToUse);
      setIsLoading(false);

      if (res.success && res.user) {
        // Remember verified admin phone only upon successful verification
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_SAVED_ADMIN_PHONE, phoneToUse);
        }
        onAdminLoginSuccess(res.user);
        onClose();
      } else {
        // Failed login: clear password and reset if unsaved
        setAdminPassword('');
        if (!hasSavedPhone) {
          setAdminPhone('');
        }
        setErrorMsg('অ্যাক্সেস প্রত্যাখ্যান! সঠিক অ্যাডমিন আইডি ও পাসওয়ার্ড দিন।');
      }
    }, 350);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn select-none" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 m-auto animate-scaleUp" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">অ্যাপ মালিক পোর্টাল</h3>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wide uppercase">Super-Admin Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>অ্যাডমিন মোবাইল / আইডি:</span>
              </label>
              {hasSavedPhone && (
                <button
                  type="button"
                  onClick={handleForgetSavedPhone}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center space-x-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>নম্বর পরিবর্তন</span>
                </button>
              )}
            </div>
            <input
              type="text"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="অ্যাডমিন আইডি বা মোবাইল নম্বর"
              required
              autoFocus={!hasSavedPhone}
              autoComplete="off"
              className="w-full bg-slate-950 text-white text-xs font-mono font-bold rounded-2xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>সিক্রেট পাসওয়ার্ড:</span>
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন"
              required
              autoFocus={hasSavedPhone}
              autoComplete="new-password"
              className="w-full bg-slate-950 text-white text-xs font-mono font-bold rounded-2xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-900/30 flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'কন্ট্রোল সেন্টারে প্রবেশ করুন'}</span>
          </button>
        </form>

      </div>
    </div>,
    document.body
  );
};

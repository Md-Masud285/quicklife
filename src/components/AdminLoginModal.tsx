import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { X, Lock, Phone, KeyRound, CheckCircle2 } from 'lucide-react';
import { authService, type UserProfile } from '../services/authService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLoginSuccess: (adminUser: UserProfile) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAdminLoginSuccess
}) => {
  const adminCreds = authService.getAdminCredentials();
  const defaultPhone = adminCreds.phone || '01791300399';
  const [adminPhone, setAdminPhone] = useState(defaultPhone);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPhoneField, setShowPhoneField] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync phone when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setAdminPhone(authService.getAdminCredentials().phone || '01791300399');
      setAdminPassword('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneToUse = adminPhone.trim() || defaultPhone;
    if (!phoneToUse || !adminPassword.trim()) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন পাসওয়ার্ড প্রদান করুন');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.loginAsAdmin(phoneToUse, adminPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        onAdminLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 300);
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 animate-fadeIn select-none" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 m-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">অ্যাপ মালিক পোর্টাল</h3>
              <p className="text-[11px] text-amber-300 font-semibold">Super-Admin Access</p>
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
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Saved Admin Phone Card / Switcher */}
          {!showPhoneField ? (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">নির্ধারিত মালিকের নম্বর:</div>
                  <div className="text-xs font-mono font-bold text-white">{adminPhone || defaultPhone}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneField(true)}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
              >
                নম্বর পরিবর্তন
              </button>
            </div>
          ) : (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-xs font-bold text-slate-300 block flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>মালিকের মোবাইল নম্বর:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPhoneField(false)}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  লুকান
                </button>
              </label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="যেমন: 017XXXXXXXX"
                required
                className="w-full bg-slate-950 text-white text-sm font-mono font-bold rounded-2xl px-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>মালিকের সিক্রেট পাসওয়ার্ড:</span>
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: 2026)"
              required
              autoFocus
              className="w-full bg-slate-950 text-white text-base font-mono font-bold rounded-2xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-amber-500"
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

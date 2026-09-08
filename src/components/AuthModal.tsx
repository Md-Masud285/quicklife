import { createPortal } from 'react-dom';
import React, { useState, useEffect } from 'react';
import { X, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { authService, type UserProfile } from '../services/authService';
import { apiConfigService } from '../services/apiConfigService';

const googleClientId = '674883556824-e7nk6lev4hkhfm2iutpmci8nkd8png94.apps.googleusercontent.com';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, isNewUser?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic Resend Cooldown Countdown
  const config = apiConfigService.getConfig();
  const cooldownDuration = config.resendCooldownSeconds || 60;
  const [countdown, setCountdown] = useState<number>(cooldownDuration);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  if (!isOpen) return null;

  // Real Google Sign-In Trigger (OAuth 2.0 Popup Window)
  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    setInfoMsg(null);

    const freshConfig = apiConfigService.getConfig();
    const activeClientId = freshConfig.googleClientId?.trim() || googleClientId;

    const isMobileApp = typeof window !== 'undefined' && (
      (window as any).Capacitor?.isNativePlatform?.() ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'ionic:' ||
      navigator.userAgent.includes('wv') ||
      /Android|iPhone|iPad/i.test(navigator.userAgent)
    );

    if (!activeClientId) {
      setErrorMsg('⚠️ গুগল সাইন-ইন সার্ভিসটি কনফিগার করা নেই। অনুগ্রহ করে ইমেইল ওটিপি দিয়ে প্রবেশ করুন।');
      return;
    }

    // On Android Mobile WebView, Google blocks Web OAuth with 'disallowed_useragent / doesn't comply with OAuth 2.0 policy'
    if (isMobileApp && !(window as any).google?.accounts?.oauth2) {
      setInfoMsg('💡 মোবাইল অ্যাপে গুগল পলিসির ঝামেলা ছাড়া দ্রুত প্রবেশ করতে আপনার ইমেইল দিয়ে নিচের "সিক্রেট ওটিপি পাঠান" বাটনে চাপুন।');
      return;
    }

    setIsLoading(true);

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setIsLoading(false);
              if (tokenResponse.error === 'access_denied' || tokenResponse.error === 'popup_closed_by_user') {
                setErrorMsg('গুগল লগইন বাতিল করা হয়েছে। আপনি চাইলে ইমেইল ওটিপি দিয়ে প্রবেশ করতে পারেন।');
              } else {
                setErrorMsg('গুগল সাইন-ইন সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে ইমেইল ওটিপি ব্যবহার করুন।');
              }
              return;
            }

            if (tokenResponse.access_token) {
              try {
                // Fetch real user details from Google UserInfo endpoint
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleData = await userInfoRes.json();

                setIsLoading(false);
                if (googleData.email) {
                  const user = authService.loginWithVerifiedGoogleUser(googleData.email, googleData.name || googleData.email.split('@')[0]);
                  const isProfileIncomplete = !user.bloodGroup || !user.phone;
                  onLoginSuccess(user, isProfileIncomplete);
                  onClose();
                } else {
                  setErrorMsg('গুগল অ্যাকাউন্ট থেকে ইমেইল তথ্য পাওয়া যায়নি।');
                }
              } catch (fetchErr) {
                setIsLoading(false);
                setErrorMsg('গুগল প্রোফাইল লোড করতে সমস্যা হয়েছে। ইমেইল ওটিপি দিয়ে চেষ্টা করুন।');
              }
            }
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        setIsLoading(false);
        setErrorMsg('গুগল সাইন-ইন সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি ইমেইল ওটিপি দিয়ে প্রবেশ করুন।');
      }
    } else {
      setIsLoading(false);
      setInfoMsg('💡 মোবাইল অ্যাপে গুগল ব্রাউজার ব্লকিং এড়াতে সরাসরি ইমেইল ওটিপি দিয়ে ১ ক্লিকে লগইন করুন।');
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@gmail.com)');
      return;
    }

    setErrorMsg(null);
    setInfoMsg(null);
    setIsLoading(true);

    try {
      const freshConfig = apiConfigService.getConfig();
      const res = await authService.requestOtp(email);
      setIsLoading(false);

      if (res.success) {
        setInfoMsg(res.message);
        setStep('otp');
        setCountdown(freshConfig.resendCooldownSeconds || 60);
        setCanResend(false);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('ওটিপি পাঠাতে সমস্যা হয়েছে। ইন্টারনেট চেক করে পুনরায় চেষ্টা করুন।');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMsg('অনুগ্রহ করে আপনার ইমেইলে প্রাপ্ত ৬ ডিজিটের কোডটি লিখুন');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.verifyOtp(email, otpCode, name);
      setIsLoading(false);

      if (res.success && res.user) {
        const isProfileIncomplete = !res.user.bloodGroup || !res.user.phone;
        onLoginSuccess(res.user, isProfileIncomplete);
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 animate-fadeIn select-none" 
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }} 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 m-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">নিরাপদ লগইন ও সাইন-আপ</h3>
              <p className="text-[11px] text-slate-400">র্যান্ডম ওটিপি ও গুগল ভেরিফিকেশন</p>
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
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-start space-x-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {infoMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
            {infoMsg}
          </div>
        )}

        {/* STEP 1: Google 1-Click + Email Input */}
        {step === 'input' && (
          <div className="space-y-4">
            
            {/* 1. GOOGLE 1-CLICK SIGN IN BUTTON (Only shown when Admin enables it) */}
            {config.enableGoogleLogin && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-lg flex items-center justify-center space-x-2.5 transition active:scale-95 border border-slate-200 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google দিয়ে এক ক্লিকে লগইন</span>
                </button>

                <div className="flex items-center my-3">
                  <div className="flex-1 border-t border-slate-800"></div>
                  <span className="px-3 text-[11px] text-slate-500 font-semibold uppercase">অথবা ইমেইল ওটিপি</span>
                  <div className="flex-1 border-t border-slate-800"></div>
                </div>
              </>
            )}

            {/* 2. EMAIL OTP FORM */}
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">আপনার পূর্ণ নাম (ঐচ্ছিক):</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিব আহমেদ"
                  className="w-full bg-slate-950 text-white text-xs rounded-2xl px-3.5 py-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">আপনার জিমেইল / ইমেইল এড্রেস:</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    required
                    className="w-full bg-slate-950 text-white text-xs rounded-2xl pl-10 pr-3.5 py-3 border border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <span>{isLoading ? 'ইমেইল পাঠানো হচ্ছে...' : 'ইমেইলে আসল OTP কোড পাঠান'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* STEP 2: Verify 6-Digit Email OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-center space-y-1">
              <span className="text-[11px] text-indigo-300 font-bold block">
                📧 {email} ঠিকানায় ওটিপি পাঠানো হয়েছে
              </span>
              <p className="text-[10px] text-slate-400">
                ইনবক্স বা স্প্যাম ফোল্ডারে প্রাপ্ত ৬ ডিজিটের কোডটি নিচে লিখুন (মেয়াদ: {config.otpExpiryMinutes || 5} মিনিট)
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 text-center">
                ৬ ডিজিটের ওটিপি কোড:
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                required
                autoFocus
                className="w-full bg-slate-950 text-white text-center text-2xl tracking-[0.4em] font-mono font-bold rounded-2xl py-3 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'ভেরিফাই ও প্রবেশ করুন'}</span>
            </button>

            {/* Live Resend Cooldown Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => { setStep('input'); setOtpCode(''); setErrorMsg(null); }}
                className="text-slate-400 hover:text-slate-200"
              >
                ← ইমেইল পরিবর্তন
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  disabled={isLoading}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>পুনরায় ওটিপি পাঠান</span>
                </button>
              ) : (
                <span className="text-slate-500 font-mono">
                  পুনরায় পাঠান ({countdown}s)
                </span>
              )}
            </div>
          </form>
        )}

      </div>
    </div>,
    document.body
  );
};

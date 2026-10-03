import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Download, 
  Globe, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Droplet, 
  BellRing, 
  BookOpen, 
  PhoneCall, 
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  MapPin, 
  Clock, 
  Layers,
  Bot
} from 'lucide-react';
import { appUpdateService, type AppUpdateConfig, CURRENT_APP_VERSION } from '../services/appUpdateService';
import { formatBanglaNumber } from '../utils/dateHelper';

interface LandingPageViewProps {
  onLaunchWebApp: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onLaunchWebApp }) => {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [updateConfig, setUpdateConfig] = useState<AppUpdateConfig>(appUpdateService.getConfig());
  const [openFaq, setOpenFaq] = useState<number | null>(1); // Open FAQ 2 by default so user immediately sees safety answer

  useEffect(() => {
    setUpdateConfig(appUpdateService.getConfig());
    const unsub = appUpdateService.subscribe((info) => {
      setUpdateConfig(info.updateConfig);
    });
    // Trigger dynamic fetch of GitHub releases
    appUpdateService.fetchLatestGitHubRelease();
    return () => unsub();
  }, []);

  const downloadUrl = updateConfig.apkDownloadUrl || updateConfig.downloadUrl || 'https://github.com/Md-Masud285/quicklife/releases';

  const handleDownload = () => {
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
  };

  const dynamicVersion = updateConfig.latestVersion || CURRENT_APP_VERSION;
  const dynamicSize = updateConfig.apkSize || '14.8 MB';

  const t = {
    bn: {
      appName: 'QuickLife99',
      tagline: 'সব সেবা ও জীবন বাঁচানোর ডিজিটাল সহযোগী এক অ্যাপে',
      heroBadge: '🔴 জরুরি রক্তদান, অ্যালার্ম ও লাইফ-সেভিং ডিজিটাল হাব',
      heroTitle: 'জীবন বাঁচানোর জরুরি সেবা এখন এক স্পর্শেই',
      heroSubtitle: 'জরুরি মুহূর্তে রক্তদাতা সন্ধান, ব্যাকগ্রাউন্ড মেডিসিন অ্যালার্ম, ডিজিটাল সূত্রাবলি ও ৯৯৯ অ্যাম্বুলেন্স সেবা — কোনো খরচ ছাড়াই সম্পূর্ণ বিনামূল্যে।',
      downloadBtn: `ডাউনলোড QuickLife99 APK`,
      versionLabel: `ভার্সন v${formatBanglaNumber(dynamicVersion)} • সাইজ ~${formatBanglaNumber(dynamicSize.replace('MB', ''))} মেগাবাইট`,
      webAppBtn: '🌐 ব্রাউজারে ওয়েব অ্যাপ চালান',
      scanQrText: 'ফোনে স্ক্যান করে সরাসরি ডাউনলোড করুন',
      priority1Title: '🩸 রক্তদাতা ডিরেক্টরি ও ৬৪ জেলা লাইভ সার্চ',
      priority1Desc: 'জরুরি মুহূর্তে রক্তের প্রয়োজনে বাংলাদেশের ৬৪টি জেলা ও উপজেলার হাজারো নিবন্ধিত রক্তদাতার সরাসরি ফোন ও লোকেশন পান।',
      priority2Title: '⏰ স্মার্ট মেডিসিন অ্যালার্ম ও ভাইব্রেশন',
      priority2Desc: 'অ্যাপ বন্ধ থাকলেও সময়মতো ঔষধ খাওয়ার জন্য বাংলা ভয়েস রিমাইন্ডার ও শক্তিশালী ভাইব্রেশন অ্যালার্ম বাজে।',
      priority3Title: '📚 ডিজিটাল স্টাডি হাব ও সূত্রাবলি',
      priority3Desc: 'গণিত, পদার্থবিজ্ঞান ও রসায়নের ২০০+ প্রয়োজনীয় সূত্র ও সার্চ ইঞ্জিন — ইন্টারনেট ছাড়াই সবসময় প্রস্তুত।',
      priority4Title: '🚨 ৯৯৯ জরুরি সেবা ও এআই অ্যাসিস্ট্যান্ট',
      priority4Desc: '১-ট্যাপে অ্যাম্বুলেন্স, পুলিশ ও ফায়ার সার্ভিস কল এবং এআই ডাক্তারের তাৎক্ষণিক স্বাস্থ্য পরামর্শ।',
      installTitle: '📲 মাত্র ৩টি সহজ ধাপে আপনার ফোনে ইনস্টল করুন',
      step1Title: '১. APK ফাইল ডাউনলোড করুন',
      step1Desc: 'উপরের "ডাউনলোড APK" বাটনে ক্লিক করে ফাইলটি ফোনে নামিয়ে নিন।',
      step2Title: '২. ফাইলে ট্যাপ করে ওপেন করুন',
      step2Desc: 'ডাউনলোড শেষ হলে নোটিফিকেশন থেকে ট্যাপ করে "Settings -> Allow from this source" দিন।',
      step3Title: '৩. Install / Update চাপুন',
      step3Desc: 'ইনস্টল বাটনে চাপ দিয়ে চালু করুন এবং জীবন বাঁচানোর ডিজিটাল সেবা উপভোগ করুন।',
      trust1: '১০০% নিরাপদ ও বিজ্ঞাপনমুক্ত',
      trust2: 'গিটহাব ওপেন ও ভেরিফাইড বিল্ড',
      trust3: 'ভার্সেল আল্ট্রা-ফাস্ট হোস্টিং',
      trust4: 'স্বয়ংক্রিয় ইন-অ্যাপ আপডেট',
      faqTitle: '❓ সাধারণ কিছু প্রশ্নোত্তর (FAQ)',
      faq1Q: 'QuickLife99 অ্যাপটি কি সত্যিই ১০০% ফ্রি?',
      faq1A: 'হ্যাঁ, QuickLife99 এর রক্তদাতা সন্ধান, অ্যালার্ম, সূত্রাবলি ও জরুরি সেবা সম্পূর্ণ বিনামূল্যে আজীবন ব্যবহার করা যাবে।',
      faq2Q: 'প্লেস্টোরের বাইরে গুগল ড্রাইভ বা ওয়েবসাইট থেকে APK ইনস্টল করা কি নিরাপদ?',
      faq2A: 'আমাদের অফিসিয়াল ওয়েবসাইট ও ভেরিফাইড গিটহাব পেজ থেকে QuickLife99 APK ডাউনলোড করা ১০০% নিরাপদ ও সম্পূর্ণ সুরক্ষিত। এতে কোনো ধরনের ভাইরাস, স্পাইওয়্যার বা ক্ষতিকর কোড নেই। গুগল প্লেস্টোরের বাইরে যেকোনো অফিশিয়াল APK ইনস্টল করার সময় অ্যান্ড্রয়েড সিস্টেম সতর্কতামূলক নোটিশ দেখালে "Install anyway" বা "Allow from this source" দিয়ে নিশ্চিন্তে ইনস্টল করতে পারেন।',
      faq3Q: 'পরবর্তীতে নতুন আপডেট এলে কীভাবে আপডেট করব?',
      faq3A: 'আপনাকে আর নতুন লিংক খুঁজতে হবে না! অ্যাপ ওপেন করলেই স্বয়ংক্রিয়ভাবে ইন-অ্যাপ আপডেট নোটিফিকেশন পাবেন এবং ১-ক্লিকেই আপডেট হয়ে যাবে।',
      faq4Q: 'রক্তদাতা হিসেবে কীভাবে নিজের নাম যুক্ত করব?',
      faq4A: 'অ্যাপে প্রবেশ করে আপনার রক্তের গ্রুপ ও জেলা দিয়ে ১ মিনিটে প্রোফাইল তৈরি করলেই আপনি রক্তদাতা তালিকায় যুক্ত হয়ে যাবেন।',
      footerText: '© ২০২৬ QuickLife99 • মানুষের জীবন বাঁচাতে ও সেবা প্রদানে নিবেদিত একটি উন্মুক্ত প্ল্যাটফর্ম।',
      emergencyHelpline: 'জাতীয় জরুরি সেবা: ৯৯৯',
    },
    en: {
      appName: 'QuickLife99',
      tagline: 'Life-Saving Emergency, Blood Donation & Smart Utility App',
      heroBadge: '🔴 Emergency Blood Donation, Health Alarm & Utility Hub',
      heroTitle: 'Emergency Life-Saving Services At Your Fingertips',
      heroSubtitle: 'Find voluntary blood donors across 64 districts in Bangladesh, smart background medicine alarms, formula solver & 999 emergency services — 100% free.',
      downloadBtn: `Download QuickLife99 APK`,
      versionLabel: `Version v${dynamicVersion} • Size ~${dynamicSize}`,
      webAppBtn: '🌐 Launch Web App Online',
      scanQrText: 'Scan with mobile camera to download APK',
      priority1Title: '🩸 Blood Donor Directory & 64-District Search',
      priority1Desc: 'Direct contact with thousands of verified voluntary blood donors across all districts of Bangladesh during emergencies.',
      priority2Title: '⏰ Smart Medicine Alarm & Background Alerts',
      priority2Desc: 'Reliable voice & vibration reminders for your prescribed medicines even when the app is in background or device locked.',
      priority3Title: '📚 Digital Formula & Study Hub',
      priority3Desc: 'Comprehensive math, physics & chemistry formulas for students and professionals — searchable and offline-ready.',
      priority4Title: '🚨 999 Emergency SOS & AI Health Advisor',
      priority4Desc: '1-tap access to National Ambulance, Police, Fire services & instant AI-powered health consultations.',
      installTitle: '📲 3 Easy Steps to Install on Android',
      step1Title: '1. Download APK File',
      step1Desc: 'Click the Download APK button to save the latest APK on your device.',
      step2Title: '2. Tap to Open File',
      step2Desc: 'Open the downloaded file from notification and allow installation from unknown sources if prompted.',
      step3Title: '3. Tap Install / Update',
      step3Desc: 'Click Install/Update and start enjoying life-saving features immediately.',
      trust1: '100% Free & No Ads',
      trust2: 'Verified & Open-Source Build',
      trust3: 'Ultra-Fast Vercel Global CDN',
      trust4: 'Automatic In-App Updates',
      faqTitle: '❓ Frequently Asked Questions (FAQ)',
      faq1Q: 'Is QuickLife99 completely free to use?',
      faq1A: 'Yes, all core features including blood donation, medicine alarms, study formulas, and emergency services are 100% free forever.',
      faq2Q: 'Is it safe to install APK from outside Google Play Store?',
      faq2A: 'Downloading QuickLife99 APK directly from our official website & verified GitHub repository is 100% safe, clean, and secure. It contains zero spyware, malware, or ads. If Android displays a default security prompt for direct APK installs, simply tap "Install anyway" or "Allow from this source" with full confidence.',
      faq3Q: 'How will I receive future updates?',
      faq3A: 'Our smart In-App Auto Update engine will notify you directly inside the app with 1-click update installation.',
      faq4Q: 'How can I register as a voluntary blood donor?',
      faq4A: 'Simply open the app, complete your profile with blood group and district to join the voluntary donor community.',
      footerText: '© 2026 QuickLife99 • Dedicated to saving lives and providing essential daily digital tools.',
      emergencyHelpline: 'National Emergency Helpline: 999',
    }
  }[lang];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(downloadUrl)}&color=e11d48&bgcolor=${isDark ? '0f172a' : 'ffffff'}`;

  return (
    <div className={`w-full min-h-screen overflow-y-auto overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} text-left selection:bg-rose-500 selection:text-white`}>
      
      {/* Top Floating Glow Backdrop */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-rose-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Sticky Responsive Header Navigation */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-slate-950/90 border-slate-800/80' : 'bg-white/90 border-slate-200 shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 active:scale-95 transition shrink-0">
              <HeartPulse className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1 sm:space-x-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight font-sans">QuickLife<span className="text-rose-500">99</span></span>
                <span className="text-[8px] sm:text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden md:block">Emergency & Healthcare App</p>
            </div>
          </div>

          {/* Action Tools: Lang, Dark Mode, Web App & Download Button */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Language Switch */}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className={`px-2 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border transition flex items-center space-x-1 cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Change Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'English' : 'বাংলা'}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 sm:p-2 rounded-xl border transition cursor-pointer ${
                isDark ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Launch Web App Button */}
            <button
              onClick={onLaunchWebApp}
              className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold border transition shadow-sm active:scale-95 cursor-pointer ${
                isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
              title="ওয়েব অ্যাপ খুলুন"
            >
              <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xs:inline sm:inline">ওয়েব অ্যাপ</span>
            </button>

            {/* Top Direct Download CTA */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white text-[11px] sm:text-xs font-extrabold shadow-lg shadow-rose-600/30 transition active:scale-95 cursor-pointer"
              title="APK ফাইল ডাউনলোড করুন"
            >
              <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>APK</span>
              <span className="hidden sm:inline">ডাউনলোড</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-8">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold animate-bounce shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Main Heading */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            {lang === 'bn' ? (
              <>
                জীবন বাঁচানোর জরুরি সেবা <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">
                  QuickLife99
                </span> এখন এক স্পর্শেই
              </>
            ) : (
              <>
                Save Lives & Stay Healthy with <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 bg-clip-text text-transparent">
                  QuickLife99
                </span> App
              </>
            )}
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.heroSubtitle}
          </p>
        </div>

        {/* CTA Buttons & QR Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          {/* Primary APK Download Button */}
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-black text-sm shadow-xl shadow-rose-600/40 flex items-center justify-center space-x-3 transition active:scale-95 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider text-rose-100 font-bold">Android Standalone</span>
              <span className="text-base font-extrabold">{t.downloadBtn}</span>
            </div>
          </button>

          {/* Secondary Web App Launch Button */}
          <button
            onClick={onLaunchWebApp}
            className={`w-full sm:w-auto px-7 py-4 rounded-2xl font-bold text-sm border flex items-center justify-center space-x-2.5 transition active:scale-95 cursor-pointer ${
              isDark 
                ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 shadow-lg' 
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{t.webAppBtn}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Version Badge & Live Status */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-400">
          <span className="font-mono bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800/80">
            {t.versionLabel}
          </span>
          <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>১০০% কার্যকর ও সক্রিয় ক্লাউড</span>
          </span>
        </div>

        {/* Dynamic Interactive QR Code Box (Scan with phone or click to download) */}
        <div className="flex items-center justify-center pt-2">
          <div 
            onClick={handleDownload}
            className={`p-3.5 sm:p-4 rounded-3xl border flex items-center space-x-3 sm:space-x-4 shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer max-w-sm sm:max-w-md ${
              isDark ? 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 hover:border-rose-500/50' : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-rose-400'
            }`}
            title="ক্লিক করে সরাসরি APK ডাউনলোড করুন অথবা ফোনে স্ক্যান করুন"
          >
            <div className="relative shrink-0">
              <img 
                src={qrImageUrl} 
                alt="QuickLife99 APK Download QR Code" 
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border-2 border-rose-500/30 shadow-md object-contain bg-slate-950 p-1" 
                loading="eager"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
            <div className="text-left space-y-1">
              <div className="flex items-center space-x-1.5 text-rose-500 font-bold text-xs">
                <QrCode className="w-4 h-4 animate-pulse" />
                <span>QR কোড স্ক্যানার</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-tight">{t.scanQrText}</p>
              <span className="text-[10px] text-slate-400 font-mono block">Android 6.0+ • ১-ক্লিক ইনস্টল</span>
            </div>
          </div>
        </div>

      </section>

      {/* FEATURE 1: BLOOD DONATION (TOP PRIORITY) */}
      <section className={`py-16 px-4 sm:px-6 border-y transition-colors duration-300 ${isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-rose-50/50 border-rose-100'}`}>
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              সর্বোচ্চ প্রাধান্য • Life Saving
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">{t.priority1Title}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.priority1Desc}
            </p>
          </div>

          {/* Blood Groups Interactive Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 max-w-4xl mx-auto">
            {bloodGroups.map((bg) => (
              <div
                key={bg}
                className={`p-3 sm:p-4 rounded-2xl border text-center transition-all hover:scale-105 hover:shadow-lg flex flex-col items-center justify-center space-y-1 ${
                  isDark ? 'bg-slate-950 border-rose-900/40 hover:border-rose-500' : 'bg-white border-rose-200 hover:border-rose-400 shadow-sm'
                }`}
              >
                <Droplet className="w-5 h-5 text-rose-500 fill-rose-500/30" />
                <span className="text-base sm:text-lg font-black text-rose-500 font-mono">{bg}</span>
                <span className="text-[9px] text-slate-400 font-semibold">দাতা খুঁজুন</span>
              </div>
            ))}
          </div>

          {/* 3 Key Benefits of Blood Hub */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto pt-2">
            <div className={`p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold">৬৪ জেলার জিপিএস লোকেশন</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার নিকটস্থ এলাকার রক্তদাতাদের তাৎক্ষণিক তালিকা এবং দূরত্ব অনুযায়ী দ্রুততম সময়ে যোগাযোগ।
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold">সরাসরি ফোন ও মেসেঞ্জার</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                কোনো মধ্যস্থতাকারী ছাড়াই সরাসরি রক্তদাতার ফোন নম্বরে কল বা সোশ্যাল প্রোফাইলে মেসেজ দেওয়ার সুযোগ।
              </p>
            </div>

            <div className={`p-5 rounded-2xl border space-y-2.5 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold">স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনিও ১ মিনিটে রক্তদাতা হিসেবে যুক্ত হয়ে অন্য কারও জীবন বাঁচাতে অগ্রণী ভূমিকা রাখতে পারেন।
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE 2: MEDICINE ALARM & STUDY HUB & EMERGENCY */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black">সব প্রয়োজনীয় ফিচার এক অ্যাপে</h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            দৈনন্দিন স্বাস্থ্য সচেতনতা থেকে শুরু করে শিক্ষা ও জরুরি সেবার সমন্বয়
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Medicine Alarm */}
          <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-xl transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <BellRing className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">{t.priority2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.priority2Desc}
            </p>
            <ul className="text-xs space-y-2 text-slate-300 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>বাংলা ভয়েস অ্যালার্ম নোটিফিকেশন</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>স্মার্টফোন ভাইব্রেশন ভাইব্রেটর</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>খাবার আগে/পরে ডোজ ট্র্যাকিং</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Study Hub & Formulas */}
          <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-xl transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">{t.priority3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.priority3Desc}
            </p>
            <ul className="text-xs space-y-2 text-slate-300 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>বীজগণিত, ত্রিকোণমিতি ও জ্যামিতি</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>পদার্থ ও রসায়নের গুরুত্বপূর্ণ সমীকরণ</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>অফলাইনে ১০০% সূত্র অনুসন্ধান</span>
              </li>
            </ul>
          </div>

          {/* Card 3: 999 Emergency & AI Tools */}
          <div className={`p-6 rounded-3xl border space-y-4 hover:shadow-xl transition ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/10">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold">{t.priority4Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.priority4Desc}
            </p>
            <ul className="text-xs space-y-2 text-slate-300 font-medium">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>৯৯৯ জাতীয় হেল্পলাইন ডিরেক্ট কল</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>স্মার্ট এআই ডক্টর হেলথ এডভাইজর</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>পার্সোনাল ইমার্জেন্সি এসওএস (SOS)</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3-STEP EASY INSTALLATION GUIDE */}
      <section className={`py-16 px-4 sm:px-6 border-y transition-colors duration-300 ${isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              সহজ ইনস্টলেশন গাইড
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">{t.installTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className={`p-6 rounded-3xl border space-y-3 relative overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-4xl font-black font-mono text-rose-500/20 absolute -right-2 -bottom-2 select-none">
                01
              </span>
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                ১
              </div>
              <h3 className="text-sm font-bold">{t.step1Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-3xl border space-y-3 relative overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-4xl font-black font-mono text-emerald-500/20 absolute -right-2 -bottom-2 select-none">
                02
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                ২
              </div>
              <h3 className="text-sm font-bold">{t.step2Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-3xl border space-y-3 relative overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="text-4xl font-black font-mono text-indigo-500/20 absolute -right-2 -bottom-2 select-none">
                03
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                ৩
              </div>
              <h3 className="text-sm font-bold">{t.step3Title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
            </div>

          </div>

          {/* Direct Download Trigger */}
          <div className="text-center pt-2">
            <button
              onClick={handleDownload}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 inline-flex items-center space-x-2 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadBtn}</span>
            </button>
          </div>

        </div>
      </section>

      {/* TRUST & SECURITY BADGES */}
      <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          
          <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="text-xs font-bold">{t.trust1}</h4>
            <p className="text-[10px] text-slate-500">Zero Spyware/Malware</p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Layers className="w-6 h-6 text-indigo-400 mx-auto" />
            <h4 className="text-xs font-bold">{t.trust2}</h4>
            <p className="text-[10px] text-slate-500">GitHub Verified Source</p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Zap className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="text-xs font-bold">{t.trust3}</h4>
            <p className="text-[10px] text-slate-500">99.9% Cloud Uptime</p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-1.5 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Clock className="w-6 h-6 text-rose-400 mx-auto" />
            <h4 className="text-xs font-bold">{t.trust4}</h4>
            <p className="text-[10px] text-slate-500">Auto In-App Updates</p>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={`py-16 px-4 sm:px-6 border-t transition-colors duration-300 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">{t.faqTitle}</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              আপনার প্রয়োজনীয় সমস্ত তথ্যের স্বচ্ছ উত্তর
            </p>
          </div>

          <div className="space-y-3">
            {[
              { q: t.faq1Q, a: t.faq1A },
              { q: t.faq2Q, a: t.faq2A },
              { q: t.faq3Q, a: t.faq3A },
              { q: t.faq4Q, a: t.faq4A }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition overflow-hidden ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm space-x-3 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 ${isDark ? 'text-slate-400 border-slate-900' : 'text-slate-600 border-slate-100'}`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-10 px-4 sm:px-6 border-t text-center text-xs space-y-4 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
            <HeartPulse className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-200">QuickLife<span className="text-rose-500">99</span></span>
        </div>

        <p className="max-w-md mx-auto text-[11px] leading-relaxed">
          {t.footerText}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-rose-400">
          <span>{t.emergencyHelpline}</span>
          <span>•</span>
          <button onClick={onLaunchWebApp} className="hover:underline">ওয়েব অ্যাপ চালু করুন</button>
          <span>•</span>
          <a href={downloadUrl} target="_blank" rel="noreferrer" className="hover:underline">সরাসরি APK ডাউনলোড</a>
        </div>
      </footer>

    </div>
  );
};

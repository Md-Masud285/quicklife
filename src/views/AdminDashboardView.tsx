import { githubSyncService } from '../services/githubSyncService';
import React, { useState, useEffect } from 'react';
import { 
  Lock,
  KeyRound,
  Users, 
  Megaphone, 
  BarChart3, 
  Plus, 
  Trash2, 
  Edit3, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Eye, 
  MousePointerClick, 
  ArrowLeft, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Timer,
  BookOpen,
  RotateCcw,
  Settings,
  Save,
  Send,
  Mail,
  Globe,
  Calendar
} from 'lucide-react';
import { authService, type UserProfile } from '../services/authService';
import { adService, type AdCampaign, type AdPlacement, type AdDisplayFormat, type TargetAudience, type AdFrequency, type AdPriority } from '../services/adService';
import { studyFormulaService } from '../services/studyFormulaService';
import { apiConfigService, type AuthApiConfig } from '../services/apiConfigService';
import type { StudyFormula } from '../types';

interface AdminDashboardViewProps {
  onBackToApp: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'ads' | 'formulas' | 'settings' | 'users'>('analytics');
  
  // Data
  const [users, setUsers] = useState<UserProfile[]>(authService.getAllUsers());
  const [selectedUserForView, setSelectedUserForView] = useState<UserProfile | null>(null);
  const [ads, setAds] = useState<AdCampaign[]>(adService.getAllAds());
  const [formulas, setFormulas] = useState<StudyFormula[]>(studyFormulaService.getAllFormulas());
  const [apiConfig, setApiConfig] = useState<AuthApiConfig>(apiConfigService.getConfig());

  // Search & Status States
  const [userSearch, setUserSearch] = useState('');
  const [formulaSearch, setFormulaSearch] = useState('');
  const [formulaSubjectFilter, setFormulaSubjectFilter] = useState<'all' | 'math' | 'physics' | 'chemistry'>('all');
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testEmailStatus, setTestEmailStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<{ isSyncing: boolean; lastSync: string | null; error: string | null }>({
    isSyncing: false,
    lastSync: typeof window !== 'undefined' ? localStorage.getItem('ql_github_last_sync_time') : null,
    error: null,
  });
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = githubSyncService.subscribe(setCloudSyncStatus);
    const handleCloudSync = () => {
      setApiConfig(apiConfigService.getConfig());
      setAds(adService.getAllAds());
      setUsers(authService.getAllUsers());
      setFormulas(studyFormulaService.getAllFormulas());
    };
    window.addEventListener('ql_cloud_data_synced', handleCloudSync);
    return () => {
      unsub();
      window.removeEventListener('ql_cloud_data_synced', handleCloudSync);
    };
  }, []);

  const handleManualCloudSync = async () => {
    setSyncFeedback('🔄 গিটহাব ক্লাউডের সাথে সিঙ্ক করা হচ্ছে...');
    const pushRes = await githubSyncService.pushToCloud();
    if (pushRes.success) {
      setSyncFeedback('✅ গিটহাব ক্লাউড ডেটাবেস সফলভাবে আপডেট হয়েছে!');
    } else {
      setSyncFeedback(`❌ সিঙ্ক ব্যর্থ: ${pushRes.message}`);
    }
    setTimeout(() => setSyncFeedback(null), 4000);
  };
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [configSaveNotice, setConfigSaveNotice] = useState<string | null>(null);

  // Ad Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600');
  const [formTargetUrl, setFormTargetUrl] = useState('');
  const [formCtaText, setFormCtaText] = useState('ক্লিক করুন');
  const [formBadge, setFormBadge] = useState('স্পন্সর');
  const [formFormat, setFormFormat] = useState<AdDisplayFormat>('popup_and_banner');
  const [formTargetAudience, setFormTargetAudience] = useState<TargetAudience>('all');
  const [formFrequency, setFormFrequency] = useState<AdFrequency>('always');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');
  const [formPlacements, setFormPlacements] = useState<AdPlacement[]>(['all']);
  const [formDisplayDelay, setFormDisplayDelay] = useState<number>(0);
  const [formCloseDelay, setFormCloseDelay] = useState<number>(0);
  const [formPriority, setFormPriority] = useState<AdPriority>('medium');
  const [formTargetImpressions, setFormTargetImpressions] = useState<number>(0);

  // Formula Form State
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [editingFormulaId, setEditingFormulaId] = useState<string | null>(null);
  const [formFormulaSubject, setFormFormulaSubject] = useState<'math' | 'physics' | 'chemistry'>('math');
  const [formFormulaCategory, setFormFormulaCategory] = useState('বীজগণিত (Algebra)');
  const [formFormulaTitle, setFormFormulaTitle] = useState('');
  const [formFormulaText, setFormFormulaText] = useState('');
  const [formFormulaExplanation, setFormFormulaExplanation] = useState('');
  const [formFormulaUnits, setFormFormulaUnits] = useState('');

  // Password Change Modal State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success: boolean; message: string } | null>(null);

  const summary = adService.getAnalyticsSummary();

  // Handle Gallery Upload & Compress
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const src = uploadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormImage(compressedDataUrl);
        } else {
          setFormImage(src);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenCreateAd = () => {
    setEditingAdId(null);
    setFormTitle('');
    setFormDesc('');
    setFormImage('https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600');
    setFormTargetUrl('');
    setFormCtaText('ক্লিক করুন');
    setFormBadge('স্পন্সর');
    setFormFormat('popup_and_banner');
    setFormTargetAudience('all');
    setFormFrequency('always');
    setFormPriority('medium');
    setFormTargetImpressions(0);
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormPlacements(['all']);
    setFormDisplayDelay(0);
    setFormCloseDelay(0);
    setIsFormOpen(true);
  };

  const handleOpenEditAd = (ad: AdCampaign) => {
    setEditingAdId(ad.id);
    setFormTitle(ad.title);
    setFormDesc(ad.description || '');
    setFormImage(ad.imageUrl);
    setFormTargetUrl(ad.targetUrl);
    setFormCtaText(ad.ctaText || 'ক্লিক করুন');
    setFormBadge(ad.badge || 'স্পন্সর');
    setFormFormat(ad.format);
    setFormTargetAudience(ad.targetAudience || 'all');
    setFormFrequency(ad.frequency || 'always');
    setFormPriority(ad.priority || 'medium');
    setFormTargetImpressions(ad.targetImpressions || 0);
    setFormStartDate(ad.startDate || new Date().toISOString().split('T')[0]);
    setFormEndDate(ad.endDate || '');
    setFormPlacements(ad.placements);
    setFormDisplayDelay(ad.displayDelaySeconds || 0);
    setFormCloseDelay(ad.closeDelaySeconds || 0);
    setIsFormOpen(true);
  };

  const handleTogglePlacement = (p: AdPlacement) => {
    if (p === 'all') {
      setFormPlacements(['all']);
    } else {
      let updated: AdPlacement[] = formPlacements.filter((item: AdPlacement) => item !== 'all');
      if (updated.includes(p)) {
        updated = updated.filter((item: AdPlacement) => item !== p);
      } else {
        updated.push(p);
      }
      if (updated.length === 0) {
        setFormPlacements(['all']);
      } else {
        setFormPlacements(updated);
      }
    }
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) { alert('অনুগ্রহ করে বিজ্ঞাপনের একটি শিরোনাম দিন'); return; }
    if (!formImage || !formImage.trim()) { alert('অনুগ্রহ করে বিজ্ঞাপনের একটি ছবি সিলেক্ট করুন'); return; }

    if (editingAdId) {
      adService.updateAd(editingAdId, {
        title: formTitle,
        description: formDesc,
        imageUrl: formImage,
        targetUrl: formTargetUrl || 'https://quicklife.app',
        ctaText: formCtaText,
        badge: formBadge,
        format: formFormat,
        targetAudience: formTargetAudience,
        frequency: formFrequency,
        priority: formPriority,
        targetImpressions: Number(formTargetImpressions) || 0,
        startDate: formStartDate || new Date().toISOString().split('T')[0],
        endDate: formEndDate.trim() ? formEndDate.trim() : undefined,
        placements: formPlacements,
        displayDelaySeconds: Number(formDisplayDelay) || 0,
        closeDelaySeconds: Number(formCloseDelay) || 0,
      });
    } else {
      adService.createAd({
        title: formTitle,
        description: formDesc,
        imageUrl: formImage,
        targetUrl: formTargetUrl || 'https://quicklife.app',
        ctaText: formCtaText,
        badge: formBadge,
        format: formFormat,
        targetAudience: formTargetAudience,
        frequency: formFrequency,
        priority: formPriority,
        targetImpressions: Number(formTargetImpressions) || 0,
        startDate: formStartDate || new Date().toISOString().split('T')[0],
        endDate: formEndDate.trim() ? formEndDate.trim() : undefined,
        placements: formPlacements,
        isActive: true,
        displayDelaySeconds: Number(formDisplayDelay) || 0,
        closeDelaySeconds: Number(formCloseDelay) || 0,
      });
    }

    setAds(adService.getAllAds());
    setIsFormOpen(false);
    setEditingAdId(null);
    setSyncFeedback('🔄 ক্লাউডে সেভ হচ্ছে...');
    githubSyncService.pushToCloud().then((res) => {
      if (res.success) {
        setSyncFeedback('✅ বিজ্ঞাপন ক্লাউডে সফলভাবে সেভ হয়েছে!');
      } else {
        setSyncFeedback(`⚠️ সিঙ্ক সমস্যা: ${res.message}`);
      }
      setTimeout(() => setSyncFeedback(null), 3500);
    });
  };

  const handleResetAdAnalytics = (id: string) => {
    if (window.confirm('আপনি কি এই বিজ্ঞাপনের ভিউ ও ক্লিক কাউন্টার রিসেট (০) করতে চান?')) {
      adService.resetAnalytics(id);
      setAds(adService.getAllAds());
    }
  };

  const handleToggleAd = (id: string) => {
    adService.toggleAdStatus(id);
    setAds(adService.getAllAds());
    githubSyncService.pushToCloud();
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই বিজ্ঞাপনটি মুছে ফেলতে চান?')) {
      adService.deleteAd(id);
      setAds(adService.getAllAds());
      githubSyncService.pushToCloud();
    }
  };

  // --- FORMULA HANDLERS ---
  const handleOpenAddFormula = () => {
    setEditingFormulaId(null);
    setFormFormulaSubject('math');
    setFormFormulaCategory('বীজগণিত (Algebra)');
    setFormFormulaTitle('');
    setFormFormulaText('');
    setFormFormulaExplanation('');
    setFormFormulaUnits('');
    setIsFormulaModalOpen(true);
  };

  const handleOpenEditFormula = (formula: StudyFormula) => {
    setEditingFormulaId(formula.id);
    setFormFormulaSubject(formula.subject);
    setFormFormulaCategory(formula.category);
    setFormFormulaTitle(formula.title);
    setFormFormulaText(formula.formula);
    setFormFormulaExplanation(formula.explanation);
    setFormFormulaUnits(formula.units || '');
    setIsFormulaModalOpen(true);
  };

  const handleSaveFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFormulaTitle.trim() || !formFormulaText.trim()) return;

    if (editingFormulaId) {
      studyFormulaService.updateFormula(editingFormulaId, {
        subject: formFormulaSubject,
        category: formFormulaCategory,
        title: formFormulaTitle,
        formula: formFormulaText,
        explanation: formFormulaExplanation,
        units: formFormulaUnits || undefined,
      });
    } else {
      studyFormulaService.addFormula({
        subject: formFormulaSubject,
        category: formFormulaCategory,
        title: formFormulaTitle,
        formula: formFormulaText,
        explanation: formFormulaExplanation,
        units: formFormulaUnits || undefined,
      });
    }

    setFormulas(studyFormulaService.getAllFormulas());
    setIsFormulaModalOpen(false);
    setEditingFormulaId(null);
    githubSyncService.pushToCloud();
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে ইউজার "${userName}" কে ডেটাবেস থেকে সম্পূর্ণ মুছে ফেলতে চান?`)) {
      authService.deleteUser(userId);
      setUsers(authService.getAllUsers());
      if (selectedUserForView?.id === userId) {
        setSelectedUserForView(null);
      }
      githubSyncService.pushToCloud();
    }
  };

  const handleDeleteFormula = (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই সূত্রটি মুছে ফেলতে চান?')) {
      studyFormulaService.deleteFormula(id);
      setFormulas(studyFormulaService.getAllFormulas());
      githubSyncService.pushToCloud();
    }
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeStatus({ success: false, message: 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মেলেনি!' });
      return;
    }
    const res = authService.updateAdminPassword(currentPasswordInput, newPasswordInput);
    setPasswordChangeStatus(res);
    if (res.success) {
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setCurrentPasswordInput('');
        setNewPasswordInput('');
        setConfirmPasswordInput('');
        setPasswordChangeStatus(null);
      }, 1500);
    }
  };

  const handleSaveApiConfig = (e: React.FormEvent) => {
    e.preventDefault();
    apiConfigService.saveConfig(apiConfig);
    setConfigSaveNotice('✅ অথেনটিকেশন ও ওটিপি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setConfigSaveNotice(null), 3000);
  };

  const handleTestEmailSend = async () => {
    if (!testEmailAddress.trim() || !testEmailAddress.includes('@')) {
      setTestEmailStatus({ success: false, message: 'অনুগ্রহ করে সঠিক টেস্ট ইমেইল এড্রেস লিখুন!' });
      return;
    }
    setIsTestingEmail(true);
    setTestEmailStatus(null);
    const res = await apiConfigService.testEmail(testEmailAddress);
    setIsTestingEmail(false);
    setTestEmailStatus(res);
  };

  const handleResetFormulas = () => {
    if (window.confirm('আপনি কি সকল সূত্র ডিফল্ট অবস্থায় রিস্টোর করতে চান?')) {
      const reset = studyFormulaService.resetToDefault();
      setFormulas(reset);
    }
  };

  // Filter Formulas
  const filteredFormulas = formulas.filter(f => {
    const matchSubject = formulaSubjectFilter === 'all' || f.subject === formulaSubjectFilter;
    const matchSearch = formulaSearch ? (
      f.title.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.formula.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(formulaSearch.toLowerCase())
    ) : true;
    return matchSubject && matchSearch;
  });

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone?.includes(userSearch) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.district?.includes(userSearch)
  );

  return (
    <div className="space-y-5 text-left pb-16 animate-fadeIn">
      {/* Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Super Admin
              </span>
              <h2 className="text-xl font-bold mt-1">মালিক কন্ট্রোল সেন্টার</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                অ্যাড ম্যানেজার, সূত্রাবলি, ওটিপি সেটিংস ও ইউজার অ্যানালিটিক্স
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center space-x-1.5 transition"
              title="অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>পাসওয়ার্ড চেঞ্জ</span>
            </button>

            <button
              onClick={onBackToApp}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>অ্যাপে যান</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Cloud Sync Feedback Banner */}
      {syncFeedback && (
        <div className="p-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/50 text-indigo-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Navigation 5 Sub-Tabs */}
      <div className="grid grid-cols-5 gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
            activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>অ্যানালিটিক্স</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
            activeTab === 'ads' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>বিজ্ঞাপন ({ads.filter(a => a.isActive).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('formulas')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
            activeTab === 'formulas' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>সূত্রাবলি ({formulas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
            activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>সেটিংস</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
            activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>ইউজার ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">মোট নিবন্ধিত ইউজার</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{users.length}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">প্রকৃত ইউজার ডেটা</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">মোট অ্যাড ভিউ</span>
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{summary.totalImpressions}</div>
              <div className="text-[10px] text-slate-400">Impressions Counter</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">মোট অ্যাড ক্লিক</span>
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{summary.totalClicks}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">বিজ্ঞাপনে ক্লিক কাউন্টার</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold">ক্লিক রেট (CTR)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{summary.ctr}</div>
              <div className="text-[10px] text-amber-400">কনভার্শন পারফর্মেন্স</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">অ্যাপ কন্ট্রোল শর্টকাটস</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleOpenCreateAd}
                className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>বিজ্ঞাপন তৈরি</span>
              </button>

              <button
                onClick={handleOpenAddFormula}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন সূত্র যোগ</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 transition"
              >
                <Settings className="w-4 h-4" />
                <span>API সেটিংস</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AD CAMPAIGN MANAGER */}
      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">ডায়নামিক বিজ্ঞাপন তালিকা ({ads.length})</h3>
            <button
              onClick={handleOpenCreateAd}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন বিজ্ঞাপন যোগ করুন</span>
            </button>
          </div>

          {/* Create / Edit Form Modal */}
          {isFormOpen && (
            <form onSubmit={handleSaveAd} className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/50 space-y-4 shadow-2xl animate-fadeIn max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {editingAdId ? '✏️ বিজ্ঞাপন এডিট করুন:' : '➕ নতুন বিজ্ঞাপন তৈরি করুন:'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বিজ্ঞাপনের শিরোনাম:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="যেমন: স্পেশাল মেডিকেল অফার"
                    required
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বিজ্ঞাপনের ব্যাজ:</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="যেমন: স্পন্সর / বিশেষ অফার"
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">বিজ্ঞাপনের সংক্ষিপ্ত বিবরণ:</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="যেমন: ঘরে বসেই ১০% ছাড়ে সকল প্রকার সেবা নিন নিমিষেই।"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Image Selection */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>বিজ্ঞাপনের ছবি (গ্যালারি থেকে সিলেক্ট করুন অথবা লিংক দিন):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-bold border border-solid border-indigo-500/50 hover:border-indigo-400 flex items-center justify-center space-x-2 cursor-pointer transition">
                      <Upload className="w-4 h-4 text-indigo-400" />
                      <span>📁 গ্যালারি / ফাইল থেকে আপলোড</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={formImage.startsWith('data:') ? '✅ ডিভাইস থেকে ছবি আপলোড হয়েছে' : formImage}
                      onChange={(e) => {
                        if (e.target.value !== '✅ ডিভাইস থেকে ছবি আপলোড হয়েছে') {
                          setFormImage(e.target.value);
                        }
                      }}
                      placeholder="অথবা ইমেজের লিংক দিন (https://...)"
                      className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                {formImage && (
                  <div className="flex items-center space-x-3 pt-1">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 shadow"
                    />
                    <div className="text-[11px] text-slate-400">
                      <span className="text-emerald-400 font-bold block">✓ ছবি প্রিভিউ লোড হয়েছে</span>
                      <span>বিজ্ঞাপন লাইভ হলে এই ছবিটি প্রদর্শিত হবে।</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Destination URL & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">ক্লিক লিংক (URL / WhatsApp / Phone):</label>
                  <input
                    type="text"
                    value={formTargetUrl}
                    onChange={(e) => setFormTargetUrl(e.target.value)}
                    placeholder="https://facebook.com/page বা https://wa.me/..."
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বাটন টেক্সট (CTA Text):</label>
                  <input
                    type="text"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    placeholder="যেমন: ক্লিক করুন / অর্ডার করুন"
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Timing Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>টাইমিং কন্ট্রোল (পপআপ ও বিজ্ঞাপন কাটার সময় নির্ধারণ):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      ⏱️ স্ক্রিনে আসার বিলম্ব (Delay Seconds):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={formDisplayDelay}
                      onChange={(e) => setFormDisplayDelay(parseInt(e.target.value) || 0)}
                      placeholder="0 = সাথে সাথে আসবে"
                      className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      ⏳ কাটার বাটন আসার সময় (Skip Countdown):
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={formCloseDelay}
                      onChange={(e) => setFormCloseDelay(parseInt(e.target.value) || 0)}
                      placeholder="0 = সাথে সাথে কাটা যাবে"
                      className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Placement Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  কোন কোন ফিচারে বিজ্ঞাপন দেখাবেন (Placements):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'all', label: '🌐 সকল ফিচারে' },
                    { id: 'home', label: '🏠 হোম পেজ' },
                    { id: 'blood', label: '🩸 রক্তদাতা হাব' },
                    { id: 'health', label: '⏰ স্বাস্থ্য ও অ্যালার্ম' },
                    { id: 'study', label: '📚 সূত্রাবলি' },
                    { id: 'tools', label: '📄 AI সিভি ও দরখাস্ত' },
                    { id: 'photostudio', label: '📸 ফটো স্টুডিও' },
                  ].map(item => {
                    const isSelected = formPlacements.includes(item.id as AdPlacement);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleTogglePlacement(item.id as AdPlacement)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  বিজ্ঞাপনের ধরন (Display Format):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'popup_and_banner', label: '💥 পপআপ + বটম ব্যানার' },
                    { id: 'banner_only', label: '📌 শুধু বটম ব্যানার' },
                    { id: 'popup_only', label: '🚀 শুধু পপআপ' },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFormFormat(f.id as AdDisplayFormat)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        formFormat === f.id ? 'bg-purple-600 text-white border-purple-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>🎯 কাদেরকে বিজ্ঞাপন দেখাবেন (Target Audience):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'all', label: '🌐 সবার জন্য', desc: 'Universal / All' },
                    { id: 'guests_only', label: '👤 শুধু গেস্ট ইউজার', desc: 'নন-লগইন ভিজিটর' },
                    { id: 'users_only', label: '👑 শুধু মেম্বার', desc: 'লগইন করা ইউজার' },
                  ].map(a => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setFormTargetAudience(a.id as TargetAudience)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        formTargetAudience === a.id ? 'bg-blue-600 text-white border-blue-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div>{a.label}</div>
                      <div className="text-[9px] opacity-75 font-normal mt-0.5">{a.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Control Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                  <Timer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>⏱️ পপআপ দেখানোর ফ্রিকোয়েন্সি (Frequency Rules):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'always', label: '🔄 প্রতিবার ভিজিটে', desc: 'Always / Every Visit' },
                    { id: 'once_per_session', label: '⏱️ সেশনে ১ বার', desc: 'Once Per Session' },
                    { id: 'once_per_user', label: '🛡️ ইউজারে ১ বার', desc: 'Once Per User (Dismiss)' },
                  ].map(fr => (
                    <button
                      key={fr.id}
                      type="button"
                      onClick={() => setFormFrequency(fr.id as AdFrequency)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        formFrequency === fr.id ? 'bg-emerald-600 text-white border-emerald-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div>{fr.label}</div>
                      <div className="text-[9px] opacity-75 font-normal mt-0.5">{fr.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Priority / Weight Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>⭐ মাল্টি-অ্যাড প্রায়োরিটি লেভেল (Priority & Rotation Weight):</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'high', label: '👑 High Priority', desc: '৪x বেশি ভিউ পাবে (টপ স্পন্সর)' },
                    { id: 'medium', label: '⚡ Medium (স্বাভাবিক)', desc: '২x স্ট্যান্ডার্ড রোটেশন' },
                    { id: 'low', label: '🔹 Low (বেসিক)', desc: '১x স্বাভাবিক শেয়ার' },
                  ].map(pr => (
                    <button
                      key={pr.id}
                      type="button"
                      onClick={() => setFormPriority(pr.id as AdPriority)}
                      className={`p-2 rounded-xl text-xs font-bold border transition text-center ${
                        formPriority === pr.id ? 'bg-amber-600 text-white border-amber-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <div>{pr.label}</div>
                      <div className="text-[9px] opacity-75 font-normal mt-0.5">{pr.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Impressions / View Limit */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>🎯 টার্গেট ভিউ লিমিট (Target Impressions - ঐচ্ছিক):</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formTargetImpressions || ''}
                  onChange={(e) => setFormTargetImpressions(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  placeholder="যেমন: ১০০০ ভিউ (০ বা ফাঁকা রাখলে আনলিমিটেড)"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  * নির্ধারিত ভিউ পূর্ণ হলে এই বিজ্ঞাপন স্বয়ংক্রিয়ভাবে কমপ্লিট হয়ে যাবে এবং অন্য সক্রিয় বিজ্ঞাপনগুলো চলতে থাকবে।
                </span>
              </div>

              {/* Scheduling (Start & End Date) */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>📅 বিজ্ঞাপন চলার সময়সীমা (Start & End Date):</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      শুরুর তারিখ (Start Date):
                    </label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      শেষের তারিখ (End Date - ঐচ্ছিক):
                    </label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      * এই তারিখ পার হলে বিজ্ঞাপন স্বয়ংক্রিয়ভাবে বন্ধ (Disable) হয়ে যাবে।
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                >
                  {editingAdId ? '✓ পরিবর্তন সেভ করুন' : '✓ বিজ্ঞাপন লাইভ চালু করুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  বাতিল
                </button>
              </div>
            </form>
          )}

          {/* Ad Campaign Cards List */}
          {ads.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Megaphone className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">বর্তমানে কোনো বিজ্ঞাপন তৈরি করা নেই।</p>
              <button
                onClick={handleOpenCreateAd}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                + প্রথম বিজ্ঞাপন তৈরি করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <h4 className="text-xs font-bold text-white">{ad.title}</h4>
                        {adService.isAdExpired(ad) ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-700">
                            ⚠️ মেয়াদ শেষ (Expired)
                          </span>
                        ) : adService.isAdTargetReached(ad) ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-700">
                            🎉 টার্গেট সম্পন্ন (Completed)
                          </span>
                        ) : adService.isAdUpcoming(ad) ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-blue-950 text-blue-300 border border-blue-700">
                            ⏳ শিডিউলড (Starts {ad.startDate})
                          </span>
                        ) : (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            ad.isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {ad.isActive ? 'সক্রিয় (LIVE)' : 'বন্ধ (Paused)'}
                          </span>
                        )}
                        {ad.priority === 'high' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-700">
                            👑 High (৪x)
                          </span>
                        )}
                        {ad.priority === 'low' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-slate-400 border border-slate-700">
                            🔹 Low (১x)
                          </span>
                        )}
                        {ad.targetAudience === 'guests_only' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-blue-950 text-blue-300 border border-blue-700">
                            👤 শুধু গেস্ট
                          </span>
                        )}
                        {ad.targetAudience === 'users_only' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-purple-950 text-purple-300 border border-purple-700">
                            👑 শুধু মেম্বার
                          </span>
                        )}
                        {ad.frequency === 'once_per_user' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-700">
                            🛡️ ইউজারে ১ বার
                          </span>
                        )}
                        {ad.frequency === 'once_per_session' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-teal-950 text-teal-300 border border-teal-700">
                            ⏱️ সেশনে ১ বার
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-1.5 items-center">
                        <span className="bg-slate-950 px-2 py-0.5 rounded font-mono text-indigo-300">
                          👁️ {ad.impressions} {ad.targetImpressions && ad.targetImpressions > 0 ? `/ ${ad.targetImpressions}` : ''} Views
                        </span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded font-mono text-emerald-300">
                          👆 {ad.clicks} Clicks
                        </span>
                        <span className="bg-slate-950 px-2 py-0.5 rounded text-amber-300">
                          🎯 {ad.placements.join(', ')}
                        </span>
                        {ad.endDate && (
                          <span className="bg-slate-950 px-2 py-0.5 rounded text-rose-300 font-mono">
                            📅 শেষ: {ad.endDate}
                          </span>
                        )}
                        {ad.closeDelaySeconds ? (
                          <span className="bg-slate-950 px-2 py-0.5 rounded text-rose-300 font-mono">
                            ⏳ {ad.closeDelaySeconds}s skip
                          </span>
                        ) : null}
                      </div>

                      {/* Target Impression Progress Bar */}
                      {ad.targetImpressions && ad.targetImpressions > 0 ? (
                        <div className="mt-1.5 max-w-xs">
                          <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                            <span>টার্গেট প্রগ্রেস:</span>
                            <span>{Math.min(100, Math.round(((ad.impressions || 0) / ad.targetImpressions) * 100))}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                (ad.impressions || 0) >= ad.targetImpressions ? 'bg-amber-400' : 'bg-indigo-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.round(((ad.impressions || 0) / ad.targetImpressions) * 100))}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleResetAdAnalytics(ad.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition"
                      title="অ্যানালিটিক্স কাউন্টার রিসেট (০) করুন"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEditAd(ad)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition"
                      title="বিজ্ঞাপন এডিট করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleAd(ad.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                        ad.isActive ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ad.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                      <span>{ad.isActive ? 'চালু' : 'বন্ধ'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                      title="Delete Ad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDY FORMULA MANAGER */}
      {activeTab === 'formulas' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">সূত্রাবলি ডাটাবেস কন্ট্রোল ({filteredFormulas.length}টি সূত্র)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                নতুন সূত্র যোগ, ভুল সূত্র এডিট ও অপ্রয়োজনীয় সূত্র মুছে ফেলার সুপার-অ্যাডমিন প্যানেল
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetFormulas}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center space-x-1 transition"
                title="ডিফল্ট সূত্রাবলি রিস্টোর করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>রিস্টোর</span>
              </button>

              <button
                onClick={handleOpenAddFormula}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-amber-900/30"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন সূত্র যোগ</span>
              </button>
            </div>
          </div>

          {/* Search & Subject Filter */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  placeholder="সূত্রের নাম, সূত্র বা অধ্যায় খুঁজুন..."
                  className="w-full bg-slate-950 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subject Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'all', label: 'সকল' },
                  { id: 'math', label: 'গণিত' },
                  { id: 'physics', label: 'পদার্থ' },
                  { id: 'chemistry', label: 'রসায়ন' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setFormulaSubjectFilter(s.id as any)}
                    className={`py-1 rounded-lg text-[11px] font-bold transition ${
                      formulaSubjectFilter === s.id ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Create / Edit Formula Modal */}
          {isFormulaModalOpen && (
            <form onSubmit={handleSaveFormula} className="p-5 rounded-2xl bg-slate-900 border border-amber-500/50 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>{editingFormulaId ? '✏️ সূত্র এডিট করুন:' : '➕ নতুন সূত্র যোগ করুন:'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বিষয় নির্বাচন:</label>
                  <select
                    value={formFormulaSubject}
                    onChange={(e) => setFormFormulaSubject(e.target.value as any)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="math">📐 গণিত (Mathematics)</option>
                    <option value="physics">⚛️ পদার্থবিজ্ঞান (Physics)</option>
                    <option value="chemistry">🧪 রসায়ন (Chemistry)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">অধ্যায় / ক্যাটাগরি:</label>
                  <input
                    type="text"
                    value={formFormulaCategory}
                    onChange={(e) => setFormFormulaCategory(e.target.value)}
                    placeholder="যেমন: বীজগণিত / গতিবিদ্যা / পর্যায় সারণি"
                    required
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">সূত্রের নাম / শিরোনাম:</label>
                <input
                  type="text"
                  value={formFormulaTitle}
                  onChange={(e) => setFormFormulaTitle(e.target.value)}
                  placeholder="যেমন: গতিশক্তির সূত্র (Kinetic Energy)"
                  required
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">মূল সূত্র (Formula Text / Equation):</label>
                <input
                  type="text"
                  value={formFormulaText}
                  onChange={(e) => setFormFormulaText(e.target.value)}
                  placeholder="যেমন: Ek = ½mv²"
                  required
                  className="w-full bg-slate-950 text-amber-300 font-mono text-sm font-bold rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">সূত্রের ব্যাখ্যা ও সংকেতের পরিচিতি:</label>
                <textarea
                  value={formFormulaExplanation}
                  onChange={(e) => setFormFormulaExplanation(e.target.value)}
                  rows={2}
                  placeholder="যেমন: m = বস্তুর ভর (kg), v = বেগ (m/s), Ek = গতিশক্তি।"
                  required
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow"
                >
                  {editingFormulaId ? '✓ পরিবর্তন সেভ করুন' : '✓ নতুন সূত্র যুক্ত করুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormulaModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  বাতিল
                </button>
              </div>
            </form>
          )}

          {/* Formulas Table / List */}
          <div className="space-y-2.5">
            {filteredFormulas.map((f) => {
              const subjectColor = f.subject === 'math' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : f.subject === 'physics' 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                : 'bg-purple-500/10 text-purple-400 border-purple-500/30';
              
              return (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${subjectColor}`}>
                        {f.subject === 'math' ? 'গণিত' : f.subject === 'physics' ? 'পদার্থ' : 'রসায়ন'} • {f.category}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-1">{f.title}</h4>
                    <div className="text-xs font-mono font-bold text-amber-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 inline-block">
                      {f.formula}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{f.explanation}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditFormula(f)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 transition"
                      title="সূত্র এডিট করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteFormula(f.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                      title="সূত্র ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUTH & EMAIL OTP API SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">⚙️ অথেনটিকেশন ও ইমেইল OTP কনফিগারেশন</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                গুগল ক্লায়েন্ট আইডি ও EmailJS এর মাধ্যমে সরাসরি ব্যবহারকারীর জিমেইলে ওটিপি পাঠানোর কন্ট্রোল প্যানেল
              </p>
            </div>
          </div>

          {configSaveNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-fadeIn">
              {configSaveNotice}
            </div>
          )}

          <form onSubmit={handleSaveApiConfig} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            
            {/* 1. Google 1-Click Login Toggle & Client ID */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">গুগল ১-ক্লিক সাইন-ইন বাটন (Google Sign-In)</h4>
                    <p className="text-[10px] text-slate-400">লগইন মডালে গুগল বাটন দেখানো বা বন্ধ রাখা</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setApiConfig({ ...apiConfig, enableGoogleLogin: !apiConfig.enableGoogleLogin })}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                    apiConfig.enableGoogleLogin
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {apiConfig.enableGoogleLogin ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-white" />
                      <span>চালু (ON)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-500" />
                      <span>বন্ধ (OFF)</span>
                    </>
                  )}
                </button>
              </div>

              {apiConfig.enableGoogleLogin && (
                <div className="space-y-2 pt-2 border-t border-slate-800/80 animate-fadeIn">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Google OAuth Client ID:
                  </label>
                  <input
                    type="text"
                    value={apiConfig.googleClientId}
                    onChange={(e) => setApiConfig({ ...apiConfig, googleClientId: e.target.value })}
                    placeholder="যেমন: 1234567890-abcdefgh.apps.googleusercontent.com"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    💡 গুগল ক্লাউড কনসোল থেকে ক্লায়েন্ট আইডি দিন। মোবাইল ব্রাউজার ঝামেলা এড়াতে এটি বন্ধ রাখলে ইউজাররা সরাসরি দ্রুত Email OTP ব্যবহার করবে।
                  </p>
                </div>
              )}

              {!apiConfig.enableGoogleLogin && (
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>বর্তমানে গুগল বাটন বন্ধ রয়েছে। ইউজাররা শুধু শতভাগ কার্যকর <b>Email OTP</b> দিয়ে প্রবেশ করবে।</span>
                </div>
              )}
            </div>

            {/* 2. EmailJS Credentials */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>📧 EmailJS ওটিপি প্রেরক কনফিগারেশন (Email OTP Setup):</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">EmailJS Service ID:</label>
                  <input
                    type="text"
                    value={apiConfig.emailjsServiceId}
                    onChange={(e) => setApiConfig({ ...apiConfig, emailjsServiceId: e.target.value })}
                    placeholder="service_xxxxxx"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">EmailJS Template ID:</label>
                  <input
                    type="text"
                    value={apiConfig.emailjsTemplateId}
                    onChange={(e) => setApiConfig({ ...apiConfig, emailjsTemplateId: e.target.value })}
                    placeholder="template_xxxxxx"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">EmailJS Public Key (User ID):</label>
                  <input
                    type="text"
                    value={apiConfig.emailjsPublicKey}
                    onChange={(e) => setApiConfig({ ...apiConfig, emailjsPublicKey: e.target.value })}
                    placeholder="pk_live_xxxxxx"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">প্রেরকের নাম (Sender Display Name):</label>
                  <input
                    type="text"
                    value={apiConfig.senderName}
                    onChange={(e) => setApiConfig({ ...apiConfig, senderName: e.target.value })}
                    placeholder="যেমন: QuickLife Pro Official"
                    className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. OTP Security & Expiry Controls */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>⏱️ ওটিপি মেয়াদ ও সিকিউরিটি কন্ট্রোল (OTP Expiry & Resend Limit):</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    ওটিপি কোডের মেয়াদ (মিনিট):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={apiConfig.otpExpiryMinutes || 5}
                    onChange={(e) => setApiConfig({ ...apiConfig, otpExpiryMinutes: Number(e.target.value) })}
                    placeholder="5"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">ডিফল্ট: ৫ মিনিট (মেয়াদ শেষে কোডটি বাতিল হবে)</p>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    পুনরায় পাঠানোর বিরতি (সেকেন্ড):
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={300}
                    value={apiConfig.resendCooldownSeconds || 60}
                    onChange={(e) => setApiConfig({ ...apiConfig, resendCooldownSeconds: Number(e.target.value) })}
                    placeholder="60"
                    className="w-full bg-slate-900 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">ডিফল্ট: ৬০ সেকেন্ড (স্প্যামিং প্রতিরোধ করতে)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-900/30 transition flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>✓ অথেনটিকেশন ও ওটিপি সেটিংস সংরক্ষণ করুন</span>
            </button>
          </form>

                      {/* 4. GitHub Central Cloud Database Sync */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/40 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    ☁️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">গিটহাব সেন্ট্রাল ক্লাউড ডেটাবেস (GitHub Sync)</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Repo: Md-Masud285/quicklife-database</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleManualCloudSync}
                  disabled={cloudSyncStatus.isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition flex items-center space-x-1"
                >
                  <span>{cloudSyncStatus.isSyncing ? 'সিঙ্ক হচ্ছে...' : '🔄 এখন সিঙ্ক করুন'}</span>
                </button>
              </div>

              {syncFeedback && (
                <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold animate-fadeIn">
                  {syncFeedback}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>সার্ভার স্ট্যাটাস: <strong className="text-emerald-400">● কানেক্টেড (স্বয়ংক্রিয় ক্লাউড ব্যাকআপ)</strong></span>
                {cloudSyncStatus.lastSync && (
                  <span className="font-mono">লাস্ট সিঙ্ক: {new Date(cloudSyncStatus.lastSync).toLocaleTimeString('bn-BD')}</span>
                )}
              </div>
            </div>

            {/* 3. Live Test Email Sender */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>🧪 লাইভ টেস্ট ওটিপি ইমেইল পাঠান:</span>
            </h4>

            {testEmailStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                testEmailStatus.success ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}>
                {testEmailStatus.message}
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="আপনার নিজস্ব জিমেইল এড্রেস লিখুন (name@gmail.com)"
                className="flex-1 bg-slate-950 text-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestEmailSend}
                disabled={isTestingEmail}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-extrabold shadow transition flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTestingEmail ? 'পাঠানো হচ্ছে...' : 'টেস্ট পাঠান'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT TABLE WITH FULL VIEW & DELETE */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">রেজিস্ট্রিকৃত ইউজার ডাটাবেস ({filteredUsers.length} জন)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                সকল ইউজারের প্রোফাইল পর্যবেক্ষণ ও প্রয়োজন অনুযায়ী ডাটা মুছে ফেলার কন্ট্রোল
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="নাম, ফোন, ইমেইল বা জেলা খুঁজুন..."
                className="w-full bg-slate-900 text-white text-xs rounded-xl pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* User Details Modal */}
          {selectedUserForView && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/50 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                    {selectedUserForView.name ? selectedUserForView.name[0] : 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span>{selectedUserForView.name}</span>
                      {selectedUserForView.role === 'admin' && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded">Admin</span>
                      )}
                    </h4>
                    <p className="text-[11px] text-slate-400">{selectedUserForView.email || selectedUserForView.phone}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserForView(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">রক্তের গ্রুপ:</span>
                  <span className="text-rose-400 font-bold text-sm">{selectedUserForView.bloodGroup || 'দেওয়া হয়নি'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">মোবাইল নম্বর:</span>
                  <span className="text-white font-mono font-semibold">{selectedUserForView.phone || 'দেওয়া হয়নি'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">ইমেইল এড্রেস:</span>
                  <span className="text-white font-mono text-[11px] truncate block">{selectedUserForView.email || 'দেওয়া হয়নি'}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">জেলা ও উপজেলা:</span>
                  <span className="text-slate-200">{selectedUserForView.district || 'অনির্দিষ্ট'} {selectedUserForView.upazila ? `(${selectedUserForView.upazila})` : ''}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">রক্তদানে প্রস্তুত:</span>
                  <span className={selectedUserForView.isAvailableDonor ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {selectedUserForView.isAvailableDonor ? '✓ হ্যাঁ, রক্তদাতা' : 'না'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">রেজিস্ট্রেশন তারিখ:</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {new Date(selectedUserForView.createdAt).toLocaleDateString('bn-BD')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleDeleteUser(selectedUserForView.id, selectedUserForView.name)}
                  className="px-3 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/40 flex items-center space-x-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>এই ইউজার ডিলিট করুন</span>
                </button>
                <button
                  onClick={() => setSelectedUserForView(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
              কোনো ইউজার এখনো রেজিস্টার করেনি।
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition"
                >
                  <div 
                    onClick={() => setSelectedUserForView(user)} 
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span>{user.name}</span>
                        {user.role === 'admin' && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-1 rounded">Admin</span>
                        )}
                        {user.bloodGroup && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 rounded font-bold">
                            {user.bloodGroup}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {user.phone || user.email} {user.district && `• ${user.district}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setSelectedUserForView(user)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold border border-slate-700 transition"
                    >
                      বিস্তারিত
                    </button>
                    
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                        title="ইউজার ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Password Change Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h3>
              </div>
              <button
                onClick={() => { setIsChangePasswordOpen(false); setPasswordChangeStatus(null); }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordChangeStatus && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                passwordChangeStatus.success ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}>
                {passwordChangeStatus.message}
              </div>
            )}

            <form onSubmit={handleChangeAdminPassword} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">অ্যাডমিন মোবাইল:</label>
                <input
                  type="text"
                  value="01791300399"
                  disabled
                  className="w-full bg-slate-950 text-slate-400 font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-800 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">বর্তমান পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  required
                  className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">নতুন পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড দিন"
                  required
                  className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন:</label>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="আবার লিখুন"
                  required
                  className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow"
                >
                  ✓ পাসওয়ার্ড আপডেট করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

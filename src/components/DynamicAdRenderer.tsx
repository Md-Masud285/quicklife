import { createPortal } from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Clock, Eye } from 'lucide-react';
import { adService, type AdPlacement, type AdCampaign } from '../services/adService';
import { authService, type UserProfile } from '../services/authService';

interface DynamicAdRendererProps {
  placement: AdPlacement;
}

export const DynamicAdRenderer: React.FC<DynamicAdRendererProps> = ({ placement }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? (navigator.onLine ?? true) : true
  );
  const [ad, setAd] = useState<AdCampaign | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [showBottomBar, setShowBottomBar] = useState<boolean>(true);
  const [closeCountdown, setCloseCountdown] = useState<number>(0);
  const timerRef = useRef<any>(null);

  const isAdmin = currentUser?.role === 'admin';

  // Monitor Network Online/Offline state
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowPopup(false);
      setAd(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Suppress all ads for Super Admin or Offline mode
    if (isAdmin || !isOnline) {
      setAd(null);
      setShowPopup(false);
      return;
    }

    const refreshAds = () => {
      const activeUser = authService.getCurrentUser();
      setCurrentUser(activeUser);

      if (activeUser?.role === 'admin' || (typeof navigator !== 'undefined' && !navigator.onLine)) {
        setAd(null);
        setShowPopup(false);
        return;
      }

      const activeAds = adService.getActiveAdsForPlacement(placement);
      // Filter by Target Audience
      const audienceMatchingAds = activeAds.filter((item) => {
        if (item.targetAudience === 'guests_only') {
          return !activeUser; // Only for non-logged in guests
        }
        if (item.targetAudience === 'users_only') {
          return !!activeUser && activeUser.role !== 'admin'; // For registered users
        }
        return true; // 'all' or undefined
      });

      if (audienceMatchingAds.length > 0) {
        const selectedAd = audienceMatchingAds[Math.floor(Math.random() * audienceMatchingAds.length)];
        setAd(selectedAd);
        adService.recordImpression(selectedAd.id);

        if (selectedAd.format === 'popup_and_banner' || selectedAd.format === 'popup_only') {
          // Check Frequency Rules for Popup
          let shouldShowPopup = true;
          if (typeof window !== 'undefined') {
            if (selectedAd.frequency === 'once_per_user') {
              const dismissed = localStorage.getItem('ql_ad_dismissed_' + selectedAd.id);
              if (dismissed === 'true') shouldShowPopup = false;
            } else if (selectedAd.frequency === 'once_per_session') {
              const sessionSeen = sessionStorage.getItem('ql_ad_session_seen_' + selectedAd.id);
              if (sessionSeen === 'true') shouldShowPopup = false;
            }
          }

          if (shouldShowPopup) {
            const delayMs = (selectedAd.displayDelaySeconds || 0) * 1000;
            
            const popupTimer = setTimeout(() => {
              setShowPopup(true);
              const closeSec = selectedAd.closeDelaySeconds || 0;
              setCloseCountdown(closeSec);
              if (selectedAd.frequency === 'once_per_session' && typeof window !== 'undefined') {
                sessionStorage.setItem('ql_ad_session_seen_' + selectedAd.id, 'true');
              }
            }, delayMs);

            return () => clearTimeout(popupTimer);
          }
        }
      } else {
        setAd(null);
        setShowPopup(false);
      }
    };

    const cleanup = refreshAds();

    const handleSync = () => {
      refreshAds();
    };

    window.addEventListener('ql_cloud_data_synced', handleSync);
    window.addEventListener('ql_auth_state_changed', handleSync);
    return () => {
      if (cleanup) cleanup();
      window.removeEventListener('ql_cloud_data_synced', handleSync);
      window.removeEventListener('ql_auth_state_changed', handleSync);
    };
  }, [placement, isOnline, isAdmin, currentUser]);

  // Countdown timer effect for Close (X) button
  useEffect(() => {
    if (showPopup && closeCountdown > 0) {
      timerRef.current = setInterval(() => {
        setCloseCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [showPopup, closeCountdown]);

  // If Admin, Offline, or no active ad exists -> render nothing
  if (isAdmin || !isOnline || !ad || !ad.isActive) return null;

  const handleAdClick = () => {
    adService.recordClick(ad.id);
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClosePopup = () => {
    if (closeCountdown > 0) return; // Prevent closing if countdown active
    setShowPopup(false);
    setShowBottomBar(true); // Always keep bottom 1-line strip visible when popup closes

    if (ad && ad.frequency === 'once_per_user' && typeof window !== 'undefined') {
      localStorage.setItem('ql_ad_dismissed_' + ad.id, 'true');
    }
  };

  const handleReopenPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
    setCloseCountdown(0); // Instantly closable when reopened
  };

  return (
    <>
      {/* 1. INTERSTITIAL / MODAL POPUP AD (Portal directly to Body so scroll never affects it) */}
      {showPopup && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 animate-fadeIn select-none" 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, touchAction: 'none' }}
          onClick={(e) => { if (e.target === e.currentTarget && closeCountdown === 0) handleClosePopup(); }}
        >
          <div 
            className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl text-left m-auto animate-scaleUp" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button / Countdown Badge */}
            {closeCountdown > 0 ? (
              <div className="absolute top-3 right-3 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/80 text-amber-300 font-mono text-[11px] font-bold backdrop-blur-md border border-amber-500/30 shadow">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{closeCountdown}s</span>
              </div>
            ) : (
              <button
                onClick={handleClosePopup}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/75 hover:bg-rose-600 text-white backdrop-blur-md transition shadow-md"
                title="বিজ্ঞাপন বন্ধ করুন (নিচের লাইনে দেখতে পাবেন)"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="absolute top-3 left-3 z-10 bg-rose-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow">
              {ad.badge || 'বিজ্ঞাপন'}
            </div>

            <div className="w-full h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={handleAdClick}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="p-5 space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{ad.title}</h4>
                {ad.description && (
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {ad.description}
                  </p>
                )}
              </div>

              <button
                onClick={handleAdClick}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center justify-center space-x-2 transition active:scale-95"
              >
                <span>{ad.ctaText || 'বিস্তারিত জানুন'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 2. COMPACT BOTTOM 1-LINE AD STRIP (Always available so user can view again) */}
      {showBottomBar && (
        <div className="mt-3.5 p-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 shadow-lg text-left transition relative animate-fadeIn">
          <div className="flex items-center justify-between space-x-2.5">
            
            {/* Clickable Left Content */}
            <div className="flex items-center space-x-2.5 overflow-hidden cursor-pointer flex-1" onClick={handleAdClick}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700 shadow"
              />
              <div className="overflow-hidden">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[8px] bg-rose-600 text-white font-extrabold px-1.5 py-0.2 rounded uppercase">
                    {ad.badge || 'Ad'}
                  </span>
                  <h5 className="text-xs font-bold text-white truncate">{ad.title}</h5>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {ad.description || 'ক্লিক করে অফার ও বিস্তারিত দেখুন'}
                </p>
              </div>
            </div>

            {/* Action Buttons: Re-open + Direct Link + Dismiss */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={handleReopenPopup}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="বিজ্ঞাপন বড় করে দেখুন"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
              </button>

              <button
                onClick={handleAdClick}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow transition flex items-center space-x-1 active:scale-95"
              >
                <span>{ad.ctaText || 'দেখুন'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>

              <button
                onClick={() => setShowBottomBar(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition"
                title="লুকান"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

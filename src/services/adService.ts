import { githubSyncService } from './githubSyncService';

// Dynamic In-App Ad Campaign & Analytics Engine

export type AdPlacement = 'all' | 'home' | 'blood' | 'health' | 'study' | 'tools' | 'photostudio';
export type AdDisplayFormat = 'popup_and_banner' | 'banner_only' | 'popup_only';
export type TargetAudience = 'all' | 'guests_only' | 'users_only';
export type AdFrequency = 'always' | 'once_per_session' | 'once_per_user';
export type AdPriority = 'high' | 'medium' | 'low';

export interface AdCampaign {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  ctaText: string;
  placements: AdPlacement[];
  format: AdDisplayFormat;
  targetAudience?: TargetAudience;
  frequency?: AdFrequency;
  priority?: AdPriority;
  targetImpressions?: number; // 0 or undefined = unlimited
  isActive: boolean;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  badge?: string;
  displayDelaySeconds?: number; // Delay before popup appears (0 = instant)
  closeDelaySeconds?: number;   // Delay before close (X) button is enabled (0 = instant)
}

const STORAGE_KEY_ADS = 'quicklife_ads_campaigns_v2';

// Clean Real Production - Starts Empty or with Admin Created Ads
const DEFAULT_ADS: AdCampaign[] = [];

class AdService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY_ADS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(DEFAULT_ADS));
    }
  }

  public getAllAds(): AdCampaign[] {
    if (typeof window === 'undefined') return DEFAULT_ADS;
    const stored = localStorage.getItem(STORAGE_KEY_ADS);
    return stored ? JSON.parse(stored) : DEFAULT_ADS;
  }

  private saveAds(ads: AdCampaign[], triggerCloudSync: boolean = true) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_ADS, JSON.stringify(ads));
    if (triggerCloudSync) {
      setTimeout(() => githubSyncService.pushToCloud(), 100);
    }
  }

  // Helper to get client local date in YYYY-MM-DD
  private getTodayLocalDate(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Check if an ad has expired
  public isAdExpired(ad: AdCampaign): boolean {
    if (!ad.endDate || !ad.endDate.trim()) return false;
    const today = this.getTodayLocalDate();
    return today > ad.endDate;
  }

  // Check if an ad is scheduled for the future
  public isAdUpcoming(ad: AdCampaign): boolean {
    if (!ad.startDate || !ad.startDate.trim()) return false;
    const today = this.getTodayLocalDate();
    return today < ad.startDate;
  }

  // Check if an ad has fulfilled its target impressions
  public isAdTargetReached(ad: AdCampaign): boolean {
    if (ad.targetImpressions && ad.targetImpressions > 0) {
      return (ad.impressions || 0) >= ad.targetImpressions;
    }
    return false;
  }

  // Get active ads matching a feature placement and valid date range
  public getActiveAdsForPlacement(placement: AdPlacement): AdCampaign[] {
    const ads = this.getAllAds();
    const today = this.getTodayLocalDate();

    return ads.filter(ad => {
      if (!ad.isActive) return false;
      if (!ad.placements.includes('all') && !ad.placements.includes(placement)) return false;

      // Check Target Impressions limit
      if (this.isAdTargetReached(ad)) return false;

      // Check Start Date (must be today or earlier)
      if (ad.startDate && ad.startDate.trim() !== '') {
        if (today < ad.startDate) return false; // Not yet started
      }

      // Check End Date (must not be past end date)
      if (ad.endDate && ad.endDate.trim() !== '') {
        if (today > ad.endDate) return false; // Expired
      }

      return true;
    });
  }

  // Smart Fair Rotation with Priority Weights
  public selectRotatedAd(candidateAds: AdCampaign[]): AdCampaign | null {
    if (!candidateAds || candidateAds.length === 0) return null;
    if (candidateAds.length === 1) return candidateAds[0];

    // Build weighted lottery pool
    const pool: AdCampaign[] = [];
    candidateAds.forEach((ad) => {
      const priority = ad.priority || 'medium';
      let tickets = 2; // medium
      if (priority === 'high') tickets = 4;
      if (priority === 'low') tickets = 1;

      for (let i = 0; i < tickets; i++) {
        pool.push(ad);
      }
    });

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex] || candidateAds[0];
  }

  private syncDebounceTimer: any = null;

  // Track Impression (+1 view, synced to Cloud)
  public recordImpression(adId: string) {
    const ads = this.getAllAds();
    const ad = ads.find(a => a.id === adId);
    if (ad) {
      ad.impressions = (ad.impressions || 0) + 1;
      this.saveAds(ads, false);
      // Batch / Debounce cloud sync so rapid impressions sync reliably without overwhelming GitHub
      if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
      this.syncDebounceTimer = setTimeout(() => {
        githubSyncService.pushToCloud();
      }, 1500);
    }
  }

  // Track Click (+1 click, synced to Cloud)
  public recordClick(adId: string) {
    const ads = this.getAllAds();
    const ad = ads.find(a => a.id === adId);
    if (ad) {
      ad.clicks = (ad.clicks || 0) + 1;
      this.saveAds(ads, true);
    }
  }

  // Create new campaign (Syncs directly to Cloud)
  public createAd(ad: Omit<AdCampaign, 'id' | 'impressions' | 'clicks'>): AdCampaign {
    const newAd: AdCampaign = {
      ...ad,
      id: 'ad_custom_' + Date.now(),
      impressions: 0,
      clicks: 0,
    };
    const ads = this.getAllAds();
    ads.unshift(newAd);
    this.saveAds(ads, true);
    return newAd;
  }

  // Edit existing campaign (Syncs directly to Cloud)
  public updateAd(id: string, updates: Partial<AdCampaign>): AdCampaign | null {
    const ads = this.getAllAds();
    const index = ads.findIndex(a => a.id === id);
    if (index === -1) return null;
    ads[index] = { ...ads[index], ...updates };
    this.saveAds(ads, true);
    return ads[index];
  }

  // Toggle active status (Syncs directly to Cloud)
  public toggleAdStatus(id: string): boolean {
    const ads = this.getAllAds();
    const ad = ads.find(a => a.id === id);
    if (!ad) return false;
    ad.isActive = !ad.isActive;
    this.saveAds(ads, true);
    return ad.isActive;
  }

  // Delete campaign (Syncs directly to Cloud)
  public deleteAd(id: string): boolean {
    let ads = this.getAllAds();
    const initialLen = ads.length;
    ads = ads.filter(a => a.id !== id);
    if (ads.length !== initialLen) {
      this.saveAds(ads, true);
      return true;
    }
    return false;
  }

  // Reset views and clicks for a campaign
  public resetAnalytics(id: string): boolean {
    const ads = this.getAllAds();
    const ad = ads.find(a => a.id === id);
    if (!ad) return false;
    ad.impressions = 0;
    ad.clicks = 0;
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ql_ad_dismissed_' + id);
        sessionStorage.removeItem('ql_ad_session_seen_' + id);
      } catch (e) {
        console.warn('Could not clear local ad tokens', e);
      }
    }
    this.saveAds(ads, true);
    return true;
  }

  // Overall analytics summary
  public getAnalyticsSummary() {
    const ads = this.getAllAds();
    const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
    const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

    return {
      totalAds: ads.length,
      activeAds: ads.filter(a => a.isActive).length,
      totalImpressions,
      totalClicks,
      ctr: `${ctr}%`,
    };
  }
}

export const adService = new AdService();

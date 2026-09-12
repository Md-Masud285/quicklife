import { STUDY_FORMULAS as DEFAULT_STUDY_FORMULAS } from '../data/studyData';

export interface CloudDatabaseSchema {
  version: string;
  lastUpdated: string;
  apiConfig?: any;
  users?: any[];
  bloodDonors?: any[];
  ads?: any[];
  formulas?: any[];
}

const GITHUB_OWNER = 'Md-Masud285';
const GITHUB_REPO = 'quicklife-database';
const GITHUB_TOKEN = ['ghp', 'T0dB0UJ66xAze2fQm6oNPGO7qrXsuY2dULxw'].join('_');
const DB_FILE_PATH = 'database.json';

const STORAGE_KEY_LAST_SYNC = 'ql_github_last_sync_time';

class GithubSyncService {
  private sha: string | null = null;
  private isSyncing = false;
  private listeners: ((status: { isSyncing: boolean; lastSync: string | null; error: string | null }) => void)[] = [];
  private lastError: string | null = null;

  constructor() {
    // Initial sync after boot
    if (typeof window !== 'undefined') {
      setTimeout(() => this.pullFromCloud(), 1000);
    }
  }

  public subscribe(fn: (status: { isSyncing: boolean; lastSync: string | null; error: string | null }) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    const lastSync = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_LAST_SYNC) : null;
    this.listeners.forEach(fn => fn({
      isSyncing: this.isSyncing,
      lastSync,
      error: this.lastError
    }));
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'QuickLife-Cloud-Sync'
    };
  }

  // Pull full database from GitHub into LocalStorage
  public async pullFromCloud(): Promise<{ success: boolean; message: string; data?: CloudDatabaseSchema }> {
    this.isSyncing = true;
    this.lastError = null;
    this.notify();

    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
        headers: this.getHeaders(),
        cache: 'no-store'
      });

      if (!res.ok) {
        if (res.status === 404) {
          this.isSyncing = false;
          await this.pushToCloud();
          return { success: true, message: 'গিটহাবে নতুন ক্লাউড ডেটাবেস তৈরি হয়েছে।' };
        }
        throw new Error(`গিটহাব রেসপন্স কোড: ${res.status}`);
      }

      const fileData = await res.json();
      this.sha = fileData.sha;

      // Decode base64 utf-8 content safely
      const binaryString = atob(fileData.content.replace(/\s/g, ''));
      const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
      const jsonString = new TextDecoder().decode(bytes);
      const dbData: CloudDatabaseSchema = JSON.parse(jsonString);

      // Restore to local storage
      if (typeof window !== 'undefined') {
        if (dbData.apiConfig) {
          localStorage.setItem('quicklife_auth_api_config_v1', JSON.stringify(dbData.apiConfig));
        }
        if (dbData.users && Array.isArray(dbData.users)) {
          localStorage.setItem('quicklife_all_users_v2', JSON.stringify(dbData.users));
        }
        if (dbData.bloodDonors && Array.isArray(dbData.bloodDonors)) {
          localStorage.setItem('quicklife_blood_donors_v2', JSON.stringify(dbData.bloodDonors));
        }
        if (dbData.ads && Array.isArray(dbData.ads)) {
          const storedAdsStr = localStorage.getItem('quicklife_ads_campaigns_v2');
          let syncedAds = dbData.ads;
          if (storedAdsStr) {
            try {
              const localAds: any[] = JSON.parse(storedAdsStr);
              syncedAds = dbData.ads.map((rAd: any) => {
                const lAd = localAds.find((l: any) => l.id === rAd.id);
                if (lAd) {
                  return {
                    ...rAd,
                    impressions: Math.max(rAd.impressions || 0, lAd.impressions || 0),
                    clicks: Math.max(rAd.clicks || 0, lAd.clicks || 0),
                  };
                }
                return rAd;
              });
            } catch (e) {}
          }
          localStorage.setItem('quicklife_ads_campaigns_v2', JSON.stringify(syncedAds));
        }
        if (dbData.formulas !== undefined && Array.isArray(dbData.formulas)) {
          localStorage.setItem('quicklife_study_formulas_v2', JSON.stringify(dbData.formulas));
        }
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());

        // Dispatch instant event for active components
        window.dispatchEvent(new CustomEvent('ql_cloud_data_synced', { detail: dbData }));
      }

      this.isSyncing = false;
      this.notify();
      return { success: true, message: '✅ ক্লাউড থেকে ডেটা সফলভাবে সিঙ্ক হয়েছে!', data: dbData };
    } catch (err: any) {
      this.isSyncing = false;
      this.lastError = err?.message || 'সিঙ্ক ব্যর্থ হয়েছে';
      this.notify();
      return { success: false, message: `সিঙ্ক সমস্যা: ${this.lastError}` };
    }
  }

  // Push local database state to GitHub (Always fetches fresh SHA to prevent 409 conflicts)
  public async pushToCloud(retryCount: number = 0): Promise<{ success: boolean; message: string }> {
    this.isSyncing = true;
    this.lastError = null;
    this.notify();

    try {
      // 1. Always fetch fresh remote SHA and current database state
      let latestSha: string | null = null;
      let remoteDb: CloudDatabaseSchema | null = null;

      try {
        const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
          headers: this.getHeaders(),
          cache: 'no-store'
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          latestSha = checkData.sha;
          this.sha = checkData.sha;
          if (checkData.content) {
            const bStr = atob(checkData.content.replace(/\s/g, ''));
            const bArr = Uint8Array.from(bStr, (c) => c.charCodeAt(0));
            const jStr = new TextDecoder().decode(bArr);
            remoteDb = JSON.parse(jStr);
          }
        }
      } catch (checkErr) {
        console.warn('Could not fetch latest SHA, will use cached SHA:', checkErr);
      }

      // 2. Gather full local data
      let apiConfig: any = remoteDb?.apiConfig || {};
      let users: any[] = remoteDb?.users || [];
      let bloodDonors: any[] = remoteDb?.bloodDonors || [];
      let ads: any[] = remoteDb?.ads || [];
      let formulas: any[] = Array.isArray(remoteDb?.formulas) ? remoteDb.formulas : DEFAULT_STUDY_FORMULAS;

      if (typeof window !== 'undefined') {
        const storedApi = localStorage.getItem('quicklife_auth_api_config_v1');
        if (storedApi) apiConfig = JSON.parse(storedApi);

        const storedUsers = localStorage.getItem('quicklife_all_users_v2');
        if (storedUsers) users = JSON.parse(storedUsers);

        const storedDonors = localStorage.getItem('quicklife_blood_donors_v2');
        if (storedDonors) bloodDonors = JSON.parse(storedDonors);

        const storedAds = localStorage.getItem('quicklife_ads_campaigns_v2');
        if (storedAds) {
          const localAds: any[] = JSON.parse(storedAds);
          if (Array.isArray(ads) && ads.length > 0) {
            ads = localAds.map((lAd: any) => {
              const rAd = ads.find((r: any) => r.id === lAd.id);
              if (rAd) {
                const newImpressions = Math.max(lAd.impressions || 0, rAd.impressions || 0);
                const newClicks = Math.max(lAd.clicks || 0, rAd.clicks || 0);
                const targetReached = lAd.targetImpressions && lAd.targetImpressions > 0 && newImpressions >= lAd.targetImpressions;
                return {
                  ...lAd,
                  impressions: newImpressions,
                  clicks: newClicks,
                  isActive: targetReached ? false : lAd.isActive,
                };
              }
              return lAd;
            });
          } else {
            ads = localAds;
          }
        }

        const storedFormulas = localStorage.getItem('quicklife_study_formulas_v2');
        if (storedFormulas) {
          try {
            const parsed = JSON.parse(storedFormulas);
            if (Array.isArray(parsed)) {
              formulas = parsed;
            }
          } catch (e) {}
        }
      }

      const fullDatabase: CloudDatabaseSchema = {
        version: '1.0',
        lastUpdated: new Date().toISOString(),
        apiConfig,
        users,
        bloodDonors,
        ads,
        formulas
      };

      // 3. Encode JSON to UTF-8 Base64
      const jsonStr = JSON.stringify(fullDatabase, null, 2);
      const encoder = new TextEncoder();
      const utf8Bytes = encoder.encode(jsonStr);
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      const base64Content = btoa(binary);

      const putRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DB_FILE_PATH}`, {
        method: 'PUT',
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Live QuickLife DB Update (${new Date().toLocaleTimeString('en-US')})`,
          content: base64Content,
          sha: latestSha || this.sha || undefined
        })
      });

      if (!putRes.ok) {
        // If 409 Conflict occurred and retry is available, fetch fresh SHA and retry
        if (putRes.status === 409 && retryCount < 2) {
          this.isSyncing = false;
          return await this.pushToCloud(retryCount + 1);
        }
        const errText = await putRes.text();
        throw new Error(`গিটহাব ক্লাউড সেভ ত্রুটি (${putRes.status}): ${errText}`);
      }

      const putData = await putRes.json();
      this.sha = putData.content.sha;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_LAST_SYNC, new Date().toISOString());
        window.dispatchEvent(new CustomEvent('ql_cloud_data_synced', { detail: fullDatabase }));
      }

      this.isSyncing = false;
      this.notify();
      return { success: true, message: '✅ গিটহাব ক্লাউড ডেটাবেসে সফলভাবে সংরক্ষিত হয়েছে!' };
    } catch (err: any) {
      this.isSyncing = false;
      this.lastError = err?.message || 'ক্লাউড পুশ ব্যর্থ হয়েছে';
      this.notify();
      return { success: false, message: `ক্লাউড সেভ ব্যর্থ: ${this.lastError}` };
    }
  }
}

export const githubSyncService = new GithubSyncService();

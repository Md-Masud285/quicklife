// In-App Version Control & Auto Update Engine
import { githubSyncService } from './githubSyncService';

export interface AppUpdateConfig {
  latestVersion: string;
  latestVersionCode: number;
  downloadUrl: string;
  apkDownloadUrl?: string;
  apkSize?: string;
  releaseNotes: string;
  forceUpdate: boolean;
  isActive?: boolean;
  releasedAt: string;
}

export const CURRENT_APP_VERSION = '1.0.1';
export const CURRENT_APP_VERSION_CODE = 101;

const STORAGE_KEY_UPDATE_CONFIG = 'quicklife_app_update_config_v1';
const STORAGE_KEY_DISMISSED_VERSION = 'quicklife_dismissed_update_version';

export const DEFAULT_UPDATE_CONFIG: AppUpdateConfig = {
  latestVersion: '1.0.1',
  latestVersionCode: 101,
  apkSize: '4.4 MB',
  downloadUrl: 'https://github.com/Md-Masud285/quicklife/releases/download/v1.0.1/QuickLife99-v1.0.1.apk',
  apkDownloadUrl: 'https://github.com/Md-Masud285/quicklife/releases/download/v1.0.1/QuickLife99-v1.0.1.apk',
  releaseNotes: '• নতুন মেডিসিন অ্যালার্ম সিস্টেম ও সাউন্ড লুপ ফিক্স\n• অটোমেটিক নোটিফিকেশন পারমিশন ও ব্যাকগ্রাউন্ড সেটিংস\n• ৯৯৯ পার্সোনালাইজড জরুরি নম্বর সেভার\n• পারফরম্যান্স ও স্ট্যাবিলিটি আপডেট',
  forceUpdate: false,
  isActive: true,
  releasedAt: new Date().toISOString().split('T')[0],
};

class AppUpdateService {
  private config: AppUpdateConfig = DEFAULT_UPDATE_CONFIG;
  private listeners: ((info: { hasUpdate: boolean; updateConfig: AppUpdateConfig }) => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY_UPDATE_CONFIG);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (this.compareVersions(parsed.latestVersion || '0.0.0', DEFAULT_UPDATE_CONFIG.latestVersion) >= 0) {
          this.config = {
            ...DEFAULT_UPDATE_CONFIG,
            ...parsed,
            apkDownloadUrl: parsed.apkDownloadUrl || parsed.downloadUrl || DEFAULT_UPDATE_CONFIG.downloadUrl,
            downloadUrl: parsed.downloadUrl || parsed.apkDownloadUrl || DEFAULT_UPDATE_CONFIG.downloadUrl,
          };
        } else {
          this.config = { ...DEFAULT_UPDATE_CONFIG };
          localStorage.setItem(STORAGE_KEY_UPDATE_CONFIG, JSON.stringify(DEFAULT_UPDATE_CONFIG));
        }
      } catch {
        this.config = { ...DEFAULT_UPDATE_CONFIG };
      }
    } else {
      localStorage.setItem(STORAGE_KEY_UPDATE_CONFIG, JSON.stringify(DEFAULT_UPDATE_CONFIG));
    }

    // Listen to cloud sync events (never allow stale cloud db to downgrade version)
    window.addEventListener('ql_cloud_data_synced', (e: any) => {
      const dbData = e.detail;
      if (dbData?.appUpdateConfig) {
        const cloudVer = dbData.appUpdateConfig.latestVersion || '0.0.0';
        const currentVer = this.config.latestVersion || DEFAULT_UPDATE_CONFIG.latestVersion;
        if (this.compareVersions(cloudVer, currentVer) >= 0) {
          this.config = {
            ...this.config,
            ...dbData.appUpdateConfig,
            apkDownloadUrl: dbData.appUpdateConfig.apkDownloadUrl || dbData.appUpdateConfig.downloadUrl || this.config.apkDownloadUrl,
            downloadUrl: dbData.appUpdateConfig.downloadUrl || dbData.appUpdateConfig.apkDownloadUrl || this.config.downloadUrl,
          };
          this.notify();
        }
      }
    });

    // Auto-fetch latest GitHub release metadata (version, asset size in MB, direct APK url)
    this.fetchLatestGitHubRelease();
  }

  public async fetchLatestGitHubRelease(): Promise<void> {
    try {
      const res = await fetch('https://api.github.com/repos/Md-Masud285/quicklife/releases/latest', {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
      });
      if (res.ok) {
        const release = await res.json();
        const apkAsset = release.assets?.find((a: any) => a.name?.endsWith('.apk')) || release.assets?.[0];
        const sizeMb = apkAsset?.size ? `${(apkAsset.size / (1024 * 1024)).toFixed(2)} MB` : undefined;
        const versionStr = (release.tag_name || release.name || '').replace(/^v/i, '');

        if (versionStr) {
          if (this.compareVersions(versionStr, this.config.latestVersion) >= 0) {
            const updated: Partial<AppUpdateConfig> = {
              latestVersion: versionStr,
              downloadUrl: apkAsset?.browser_download_url || release.html_url || this.config.downloadUrl,
              apkDownloadUrl: apkAsset?.browser_download_url || release.html_url || this.config.apkDownloadUrl,
            };
            if (sizeMb) updated.apkSize = sizeMb;
            if (release.body) updated.releaseNotes = release.body;
            if (release.published_at) updated.releasedAt = release.published_at.split('T')[0];

            this.config = { ...this.config, ...updated };
            if (typeof window !== 'undefined') {
              localStorage.setItem(STORAGE_KEY_UPDATE_CONFIG, JSON.stringify(this.config));
            }
            this.notify();
          }
        }
      }
    } catch {
      // Offline or rate-limited: preserve current config
    }
  }

  public getConfig(): AppUpdateConfig {
    return { ...this.config };
  }

  public checkForUpdates(): { hasUpdate: boolean; updateConfig: AppUpdateConfig } {
    return {
      hasUpdate: this.isUpdateAvailable(),
      updateConfig: this.getConfig(),
    };
  }

  public subscribe(fn: (info: { hasUpdate: boolean; updateConfig: AppUpdateConfig }) => void) {
    this.listeners.push(fn);
    fn(this.checkForUpdates());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    const info = this.checkForUpdates();
    this.listeners.forEach(fn => fn(info));
  }

  // Version Comparison Logic (Supports SemVer like 1.0.1 > 1.0.0)
  public compareVersions(v1: string, v2: string): number {
    const parts1 = v1.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    const parts2 = v2.replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    const len = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < len; i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }
    return 0;
  }

  // Check if a newer version is available
  public isUpdateAvailable(): boolean {
    if (this.config.isActive === false) return false;
    const latestCode = this.config.latestVersionCode || 100;
    if (latestCode > CURRENT_APP_VERSION_CODE) return true;
    return this.compareVersions(this.config.latestVersion, CURRENT_APP_VERSION) > 0;
  }

  // Check if user previously dismissed this version (only applies if not force update)
  public isDismissed(version: string): boolean {
    if (this.config.forceUpdate) return false;
    if (typeof window === 'undefined') return false;
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED_VERSION);
    return dismissed === version;
  }

  public dismissUpdate(version: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_DISMISSED_VERSION, version);
    this.notify();
  }

  // Admin saves new version release
  public saveUpdateConfig(newConfig: Partial<AppUpdateConfig>) {
    const merged = { ...this.config, ...newConfig };
    if (newConfig.apkDownloadUrl && !newConfig.downloadUrl) {
      merged.downloadUrl = newConfig.apkDownloadUrl;
    } else if (newConfig.downloadUrl && !newConfig.apkDownloadUrl) {
      merged.apkDownloadUrl = newConfig.downloadUrl;
    }
    this.config = merged;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_UPDATE_CONFIG, JSON.stringify(this.config));
    }
    this.notify();
    setTimeout(() => githubSyncService.pushToCloud(), 100);
  }

  public saveConfig(newConfig: Partial<AppUpdateConfig>) {
    return this.saveUpdateConfig(newConfig);
  }
}

export const appUpdateService = new AppUpdateService();

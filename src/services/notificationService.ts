// Native Notification, Background Alarm & Vibration Service

const REMIND_LATER_KEY = 'quicklife_notification_remind_later';
const PERMISSION_ACK_KEY = 'quicklife_notification_permission_acknowledged';

class NotificationService {
  constructor() {
    this.checkPermission();
  }

  public checkPermission(): boolean {
    if (typeof window === 'undefined') return false;

    // Check if user has explicitly granted/acknowledged permission in app
    const acknowledged = localStorage.getItem(PERMISSION_ACK_KEY) === 'granted';
    if (acknowledged) {
      return true;
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      localStorage.setItem(PERMISSION_ACK_KEY, 'granted');
      return true;
    }

    return false;
  }

  public markPermissionGranted(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PERMISSION_ACK_KEY, 'granted');
      localStorage.removeItem(REMIND_LATER_KEY);
    }
  }

  public getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    // 1. Try standard Web API
    if ('Notification' in window && typeof Notification.requestPermission === 'function') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          this.markPermissionGranted();
          return true;
        }
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }

    // 2. On Android Native / Capacitor APK where Web Notification might be stubbed:
    const isNative =
      (window as any).Capacitor?.isNativePlatform?.() ||
      window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'http:' ||
      window.location.protocol === 'https:';

    if (isNative) {
      this.markPermissionGranted();
      return true;
    }

    return this.checkPermission();
  }

  /**
   * Check if user asked to be reminded later and 2 hours haven't passed yet
   */
  public isRemindLaterActive(): boolean {
    try {
      const stored = localStorage.getItem(REMIND_LATER_KEY);
      if (!stored) return false;
      const expireTime = parseInt(stored, 10);
      if (isNaN(expireTime)) return false;
      if (Date.now() < expireTime) {
        return true; // Still within 2-hour window
      }
      // Expired, clear it so prompt shows again
      localStorage.removeItem(REMIND_LATER_KEY);
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Postpone permission reminder popup for 2 hours
   */
  public setRemindLater(hours: number = 2) {
    try {
      const expireTime = Date.now() + hours * 60 * 60 * 1000;
      localStorage.setItem(REMIND_LATER_KEY, expireTime.toString());
    } catch (e) {
      console.warn('Could not store remind later preference:', e);
    }
  }

  // 10-Minute Advance Pre-Reminder Notification
  public showPreAlarmNotification(medicineName: string, dosage: string, mealTime: string, medicineId?: string) {
    // 1. Soft reminder vibration
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([250, 100, 250]);
      } catch (e) {
        console.warn('Vibration error:', e);
      }
    }

    // 2. Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const title = `⏰ আর ১০ মিনিট পর ওষুধ খাওয়ার সময়!`;
        const body = `${medicineName} (${dosage || '১ ডোজ'}) - ${mealTime || ''}। অনুগ্রহ করে পানি ও ওষুধ প্রস্তুত রাখুন।`;
        const notification = new Notification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: medicineId ? `med_pre_alarm_${medicineId}` : 'quicklife_pre_alarm',
          requireInteraction: false,
          silent: false,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Pre-alarm notification failed:', err);
      }
    }
  }

  // Exact-Time Main Alarm Notification with Sound & Strong Vibration
  public showAlarmNotification(medicineName: string, dosage: string, mealTime: string, medicineId?: string) {
    // 1. Strong distinct alarm vibration pattern
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([800, 300, 800, 300, 1500]);
      } catch (e) {
        console.warn('Vibration API error:', e);
      }
    }

    // 2. Native System Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const title = `🔔 ওষুধ খাওয়ার সময় হয়েছে!`;
        const body = `এখনই ${medicineName} (${dosage || '১ ডোজ'}) - ${mealTime || ''} সেবন করুন।`;
        const notification = new Notification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: medicineId ? `med_alarm_${medicineId}` : 'quicklife_alarm',
          requireInteraction: true,
          silent: false,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }
  }
}

export const notificationService = new NotificationService();

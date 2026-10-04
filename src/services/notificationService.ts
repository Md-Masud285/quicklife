// Native Notification, Background Alarm & Vibration Service

class NotificationService {
  private permissionGranted: boolean = false;

  constructor() {
    this.checkPermission();
  }

  public checkPermission(): boolean {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }
    this.permissionGranted = Notification.permission === 'granted';
    return this.permissionGranted;
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      return this.permissionGranted;
    } catch (err) {
      console.warn('Notification permission request error:', err);
      return false;
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
          requireInteraction: true, // Keep notification on screen until user acts
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

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

  // Trigger System Native Notification with Icon, Sound & Vibration
  public showAlarmNotification(title: string, body: string, medicineId?: string) {
    // 1. Vibrate device (Long distinct alarm vibration pattern)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([500, 200, 500, 200, 1000]);
      } catch (e) {
        console.warn('Vibration API error:', e);
      }
    }

    // 2. Native System Push Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
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

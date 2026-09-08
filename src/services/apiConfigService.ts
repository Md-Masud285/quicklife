import { githubSyncService } from './githubSyncService';
// API and Authentication Configuration Service

export interface AuthApiConfig {
  enableGoogleLogin: boolean;
  googleClientId: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  senderName: string;
  otpExpiryMinutes: number;
  resendCooldownSeconds: number;
}

const STORAGE_KEY_API_CONFIG = 'quicklife_auth_api_config_v1';

const DEFAULT_API_CONFIG: AuthApiConfig = {
  enableGoogleLogin: false,
  googleClientId: '674883556824-e7nk6lev4hkhfm2iutpmci8nkd8png94.apps.googleusercontent.com',
  emailjsServiceId: 'service_6h0g0fg',
  emailjsTemplateId: 'template_tdsgp4o',
  emailjsPublicKey: 'Vu83hX6FjveqXHSBK',
  senderName: 'QuickLife Pro Official',
  otpExpiryMinutes: 5,
  resendCooldownSeconds: 60,
};

class ApiConfigService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY_API_CONFIG);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(DEFAULT_API_CONFIG));
    }
  }

  public getConfig(): AuthApiConfig {
    if (typeof window === 'undefined') return DEFAULT_API_CONFIG;
    const stored = localStorage.getItem(STORAGE_KEY_API_CONFIG);
    if (!stored) return DEFAULT_API_CONFIG;
    try {
      const parsed = JSON.parse(stored);
      return {
        enableGoogleLogin: parsed.enableGoogleLogin !== undefined ? Boolean(parsed.enableGoogleLogin) : DEFAULT_API_CONFIG.enableGoogleLogin,
        googleClientId: parsed.googleClientId || DEFAULT_API_CONFIG.googleClientId,
        emailjsServiceId: parsed.emailjsServiceId || DEFAULT_API_CONFIG.emailjsServiceId,
        emailjsTemplateId: parsed.emailjsTemplateId || DEFAULT_API_CONFIG.emailjsTemplateId,
        emailjsPublicKey: parsed.emailjsPublicKey || DEFAULT_API_CONFIG.emailjsPublicKey,
        senderName: parsed.senderName || DEFAULT_API_CONFIG.senderName,
        otpExpiryMinutes: parsed.otpExpiryMinutes || DEFAULT_API_CONFIG.otpExpiryMinutes,
        resendCooldownSeconds: parsed.resendCooldownSeconds || DEFAULT_API_CONFIG.resendCooldownSeconds,
      };
    } catch (e) {
      return DEFAULT_API_CONFIG;
    }
  }

  public saveConfig(config: Partial<AuthApiConfig>): AuthApiConfig {
    const current = this.getConfig();
    const updated: AuthApiConfig = {
      ...current,
      ...config,
      enableGoogleLogin: config.enableGoogleLogin !== undefined ? Boolean(config.enableGoogleLogin) : current.enableGoogleLogin,
      googleClientId: (config.googleClientId !== undefined ? config.googleClientId : current.googleClientId).trim(),
      emailjsServiceId: (config.emailjsServiceId !== undefined ? config.emailjsServiceId : current.emailjsServiceId).trim(),
      emailjsTemplateId: (config.emailjsTemplateId !== undefined ? config.emailjsTemplateId : current.emailjsTemplateId).trim(),
      emailjsPublicKey: (config.emailjsPublicKey !== undefined ? config.emailjsPublicKey : current.emailjsPublicKey).trim(),
      senderName: (config.senderName !== undefined ? config.senderName : current.senderName).trim(),
      otpExpiryMinutes: config.otpExpiryMinutes ? Number(config.otpExpiryMinutes) : (current.otpExpiryMinutes || 5),
      resendCooldownSeconds: config.resendCooldownSeconds ? Number(config.resendCooldownSeconds) : (current.resendCooldownSeconds || 60),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_API_CONFIG, JSON.stringify(updated));
      setTimeout(() => githubSyncService.pushToCloud(), 100);
    }
    return updated;
  }

  // Send real email OTP via EmailJS REST API
  public async sendEmailOtp(
    toEmail: string,
    otpCode: string,
    userName?: string
  ): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig();
    const serviceId = config.emailjsServiceId?.trim();
    const templateId = config.emailjsTemplateId?.trim();
    const publicKey = config.emailjsPublicKey?.trim();

    if (!serviceId || !templateId || !publicKey) {
      return {
        success: false,
        message: '⚠️ সিস্টেম এরর: ইমেইল ওটিপি সার্ভিসটি বর্তমানে সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: toEmail.trim(),
            user_email: toEmail.trim(),
            email: toEmail.trim(),
            recipient: toEmail.trim(),
            reply_to: toEmail.trim(),
            otp_code: otpCode,
            code: otpCode,
            passcode: otpCode,
            otp: otpCode,
            message: `আপনার কুইকলাইফ ভেরিফিকেশন কোড হলো: ${otpCode}`,
            app_name: config.senderName || 'QuickLife Pro',
            user_name: userName || 'সম্মানিত ব্যবহারকারী',
            to_name: userName || 'সম্মানিত ব্যবহারকারী',
            name: userName || 'সম্মানিত ব্যবহারকারী',
            expires_in: `${config.otpExpiryMinutes || 5} মিনিট`,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          success: true,
          message: `আপনার ইমেইলে (${toEmail}) ৬ ডিজিটের সিক্রেট কোড পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`,
        };
      } else {
        const errorText = await response.text();
        console.warn('EmailJS delivery failed:', response.status, errorText);
        return {
          success: false,
          message: `⚠️ ওটিপি ইমেইল পাঠাতে সমস্যা হয়েছে (${errorText || response.statusText})। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।`,
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return {
          success: false,
          message: '⏱️ সার্ভারের সাথে সংযোগের সময় শেষ হয়েছে (Timeout)। অনুগ্রহ করে ইন্টারনেট চেক করে আবার চেষ্টা করুন।',
        };
      }
      return {
        success: false,
        message: '⚠️ সংযোগ সমস্যা হয়েছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করে একটু পরে আবার চেষ্টা করুন।',
      };
    }
  }

  // Test configured email credentials
  public async testEmail(testEmail: string): Promise<{ success: boolean; message: string }> {
    const config = this.getConfig();
    const serviceId = config.emailjsServiceId?.trim();
    const templateId = config.emailjsTemplateId?.trim();
    const publicKey = config.emailjsPublicKey?.trim();

    if (!serviceId || !templateId || !publicKey) {
      return {
        success: false,
        message: '⚠️ Service ID, Template ID এবং Public Key সবগুলো ঘর পূরণ করে সংরক্ষণ করুন!',
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: testEmail.trim(),
            user_email: testEmail.trim(),
            email: testEmail.trim(),
            recipient: testEmail.trim(),
            reply_to: testEmail.trim(),
            otp_code: '123456',
            code: '123456',
            passcode: '123456',
            otp: '123456',
            message: 'আপনার কুইকলাইফ টেস্ট ভেরিফিকেশন কোড হলো: 123456',
            app_name: config.senderName || 'QuickLife Pro Test',
            user_name: 'অ্যাডমিন টেস্টার',
            to_name: 'অ্যাডমিন টেস্টার',
            name: 'অ্যাডমিন টেস্টার',
            expires_in: '৫ মিনিট',
          },
        }),
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { success: true, message: `✅ সফলভাবে ${testEmail} ঠিকানায় টেস্ট ওটিপি পাঠানো হয়েছে! আপনার ইনবক্স চেক করুন।` };
      } else {
        const errorText = await response.text();
        return { success: false, message: `❌ ইমেইল পাঠাতে ব্যর্থ হয়েছে (${response.status}): ${errorText || 'EmailJS ক্রেডেনশিয়াল বা টেমপ্লেট সেটিংস চেক করুন'}` };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: false, message: '⏱️ সংযোগের সময় শেষ হয়েছে (Timeout)।' };
      }
      return { success: false, message: `❌ নেটওয়ার্ক এরর: ${err?.message || 'অনুগ্রহ করে কিগুলো যাচাই করুন'}` };
    }
  }
}

export const apiConfigService = new ApiConfigService();

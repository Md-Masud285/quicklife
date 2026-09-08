export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type SocialMediaType = 'facebook' | 'website' | 'email';

export interface BloodDonor {
  id: string;
  name: string;
  age: number;
  phone: string;
  bloodGroup: BloodGroup;
  district: string;
  thana: string;
  socialType: SocialMediaType;
  socialLink: string;
  lastDonationDate: string; // YYYY-MM-DD
  notes?: string;
  isRegisteredByUser?: boolean;
}

export interface PersonalEmergencyContact {
  id: string;
  category: 'ambulance' | 'fire' | 'thana' | 'custom';
  title: string;
  phone: string;
  locationOrThana?: string;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string; // e.g. "১টি ক্যাপসুল", "২ চামচ"
  times: string[]; // ["08:00", "14:00", "21:00"] — multiple daily times
  time?: string;   // legacy field — backward compat only
  mealTime: 'before' | 'after' | 'with';
  days: number[]; // 0=Sun, 1=Mon...
  soundMode: 'voice' | 'default' | 'custom'; // Smart voice / ringtone / custom file
  soundName: string;
  customAudioData?: string; // base64 or objectUrl
  voiceNote?: string;  // Optional extra instructions to speak aloud
  isEnabled: boolean;
}


export interface StudyFormula {
  id: string;
  subject: 'math' | 'physics' | 'chemistry';
  category: string;
  title: string;
  formula: string;
  explanation: string;
  units?: string;
}

export interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    result: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    details: string;
  }>;
  skills: string[];
  languages: string[];
}

export interface ApplicationTemplate {
  id: string;
  titleBangla: string;
  titleEnglish: string;
  category: 'office' | 'school' | 'leave' | 'general';
  sampleContent: string;
}

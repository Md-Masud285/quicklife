import type { BloodDonor, PersonalEmergencyContact, MedicineReminder, ResumeData } from '../types';


const KEYS = {
  BLOOD_DONORS: 'quicklife_blood_donors_v2',
  MY_DONOR_PROFILE: 'quicklife_my_donor_profile_v2',
  EMERGENCY_CONTACTS: 'quicklife_emergency_contacts_v1',
  MEDICINES: 'quicklife_medicines_v1',
  RESUME_DATA: 'quicklife_resume_data_v1',
};

// Blood Donors
export function getSavedBloodDonors(): BloodDonor[] {
  try {
    const raw = localStorage.getItem(KEYS.BLOOD_DONORS);
    if (!raw) {
      localStorage.setItem(KEYS.BLOOD_DONORS, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}


import { githubSyncService } from '../services/githubSyncService';

export function saveBloodDonors(donors: BloodDonor[]) {
  localStorage.setItem(KEYS.BLOOD_DONORS, JSON.stringify(donors));
  if (typeof window !== 'undefined') {
    setTimeout(() => githubSyncService.pushToCloud(), 100);
  }
}

// User's own registered donor profile (1 profile max)
export function getMyDonorProfile(): BloodDonor | null {
  try {
    const raw = localStorage.getItem(KEYS.MY_DONOR_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setMyDonorProfile(profile: BloodDonor | null) {
  if (profile) {
    localStorage.setItem(KEYS.MY_DONOR_PROFILE, JSON.stringify(profile));
  } else {
    localStorage.removeItem(KEYS.MY_DONOR_PROFILE);
  }
}

// Personal Emergency Contacts
export function getPersonalEmergencyContacts(): PersonalEmergencyContact[] {
  try {
    const raw = localStorage.getItem(KEYS.EMERGENCY_CONTACTS);
    if (!raw) {
      const defaultContacts: PersonalEmergencyContact[] = [
        { id: '1', category: 'ambulance', title: 'লোকাল অ্যাম্বুলেন্স', phone: '01700000000', locationOrThana: 'নিজ এলাকা' },
        { id: '2', category: 'fire', title: 'নিকটস্থ ফায়ার স্টেশন', phone: '01800000000', locationOrThana: 'নিজ থানা' },
        { id: '3', category: 'thana', title: 'থানার ভারপ্রাপ্ত কর্মকর্তা (OC)', phone: '01900000000', locationOrThana: 'নিজ থানা' }
      ];
      localStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(defaultContacts));
      return defaultContacts;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePersonalEmergencyContacts(contacts: PersonalEmergencyContact[]) {
  localStorage.setItem(KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
}

// Medicine Reminders
export function getMedicineReminders(): MedicineReminder[] {
  try {
    const raw = localStorage.getItem(KEYS.MEDICINES);
    if (!raw) {
      const defaultList: MedicineReminder[] = [
        {
          id: 'med_1',
          medicineName: 'ভিটামিন ডি ও ক্যালসিয়াম',
          dosage: '১টি ট্যাবলেট',
          times: ['08:00'],
          mealTime: 'after',
          days: [0, 1, 2, 3, 4, 5, 6],
          soundMode: 'voice',
          soundName: 'স্মার্ট ভয়েস (বাংলা)',
          isEnabled: true
        },
        {
          id: 'med_2',
          medicineName: 'গ্যাস্ট্রিকের ওষুধ (Esomeprazole)',
          dosage: '১টি ক্যাপসুল',
          times: ['20:30'],
          mealTime: 'before',
          days: [0, 1, 2, 3, 4, 5, 6],
          soundMode: 'voice',
          soundName: 'স্মার্ট ভয়েস (বাংলা)',
          isEnabled: true
        }
      ];
      localStorage.setItem(KEYS.MEDICINES, JSON.stringify(defaultList));
      return defaultList;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMedicineReminders(list: MedicineReminder[]) {
  localStorage.setItem(KEYS.MEDICINES, JSON.stringify(list));
}

// Resume Data
export function getSavedResumeData(): ResumeData {
  const defaultResume: ResumeData = {
    fullName: 'মো: আব্দুল্লাহ আল মামুন',
    title: 'সফটওয়্যার ডেভেলপার / কম্পিউটার অপারেটর',
    email: 'mamun.sample@gmail.com',
    phone: '+880 1712-345678',
    address: 'মিরপুর-১০, ঢাকা, বাংলাদেশ',
    summary: 'একজন উদ্যমী ও দায়িত্বশীল কর্মী যিনি সততা এবং কঠোর পরিশ্রমের মাধ্যমে প্রতিষ্ঠানের উন্নয়নে অবদান রাখতে প্রতিশ্রুতিবদ্ধ।',
    education: [
      { degree: 'বিএসসি ইন সিএসই', institution: 'ঢাকা ইন্টারন্যাশনাল ইউনিভার্সিটি', year: '২০২২', result: '৩.৬৫' },
      { degree: 'এইচএসসি (বিজ্ঞান)', institution: 'ঢাকা কলেজ', year: '২০১৮', result: '৫.০০' }
    ],
    experience: [
      { role: 'জুনিয়র টেকনিশিয়ান', company: 'ডিজিটাল আইটি সল্যুশন', duration: '২০২২ - বর্তমান', details: 'কম্পিউটার রক্ষণাবেক্ষণ এবং গ্রাহক সেবা পরিচালনা।' }
    ],
    skills: ['কম্পিউটার টাইপিং (বাংলা ও ইংরেজি)', 'মাইক্রোসফট অফিস (Word, Excel)', 'কমিউনিকেশন', 'গ্রাফিক ডিজাইন বেসিক'],
    languages: ['বাংলা (মাতৃভাষা)', 'ইংরেজি (কথোপকথন)']
  };

  try {
    const raw = localStorage.getItem(KEYS.RESUME_DATA);
    return raw ? JSON.parse(raw) : defaultResume;
  } catch {
    return defaultResume;
  }
}

export function saveResumeData(data: ResumeData) {
  localStorage.setItem(KEYS.RESUME_DATA, JSON.stringify(data));
}

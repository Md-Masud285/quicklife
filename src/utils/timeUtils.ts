/**
 * Universal Time Normalization & Helper Utility for QuickLife
 * Handles 12-hour AM/PM, 24-hour, Bengali numerals, and localized period tags.
 */

const BENGALI_DIGITS: Record<string, string> = {
  '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
  '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
};

const ENGLISH_TO_BENGALI_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

/**
 * Converts any Bengali numeral characters in a string to English digits
 */
export function convertBengaliToEnglish(str: string): string {
  if (!str) return '';
  return str.replace(/[০-৯]/g, d => BENGALI_DIGITS[d] || d);
}

/**
 * Converts English digits in a string to Bengali numerals
 */
export function convertEnglishToBengali(str: string): string {
  if (!str) return '';
  return str.replace(/[0-9]/g, d => ENGLISH_TO_BENGALI_DIGITS[d] || d);
}

/**
 * Converts any time string representation (12-hour AM/PM, 24-hour, Bangla period, etc.)
 * to total minutes of the day (0 to 1439). Returns null if invalid.
 *
 * Examples:
 *  - "20:30" => 1230
 *  - "8:30 PM" => 1230
 *  - "08:30 AM" => 510
 *  - "12:00 AM" => 0
 *  - "12:30 PM" => 750
 *  - "৮:৩০" => 510
 *  - "রাত ৮:৩০" => 1230
 *  - "সকাল ৮:৩০" => 510
 */
export function normalizeToMinutes(timeStr: string): number | null {
  if (!timeStr || typeof timeStr !== 'string') return null;

  const raw = convertBengaliToEnglish(timeStr).trim().toLowerCase();
  if (!raw) return null;

  const isPM = raw.includes('pm') || 
               raw.includes('রাত') || 
               raw.includes('সন্ধ্যা') || 
               raw.includes('বিকাল') || 
               raw.includes('দুপুর');

  const isAM = raw.includes('am') || 
               raw.includes('সকাল') || 
               raw.includes('ভোর');

  // Extract only numbers and colon
  const clean = raw.replace(/[^0-9:]/g, '');
  const parts = clean.split(':').map(n => parseInt(n, 10));

  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;

  let hours = parts[0];
  const minutes = parts[1];

  if (minutes < 0 || minutes > 59) return null;

  if (isPM) {
    if (hours < 12) hours += 12;
  } else if (isAM) {
    if (hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23) return null;

  return hours * 60 + minutes;
}

/**
 * Formats minutes of the day (0-1439) into human readable Bengali 12-hour AM/PM string
 * e.g. 1230 => "রাত ৮:৩০ PM" / "08:30 PM"
 */
export function formatMinutesToDisplay(minutesOfDay: number, lang: 'bn' | 'en' = 'bn'): string {
  const hours24 = Math.floor(minutesOfDay / 60);
  const minutes = minutesOfDay % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;

  const paddedHours = hours12.toString().padStart(2, '0');
  const paddedMins = minutes.toString().padStart(2, '0');
  const enStr = `${paddedHours}:${paddedMins} ${period}`;

  if (lang === 'bn') {
    return convertEnglishToBengali(enStr);
  }
  return enStr;
}

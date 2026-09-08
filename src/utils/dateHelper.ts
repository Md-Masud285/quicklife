// Helper to calculate blood donation eligibility (minimum 90 days required)

export interface BloodAvailabilityStatus {
  isEligible: boolean;
  daysRemaining: number;
  messageBangla: string;
  nextEligibleDateString: string;
}

export function checkBloodDonationEligibility(lastDonationDateStr: string): BloodAvailabilityStatus {
  if (!lastDonationDateStr) {
    return {
      isEligible: true,
      daysRemaining: 0,
      messageBangla: 'রক্তদানে প্রস্তুত (Available)',
      nextEligibleDateString: 'এখনই সম্ভব'
    };
  }

  const lastDate = new Date(lastDonationDateStr);
  const today = new Date();
  
  // Difference in milliseconds
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const REQUIRED_DAYS = 90; // Standard 3 months
  
  if (diffDays >= REQUIRED_DAYS) {
    return {
      isEligible: true,
      daysRemaining: 0,
      messageBangla: `রক্তদানে প্রস্তুত (সর্বশেষ দান: ${diffDays} দিন আগে)`,
      nextEligibleDateString: 'এখনই সম্ভব'
    };
  } else {
    const daysLeft = REQUIRED_DAYS - diffDays;
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + REQUIRED_DAYS);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    return {
      isEligible: false,
      daysRemaining: daysLeft,
      messageBangla: `সম্প্রতি রক্তদান করেছেন (আরও ${daysLeft} দিন পর দিতে পারবেন)`,
      nextEligibleDateString: nextDateStr
    };
  }
}

export function formatBanglaNumber(num: number | string): string {
  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/\d/g, (d) => banglaDigits[d] || d);
}

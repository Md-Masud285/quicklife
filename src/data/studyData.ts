import type { StudyFormula, ApplicationTemplate, BloodDonor } from '../types';

export const STUDY_FORMULAS: StudyFormula[] = [
  // Mathematics Formulas
  {
    id: 'm1',
    subject: 'math',
    category: 'বীজগণিত (Algebra)',
    title: 'দ্বিপদী বর্গের সূত্র (Square Formula 1)',
    formula: '(a + b)² = a² + 2ab + b²',
    explanation: 'দুটি রাশির যোগফলের বর্গ নির্ণয়ের মূল সূত্র।'
  },
  {
    id: 'm2',
    subject: 'math',
    category: 'বীজগণিত (Algebra)',
    title: 'বর্গের বিয়োগের সূত্র (Square Formula 2)',
    formula: '(a - b)² = a² - 2ab + b²',
    explanation: 'দুটি রাশির বিয়োগফলের বর্গ নির্ণয়ের মূল সূত্র।'
  },
  {
    id: 'm3',
    subject: 'math',
    category: 'বীজগণিত (Algebra)',
    title: 'বর্গান্তর সূত্র (Difference of Squares)',
    formula: 'a² - b² = (a + b)(a - b)',
    explanation: 'দুটি বর্গের বিয়োগফলকে উৎপাদকে বিশ্লেষণের সূত্র।'
  },
  {
    id: 'm4',
    subject: 'math',
    category: 'বীজগণিত (Algebra)',
    title: 'দ্বিঘাত সমীকরণ সমাধান (Quadratic Equation)',
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    explanation: 'ax² + bx + c = 0 সমীকরণের মূল (roots) নির্ণয়ের সূত্র।'
  },
  {
    id: 'm5',
    subject: 'math',
    category: 'জ্যামিতি ও পরিমিতি (Mensuration)',
    title: 'ত্রিভুজের ক্ষেত্রফল (Area of Triangle)',
    formula: 'Area = ½ × ভূমি × উচ্চতা (½ × b × h)',
    explanation: 'যেকোনো ত্রিভুজের ভূমি ও লম্ব উচ্চতা জানা থাকলে ক্ষেত্রফল।'
  },
  {
    id: 'm6',
    subject: 'math',
    category: 'জ্যামিতি ও পরিমিতি (Mensuration)',
    title: 'বৃত্তের ক্ষেত্রফল ও পরিধি (Circle Area & Circumference)',
    formula: 'Area = πr²,  পরিধি = 2πr',
    explanation: 'বৃত্তের ব্যাসার্ধ r হলে ক্ষেত্রফল ও পরিধির সূত্র (π ≈ 3.1416)।'
  },
  {
    id: 'm7',
    subject: 'math',
    category: 'ত্রিকোণমিতি (Trigonometry)',
    title: 'পিথাগোরাসের মূল ত্রিকোণমিতিক সূত্র',
    formula: 'sin²θ + cos²θ = 1',
    explanation: 'ত্রিকোণমিতির মৌলিক পিথাগোরিয়ান সম্পর্ক।'
  },
  {
    id: 'm8',
    subject: 'math',
    category: 'ত্রিকোণমিতি (Trigonometry)',
    title: 'ট্যানজেন্ট ও সেক্যান্ট সম্পর্ক',
    formula: 'sec²θ - tan²θ = 1',
    explanation: 'sec এবং tan এর মধ্যবর্তী পিথাগোরিয়ান অভেদ।'
  },

  // Physics Formulas
  {
    id: 'p1',
    subject: 'physics',
    category: 'বলবিদ্যা ও গতি (Motion & Mechanics)',
    title: 'গতির প্রথম সমীকরণ (Velocity-Time Equation)',
    formula: 'v = u + at',
    explanation: 'v = শেষ বেগ, u = আদি বেগ, a = ত্বরণ, t = সময়।'
  },
  {
    id: 'p2',
    subject: 'physics',
    category: 'বলবিদ্যা ও গতি (Motion & Mechanics)',
    title: 'গতির দ্বিতীয় সমীকরণ (Displacement Equation)',
    formula: 's = ut + ½at²',
    explanation: 's = সরণ বা দূরত্ব, u = আদি বেগ, a = ত্বরণ, t = সময়।'
  },
  {
    id: 'p3',
    subject: 'physics',
    category: 'বলবিদ্যা ও গতি (Motion & Mechanics)',
    title: 'গতির তৃতীয় সমীকরণ (Velocity-Distance Equation)',
    formula: 'v² = u² + 2as',
    explanation: 'সময় (t) অনুপস্থিত থাকলে বেগ ও দূরত্বের মধ্যে সম্পর্ক।'
  },
  {
    id: 'p4',
    subject: 'physics',
    category: 'বল ও নিউটনের সূত্র (Force)',
    title: 'নিউটনের গতির দ্বিতীয় সূত্র (Newton’s 2nd Law)',
    formula: 'F = ma',
    explanation: 'F = প্রযুক্ত বল (Newton), m = ভর (kg), a = ত্বরণ (m/s²)।'
  },
  {
    id: 'p5',
    subject: 'physics',
    category: 'কাজ, শক্তি ও ক্ষমতা (Work & Energy)',
    title: 'গতিশক্তি ও বিভবশক্তি (Kinetic & Potential Energy)',
    formula: 'Ek = ½mv²,  Ep = mgh',
    explanation: 'Ek = গতিশক্তি, Ep = বিভবশক্তি, g = অভিকর্ষজ ত্বরণ (9.8 m/s²)।'
  },
  {
    id: 'p6',
    subject: 'physics',
    category: 'তড়িৎ ও বিদ্যুৎ (Electricity)',
    title: 'ওহমের সূত্র (Ohm’s Law)',
    formula: 'V = IR  অথবা  I = V / R',
    explanation: 'V = বিভব পার্থক্য (Volt), I = তড়িৎ প্রবাহ (Ampere), R = রোধ (Ohm)।'
  },
  {
    id: 'p7',
    subject: 'physics',
    category: 'আধুনিক পদার্থবিজ্ঞান (Modern Physics)',
    title: 'আইনস্টাইনের ভর-শক্তি সমীকরণ (Mass-Energy Equivalence)',
    formula: 'E = mc²',
    explanation: 'E = শক্তি (Joule), m = ভর (kg), c = আলোর বেগ (3 × 10⁸ m/s)।'
  },

  // Chemistry Formulas
  {
    id: 'c1',
    subject: 'chemistry',
    category: 'মোল ও গ্যাসীয় সূত্র (Molar & Gas Laws)',
    title: 'আদর্শ গ্যাস সমীকরণ (Ideal Gas Equation)',
    formula: 'PV = nRT',
    explanation: 'P = চাপ, V = আয়তন, n = মোল সংখ্যা, R = গ্যাস ধ্রুবক (8.314 J/mol·K), T = তাপমাত্রা (Kelvin)।'
  },
  {
    id: 'c2',
    subject: 'chemistry',
    category: 'মোল ধারণা (Mole Concept)',
    title: 'মোল সংখ্যা নির্ণয় (Mole Calculation)',
    formula: 'n = w / M = V / 22.4 = N / NA',
    explanation: 'w = ভর (গ্রাম), M = আণবিক ভর, NA = অ্যাভোগাড্রো সংখ্যা (6.023 × 10²³)।'
  },
  {
    id: 'c3',
    subject: 'chemistry',
    category: 'দ্রবণ ও ঘনমাত্রা (Solutions & Molarity)',
    title: 'মোলারিটি ও ঘনমাত্রার সূত্র (Molarity Equation)',
    formula: 'S = (1000 × w) / (M × V_ml)',
    explanation: 'S = মোলারিটি (M), w = দ্রবের ভর, M = আণবিক ভর, V = দ্রবণের আয়তন (ml)।'
  },
  {
    id: 'c4',
    subject: 'chemistry',
    category: 'এসিড ও ক্ষার (Acids & Bases)',
    title: 'pH ও pOH নির্ণয়ের সূত্র',
    formula: 'pH = -log[H⁺],  pH + pOH = 14',
    explanation: '[H⁺] = দ্রবণে হাইড্রোজেন আয়নের মোলার ঘনমাত্রা।'
  }
];

export const APPLICATION_TEMPLATES: ApplicationTemplate[] = [
  {
    id: 'app_leave_office',
    titleBangla: 'অফিসে ছুটির আবেদনপত্র (Leave Application for Job)',
    titleEnglish: 'Job Leave Application (Bangla & English)',
    category: 'office',
    sampleContent: `বরাবর,
ম্যানেজিং ডিরেক্টর / হেড অব এইচআর
[প্রতিষ্ঠানের নাম]
[অফিসের ঠিকানা]

বিষয়: [ছুটির দিন সংখ্যা] দিনের ছুটির জন্য আবেদন।

মহোদয়,
বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানে [পদের নাম] হিসেবে কর্মরত আছি। আমার [অসুস্থতা / পারিবারিক জরুরি কারণ / ব্যক্তিগত কারণ]-এর জন্য আগামী [শুরুর তারিখ] হতে [শেষের তারিখ] পর্যন্ত মোট [দিন সংখ্যা] দিন অফিসে উপস্থিত থাকা সম্ভব হবে না।

অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উক্ত দিনগুলোর জন্য আমার ছুটি মঞ্জুর করে বাধিত করবেন।

বিনীত নিবেদক,
নাম: [আপনার নাম]
পদবী: [আপনার পদবী]
ফোন: [আপনার ফোন নম্বর]`
  },
  {
    id: 'app_job_cover',
    titleBangla: 'চাকরিতে আবেদনের কভার লেটার (Job Application Cover Letter)',
    titleEnglish: 'Professional Job Cover Letter',
    category: 'office',
    sampleContent: `তারিখ: [আজকের তারিখ]
বরাবর,
রিক্রুটিং ম্যানেজার / এইচআর ডিপার্টমেন্ট
[কোম্পানির নাম]
[ঠিকানা]

বিষয়: "[পদের নাম]" পদের জন্য আবেদন।

মহোদয়,
আপনার প্রতিষ্ঠানে প্রকাশিত "[পদের নাম]" পদের বিজ্ঞপ্তিটি সম্পর্কে জেনে আমি অত্যন্ত আনন্দিত। আমার শিক্ষাগত যোগ্যতা ও [কাজের অভিজ্ঞতা/দক্ষতা] উক্ত পদের দায়িত্ব দক্ষতার সাথে পালনে সহায়ক হবে বলে আমি বিশ্বাস করি।

আমার পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) পত্রের সাথে সংযুক্ত করা হলো। আমাকে মৌখিক পরীক্ষার সুযোগ প্রদান করলে কৃতজ্ঞ থাকব।

বিনীত,
[আপনার নাম]
মোবাইল: [আপনার মোবাইল]
ইমেইল: [আপনার ইমেইল]`
  },
  {
    id: 'app_school_leave',
    titleBangla: 'বিদ্যালয়ে ছুটির আবেদন (School/College Leave Application)',
    titleEnglish: 'Leave Application to Principal',
    category: 'school',
    sampleContent: `তারিখ: [আজকের তারিখ]
বরাবর,
প্রধান শিক্ষক / অধ্যক্ষ মহোদয়
[বিদ্যালয়/কলেজের নাম]
[ঠিকানা]

বিষয়: অনুপস্থিতির জন্য ছুটির আবেদন।

জনাব,
বিনীত নিবেদন এই যে, আমি আপনার বিদ্যালয়ের [শ্রেণি]-এর একজন নিয়মিত ছাত্র/ছাত্রী (রোল: [রোল নম্বর])। গত [শুরুর তারিখ] থেকে [শেষের তারিখ] পর্যন্ত হঠাৎ [জ্বর/অসুস্থতা/পারিবারিক কারণ]-এর কারণে বিদ্যালয়ে উপস্থিত হতে পারিনি।

অতএব, জনাবের নিকট আকুল আবেদন, উক্ত দিনগুলোর অনুপস্থিতি মার্জনা করে ছুটি মঞ্জুর করতে মহোদয়ের যেন মর্জি হয়।

বিনীত ছাত্র/ছাত্রী,
নাম: [আপনার নাম]
শ্রেণি: [শ্রেণি]
রোল: [রোল নম্বর]`
  }
];

export const INITIAL_BLOOD_DONORS: BloodDonor[] = [
  {
    id: 'donor_1',
    name: 'তানভীর হাসান',
    age: 26,
    phone: '01711223344',
    bloodGroup: 'O+',
    district: 'Dhaka (ঢাকা)',
    thana: 'Mirpur (মিরপুর)',
    socialType: 'facebook',
    socialLink: 'https://facebook.com',
    lastDonationDate: '2026-03-10',
    notes: 'জরুরি প্রয়োজনে যেকোনো সময় কল দিতে পারেন।'
  },
  {
    id: 'donor_2',
    name: 'মো: আরিফুল ইসলাম',
    age: 29,
    phone: '01822334455',
    bloodGroup: 'A+',
    district: 'Dhaka (ঢাকা)',
    thana: 'Dhanmondi (ধানমন্ডি)',
    socialType: 'website',
    socialLink: 'https://wa.me/8801822334455',
    lastDonationDate: '2026-01-15',
    notes: 'নিয়মিত রক্তদাতা, ঢাকা মেডিকেলের কাছাকাছি থাকি।'
  },
  {
    id: 'donor_3',
    name: 'সালমান ফারসি',
    age: 24,
    phone: '01933445566',
    bloodGroup: 'B+',
    district: 'Chattogram (চট্টগ্রাম)',
    thana: 'Kotwali (কোতোয়ালী)',
    socialType: 'facebook',
    socialLink: 'https://facebook.com',
    lastDonationDate: '2026-07-20',
    notes: 'চট্টগ্রামে এভেইলএবল।'
  },
  {
    id: 'donor_4',
    name: 'নাসরিন আক্তার',
    age: 23,
    phone: '01644556677',
    bloodGroup: 'AB+',
    district: 'Rajshahi (রাজশাহী)',
    thana: 'Boalia (বোয়ালিয়া)',
    socialType: 'email',
    socialLink: 'nasrin.sample@gmail.com',
    lastDonationDate: '2025-11-05',
    notes: 'রাজশাহী শহরের যেকোনো হাসপাতালে যেতে পারব।'
  },
  {
    id: 'donor_5',
    name: 'মেহেদী হাসান',
    age: 27,
    phone: '01555667788',
    bloodGroup: 'O-',
    district: 'Sylhet (সিলেট)',
    thana: 'Sylhet Sadar (সিলেট সদর)',
    socialType: 'facebook',
    socialLink: 'https://facebook.com',
    lastDonationDate: '2026-02-18',
    notes: 'নেগেটিভ গ্রুপের জরুরি রক্ত লাগলে দ্রুত নক করুন।'
  }
];

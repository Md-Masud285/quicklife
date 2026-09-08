import React, { useState, useRef } from 'react';

import { 
  Sparkles, 
  FileText, 
  Languages, 
  Copy, 
  Check, 
  Download, 
  Printer,
  ArrowLeftRight, 
  Volume2, 
  Briefcase,
  FileCheck2,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ShieldCheck,
  Building2,
  School,
  Camera,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';
import { AdBanner } from '../components/AdBanner';
import { DynamicAdRenderer } from '../components/DynamicAdRenderer';
import { alarmSoundManager } from '../utils/audioAlarm';
import { PhotoStudio } from '../components/PhotoStudio';

import jsPDF from 'jspdf';

import html2canvas from 'html2canvas';

const SUPPORTED_LANGUAGES = [
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'en', name: 'English (ইংরেজি)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ja', name: '日本語 (Japanese)' }
];

export type MainCategory = 'jobs_cv' | 'office_leave' | 'school_leave' | 'citizenship_cert';
type OutputLanguage = 'bn' | 'en';

export interface EducationItem {
  id: string;
  exam: string;
  year: string;
  institution: string;
  boardOrSubject: string;
  resultOrGpa: string;
}

import type { UserProfile } from '../services/authService';

interface AiToolsViewProps {
  currentUser?: UserProfile | null;
  onRequireLogin?: () => void;
}

export const AiToolsView: React.FC<AiToolsViewProps> = ({ currentUser, onRequireLogin }) => {
  const [activeTool, setActiveTool] = useState<'grid' | 'resume' | 'studio' | 'translate'>('grid');


  // --- 4 Main Categories ---
  const [mainCategory, setMainCategory] = useState<MainCategory>('jobs_cv');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('bn');

  // Common Date state
  const todayIso = new Date().toISOString().split('T')[0];
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState(todayIso);

  // --- Category 1: Jobs & CV Checkboxes ---
  const [includeCv, setIncludeCv] = useState(true);
  const [includeCoverLetter, setIncludeCoverLetter] = useState(false);

  // CV Fields
  const [userPhoto, setUserPhoto] = useState<string>('');
  const [cvFullName, setCvFullName] = useState('মো: তানভীর আহমেদ');
  const [cvProfessionalTitle, setCvProfessionalTitle] = useState('সফটওয়্যার ডেভেলপার / কম্পিউটার অপারেটর');
  const [cvMobile, setCvMobile] = useState('01711-223344');
  const [cvEmail, setCvEmail] = useState('tanvir.sample@gmail.com');
  const [cvPresentAddress, setCvPresentAddress] = useState('মিরপুর-১০, ঢাকা, বাংলাদেশ');
  const [cvPermanentAddress, setCvPermanentAddress] = useState('গ্রাম: রতনপুর, থানা: সদর, জেলা: বগুড়া');

  // CV Personal Details (Dropdowns)
  const [fatherName, setFatherName] = useState('মো: রফিকুল ইসলাম');
  const [motherName, setMotherName] = useState('বেগম রোকেয়া');
  const [dateOfBirth, setDateOfBirth] = useState('1998-05-15');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married'>('single');
  const [nationality, setNationality] = useState('বাংলাদেশী (Bangladeshi)');
  const [religion, setReligion] = useState<string>('Islam');
  const [bloodGroup, setBloodGroup] = useState<string>('B+');

  // CV Education Table
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: '1',
      exam: 'বিএসসি (সম্মান) / B.Sc',
      year: '২০২২',
      institution: 'ঢাকা বিশ্ববিদ্যালয়',
      boardOrSubject: 'কম্পিউটার সায়েন্স (CSE)',
      resultOrGpa: '৩.৭৫'
    },
    {
      id: '2',
      exam: 'এইচএসসি (HSC)',
      year: '২০১৮',
      institution: 'ঢাকা কলেজ',
      boardOrSubject: 'বিজ্ঞান বিভাগ (ঢাকা বোর্ড)',
      resultOrGpa: '৫.০০'
    },
    {
      id: '3',
      exam: 'এসএসসি (SSC)',
      year: '২০১৬',
      institution: 'আইডিয়াল স্কুল অ্যান্ড কলেজ',
      boardOrSubject: 'বিজ্ঞান বিভাগ (ঢাকা বোর্ড)',
      resultOrGpa: '৫.০০'
    }
  ]);

  // CV Career & Skills
  const [careerObjective, setCareerObjective] = useState(
    'একজন দায়িত্বশীল ও উদ্যমী পেশাজীবী হিসেবে সততা ও কঠোর পরিশ্রমের মাধ্যমে প্রতিষ্ঠানের লক্ষ্য অর্জনে সক্রিয় ভূমিকা পালন করতে চাই।'
  );
  const [workExperience, setWorkExperience] = useState(
    'সংশ্লিষ্ট ক্ষেত্রে ২ বছরের বাস্তব কাজের অভিজ্ঞতা এবং প্রজেক্ট ম্যানেজমেন্ট দক্ষতা।'
  );
  const [skills, setSkills] = useState(
    'কম্পিউটার টাইপিং (বাংলা ও ইংরেজি), মাইক্রোসফট অফিস (Word, Excel), গ্রাফিক ডিজাইন এবং গ্রাহক যোগাযোগ।'
  );

  // Job Application (Cover Letter) Specific Fields
  const [jobRecipient, setJobRecipient] = useState('ম্যানেজিং ডিরেক্টর / হেড অব এইচআর');
  const [jobCompanyName, setJobCompanyName] = useState('এবিসি টেকনোলজিস লিমিটেড');
  const [jobCompanyLocation, setJobCompanyLocation] = useState('ধানমন্ডি, ঢাকা');
  const [jobTitle, setJobTitle] = useState('জুনিয়র এক্সিকিউটিভ অফিসার');
  const [jobApplicantName] = useState('মো: তানভীর আহমেদ');

  const [jobApplicantMobile] = useState('01711-223344');
  const [jobExperienceSummary, setJobExperienceSummary] = useState(
    'সংশ্লিষ্ট পদের কাজে আমার ২ বছরের অভিজ্ঞতা এবং দায়িত্বশীলভাবে দলবদ্ধ হয়ে কাজ করার দক্ষতা রয়েছে।'
  );
  const [jobKeySkills] = useState(
    'এক্সেল ডাটা অ্যানালাইসিস, অফিশিয়াল ড্রাফটিং ও কাস্টমার রিলেশনশিপ।'
  );
  const [jobWhySuitable, setJobWhySuitable] = useState(
    'আমার শিক্ষাগত ব্যাকগ্রাউন্ড ও বাস্তব অভিজ্ঞতা উক্ত পদের দায়িত্ব দক্ষতার সাথে পালনে সহায়ক হবে।'
  );


  // --- Category 2: Office Leave Fields ---
  const [officeRecipient, setOfficeRecipient] = useState('ম্যানেজিং ডিরেক্টর / এইচআর ম্যানেজার');
  const [officeCompanyName, setOfficeCompanyName] = useState('এবিসি এন্টারপ্রাইজ লিমিটেড');
  const [officeApplicantName, setOfficeApplicantName] = useState('মো: তানভীর আহমেদ');
  const [officeDesignation, setOfficeDesignation] = useState('এক্সিকিউটিভ অফিসার');
  const [officeStartDate, setOfficeStartDate] = useState(todayIso);
  const [officeEndDate, setOfficeEndDate] = useState(todayIso);
  const [officeReasonType, setOfficeReasonType] = useState<string>('illness');
  const [officeCustomReason, setOfficeCustomReason] = useState('');

  // --- Category 3: School/College Leave Fields ---
  const [schoolRecipient, setSchoolRecipient] = useState('প্রধান শিক্ষক / অধ্যক্ষ');
  const [schoolName, setSchoolName] = useState('মতিঝিল আইডিয়াল স্কুল অ্যান্ড কলেজ');
  const [schoolLocation] = useState('মতিঝিল, ঢাকা');
  const [studentName, setStudentName] = useState('তানভীর হাসান');

  const [studentClass, setStudentClass] = useState('দ্বাদশ শ্রেণি (বিজ্ঞান বিভাগ)');
  const [studentRoll, setStudentRoll] = useState('১০৫');
  const [studentSection, setStudentSection] = useState('ক শাখা');
  const [schoolStartDate, setSchoolStartDate] = useState(todayIso);
  const [schoolEndDate, setSchoolEndDate] = useState(todayIso);
  const [schoolReasonType, setSchoolReasonType] = useState<string>('illness');
  const [schoolCustomReason, setSchoolCustomReason] = useState('');
  const [guardianName, setGuardianName] = useState('মো: রফিকুল ইসলাম');

  // --- Category 4: Citizenship / Character Certificate Fields ---
  const [certRecipient, setCertRecipient] = useState('চেয়ারম্যান / মেয়র / কাউন্সিলর');
  const [certOfficeName, setCertOfficeName] = useState('রামপুরা ইউনিয়ন পরিষদ / পৌরসভা');
  const [certWardNo, setCertWardNo] = useState('০৭ নং ওয়ার্ড');
  const [certApplicantName, setCertApplicantName] = useState('মো: তানভীর আহমেদ');
  const [certFatherName, setCertFatherName] = useState('মো: রফিকুল ইসলাম');
  const [certMotherName, setCertMotherName] = useState('বেগম রোকেয়া');
  const [certAddress, setCertAddress] = useState('গ্রাম: পূর্ব রামপুরা, ডাকঘর: রামপুরা, উপজেলা: সদর, জেলা: বগুড়া');
  const [certType, setCertType] = useState<'citizenship' | 'character' | 'both'>('citizenship');
  const [certPurposeType, setCertPurposeType] = useState<string>('job');
  const [certCustomPurpose, setCertCustomPurpose] = useState('');
  const [certNidNumber, setCertNidNumber] = useState('19982692015000123');

  // Render & Export State
  const [showDigitalSignature, setShowDigitalSignature] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isCopiedText, setIsCopiedText] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // --- Translator State ---
  const [sourceLang, setSourceLang] = useState('bn');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopiedTranslation, setIsCopiedTranslation] = useState(false);


  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUserPhoto(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Education row management
  const handleAddEducationRow = () => {
    const newRow: EducationItem = {
      id: 'edu_' + Date.now(),
      exam: outputLanguage === 'bn' ? 'স্নাতক / ডিগ্রি' : 'Graduation / Degree',
      year: '২০২৪',
      institution: outputLanguage === 'bn' ? 'বিশ্ববিদ্যালয় / কলেজ' : 'University / College',
      boardOrSubject: outputLanguage === 'bn' ? 'মেজর / বিষয়' : 'Major / Subject',
      resultOrGpa: outputLanguage === 'bn' ? '৩.৮০' : '3.80'
    };
    setEducations([...educations, newRow]);
  };

  const handleUpdateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setEducations(educations.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const handleDeleteEducation = (id: string) => {
    if (educations.length <= 1) {
      alert('কমপক্ষে ১টি শিক্ষাগত যোগ্যতা থাকা প্রয়োজন');
      return;
    }
    setEducations(educations.filter(item => item.id !== id));
  };

  // Date calculation helper
  const calculateTotalDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const formatDateBangla = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const banglaDigits: { [key: string]: string } = { '0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯' };
    const day = date.getDate().toString().replace(/\d/g, d => banglaDigits[d]);
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().replace(/\d/g, d => banglaDigits[d]);
    return `${day} ${month} ${year}`;
  };

  const formatDateEnglish = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Active dates
  const activeAppDate = isCustomDate ? customDate : todayIso;
  const activeAppDateBn = formatDateBangla(activeAppDate);
  const activeAppDateEn = formatDateEnglish(activeAppDate);

  // Office leave helpers
  const officeDays = calculateTotalDays(officeStartDate, officeEndDate);
  const officeDaysBn = officeDays.toString().replace(/\d/g, d => ({'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}[d] || d));
  const officeStartBn = formatDateBangla(officeStartDate);
  const officeEndBn = formatDateBangla(officeEndDate);
  const officeStartEn = formatDateEnglish(officeStartDate);
  const officeEndEn = formatDateEnglish(officeEndDate);

  // School leave helpers
  const schoolDays = calculateTotalDays(schoolStartDate, schoolEndDate);
  const schoolDaysBn = schoolDays.toString().replace(/\d/g, d => ({'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}[d] || d));
  const schoolStartBn = formatDateBangla(schoolStartDate);
  const schoolEndBn = formatDateBangla(schoolEndDate);
  const schoolStartEn = formatDateEnglish(schoolStartDate);
  const schoolEndEn = formatDateEnglish(schoolEndDate);

  // Reason text helper
  const getOfficeReasonText = (lang: OutputLanguage) => {
    if (officeReasonType === 'other') return officeCustomReason || (lang === 'bn' ? 'জরুরি ব্যক্তিগত প্রয়োজন' : 'urgent personal matter');
    const map: Record<string, { bn: string; en: string }> = {
      illness: { bn: 'হঠাৎ শারীরিক অসুস্থতা', en: 'sudden illness' },
      personal: { bn: 'ব্যক্তিগত জরুরি কাজ', en: 'personal urgent matters' },
      family: { bn: 'পারিবারিক প্রয়োজনীয় কাজ', en: 'family necessities' },
      urgent: { bn: 'জরুরি অফিশিয়াল/ব্যক্তিগত প্রয়োজন', en: 'urgent matters' },
      treatment: { bn: 'ডাক্তারের পরামর্শ ও চিকিৎসা গ্রহণ', en: 'medical checkup and treatment' }
    };
    return map[officeReasonType]?.[lang] || map.illness[lang];
  };

  const getSchoolReasonText = (lang: OutputLanguage) => {
    if (schoolReasonType === 'other') return schoolCustomReason || (lang === 'bn' ? 'জরুরি ব্যক্তিগত প্রয়োজন' : 'urgent personal matter');
    const map: Record<string, { bn: string; en: string }> = {
      illness: { bn: 'তীব্র জ্বর ও শারীরিক অসুস্থতা', en: 'severe fever and illness' },
      treatment: { bn: 'ডাক্তারের পরামর্শ ও উন্নত চিকিৎসা', en: 'medical treatment' },
      family_issue: { bn: 'পারিবারিক বিশেষ সমস্যা', en: 'family emergency' },
      urgent_family: { bn: 'জরুরি পারিবারিক কাজ', en: 'urgent family matters' }
    };
    return map[schoolReasonType]?.[lang] || map.illness[lang];
  };

  const getCertPurposeText = (lang: OutputLanguage) => {
    if (certPurposeType === 'other') return certCustomPurpose || (lang === 'bn' ? 'জরুরি প্রাতিষ্ঠানিক প্রয়োজন' : 'urgent official purpose');
    const map: Record<string, { bn: string; en: string }> = {
      job: { bn: 'চাকরিতে আবেদন ও পুলিশ ভেরিফিকেশন', en: 'job application and verification' },
      passport: { bn: 'নতুন পাসপোর্ট তৈরি ও ভেরিফিকেশন', en: 'passport issuance' },
      education: { bn: 'উচ্চশিক্ষা ও শিক্ষাপ্রতিষ্ঠানে ভর্তি', en: 'educational admission' },
      abroad: { bn: 'বিদেশে গমন সংক্রান্ত কাজ', en: 'traveling abroad' },
      visa: { bn: 'ভিসা আবেদন ও দূতাবাস যাচাই', en: 'visa processing' }
    };
    return map[certPurposeType]?.[lang] || map.job[lang];
  };

  // Generate Document
  const handleGenerate = () => {
    if (!currentUser && onRequireLogin) {
      onRequireLogin();
      return;
    }
    if (mainCategory === 'jobs_cv' && !includeCv && !includeCoverLetter) {
      alert('দয়া করে CV / Resume অথবা Job Application-এর অন্তত একটি নির্বাচন করুন।');
      return;
    }
    setIsGenerated(true);
    setTimeout(() => {
      documentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Copy Plain Text
  const handleCopyText = () => {
    if (!documentRef.current) return;
    const textContent = documentRef.current.innerText;
    navigator.clipboard.writeText(textContent);
    setIsCopiedText(true);
    setTimeout(() => setIsCopiedText(false), 2000);
  };

  // Native Print & Save as PDF Fallback
  const handlePrintDocument = () => {
    if (!documentRef.current) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = documentRef.current.innerHTML;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QuickLife Document - ${mainCategory}</title>
            <style>
              @page { size: A4 portrait; margin: 15mm; }
              body { font-family: 'Segoe UI', Arial, sans-serif; color: #000; background: #fff; margin: 0; padding: 20px; line-height: 1.6; }
              table { width: 100%; border-collapse: collapse; margin: 12px 0; }
              th, td { border: 1px solid #475569; padding: 8px; font-size: 12px; text-align: left; }
              th { background-color: #1e293b; color: #ffffff; }
              img { max-width: 95px; height: auto; border: 1px solid #334155; }
              .break-avoid { page-break-inside: avoid; }
            </style>
          </head>
          <body>
            ${content}
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Multi-Page A4 PDF Downloader
  const handleDownloadPDF = async () => {
    if (!documentRef.current) return;
    setIsExportingPdf(true);

    try {
      const element = documentRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First Page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Multi-Page slicing for longer documents
      while (heightLeft > 5) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Generate mobile & desktop compatible PDF Blob
      const blob = pdf.output('blob');
      const fileName = `QuickLife_${mainCategory}_${Date.now()}.pdf`;

      // Direct file download trigger for Mobile & PC
      const blobUrl = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = fileName;
      downloadAnchor.style.display = 'none';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();

      setTimeout(() => {
        if (document.body.contains(downloadAnchor)) {
          document.body.removeChild(downloadAnchor);
        }
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } catch (err) {
      console.error('Direct PDF download error:', err);
      // Fallback: try direct pdf save
      try {
        const element = documentRef.current;
        if (element) {
          handlePrintDocument();
        }
      } catch {
        alert('PDF ফাইল ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Live Translation Engine
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }
    setIsTranslating(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`
      );
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        setTranslatedText('অনুবাদ করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।');
      }
    } catch {
      setTranslatedText('ইন্টারনেট সংযোগ চেক করুন ও পুনরায় চেষ্টা করুন।');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  // Universal speech synthesis with multi-tier Bangla & English engine
  const handleSpeakText = (text: string, langCode: string) => {
    if (!text || !text.trim()) return;
    const targetLang = langCode === 'bn' ? 'bn' : 'en';
    alarmSoundManager.speakText(text, targetLang);
  };


  return (
    <div className="space-y-4 pb-8 pt-1 animate-fadeIn text-left">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-5 text-white shadow-xl shadow-purple-900/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              স্মার্ট ডকুমেন্ট মেকার
            </span>
            <h2 className="text-xl font-bold mt-1">সিভি, আবেদনপত্র ও অনুবাদক</h2>
            <p className="text-xs text-purple-100 mt-0.5">
              প্রফেশনাল ড্রপডাউন সিলেক্টর ও A4 প্রিমিয়াম PDF ডাউনলোড
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Navigation Header: Grid Hub or Back to Grid */}
      {activeTool !== 'grid' && (
        <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-md">
          <button
            onClick={() => setActiveTool('grid')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← সকল টুলস তালিকায় ফিরুন</span>
          </button>

          {/* Quick Sub-Switcher */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTool('resume')}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                activeTool === 'resume' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>আবেদন ও সিভি</span>
            </button>
            <button
              onClick={() => setActiveTool('studio')}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                activeTool === 'studio' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>ফটো স্টুডিও</span>
            </button>
            <button
              onClick={() => setActiveTool('translate')}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                activeTool === 'translate' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Languages className="w-3 h-3" />
              <span>অনুবাদক</span>
            </button>
          </div>
        </div>
      )}

      <DynamicAdRenderer placement="tools" />

      {/* VIEW 1: FEATURE CARDS GRID HUB (When activeTool === 'grid') */}
      {activeTool === 'grid' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
              <span>টুল নির্বাচন করুন (৩টি ফিচার সক্রিয়)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Card 1: Resume & Application Builder */}
            <div
              onClick={() => setActiveTool('resume')}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-purple-500/30 hover:border-purple-500/80 p-5 shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/25 transition duration-500" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        AI Document
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1 group-hover:text-purple-300 transition">
                      স্মার্ট আবেদনপত্র ও সিভি মেকার
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      সরকারি ও বেসরকারি চাকরির দরখাস্ত, পূর্ণাঙ্গ প্রফেশনাল বায়োডাটা (CV), কভার লেটার, ছুটি ও বদলির আবেদন এবং A4 প্রিমিয়াম PDF তৈরি করুন।
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ চাকরির দরখাস্ত
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ কমপ্লিট বায়োডাটা (CV)
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ ছুটির আবেদন
                      </span>
                      <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-md border border-purple-800 font-semibold">
                        ✓ A4 PDF প্রিন্ট
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-purple-300">
                <span>টুল ওপেন করতে ক্লিক করুন</span>
                <span>আবেদনপত্র ও সিভি লিখুন →</span>
              </div>
            </div>

            {/* Card 2: Smart Photo & Signature Studio */}
            <div
              onClick={() => setActiveTool('studio')}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-blue-500/30 hover:border-blue-500/80 p-5 shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/25 transition duration-500" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] bg-blue-950 text-blue-300 border border-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        Studio Tools
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1 group-hover:text-blue-300 transition">
                      পাসপোর্ট ও জব ফটো স্টুডিও
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      টেলিটক চাকরির ছবি (৩০০x৩০০), ডিজিটাল স্বাক্ষর (৩০০x৮০), পাসপোর্ট ও স্ট্যাম্প সাইজ ছবি ক্রপ, ব্যাকগ্রাউন্ড কালার পরিবর্তন ও A4 প্রিন্ট শিট জেনারেটর।
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ Teletalk 300×300
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ Signature 300×80
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ BG রিমুভ ও কালার
                      </span>
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded-md border border-blue-800 font-semibold">
                        ✓ A4 শিট মেকার
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>টুল ওপেন করতে ক্লিক করুন</span>
                <span>ফটো ও স্বাক্ষর সাইজ করুন →</span>
              </div>
            </div>

            {/* Card 3: Multilingual AI Translator */}
            <div
              onClick={() => setActiveTool('translate')}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/80 p-5 shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/25 transition duration-500" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 shrink-0">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        AI Language
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition">
                      স্মার্ট বহুভাষিক AI অনুবাদক
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      বাংলা থেকে ইংরেজি, আরবি, হিন্দি, জাপানি সহ বিশ্বের ৫০+ ভাষায় নির্ভুল তাৎক্ষণিক অনুবাদ ও বাংলা/ইংরেজি অডিও স্পিচ ভয়েস অ্যাসিস্ট্যান্ট।
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ ৫০+ বিশ্ব ভাষা
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ ১-ক্লিক সোয়াপ
                      </span>
                      <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                        ✓ বাংলা অডিও ভয়েস
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-800 font-semibold">
                        ✓ ১০০% ফ্রি অনুবাদ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>টুল ওপেন করতে ক্লিক করুন</span>
                <span>অনুবাদ শুরু করুন →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SMART PHOTO & SIGNATURE STUDIO */}
      {activeTool === 'studio' && (
        <div className="space-y-4">
          <DynamicAdRenderer placement="photostudio" />
          <PhotoStudio currentUser={currentUser} onRequireLogin={onRequireLogin} />
        </div>
      )}


      {/* TAB 1: 4 STREAMLINED DOCUMENT BUILDER */}
      {activeTool === 'resume' && (

        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-4">
            
            {/* STEP 1: 4 MAIN CATEGORIES */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                ১. ক্যাটাগরি নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'jobs_cv', label: '১. চাকরির আবেদন ও CV', icon: Briefcase },
                  { id: 'office_leave', label: '২. অফিস ছুটির আবেদন', icon: Building2 },
                  { id: 'school_leave', label: '৩. স্কুল/কলেজ ছুটির আবেদন', icon: School },
                  { id: 'citizenship_cert', label: '৪. নাগরিকত্ব/চারিত্রিক সনদ', icon: ShieldCheck }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = mainCategory === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMainCategory(item.id as MainCategory);
                        setIsGenerated(false);
                      }}
                      className={`p-3 rounded-xl text-left border text-xs font-bold transition flex items-center space-x-2.5 ${
                        isActive
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-purple-300" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: LANGUAGE & DATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-700/60">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ২. আবেদনের ভাষা (Language):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOutputLanguage('bn');
                      setIsGenerated(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      outputLanguage === 'bn'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    🇧🇩 বাংলা (Bangla)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOutputLanguage('en');
                      setIsGenerated(false);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      outputLanguage === 'en'
                        ? 'bg-blue-600 text-white border-blue-500 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    🇬🇧 ইংরেজি (English)
                  </button>
                </div>
              </div>

              {/* Date System */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  ৩. আবেদনের তারিখ (Application Date):
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomDate(false)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      !isCustomDate 
                        ? 'bg-purple-600 text-white border-purple-500 shadow' 
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    আজকের তারিখ (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomDate(true)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                      isCustomDate 
                        ? 'bg-purple-600 text-white border-purple-500 shadow' 
                        : 'bg-slate-900 text-slate-300 border-slate-700'
                    }`}
                  >
                    কাস্টম তারিখ
                  </button>
                </div>
                {isCustomDate && (
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full mt-2 bg-slate-900 text-slate-100 text-xs rounded-xl px-3 py-1.5 border border-slate-700"
                  />
                )}
              </div>
            </div>

            {/* Signature Preference Option */}
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">স্বাক্ষর অপশন (Signature Style):</span>
                <span className="text-[11px] text-slate-400">
                  {showDigitalSignature ? 'স্বাক্ষরের উপর কম্পিউটারের নাম প্রিন্ট থাকবে' : 'প্রিন্টের পর হাতে কলমে সাইন করার জন্য খালি দাগ থাকবে (প্রস্তাবিত)'}
                </span>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition">
                <input
                  type="checkbox"
                  checked={showDigitalSignature}
                  onChange={(e) => setShowDigitalSignature(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span className="text-xs text-purple-300 font-bold">ডিজিটাল সাইন নাম</span>
              </label>
            </div>

            {/* STEP 3: DYNAMIC FORM PER CATEGORY */}
            <div className="space-y-4 pt-2 border-t border-slate-700/60">

              {/* ======================= CATEGORY 1: JOBS & CV ======================= */}
              {mainCategory === 'jobs_cv' && (
                <div className="space-y-4">
                  {/* Selector: What to create? */}
                  <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                    <span className="text-xs font-bold text-purple-200 block">
                      আপনি কী তৈরি করতে চান? (একক বা উভয়টি নির্বাচন করুন):
                    </span>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <label className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                        includeCv ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={includeCv}
                          onChange={(e) => setIncludeCv(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold">☑ CV / Resume</span>
                      </label>

                      <label className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition ${
                        includeCoverLetter ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}>
                        <input
                          type="checkbox"
                          checked={includeCoverLetter}
                          onChange={(e) => setIncludeCoverLetter(e.target.checked)}
                          className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                        />
                        <span className="text-xs font-bold">☑ Job Application</span>
                      </label>
                    </div>
                  </div>

                  {/* 1.1 Job Application Specific Fields (Only if Job Application checked) */}
                  {includeCoverLetter && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3">
                      <h4 className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>চাকরির আবেদন ও কভার লেটার তথ্য (Job Application Fields):</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">যার কাছে আবেদন (Recipient) *</label>
                          <input
                            type="text"
                            value={jobRecipient}
                            onChange={(e) => setJobRecipient(e.target.value)}
                            placeholder="ম্যানেজিং ডিরেক্টর / হেড অব এইচআর"
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">আবেদনকৃত পদ (Job Title) *</label>
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="জুনিয়র এক্সিকিউটিভ অফিসার"
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">কোম্পানির নাম (Company Name) *</label>
                          <input
                            type="text"
                            value={jobCompanyName}
                            onChange={(e) => setJobCompanyName(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">কোম্পানির লোকেশন *</label>
                          <input
                            type="text"
                            value={jobCompanyLocation}
                            onChange={(e) => setJobCompanyLocation(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">অভিজ্ঞতা ও দক্ষতার সারসংক্ষেপ *</label>
                        <textarea
                          rows={2}
                          value={jobExperienceSummary}
                          onChange={(e) => setJobExperienceSummary(e.target.value)}
                          className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">কেন এই পদের জন্য উপযুক্ত (ঐচ্ছিক)</label>
                        <input
                          type="text"
                          value={jobWhySuitable}
                          onChange={(e) => setJobWhySuitable(e.target.value)}
                          className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* 1.2 Full CV Specific Fields (Only if CV checked) */}
                  {includeCv && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700 space-y-3.5">
                      <h4 className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>পূর্ণাঙ্গ জীবনবৃত্তান্ত তথ্য (CV & Resume Fields):</span>
                      </h4>

                      {/* Photo Upload */}
                      <div className="flex items-center space-x-3 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                        {userPhoto ? (
                          <div className="relative">
                            <img src={userPhoto} alt="Photo" className="w-12 h-14 object-cover rounded-lg border border-purple-500" />
                            <button onClick={() => setUserPhoto('')} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[9px]">✕</button>
                          </div>
                        ) : (
                          <div className="w-12 h-14 rounded-lg border border-solid border-slate-600 flex items-center justify-center text-slate-500">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <label className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold cursor-pointer text-center flex items-center justify-center space-x-1.5 transition">
                          <Upload className="w-3.5 h-3.5 text-purple-400" />
                          <span>{userPhoto ? 'ছবি পরিবর্তন করুন' : 'পাসপোর্ট সাইজ ছবি আপলোড'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                        </label>
                      </div>

                      {/* Name & Contact */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">পূর্ণ নাম *</label>
                          <input
                            type="text"
                            value={cvFullName}
                            onChange={(e) => setCvFullName(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">পেশাগত টাইটেল *</label>
                          <input
                            type="text"
                            value={cvProfessionalTitle}
                            onChange={(e) => setCvProfessionalTitle(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">মোবাইল নম্বর *</label>
                          <input
                            type="text"
                            value={cvMobile}
                            onChange={(e) => setCvMobile(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">ইমেইল *</label>
                          <input
                            type="email"
                            value={cvEmail}
                            onChange={(e) => setCvEmail(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">বর্তমান ঠিকানা *</label>
                          <input
                            type="text"
                            value={cvPresentAddress}
                            onChange={(e) => setCvPresentAddress(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">স্থায়ী ঠিকানা *</label>
                          <input
                            type="text"
                            value={cvPermanentAddress}
                            onChange={(e) => setCvPermanentAddress(e.target.value)}
                            className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                          />
                        </div>
                      </div>

                      {/* Personal Bio Details with Dropdowns */}
                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                        <span className="text-[11px] font-bold text-slate-200 block">ব্যক্তিগত তথ্যাবলি (Personal Bio):</span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">পিতার নাম:</label>
                            <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">মাতার নাম:</label>
                            <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">জন্ম তারিখ:</label>
                            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700" />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">লিঙ্গ (Gender):</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700">
                              <option value="male">পুরুষ (Male)</option>
                              <option value="female">মহিলা (Female)</option>
                              <option value="other">অন্যান্য</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">বৈবাহিক অবস্থা:</label>
                            <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value as any)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700">
                              <option value="single">অবিবাহিত (Single)</option>
                              <option value="married">বিবাহিত (Married)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 block">রক্তের গ্রুপ:</label>
                            <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full bg-slate-900 text-rose-400 font-bold text-xs rounded-lg px-2 py-1.5 border border-slate-700">
                              <option value="A+">A+</option><option value="A-">A-</option>
                              <option value="B+">B+</option><option value="B-">B-</option>
                              <option value="AB+">AB+</option><option value="AB-">AB-</option>
                              <option value="O+">O+</option><option value="O-">O-</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">ধর্ম (Religion):</label>
                            <select value={religion} onChange={(e) => setReligion(e.target.value)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700">
                              <option value="Islam">ইসলাম (Islam)</option>
                              <option value="Hinduism">হিন্দু (Hinduism)</option>
                              <option value="Christianity">খ্রিস্টান (Christianity)</option>
                              <option value="Buddhism">বৌদ্ধ (Buddhism)</option>
                              <option value="Other">অন্যান্য</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block">জাতীয়তা:</label>
                            <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700" />
                          </div>
                        </div>
                      </div>

                      {/* Educational Qualifications Table */}
                      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-200">শিক্ষাগত যোগ্যতা (Academic Qualifications):</span>
                          <button type="button" onClick={handleAddEducationRow} className="text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                            <Plus className="w-3 h-3" />
                            <span>ডিগ্রি যোগ</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {educations.map((edu, idx) => (
                            <div key={edu.id} className="p-2 rounded-lg bg-slate-900 border border-slate-700 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-300 font-bold">
                                <span>#{idx + 1}. ডিগ্রি</span>
                                <button type="button" onClick={() => handleDeleteEducation(edu.id)} className="text-red-400 hover:text-red-300">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-1.5">
                                <input type="text" value={edu.exam} onChange={(e) => handleUpdateEducation(edu.id, 'exam', e.target.value)} placeholder="ডিগ্রি (যেমন: B.Sc/SSC)" className="bg-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 border border-slate-700" />
                                <input type="text" value={edu.year} onChange={(e) => handleUpdateEducation(edu.id, 'year', e.target.value)} placeholder="পাসের সন (যেমন: 2022)" className="bg-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 border border-slate-700" />
                              </div>
                              <div className="grid grid-cols-3 gap-1.5">
                                <input type="text" value={edu.institution} onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)} placeholder="প্রতিষ্ঠান / বোর্ড" className="bg-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 border border-slate-700" />
                                <input type="text" value={edu.boardOrSubject} onChange={(e) => handleUpdateEducation(edu.id, 'boardOrSubject', e.target.value)} placeholder="বিভাগ / বিষয়" className="bg-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 border border-slate-700" />
                                <input type="text" value={edu.resultOrGpa} onChange={(e) => handleUpdateEducation(edu.id, 'resultOrGpa', e.target.value)} placeholder="প্রাপ্ত GPA/CGPA" className="bg-slate-800 text-slate-100 text-[11px] rounded px-2 py-1 border border-slate-700" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">ক্যারিয়ার অবজেক্টিভ (Career Objective) *</label>
                        <textarea rows={2} value={careerObjective} onChange={(e) => setCareerObjective(e.target.value)} className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2 border border-slate-700" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">কাজের অভিজ্ঞতা (Work Experience)</label>
                          <textarea rows={2} value={workExperience} onChange={(e) => setWorkExperience(e.target.value)} className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2 border border-slate-700" />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">মূল দক্ষতা (Skills)</label>
                          <textarea rows={2} value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl p-2 border border-slate-700" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================= CATEGORY 2: OFFICE LEAVE ======================= */}
              {mainCategory === 'office_leave' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>অফিস ছুটির আবেদন তথ্য (Office Leave Fields):</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">যার কাছে আবেদন *</label>
                      <input
                        type="text"
                        value={officeRecipient}
                        onChange={(e) => setOfficeRecipient(e.target.value)}
                        placeholder="Manager / HR Manager / Managing Director"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">প্রতিষ্ঠানের নাম *</label>
                      <input
                        type="text"
                        value={officeCompanyName}
                        onChange={(e) => setOfficeCompanyName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">আবেদনকারীর নাম *</label>
                      <input
                        type="text"
                        value={officeApplicantName}
                        onChange={(e) => setOfficeApplicantName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">বর্তমান পদবী *</label>
                      <input
                        type="text"
                        value={officeDesignation}
                        onChange={(e) => setOfficeDesignation(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* Date Range with Auto calculation */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-emerald-300">ছুটির সময়কাল:</span>
                      <span className="text-[11px] font-bold bg-emerald-600/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        মোট ছুটি: {officeDays} দিন (Auto)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block">ছুটি শুরুর তারিখ *</label>
                        <input
                          type="date"
                          value={officeStartDate}
                          onChange={(e) => setOfficeStartDate(e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">ছুটি শেষ হওয়ার তারিখ *</label>
                        <input
                          type="date"
                          value={officeEndDate}
                          min={officeStartDate}
                          onChange={(e) => setOfficeEndDate(e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reason Dropdown */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">ছুটির কারণ (Reason) *</label>
                    <select
                      value={officeReasonType}
                      onChange={(e) => setOfficeReasonType(e.target.value)}
                      className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                    >
                      <option value="illness">অসুস্থতা (Illness)</option>
                      <option value="personal">ব্যক্তিগত কাজ (Personal Work)</option>
                      <option value="family">পারিবারিক কাজ (Family Matters)</option>
                      <option value="urgent">জরুরি কাজ (Urgent Matter)</option>
                      <option value="treatment">চিকিৎসার জন্য (Medical Treatment)</option>
                      <option value="other">অন্যান্য (Other...)</option>
                    </select>

                    {officeReasonType === 'other' && (
                      <input
                        type="text"
                        placeholder="বিস্তারিত ছুটির কারণ লিখুন..."
                        value={officeCustomReason}
                        onChange={(e) => setOfficeCustomReason(e.target.value)}
                        className="w-full mt-2 bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ======================= CATEGORY 3: SCHOOL LEAVE ======================= */}
              {mainCategory === 'school_leave' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <h4 className="text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                    <School className="w-3.5 h-3.5" />
                    <span>স্কুল/কলেজ ছুটির আবেদন তথ্য (School Leave Fields):</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">যার কাছে আবেদন *</label>
                      <input
                        type="text"
                        value={schoolRecipient}
                        onChange={(e) => setSchoolRecipient(e.target.value)}
                        placeholder="প্রধান শিক্ষক / অধ্যক্ষ"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">স্কুল/কলেজের নাম *</label>
                      <input
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">শিক্ষার্থীর নাম *</label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">শ্রেণি *</label>
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">রোল নম্বর *</label>
                      <input
                        type="text"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">সেকশন (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={studentSection}
                        onChange={(e) => setStudentSection(e.target.value)}
                        placeholder="যেমন: ক শাখা"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">অভিভাবকের নাম *</label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  {/* School Leave Dates */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-cyan-300">ছুটির সময়কাল:</span>
                      <span className="text-[11px] font-bold bg-cyan-600/30 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-500/30">
                        মোট ছুটি: {schoolDays} দিন (Auto)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block">ছুটি শুরুর তারিখ *</label>
                        <input
                          type="date"
                          value={schoolStartDate}
                          onChange={(e) => setSchoolStartDate(e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">ছুটি শেষ হওয়ার তারিখ *</label>
                        <input
                          type="date"
                          value={schoolEndDate}
                          min={schoolStartDate}
                          onChange={(e) => setSchoolEndDate(e.target.value)}
                          className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg px-2 py-1.5 border border-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* School Reason Dropdown */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">ছুটির কারণ *</label>
                    <select
                      value={schoolReasonType}
                      onChange={(e) => setSchoolReasonType(e.target.value)}
                      className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                    >
                      <option value="illness">অসুস্থতা / জ্বর (Fever & Illness)</option>
                      <option value="treatment">চিকিৎসা (Medical Treatment)</option>
                      <option value="family_issue">পারিবারিক সমস্যা (Family Problem)</option>
                      <option value="urgent_family">জরুরি পারিবারিক কাজ (Urgent Family Work)</option>
                      <option value="other">অন্যান্য (Other...)</option>
                    </select>

                    {schoolReasonType === 'other' && (
                      <input
                        type="text"
                        placeholder="বিস্তারিত ছুটির কারণ লিখুন..."
                        value={schoolCustomReason}
                        onChange={(e) => setSchoolCustomReason(e.target.value)}
                        className="w-full mt-2 bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ======================= CATEGORY 4: CITIZENSHIP / CHARACTER CERTIFICATE ======================= */}
              {mainCategory === 'citizenship_cert' && (
                <div className="space-y-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>নাগরিকত্ব / চারিত্রিক সনদ আবেদন (Certificate Fields):</span>
                  </h4>

                  {/* Certificate Type Selector */}
                  <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-200 block">কোন সনদ প্রয়োজন?</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'citizenship', label: '🔘 নাগরিকত্ব' },
                        { id: 'character', label: '🔘 চারিত্রিক' },
                        { id: 'both', label: '🔘 উভয়টি' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCertType(item.id as any)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                            certType === item.id 
                              ? 'bg-amber-600 text-white border-amber-500 shadow' 
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">যার কাছে আবেদন *</label>
                      <input
                        type="text"
                        value={certRecipient}
                        onChange={(e) => setCertRecipient(e.target.value)}
                        placeholder="চেয়ারম্যান / মেয়র / কাউন্সিলর"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">অফিস / প্রতিষ্ঠানের নাম *</label>
                      <input
                        type="text"
                        value={certOfficeName}
                        onChange={(e) => setCertOfficeName(e.target.value)}
                        placeholder="ইউনিয়ন পরিষদ / পৌরসভা"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">আবেদনকারীর পূর্ণ নাম *</label>
                      <input
                        type="text"
                        value={certApplicantName}
                        onChange={(e) => setCertApplicantName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">ওয়ার্ড নম্বর *</label>
                      <input
                        type="text"
                        value={certWardNo}
                        onChange={(e) => setCertWardNo(e.target.value)}
                        placeholder="০৭ নং ওয়ার্ড"
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">পিতার নাম *</label>
                      <input
                        type="text"
                        value={certFatherName}
                        onChange={(e) => setCertFatherName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">মাতার নাম *</label>
                      <input
                        type="text"
                        value={certMotherName}
                        onChange={(e) => setCertMotherName(e.target.value)}
                        className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">পূর্ণ ঠিকানা (গ্রাম/মহল্লা, ডাকঘর, উপজেলা, জেলা) *</label>
                    <input
                      type="text"
                      value={certAddress}
                      onChange={(e) => setCertAddress(e.target.value)}
                      placeholder="গ্রাম: পূর্ব রামপুরা, ডাকঘর: রামপুরা, উপজেলা: সদর, জেলা: বগুড়া"
                      className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                    />
                  </div>

                  {/* Purpose Dropdown */}
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সনদ চাওয়ার উদ্দেশ্য *</label>
                    <select
                      value={certPurposeType}
                      onChange={(e) => setCertPurposeType(e.target.value)}
                      className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                    >
                      <option value="job">চাকরির আবেদন (Job Application)</option>
                      <option value="passport">পাসপোর্ট তৈরি (Passport Issuance)</option>
                      <option value="education">শিক্ষা সংক্রান্ত (Educational Purpose)</option>
                      <option value="abroad">বিদেশে যাওয়ার জন্য (Going Abroad)</option>
                      <option value="visa">ভিসা আবেদন (Visa Application)</option>
                      <option value="other">অন্যান্য (Other...)</option>
                    </select>

                    {certPurposeType === 'other' && (
                      <input
                        type="text"
                        placeholder="উদ্দেশ্য লিখুন..."
                        value={certCustomPurpose}
                        onChange={(e) => setCertCustomPurpose(e.target.value)}
                        className="w-full mt-2 bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">NID / জন্মনিবন্ধন নম্বর (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={certNidNumber}
                      onChange={(e) => setCertNidNumber(e.target.value)}
                      placeholder="NID নং"
                      className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-2.5 py-2 border border-slate-700"
                    />
                  </div>
                </div>
              )}

              {/* GENERATE ACTION BUTTON */}
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-purple-600/30 transition active:scale-95 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {outputLanguage === 'bn' 
                    ? 'প্রফেশনাল A4 ডকুমেন্ট তৈরি করুন (Generate Document)' 
                    : 'Generate Professional A4 Document'}
                </span>
              </button>
            </div>
          </div>

          {/* RENDERED ULTRA-PROFESSIONAL A4 PREVIEW & PDF EXPORTER */}
          {isGenerated && (
            <div className="space-y-3 animate-fadeIn">
              {/* Action Bar */}
              <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 p-3 rounded-2xl shadow-lg">
                <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>A4 প্রফেশনাল প্রিভিউ (Ready)</span>
                </span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyText}
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center space-x-1 shadow transition active:scale-95"
                    title="টেক্সট কপি"
                  >
                    {isCopiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedText ? 'কপি হয়েছে!' : 'কপি'}</span>
                  </button>

                  <button
                    onClick={handlePrintDocument}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1 shadow transition active:scale-95"
                    title="প্রিন্ট অথবা সেভ এজ PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট / PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={isExportingPdf}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-95"
                    title="সরাসরি PDF ফাইল ডাউনলোড"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isExportingPdf ? 'তৈরি হচ্ছে...' : 'PDF ডাউনলোড'}</span>
                  </button>
                </div>
              </div>

              {/* RENDERED VISUAL A4 CANVAS (Using solid inline colors to guarantee html2canvas compatibility) */}
              <div className="overflow-x-auto rounded-2xl shadow-2xl border border-slate-700 bg-slate-900 p-2">
                <div
                  ref={documentRef}
                  id="printable-doc-card"
                  className="w-full max-w-[700px] mx-auto p-8 sm:p-10 rounded-xl shadow-inner select-text leading-relaxed text-left"
                  style={{ 
                    minHeight: '850px', 
                    backgroundColor: '#ffffff', 
                    color: '#0f172a',
                    fontFamily: "'Segoe UI', Arial, sans-serif" 
                  }}
                >
                  {/* ==================== 1. JOBS & CV RENDERER ==================== */}
                  {mainCategory === 'jobs_cv' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* 1.A JOB COVER LETTER (If Checked) */}
                      {includeCoverLetter && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px', borderBottom: '2px solid #cbd5e1', pageBreakInside: 'avoid' }}>
                          <div style={{ fontSize: '12px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                            <p style={{ fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                              তারিখ: {outputLanguage === 'bn' ? activeAppDateBn : activeAppDateEn}
                            </p>
                          </div>

                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'বরাবর,' : 'To,'}</p>
                            <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{jobRecipient}</p>
                            <p style={{ margin: 0 }}>{jobCompanyName}</p>
                            <p style={{ margin: 0 }}>{jobCompanyLocation}</p>
                          </div>

                          <div style={{ backgroundColor: '#f1f5f9', borderLeft: '4px solid #7c3aed', padding: '8px 12px' }}>
                            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                              {outputLanguage === 'bn'
                                ? `বিষয়: "${jobTitle}" পদের জন্য আবেদনপত্র।`
                                : `Subject: Application for the position of "${jobTitle}".`}
                            </p>
                          </div>

                          <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: '1.6' }}>
                            <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'মহোদয় / জনাব,' : 'Dear Sir/Madam,'}</p>
                            {outputLanguage === 'bn' ? (
                              <>
                                <p style={{ margin: 0 }}>
                                  যথাবিহিত সম্মান প্রদর্শন পূর্বক বিনীত নিবেদন এই যে, আপনার স্বনামধন্য প্রতিষ্ঠানে প্রকাশিত "{jobTitle}" পদের নিয়োগ বিজ্ঞপ্তিটির প্রতি আমি বিশেষভাবে আগ্রহী। আমার শিক্ষাগত যোগ্যতা, {jobExperienceSummary} এবং {jobKeySkills} উক্ত পদের দায়িত্ব সফলতার সাথে পালনে সহায়ক হবে বলে আমি দৃঢ়ভাবে বিশ্বাস করি। {jobWhySuitable}
                                </p>
                                <p style={{ margin: 0 }}>
                                  আমার শিক্ষাগত যোগ্যতা ও অভিজ্ঞতার বিস্তারিত বিবরণ সম্বলিত পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) পত্রের সাথে সংযুক্ত করা হলো। আমাকে উক্ত পদের জন্য বিবেচনা করে মৌখিক পরীক্ষার সুযোগ প্রদান করলে অত্যন্ত কৃতজ্ঞ থাকব।
                                </p>
                              </>
                            ) : (
                              <p style={{ margin: 0 }}>
                                I am writing to express my enthusiastic interest in the "{jobTitle}" position at {jobCompanyName}. With my academic qualifications, {jobExperienceSummary}, and {jobKeySkills}, I am confident in my ability to make significant contributions to your esteemed organization. {jobWhySuitable} Attached please find my detailed CV for your consideration.
                              </p>
                            )}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '30px', borderTop: '1px dashed #cbd5e1', pageBreakInside: 'avoid' }}>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>সংযুক্ত: জীবনবৃত্তান্ত (CV) ও সনদপত্র</p>
                            <div style={{ textAlign: 'center', minWidth: '150px' }}>
                              {showDigitalSignature ? (
                                <div style={{ height: '24px', fontStyle: 'italic', color: '#334155', fontWeight: 'bold' }}>{jobApplicantName}</div>
                              ) : (
                                <div style={{ height: '35px' }}></div>
                              )}
                              <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{outputLanguage === 'bn' ? 'বিনীত নিবেদক,' : 'Sincerely yours,'}</p>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{jobApplicantName}</p>
                                <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>{jobApplicantMobile}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 1.B FULL CV / RESUME (If Checked) */}
                      {includeCv && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                          {/* CV Header with Photo */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '14px', pageBreakInside: 'avoid' }}>
                            <div>
                              <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>
                                {cvFullName}
                              </h1>
                              <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed', marginTop: '2px', marginBottom: 0 }}>
                                {cvProfessionalTitle}
                              </p>
                              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '8px' }}>
                                <p style={{ margin: 0 }}>📞 মোবাইল: {cvMobile}</p>
                                <p style={{ margin: 0 }}>✉️ ইমেইল: {cvEmail}</p>
                                <p style={{ margin: 0 }}>📍 বর্তমান ঠিকানা: {cvPresentAddress}</p>
                              </div>
                            </div>
                            {userPhoto && (
                              <div style={{ flexShrink: 0, marginLeft: '16px' }}>
                                <img
                                  src={userPhoto}
                                  alt="Passport Photo"
                                  style={{ width: '95px', height: '115px', objectFit: 'cover', borderRadius: '4px', border: '2px solid #0f172a' }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Career Objective */}
                          <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                              {outputLanguage === 'bn' ? '🎯 ক্যারিয়ার অবজেক্টিভ (Career Objective)' : '🎯 Career Objective'}
                            </h3>
                            <p style={{ fontSize: '12px', color: '#1e293b', lineHeight: '1.6', margin: 0 }}>
                              {careerObjective}
                            </p>
                          </div>

                          {/* Academic Table */}
                          <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                              {outputLanguage === 'bn' ? '🎓 শিক্ষাগত যোগ্যতার বিবরণ (Academic Qualifications)' : '🎓 Academic Qualifications'}
                            </h3>
                            <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse', border: '1px solid #94a3b8' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold' }}>
                                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>ডিগ্রি / পরীক্ষা</th>
                                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px', textAlign: 'center' }}>সন</th>
                                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>প্রতিষ্ঠান / বোর্ড</th>
                                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px' }}>বিভাগ / বিষয়</th>
                                  <th style={{ border: '1px solid #94a3b8', padding: '6px 8px', textAlign: 'center' }}>জিপিএ</th>
                                </tr>
                              </thead>
                              <tbody>
                                {educations.map((edu, idx) => (
                                  <tr key={edu.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', fontWeight: 'bold', color: '#0f172a' }}>{edu.exam}</td>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center' }}>{edu.year}</td>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{edu.institution}</td>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px' }}>{edu.boardOrSubject}</td>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '6px 8px', textAlign: 'center', fontWeight: 'bold', color: '#047857' }}>{edu.resultOrGpa}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Experience & Skills */}
                          <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>
                              {outputLanguage === 'bn' ? '⚡ কাজের অভিজ্ঞতা ও দক্ষতা (Experience & Skills)' : '⚡ Experience & Skills'}
                            </h3>
                            <div style={{ fontSize: '12px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>অভিজ্ঞতা:</span> {workExperience}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>মূল দক্ষতা:</span> {skills}</p>
                            </div>
                          </div>

                          {/* Personal Details */}
                          <div style={{ pageBreakInside: 'avoid' }}>
                            <h3 style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px' }}>
                              {outputLanguage === 'bn' ? '👤 ব্যক্তিগত তথ্যাবলি (Personal Details)' : '👤 Personal Information'}
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '12px', color: '#1e293b', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>পিতার নাম:</span> {fatherName}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>মাতার নাম:</span> {motherName}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>জন্ম তারিখ:</span> {formatDateBangla(dateOfBirth)}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>লিঙ্গ:</span> {gender === 'male' ? 'পুরুষ (Male)' : gender === 'female' ? 'মহিলা (Female)' : 'অন্যান্য'}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>রক্তের গ্রুপ:</span> <span style={{ fontWeight: 'bold', color: '#dc2626' }}>{bloodGroup}</span></p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>ধর্ম:</span> {religion}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>বৈবাহিক অবস্থা:</span> {maritalStatus === 'single' ? 'অবিবাহিত (Single)' : 'বিবাহিত (Married)'}</p>
                              <p style={{ margin: 0 }}><span style={{ fontWeight: 'bold' }}>জাতীয়তা:</span> {nationality}</p>
                              <p style={{ gridColumn: 'span 2', margin: 0 }}><span style={{ fontWeight: 'bold' }}>স্থায়ী ঠিকানা:</span> {cvPermanentAddress}</p>
                            </div>
                          </div>

                          {/* CV Signature Block - Clean & Realistic */}
                          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '35px', pageBreakInside: 'avoid' }}>
                            <div style={{ textAlign: 'center', minWidth: '160px' }}>
                              {showDigitalSignature ? (
                                <div style={{ height: '24px', fontStyle: 'italic', color: '#334155', fontWeight: 'bold' }}>
                                  {cvFullName}
                                </div>
                              ) : (
                                <div style={{ height: '35px' }}></div>
                              )}
                              <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                                  (আবেদনকারীর স্বাক্ষর)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ==================== 2. OFFICE LEAVE RENDERER ==================== */}
                  {mainCategory === 'office_leave' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                          তারিখ: {outputLanguage === 'bn' ? activeAppDateBn : activeAppDateEn}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '2px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'বরাবর,' : 'To,'}</p>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{officeRecipient}</p>
                        <p style={{ margin: 0 }}>{officeCompanyName}</p>
                      </div>

                      <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #16a34a', padding: '8px 12px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                          {outputLanguage === 'bn'
                            ? `বিষয়: ${officeStartBn} হতে ${officeEndBn} পর্যন্ত মোট ${officeDaysBn} দিনের ছুটির আবেদন।`
                            : `Subject: Application for leave from ${officeStartEn} to ${officeEndEn} (${officeDays} days).`}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'মহোদয়,' : 'Dear Sir/Madam,'}</p>
                        {outputLanguage === 'bn' ? (
                          <>
                            <p style={{ margin: 0 }}>
                              বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানে "{officeDesignation}" হিসেবে নিষ্ঠার সাথে দায়িত্ব পালন করে আসছি। আমার {getOfficeReasonText('bn')}-এর কারণে আগামী {officeStartBn} হতে {officeEndBn} পর্যন্ত মোট {officeDaysBn} দিন অফিসে উপস্থিত থাকা সম্ভব হবে না।
                            </p>
                            <p style={{ margin: 0 }}>
                              অতএব, মহোদয়ের নিকট আকুল প্রার্থনা, উক্ত দিনগুলোর জন্য আমার ছুটি মঞ্জুর করে বাধিত করবেন।
                            </p>
                          </>
                        ) : (
                          <p style={{ margin: 0 }}>
                            I am writing to formally request a leave of absence from my official duties as "{officeDesignation}". Due to {getOfficeReasonText('en')}, I will be unable to attend the office from {officeStartEn} to {officeEndEn} (Total {officeDays} days). I kindly request you to approve my leave of absence.
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '35px', pageBreakInside: 'avoid' }}>
                        <div style={{ textAlign: 'center', minWidth: '160px' }}>
                          {showDigitalSignature ? (
                            <div style={{ height: '24px', fontStyle: 'italic', color: '#334155', fontWeight: 'bold' }}>{officeApplicantName}</div>
                          ) : (
                            <div style={{ height: '35px' }}></div>
                          )}
                          <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{outputLanguage === 'bn' ? 'বিনীত নিবেদক,' : 'Sincerely yours,'}</p>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{officeApplicantName}</p>
                            <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>{officeDesignation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==================== 3. SCHOOL LEAVE RENDERER ==================== */}
                  {mainCategory === 'school_leave' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                          তারিখ: {outputLanguage === 'bn' ? activeAppDateBn : activeAppDateEn}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '2px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'বরাবর,' : 'To,'}</p>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{schoolRecipient}</p>
                        <p style={{ margin: 0 }}>{schoolName}</p>
                        {schoolLocation && <p style={{ margin: 0 }}>{schoolLocation}</p>}
                      </div>

                      <div style={{ backgroundColor: '#ecfeff', borderLeft: '4px solid #0891b2', padding: '8px 12px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                          {outputLanguage === 'bn'
                            ? `বিষয়: ${schoolStartBn} হতে ${schoolEndBn} পর্যন্ত মোট ${schoolDaysBn} দিনের ছুটির আবেদন।`
                            : `Subject: Application for leave of absence from ${schoolStartEn} to ${schoolEndEn} (${schoolDays} days).`}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'জনাব / মহোদয়,' : 'Respected Sir/Madam,'}</p>
                        {outputLanguage === 'bn' ? (
                          <>
                            <p style={{ margin: 0 }}>
                              সবিনয় নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানের {studentClass}-এর একজন নিয়মিত শিক্ষার্থী, রোল নম্বর: {studentRoll} {studentSection ? `(${studentSection})` : ''}। হঠাৎ {getSchoolReasonText('bn')}-এর কারণে আগামী {schoolStartBn} হতে {schoolEndBn} পর্যন্ত মোট {schoolDaysBn} দিন বিদ্যালয়ে উপস্থিত হতে পারছি না।
                            </p>
                            <p style={{ margin: 0 }}>
                              অতএব, জনাবের নিকট আকুল আবেদন, উক্ত দিনগুলোর জন্য আমার ছুটি মঞ্জুর করতে মহোদয়ের সদয় মর্জি হয়।
                            </p>
                          </>
                        ) : (
                          <p style={{ margin: 0 }}>
                            I beg to state that I am a regular student of class {studentClass}, Roll No: {studentRoll} at your institution. Due to {getSchoolReasonText('en')}, I will not be able to attend my classes from {schoolStartEn} to {schoolEndEn} (Total {schoolDays} days). I kindly request you to grant me leave of absence.
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '35px', borderTop: '1px dashed #cbd5e1', pageBreakInside: 'avoid' }}>
                        <div style={{ textAlign: 'center', minWidth: '140px' }}>
                          <div style={{ height: '35px' }}></div>
                          <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>অভিভাবকের স্বাক্ষর</p>
                            <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0 0' }}>{guardianName}</p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'center', minWidth: '140px' }}>
                          {showDigitalSignature ? (
                            <div style={{ height: '24px', fontStyle: 'italic', color: '#334155', fontWeight: 'bold' }}>{studentName}</div>
                          ) : (
                            <div style={{ height: '35px' }}></div>
                          )}
                          <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{outputLanguage === 'bn' ? 'বিনীত শিক্ষার্থী,' : 'Yours obediently,'}</p>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{studentName}</p>
                            <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>শ্রেণি: {studentClass}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==================== 4. CITIZENSHIP / CHARACTER CERTIFICATE RENDERER ==================== */}
                  {mainCategory === 'citizenship_cert' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#475569', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                        <p style={{ fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                          তারিখ: {outputLanguage === 'bn' ? activeAppDateBn : activeAppDateEn}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '2px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'বরাবর,' : 'To,'}</p>
                        <p style={{ fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{certRecipient}</p>
                        <p style={{ margin: 0 }}>{certOfficeName}</p>
                      </div>

                      <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #d97706', padding: '8px 12px', pageBreakInside: 'avoid' }}>
                        <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                          {outputLanguage === 'bn'
                            ? `বিষয়: ${certType === 'citizenship' ? 'নাগরিকত্ব' : certType === 'character' ? 'চারিত্রিক' : 'নাগরিকত্ব ও চারিত্রিক'} সনদপত্র পাওয়ার আবেদন।`
                            : `Subject: Application for ${certType === 'citizenship' ? 'Citizenship' : certType === 'character' ? 'Character' : 'Citizenship and Character'} Certificate.`}
                        </p>
                      </div>

                      <div style={{ fontSize: '13px', color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6', pageBreakInside: 'avoid' }}>
                        <p style={{ fontWeight: 'bold', margin: 0 }}>{outputLanguage === 'bn' ? 'মহোদয়,' : 'Respected Sir,'}</p>
                        {outputLanguage === 'bn' ? (
                          <>
                            <p style={{ margin: 0 }}>
                              বিনীত নিবেদন এই যে, আমি আপনার আওতাধীন {certOfficeName}-এর {certWardNo}-এর একজন স্থায়ী বাসিন্দা ও জন্মসূত্রে বাংলাদেশের নাগরিক।
                            </p>
                            <p style={{ margin: 0 }}>
                              আমার পূর্ণ নাম: {certApplicantName}, পিতার নাম: {certFatherName}, মাতার নাম: {certMotherName}। আমার বর্তমান ও স্থায়ী ঠিকানা: {certAddress}।
                            </p>
                            <p style={{ margin: 0 }}>
                              আমার {getCertPurposeText('bn')}-এর জন্য একটি {certType === 'citizenship' ? 'নাগরিকত্ব' : certType === 'character' ? 'চারিত্রিক' : 'নাগরিকত্ব ও চারিত্রিক'} সনদপত্র একান্ত প্রয়োজন। {certNidNumber ? `আমার জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নং: ${certNidNumber}।` : ''}
                            </p>
                            <p style={{ margin: 0 }}>
                              অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উক্ত তথ্যাবলি বিবেচনা পূর্বক আমাকে কাঙ্ক্ষিত সনদপত্রটি প্রদান করে বাধিত করবেন।
                            </p>
                          </>
                        ) : (
                          <p style={{ margin: 0 }}>
                            I beg to state that I am a permanent resident and citizen of Bangladesh residing at {certAddress}, Ward No: {certWardNo}, under {certOfficeName}. For the purpose of {getCertPurposeText('en')}, I urgently require a {certType === 'citizenship' ? 'Citizenship' : certType === 'character' ? 'Character' : 'Citizenship and Character'} Certificate. I kindly request you to issue the certificate upon verification.
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '35px', pageBreakInside: 'avoid' }}>
                        <div style={{ textAlign: 'center', minWidth: '160px' }}>
                          {showDigitalSignature ? (
                            <div style={{ height: '24px', fontStyle: 'italic', color: '#334155', fontWeight: 'bold' }}>{certApplicantName}</div>
                          ) : (
                            <div style={{ height: '35px' }}></div>
                          )}
                          <div style={{ borderTop: '1.5px solid #0f172a', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{outputLanguage === 'bn' ? 'বিনীত নিবেদক,' : 'Sincerely yours,'}</p>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{certApplicantName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: UNIVERSAL TRANSLATOR */}
      {activeTool === 'translate' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3 text-left">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold px-1">
              <span>ভাষা নির্বাচন করুন:</span>
              <span className="text-[10px] text-slate-400 font-normal">মিষ্টি ফিমেল ভয়েস স্পিচ</span>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-200 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>

              <button
                onClick={handleSwapLanguages}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-indigo-300 active:scale-95 transition"
                title="ভাষা অদল-বদল করুন"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-200 text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <textarea
                rows={4}
                placeholder="এখানে আপনার টেক্সট লিখুন বা পেস্ট করুন..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 text-xs p-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
              {sourceText && (
                <div className="flex items-center justify-between px-1 -mt-1 pb-1">
                  <button
                    onClick={() => handleSpeakText(sourceText, sourceLang)}
                    className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:text-white flex items-center space-x-1 text-[11px]"
                    title="উচ্চারণ শুনুন"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>শুনুন</span>
                  </button>
                  <button
                    onClick={() => setSourceText('')}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    মুছে ফেলুন ✕
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
            >
              {isTranslating ? (
                <span>অনুবাদ হচ্ছে...</span>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  <span>অনুবাদ করুন (Translate)</span>
                </>
              )}
            </button>

            {translatedText && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-2.5 mt-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-1.5">
                  <span className="font-bold text-indigo-300">অনূদিত ফলাফল:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSpeakText(translatedText, targetLang)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50 flex items-center space-x-1 text-xs font-semibold"
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-300" />
                      <span>ভয়েস শুনুন</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(translatedText);
                        setIsCopiedTranslation(true);
                        setTimeout(() => setIsCopiedTranslation(false), 2000);
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs hover:bg-slate-700 font-semibold"
                    >
                      {isCopiedTranslation ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopiedTranslation ? 'কপি হয়েছে' : 'কপি'}</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed select-all">
                  {translatedText}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ad Space */}
      <AdBanner title="সহজেই যেকোনো ভাষায় যোগাযোগ করুন" subtitle="QuickLife স্মার্ট অনুবাদক সম্পূর্ণ ফ্রি" />
    </div>
  );
};

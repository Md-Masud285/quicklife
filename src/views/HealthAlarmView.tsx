import React, { useState } from "react";
import { 
  BellRing, 
  Plus, 
  Trash2, 
  Volume2, 
  Pill, 
  ShieldAlert, 
  Phone, 
  Edit2, 
  Upload, 
  Play, 
  Square,
  HeartPulse,
  Flame,
  Ambulance,
  X,
  Mic,
  Music,
  Clock,
  MessageSquare
} from "lucide-react";
import type { MedicineReminder, PersonalEmergencyContact } from "../types";
import { alarmSoundManager } from "../utils/audioAlarm";
import { AdBanner } from "../components/AdBanner";
import { DynamicAdRenderer } from '../components/DynamicAdRenderer';

import type { UserProfile } from '../services/authService';

interface HealthAlarmViewProps {
  currentUser?: UserProfile | null;
  onRequireLogin?: () => void;
  medicines: MedicineReminder[];
  onSaveMedicines: (list: MedicineReminder[]) => void;
  emergencyContacts: PersonalEmergencyContact[];
  onSaveEmergencyContacts: (contacts: PersonalEmergencyContact[]) => void;
}

const PRESET_TIMES: Record<number, string[]> = {
  1: ["08:00"],
  2: ["08:00", "21:00"],
  3: ["08:00", "14:00", "21:00"],
  4: ["08:00", "12:00", "18:00", "21:00"],
};

const ORDINAL_BN = ["১ম", "২য়", "৩য়", "৪র্থ", "৫ম", "৬ষ্ঠ", "৭ম", "৮ম"];

export const HealthAlarmView: React.FC<HealthAlarmViewProps> = ({
  medicines,
  onSaveMedicines,
  emergencyContacts,
  onSaveEmergencyContacts,
  currentUser,
  onRequireLogin
}) => {

  // Modal states
  const [isMedModalOpen, setIsMedModalOpen] = useState<boolean>(false);
  const [editingMedicine, setEditingMedicine] = useState<MedicineReminder | null>(null);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<PersonalEmergencyContact | null>(null);

  // Audio preview state
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [stopPreviewFn, setStopPreviewFn] = useState<(() => void) | null>(null);

  // Medicine Form State
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("১টি ট্যাবলেট");
  const [medTimes, setMedTimes] = useState<string[]>(["08:00"]);
  const [medMeal, setMedMeal] = useState<"before" | "after" | "with">("after");
  const [soundMode, setSoundMode] = useState<"voice" | "default" | "custom">("voice");
  const [voiceLang, setVoiceLang] = useState<"bn" | "en">("bn");
  const [voiceNote, setVoiceNote] = useState("");
  const [customAudioData, setCustomAudioData] = useState<string>("");
  const [customAudioName, setCustomAudioName] = useState<string>("");

  // Contact Form State
  const [contactCategory, setContactCategory] = useState<"ambulance" | "fire" | "thana" | "custom">("thana");
  const [contactTitle, setContactTitle] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactThana, setContactThana] = useState("");

  // --- Times helpers ---
  const handlePreset = (count: number) => {
    setMedTimes(PRESET_TIMES[count] ?? ["08:00"]);
  };

  const handleTimeChange = (idx: number, val: string) => {
    setMedTimes(prev => prev.map((t, i) => (i === idx ? val : t)));
  };

  const handleAddTime = () => {
    setMedTimes(prev => [...prev, "12:00"]);
  };

  const handleRemoveTime = (idx: number) => {
    if (medTimes.length <= 1) return;
    setMedTimes(prev => prev.filter((_, i) => i !== idx));
  };

  // Open Medicine Modal (for Add or Edit)
  const handleOpenMedModal = (med?: MedicineReminder) => {
    if (!med && !currentUser && medicines.length >= 2) {
      if (onRequireLogin) onRequireLogin();
      return;
    }
    if (med) {
      setEditingMedicine(med);
      setMedName(med.medicineName);
      setMedDosage(med.dosage || "১টি ট্যাবলেট");
      setMedTimes(med.times && med.times.length > 0 ? med.times : (med.time ? [med.time] : ["08:00"]));
      setMedMeal(med.mealTime || "after");
      setSoundMode(med.soundMode ?? ((med as any).soundType === "custom" ? "custom" : "voice"));
      setVoiceLang("bn");
      setVoiceNote(med.voiceNote ?? "");
      setCustomAudioData(med.customAudioData || "");
      setCustomAudioName(med.soundMode === "custom" ? med.soundName : "");
    } else {
      setEditingMedicine(null);
      setMedName("");
      setMedDosage("১টি ট্যাবলেট");
      setMedTimes(["08:00"]);
      setMedMeal("after");
      setSoundMode("voice");
      setVoiceLang("bn");
      setVoiceNote("");
      setCustomAudioData("");
      setCustomAudioName("");
    }
    setIsMedModalOpen(true);
  };

  // Toggle alarm on/off
  const handleToggleMed = (id: string) => {
    const updated = medicines.map(m => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m);
    onSaveMedicines(updated);
  };

  // Delete medicine
  const handleDeleteMed = (id: string) => {
    if (confirm("আপনি কি এই ওষুধের অ্যালার্ম মুছে ফেলতে চান?")) {
      const updated = medicines.filter(m => m.id !== id);
      onSaveMedicines(updated);
    }
  };

  // Handle Custom Audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomAudioName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setCustomAudioData(result);
        setSoundMode("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  // Test sound preview
  const handleToggleSoundPreview = () => {
    if (isPlayingPreview) {
      if (stopPreviewFn) stopPreviewFn();
      alarmSoundManager.stopAlarm();
      setIsPlayingPreview(false);
      setStopPreviewFn(null);
      return;
    }

    let stopFn: () => void;
    if (soundMode === "voice") {
      stopFn = alarmSoundManager.previewVoice(
        medName || "নাপা এক্সট্রা",
        medDosage || "১টি ট্যাবলেট",
        medMeal,
        voiceLang,
        voiceNote || undefined
      );
    } else if (soundMode === "custom" && customAudioData) {
      stopFn = alarmSoundManager.playCustomAudio(customAudioData);
    } else {
      stopFn = alarmSoundManager.playDefaultAlarm();
    }

    setIsPlayingPreview(true);
    setStopPreviewFn(() => stopFn);
    setTimeout(() => {
      alarmSoundManager.stopAlarm();
      setIsPlayingPreview(false);
    }, 6000);
  };

  // Save or Update medicine reminder
  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    const getSoundName = () => {
      if (soundMode === "voice") return voiceLang === "bn" ? "স্মার্ট ভয়েস (বাংলা)" : "Smart Voice (English)";
      if (soundMode === "custom" && customAudioName) return customAudioName;
      return "ডিফল্ট রিংটোন";
    };

    const medData: MedicineReminder = {
      id: editingMedicine ? editingMedicine.id : "med_" + Date.now(),
      medicineName: medName,
      dosage: medDosage,
      times: medTimes,
      time: medTimes[0] || "08:00",
      mealTime: medMeal,
      days: [0, 1, 2, 3, 4, 5, 6],
      soundMode: soundMode,
      soundName: getSoundName(),
      customAudioData: soundMode === "custom" ? customAudioData : undefined,
      voiceNote: voiceNote || undefined,
      isEnabled: editingMedicine ? editingMedicine.isEnabled : true,
    };

    if (editingMedicine) {
      onSaveMedicines(medicines.map(m => m.id === editingMedicine.id ? medData : m));
    } else {
      onSaveMedicines([...medicines, medData]);
    }

    setIsMedModalOpen(false);
    setEditingMedicine(null);
    setMedName("");
    setCustomAudioData("");
    setCustomAudioName("");
    if (isPlayingPreview) {
      alarmSoundManager.stopAlarm();
      setIsPlayingPreview(false);
    }
  };

  // Open Contact Edit
  const handleOpenContactModal = (contact?: PersonalEmergencyContact) => {
    if (contact) {
      setEditingContact(contact);
      setContactCategory(contact.category);
      setContactTitle(contact.title);
      setContactPhone(contact.phone);
      setContactThana(contact.locationOrThana || "");
    } else {
      setEditingContact(null);
      setContactCategory("thana");
      setContactTitle("");
      setContactPhone("");
      setContactThana("");
    }
    setIsContactModalOpen(true);
  };

  // Save Contact
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTitle || !contactPhone) return;

    if (editingContact) {
      const updated = emergencyContacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, category: contactCategory, title: contactTitle, phone: contactPhone, locationOrThana: contactThana } 
          : c
      );
      onSaveEmergencyContacts(updated);
    } else {
      const newContact: PersonalEmergencyContact = {
        id: "contact_" + Date.now(),
        category: contactCategory,
        title: contactTitle,
        phone: contactPhone,
        locationOrThana: contactThana
      };
      onSaveEmergencyContacts([...emergencyContacts, newContact]);
    }
    setIsContactModalOpen(false);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("আপনি কি এই জরুরি নম্বরটি মুছে ফেলতে চান?")) {
      onSaveEmergencyContacts(emergencyContacts.filter(c => c.id !== id));
    }
  };

  const getContactIcon = (cat: string) => {
    switch (cat) {
      case "ambulance": return <Ambulance className="w-5 h-5 text-blue-400" />;
      case "fire": return <Flame className="w-5 h-5 text-orange-400" />;
      case "thana":
      default: return <ShieldAlert className="w-5 h-5 text-red-400" />;
    }
  };

  const getMealLabel = (m: "before" | "after" | "with") =>
    m === "before" ? "খাওয়ার আগে" : m === "after" ? "খাওয়ার পরে" : "খাবারের সাথে";

  const getSoundIcon = (mode?: MedicineReminder["soundMode"]) => {
    if (mode === "voice") return <Mic className="w-3.5 h-3.5 text-emerald-400" />;
    if (mode === "custom") return <Music className="w-3.5 h-3.5 text-cyan-400" />;
    return <Volume2 className="w-3.5 h-3.5 text-amber-400" />;
  };

  const mealLabelMap = {
    before: "খাওয়ার আগে",
    after: "খাওয়ার পরে",
    with: "খাবারের সাথে",
  };

  const previewText = voiceLang === "bn"
    ? "আপনার " + (medName || "ওষুধের নাম") + " খাওয়ার সময় হয়েছে। " + medDosage + " " + mealLabelMap[medMeal] + " নিন।"
    : "It's time to take your " + (medName || "medicine") + ". Please take " + medDosage + " " + (medMeal === "before" ? "before meals" : medMeal === "after" ? "after meals" : "with food") + ".";

  return (
    <div className="space-y-4 pb-8 pt-1 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 text-white shadow-xl shadow-emerald-900/20 text-left">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              স্বাস্থ্য সুরক্ষা ও অ্যালার্ম
            </span>
            <h2 className="text-xl font-bold mt-1.5">ওষুধ ও জরুরি নম্বর সেভার</h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              স্মার্ট ভয়েস অ্যালার্ম এবং নিজের এলাকার ওসি, ফায়ার ও অ্যাম্বুলেন্স নম্বর
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            <HeartPulse className="w-7 h-7 text-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* SECTION 1: Emergency Contacts */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-200">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold">আমার থানার ও জরুরি নম্বর</h3>
          </div>
          <button
            onClick={() => handleOpenContactModal()}
            className="text-xs bg-red-600/30 hover:bg-red-600/50 text-red-300 px-3 py-1 rounded-full border border-red-500/30 flex items-center space-x-1 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন যোগ</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          আপনার স্থানীয় থানা, ফায়ার সার্ভিস বা অ্যাম্বুলেন্স নম্বর সেভ রাখুন। বিপদে ১ ক্লিকেই কল যাবে।
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-700/50 hover:border-slate-600 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  {getContactIcon(contact.category)}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{contact.title}</div>
                  <div className="text-[11px] text-slate-400">
                    {contact.locationOrThana || "জরুরি কন্টাক্ট"} • {contact.phone}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={"tel:" + contact.phone}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 active:scale-95 transition border border-emerald-500/50"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>কল দিন</span>
                </a>
                <div className="flex flex-col space-y-1">
                  <button
                    type="button"
                    onClick={() => handleOpenContactModal(contact)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="এডিট"
                  >
                    <Edit2 className="w-3 h-3 text-indigo-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3 h-3 text-rose-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Medicine Reminders */}
      <div className="rounded-2xl bg-slate-800/90 border border-slate-700/80 p-4 shadow-lg space-y-3 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-200">
            <BellRing className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">ওষুধের তালিকা ও অ্যালার্ম</h3>
          </div>
          <button
            onClick={() => handleOpenMedModal()}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-full font-bold shadow-md flex items-center space-x-1 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ওষুধ যোগ করুন</span>
          </button>
        </div>

        {medicines.length > 0 ? (
          <div className="space-y-2.5 pt-1">
            {medicines.map((med) => {
              const times = med.times && med.times.length > 0 ? med.times : (med.time ? [med.time] : []);
              return (
                <div
                  key={med.id}
                  className={"p-3.5 rounded-2xl border transition-all " + (
                    med.isEnabled 
                      ? "bg-slate-900/80 border-slate-700/70" 
                      : "bg-slate-900/30 border-slate-800 opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Pill className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{med.medicineName}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{med.dosage} • {getMealLabel(med.mealTime)}</p>

                        {/* Times row */}
                        <div className="flex flex-wrap items-center gap-1 mt-1.5">
                          <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="text-[10px] text-slate-400">দিনে {times.length} বার:</span>
                          {times.map((t, i) => (
                            <span key={i} className="text-[10px] font-mono font-bold text-emerald-300 bg-slate-800 px-1.5 py-0.5 rounded-lg border border-emerald-500/20">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Sound mode row */}
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-1.5">
                          {getSoundIcon(med.soundMode)}
                          <span>
                            {med.soundMode === "voice" ? "🔊 স্মার্ট ভয়েস অ্যালার্ম" : med.soundMode === "custom" ? "📂 " + (med.soundName || "কাস্টম গান") : "🔔 ডিফল্ট রিংটোন"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleOpenMedModal(med)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                        title="এডিট"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMed(med.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 transition"
                        title="মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleMed(med.id)}
                        className={"w-11 h-6 rounded-full transition-colors relative p-0.5 " + (
                          med.isEnabled ? "bg-emerald-600" : "bg-slate-700"
                        )}
                        title={med.isEnabled ? "অ্যালার্ম চালু" : "অ্যালার্ম বন্ধ"}
                      >
                        <div
                          className={"w-5 h-5 rounded-full bg-white transition-transform " + (
                            med.isEnabled ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400 text-xs">
            কোনো ওষুধ যোগ করা নেই। &apos;ওষুধ যোগ করুন&apos; বাটনে ক্লিক করুন।
          </div>
        )}
      </div>

      <DynamicAdRenderer placement="health" />
      <AdBanner title="নিয়মিত স্বাস্থ্য পরীক্ষা করুন" subtitle="প্রতিদিন পর্যাপ্ত পানি ও পুষ্টিকর খাবার গ্রহণ করুন" />

      {/* ====== Modal: Add / Edit Medicine ====== */}
      {isMedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 shadow-2xl text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingMedicine ? "ওষুধের তথ্য এডিট করুন" : "নতুন ওষুধ ও অ্যালার্ম"}
                </h3>
              </div>
              <button onClick={() => setIsMedModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4 mt-4">
              {/* Medicine Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ওষুধের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Napa Extra, Seclo, Ceevit ইত্যাদি"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Dosage + Meal */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">পরিমাণ / ডোজ</label>
                  <input
                    type="text"
                    placeholder="১টি ট্যাবলেট / ১ চামচ"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">খাওয়ার নিয়ম</label>
                  <select
                    value={medMeal}
                    onChange={(e) => setMedMeal(e.target.value as "before" | "after" | "with")}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="after">খাওয়ার পরে</option>
                    <option value="before">খাওয়ার আগে</option>
                    <option value="with">খাবারের সাথে</option>
                  </select>
                </div>
              </div>

              {/* Multi-Schedule Times */}
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/70 space-y-3">
                <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>দিনে কতবার খাবেন? (অ্যালার্মের সময়)</span>
                </label>

                {/* Preset buttons */}
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handlePreset(n)}
                      className={"flex-1 py-1.5 rounded-xl text-xs font-bold transition border " + (
                        medTimes.length === n
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-slate-900 text-slate-300 border-slate-700 hover:border-emerald-600"
                      )}
                    >
                      {n} বার
                    </button>
                  ))}
                </div>

                {/* Time pickers */}
                <div className="space-y-2">
                  {medTimes.map((t, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-slate-300 w-10 shrink-0">
                        {ORDINAL_BN[idx] || (idx + 1) + "ম"}:
                      </span>
                      <input
                        type="time"
                        value={t}
                        onChange={(e) => handleTimeChange(idx, e.target.value)}
                        className="flex-1 bg-slate-900 text-emerald-300 text-sm font-mono font-bold rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                      {medTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTime(idx)}
                          className="p-2 rounded-lg bg-slate-700/80 hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition"
                          title="সময়টি সরান"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add time button */}
                <button
                  type="button"
                  onClick={handleAddTime}
                  className="w-full py-2 rounded-xl border border-solid border-slate-600 hover:border-emerald-500 text-xs text-slate-300 hover:text-emerald-400 transition flex items-center justify-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>আরেকটি সময় যোগ করুন (+Custom Time)</span>
                </button>
              </div>

              {/* Sound Mode */}
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/70 space-y-3">
                <label className="text-xs font-bold text-slate-200">অ্যালার্মের সুর ও ভয়েস অপশন</label>

                <div className="grid grid-cols-3 gap-2">
                  {/* Smart Voice */}
                  <button
                    type="button"
                    onClick={() => setSoundMode("voice")}
                    className={"py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition border flex flex-col items-center space-y-1 " + (
                      soundMode === "voice"
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600"
                    )}
                  >
                    <Mic className="w-4 h-4" />
                    <span>স্মার্ট ভয়েস</span>
                  </button>

                  {/* Default Ringtone */}
                  <button
                    type="button"
                    onClick={() => setSoundMode("default")}
                    className={"py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition border flex flex-col items-center space-y-1 " + (
                      soundMode === "default"
                        ? "bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600"
                    )}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>রিংটোন</span>
                  </button>

                  {/* Custom Audio Upload */}
                  <label className={"py-2.5 px-1.5 rounded-xl text-[11px] font-bold transition border flex flex-col items-center space-y-1 cursor-pointer " + (
                    soundMode === "custom"
                      ? "bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600"
                  )}>
                    <Upload className="w-4 h-4" />
                    <span>কাস্টম গান</span>
                    <input type="file" accept="audio/*,video/mp4" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                {/* Voice options */}
                {soundMode === "voice" && (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setVoiceLang("bn")}
                        className={"flex-1 py-1.5 rounded-lg text-xs font-bold transition border " + (
                          voiceLang === "bn" ? "bg-emerald-700 text-white border-emerald-500" : "bg-slate-900 text-slate-400 border-slate-700"
                        )}
                      >
                        🇧🇩 বাংলায় বলবে
                      </button>
                      <button
                        type="button"
                        onClick={() => setVoiceLang("en")}
                        className={"flex-1 py-1.5 rounded-lg text-xs font-bold transition border " + (
                          voiceLang === "en" ? "bg-blue-700 text-white border-blue-500" : "bg-slate-900 text-slate-400 border-slate-700"
                        )}
                      >
                        🇬🇧 English
                      </button>
                    </div>

                    <div className="text-[11px] text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                      <span className="font-semibold block text-emerald-400 mb-0.5">💬 অ্যালার্মের সময় যা বলবে:</span>
                      &quot;{previewText}&quot;
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1 mb-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>কাস্টম নির্দেশিকা বা নোট (ঐচ্ছিক)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="যেমন: কুসুম গরম পানিতে খাবেন"
                        value={voiceNote}
                        onChange={(e) => setVoiceNote(e.target.value)}
                        className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {soundMode === "custom" && customAudioName && (
                  <p className="text-[11px] text-cyan-300 truncate">✓ সিলেক্ট করা অডিও: {customAudioName}</p>
                )}

                {/* Test Sound Button */}
                <button
                  type="button"
                  onClick={handleToggleSoundPreview}
                  className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-slate-100 flex items-center justify-center space-x-2 transition shadow-md"
                >
                  {isPlayingPreview ? (
                    <>
                      <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
                      <span>সাউন্ড বন্ধ করুন</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                      <span>সাউন্ড বাজিয়ে টেস্ট করুন (Test Sound)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="pt-1 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsMedModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  {editingMedicine ? "পরিবর্তন সেভ করুন" : "অ্যালার্ম সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Emergency Contact */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingContact ? "জরুরি নম্বর পরিবর্তন" : "নতুন জরুরি নম্বর যোগ"}
              </h3>
              <button onClick={() => setIsContactModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3.5 mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ক্যাটাগরি</label>
                <select
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value as "ambulance" | "fire" | "thana" | "custom")}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                >
                  <option value="thana">থানার পুলিশ / ওসি (Police OC)</option>
                  <option value="ambulance">অ্যাম্বুলেন্স (Ambulance)</option>
                  <option value="fire">ফায়ার সার্ভিস (Fire Station)</option>
                  <option value="custom">অন্যান্য ব্যক্তিগত (Doctor/Relative)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">শিরোনাম / পদবী *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মিরপুর থানা ওসি, এলাকার অ্যাম্বুলেন্স"
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">থানা / এলাকার নাম</label>
                <input
                  type="text"
                  placeholder="যেমন: ধানমন্ডি থানা, ঢাকা"
                  value={contactThana}
                  onChange={(e) => setContactThana(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition active:scale-95"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

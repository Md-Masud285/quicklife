import React, { useState } from 'react';
import { ShieldCheck, Heart, MapPin, Phone, User, CheckCircle2 } from 'lucide-react';
import type { BloodGroup } from '../types';
import { authService, type UserProfile } from '../services/authService';

interface CompleteProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  onCompleted: (updatedUser: UserProfile) => void;
  onSkip?: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BD_DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ',
  'কুমিল্লা', 'গাজীপুর', 'নারায়ণগঞ্জ', 'বগুড়া', 'দিনাজপুর', 'ফরিদপুর', 'যশোর', 'কুষ্টিয়া'
];

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  user,
  onCompleted,
  onSkip
}) => {
  const [name, setName] = useState(user.name || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>((user.bloodGroup as BloodGroup) || 'A+');
  const [phone, setPhone] = useState(user.phone || '');
  const [district, setDistrict] = useState(user.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(user.upazila || '');
  const [age, setAge] = useState('24');
  const [isDonor, setIsDonor] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const updated = authService.updateProfile({
        name: name.trim() || user.name,
        bloodGroup,
        phone: phone.trim(),
        district,
        upazila: upazila.trim(),
        isAvailableDonor: isDonor,
      });

      setIsLoading(false);
      if (updated) {
        onCompleted(updated);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fadeIn select-none" style={{ touchAction: 'none', overscrollBehavior: 'contain' }}>
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 m-auto" style={{ overscrollBehavior: 'contain' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                স্বাগতম QuickLife-এ
              </span>
              <h3 className="text-base font-bold text-white mt-1">আপনার প্রোফাইল সম্পূর্ণ করুন</h3>
              <p className="text-[11px] text-slate-400">রক্তদাতা ও জরুরি সেবার সুবিধা পেতে তথ্যগুলো দিন</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>আপনার পূর্ণ নাম:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: মোঃ সাকিব হোসেন"
                required
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>রক্তের গ্রুপ (Blood Group):</span>
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full bg-slate-950 text-rose-300 font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-rose-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>মোবাইল নম্বর:</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                required
                className="w-full bg-slate-950 text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">বয়স (Age):</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="65"
                placeholder="24"
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* District & Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>জেলা:</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {BD_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">উপজেলা / থানা:</label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="যেমন: ধানমন্ডি / মিরপুর"
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Available Blood Donor Checkbox */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-3">
            <input
              type="checkbox"
              id="donorCheck"
              checked={isDonor}
              onChange={(e) => setIsDonor(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="donorCheck" className="text-xs text-slate-200 cursor-pointer select-none">
              আমি স্বেচ্ছায় রক্তদানে প্রস্তুত এবং আমাকে রক্তদাতা তালিকায় যুক্ত করুন।
            </label>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'প্রোফাইল সেভ ও শুরু করুন'}</span>
            </button>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="w-full py-2 text-center text-[11px] text-slate-500 hover:text-slate-300 transition"
              >
                পরে পূরণ করব
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

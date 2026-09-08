import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Heart, LogOut, Check, Edit3 } from 'lucide-react';
import { authService, type UserProfile } from '../services/authService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  onLogout
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [bloodGroup, setBloodGroup] = useState(currentUser.bloodGroup || 'O+');
  const [district, setDistrict] = useState(currentUser.district || 'ঢাকা');
  const [upazila, setUpazila] = useState(currentUser.upazila || '');
  const [isAvailableDonor, setIsAvailableDonor] = useState(currentUser.isAvailableDonor ?? true);
  const [totalDonations, setTotalDonations] = useState(currentUser.totalDonations || 0);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = authService.updateProfile({
      name,
      bloodGroup,
      district,
      upazila,
      isAvailableDonor,
      totalDonations,
    });
    if (updated) {
      onProfileUpdated(updated);
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fadeIn select-none" style={{ touchAction: 'none', overscrollBehavior: 'contain' }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 m-auto" style={{ overscrollBehavior: 'contain' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{currentUser.phone || currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode */}
        {!isEditing ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-rose-600/40">
                  {currentUser.bloodGroup || 'O+'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">রক্তদাতা স্ট্যাটাস</div>
                  <div className="text-[11px] text-slate-300 flex items-center space-x-1 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${currentUser.isAvailableDonor ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                    <span>{currentUser.isAvailableDonor ? 'রক্ত দিতে প্রস্তুত (Available)' : 'বর্তমানে অনুপলব্ধ'}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] bg-slate-800 text-rose-300 px-2 py-1 rounded-xl border border-rose-500/20 font-bold">
                {currentUser.totalDonations || 0} বার দান
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>নাম:</span>
                </span>
                <span className="font-bold text-white">{currentUser.name}</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>মোবাইল:</span>
                </span>
                <span className="font-mono text-white">{currentUser.phone || 'যুক্ত করা হয়নি'}</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ইমেইল:</span>
                </span>
                <span className="font-mono text-white">{currentUser.email || 'যুক্ত করা হয়নি'}</span>
              </div>

              <div className="flex justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>জেলা / এলাকা:</span>
                </span>
                <span className="text-white font-semibold">
                  {currentUser.district ? `${currentUser.district} ${currentUser.upazila ? '(' + currentUser.upazila + ')' : ''}` : 'সিলেক্ট করা হয়নি'}
                </span>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-lg shadow-indigo-900/30"
              >
                <Edit3 className="w-4 h-4" />
                <span>প্রোফাইল এডিট করুন</span>
              </button>

              <button
                type="button"
                onClick={() => { onLogout(); onClose(); }}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-bold border border-slate-700 transition flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-300 block mb-1">পূর্ণ নাম:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">রক্তের গ্রুপ:</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500 font-bold"
                >
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">রক্ত দান করেছেন (বার):</label>
                <input
                  type="number"
                  min="0"
                  value={totalDonations}
                  onChange={(e) => setTotalDonations(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">জেলা:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="যেমন: ঢাকা"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">থানা / উপজেলা:</label>
                <input
                  type="text"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  placeholder="যেমন: ধানমন্ডি"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-300 font-bold flex items-center space-x-1.5">
                <Heart className="w-4 h-4 text-rose-500" />
                <span>রক্ত দিতে প্রস্তুত:</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAvailableDonor(!isAvailableDonor)}
                className={`text-xs px-3 py-1 rounded-full font-bold transition ${
                  isAvailableDonor ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-400'
                }`}
              >
                {isAvailableDonor ? '✓ হ্যাঁ (Available)' : 'না'}
              </button>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow"
              >
                <Check className="w-4 h-4" />
                <span>পরিবর্তন সেভ করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

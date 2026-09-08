import React, { useState } from 'react';
import { 
  Droplet, 
  Search, 
  PlusCircle, 
  Phone, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  X,
  UserCheck
} from 'lucide-react';
import type { BloodDonor, BloodGroup, SocialMediaType } from '../types';
import { BANGLADESH_LOCATIONS } from '../data/bangladeshData';
import { checkBloodDonationEligibility, formatBanglaNumber } from '../utils/dateHelper';
import { DynamicAdRenderer } from '../components/DynamicAdRenderer';
import type { UserProfile } from '../services/authService';

interface BloodHubViewProps {
  donors: BloodDonor[];
  myProfile: BloodDonor | null;
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
  onSaveMyProfile: (profile: BloodDonor) => void;
  onDeleteMyProfile: () => void;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BloodHubView: React.FC<BloodHubViewProps> = ({
  donors,
  myProfile,
  currentUser,
  onRequireLogin,
  onSaveMyProfile,
  onDeleteMyProfile,
}) => {
  // Search Filters
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedThana, setSelectedThana] = useState<string>('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');

  // Modal State for Donor Registration / Editing
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    age: string;
    phone: string;
    bloodGroup: BloodGroup;
    district: string;
    thana: string;
    socialType: SocialMediaType;
    socialLink: string;
    lastDonationDate: string;
    notes: string;
  }>({
    name: myProfile?.name || currentUser?.name || '',
    age: myProfile?.age ? myProfile.age.toString() : '24',
    phone: myProfile?.phone || currentUser?.phone || '',
    bloodGroup: (myProfile?.bloodGroup as BloodGroup) || (currentUser?.bloodGroup as BloodGroup) || 'A+',
    district: myProfile?.district || currentUser?.district || Object.keys(BANGLADESH_LOCATIONS)[0],
    thana: myProfile?.thana || currentUser?.upazila || BANGLADESH_LOCATIONS[Object.keys(BANGLADESH_LOCATIONS)[0]][0],
    socialType: myProfile?.socialType || 'facebook',
    socialLink: myProfile?.socialLink || '',
    lastDonationDate: myProfile?.lastDonationDate || '',
    notes: myProfile?.notes || ''
  });

  // Open modal for editing or new registration
  const handleOpenModal = () => {
    // Require real login first!
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (myProfile) {
      setFormData({
        name: myProfile.name,
        age: myProfile.age.toString(),
        phone: myProfile.phone,
        bloodGroup: myProfile.bloodGroup,
        district: myProfile.district,
        thana: myProfile.thana,
        socialType: myProfile.socialType,
        socialLink: myProfile.socialLink,
        lastDonationDate: myProfile.lastDonationDate,
        notes: myProfile.notes || ''
      });
    } else {
      setFormData({
        name: currentUser.name || '',
        age: '25',
        phone: currentUser.phone || '',
        bloodGroup: (currentUser.bloodGroup as BloodGroup) || 'O+',
        district: currentUser.district || Object.keys(BANGLADESH_LOCATIONS)[0],
        thana: currentUser.upazila || BANGLADESH_LOCATIONS[Object.keys(BANGLADESH_LOCATIONS)[0]][0],
        socialType: 'facebook',
        socialLink: '',
        lastDonationDate: currentUser.lastDonationDate || '',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    if (dist && BANGLADESH_LOCATIONS[dist]) {
      setSelectedThana(BANGLADESH_LOCATIONS[dist][0]);
    } else {
      setSelectedThana('');
    }
  };

  const handleFormDistrictChange = (dist: string) => {
    const thanas = BANGLADESH_LOCATIONS[dist] || [];
    setFormData(prev => ({
      ...prev,
      district: dist,
      thana: thanas[0] || ''
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.age) {
      alert('অনুগ্রহ করে নাম, বয়স ও ফোন নম্বর পূরণ করুন');
      return;
    }

    const updatedProfile: BloodDonor = {
      id: myProfile ? myProfile.id : (currentUser ? currentUser.id : 'user_donor_' + Date.now()),
      name: formData.name,
      age: parseInt(formData.age) || 25,
      phone: formData.phone,
      bloodGroup: formData.bloodGroup,
      district: formData.district,
      thana: formData.thana,
      socialType: formData.socialType,
      socialLink: formData.socialLink,
      lastDonationDate: formData.lastDonationDate,
      notes: formData.notes
    };


    onSaveMyProfile(updatedProfile);
    setIsModalOpen(false);
  };

  // Filter Donors (All are 100% Real Registered Donors)
  const filteredDonors = donors.filter(donor => {
    const matchDistrict = selectedDistrict ? donor.district === selectedDistrict : true;
    const matchThana = selectedThana ? donor.thana === selectedThana : true;
    const matchBlood = selectedBloodGroup ? donor.bloodGroup === selectedBloodGroup : true;
    return matchDistrict && matchThana && matchBlood;
  });

  return (
    <div className="space-y-4 text-left animate-fadeIn">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 p-5 text-white shadow-xl shadow-rose-900/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              জরুরি রক্ত সেবা
            </span>
            <h2 className="text-xl font-bold mt-1.5">রক্তদাতা সন্ধান ও ডোনার ক্লাব</h2>
            <p className="text-xs text-rose-100 mt-0.5">
              প্রকৃত রক্তদাতাদের তালিকা ও সরাসরি যোগাযোগের ঠিকানা
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
            <Droplet className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Dynamic Ad Placement */}
      <DynamicAdRenderer placement="blood" />

      {/* Donor Action / My Profile Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
        {myProfile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                {myProfile.bloodGroup}
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-bold text-white">{myProfile.name}</h4>
                  <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-800">
                    আমার প্রোফাইল
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {myProfile.district} • {myProfile.thana}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleOpenModal}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="এডিট করুন"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDeleteMyProfile}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-rose-400" />
                <span>আপনি কি রক্তদান করতে আগ্রহী?</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {currentUser ? 'আপনার নাম ও ঠিকানা দিয়ে ডোনার লিস্টে যোগ দিন।' : 'লগইন করে রক্তদাতা হিসেবে যুক্ত হোন।'}
              </p>
            </div>

            <button
              onClick={handleOpenModal}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 flex items-center space-x-1.5 shrink-0 active:scale-95 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{currentUser ? '+ ডোনার হন' : 'লগইন ও ডোনার'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Search Filter Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
            <Search className="w-3.5 h-3.5 text-rose-400" />
            <span>রক্তদাতা ফিল্টার করুন:</span>
          </label>
          {(selectedDistrict || selectedBloodGroup) && (
            <button
              onClick={() => { setSelectedDistrict(''); setSelectedThana(''); setSelectedBloodGroup(''); }}
              className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
            >
              ফিল্টার রিসেট
            </button>
          )}
        </div>

        {/* Blood Groups Selector */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {BLOOD_GROUPS.map(bg => (
            <button
              key={bg}
              onClick={() => setSelectedBloodGroup(selectedBloodGroup === bg ? '' : bg)}
              className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                selectedBloodGroup === bg
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40 scale-105'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>

        {/* District & Thana Selector */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">জেলা নির্বাচন:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs rounded-xl px-2.5 py-2 border border-slate-800 focus:outline-none focus:border-rose-500"
            >
              <option value="">সকল জেলা</option>
              {Object.keys(BANGLADESH_LOCATIONS).map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">থানা / উপজেলা:</label>
            <select
              value={selectedThana}
              onChange={(e) => setSelectedThana(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full bg-slate-950 text-white text-xs rounded-xl px-2.5 py-2 border border-slate-800 focus:outline-none focus:border-rose-500 disabled:opacity-50"
            >
              <option value="">সকল থানা</option>
              {selectedDistrict && BANGLADESH_LOCATIONS[selectedDistrict]?.map(th => (
                <option key={th} value={th}>{th}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Donors List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-300">
            রক্তদাতার তালিকা ({formatBanglaNumber(filteredDonors.length)} জন পাওয়া গেছে)
          </h3>
        </div>

        {filteredDonors.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">কোনো নিবন্ধিত রক্তদাতা পাওয়া যায়নি</p>
              <p className="text-[11px] text-slate-400 mt-1">
                এই জেলা বা গ্রুপে এখনো কোনো ইউজার ডোনার হিসেবে যোগ দেননি।
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow transition"
            >
              + আপনিই প্রথম রক্তদাতা হিসেবে যুক্ত হোন
            </button>
          </div>
        ) : (
          filteredDonors.map(donor => {
            const eligibility = checkBloodDonationEligibility(donor.lastDonationDate);
            return (
              <div
                key={donor.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-rose-600/30 shrink-0">
                    {donor.bloodGroup}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs font-bold text-white">{donor.name}</h4>
                      <span className="text-[10px] text-slate-400">({formatBanglaNumber(donor.age)} বছর)</span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{donor.district}, {donor.thana}</span>
                    </div>

                    {/* Eligibility Badge */}
                    <div className="mt-1">
                      {eligibility.isEligible ? (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-semibold inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>রক্তদানে প্রস্তুত</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded inline-flex items-center space-x-1">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                          <span>{eligibility.daysRemaining} দিন পর দিতে পারবেন</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call / WhatsApp Actions */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <a
                    href={`tel:${donor.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow transition flex items-center justify-center"
                    title="কল করুন"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {donor.socialLink && (
                    <a
                      href={donor.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow transition flex items-center justify-center"
                      title="সোশ্যাল লিংক"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Registration / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold text-white">
                  {myProfile ? 'ডোনার প্রোফাইল এডিট করুন' : 'রক্তদাতা হিসেবে নিবন্ধন'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">আপনার পূর্ণ নাম:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="যেমন: মোঃ তামিম ইকবাল"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">রক্তের গ্রুপ:</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-rose-500 font-bold"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">বয়স (বছর):</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    required
                    placeholder="যেমন: ২৫"
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">মোবাইল নম্বর (যোগাযোগের জন্য):</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">জেলা:</label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleFormDistrictChange(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-rose-500"
                  >
                    {Object.keys(BANGLADESH_LOCATIONS).map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">থানা / উপজেলা:</label>
                  <select
                    value={formData.thana}
                    onChange={(e) => setFormData(prev => ({ ...prev, thana: e.target.value }))}
                    className="w-full bg-slate-950 text-white text-xs rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-rose-500"
                  >
                    {BANGLADESH_LOCATIONS[formData.district]?.map(th => (
                      <option key={th} value={th}>{th}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">সর্বশেষ রক্তদানের তারিখ (যদি দিয়ে থাকেন):</label>
                <input
                  type="date"
                  value={formData.lastDonationDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastDonationDate: e.target.value }))}
                  className="w-full bg-slate-950 text-white text-xs rounded-xl px-3 py-2 border border-slate-700 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
                >
                  {myProfile ? '✓ পরিবর্তন সেভ করুন' : '✓ রক্তদাতা হিসেবে পাবলিশ করুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { githubSyncService } from './services/githubSyncService';
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import type { ActiveTab } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { BloodHubView } from './views/BloodHubView';
import { HealthAlarmView } from './views/HealthAlarmView';
import { StudyHubView } from './views/StudyHubView';
import { AiToolsView } from './views/AiToolsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { EmergencyModal } from './components/EmergencyModal';
import { AuthModal } from './components/AuthModal';
import { CompleteProfileModal } from './components/CompleteProfileModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import type { BloodDonor, PersonalEmergencyContact, MedicineReminder } from './types';
import { 
  getSavedBloodDonors, 
  saveBloodDonors, 
  getMyDonorProfile, 
  setMyDonorProfile, 
  getPersonalEmergencyContacts, 
  savePersonalEmergencyContacts, 
  getMedicineReminders, 
  saveMedicineReminders 
} from './utils/storage';
import { authService, type UserProfile } from './services/authService';
import { alarmSoundManager } from './utils/audioAlarm';
import { BellRing, Square } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // User Auth & Modals
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isCompleteProfileModalOpen, setIsCompleteProfileModalOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminViewOpen, setIsAdminViewOpen] = useState<boolean>(false);


  // Core Data States
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [myProfile, setMyProfileState] = useState<BloodDonor | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<PersonalEmergencyContact[]>([]);
  const [medicines, setMedicines] = useState<MedicineReminder[]>([]);

  // Active Ringing Alarm Notification state
  const [ringingMedicine, setRingingMedicine] = useState<MedicineReminder | null>(null);

  // Load Initial Data & Persistent User & Cloud Sync
  useEffect(() => {
    githubSyncService.pullFromCloud();
    setCurrentUser(authService.getCurrentUser());
    setDonors(getSavedBloodDonors());
    setMyProfileState(getMyDonorProfile());
    setEmergencyContacts(getPersonalEmergencyContacts());
    setMedicines(getMedicineReminders());

    const handleCloudSync = () => {
      setDonors(getSavedBloodDonors());
      setMyProfileState(getMyDonorProfile());
      setCurrentUser(authService.getCurrentUser());
    };

    window.addEventListener('ql_cloud_data_synced', handleCloudSync);

    // Real-time Cloud Sync on App Open, Visibility Change & Focus
    const handleFocusSync = () => {
      githubSyncService.pullFromCloud();
    };

    window.addEventListener('focus', handleFocusSync);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        githubSyncService.pullFromCloud();
      }
    });

    // Periodic Background Cloud Sync (Every 20 seconds)
    const syncInterval = setInterval(() => {
      githubSyncService.pullFromCloud();
    }, 20000);

    return () => {
      window.removeEventListener('ql_cloud_data_synced', handleCloudSync);
      window.removeEventListener('focus', handleFocusSync);
      clearInterval(syncInterval);
    };
  }, []);

  // Background Alarm Clock Checker (Runs every second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const currentSeconds = now.getSeconds();

      if (currentSeconds === 0) {
        const match = medicines.find(m => {
          if (!m.isEnabled) return false;
          const allTimes = m.times && m.times.length > 0 ? m.times : (m.time ? [m.time] : []);
          return allTimes.includes(currentTimeStr);
        });
        if (match && !ringingMedicine) {
          setRingingMedicine(match);
          const mode = match.soundMode ?? ((match as any).soundType === 'custom' ? 'custom' : 'default');
          if (mode === 'voice') {
            alarmSoundManager.playVoiceAlarm(
              match.medicineName,
              match.dosage,
              match.mealTime,
              'bn',
              match.voiceNote
            );
          } else if (mode === 'custom' && match.customAudioData) {
            alarmSoundManager.playCustomAudio(match.customAudioData);
          } else {
            alarmSoundManager.playDefaultAlarm();
          }
        }
      }

    }, 1000);

    return () => clearInterval(timer);
  }, [medicines, ringingMedicine]);

  // Stop Ringing Alarm
  const handleDismissAlarm = () => {
    alarmSoundManager.stopAlarm();
    setRingingMedicine(null);
  };

  // Handlers for Blood Donors
  const handleSaveMyProfile = (profile: BloodDonor) => {
    setMyProfileState(profile);
    setMyDonorProfile(profile);

    const updated = donors.filter(d => d.id !== profile.id && d.phone !== profile.phone);
    const newList = [profile, ...updated];
    setDonors(newList);
    saveBloodDonors(newList);

    if (currentUser) {
      const updatedUser = authService.updateProfile({
        name: profile.name,
        phone: profile.phone,
        bloodGroup: profile.bloodGroup,
        district: profile.district,
        upazila: profile.thana,
        isAvailableDonor: true,
        lastDonationDate: profile.lastDonationDate,
      });
      if (updatedUser) setCurrentUser(updatedUser);
    }
  };

  const handleDeleteMyProfile = () => {
    if (myProfile) {
      const updated = donors.filter(d => d.id !== myProfile.id && d.phone !== myProfile.phone);
      setDonors(updated);
      saveBloodDonors(updated);
    }
    setMyProfileState(null);
    setMyDonorProfile(null);

    if (currentUser) {
      const updatedUser = authService.updateProfile({
        isAvailableDonor: false,
      });
      if (updatedUser) setCurrentUser(updatedUser);
    }
  };

  // Handlers for Emergency Contacts
  const handleSaveEmergencyContacts = (contacts: PersonalEmergencyContact[]) => {
    setEmergencyContacts(contacts);
    savePersonalEmergencyContacts(contacts);
  };

  // Handlers for Medicines
  const handleSaveMedicines = (list: MedicineReminder[]) => {
    setMedicines(list);
    saveMedicineReminders(list);
  };

  // Auth Callbacks
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setIsAdminViewOpen(true);
    }
  };

  const handleAdminLoginSuccess = (adminUser: UserProfile) => {
    setCurrentUser(adminUser);
    setIsAdminViewOpen(true);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAdminViewOpen(false);
  };

  return (
    <div className="h-screen h-[100dvh] w-full bg-slate-950 text-slate-100 overflow-hidden flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-slate-950 border-x border-slate-800/80 shadow-2xl relative h-full overflow-hidden">
        
        {/* Fixed Top Header (Takes exact height, never overlaps content) */}
        <header className="shrink-0 z-40 bg-slate-950">
          <Navbar
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
          />
        </header>

        {/* Live Ringing Alarm Notification Overlay Banner */}
        {ringingMedicine && (
          <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto animate-bounce">
            <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-4 text-white shadow-2xl border-2 border-white/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <BellRing className="w-6 h-6 text-white animate-spin" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                    ওষুধ খাওয়ার অ্যালার্ম বাজছে!
                  </div>
                  <div className="text-sm font-black">{ringingMedicine.medicineName}</div>
                  <div className="text-xs text-rose-100">
                    {ringingMedicine.dosage} • {ringingMedicine.times && ringingMedicine.times.length > 0 ? ringingMedicine.times.join(', ') : (ringingMedicine.time || '')}
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismissAlarm}
                className="bg-white text-rose-700 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-black shadow-lg flex items-center space-x-1 active:scale-95 transition"
              >
                <Square className="w-3.5 h-3.5 fill-rose-700" />
                <span>অ্যালার্ম বন্ধ</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area based on Active Tab or Admin View */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-8 text-left">
          {isAdminViewOpen ? (
            <AdminDashboardView onBackToApp={() => setIsAdminViewOpen(false)} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  setActiveTab={setActiveTab}
                  medicines={medicines}
                  onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                  donorsCount={donors.length}
                />
              )}

              {activeTab === 'blood' && (
                <BloodHubView
                  donors={donors}
                  myProfile={myProfile}
                  currentUser={currentUser}
                  onRequireLogin={() => setIsAuthModalOpen(true)}
                  onSaveMyProfile={handleSaveMyProfile}
                  onDeleteMyProfile={handleDeleteMyProfile}
                />
              )}

              {activeTab === 'health' && (
                <HealthAlarmView
                  medicines={medicines}
                  onSaveMedicines={handleSaveMedicines}
                  emergencyContacts={emergencyContacts}
                  onSaveEmergencyContacts={handleSaveEmergencyContacts}
                  currentUser={currentUser}
                  onRequireLogin={() => setIsAuthModalOpen(true)}
                />
              )}


              {activeTab === 'study' && <StudyHubView currentUser={currentUser} onRequireLogin={() => setIsAuthModalOpen(true)} />}

              {activeTab === 'tools' && <AiToolsView currentUser={currentUser} onRequireLogin={() => setIsAuthModalOpen(true)} />}
            </>
          )}
        </main>

        {/* Fixed Bottom Navigation Dock (Always visible, elevated above system buttons) */}
        {!isAdminViewOpen && (
          <footer className="shrink-0 z-40 bg-slate-950">
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </footer>
        )}

        {/* Modals */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          personalContacts={emergencyContacts}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />


        {currentUser && (
          <CompleteProfileModal
            isOpen={isCompleteProfileModalOpen}
            user={currentUser as any}
            onCompleted={(updated) => {
              setCurrentUser(updated);
              setIsCompleteProfileModalOpen(false);

              if (updated.isAvailableDonor && updated.bloodGroup) {
                const donorEntry: BloodDonor = {
                  id: updated.id,
                  name: updated.name,
                  age: 25,
                  phone: updated.phone || '',
                  bloodGroup: updated.bloodGroup as any,
                  district: updated.district || 'ঢাকা',
                  thana: updated.upazila || 'গুলশান',
                  socialType: 'facebook',
                  socialLink: '',
                  lastDonationDate: updated.lastDonationDate || '',
                  notes: 'QuickLife রেজিস্টার্ড রক্তদাতা'
                };
                handleSaveMyProfile(donorEntry);
              }
            }}
            onSkip={() => setIsCompleteProfileModalOpen(false)}
          />
        )}

        {currentUser && (
          <UserProfileModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            currentUser={currentUser}
            onProfileUpdated={(updated) => {
              setCurrentUser(updated);
              if (updated.isAvailableDonor && updated.bloodGroup) {
                const donorEntry: BloodDonor = {
                  id: updated.id,
                  name: updated.name,
                  age: myProfile?.age || 25,
                  phone: updated.phone || myProfile?.phone || '',
                  bloodGroup: updated.bloodGroup as any,
                  district: updated.district || 'ঢাকা',
                  thana: updated.upazila || 'গুলশান',
                  socialType: myProfile?.socialType || 'facebook',
                  socialLink: myProfile?.socialLink || '',
                  lastDonationDate: updated.lastDonationDate || '',
                  notes: myProfile?.notes || 'QuickLife রেজিস্টার্ড রক্তদাতা'
                };
                handleSaveMyProfile(donorEntry);
              } else if (!updated.isAvailableDonor && myProfile) {
                handleDeleteMyProfile();
              }
            }}
            onLogout={handleLogout}
          />
        )}

        <AdminLoginModal
          isOpen={isAdminLoginModalOpen}
          onClose={() => setIsAdminLoginModalOpen(false)}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      </div>
    </div>
  );
};

export default App;

// Web Audio API chime synthesizer + Mobile-First Native System Voice Engine (Offline & Online)

class AlarmSoundManager {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isRinging: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private alarmInterval: any = null;
  private vibrationInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up system voices for Mobile & Desktop
      try {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      } catch {
        // ignore
      }
    }
  }

  public initContext() {
    try {
      if (!this.audioCtx && typeof window !== 'undefined') {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  public startContinuousVibration() {
    this.stopContinuousVibration();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      const vib = () => {
        try {
          navigator.vibrate([800, 300, 800, 300, 1000]);
        } catch {
          // ignore
        }
      };
      vib();
      this.vibrationInterval = setInterval(vib, 2800);
    }
  }

  public stopContinuousVibration() {
    if (this.vibrationInterval) {
      clearInterval(this.vibrationInterval);
      this.vibrationInterval = null;
    }
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(0);
      } catch {
        // ignore
      }
    }
  }

  // Play synthetic gentle/strong medical chime with immediate 0ms start & continuous loop
  public playDefaultAlarm(): () => void {
    this.stopAlarm();
    this.initContext();
    this.isRinging = true;
    this.startContinuousVibration();

    const playTone = (freq: number, startTime: number, duration: number) => {
      if (!this.audioCtx) return;
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch (e) {
        console.warn('Oscillator tone error:', e);
      }
    };

    const triggerChime = () => {
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      const now = this.audioCtx.currentTime;
      playTone(523.25, now, 0.35); // C5
      playTone(659.25, now + 0.12, 0.35); // E5
      playTone(783.99, now + 0.25, 0.55); // G5
      playTone(1046.50, now + 0.45, 0.65); // C6
    };

    // Immediate first chime!
    triggerChime();

    // Repeat every 1.5 seconds continuously until stopped
    this.alarmInterval = setInterval(() => {
      if (!this.isRinging) {
        clearInterval(this.alarmInterval);
        return;
      }
      triggerChime();
    }, 1500);

    return () => this.stopAlarm();
  }

  // Play user custom audio file
  public playCustomAudio(audioSource: string): () => void {
    this.stopAlarm();
    this.startContinuousVibration();
    try {
      this.currentAudio = new Audio(audioSource);
      this.currentAudio.loop = true;
      this.currentAudio.play().catch(() => this.playDefaultAlarm());
      return () => this.stopAlarm();
    } catch {
      return this.playDefaultAlarm();
    }
  }

  /**
   * Find available authentic native Bangla / English voice on Mobile (Google TTS) or Desktop
   */
  private getNativeVoice(lang: 'bn' | 'en'): SpeechSynthesisVoice | null {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'bn') {
      return (
        voices.find(
          (v) =>
            v.lang.toLowerCase() === 'bn-bd' ||
            v.lang.toLowerCase() === 'bn_bd' ||
            v.lang.toLowerCase().startsWith('bn') ||
            v.name.includes('বাংলা') ||
            v.name.toLowerCase().includes('bangla') ||
            v.name.toLowerCase().includes('bengali')
        ) || null
      );
    } else {
      return (
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Female') ||
              v.name.includes('Zira') ||
              v.name.includes('Samantha') ||
              v.name.includes('Google UK English Female') ||
              v.name.includes('Jenny') ||
              v.name.includes('Google US English'))
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        null
      );
    }
  }

  /**
   * Online high-clarity Bengali / English audio stream
   */
  private playOnlineAudioStream(text: string, lang: 'bn' | 'en'): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const langCode = lang === 'bn' ? 'bn' : 'en';
        const cleanText = encodeURIComponent(text.trim().slice(0, 350));
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=${langCode}&q=${cleanText}`;

        const audio = new Audio();
        audio.setAttribute('referrerpolicy', 'no-referrer');
        audio.src = url;
        audio.volume = 1.0;
        this.currentAudio = audio;

        audio.onended = () => {
          this.currentAudio = null;
          resolve(true);
        };

        audio.onerror = () => {
          resolve(false);
        };

        audio.play().catch(() => {
          resolve(false);
        });
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Universal Speech Method
   */
  public speakText(text: string, lang: 'bn' | 'en' = 'bn'): () => void {
    if (!text || !text.trim()) return () => {};
    let cancelled = false;

    const nativeVoice = this.getNativeVoice(lang);

    if (nativeVoice && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = nativeVoice;
        utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        return () => {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          this.currentUtterance = null;
        };
      } catch {
        // fallback
      }
    }

    this.playOnlineAudioStream(text, lang).then((success) => {
      if (cancelled) return;
      if (!success && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
          utterance.rate = 0.9;
          this.currentUtterance = utterance;
          window.speechSynthesis.speak(utterance);
        } catch {
          // ignore
        }
      }
    });

    return () => {
      cancelled = true;
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      this.currentUtterance = null;
    };
  }

  /**
   * Smart Voice Alarm - plays attention chime continuously and speaks announcement
   */
  public playVoiceAlarm(
    medicineName: string,
    dosage: string,
    mealTime: 'before' | 'after' | 'with',
    lang: 'bn' | 'en' = 'bn',
    voiceNote?: string
  ): () => void {
    this.stopAlarm();
    this.isRinging = true;
    this.startContinuousVibration();

    const mealMap = {
      bn: { before: 'খাওয়ার আগে', after: 'খাওয়ার পরে', with: 'খাবারের সাথে' },
      en: { before: 'before meals', after: 'after meals', with: 'with food' },
    };
    const mealText = mealMap[lang][mealTime] || 'খাওয়ার পরে';
    let announcement: string;

    if (lang === 'bn') {
      announcement = `আপনার ${medicineName} খাওয়ার সময় হয়েছে। ${dosage || '১ ডোজ'} ${mealText} নিন।`;
      if (voiceNote && voiceNote.trim()) announcement += ` ${voiceNote.trim()}`;
    } else {
      announcement = `It is time to take your ${medicineName}. Please take ${dosage || '1 dose'} ${mealText}.`;
      if (voiceNote && voiceNote.trim()) announcement += ` ${voiceNote.trim()}`;
    }

    // Always start continuous chime loop in background
    this.playDefaultAlarm();

    // Speak voice instruction
    const stopSpeak = this.speakText(announcement, lang);

    return () => {
      stopSpeak();
      this.stopAlarm();
    };
  }

  /** Preview voice for modal Test Sound button */
  public previewVoice(
    medicineName: string,
    dosage: string,
    mealTime: 'before' | 'after' | 'with',
    lang: 'bn' | 'en' = 'bn',
    voiceNote?: string
  ): () => void {
    return this.playVoiceAlarm(medicineName, dosage, mealTime, lang, voiceNote);
  }

  public stopAlarm() {
    this.isRinging = false;
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    this.stopContinuousVibration();

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const alarmSoundManager = new AlarmSoundManager();

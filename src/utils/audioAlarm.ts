// Web Audio API chime synthesizer + Mobile-First Native System Voice Engine (Offline & Online)

class AlarmSoundManager {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isRinging: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

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

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play synthetic gentle medical chime
  public playDefaultAlarm(): () => void {
    this.stopAlarm();
    this.initContext();
    if (!this.audioCtx) return () => {};

    this.isRinging = true;
    const ctx = this.audioCtx;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const interval = setInterval(() => {
      if (!this.isRinging) { clearInterval(interval); return; }
      const now = ctx.currentTime;
      playTone(523.25, now, 0.4);
      playTone(659.25, now + 0.15, 0.4);
      playTone(783.99, now + 0.3, 0.6);
    }, 1500);

    return () => { this.isRinging = false; clearInterval(interval); };
  }

  // Play user custom audio file
  public playCustomAudio(audioSource: string): () => void {
    this.stopAlarm();
    try {
      this.currentAudio = new Audio(audioSource);
      this.currentAudio.loop = true;
      this.currentAudio.play().catch(() => this.playDefaultAlarm());
      return () => {
        if (this.currentAudio) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          this.currentAudio = null;
        }
      };
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
      // 1. Exact Bangla language match (Android Google বাংলা, bn-BD, bn_BD, bn-IN)
      return voices.find(v => 
        v.lang.toLowerCase() === 'bn-bd' ||
        v.lang.toLowerCase() === 'bn_bd' ||
        v.lang.toLowerCase().startsWith('bn') ||
        v.name.includes('বাংলা') ||
        v.name.toLowerCase().includes('bangla') ||
        v.name.toLowerCase().includes('bengali')
      ) || null;
    } else {
      return voices.find(v => 
        v.lang.startsWith('en') && (
          v.name.includes('Female') || 
          v.name.includes('Zira') || 
          v.name.includes('Samantha') || 
          v.name.includes('Google UK English Female') || 
          v.name.includes('Jenny') || 
          v.name.includes('Google US English')
        )
      ) || voices.find(v => v.lang.startsWith('en')) || null;
    }
  }

  /**
   * Online high-clarity Bengali / English audio stream (Used for Desktop when OS lacks Bangla pack)
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

        audio.play().then(() => {
          // playing successfully
        }).catch(() => {
          resolve(false);
        });
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Universal Speech Method: 
   * - On Mobile: Uses System SpeechSynthesis with Google বাংলা (100% Offline & Online).
   * - On Desktop: Uses Native voice if installed, or pristine Bengali audio stream.
   */
  public speakText(text: string, lang: 'bn' | 'en' = 'bn'): () => void {
    this.stopAlarm();
    if (!text || !text.trim()) return () => {};
    // Start gentle alert chime as backdrop
    const stopChime = this.playDefaultAlarm();

    let cancelled = false;

    // Check if device has native voice (like on Android phones / iPhones / Windows with Bangla pack)
    const nativeVoice = this.getNativeVoice(lang);

    if (nativeVoice && 'speechSynthesis' in window) {
      // 1. Mobile System Voice (100% Offline native voice)
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = nativeVoice;
        utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
        utterance.rate = 0.88; // Clear natural pace
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);

        return () => {
          stopChime();
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          this.currentUtterance = null;
        };
      } catch {
        // fallback to stream
      }
    }

    // 2. Online Audio Stream (For Laptop / Desktop testing without Bangla pack)
    this.playOnlineAudioStream(text, lang).then((success) => {
      if (cancelled) return;
      if (!success && 'speechSynthesis' in window) {
        // Fallback to system synthesis
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
      stopChime();
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
   * Smart Voice Alarm - plays attention chime first, then speaks EXACT medicine instructions in pure Bengali or English.
   */
  public playVoiceAlarm(
    medicineName: string,
    dosage: string,
    mealTime: 'before' | 'after' | 'with',
    lang: 'bn' | 'en' = 'bn',
    voiceNote?: string
  ): () => void {
    this.stopAlarm();

    const mealMap = {
      bn: { before: 'খাওয়ার আগে', after: 'খাওয়ার পরে', with: 'খাবারের সাথে' },
      en: { before: 'before meals', after: 'after meals', with: 'with food' },
    };
    const mealText = mealMap[lang][mealTime];
    let announcement: string;

    if (lang === 'bn') {
      announcement = `আপনার ${medicineName} খাওয়ার সময় হয়েছে। ${dosage} ${mealText} নিন।`;
      if (voiceNote && voiceNote.trim()) announcement += ` ${voiceNote.trim()}`;
    } else {
      announcement = `It is time to take your ${medicineName}. Please take ${dosage} ${mealText}.`;
      if (voiceNote && voiceNote.trim()) announcement += ` ${voiceNote.trim()}`;
    }

    // Melodic attention chime before speech (Web Audio API - 100% offline)
    this.initContext();
    if (this.audioCtx) {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const playChime = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      };
      playChime(880, now, 0.25);
      playChime(1046.5, now + 0.15, 0.25);
      playChime(1318.5, now + 0.3, 0.4);
    }

    // Speak after 700ms so chime finishes cleanly first
    let stopSpeakFn: (() => void) | null = null;
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (cancelled) return;
      stopSpeakFn = this.speakText(announcement, lang);
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      if (stopSpeakFn) stopSpeakFn();
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
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (this.currentUtterance && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }
}

export const alarmSoundManager = new AlarmSoundManager();

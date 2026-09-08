// Dynamic Study Formulas Management Service
import type { StudyFormula } from '../types';
import { STUDY_FORMULAS as DEFAULT_STUDY_FORMULAS } from '../data/studyData';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY_FORMULAS = 'quicklife_study_formulas_v2';

class StudyFormulaService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY_FORMULAS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_FORMULAS, JSON.stringify(DEFAULT_STUDY_FORMULAS));
    }
  }

  public getAllFormulas(): StudyFormula[] {
    if (typeof window === 'undefined') return DEFAULT_STUDY_FORMULAS;
    const stored = localStorage.getItem(STORAGE_KEY_FORMULAS);
    if (!stored) return DEFAULT_STUDY_FORMULAS;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return DEFAULT_STUDY_FORMULAS;
    } catch {
      return DEFAULT_STUDY_FORMULAS;
    }
  }

  private saveFormulas(formulas: StudyFormula[], triggerCloudSync: boolean = true) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_FORMULAS, JSON.stringify(formulas));
    if (triggerCloudSync) {
      setTimeout(() => githubSyncService.pushToCloud(), 100);
    }
  }

  // Add new formula
  public addFormula(formula: Omit<StudyFormula, 'id'>): StudyFormula {
    const newFormula: StudyFormula = {
      ...formula,
      id: 'custom_formula_' + Date.now(),
    };
    const list = this.getAllFormulas();
    list.unshift(newFormula);
    this.saveFormulas(list, true);
    return newFormula;
  }

  // Update existing formula
  public updateFormula(id: string, updates: Partial<StudyFormula>): StudyFormula | null {
    const list = this.getAllFormulas();
    const index = list.findIndex(f => f.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.saveFormulas(list, true);
    return list[index];
  }

  // Delete formula
  public deleteFormula(id: string): boolean {
    let list = this.getAllFormulas();
    const initialLen = list.length;
    list = list.filter(f => f.id !== id);
    if (list.length !== initialLen) {
      this.saveFormulas(list, true);
      return true;
    }
    return false;
  }

  // Reset to default
  public resetToDefault(): StudyFormula[] {
    this.saveFormulas(DEFAULT_STUDY_FORMULAS, true);
    return DEFAULT_STUDY_FORMULAS;
  }
}

export const studyFormulaService = new StudyFormulaService();

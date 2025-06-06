
import { ExcelTeacher, ExcelFixedSlot, ExcelSubjectMapping } from './excelParser';
import { GeneratedTimetable } from './timetableGenerator';

const STORAGE_KEYS = {
  TEACHERS: 'timetable_teachers',
  FIXED_SLOTS: 'timetable_fixed_slots',
  SUBJECT_MAPPINGS: 'timetable_subject_mappings',
  GENERATED_TIMETABLE: 'timetable_generated',
  LAST_GENERATION: 'timetable_last_generation'
};

export class DataStorage {
  static saveTeachers(teachers: ExcelTeacher[]): void {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }

  static getTeachers(): ExcelTeacher[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return data ? JSON.parse(data) : [];
  }

  static saveFixedSlots(fixedSlots: ExcelFixedSlot[]): void {
    localStorage.setItem(STORAGE_KEYS.FIXED_SLOTS, JSON.stringify(fixedSlots));
  }

  static getFixedSlots(): ExcelFixedSlot[] {
    const data = localStorage.getItem(STORAGE_KEYS.FIXED_SLOTS);
    return data ? JSON.parse(data) : [];
  }

  static saveSubjectMappings(mappings: ExcelSubjectMapping[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECT_MAPPINGS, JSON.stringify(mappings));
  }

  static getSubjectMappings(): ExcelSubjectMapping[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECT_MAPPINGS);
    return data ? JSON.parse(data) : [];
  }

  static saveGeneratedTimetable(timetable: GeneratedTimetable): void {
    localStorage.setItem(STORAGE_KEYS.GENERATED_TIMETABLE, JSON.stringify(timetable));
    localStorage.setItem(STORAGE_KEYS.LAST_GENERATION, new Date().toISOString());
  }

  static getGeneratedTimetable(): GeneratedTimetable | null {
    const data = localStorage.getItem(STORAGE_KEYS.GENERATED_TIMETABLE);
    return data ? JSON.parse(data) : null;
  }

  static getLastGenerationTime(): Date | null {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_GENERATION);
    return data ? new Date(data) : null;
  }

  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): string {
    const data = {
      teachers: this.getTeachers(),
      fixedSlots: this.getFixedSlots(),
      subjectMappings: this.getSubjectMappings(),
      generatedTimetable: this.getGeneratedTimetable(),
      lastGeneration: this.getLastGenerationTime()
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.teachers) this.saveTeachers(data.teachers);
      if (data.fixedSlots) this.saveFixedSlots(data.fixedSlots);
      if (data.subjectMappings) this.saveSubjectMappings(data.subjectMappings);
      if (data.generatedTimetable) this.saveGeneratedTimetable(data.generatedTimetable);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataStorage } from '@/utils/dataStorage';
import { ExcelTeacher, ExcelFixedSlot, ExcelSubjectMapping } from '@/utils/excelParser';
import { GeneratedTimetable } from '@/utils/timetableGenerator';

export interface FixedSlot {
  department: string;
  subject: string;
  faculty: string;
  day: string;
  time: string;
  room: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  availability: string[];
}

export interface SubjectAssignment {
  subject: string;
  assignedTeachers: string[];
}

export interface TimetableStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  path: string;
}

interface TimetableContextType {
  currentStep: number;
  steps: TimetableStep[];
  fixedSlots: FixedSlot[];
  teachers: Teacher[];
  subjectAssignments: SubjectAssignment[];
  excelTeachers: ExcelTeacher[];
  excelFixedSlots: ExcelFixedSlot[];
  excelSubjectMappings: ExcelSubjectMapping[];
  generatedTimetable: GeneratedTimetable | null;
  isGenerating: boolean;
  setCurrentStep: (step: number) => void;
  setFixedSlots: (slots: FixedSlot[]) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setSubjectAssignments: (assignments: SubjectAssignment[]) => void;
  setExcelTeachers: (teachers: ExcelTeacher[]) => void;
  setExcelFixedSlots: (slots: ExcelFixedSlot[]) => void;
  setExcelSubjectMappings: (mappings: ExcelSubjectMapping[]) => void;
  setGeneratedTimetable: (timetable: GeneratedTimetable) => void;
  setIsGenerating: (generating: boolean) => void;
  markStepCompleted: (stepIndex: number) => void;
  canProceedToStep: (stepIndex: number) => boolean;
  clearAllData: () => void;
}

const TimetableContext = createContext<TimetableContextType | undefined>(undefined);

export const useTimetable = () => {
  const context = useContext(TimetableContext);
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider');
  }
  return context;
};

interface TimetableProviderProps {
  children: ReactNode;
}

export const TimetableProvider = ({ children }: TimetableProviderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fixedSlots, setFixedSlots] = useState<FixedSlot[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>([]);
  const [excelTeachers, setExcelTeachers] = useState<ExcelTeacher[]>([]);
  const [excelFixedSlots, setExcelFixedSlots] = useState<ExcelFixedSlot[]>([]);
  const [excelSubjectMappings, setExcelSubjectMappings] = useState<ExcelSubjectMapping[]>([]);
  const [generatedTimetable, setGeneratedTimetable] = useState<GeneratedTimetable | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [steps, setSteps] = useState<TimetableStep[]>([
    {
      id: 'upload-slots',
      title: 'Upload Fixed Slots',
      description: 'Import pre-decided class schedules',
      completed: false,
      path: '/upload-slots'
    },
    {
      id: 'select-teachers',
      title: 'Upload Teachers',
      description: 'Import teacher data and availability',
      completed: false,
      path: '/select-teachers'
    },
    {
      id: 'view-slots',
      title: 'Upload Subject Mappings',
      description: 'Import subject-class mappings',
      completed: false,
      path: '/view-slots'
    },
    {
      id: 'map-faculty',
      title: 'Review Data',
      description: 'Review all uploaded data',
      completed: false,
      path: '/map-faculty'
    },
    {
      id: 'generate-timetable',
      title: 'Generate Timetable',
      description: 'Create final schedule',
      completed: false,
      path: '/generate-timetable'
    },
    {
      id: 'view-timetable',
      title: 'View & Download',
      description: 'Export final timetables',
      completed: false,
      path: '/view-timetable'
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTeachers = DataStorage.getTeachers();
    const storedFixedSlots = DataStorage.getFixedSlots();
    const storedSubjectMappings = DataStorage.getSubjectMappings();
    const storedTimetable = DataStorage.getGeneratedTimetable();

    if (storedTeachers.length > 0) {
      setExcelTeachers(storedTeachers);
    }
    if (storedFixedSlots.length > 0) {
      setExcelFixedSlots(storedFixedSlots);
      // Convert to legacy format for compatibility
      const legacySlots: FixedSlot[] = storedFixedSlots.map(slot => ({
        department: slot.department,
        subject: slot.subject,
        faculty: slot.faculty,
        day: slot.day,
        time: slot.time,
        room: slot.room
      }));
      setFixedSlots(legacySlots);
    }
    if (storedSubjectMappings.length > 0) {
      setExcelSubjectMappings(storedSubjectMappings);
    }
    if (storedTimetable) {
      setGeneratedTimetable(storedTimetable);
    }
  }, []);

  const markStepCompleted = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const canProceedToStep = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    return steps[stepIndex - 1]?.completed || false;
  };

  const clearAllData = () => {
    DataStorage.clearAllData();
    setFixedSlots([]);
    setTeachers([]);
    setSubjectAssignments([]);
    setExcelTeachers([]);
    setExcelFixedSlots([]);
    setExcelSubjectMappings([]);
    setGeneratedTimetable(null);
    setIsGenerating(false);
    setCurrentStep(0);
    setSteps(prev => prev.map(step => ({ ...step, completed: false })));
  };

  // Auto-save data when it changes
  useEffect(() => {
    if (excelTeachers.length > 0) {
      DataStorage.saveTeachers(excelTeachers);
    }
  }, [excelTeachers]);

  useEffect(() => {
    if (excelFixedSlots.length > 0) {
      DataStorage.saveFixedSlots(excelFixedSlots);
    }
  }, [excelFixedSlots]);

  useEffect(() => {
    if (excelSubjectMappings.length > 0) {
      DataStorage.saveSubjectMappings(excelSubjectMappings);
    }
  }, [excelSubjectMappings]);

  useEffect(() => {
    if (generatedTimetable) {
      DataStorage.saveGeneratedTimetable(generatedTimetable);
    }
  }, [generatedTimetable]);

  return (
    <TimetableContext.Provider value={{
      currentStep,
      steps,
      fixedSlots,
      teachers,
      subjectAssignments,
      excelTeachers,
      excelFixedSlots,
      excelSubjectMappings,
      generatedTimetable,
      isGenerating,
      setCurrentStep,
      setFixedSlots,
      setTeachers,
      setSubjectAssignments,
      setExcelTeachers,
      setExcelFixedSlots,
      setExcelSubjectMappings,
      setGeneratedTimetable,
      setIsGenerating,
      markStepCompleted,
      canProceedToStep,
      clearAllData
    }}>
      {children}
    </TimetableContext.Provider>
  );
};


import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  setCurrentStep: (step: number) => void;
  setFixedSlots: (slots: FixedSlot[]) => void;
  setTeachers: (teachers: Teacher[]) => void;
  setSubjectAssignments: (assignments: SubjectAssignment[]) => void;
  markStepCompleted: (stepIndex: number) => void;
  canProceedToStep: (stepIndex: number) => boolean;
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
      title: 'Select Teachers',
      description: 'Assign teachers to subjects',
      completed: false,
      path: '/select-teachers'
    },
    {
      id: 'view-slots',
      title: 'View Fixed Slots',
      description: 'Review pre-assigned slots',
      completed: false,
      path: '/view-slots'
    },
    {
      id: 'map-faculty',
      title: 'Map Faculty to Classes',
      description: 'Assign teachers to specific batches',
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

  const markStepCompleted = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
  };

  const canProceedToStep = (stepIndex: number) => {
    if (stepIndex === 0) return true;
    return steps[stepIndex - 1]?.completed || false;
  };

  return (
    <TimetableContext.Provider value={{
      currentStep,
      steps,
      fixedSlots,
      teachers,
      subjectAssignments,
      setCurrentStep,
      setFixedSlots,
      setTeachers,
      setSubjectAssignments,
      markStepCompleted,
      canProceedToStep
    }}>
      {children}
    </TimetableContext.Provider>
  );
};

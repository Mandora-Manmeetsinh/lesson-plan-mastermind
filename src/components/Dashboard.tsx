import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, LogOut } from "lucide-react";
import { TimetableProvider, useTimetable } from '@/contexts/TimetableContext';
import TimetableStepper from '@/components/TimetableStepper';
import UploadSlotsPage from '@/components/UploadSlotsPage';
import SelectTeachersPage from '@/components/SelectTeachersPage';
import ViewSlotsPage from '@/components/ViewSlotsPage';
import MapFacultyPage from '@/components/MapFacultyPage';
import GenerateTimetablePage from '@/components/GenerateTimetablePage';
import ViewDownloadPage from '@/components/ViewDownloadPage';

const DashboardContent = () => {
  const { currentStep, setCurrentStep } = useTimetable();

  const handleStepNavigation = (stepIndex: number, path: string) => {
    setCurrentStep(stepIndex);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <UploadSlotsPage />;
      case 1:
        return <SelectTeachersPage />;
      case 2:
        return <ViewSlotsPage />;
      case 3:
        return <MapFacultyPage />;
      case 4:
        return <GenerateTimetablePage />;
      case 5:
        return <ViewDownloadPage />;
      default:
        return <UploadSlotsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">College Timetable Generator</h1>
              <p className="text-sm text-gray-600">Step-by-step scheduling workflow</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Stepper Navigation */}
      <TimetableStepper onStepClick={handleStepNavigation} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <TimetableProvider>
      <DashboardContent />
    </TimetableProvider>
  );
};

export default Dashboard;

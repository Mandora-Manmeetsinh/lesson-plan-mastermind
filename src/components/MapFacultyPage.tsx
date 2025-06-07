
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Users, 
  ArrowRight,
  Clock,
  BookOpen,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const MapFacultyPage = () => {
  const { 
    excelFixedSlots, 
    excelTeachers, 
    excelSubjectMappings, 
    setCurrentStep, 
    markStepCompleted 
  } = useTimetable();

  const [dataValidated, setDataValidated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    validateData();
  }, [excelFixedSlots, excelTeachers, excelSubjectMappings]);

  const validateData = () => {
    const errors: string[] = [];

    if (excelFixedSlots.length === 0) {
      errors.push("No fixed slots uploaded. Please upload fixed slots first.");
    }

    if (excelTeachers.length === 0) {
      errors.push("No teachers uploaded. Please upload teacher data.");
    }

    if (excelSubjectMappings.length === 0) {
      errors.push("No subject mappings uploaded. Please upload subject mappings.");
    }

    // Validate that all subjects in fixed slots have corresponding teachers
    const availableSubjects = new Set(excelTeachers.flatMap(t => t.subjects));
    const requiredSubjects = new Set(excelFixedSlots.map(slot => slot.subject));
    const missingSubjects = Array.from(requiredSubjects).filter(subject => 
      !availableSubjects.has(subject)
    );

    if (missingSubjects.length > 0) {
      errors.push(`Missing teachers for subjects: ${missingSubjects.join(', ')}`);
    }

    setValidationErrors(errors);
    setDataValidated(errors.length === 0);
  };

  const proceedToNextStep = () => {
    if (dataValidated) {
      markStepCompleted(3);
      setCurrentStep(4);
    }
  };

  const goBackToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  if (!dataValidated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Data</h1>
          <p className="text-gray-600 mt-2">Validate uploaded data before generating timetable</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Data validation failed. Please fix the following issues:
            <ul className="list-disc list-inside mt-2">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className={excelFixedSlots.length > 0 ? 'border-green-200' : 'border-red-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{excelFixedSlots.length}</p>
                    <p className="text-sm text-gray-600">Fixed Slots</p>
                  </div>
                </div>
                {excelFixedSlots.length > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              {excelFixedSlots.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => goBackToStep(0)}
                >
                  Upload Fixed Slots
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className={excelTeachers.length > 0 ? 'border-green-200' : 'border-red-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{excelTeachers.length}</p>
                    <p className="text-sm text-gray-600">Teachers</p>
                  </div>
                </div>
                {excelTeachers.length > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              {excelTeachers.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => goBackToStep(1)}
                >
                  Upload Teachers
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className={excelSubjectMappings.length > 0 ? 'border-green-200' : 'border-red-200'}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{excelSubjectMappings.length}</p>
                    <p className="text-sm text-gray-600">Subject Mappings</p>
                  </div>
                </div>
                {excelSubjectMappings.length > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              {excelSubjectMappings.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => goBackToStep(2)}
                >
                  Upload Subject Mappings
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Data</h1>
        <p className="text-gray-600 mt-2">All data has been validated successfully</p>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Data validation completed successfully. Ready to generate timetable.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{excelFixedSlots.length}</p>
                <p className="text-sm text-gray-600">Fixed Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{excelTeachers.length}</p>
                <p className="text-sm text-gray-600">Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{excelSubjectMappings.length}</p>
                <p className="text-sm text-gray-600">Subject Mappings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fixed Slots Preview</CardTitle>
            <CardDescription>Sample of uploaded fixed slots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {excelFixedSlots.slice(0, 5).map((slot, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{slot.subject}</span>
                  <span>{slot.day} {slot.time}</span>
                </div>
              ))}
              {excelFixedSlots.length > 5 && (
                <p className="text-xs text-gray-500">...and {excelFixedSlots.length - 5} more</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teachers Preview</CardTitle>
            <CardDescription>Sample of uploaded teachers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {excelTeachers.slice(0, 5).map((teacher, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                  <span className="font-medium">{teacher.name}</span>
                  <span>{teacher.subjects.length} subjects</span>
                </div>
              ))}
              {excelTeachers.length > 5 && (
                <p className="text-xs text-gray-500">...and {excelTeachers.length - 5} more</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button 
          onClick={proceedToNextStep}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue to Generate Timetable
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapFacultyPage;

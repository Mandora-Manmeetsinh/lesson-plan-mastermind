
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Zap, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const GenerateTimetablePage = () => {
  const { fixedSlots, teachers, subjectAssignments, setCurrentStep, markStepCompleted } = useTimetable();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [generationResults, setGenerationResults] = useState<any>(null);

  const handleGenerateTimetable = async () => {
    setIsGenerating(true);
    setGenerationStatus('generating');
    setGenerationProgress(0);

    // Simulate timetable generation process
    const steps = [
      { message: "Analyzing fixed slots...", progress: 20 },
      { message: "Processing teacher assignments...", progress: 40 },
      { message: "Resolving conflicts...", progress: 60 },
      { message: "Optimizing load distribution...", progress: 80 },
      { message: "Finalizing timetable...", progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(step.progress);
    }

    // Mock generation results
    setGenerationResults({
      totalSlots: 150,
      fixedSlots: fixedSlots.length,
      generatedSlots: 150 - fixedSlots.length,
      conflicts: 0,
      teacherLoad: {
        average: 18,
        min: 12,
        max: 24
      }
    });

    setGenerationStatus('success');
    setIsGenerating(false);
  };

  const proceedToNextStep = () => {
    markStepCompleted(4);
    setCurrentStep(5);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Generate Timetable</h1>
        <p className="text-gray-600 mt-2">Create optimized schedules using your configured data</p>
      </div>

      {/* Generation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <span>Timetable Generation</span>
          </CardTitle>
          <CardDescription>
            Run the optimization algorithm to generate conflict-free timetables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generationStatus === 'idle' && (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
              <p className="text-gray-600 mb-6">
                Click the button below to start the timetable generation process
              </p>
              <Button 
                onClick={handleGenerateTimetable}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Timetable
              </Button>
            </div>
          )}

          {generationStatus === 'generating' && (
            <div className="space-y-4">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900">Generating Timetable...</h3>
                <p className="text-gray-600">This may take a few moments</p>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-center text-sm text-gray-600">{generationProgress}% Complete</p>
            </div>
          )}

          {generationStatus === 'success' && generationResults && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Timetable Generated Successfully!</h3>
                <p className="text-gray-600">Your optimized timetable is ready for review</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Generation Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Slots:</span>
                        <span className="font-medium">{generationResults.totalSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed Slots:</span>
                        <span className="font-medium">{generationResults.fixedSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generated Slots:</span>
                        <span className="font-medium">{generationResults.generatedSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conflicts:</span>
                        <span className="font-medium text-green-600">{generationResults.conflicts}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Teacher Load Distribution</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Average Load:</span>
                        <span className="font-medium">{generationResults.teacherLoad.average} hrs/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Load:</span>
                        <span className="font-medium">{generationResults.teacherLoad.min} hrs/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Load:</span>
                        <span className="font-medium">{generationResults.teacherLoad.max} hrs/week</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={handleGenerateTimetable}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
                <Button 
                  onClick={proceedToNextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  View & Download
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {generationStatus === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generation Failed</h3>
              <p className="text-gray-600 mb-6">
                There was an error generating the timetable. Please try again.
              </p>
              <Button 
                onClick={handleGenerateTimetable}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Fixed Slots</h4>
            <p className="text-2xl font-bold text-blue-600">{fixedSlots.length}</p>
            <p className="text-sm text-gray-600">Pre-assigned slots</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Teachers</h4>
            <p className="text-2xl font-bold text-green-600">{teachers.length}</p>
            <p className="text-sm text-gray-600">Available faculty</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Subject Assignments</h4>
            <p className="text-2xl font-bold text-purple-600">{subjectAssignments.length}</p>
            <p className="text-sm text-gray-600">Configured subjects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateTimetablePage;


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTimetable } from '@/contexts/TimetableContext';
import { TimetableGenerator, TimetableGenerationResult } from '@/utils/timetableGenerator';
import { 
  Zap, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const GenerateTimetablePage = () => {
  const { 
    excelFixedSlots, 
    excelTeachers, 
    excelSubjectMappings, 
    setGeneratedTimetable,
    setCurrentStep, 
    markStepCompleted,
    isGenerating,
    setIsGenerating
  } = useTimetable();
  
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [generationResults, setGenerationResults] = useState<TimetableGenerationResult | null>(null);

  const canGenerate = excelFixedSlots.length > 0 && excelTeachers.length > 0 && excelSubjectMappings.length > 0;

  const handleGenerateTimetable = async () => {
    if (!canGenerate) {
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('generating');
    setGenerationProgress(0);

    try {
      // Simulate progress steps
      const steps = [
        { message: "Initializing timetable generator...", progress: 10 },
        { message: "Placing fixed slots...", progress: 30 },
        { message: "Analyzing teacher availability...", progress: 50 },
        { message: "Resolving scheduling conflicts...", progress: 70 },
        { message: "Optimizing class distribution...", progress: 85 },
        { message: "Finalizing timetable...", progress: 100 }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
      }

      // Generate the actual timetable
      const generator = new TimetableGenerator(
        excelTeachers,
        excelFixedSlots,
        excelSubjectMappings
      );

      const result = await new Promise<TimetableGenerationResult>((resolve) => {
        setTimeout(() => {
          resolve(generator.generateTimetable());
        }, 500);
      });

      setGenerationResults(result);
      setGeneratedTimetable(result.timetable);
      setGenerationStatus('success');
      
    } catch (error) {
      console.error('Error generating timetable:', error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const proceedToNextStep = () => {
    markStepCompleted(4);
    setCurrentStep(5);
  };

  if (!canGenerate) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Timetable</h1>
          <p className="text-gray-600 mt-2">Create optimized schedules using your configured data</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Missing required data to generate timetable. Please ensure you have uploaded:
            <ul className="list-disc list-inside mt-2">
              <li>Fixed Slots ({excelFixedSlots.length} uploaded)</li>
              <li>Teachers Data ({excelTeachers.length} uploaded)</li>
              <li>Subject Mappings ({excelSubjectMappings.length} uploaded)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cannot Generate Timetable</h3>
            <p className="text-gray-600 mb-4">
              Please complete all previous steps before generating the timetable.
            </p>
            <Button 
              variant="outline"
              onClick={() => setCurrentStep(0)}
            >
              Go Back to Upload Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <span>Intelligent Timetable Generation</span>
          </CardTitle>
          <CardDescription>
            Run the constraint-based optimization algorithm to generate conflict-free timetables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generationStatus === 'idle' && (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
              <p className="text-gray-600 mb-6">
                All data has been uploaded. Click the button below to start the intelligent timetable generation process.
              </p>
              <Button 
                onClick={handleGenerateTimetable}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Intelligent Timetable
              </Button>
            </div>
          )}

          {generationStatus === 'generating' && (
            <div className="space-y-4">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900">Generating Timetable...</h3>
                <p className="text-gray-600">Processing constraints and optimizing schedule</p>
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
              
              {/* Generation Results */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Generation Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Slots:</span>
                        <span className="font-medium">{generationResults.statistics.totalSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fixed Slots:</span>
                        <span className="font-medium">{generationResults.statistics.fixedSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Generated Slots:</span>
                        <span className="font-medium">{generationResults.statistics.generatedSlots}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conflicts:</span>
                        <span className={`font-medium ${generationResults.conflicts.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {generationResults.conflicts.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Teacher Utilization</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(generationResults.statistics.teacherUtilization)
                        .slice(0, 5)
                        .map(([teacher, hours]) => (
                        <div key={teacher} className="flex justify-between">
                          <span className="truncate">{teacher.split(' ')[0]}...</span>
                          <span className="font-medium">{hours} hrs</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conflicts Warning */}
              {generationResults.conflicts.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{generationResults.conflicts.length} conflicts detected:</strong>
                    <ul className="list-disc list-inside mt-2 max-h-32 overflow-y-auto">
                      {generationResults.conflicts.slice(0, 5).map((conflict, index) => (
                        <li key={index} className="text-sm">{conflict}</li>
                      ))}
                      {generationResults.conflicts.length > 5 && (
                        <li className="text-sm">...and {generationResults.conflicts.length - 5} more</li>
                      )}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

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

      {/* Data Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Fixed Slots</h4>
            <p className="text-2xl font-bold text-blue-600">{excelFixedSlots.length}</p>
            <p className="text-sm text-gray-600">Pre-assigned slots</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Teachers</h4>
            <p className="text-2xl font-bold text-green-600">{excelTeachers.length}</p>
            <p className="text-sm text-gray-600">Available faculty</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-gray-900 mb-2">Subject Mappings</h4>
            <p className="text-2xl font-bold text-purple-600">{excelSubjectMappings.length}</p>
            <p className="text-sm text-gray-600">Configured subjects</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateTimetablePage;

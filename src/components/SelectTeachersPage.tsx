
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTimetable } from '@/contexts/TimetableContext';
import { parseTeachersFromExcel, generateSampleExcelFile, ExcelTeacher } from '@/utils/excelParser';
import { 
  Upload, 
  Users, 
  Check, 
  X, 
  AlertCircle,
  Download,
  ArrowRight,
  FileText
} from "lucide-react";

const SelectTeachersPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const { toast } = useToast();
  const { excelTeachers, setExcelTeachers, setCurrentStep, markStepCompleted } = useTimetable();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('error');
      toast({
        title: "Invalid File Format",
        description: "Please upload a valid Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Parse the Excel file
      const parsedData = await parseTeachersFromExcel(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setExcelTeachers(parsedData);
      setIsUploading(false);
      setUploadStatus('success');
      markStepCompleted(1);
      
      toast({
        title: "Upload Successful!",
        description: `${parsedData.length} teachers processed successfully.`,
      });

    } catch (error) {
      setIsUploading(false);
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: "There was an error processing your file. Please check the format and try again.",
        variant: "destructive"
      });
      console.error('Error parsing Excel file:', error);
    }
  };

  const proceedToNextStep = () => {
    setCurrentStep(2);
  };

  const downloadSampleTemplate = () => {
    generateSampleExcelFile('teachers');
    toast({
      title: "Sample Downloaded",
      description: "Check your downloads folder for sample_teachers.xlsx",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Teachers Data</h1>
        <p className="text-gray-600 mt-2">Import teacher information, subjects, and availability</p>
      </div>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload an Excel file (.xlsx or .xls) containing teacher data. 
          Required columns: ID, Name, Email, Subjects, Availability by day, MaxHours.
        </AlertDescription>
      </Alert>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drag and drop your Excel file or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : uploadStatus === 'success'
                ? 'border-green-400 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-400 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadStatus === 'success' ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-700">Upload Successful!</h3>
                  <p className="text-green-600">{uploadedFile?.name}</p>
                  <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                    {excelTeachers.length} teachers processed
                  </Badge>
                </div>
              </div>
            ) : uploadStatus === 'error' ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-700">Upload Failed</h3>
                  <p className="text-red-600">Please upload a valid Excel file (.xlsx or .xls)</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => {
                      setUploadStatus('idle');
                      setUploadedFile(null);
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {isUploading ? 'Processing...' : 'Upload Teachers File'}
                  </h3>
                  <p className="text-gray-600">
                    {isUploading 
                      ? `Processing ${uploadedFile?.name}...` 
                      : 'Drag and drop your Excel file here, or click to browse'
                    }
                  </p>
                </div>
                {isUploading && (
                  <div className="w-full max-w-xs mx-auto">
                    <Progress value={uploadProgress} className="mb-2" />
                    <p className="text-sm text-gray-500">{uploadProgress}% complete</p>
                  </div>
                )}
                {!isUploading && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button asChild className="cursor-pointer">
                        <span>Choose File</span>
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500">Supports .xlsx and .xls formats</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sample Template Download */}
      <Card>
        <CardHeader>
          <CardTitle>Need a Template?</CardTitle>
          <CardDescription>Download our sample Excel template to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={downloadSampleTemplate}>
            <Download className="mr-2 w-4 h-4" />
            Download Sample Template
          </Button>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {uploadStatus === 'success' && excelTeachers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview: Uploaded Teachers</CardTitle>
            <CardDescription>Review the imported teacher data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {excelTeachers.slice(0, 5).map((teacher, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-medium">{teacher.name}</h4>
                      <p className="text-sm text-gray-600">{teacher.email}</p>
                      <div className="flex flex-wrap gap-1">
                        {teacher.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        Max Hours: {teacher.maxHoursPerWeek}/week
                      </p>
                    </div>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              {excelTeachers.length > 5 && (
                <p className="text-sm text-gray-600 text-center">
                  Showing first 5 of {excelTeachers.length} teachers
                </p>
              )}
            </div>
            <div className="mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={proceedToNextStep}
              >
                Proceed to Upload Subject Mappings
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {excelTeachers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{excelTeachers.length}</p>
                <p className="text-sm text-gray-600">Total Teachers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {Array.from(new Set(excelTeachers.flatMap(t => t.subjects))).length}
                </p>
                <p className="text-sm text-gray-600">Unique Subjects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(excelTeachers.reduce((sum, t) => sum + t.maxHoursPerWeek, 0) / excelTeachers.length)}
                </p>
                <p className="text-sm text-gray-600">Avg Hours/Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectTeachersPage;

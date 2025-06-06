import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useTimetable } from '@/contexts/TimetableContext';
import { parseFixedSlotsFromExcel, generateSampleExcelFile, ExcelFixedSlot } from '@/utils/excelParser';
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  Download,
  ArrowRight
} from "lucide-react";

const UploadSlotsPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

  const { toast } = useToast();
  const { excelFixedSlots, setExcelFixedSlots, setFixedSlots, setCurrentStep, markStepCompleted } = useTimetable();

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
      const parsedData = await parseFixedSlotsFromExcel(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Convert to legacy format for compatibility
      const legacySlots = parsedData.map(slot => ({
        department: slot.department,
        subject: slot.subject,
        faculty: slot.faculty,
        day: slot.day,
        time: slot.time,
        room: slot.room
      }));

      setExcelFixedSlots(parsedData);
      setFixedSlots(legacySlots);
      setIsUploading(false);
      setUploadStatus('success');
      markStepCompleted(0);
      
      toast({
        title: "Upload Successful!",
        description: `${parsedData.length} fixed slots processed successfully.`,
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
    setCurrentStep(1);
  };

  const downloadSampleTemplate = () => {
    generateSampleExcelFile('fixedSlots');
    toast({
      title: "Sample Downloaded",
      description: "Check your downloads folder for sample_fixedSlots.xlsx",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Fixed Slots</h1>
        <p className="text-gray-600 mt-2">Import your pre-decided class schedules via Excel file</p>
      </div>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload an Excel file (.xlsx or .xls) containing your fixed class slots. 
          Required columns: Department, Subject, Faculty, Day, Time, Room, Batch.
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
                    {excelFixedSlots.length} slots processed
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
                    {isUploading ? 'Processing...' : 'Upload Fixed Slots File'}
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
      {uploadStatus === 'success' && excelFixedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview: Uploaded Fixed Slots</CardTitle>
            <CardDescription>Review the imported data before proceeding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Department</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Subject</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Faculty</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Day</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Time</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Room</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {excelFixedSlots.slice(0, 10).map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2">{row.department}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.subject}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.faculty}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.day}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.time}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.room}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.batch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {excelFixedSlots.length > 10 && (
                <p className="mt-2 text-sm text-gray-600">
                  Showing first 10 of {excelFixedSlots.length} rows
                </p>
              )}
            </div>
            <div className="mt-6">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={proceedToNextStep}
              >
                Proceed to Upload Teachers
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadSlotsPage;

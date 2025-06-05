
import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  Check, 
  X, 
  AlertCircle,
  Download,
  ArrowDown
} from "lucide-react";

interface UploadSlotsPageProps {
  onBack: () => void;
}

const UploadSlotsPage = ({ onBack }: UploadSlotsPageProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [dragActive, setDragActive] = useState(false);

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

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadStatus('error');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadStatus('success');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const sampleData = [
    { department: 'Computer Science', subject: 'Data Structures', faculty: 'Dr. Smith', day: 'Monday', time: '09:00-10:00', room: 'CS-101' },
    { department: 'Computer Science', subject: 'Algorithms', faculty: 'Prof. Johnson', day: 'Tuesday', time: '10:00-11:00', room: 'CS-102' },
    { department: 'Mathematics', subject: 'Calculus I', faculty: 'Dr. Brown', day: 'Wednesday', time: '11:00-12:00', room: 'M-201' },
    { department: 'Physics', subject: 'Quantum Physics', faculty: 'Prof. Davis', day: 'Thursday', time: '14:00-15:00', room: 'P-301' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upload Fixed Slots</h1>
          <p className="text-gray-600 mt-2">Import your pre-decided class schedules via Excel file</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>

      {/* Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Upload an Excel file (.xlsx or .xls) containing your fixed class slots. 
          The file should include columns: Department, Subject, Faculty, Day, Time, and Room.
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
                    {sampleData.length} slots processed
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
                    {isUploading ? 'Uploading...' : 'Upload Fixed Slots File'}
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
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 w-4 h-4" />
            Download Sample Template
          </Button>
        </CardContent>
      </Card>

      {/* Preview Table */}
      {uploadStatus === 'success' && (
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
                  </tr>
                </thead>
                <tbody>
                  {sampleData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-200 px-4 py-2">{row.department}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.subject}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.faculty}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.day}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.time}</td>
                      <td className="border border-gray-200 px-4 py-2">{row.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={() => {
                  // Here you would typically save the data and mark the module as complete
                  onBack();
                }}
              >
                Confirm & Save Slots
                <ArrowDown className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline">
                Edit Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadSlotsPage;

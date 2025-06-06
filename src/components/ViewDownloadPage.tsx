
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTimetable } from '@/contexts/TimetableContext';
import { exportTimetableToExcel, exportTimetableToPDF } from '@/utils/exportUtils';
import { DataStorage } from '@/utils/dataStorage';
import { 
  Download, 
  FileText,
  Grid2X2,
  Lock,
  Mail,
  Filter,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

const ViewDownloadPage = () => {
  const { generatedTimetable, excelFixedSlots, clearAllData, setCurrentStep } = useTimetable();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('excel');

  if (!generatedTimetable) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">View & Download Timetable</h1>
          <p className="text-gray-600 mt-2">No timetable has been generated yet</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No timetable has been generated yet. Please go back and generate a timetable first.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="p-6 text-center">
            <Grid2X2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Timetable Available</h3>
            <p className="text-gray-600 mb-4">
              Please generate a timetable first to view and download it.
            </p>
            <Button 
              onClick={() => setCurrentStep(4)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Go to Generation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const departments = Object.keys(generatedTimetable);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];

  // Calculate statistics
  const totalSlots = Object.values(generatedTimetable).reduce((total, dept) => {
    return total + Object.values(dept).reduce((deptTotal, day) => {
      return deptTotal + Object.keys(day).length;
    }, 0);
  }, 0);

  const fixedSlots = Object.values(generatedTimetable).reduce((total, dept) => {
    return total + Object.values(dept).reduce((deptTotal, day) => {
      return deptTotal + Object.values(day).filter(slot => slot.isFixed).length;
    }, 0);
  }, 0);

  const generatedSlots = totalSlots - fixedSlots;

  const displayDepartment = selectedDepartment || departments[0] || '';
  const departmentData = generatedTimetable[displayDepartment] || {};

  const handleDownload = (format: string) => {
    try {
      if (format === 'excel') {
        const filename = `timetable_${new Date().toISOString().split('T')[0]}.xlsx`;
        exportTimetableToExcel(generatedTimetable, filename);
      } else if (format === 'pdf') {
        exportTimetableToPDF(generatedTimetable);
      }
    } catch (error) {
      console.error('Error exporting timetable:', error);
    }
  };

  const handleEmailTimetable = () => {
    const dataString = DataStorage.exportData();
    const mailtoLink = `mailto:?subject=College Timetable&body=Please find the timetable data attached.%0A%0A${encodeURIComponent(dataString)}`;
    window.open(mailtoLink);
  };

  const handleNewTimetable = () => {
    clearAllData();
    setCurrentStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">View & Download Timetable</h1>
        <p className="text-gray-600 mt-2">Review your generated timetable and export in multiple formats</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Grid2X2 className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalSlots}</p>
                <p className="text-sm text-gray-600">Total Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{fixedSlots}</p>
                <p className="text-sm text-gray-600">Fixed Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{generatedSlots}</p>
                <p className="text-sm text-gray-600">Generated Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Choose your preferred format and filters for the timetable export</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department Filter</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="excel">Excel (.xlsx)</option>
                <option value="pdf">PDF Document</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button 
                onClick={() => handleDownload(selectedFormat)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline"
                onClick={handleEmailTimetable}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Preview */}
      {displayDepartment && (
        <Card>
          <CardHeader>
            <CardTitle>Timetable Preview - {displayDepartment} Department</CardTitle>
            <CardDescription>
              Complete weekly schedule with fixed and generated slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left font-medium">Time</th>
                    {days.map(day => (
                      <th key={day} className="border border-gray-300 p-3 text-center font-medium">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => (
                    <tr key={time}>
                      <td className="border border-gray-300 p-3 font-medium bg-gray-50">{time}</td>
                      {days.map(day => {
                        const slot = departmentData[day]?.[time];
                        
                        return (
                          <td key={`${day}-${time}`} className="border border-gray-300 p-2">
                            {slot ? (
                              <div className={`p-3 rounded-md ${slot.isFixed ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
                                <div className="font-medium text-sm">{slot.subject}</div>
                                <div className="text-xs text-gray-600">{slot.teacher}</div>
                                <div className="text-xs text-gray-500">{slot.room}</div>
                                <div className="text-xs text-gray-500">{slot.batch}</div>
                                <Badge 
                                  variant="secondary" 
                                  className={`mt-1 text-xs ${slot.isFixed ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}
                                >
                                  {slot.isFixed ? (
                                    <>
                                      <Lock className="w-3 h-3 mr-1" />
                                      Fixed
                                    </>
                                  ) : (
                                    'Generated'
                                  )}
                                </Badge>
                              </div>
                            ) : (
                              <div className="h-16 bg-gray-50 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-400">Free</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={handleNewTimetable}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Timetable
        </Button>
        <div className="space-x-2">
          <Button 
            onClick={() => handleDownload('pdf')}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button 
            onClick={() => handleDownload('excel')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewDownloadPage;

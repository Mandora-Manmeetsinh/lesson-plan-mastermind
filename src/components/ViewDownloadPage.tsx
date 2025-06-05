
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Download, 
  FileText,
  Grid2X2,
  Lock,
  Mail,
  Filter
} from "lucide-react";

const ViewDownloadPage = () => {
  const { fixedSlots } = useTimetable();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('excel');

  const departments = Array.from(new Set(fixedSlots.map(slot => slot.department)));
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];

  // Mock generated timetable data
  const mockTimetable = {
    'Computer Science': {
      'Monday': {
        '9:00-10:00': { subject: 'Data Structures', teacher: 'Dr. Smith', room: 'CS101', isFixed: true },
        '10:00-11:00': { subject: 'Algorithms', teacher: 'Dr. Johnson', room: 'CS102', isFixed: false },
        '11:00-12:00': { subject: 'Database Systems', teacher: 'Dr. Brown', room: 'CS103', isFixed: false },
      },
      'Tuesday': {
        '9:00-10:00': { subject: 'Web Development', teacher: 'Dr. Davis', room: 'CS104', isFixed: false },
        '10:00-11:00': { subject: 'Software Engineering', teacher: 'Dr. Wilson', room: 'CS105', isFixed: true },
      },
      // Add more days and slots as needed
    }
  };

  const handleDownload = (format: string) => {
    console.log(`Downloading timetable in ${format} format`);
    // Implement download logic here
  };

  const handleEmailTimetable = () => {
    console.log('Sending timetable via email');
    // Implement email logic here
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
                <p className="text-2xl font-bold">150</p>
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
                <p className="text-2xl font-bold">{fixedSlots.length}</p>
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
                <p className="text-2xl font-bold">{150 - fixedSlots.length}</p>
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
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-600">Conflicts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Export Options */}
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
                <option value="csv">CSV File</option>
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
      <Card>
        <CardHeader>
          <CardTitle>Timetable Preview - Computer Science Department</CardTitle>
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
                      const slot = mockTimetable['Computer Science']?.[day]?.[time];
                      
                      return (
                        <td key={`${day}-${time}`} className="border border-gray-300 p-2">
                          {slot ? (
                            <div className={`p-3 rounded-md ${slot.isFixed ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
                              <div className="font-medium text-sm">{slot.subject}</div>
                              <div className="text-xs text-gray-600">{slot.teacher}</div>
                              <div className="text-xs text-gray-500">{slot.room}</div>
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

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
        >
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

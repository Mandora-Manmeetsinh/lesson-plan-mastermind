
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Users, 
  Search, 
  ArrowRight,
  Clock,
  BookOpen
} from "lucide-react";

interface BatchSchedule {
  batch: string;
  department: string;
  schedule: {
    [day: string]: {
      [time: string]: {
        subject: string;
        assignedTeacher?: string;
        isFixed: boolean;
      };
    };
  };
}

const MapFacultyPage = () => {
  const { fixedSlots, teachers, subjectAssignments, setCurrentStep, markStepCompleted } = useTimetable();
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [batchSchedules, setBatchSchedules] = useState<BatchSchedule[]>([]);

  // Extract unique batches from fixed slots
  const batches = Array.from(new Set(fixedSlots.map(slot => `${slot.department} - Batch A`)));

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];

  const getAvailableTeachers = (subject: string) => {
    const assignment = subjectAssignments.find(sa => sa.subject === subject);
    return assignment ? assignment.assignedTeachers : [];
  };

  const handleTeacherAssignment = (day: string, time: string, subject: string, teacherId: string) => {
    // Logic to assign teacher to specific time slot
    console.log(`Assigning teacher ${teacherId} to ${subject} on ${day} at ${time}`);
  };

  const proceedToNextStep = () => {
    markStepCompleted(3);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Map Faculty to Classes</h1>
        <p className="text-gray-600 mt-2">Assign teachers to specific batches and time slots</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{batches.length}</p>
                <p className="text-sm text-gray-600">Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{teachers.length}</p>
                <p className="text-sm text-gray-600">Available Teachers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{timeSlots.length}</p>
                <p className="text-sm text-gray-600">Time Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Batch</CardTitle>
          <CardDescription>Choose a batch to assign faculty for their timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">Select a batch...</option>
              {batches.map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle>Timetable for {selectedBatch}</CardTitle>
            <CardDescription>
              Assign teachers to available time slots. Fixed slots are locked and cannot be modified.
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
                        const fixedSlot = fixedSlots.find(slot => 
                          slot.day === day && slot.time === time
                        );
                        
                        return (
                          <td key={`${day}-${time}`} className="border border-gray-300 p-2">
                            {fixedSlot ? (
                              <div className="bg-blue-100 p-2 rounded text-sm">
                                <div className="font-medium">{fixedSlot.subject}</div>
                                <div className="text-gray-600">{fixedSlot.faculty}</div>
                                <Badge variant="secondary" className="mt-1">Fixed</Badge>
                              </div>
                            ) : (
                              <div className="min-h-[60px] bg-gray-50 rounded p-2 text-sm">
                                <select className="w-full text-xs border-0 bg-transparent">
                                  <option value="">Select Subject</option>
                                  {subjectAssignments.map(sa => (
                                    <option key={sa.subject} value={sa.subject}>{sa.subject}</option>
                                  ))}
                                </select>
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

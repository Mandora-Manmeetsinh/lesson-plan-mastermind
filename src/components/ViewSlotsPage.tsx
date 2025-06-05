
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Grid2X2, 
  Search, 
  Filter,
  ArrowRight,
  Lock
} from "lucide-react";

const ViewSlotsPage = () => {
  const { fixedSlots, setCurrentStep, markStepCompleted } = useTimetable();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = Array.from(new Set(fixedSlots.map(slot => slot.department)));
  
  const filteredSlots = fixedSlots.filter(slot => {
    const matchesSearch = slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slot.faculty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || slot.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const proceedToNextStep = () => {
    markStepCompleted(2);
    setCurrentStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">View Fixed Slots</h1>
        <p className="text-gray-600 mt-2">Review your pre-assigned class schedules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-blue-600" />
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
              <Grid2X2 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{Array.from(new Set(fixedSlots.map(s => s.subject))).length}</p>
                <p className="text-sm text-gray-600">Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Fixed Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by subject or faculty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Slots Table */}
      <Card>
        <CardHeader>
          <CardTitle>Fixed Slots Schedule</CardTitle>
          <CardDescription>
            These slots are locked and cannot be modified during timetable generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Department</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Faculty</th>
                  <th className="text-left p-3 font-medium">Day</th>
                  <th className="text-left p-3 font-medium">Time</th>
                  <th className="text-left p-3 font-medium">Room</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlots.map((slot, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="p-3">{slot.department}</td>
                    <td className="p-3 font-medium">{slot.subject}</td>
                    <td className="p-3">{slot.faculty}</td>
                    <td className="p-3">{slot.day}</td>
                    <td className="p-3">{slot.time}</td>
                    <td className="p-3">{slot.room}</td>
                    <td className="p-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Fixed
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredSlots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No fixed slots match your current filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button 
          onClick={proceedToNextStep}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue to Map Faculty
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ViewSlotsPage;

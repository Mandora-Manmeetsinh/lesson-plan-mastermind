import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTimetable } from '@/contexts/TimetableContext';
import { 
  Users, 
  Search, 
  Check, 
  ArrowRight,
  Plus,
  X
} from "lucide-react";

const SelectTeachersPage = () => {
  const { toast } = useToast();
  const { fixedSlots, subjectAssignments, setSubjectAssignments, setCurrentStep, markStepCompleted } = useTimetable();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [availableTeachers] = useState([
    { id: '1', name: 'Dr. Smith', email: 'smith@college.edu', subjects: ['Data Structures', 'Algorithms'] },
    { id: '2', name: 'Prof. Johnson', email: 'johnson@college.edu', subjects: ['Algorithms', 'Database Systems'] },
    { id: '3', name: 'Dr. Brown', email: 'brown@college.edu', subjects: ['Calculus I', 'Linear Algebra'] },
    { id: '4', name: 'Prof. Davis', email: 'davis@college.edu', subjects: ['Quantum Physics', 'Classical Mechanics'] },
    { id: '5', name: 'Dr. Wilson', email: 'wilson@college.edu', subjects: ['Data Structures', 'Computer Networks'] },
  ]);

  // Extract unique subjects from fixed slots
  const uniqueSubjects = Array.from(new Set(fixedSlots.map(slot => slot.subject)));

  useEffect(() => {
    // Initialize subject assignments if empty
    if (subjectAssignments.length === 0 && uniqueSubjects.length > 0) {
      const initialAssignments = uniqueSubjects.map(subject => ({
        subject,
        assignedTeachers: []
      }));
      setSubjectAssignments(initialAssignments);
    }
  }, [uniqueSubjects, subjectAssignments, setSubjectAssignments]);

  const filteredTeachers = availableTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTeachersForSubject = (subject: string) => {
    return availableTeachers.filter(teacher => 
      teacher.subjects.includes(subject)
    );
  };

  const getAssignedTeachers = (subject: string) => {
    const assignment = subjectAssignments.find(a => a.subject === subject);
    return assignment?.assignedTeachers || [];
  };

  const assignTeacherToSubject = (subject: string, teacherId: string) => {
    const updatedAssignments = subjectAssignments.map(assignment => {
      if (assignment.subject === subject) {
        const isAlreadyAssigned = assignment.assignedTeachers.includes(teacherId);
        return {
          ...assignment,
          assignedTeachers: isAlreadyAssigned 
            ? assignment.assignedTeachers.filter(id => id !== teacherId)
            : [...assignment.assignedTeachers, teacherId]
        };
      }
      return assignment;
    });
    setSubjectAssignments(updatedAssignments);
  };

  const getTeacherName = (teacherId: string) => {
    return availableTeachers.find(t => t.id === teacherId)?.name || '';
  };

  const canProceedToNext = () => {
    return subjectAssignments.every(assignment => assignment.assignedTeachers.length > 0);
  };

  const proceedToNextStep = () => {
    if (canProceedToNext()) {
      markStepCompleted(1);
      setCurrentStep(2);
      toast({
        title: "Teachers Assigned Successfully!",
        description: "All subjects have been assigned teachers.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Select Teachers for Subjects</h1>
        <p className="text-gray-600 mt-2">Assign available faculty to each subject from your fixed slots</p>
      </div>

      {/* Progress Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {uniqueSubjects.length} subjects found in uploaded data
              </p>
              <p className="text-sm text-gray-600">
                {subjectAssignments.filter(a => a.assignedTeachers.length > 0).length} subjects assigned
              </p>
            </div>
            <Badge variant={canProceedToNext() ? "default" : "secondary"}>
              {canProceedToNext() ? "Ready to Continue" : "Assignments Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Subject List */}
        <Card>
          <CardHeader>
            <CardTitle>Subjects from Fixed Slots</CardTitle>
            <CardDescription>Click on a subject to assign teachers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {uniqueSubjects.map((subject) => {
              const assignedCount = getAssignedTeachers(subject).length;
              const isSelected = selectedSubject === subject;
              
              return (
                <div
                  key={subject}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{subject}</h4>
                      <p className="text-sm text-gray-600">
                        {assignedCount} teacher{assignedCount !== 1 ? 's' : ''} assigned
                      </p>
                    </div>
                    {assignedCount > 0 ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>
                  {assignedCount > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getAssignedTeachers(subject).map(teacherId => (
                        <Badge key={teacherId} variant="secondary" className="text-xs">
                          {getTeacherName(teacherId)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Teacher Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedSubject ? `Assign Teachers to ${selectedSubject}` : 'Select a Subject'}
            </CardTitle>
            <CardDescription>
              {selectedSubject ? 'Choose from available qualified teachers' : 'Click on a subject to start assigning teachers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedSubject ? (
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search teachers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Qualified Teachers */}
                <div>
                  <Label className="text-sm font-medium text-green-700">Recommended (Qualified)</Label>
                  <div className="mt-2 space-y-2">
                    {getTeachersForSubject(selectedSubject).map(teacher => {
                      const isAssigned = getAssignedTeachers(selectedSubject).includes(teacher.id);
                      return (
                        <div
                          key={teacher.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            isAssigned ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => assignTeacherToSubject(selectedSubject, teacher.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{teacher.name}</p>
                              <p className="text-sm text-gray-600">{teacher.email}</p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {teacher.subjects.map(subj => (
                                  <Badge key={subj} variant="outline" className="text-xs">
                                    {subj}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {isAssigned ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <Plus className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Other Teachers */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Other Available Teachers</Label>
                  <div className="mt-2 space-y-2">
                    {filteredTeachers
                      .filter(teacher => !teacher.subjects.includes(selectedSubject))
                      .map(teacher => {
                        const isAssigned = getAssignedTeachers(selectedSubject).includes(teacher.id);
                        return (
                          <div
                            key={teacher.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              isAssigned ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => assignTeacherToSubject(selectedSubject, teacher.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{teacher.name}</p>
                                <p className="text-sm text-gray-600">{teacher.email}</p>
                              </div>
                              {isAssigned ? (
                                <Check className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Plus className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a subject from the left to assign teachers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button 
          onClick={proceedToNextStep}
          disabled={!canProceedToNext()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Continue to View Fixed Slots
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SelectTeachersPage;

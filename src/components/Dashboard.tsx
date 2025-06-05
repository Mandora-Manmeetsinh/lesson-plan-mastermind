
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Calendar, 
  Users, 
  Grid2X2, 
  FileText, 
  Download,
  LogOut,
  CheckCircle,
  Clock,
  ArrowDown
} from "lucide-react";
import UploadSlotsPage from '@/components/UploadSlotsPage';

type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: ModuleStatus;
  color: string;
}

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'upload-slots',
      title: 'Upload Fixed Slots',
      description: 'Import pre-decided class schedules via Excel',
      icon: Upload,
      status: 'not-started',
      color: 'blue'
    },
    {
      id: 'assign-teachers',
      title: 'Select Teachers per Subject',
      description: 'Map available faculty to subjects globally',
      icon: Users,
      status: 'not-started',
      color: 'green'
    },
    {
      id: 'view-slots',
      title: 'View Fixed Slots',
      description: 'Review and confirm pre-assigned slots',
      icon: Grid2X2,
      status: 'not-started',
      color: 'purple'
    },
    {
      id: 'faculty-class',
      title: 'Assign Faculty per Class',
      description: 'Assign teachers for remaining subjects by batch',
      icon: Calendar,
      status: 'not-started',
      color: 'orange'
    },
    {
      id: 'generate',
      title: 'Generate Timetable',
      description: 'Run optimization algorithms to create schedules',
      icon: FileText,
      status: 'not-started',
      color: 'red'
    },
    {
      id: 'download',
      title: 'View & Download',
      description: 'Export final timetables in multiple formats',
      icon: Download,
      status: 'not-started',
      color: 'teal'
    }
  ]);

  const getStatusColor = (status: ModuleStatus) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: ModuleStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const completedModules = modules.filter(m => m.status === 'completed').length;
  const progressPercent = (completedModules / modules.length) * 100;

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'upload-slots':
        return <UploadSlotsPage onBack={() => setCurrentPage('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Timetable Generation Progress</CardTitle>
              <CardDescription className="text-blue-100">
                {completedModules} of {modules.length} modules completed
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {Math.round(progressPercent)}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="mb-4 bg-white/20" />
          <p className="text-blue-100">
            {completedModules === 0 
              ? "Start by uploading your fixed slots to begin the scheduling process" 
              : completedModules === modules.length 
              ? "All modules completed! Your timetable is ready for download"
              : "Continue with the next step to complete your timetable"}
          </p>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => {
          const IconComponent = module.icon;
          const isAccessible = index === 0 || modules[index - 1].status === 'completed';
          
          return (
            <Card 
              key={module.id}
              className={`group transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm cursor-pointer
                ${isAccessible ? 'hover:shadow-lg hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => isAccessible && setCurrentPage(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${module.color}-100 to-${module.color}-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <IconComponent className={`w-6 h-6 text-${module.color}-600`} />
                  </div>
                  {getStatusIcon(module.status)}
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {module.title}
                  {!isAccessible && <Badge variant="outline" className="text-xs">Locked</Badge>}
                </CardTitle>
                <CardDescription className={getStatusColor(module.status)}>
                  {module.description}
                </CardDescription>
              </CardHeader>
              {isAccessible && (
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-gray-100">
                    {module.status === 'completed' ? 'Review' : 'Start'}
                    <ArrowDown className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Upload className="mr-2 w-4 h-4" />
            Upload Sample Templates
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 w-4 h-4" />
            View Documentation
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="mr-2 w-4 h-4" />
            Manage Faculty Database
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">College Timetable Generator</h1>
              {currentPage !== 'dashboard' && (
                <p className="text-sm text-gray-600 capitalize">{currentPage.replace('-', ' ')}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentPage !== 'dashboard' && (
              <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
                Dashboard
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Dashboard;

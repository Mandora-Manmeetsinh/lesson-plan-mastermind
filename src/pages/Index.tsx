
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Calendar, Users, Grid2X2, FileText, Download, ArrowDown } from "lucide-react";
import Dashboard from '@/components/Dashboard';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">College Timetable Generator</h1>
          </div>
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
          Production-Ready MERN Stack Solution
        </Badge>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Automated College
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Scheduling</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Create conflict-free, load-balanced timetables with our modern scheduling system. 
          Upload Excel files, assign faculty, and generate optimized schedules in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-3"
          >
            Start Scheduling
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Complete Scheduling Workflow</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Six comprehensive modules to handle every aspect of college timetable generation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Upload Fixed Slots</CardTitle>
              <CardDescription>
                Import pre-decided class schedules via Excel with drag-and-drop interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Assign Teachers</CardTitle>
              <CardDescription>
                Map available faculty to subjects with searchable multi-select interface
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Grid2X2 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">View Fixed Slots</CardTitle>
              <CardDescription>
                Review and confirm pre-assigned slots with filtering and edit capabilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Faculty per Class</CardTitle>
              <CardDescription>
                Assign teachers to remaining subjects by batch with load balancing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">Generate Timetable</CardTitle>
              <CardDescription>
                Run optimization algorithms to create conflict-free schedules
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-teal-600" />
              </div>
              <CardTitle className="text-lg">Export & Download</CardTitle>
              <CardDescription>
                Download final timetables in Excel or PDF format with email delivery
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-4xl mx-auto border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-3xl font-bold mb-4">Ready to Streamline Your Scheduling?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Join colleges worldwide using our automated timetable generation system
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-3"
            >
              Get Started Now
              <ArrowDown className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 College Timetable Generator. Built with React, Node.js & MongoDB.</p>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={() => {
          setIsAuthenticated(true);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
};

export default Index;

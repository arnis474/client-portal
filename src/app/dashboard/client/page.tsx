// dashboard/page.tsx

// Import React and necessary icons/components
import React from 'react';
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button path
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"; // Assuming shadcn/ui Card path
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui Progress path
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Assuming shadcn/ui Table path
import { Badge } from "@/components/ui/badge"; // Assuming shadcn/ui Badge path
import { Upload, Filter, MessageSquare, Edit, CheckCircle, FileText, FileImage, FileSpreadsheet, FileArchive, Calendar, Video, Clock, PlusCircle } from 'lucide-react'; // Icons

/**
 * DashboardHome Component
 *
 * This component displays a comprehensive client dashboard with project status,
 * tasks, documents, and meeting scheduling, based on the provided design.
 *
 * File path suggestion: dashboard/page.tsx
 */
export default function DashboardHome() {

  // Mock data based on the image
  const project = {
    name: "Website Redesign",
    startDate: "April 15, 2023",
    dueDate: "June 30, 2023",
    progress: 75, // Example progress percentage
    manager: "A Admin User",
  };

  const tasks = [
    { id: 1, name: "Provide logo files", status: "Pending", dueDate: "May 12, 2023", priority: "High" },
    { id: 2, name: "Approve wireframes", status: "Complete", dueDate: "May 15, 2023" },
    { id: 3, name: "Provide homepage copy", status: "In Review", dueDate: "May 18, 2023" },
  ];

  const documents = [
    { id: 1, name: "Project Brief.pdf", type: "pdf", date: "3 weeks ago", icon: FileText },
    { id: 2, name: "Content Outline.docx", type: "doc", date: "1 week ago", icon: FileText },
    { id: 3, name: "Wireframes.png", type: "img", date: "1 week ago", icon: FileImage },
    { id: 4, name: "Budget.xlsx", type: "sheet", date: "2 weeks ago", icon: FileSpreadsheet },
  ];

  const availableSlots = [
    { id: 1, date: "May 15, 2023", time: "10:00 AM - 11:00 AM" },
    { id: 2, date: "May 16, 2023", time: "2:00 PM - 3:00 PM" },
    { id: 3, date: "May 18, 2023", time: "9:00 AM - 9:30 AM" },
  ];

  const scheduledMeetings = [
    { id: 1, title: "Website Review", dateTime: "May 12, 2023 - 2:00 PM - 2:30 PM", link: "Join Google Meet" },
  ];

  // Helper function to get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'complete': return 'success';
      case 'in review': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome back, Client User</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your projects</p>
      </div>

      {/* Current Project Status */}
      <Card className="shadow-sm rounded-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700">Current Project Status</CardTitle>
            <Badge variant="outline" className="border-green-500 text-green-600">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <p className="font-medium text-gray-800">{project.name}</p>
            <div className="text-sm text-gray-500 space-x-4">
              <span>Start Date: {project.startDate}</span>
              <span>Due Date: {project.dueDate}</span>
            </div>
          </div>
          <Progress value={project.progress} className="w-full h-2 [&>div]:bg-red-500" aria-label={`${project.progress}% complete`} />
           <div className="flex justify-end text-sm text-gray-500">
             {project.progress}% complete
           </div>
          <div className="flex justify-between items-center pt-2">
            <div>
              <p className="text-sm text-gray-500">Manager</p>
              <p className="font-medium text-gray-800">{project.manager}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-md">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Your Tasks */}
      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700">Your Tasks</CardTitle>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-100">
                <TableHead className="w-[50%] text-gray-600 font-medium">Task</TableHead>
                <TableHead className="text-gray-600 font-medium">Status</TableHead>
                <TableHead className="text-gray-600 font-medium">Due Date</TableHead>
                <TableHead className="text-right text-gray-600 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">
                    {task.name}
                    {task.priority === 'High' && <Badge variant="destructive" className="ml-2 text-xs">High</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(task.status) as any}>{task.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{task.dueDate}</TableCell>
                  <TableCell className="text-right space-x-2">
                     {/* Placeholder Action Icons - adjust as needed */}
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 rounded-full w-7 h-7">
                      <Edit className="w-4 h-4" />
                    </Button>
                     <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-100 rounded-full w-7 h-7">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Project Documents */}
      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-700">Project Documents</CardTitle>
            <Button variant="default" size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-md">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4 flex flex-col items-center text-center border rounded-md hover:shadow-md transition-shadow">
              <doc.icon className="w-10 h-10 mb-2 text-red-500" />
              <p className="text-sm font-medium text-gray-700 truncate w-full">{doc.name}</p>
              <p className="text-xs text-gray-500 mt-1">{doc.date}</p>
              {/* Placeholder Action Icons */}
               <div className="mt-2 space-x-1">
                 <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6">
                   <Clock className="w-3 h-3" />
                 </Button>
                 <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full w-6 h-6">
                   <PlusCircle className="w-3 h-3" />
                 </Button>
               </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Schedule a Meeting */}
      <Card className="shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">Schedule a Meeting</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Slots */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Available Time Slots</h3>
            <div className="space-y-2">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="flex justify-between items-center p-3 border rounded-md bg-white">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{slot.date}</p>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 rounded-md">Book</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Meetings */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Your Scheduled Meetings</h3>
            <div className="space-y-2">
              {scheduledMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-md bg-red-50 border-red-200">
                  <p className="text-sm font-semibold text-red-800">{meeting.title}</p>
                  <p className="text-xs text-red-700 mt-1">{meeting.dateTime}</p>
                  <a href="#" className="flex items-center text-xs text-blue-600 hover:underline mt-1">
                    <Video className="w-3 h-3 mr-1" />
                    {meeting.link}
                  </a>
                </div>
              ))}
               {scheduledMeetings.length > 0 && (
                 <div className="text-right mt-2">
                   <Button variant="link" size="sm" className="text-xs text-gray-600 hover:text-gray-800">
                     Request Different Time
                   </Button>
                 </div>
               )}
                {scheduledMeetings.length === 0 && (
                   <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings scheduled.</p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

// NOTE: You need to have shadcn/ui components installed and configured.
// Example components used: Button, Card, Progress, Table, Badge.
// You also need `lucide-react` for icons.
// Run `npx shadcn-ui@latest add button card progress table badge` if you haven't already.
// Run `npm install lucide-react` or `yarn add lucide-react`.
// Make sure your `tailwind.config.js` and `globals.css` are set up for shadcn/ui.
// The paths like "@/components/ui/button" depend on your project structure and shadcn/ui setup.

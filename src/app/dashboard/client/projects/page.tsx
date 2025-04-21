// Example file path: src/app/client/projects/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For assigned staff
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// --- Icons ---
import {
  Search, ListFilter, ArrowUpDown, Eye, Download, Mail, FolderOpen, Phone, // Main icons
  Activity, CheckCircle, Package, CalendarClock, Calendar, User // Stat & Date icons
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetched for the logged-in client) ---
const clientProjectsData = [
 {
    id: 'proj-001', name: 'Website Redesign', status: 'In Progress', progress: 75,
    startDate: '2025-04-15', deadline: '2025-06-30',
    assignedStaff: [{ id: 's1', name: 'Alice Smith', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }],
    lastUpdated: new Date(2025, 3, 18), // April 18, 2025
    tags: ['Development', 'Urgent'],
    deliverablesCount: 5,
 },
 {
    id: 'proj-002', name: 'Marketing Campaign Assets', status: 'Completed', progress: 100,
    startDate: '2025-02-01', deadline: '2025-03-31',
    assignedStaff: [{ id: 's2', name: 'Bob Johnson', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }],
    lastUpdated: new Date(2025, 2, 25), // March 25, 2025
    tags: ['Marketing', 'Design'],
    deliverablesCount: 12,
 },
 {
    id: 'proj-003', name: 'Mobile App Concept', status: 'On Hold', progress: 30,
    startDate: '2025-03-01', deadline: '2025-08-15',
    assignedStaff: [{ id: 's1', name: 'Alice Smith', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, { id: 's3', name: 'Charlie Davis', img: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' }],
    lastUpdated: new Date(2025, 3, 1), // April 1, 2025
    tags: ['Mobile', 'Planning'],
    deliverablesCount: 1,
 },
 // Add more projects as needed
];

// Calculate Stats (Replace with backend aggregation for the specific client)
const activeProjects = clientProjectsData.filter(p => p.status === 'In Progress' || p.status === 'On Hold').length;
const completedProjects = clientProjectsData.filter(p => p.status === 'Completed').length;
const totalDeliverables = clientProjectsData.reduce((sum, p) => sum + p.deliverablesCount, 0);
const nextDeadline = clientProjectsData
  .filter(p => p.status === 'In Progress' && p.deadline)
  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0]?.deadline;

// Helper for Status Badges
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
   switch (status?.toLowerCase()) {
    case 'in progress': return 'info';
    case 'completed': return 'success';
    case 'on hold': return 'warning';
    case 'cancelled': return 'secondary';
    default: return 'outline';
  }
};

/**
 * ClientMyProjectsPage Component
 *
 * Displays the logged-in client's projects with filters and details.
 */
export default function ClientMyProjectsPage() {
  // --- State for Filters (Conceptual) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ status: 'all', sortBy: 'newest' });
  // const [projects, setProjects] = useState(clientProjectsData); // Would be fetched/filtered data

  // Determine if there are any projects to display
  const hasProjects = clientProjectsData.length > 0; // Replace with check on fetched data state

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Projects</h1>
        <p className="text-gray-600">Track the progress of your ongoing and completed projects.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 pb-4 border-b">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search by project name..." className="pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select /* value={filters.status} onValueChange={(v) => handleFilterChange('status', v)} */ >
               <SelectTrigger className="w-full sm:w-[160px]">
                 <ListFilter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Statuses</SelectItem>
                 <SelectItem value="in progress">In Progress</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
                 <SelectItem value="on hold">On Hold</SelectItem>
                 <SelectItem value="cancelled">Cancelled</SelectItem>
               </SelectContent>
             </Select>
             <Select /* value={filters.sortBy} onValueChange={(v) => handleFilterChange('sortBy', v)} */ >
               <SelectTrigger className="w-full sm:w-[160px]">
                 <ArrowUpDown className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Sort By" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="newest">Newest First</SelectItem>
                 <SelectItem value="oldest">Oldest First</SelectItem>
                 <SelectItem value="deadline">Deadline Soonest</SelectItem>
               </SelectContent>
             </Select>
          </div>
      </div>

      {/* 3. Quick Stats (Optional) */}
      {hasProjects && (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Projects</CardTitle><Activity className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{activeProjects}</div></CardContent></Card>
            <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completed Projects</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{completedProjects}</div></CardContent></Card>
            <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Deliverables</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{totalDeliverables}</div></CardContent></Card>
            <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Next Deadline</CardTitle><CalendarClock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-xl font-bold">{nextDeadline ? format(new Date(nextDeadline), 'MMM dd, yyyy') : '-'}</div></CardContent></Card>
         </div>
      )}

      {/* 2. Project Cards or Table View */}
      {hasProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientProjectsData.map((project) => (
            <Card key={project.id} className="bg-white shadow-md rounded-lg flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                   <CardTitle className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
                      {/* Make clickable to view full details */}
                      {project.name}
                   </CardTitle>
                   <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                </div>
                 {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                       {project.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                 )}
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                 {/* Progress Bar */}
                 <div>
                   <div className="flex justify-between items-center mb-1">
                      <Label className="text-xs font-medium text-gray-500">Progress</Label>
                      <span className="text-sm font-semibold">{project.progress}%</span>
                   </div>
                   <Progress value={project.progress} aria-label={`${project.progress}% complete`} className="h-2" />
                 </div>

                 {/* Dates */}
                 <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                       <Calendar className="w-4 h-4 text-gray-400" />
                       <span>Start: {project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <CalendarClock className="w-4 h-4 text-gray-400" />
                       <span>Deadline: {project.deadline ? format(new Date(project.deadline), 'MMM dd, yyyy') : '-'}</span>
                    </div>
                 </div>

                 {/* Assigned Team Members (Optional for Client View) */}
                 {project.assignedStaff && project.assignedStaff.length > 0 && (
                    <div>
                       <Label className="text-xs font-medium text-gray-500">Project Team</Label>
                       <div className="flex items-center space-x-2 mt-1">
                          {project.assignedStaff.map(staff => (
                             <TooltipProvider key={staff.id} delayDuration={100}>
                               <Tooltip>
                                 <TooltipTrigger>
                                    <Avatar className="h-7 w-7 border">
                                      <AvatarImage src={staff.img} alt={staff.name} />
                                      <AvatarFallback className="text-xs">{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                 </TooltipTrigger>
                                 <TooltipContent><p>{staff.name}</p></TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                          ))}
                       </div>
                    </div>
                 )}
              </CardContent>
              <CardFooter className="bg-gray-50 p-3 flex justify-between items-center text-xs text-gray-500">
                 <span>Last Updated: {formatDistanceToNow(project.lastUpdated, { addSuffix: true })}</span>
                 <div className="flex gap-1">
                    <Button variant="outline" size="xs" className="h-7 px-2 py-1">
                       <Eye className="w-3.5 h-3.5 mr-1" /> Details
                    </Button>
                    {/* Add other relevant actions */}
                    {/* <Button variant="outline" size="xs" className="h-7 px-2 py-1"><Download className="w-3.5 h-3.5 mr-1" /> Files</Button> */}
                    {/* <Button variant="outline" size="xs" className="h-7 px-2 py-1"><Mail className="w-3.5 h-3.5 mr-1" /> Contact PM</Button> */}
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // 4. Empty State
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-white">
           <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
           <h2 className="text-xl font-semibold text-gray-700 mb-2">You don’t have any projects yet.</h2>
           <p className="text-gray-500 mb-6 max-w-md">Once a project is assigned to you by our team, it will appear here. You'll be able to track its progress, view deliverables, and communicate with the project manager.</p>
           <Button variant="default">
              <Phone className="w-4 h-4 mr-2" /> Contact Support
           </Button>
           {/* Or <Button variant="outline">Schedule a Call</Button> */}
        </div>
      )}
    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mock data with API calls specific to the logged-in client. Filter/sort logic should ideally happen server-side or be applied to fetched data.
// 2. State Management: Use state for filters and fetched project data.
// 3. Assigned Staff Display: Decide if showing assigned internal team members is appropriate for the client view. It's included here but can be removed.
// 4. Actions: Implement the logic for the "View Details" button (e.g., navigate to a detailed project page or open a modal) and any other client-specific actions (downloading files, contacting support).
// 5. Responsiveness: The grid layout adjusts columns based on screen size. Ensure cards look good on mobile.

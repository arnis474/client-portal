// Example file path: src/app/client/tasks/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState } from 'react';
import { format, isToday, isPast, addDays, subDays } from 'date-fns';

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox"; // If clients can mark tasks done
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Icons ---
import {
  Search, FolderKanban, ListFilter, CalendarClock, // Filters
  CheckCircle, Loader, AlertTriangle, // Progress Overview
  MessageSquare, Paperclip, // Notes & Files
  ClipboardList, Briefcase, Phone // Empty State
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetched for the logged-in client) ---
const today = new Date();
const clientTasksData = [
 { id: 'ctask-001', name: 'Approve logo concepts', project: 'Brand Refresh', status: 'Open', dueDate: addDays(today, 1), notes: 'Review the 3 options sent via email.', files: 2 },
 { id: 'ctask-002', name: 'Send feedback on wireframes', project: 'Website Redesign', status: 'In Progress', dueDate: addDays(today, 3), notes: 'Focus on user flow.', files: 1 },
 { id: 'ctask-003', name: 'Confirm final copy', project: 'Landing Page', status: 'Completed', dueDate: subDays(today, 3), notes: '', files: 0 },
 { id: 'ctask-004', name: 'Provide product images', project: 'Website Redesign', status: 'Open', dueDate: subDays(today, 1), notes: 'High-resolution needed.', files: 0 }, // Overdue
 { id: 'ctask-005', name: 'Review competitor analysis', project: 'Marketing Strategy', status: 'Open', dueDate: addDays(today, 7), notes: '', files: 1 },
];

// Calculate Progress Overview Stats (Replace with backend aggregation)
const completedTasks = clientTasksData.filter(t => t.status === 'Completed').length;
const inProgressTasks = clientTasksData.filter(t => t.status === 'In Progress').length;
const overdueTasks = clientTasksData.filter(t => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate) && t.status !== 'Completed').length;


// --- Helper Functions ---
const getStatusProps = (status: string, dueDate: Date | null): { variant: "success" | "info" | "secondary" | "destructive" | "outline"; icon?: React.ReactNode } => {
  const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && status !== 'Completed';

  if (isTaskOverdue) {
     return { variant: 'destructive', icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 inline-block" /> }; // Red for overdue (override status color)
  }

  switch (status?.toLowerCase()) {
    case 'completed': return { variant: 'success', icon: <CheckCircle className="w-3.5 h-3.5 mr-1 inline-block" /> }; // Green
    case 'in progress': return { variant: 'info' }; // Blue (or Yellow as per user suggestion - adjust 'info' style or use 'warning')
    case 'open': return { variant: 'secondary' }; // Gray
    default: return { variant: 'outline' };
  }
};


/**
 * ClientMyTasksPage Component
 *
 * Displays the logged-in client's tasks with filters and details.
 */
export default function ClientMyTasksPage() {
  // --- State for Filters (Conceptual) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ project: 'all', status: 'all', dueDate: 'all' });
  // const [tasks, setTasks] = useState(clientTasksData); // Would be fetched/filtered data

  // Determine if there are any tasks to display
  const hasTasks = clientTasksData.length > 0; // Replace with check on fetched data state

  const handleTaskCheck = (taskId: string, checked: boolean | 'indeterminate') => {
     console.log(`Task ${taskId} marked as ${checked ? 'Done' : 'Not Done'}`);
     // Implement API call to update task status if client responsibility
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-600">Tasks and milestones for your active projects.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 pb-4 border-b">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search by task name..." className="pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select /* value={filters.project} ... */ >
               <SelectTrigger className="w-full sm:w-[180px]">
                 <FolderKanban className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Project" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Projects</SelectItem>
                 <SelectItem value="proj-brand">Brand Refresh</SelectItem>
                 <SelectItem value="proj-web">Website Redesign</SelectItem>
                  {/* Add more projects dynamically */}
               </SelectContent>
             </Select>
             <Select /* value={filters.status} ... */ >
               <SelectTrigger className="w-full sm:w-[160px]">
                 <ListFilter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Statuses</SelectItem>
                 <SelectItem value="open">Open</SelectItem>
                 <SelectItem value="in progress">In Progress</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
               </SelectContent>
             </Select>
             <Select /* value={filters.dueDate} ... */ >
               <SelectTrigger className="w-full sm:w-[160px]">
                 <CalendarClock className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Due Date" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Due Dates</SelectItem>
                 <SelectItem value="today">Due Today</SelectItem>
                 <SelectItem value="this_week">Due This Week</SelectItem>
                 <SelectItem value="overdue">Overdue</SelectItem>
               </SelectContent>
             </Select>
          </div>
      </div>

       {/* 3. Progress Overview (Optional) */}
       {hasTasks && (
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-green-600">Completed</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{completedTasks}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle><Loader className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{inProgressTasks}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-red-600">Overdue</CardTitle><AlertTriangle className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{overdueTasks}</div></CardContent></Card>
         </div>
       )}


      {/* 2. Task Table View */}
      {hasTasks ? (
        <Card className="shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                   {/* Optional Checkbox */}
                   <TableHead className="w-[40px] px-4"></TableHead>
                  <TableHead className="min-w-[200px]">Task</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-[80px] text-center">Notes</TableHead>
                  <TableHead className="w-[80px] text-center">Files</TableHead>
                  {/* Optional Actions Column */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientTasksData.map((task) => {
                  const statusProps = getStatusProps(task.status, task.dueDate ? new Date(task.dueDate) : null);
                  const isTaskOverdue = task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate) && task.status !== 'Completed';

                  return (
                    <TableRow key={task.id} className={`hover:bg-gray-50 ${isTaskOverdue ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                       <TableCell className="px-4">
                          {/* Add Checkbox if client can mark tasks done */}
                          <Checkbox
                             id={`task-check-${task.id}`}
                             // checked={task.status === 'Completed'} // Or based on client action
                             // onCheckedChange={(checked) => handleTaskCheck(task.id, checked)}
                             aria-label={`Mark task ${task.name} as done`}
                          />
                       </TableCell>
                      <TableCell className="font-medium text-gray-800">
                         <label htmlFor={`task-check-${task.id}`} className="cursor-pointer hover:underline">{task.name}</label>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{task.project}</TableCell>
                      <TableCell>
                        <Badge variant={statusProps.variant} className="capitalize">
                           {statusProps.icon} {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yy') : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                         {task.notes ? (
                            <TooltipProvider delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700"><MessageSquare className="w-4 h-4" /></Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{task.notes}</p></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                         ) : (
                            <span className="text-gray-400">-</span>
                         )}
                      </TableCell>
                      <TableCell className="text-center">
                         {task.files > 0 ? (
                             <TooltipProvider delayDuration={100}>
                               <Tooltip>
                                 <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-700">
                                       <Paperclip className="w-4 h-4" />
                                       <span className="text-xs ml-0.5">{task.files}</span>
                                    </Button>
                                 </TooltipTrigger>
                                 <TooltipContent><p>{task.files} file(s) attached</p></TooltipContent>
                               </Tooltip>
                             </TooltipProvider>
                         ) : (
                            <span className="text-gray-400">-</span>
                         )}
                      </TableCell>
                       {/* Optional Actions */}
                       {/* <TableCell className="text-right"> <Button variant="outline" size="xs">View</Button> </TableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
           {/* Add Pagination Controls Here if needed */}
        </Card>
      ) : (
        // 4. Empty State
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-white">
           <ClipboardList className="w-16 h-16 text-gray-400 mb-4" />
           <h2 className="text-xl font-semibold text-gray-700 mb-2">You don’t have any tasks assigned yet.</h2>
           <p className="text-gray-500 mb-6 max-w-md">Tasks related to your projects, including items requiring your feedback or approval, will appear here once they are created by the project team.</p>
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => { /* Navigate to projects page */ }}>
                <Briefcase className="w-4 h-4 mr-2" /> View My Projects
             </Button>
             <Button variant="default">
                <Phone className="w-4 h-4 mr-2" /> Contact Support
             </Button>
           </div>
        </div>
      )}
    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mock data with API calls specific to the logged-in client's tasks. Apply filters server-side or client-side.
// 2. State Management: Use state for filters and fetched task data.
// 3. Client Actions: Implement logic if clients can mark tasks as done (e.g., `handleTaskCheck`). This requires API integration.
// 4. Notes/Files Display: The current implementation shows icons. Enhance this to show notes in a tooltip or modal, and link to actual files.
// 5. Responsiveness: Ensure the table layout adapts reasonably well to smaller screens, or consider a card-based layout for mobile.

// dashboard/page.tsx
'use client'; // Keep if using Next.js App Router features or hooks like useState

import React, { useState } from 'react';
import { format, formatDistanceToNow, isToday, startOfWeek, endOfWeek } from 'date-fns'; // For date formatting and calculations
import { subHours, subDays, subMinutes, parseISO } from 'date-fns'; // Ensure all needed date-fns functions are imported
import {
  UsersIcon,
  RectangleStackIcon, // Replaced CheckBadgeIcon for Projects
  ClockIcon,          // Pending Tasks, Recent Files
  CalendarDaysIcon,   // Upcoming Meetings
  FunnelIcon,
  Bars3Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  DocumentIcon,       // Generic file icon
  DocumentTextIcon,   // For DOCX
  PhotoIcon,          // For images
  VideoCameraIcon,    // For video
  CpuChipIcon,        // Example for ZIP/Archive
  ClipboardDocumentIcon, // Example for PDF
  CheckCircleIcon,    // Task Completion %
  ExclamationTriangleIcon, // Overdue Tasks
  StarIcon,           // Pin/Favorite
  UserCircleIcon,     // Assignee Avatar Fallback
  EyeIcon,            // View action
  LinkIcon,           // Meeting Link
  BellIcon,           // Activity Feed Item
  CheckIcon,          // Mark Complete action
  ListBulletIcon,     // Activity Feed Title
  SparklesIcon,       // Insights Title (Optional)
  PencilSquareIcon,   // Edit Focus Goals
  MapPinIcon,         // Focus Goals Title
} from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming shadcn/ui
import { Badge } from "@/components/ui/badge"; // Assuming shadcn/ui
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"; // Assuming shadcn/ui
import { Progress } from "@/components/ui/progress"; // Assuming shadcn/ui
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; // Assuming shadcn/ui
import { Separator } from "@/components/ui/separator"; // Assuming shadcn/ui
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Assuming shadcn/ui
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip"; // Ensure Tooltip components are imported

// --- Mock Data (Replace with actual data fetching) ---

// Get current time for dynamic greeting
const getCurrentGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};
const userName = "Allan"; // Replace with dynamic user name

// Updated Stats Data
const statsData = [
  { name: 'Active Clients', value: '24', icon: UsersIcon, change: '+2 this week', changeType: 'increase' },
  { name: 'Active Projects', value: '18', icon: RectangleStackIcon, change: '-1 this week', changeType: 'decrease' },
  { name: 'Pending Tasks', value: '42', icon: ClockIcon, change: '+5 this week', changeType: 'increase' },
  { name: 'Upcoming Meetings', value: '7', icon: CalendarDaysIcon, change: '3 today', changeType: 'neutral' },
  { name: '% Task Completion', value: '74%', icon: CheckCircleIcon, change: '+3% this month', changeType: 'increase' }, // NEW
  { name: 'Overdue Tasks', value: '3', icon: ExclamationTriangleIcon, change: 'Needs attention', changeType: 'warning' }, // NEW
];

// Updated Tasks Data with Assignees
const tasksData = {
  todo: [
    { id: 'task1', title: 'Website Redesign Kickoff Prep', client: 'Acme Corp', dueDate: '2025-04-25', priority: 'High', assignee: { name: 'Alice', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' } },
    { id: 'task2', title: 'Content Strategy Outline', client: 'Beta LLC', dueDate: '2025-04-28', priority: 'Medium', assignee: { name: 'Bob', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' } },
    { id: 'task7', title: 'Finalize Q2 Budget', client: 'Internal', dueDate: '2025-04-23', priority: 'High', assignee: null }, // Unassigned
  ],
  inProgress: [
    { id: 'task3', title: 'SEO Keyword Research', client: 'Gamma Inc.', dueDate: '2025-04-30', priority: 'Medium', assignee: { name: 'Charlie', avatar: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' } },
    { id: 'task4', title: 'Social Media Ad Creatives', client: 'Delta Co', dueDate: '2025-05-02', priority: 'Low', assignee: { name: 'Alice', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' } },
  ],
  done: [
    { id: 'task5', title: 'Brand Identity Guidelines', client: 'Epsilon Ltd', completedDate: '2025-04-18', priority: 'High', assignee: { name: 'Alice', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' } },
    { id: 'task6', title: 'Setup Email Marketing Flow', client: 'Zeta Corp', completedDate: '2025-04-15', priority: 'Medium', assignee: { name: 'Bob', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' } },
  ],
};

// Updated Meetings Data
const meetingsData = [
    { id: 'meet1', clientName: 'Acme Corp', dateTime: '2025-04-24T10:00:00Z', purpose: 'Website Kickoff', link: 'https://meet.google.com/xyz' },
    { id: 'meet2', clientName: 'Beta Inc', dateTime: '2025-04-28T14:00:00Z', purpose: 'Strategy Session', link: 'https://zoom.us/j/123' },
    { id: 'meet3', clientName: 'Gamma Inc', dateTime: '2025-05-15T16:00:00Z', purpose: 'SEO Review', link: 'https://meet.google.com/abc' }, // Example: Today at 4 PM
];

// Updated Recent Files Data
const recentFilesData = [
    { id: 'file1', name: 'Project_Brief_v2.pdf', uploader: 'Sarah', client: 'Acme Corp', uploadedOn: subHours(new Date(), 2), size: '1.3 MB', icon: ClipboardDocumentIcon, isPinned: false },
    { id: 'file2', name: 'Content_Ideas.docx', uploader: 'You', client: 'Beta LLC', uploadedOn: subHours(new Date(), 18), size: '45 KB', icon: DocumentTextIcon, isPinned: true },
    { id: 'file4', name: 'Logo_Final_RGB.png', uploader: 'Alice', client: 'Delta Co', uploadedOn: subDays(new Date(), 1), size: '2.1 MB', icon: PhotoIcon, isPinned: false },
    { id: 'file6', name: 'Client_Assets.zip', uploader: 'You', client: 'Zeta Corp', uploadedOn: subDays(new Date(), 3), size: '15.7 MB', icon: CpuChipIcon, isPinned: false },
];

// New Data: Recent Activity
const activityFeedData = [
  { id: 'act1', user: 'Sarah', avatar: 'https://placehold.co/32x32/ddd6fe/4c1d95?text=SC', action: 'uploaded', item: 'Logo_Concepts.pdf', target: 'Delta Co Project', time: subMinutes(new Date(), 15) },
  { id: 'act2', user: 'John', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=JD', action: 'completed task', item: 'SEO Keyword Research', target: '', time: subHours(new Date(), 1) },
  { id: 'act3', user: 'Alice', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS', action: 'added note to', item: 'Website Redesign', target: 'Acme Corp Project', time: subHours(new Date(), 3) },
  { id: 'act4', user: 'You', avatar: '', action: 'scheduled meeting with', item: 'Beta LLC', target: '', time: subHours(new Date(), 5) },
];

// New Data: This Week's Focus
const focusGoalsData = [
  { id: 'goal1', text: 'Finalize Acme Corp website mockups' },
  { id: 'goal2', text: 'Launch Beta LLC social media campaign' },
  { id: 'goal3', text: 'Prepare Q3 strategy presentation' },
];

// --- Helper Components & Functions ---

// Helper functions for Stats Card colors
const getIconColorClass = (changeType?: string): string => {
    switch (changeType) {
      case 'increase': return 'text-green-500';
      case 'decrease': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      default: return 'text-gray-400'; // Neutral color
    }
};

const getChangeTextColorClass = (changeType?: string): string => {
     switch (changeType) {
      case 'increase': return 'text-green-600';
      case 'decrease': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      default: return 'text-gray-500';
    }
};


// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <Badge variant="outline" className={`text-xs font-medium px-1.5 py-0.5 ${styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      {priority}
    </Badge>
  );
};

// Kanban Task Card Component
const KanbanTaskCard = ({ task }: { task: any }) => {
  return (
    <Card className="p-3 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-200 cursor-grab group relative"> {/* Add group and relative for hover actions */}
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-medium text-gray-800 leading-tight">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>
      <p className="text-xs text-gray-500 mb-2">{task.client}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{task.dueDate}</span>
        {task.assignee ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-5 w-5 border">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-xs">{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent><p>{task.assignee.name}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider delayDuration={100}>
             <Tooltip>
               <TooltipTrigger>
                  <UserCircleIcon className="h-5 w-5 text-gray-400" />
                </TooltipTrigger>
               <TooltipContent><p>Unassigned</p></TooltipContent>
             </Tooltip>
           </TooltipProvider>
        )}
      </div>
      {/* Optional: Quick Actions on hover */}
       <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-green-600"><CheckIcon className="w-4 h-4" /></Button>
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600"><PencilIcon className="w-4 h-4" /></Button>
      </div>
    </Card>
  );
};


// --- Main Dashboard Component ---
export default function DashboardHomeV3() {
  // --- State ---
  const [kanbanFilter, setKanbanFilter] = useState('all');
  const [recentFilesFilter, setRecentFilesFilter] = useState('all');

  // --- Handlers ---
  const handleFileUpload = (files: FileList | null) => {
     if (files) {
        console.log("Files selected/dropped:", Array.from(files).map(f => f.name));
        // Implement upload logic
     }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Welcome Header */}
      <div className="fade-in"> {/* Simple fade-in example class */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getCurrentGreeting()}, {userName} 👋</h1>
        <p className="text-sm text-gray-600 mt-1">Here's what's happening today.</p>
      </div>

      {/* Top Stats Section - UPDATED STRUCTURE */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 slide-up">
        {statsData.map((item) => (
          // Updated Card structure for centering and icon placement
          <Card key={item.name} className="shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md p-4 sm:p-5 flex flex-col items-center text-center">
             {/* Icon (Above Title, Colored, Larger) */}
             <item.icon className={`h-8 w-8 mb-2 ${getIconColorClass(item.changeType)}`} aria-hidden="true" />
             {/* Title */}
             <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
             {/* Value */}
             <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
             {/* Change */}
             {item.change && ( // Conditionally render change text if it exists
                <div className={`text-xs mt-2 ${getChangeTextColorClass(item.changeType)}`}>
                  {item.change}
                </div>
             )}
          </Card>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         {/* Left Column (Kanban + Meetings) */}
         <div className="lg:col-span-2 space-y-8">

            {/* Project Tracker (Kanban) */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold">Project Tracker</CardTitle>
                {/* Filters */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto gap-1">
                      <FunnelIcon className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Client</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Assignee</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Status</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                 {/* TODO: Implement Drag and Drop Context Here (e.g., using dnd-kit) */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* To Do Column */}
                    <div className="bg-gray-100/60 rounded-lg p-3 flex flex-col space-y-3 border border-gray-200 min-h-[200px]">
                       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">To Do ({tasksData.todo.length})</h3>
                       {/* TODO: Make this a Droppable area */}
                       <div className="space-y-3 flex-1">
                          {tasksData.todo.map(task => <KanbanTaskCard key={task.id} task={task} />)}
                       </div>
                       <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                          <PlusIcon className="h-4 w-4 mr-1.5" /> Add Task
                       </Button>
                    </div>
                     {/* In Progress Column */}
                    <div className="bg-gray-100/60 rounded-lg p-3 flex flex-col space-y-3 border border-gray-200 min-h-[200px]">
                       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">In Progress ({tasksData.inProgress.length})</h3>
                        {/* TODO: Make this a Droppable area */}
                       <div className="space-y-3 flex-1">
                          {tasksData.inProgress.map(task => <KanbanTaskCard key={task.id} task={task} />)}
                       </div>
                        <Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-200">
                          <PlusIcon className="h-4 w-4 mr-1.5" /> Add Task
                       </Button>
                    </div>
                     {/* Done Column */}
                    <div className="bg-gray-100/60 rounded-lg p-3 flex flex-col space-y-3 border border-gray-200 min-h-[200px]">
                       <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-1">Done ({tasksData.done.length})</h3>
                        {/* TODO: Make this a Droppable area */}
                       <div className="space-y-3 flex-1 opacity-80"> {/* Slight opacity for done */}
                          {tasksData.done.map(task => (
                             <Card key={task.id} className="p-3 shadow-sm border border-gray-200 bg-white">
                                <div className="flex justify-between items-start mb-1">
                                   <h4 className="text-sm font-medium text-gray-700 line-through">{task.title}</h4>
                                   <PriorityBadge priority={task.priority} />
                                </div>
                                <p className="text-xs text-gray-500 mb-2">{task.client}</p>
                                <div className="flex justify-between items-center">
                                   <span className="text-xs text-gray-500">{task.completedDate}</span>
                                   {task.assignee && (
                                      <Avatar className="h-5 w-5 border"><AvatarImage src={task.assignee.avatar} /><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                                   )}
                                </div>
                             </Card>
                          ))}
                       </div>
                       {/* No Add Task button typically */}
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-2">
               <CardHeader>
                  <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {meetingsData.map(meeting => {
                        // Ensure dateTime is parsed correctly, handle potential invalid dates
                        let meetingDate: Date | null = null;
                        try {
                           meetingDate = parseISO(meeting.dateTime);
                        } catch (e) {
                           console.error("Invalid date format for meeting:", meeting.id, meeting.dateTime);
                        }
                        const isMeetingToday = meetingDate ? isToday(meetingDate) : false;

                        return (
                           <div key={meeting.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-md border hover:bg-gray-50 transition-colors">
                              <div>
                                 <p className="text-sm font-medium text-gray-900">{meeting.purpose}</p>
                                 <p className="text-xs text-gray-500">With: {meeting.clientName}</p>
                              </div>
                              <div className="text-sm text-gray-700 text-left sm:text-right">
                                 {isMeetingToday && <Badge variant="warning" className="mr-2 mb-1 sm:mb-0">Today</Badge>}
                                 {meetingDate ? format(meetingDate, 'MMM dd, p') : 'Invalid Date'}
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                 {meeting.link && (
                                    <Button variant="outline" size="sm" asChild>
                                       <a href={meeting.link} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-3.5 h-3.5 mr-1.5" /> Join</a>
                                    </Button>
                                 )}
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700">
                                    <PencilIcon className="w-4 h-4" />
                                    <span className="sr-only">Add Notes</span>
                                 </Button>
                              </div>
                           </div>
                        );
                     })}
                     {meetingsData.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings.</p>}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Right Column (Files, Activity, Focus) */}
         <div className="space-y-8">

             {/* This Week's Focus */}
             <Card className="shadow-sm border border-gray-200 fade-in-delay-3">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                 <CardTitle className="text-base font-semibold flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> This Week's Focus</CardTitle>
                 <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700">
                    <PencilSquareIcon className="w-4 h-4" />
                    <span className="sr-only">Edit Goals</span>
                 </Button>
               </CardHeader>
               <CardContent className="space-y-2">
                  {focusGoalsData.map(goal => (
                     <div key={goal.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border">
                        <CheckIcon className="w-4 h-4 text-green-600" /> {/* Or a different icon */}
                        <p className="text-sm text-gray-800">{goal.text}</p>
                     </div>
                  ))}
                  {focusGoalsData.length === 0 && <p className="text-sm text-gray-500 text-center py-2">Set your focus goals for the week!</p>}
               </CardContent>
             </Card>

            {/* Recent Files */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-4">
               <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold">Recent Files</CardTitle>
                   <div className="mt-2">
                      {/* Filter Dropdown */}
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="outline" size="xs" className="gap-1 h-7 px-2">
                             <FunnelIcon className="h-3 w-3" />
                             <span className="text-xs">{recentFilesFilter === 'all' ? 'All Files' : recentFilesFilter}</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="start">
                           <DropdownMenuItem onClick={() => setRecentFilesFilter('all')}>All Files</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setRecentFilesFilter('Client Uploads')}>Client Uploads</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setRecentFilesFilter('My Uploads')}>My Uploads</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setRecentFilesFilter('Last 7 Days')}>Last 7 Days</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                   </div>
               </CardHeader>
               <CardContent className="space-y-3">
                  {recentFilesData.map(file => (
                     <div key={file.id} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <file.icon className="h-6 w-6 text-gray-500 flex-shrink-0" aria-hidden="true" />
                           <div className="overflow-hidden">
                              <p className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline" title={file.name}>{file.name}</p>
                              <p className="text-xs text-gray-500">
                                 {file.uploader} ・ {formatDistanceToNow(file.uploadedOn, { addSuffix: true })} ・ {file.size}
                              </p>
                           </div>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-yellow-500">
                              <StarIcon className={`w-4 h-4 ${file.isPinned ? 'fill-yellow-400 text-yellow-500' : ''}`} />
                              <span className="sr-only">{file.isPinned ? 'Unpin' : 'Pin'}</span>
                           </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-blue-600">
                              <EyeIcon className="w-4 h-4" />
                              <span className="sr-only">Preview</span>
                           </Button>
                        </div>
                     </div>
                  ))}
                   {/* Placeholder Dropzone */}
                   <div
                      className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      onDragOver={(e) => e.preventDefault()} // Basic drag over handler
                      onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }} // Basic drop handler
                   >
                      <ArrowUpTrayIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Drag & drop files here or</p>
                      <Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => document.getElementById('file-upload-input')?.click()}>
                         browse to upload
                      </Button>
                      <input type="file" id="file-upload-input" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} />
                   </div>
               </CardContent>
            </Card>

            {/* Recent Activity Feed */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-5">
               <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2"><ListBulletIcon className="w-4 h-4"/> Recent Activity</CardTitle>
               </CardHeader>
               <CardContent>
                  <ScrollArea className="h-[250px] pr-3"> {/* Limit height and add scroll */}
                     <div className="space-y-4">
                        {activityFeedData.map(activity => (
                           <div key={activity.id} className="flex items-start gap-3">
                              <Avatar className="h-7 w-7 border mt-0.5">
                                 <AvatarImage src={activity.avatar} />
                                 <AvatarFallback className="text-xs">{activity.user === 'You' ? 'You' : activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <p className="text-sm text-gray-800">
                                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.item}</span> {activity.target && <span className="text-gray-600">in {activity.target}</span>}
                                 </p>
                                 <p className="text-xs text-gray-500">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </ScrollArea>
               </CardContent>
            </Card>

             {/* Optional: Insights Card */}
             {/* <Card className="shadow-sm border border-gray-200 fade-in-delay-6">
                <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><SparklesIcon className="w-4 h-4 text-purple-500"/> Insights</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-gray-700">Task load is up <span className="font-bold text-green-600">22%</span> compared to last week.</p></CardContent>
             </Card> */}

         </div>
      </div>
    </div>
  );
}

// --- Add CSS for simple animations (in your global CSS file) ---
/*
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.fade-in { animation: fadeIn 0.5s ease-out forwards; }
.slide-up { animation: slideUp 0.5s ease-out forwards; opacity: 0; } // Start hidden

.fade-in-delay-1 { animation: fadeIn 0.5s ease-out 0.1s forwards; opacity: 0; }
.fade-in-delay-2 { animation: fadeIn 0.5s ease-out 0.2s forwards; opacity: 0; }
.fade-in-delay-3 { animation: fadeIn 0.5s ease-out 0.3s forwards; opacity: 0; }
.fade-in-delay-4 { animation: fadeIn 0.5s ease-out 0.4s forwards; opacity: 0; }
.fade-in-delay-5 { animation: fadeIn 0.5s ease-out 0.5s forwards; opacity: 0; }
.fade-in-delay-6 { animation: fadeIn 0.5s ease-out 0.6s forwards; opacity: 0; }
*/

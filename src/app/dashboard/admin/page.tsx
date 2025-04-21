// dashboard/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react'; // Added useMemo
import { format, formatDistanceToNow, isToday, isPast, startOfWeek, endOfWeek } from 'date-fns';
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
  ClipboardDocumentIcon, // Example for PDF, Attachments
  CheckCircleIcon,    // Task Completion %
  ExclamationTriangleIcon, // Overdue Tasks
  StarIcon,           // Pin/Favorite
  UserCircleIcon,     // Assignee Avatar Fallback
  EyeIcon,            // View action
  LinkIcon,           // Meeting Link
  BellIcon,           // Activity Feed Item
  CheckIcon,          // Mark Complete action, Subtask Check
  ListBulletIcon,     // Activity Feed Title
  SparklesIcon,       // Insights Title (Optional)
  PencilSquareIcon,   // Edit Focus Goals
  MapPinIcon,         // Focus Goals Title
  BuildingOffice2Icon, // For Internal Tasks
  TagIcon,             // For Tags - Not used directly, using Badge
  EllipsisHorizontalIcon, // For card actions menu - Replaced by individual icons
  XMarkIcon as XMarkIconOutline, // Renamed for clarity
  PaperclipIcon,      // Attachments
  ChatBubbleLeftIcon, // Comments
  TrashIcon as TrashIconOutline, // Explicit outline import
  DocumentDuplicateIcon, // Duplicate Action
  ArrowsRightLeftIcon, // Move Action
  UserPlusIcon,       // Change Assignee Action
  ViewColumnsIcon,    // Kanban View Icon
  ListBulletIcon as ListIcon, // List View Icon
} from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Added Input for inline edit example
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Updated import for DialogClose
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select for filters
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { Checkbox } from "@/components/ui/checkbox"; // Added Checkbox
import { Label } from "@/components/ui/label"; // Added Label
// ** Make sure you run `npx shadcn-ui@latest add toggle-group` **
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // Added ToggleGroup
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Added Table

// --- Mock Data ---
const getCurrentGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};
const userName = "Allan"; // Replace with dynamic user name

const statsData = [
  { name: 'Active Clients', value: '24', icon: UsersIcon, change: '+2 this week', changeType: 'increase' },
  { name: 'Active Projects', value: '18', icon: RectangleStackIcon, change: '-1 this week', changeType: 'decrease' },
  { name: 'Pending Tasks', value: '42', icon: ClockIcon, change: '+5 this week', changeType: 'increase' },
  { name: 'Upcoming Meetings', value: '7', icon: CalendarDaysIcon, change: '3 today', changeType: 'neutral' },
  { name: '% Task Completion', value: '74%', icon: CheckCircleIcon, change: '+3% this month', changeType: 'increase' },
  { name: 'Overdue Tasks', value: '3', icon: ExclamationTriangleIcon, change: 'Needs attention', changeType: 'warning' },
];

// ** UPDATED Tasks Data with more fields for Modal **
const tasksData = {
  todo: [
    { id: 'task1', title: 'Website Redesign Kickoff Prep', client: 'Acme Corp', project: 'Website Redesign', dueDate: '2025-04-25', priority: 'High', assignee: { name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, description: 'Prepare agenda and invite list.\n- Finalize stakeholders\n- Draft initial questions', tags: ['#Planning', '#Kickoff'], isInternal: false, status: 'To Do', subtasks: [{id: 'sub1', text: 'Draft agenda', completed: true}, {id: 'sub2', text: 'Confirm attendees', completed: false}], attachments: [{id: 'att1', name: 'Client Brief.pdf', type: 'pdf'}], comments: [{id: 'com1', user: 'Bob', text: 'Can I join?', timestamp: subHours(new Date(), 1)}] },
    { id: 'task2', title: 'Content Strategy Outline', client: 'Beta LLC', project: 'Content Strategy', dueDate: '2025-04-28', priority: 'Medium', assignee: { name: 'Bob Johnson', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, description: 'Draft initial outline based on brief.', tags: ['#Content'], isInternal: false, status: 'To Do', subtasks: [], attachments: [], comments: [] },
    { id: 'task7', title: 'Finalize Q2 Budget', client: 'Internal', project: 'Admin', dueDate: '2025-04-23', priority: 'High', assignee: null, description: 'Review department submissions.', tags: ['#Finance'], isInternal: true, status: 'To Do', subtasks: [], attachments: [], comments: [] },
  ],
  inProgress: [
    { id: 'task3', title: 'SEO Keyword Research', client: 'Gamma Inc.', project: 'SEO Audit', dueDate: '2025-04-30', priority: 'Medium', assignee: { name: 'Charlie Davis', avatar: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' }, description: 'Identify primary and secondary keywords.', tags: ['#SEO'], isInternal: false, status: 'In Progress', subtasks: [], attachments: [], comments: [] },
    { id: 'task4', title: 'Social Media Ad Creatives', client: 'Delta Co', project: 'Ad Campaign', dueDate: '2025-05-02', priority: 'Low', assignee: { name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, description: 'Develop 3 variations for Facebook.', tags: ['#Social', '#Design'], isInternal: false, status: 'In Progress', subtasks: [], attachments: [], comments: [] },
  ],
  done: [
    { id: 'task5', title: 'Brand Identity Guidelines', client: 'Epsilon Ltd', project: 'Branding', completedDate: '2025-04-18', priority: 'High', assignee: { name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, description: 'Final guidelines approved.', tags: ['#Design', '#Brand'], isInternal: false, status: 'Done', subtasks: [], attachments: [], comments: [] },
    { id: 'task6', title: 'Setup Email Marketing Flow', client: 'Zeta Corp', project: 'Marketing Automation', completedDate: '2025-04-15', priority: 'Medium', assignee: { name: 'Bob Johnson', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, description: 'Welcome sequence is live.', tags: ['#Email', '#Marketing'], isInternal: false, status: 'Done', subtasks: [], attachments: [], comments: [] },
  ],
};
// Combine all tasks for list view filtering and modal lookup
const allTasks = [...tasksData.todo, ...tasksData.inProgress, ...tasksData.done];

const meetingsData = [
    { id: 'meet1', clientName: 'Acme Corp', dateTime: '2025-04-24T10:00:00Z', purpose: 'Website Kickoff', link: 'https://meet.google.com/xyz' },
    { id: 'meet2', clientName: 'Beta Inc', dateTime: '2025-04-28T14:00:00Z', purpose: 'Strategy Session', link: 'https://zoom.us/j/123' },
    { id: 'meet3', clientName: 'Gamma Inc', dateTime: format(new Date(), "yyyy-MM-dd'T'16:00:00"), purpose: 'SEO Review', link: 'https://meet.google.com/abc' },
];

const recentFilesData = [
    { id: 'file1', name: 'Project_Brief_v2.pdf', uploader: 'Sarah', client: 'Acme Corp', uploadedOn: subHours(new Date(), 2), size: '1.3 MB', icon: ClipboardDocumentIcon, isPinned: false },
    { id: 'file2', name: 'Content_Ideas.docx', uploader: 'You', client: 'Beta LLC', uploadedOn: subHours(new Date(), 18), size: '45 KB', icon: DocumentTextIcon, isPinned: true },
    { id: 'file4', name: 'Logo_Final_RGB.png', uploader: 'Alice', client: 'Delta Co', uploadedOn: subDays(new Date(), 1), size: '2.1 MB', icon: PhotoIcon, isPinned: false },
    { id: 'file6', name: 'Client_Assets.zip', uploader: 'You', client: 'Zeta Corp', uploadedOn: subDays(new Date(), 3), size: '15.7 MB', icon: CpuChipIcon, isPinned: false },
];

const activityFeedData = [
  { id: 'act1', user: 'Sarah', avatar: 'https://placehold.co/32x32/ddd6fe/4c1d95?text=SC', action: 'uploaded', item: 'Logo_Concepts.pdf', target: 'Delta Co Project', time: subMinutes(new Date(), 15) },
  { id: 'act2', user: 'John', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=JD', action: 'completed task', item: 'SEO Keyword Research', target: '', time: subHours(new Date(), 1) },
  { id: 'act3', user: 'Alice', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS', action: 'added note to', item: 'Website Redesign', target: 'Acme Corp Project', time: subHours(new Date(), 3) },
  { id: 'act4', user: 'You', avatar: '', action: 'scheduled meeting with', item: 'Beta LLC', target: '', time: subHours(new Date(), 5) },
];

const focusGoalsData = [
  { id: 'goal1', text: 'Finalize Acme Corp website mockups' },
  { id: 'goal2', text: 'Launch Beta LLC social media campaign' },
  { id: 'goal3', text: 'Prepare Q3 strategy presentation' },
];

// --- Helper Components & Functions ---

const getIconColorClass = (changeType?: string): string => {
    switch (changeType) {
      case 'increase': return 'text-green-500';
      case 'decrease': return 'text-red-500';
      case 'warning': return 'text-orange-500';
      default: return 'text-gray-400';
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

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    High: 'bg-red-100 text-red-700 border-red-200 ring-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 ring-yellow-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-200',
  };
  return ( <Badge variant="outline" className={`text-xs font-semibold px-1.5 py-0.5 ring-1 ring-inset ${styles[priority as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200 ring-gray-200'}`}>{priority}</Badge> );
};

// ** UPDATED Kanban Task Card Component **
const KanbanTaskCard = ({ task, onCardClick }: { task: any; onCardClick: (taskId: string) => void }) => {
  // Attempt to parse the date, handle potential invalid format gracefully
  let dueDate: Date | null = null;
  if (task.dueDate) {
      try {
          // Ensure the date string is in a format parseISO understands (like YYYY-MM-DD)
          dueDate = parseISO(task.dueDate);
          if (isNaN(dueDate.getTime())) { dueDate = null; console.warn("Invalid due date format for task:", task.id, task.dueDate); }
      } catch (e) { console.error("Error parsing due date:", task.id, task.dueDate, e); dueDate = null; }
  }
  const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'Done';
  const isTaskDueToday = dueDate && isToday(dueDate) && task.status !== 'Done';

  // Placeholder state for inline editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(task.title);

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking title for edit
    // Enable inline editing - requires more state management and API calls
    // setIsEditingTitle(true);
    console.log("Inline edit title triggered for:", task.id); // Placeholder
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // TODO: Save updated title via API
    console.log("Save title:", currentTitle);
  };

  return (
    // TODO: Wrap this card with Draggable component from D&D library
    // Add `ref` for D&D library if needed
    <Card
      onClick={() => onCardClick(task.id)} // Make card clickable
      className="p-3 shadow-sm border border-gray-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group relative rounded-lg" // Enhanced hover, rounded-lg
    >
      {/* Edit/Delete Actions (Appear on Hover) */}
      <div className="absolute top-1 right-1 flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600" onClick={(e) => {e.stopPropagation(); console.log("Edit Task:", task.id)}}>
             <PencilIcon className="w-3.5 h-3.5" /> <span className="sr-only">Edit</span>
         </Button>
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600" onClick={(e) => {e.stopPropagation(); console.log("Delete Task:", task.id)}}>
             <TrashIconOutline className="w-3.5 h-3.5" /> <span className="sr-only">Delete</span>
          </Button>
      </div>

      {/* Priority & Internal Badge */}
      <div className="flex items-center justify-between mb-2">
         <PriorityBadge priority={task.priority} />
         {task.isInternal && (
             <TooltipProvider delayDuration={100}>
               <Tooltip>
                  <TooltipTrigger asChild>
                     {/* Using a Button for better focus indication */}
                     <Button variant="ghost" size="xs" className="h-auto px-1 py-0 ml-1 text-gray-500 hover:bg-gray-100">
                        <BuildingOffice2Icon className="w-3.5 h-3.5"/>
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>Internal Task</p></TooltipContent>
               </Tooltip>
             </TooltipProvider>
         )}
      </div>

      {/* Task Title (Potentially Editable) */}
      {isEditingTitle ? (
          <Input
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); }}
            className="text-sm font-semibold text-gray-900 mb-1 h-8 px-1 border-blue-400 ring-1 ring-blue-400" // Added ring for visibility
            autoFocus
            onClick={(e) => e.stopPropagation()} // Prevent card click
          />
      ) : (
          // Make title clickable to initiate edit (placeholder)
          <h4 onClick={handleTitleClick} className="text-sm font-semibold text-gray-900 mb-1 hover:text-blue-600 leading-tight cursor-text">{task.title}</h4>
      )}


      {/* Client/Project Info */}
      <p className="text-xs text-gray-600 mb-2">{task.client} {task.project && task.client !== 'Internal' ? `/ ${task.project}` : ''}</p>

      {/* Tags (Optional) */}
      {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 font-normal">{tag}</Badge>
              ))}
          </div>
      )}

      {/* Due Date & Assignee */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        {/* Due Date Highlighting */}
        <span className={`text-xs font-semibold ${isTaskOverdue ? 'text-red-600' : isTaskDueToday ? 'text-orange-600' : 'text-gray-500'}`}>
          {dueDate ? format(dueDate, 'MMM dd') : 'No due date'}
          {isTaskOverdue && ' (Overdue)'}
          {isTaskDueToday && ' (Today)'}
        </span>
        {/* Assignee Avatar with Tooltip */}
        {task.assignee ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className="h-6 w-6 border">
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
                  <UserCircleIcon className="h-6 w-6 text-gray-400" />
                </TooltipTrigger>
               <TooltipContent><p>Unassigned</p></TooltipContent>
             </Tooltip>
           </TooltipProvider>
        )}
      </div>
    </Card>
  );
};

// --- ** NEW Task Detail Modal Content Component ** ---
const TaskDetailModalContent = ({ taskId, onClose }: { taskId: string | null; onClose: () => void }) => { // Added onClose prop
    // TODO: Fetch actual task data based on taskId when modal opens using useEffect
    const task = taskId ? allTasks.find(t => t.id === taskId) : null; // Use combined list for lookup

    // Mock state for inputs within modal
    const [comment, setComment] = useState('');
    const [newSubtask, setNewSubtask] = useState('');
    // State for simulating subtask completion changes
    const [subtasks, setSubtasks] = useState(task?.subtasks || []);

    useEffect(() => {
        // When taskId changes, reset subtasks based on the new task
        setSubtasks(taskId ? allTasks.find(t => t.id === taskId)?.subtasks || [] : []);
    }, [taskId]);


    if (!task) {
        return <div className="p-6 text-center text-gray-500">Task not found or not selected.</div>;
    }

    const handleAddComment = () => { console.log("Add comment:", comment, "for task:", taskId); setComment(''); /* TODO: API Call */ };
    const handleAddSubtask = () => { console.log("Add subtask:", newSubtask, "for task:", taskId); setNewSubtask(''); /* TODO: API Call */ };
    const handleSubtaskToggle = (subtaskId: string, currentCompleted: boolean) => {
        console.log(`Toggle subtask ${subtaskId} to ${!currentCompleted} for task:`, taskId);
        // Update local state for immediate UI feedback
        setSubtasks(prev => prev.map(sub => sub.id === subtaskId ? {...sub, completed: !sub.completed} : sub));
        // TODO: API Call to update subtask status
    };
    const handleAttachmentUpload = (files: FileList | null) => { if (files) console.log("Upload attachments:", files, "for task:", taskId); /* TODO: API Call */ };

    let dueDate: Date | null = null;
    if (task.dueDate) { try { dueDate = parseISO(task.dueDate); if (isNaN(dueDate.getTime())) dueDate = null; } catch (e) { dueDate = null; } }

    return (
        <> {/* Use Fragment to allow direct children for flex layout */}
            {/* Header with Close Button */}
            <DialogHeader className="p-4 sm:p-6 border-b flex flex-row items-start justify-between sticky top-0 bg-white z-10">
                <div>
                    {/* TODO: Add inline edit capability for title */}
                    <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        {task.title}
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600"><PencilIcon className="w-4 h-4" /></Button>
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                       <PriorityBadge priority={task.priority} />
                       {task.isInternal && <Badge variant="secondary" className="text-xs"><BuildingOffice2Icon className="w-3 h-3 mr-1"/> Internal</Badge>}
                    </div>
                </div>
                 {/* Use DialogClose for better accessibility */}
                 <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="ml-auto flex-shrink-0 rounded-full">
                        <XMarkIconOutline className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                    </Button>
                 </DialogClose>
            </DialogHeader>

            {/* Main Content Scroll Area */}
            <ScrollArea className="flex-1 overflow-y-auto">
                {/* Added grid layout for content */}
                <div className="grid md:grid-cols-3 gap-x-6 gap-y-6 p-4 sm:p-6">
                    {/* Left Column (Meta, Description) */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Meta Info */}
                        <Card>
                            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2"> {/* Adjusted gap */}
                                    <span className="font-medium text-gray-600">Client:</span> <span>{task.client}</span>
                                    <span className="font-medium text-gray-600">Project:</span> <span>{task.project || '-'}</span>
                                    <span className="font-medium text-gray-600">Assignee:</span>
                                    <span>
                                        {task.assignee ? ( <div className="flex items-center gap-1.5"> <Avatar className="h-5 w-5"><AvatarImage src={task.assignee.avatar}/><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map((n:string) => n[0]).join('')}</AvatarFallback></Avatar> {task.assignee.name} </div> ) : <span className="italic text-gray-500">Unassigned</span>}
                                    </span>
                                    <span className="font-medium text-gray-600">Due Date:</span>
                                    {/* TODO: Make Due Date editable with DatePicker */}
                                    <span>{dueDate ? format(dueDate, 'MMM dd, yyyy') : 'Not set'}</span>
                                    <span className="font-medium text-gray-600">Status:</span>
                                    {/* TODO: Make Status editable with Select/Dropdown */}
                                    <span><Badge variant="outline">{task.status}</Badge></span>
                                    {task.tags && task.tags.length > 0 && (
                                        <>
                                            <span className="font-medium text-gray-600">Tags:</span>
                                            <div className="flex flex-wrap gap-1"> {task.tags.map((tag: string) => (<Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>))} </div>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base">Description</CardTitle>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600"><PencilIcon className="w-4 h-4" /></Button>
                            </CardHeader>
                            <CardContent>
                                {/* TODO: Replace with Markdown viewer or rich text editor */}
                                <Textarea readOnly value={task.description || 'No description provided.'} className="min-h-[100px] text-sm text-gray-700 bg-gray-50 border-none focus-visible:ring-0 whitespace-pre-wrap"/> {/* Added whitespace-pre-wrap */}
                            </CardContent>
                        </Card>

                        {/* Subtasks */}
                        <Card>
                            <CardHeader><CardTitle className="text-base">Subtasks ({subtasks.filter((s:any)=>s.completed).length}/{subtasks.length})</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {subtasks?.length > 0 ? subtasks.map((sub: any) => (
                                    <div key={sub.id} className="flex items-center space-x-2 group">
                                        <Checkbox id={`subtask-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubtaskToggle(sub.id, sub.completed)} />
                                        <Label htmlFor={`subtask-${sub.id}`} className={`text-sm flex-1 ${sub.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{sub.text}</Label>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIconOutline className="w-3.5 h-3.5"/></Button>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic">No subtasks added.</p>}
                                {/* Add Subtask Input */}
                                <div className="flex gap-2 pt-2 border-t mt-3">
                                    <Input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Add new subtask..." className="h-8 text-sm" onKeyDown={(e) => { if (e.key === 'Enter' && newSubtask.trim()) handleAddSubtask(); }} />
                                    <Button size="sm" onClick={handleAddSubtask} disabled={!newSubtask.trim()}>Add</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (Attachments, Comments) */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Attachments */}
                        <Card>
                            <CardHeader><CardTitle className="text-base">Attachments</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {/* Placeholder Dropzone */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors text-xs" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault(); handleAttachmentUpload(e.dataTransfer.files);}}>
                                    <ArrowUpTrayIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" /> Drag & drop or <Button variant="link" size="xs" className="p-0 h-auto" onClick={()=>document.getElementById('attach-input-modal')?.click()}>browse</Button>
                                    <input type="file" id="attach-input-modal" multiple className="hidden" onChange={(e)=>handleAttachmentUpload(e.target.files)} />
                                </div>
                                {/* List of attachments */}
                                {task.attachments?.length > 0 ? task.attachments.map((att: any) => (
                                    <div key={att.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded border text-sm group">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 flex-shrink-0"/>
                                            <span className="truncate hover:underline cursor-pointer">{att.name}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIconOutline className="w-3.5 h-3.5"/></Button>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic text-center py-2">No attachments.</p>}
                            </CardContent>
                        </Card>

                        {/* Comments */}
                        <Card>
                            <CardHeader><CardTitle className="text-base">Comments</CardTitle></CardHeader>
                            <CardContent className="space-y-3">
                                {task.comments?.length > 0 ? task.comments.map((com: any) => (
                                    <div key={com.id} className="flex items-start gap-2 text-sm">
                                        <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{com.user.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback></Avatar> {/* Add AvatarImage if available */}
                                        <div className="flex-1 bg-gray-50 p-2 rounded-md border">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-medium text-gray-900">{com.user}</span>
                                                <span className="text-xs text-gray-500">{formatDistanceToNow(com.timestamp, { addSuffix: true })}</span>
                                            </div>
                                            <p className="text-gray-700">{com.text}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-500 italic">No comments yet.</p>}
                                {/* Add Comment Input */}
                                <div className="flex gap-2 pt-3 border-t mt-3">
                                    <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment..." rows={2} className="text-sm"/>
                                    <Button size="sm" onClick={handleAddComment} disabled={!comment.trim()}>Post</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            {/* Modal Footer Actions */}
            <DialogFooter className="border-t p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sticky bottom-0 bg-white z-10">
                 <div className="flex flex-wrap gap-1">
                     <Button variant="outline" size="sm"><TrashIconOutline className="w-4 h-4 mr-1"/> Delete Task</Button>
                     <Button variant="outline" size="sm"><DocumentDuplicateIcon className="w-4 h-4 mr-1"/> Duplicate</Button>
                     {/* Add more actions like Move, Change Assignee */}
                 </div>
                 <DialogClose asChild>
                    <Button variant="secondary" size="sm">Close</Button>
                 </DialogClose>
            </DialogFooter>
        </>
    );
};


// --- Main Dashboard Component ---
export default function DashboardHomeV3() {
  // --- State ---
  const [kanbanFilters, setKanbanFilters] = useState({ priority: 'all', assignee: 'all', type: 'all' });
  const [recentFilesFilter, setRecentFilesFilter] = useState('all');
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // --- Handlers ---
  const handleFileUpload = (files: FileList | null) => { /* ... */ };
  const handleTaskCardClick = (taskId: string) => { setSelectedTaskId(taskId); setIsTaskDetailModalOpen(true); };
  const handleColumnTitleClick = (columnStatus: string) => { setSelectedColumn(columnStatus); setIsColumnModalOpen(true); };

  // --- Filtering Logic ---
  const filterTasks = (tasks: any[]) => {
      return tasks.filter(task =>
          (kanbanFilters.priority === 'all' || task.priority === kanbanFilters.priority) &&
          (kanbanFilters.type === 'all' || (kanbanFilters.type === 'internal' && task.isInternal) || (kanbanFilters.type === 'client' && !task.isInternal)) &&
          (kanbanFilters.assignee === 'all' || (kanbanFilters.assignee === 'me' && /* TODO: Check if task.assignee.id matches logged in user */ false) || (kanbanFilters.assignee === 'unassigned' && !task.assignee))
      );
  };
  const filteredTasks = useMemo(() => ({
      todo: filterTasks(tasksData.todo),
      inProgress: filterTasks(tasksData.inProgress),
      done: filterTasks(tasksData.done),
  }), [kanbanFilters]);
  const allFilteredTasks = useMemo(() => [ ...filteredTasks.todo, ...filteredTasks.inProgress, ...filteredTasks.done ], [filteredTasks]);


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Welcome Header */}
      <div className="fade-in"> <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getCurrentGreeting()}, {userName} 👋</h1> <p className="text-sm text-gray-600 mt-1">Here's what's happening today.</p> </div>

      {/* Top Stats Section */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 slide-up"> {statsData.map((item) => ( <Card key={item.name} className="shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md p-4 sm:p-5 flex flex-col items-center text-center"> <item.icon className={`h-8 w-8 mb-2 ${getIconColorClass(item.changeType)}`} aria-hidden="true" /> <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p> <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p> {item.change && ( <div className={`text-xs mt-2 ${getChangeTextColorClass(item.changeType)}`}>{item.change}</div> )} </Card> ))} </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         {/* Left Column (Kanban + Meetings) */}
         <div className="lg:col-span-2 space-y-8">

            {/* Project Tracker (Kanban/List View) */}
            <Card className="shadow-lg border border-gray-200 fade-in-delay-1 overflow-hidden rounded-xl">
              <CardHeader className="pb-4 px-4 sm:px-6 pt-5 border-b bg-white">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"> <CardTitle className="text-lg font-semibold">Project Tracker</CardTitle> <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as 'kanban' | 'list'); }} size="sm"> <ToggleGroupItem value="kanban" aria-label="Kanban View"><ViewColumnsIcon className="h-4 w-4 mr-1.5"/> Kanban</ToggleGroupItem> <ToggleGroupItem value="list" aria-label="List View"><ListIcon className="h-4 w-4 mr-1.5"/> List</ToggleGroupItem> </ToggleGroup> </div>
                 <div className="flex flex-wrap items-center gap-2 mt-4"> <span className="text-sm font-medium text-gray-500">Filter:</span> <Button variant={kanbanFilters.priority === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, priority: 'all'}))}>All</Button> <Button variant={kanbanFilters.priority === 'High' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2 text-red-600 hover:bg-red-50" onClick={() => setKanbanFilters(f => ({...f, priority: 'High'}))}>High</Button> <Button variant={kanbanFilters.priority === 'Medium' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2 text-yellow-600 hover:bg-yellow-50" onClick={() => setKanbanFilters(f => ({...f, priority: 'Medium'}))}>Medium</Button> <Button variant={kanbanFilters.priority === 'Low' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2 text-blue-600 hover:bg-blue-50" onClick={() => setKanbanFilters(f => ({...f, priority: 'Low'}))}>Low</Button> <Separator orientation="vertical" className="h-5 mx-1"/> <Button variant={kanbanFilters.type === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, type: 'all'}))}>Type</Button> <Button variant={kanbanFilters.type === 'internal' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, type: 'internal'}))}>Internal</Button> <Separator orientation="vertical" className="h-5 mx-1"/> <Button variant={kanbanFilters.assignee === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'all'}))}>Assignee</Button> <Button variant={kanbanFilters.assignee === 'me' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'me'}))}>Me</Button> <Button variant={kanbanFilters.assignee === 'unassigned' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'unassigned'}))}>Unassigned</Button> </div>
                 <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500"> <span>Legend:</span> <span className="flex items-center gap-1"><Badge className="bg-red-100 h-3 w-3 p-0 border-red-200"/> High</span> <span className="flex items-center gap-1"><Badge className="bg-yellow-100 h-3 w-3 p-0 border-yellow-200"/> Medium</span> <span className="flex items-center gap-1"><Badge className="bg-blue-100 h-3 w-3 p-0 border-blue-200"/> Low</span> <span className="flex items-center gap-1"><Badge variant="secondary" className="h-3 w-3 p-0 border-gray-300"/> Internal</span> </div>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === 'kanban' ? (
                     <div className="grid grid-cols-1 md:grid-cols-3"> {(['To Do', 'In Progress', 'Done'] as const).map((status) => { const statusKey = status === 'In Progress' ? 'inProgress' : status.toLowerCase().replace(' ', '') as keyof typeof filteredTasks; const columnTasks = filteredTasks[statusKey] || []; return ( <div key={status} className={`flex flex-col ${status !== 'Done' ? 'md:border-r border-gray-200' : ''}`}> <button onClick={() => handleColumnTitleClick(status)} className="sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm p-3 border-b border-gray-200 hover:bg-gray-200/80 transition-colors w-full"><h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">{status} ({columnTasks.length})</h3></button> <ScrollArea className="h-[450px] p-3 bg-gray-50/30"> <div className="space-y-3 min-h-[380px]"> {columnTasks.length > 0 ? ( columnTasks.map(task => <KanbanTaskCard key={task.id} task={task} onCardClick={handleTaskCardClick} />) ) : ( <div className="flex items-center justify-center h-full text-center py-10"><p className="text-sm text-gray-400 italic">No tasks in '{status}'</p></div> )} </div> <ScrollBar orientation="vertical" /> </ScrollArea> {status !== 'Done' && ( <div className="p-3 border-t border-gray-200 bg-gray-100/80"><Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-200/80"><PlusIcon className="h-4 w-4 mr-1.5" /> Add Task</Button></div> )} {status === 'Done' && <div className="p-3 border-t border-transparent bg-gray-50/30 h-[53px]"></div>} </div> ); })} </div>
                ) : (
                    <ScrollArea className="h-[565px]"> <Table> <TableHeader className="sticky top-0 bg-gray-100/80 backdrop-blur-sm z-10"> <TableRow> <TableHead className="w-[50%]">Task</TableHead> <TableHead>Status</TableHead> <TableHead>Priority</TableHead> <TableHead>Due Date</TableHead> <TableHead>Assignee</TableHead> </TableRow> </TableHeader> <TableBody> {allFilteredTasks.length > 0 ? allFilteredTasks.map(task => { let dueDate: Date | null = null; if (task.dueDate) { try { dueDate = parseISO(task.dueDate); if (isNaN(dueDate.getTime())) dueDate = null; } catch (e) { dueDate = null; } } const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'Done'; const isTaskDueToday = dueDate && isToday(dueDate) && task.status !== 'Done'; return ( <TableRow key={task.id} className="hover:bg-gray-50"> <TableCell> <button onClick={() => handleTaskCardClick(task.id)} className="font-medium text-gray-800 hover:text-blue-600 text-left w-full truncate">{task.title}</button> <p className="text-xs text-gray-500">{task.client} {task.project && task.client !== 'Internal' ? `/ ${task.project}` : ''}</p> </TableCell> <TableCell><Badge variant="outline">{task.status}</Badge></TableCell> <TableCell><PriorityBadge priority={task.priority} /></TableCell> <TableCell className={`text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : isTaskDueToday ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>{dueDate ? format(dueDate, 'MMM dd') : '-'}</TableCell> <TableCell> {task.assignee ? ( <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><Avatar className="h-6 w-6 border"><AvatarImage src={task.assignee.avatar} /><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback></Avatar></TooltipTrigger><TooltipContent><p>{task.assignee.name}</p></TooltipContent></Tooltip></TooltipProvider> ) : <span className="text-xs text-gray-500 italic">Unassigned</span>} </TableCell> </TableRow> ); }) : ( <TableRow><TableCell colSpan={5} className="h-24 text-center text-gray-500 italic">No tasks match the current filters.</TableCell></TableRow> )} </TableBody> </Table> <ScrollBar orientation="vertical" /> </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-2 rounded-xl">
               {/* ... (Meetings content) ... */}
                <CardHeader> <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle> </CardHeader>
                <CardContent> <div className="space-y-4"> {meetingsData.map(meeting => { let meetingDate: Date | null = null; try { meetingDate = parseISO(meeting.dateTime); } catch (e) { console.error("Invalid date format for meeting:", meeting.id, meeting.dateTime); } const isMeetingToday = meetingDate ? isToday(meetingDate) : false;
                const [formattedDate, setFormattedDate] = useState('');
                useEffect(() => {
                  if (meetingDate) {
                    setFormattedDate(format(meetingDate, 'MMM dd, p'));
                  }
                }, [meetingDate]);
                return ( <div key={meeting.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"> <div><p className="text-sm font-medium text-gray-900">{meeting.purpose}</p><p className="text-xs text-gray-500">With: {meeting.clientName}</p></div> <div className="text-sm text-gray-700 text-left sm:text-right">{isMeetingToday && <Badge variant="outline" className="border-orange-300 text-orange-600 mr-2 mb-1 sm:mb-0">Today</Badge>}{formattedDate || 'Invalid Date'}</div> <div className="flex items-center gap-1 mt-2 sm:mt-0">{meeting.link && (<Button variant="outline" size="xs" className="h-7 px-2 py-1" asChild><a href={meeting.link} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-3.5 h-3.5 mr-1" /> Join</a></Button>)}<Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700"><PencilIcon className="w-4 h-4" /><span className="sr-only">Add Notes</span></Button></div> </div> ); })} {meetingsData.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings.</p>} </div> </CardContent>
            </Card>
         </div>

         {/* Right Column (Files, Activity, Focus) */}
         <div className="space-y-8">
            {/* ... (Focus content) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-3 rounded-xl"> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> This Week's Focus</CardTitle><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700"><PencilSquareIcon className="w-4 h-4" /><span className="sr-only">Edit Goals</span></Button></CardHeader> <CardContent className="space-y-2">{focusGoalsData.map(goal => (<div key={goal.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border"><CheckIcon className="w-4 h-4 text-green-600" /><p className="text-sm text-gray-800">{goal.text}</p></div>))}{focusGoalsData.length === 0 && <p className="text-sm text-gray-500 text-center py-2">Set your focus goals for the week!</p>}</CardContent> </Card>
            {/* ... (Files content) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-4 rounded-xl"> <CardHeader className="pb-4"><CardTitle className="text-base font-semibold">Recent Files</CardTitle><div className="mt-2"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="xs" className="gap-1 h-7 px-2"><FunnelIcon className="h-3 w-3" /><span className="text-xs">{recentFilesFilter === 'all' ? 'All Files' : recentFilesFilter}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem onClick={() => setRecentFilesFilter('all')}>All Files</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('Client Uploads')}>Client Uploads</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('My Uploads')}>My Uploads</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('Last 7 Days')}>Last 7 Days</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></CardHeader> <CardContent className="space-y-3">{recentFilesData.map(file => (<div key={file.id} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors group"><div className="flex items-center gap-3 overflow-hidden"><file.icon className="h-6 w-6 text-gray-500 flex-shrink-0" aria-hidden="true" /><div className="overflow-hidden"><p className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline" title={file.name}>{file.name}</p><p className="text-xs text-gray-500">{file.uploader} ・ {formatDistanceToNow(file.uploadedOn, { addSuffix: true })} ・ {file.size}</p></div></div><div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-yellow-500"><StarIcon className={`w-4 h-4 ${file.isPinned ? 'fill-yellow-400 text-yellow-500' : ''}`} /><span className="sr-only">{file.isPinned ? 'Unpin' : 'Pin'}</span></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-blue-600"><EyeIcon className="w-4 h-4" /><span className="sr-only">Preview</span></Button></div></div>))}{/* Placeholder Dropzone */}<div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}><ArrowUpTrayIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-600">Drag & drop files here or</p><Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => document.getElementById('file-upload-input')?.click()}>browse to upload</Button><input type="file" id="file-upload-input" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></div></CardContent> </Card>
            {/* ... (Activity Feed content) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-5 rounded-xl"> <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><ListBulletIcon className="w-4 h-4"/> Recent Activity</CardTitle></CardHeader> <CardContent><ScrollArea className="h-[250px] pr-3"><div className="space-y-4">{activityFeedData.map(activity => (<div key={activity.id} className="flex items-start gap-3"><Avatar className="h-7 w-7 border mt-0.5"><AvatarImage src={activity.avatar} /><AvatarFallback className="text-xs">{activity.user === 'You' ? 'You' : activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><p className="text-sm text-gray-800"><span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.item}</span> {activity.target && <span className="text-gray-600">in {activity.target}</span>}</p><p className="text-xs text-gray-500">{formatDistanceToNow(activity.time, { addSuffix: true })}</p></div></div>))}</div></ScrollArea></CardContent> </Card>
         </div>
      </div>

       {/* --- Modals --- */}
       {/* Task Detail Modal - UPDATED */}
       <Dialog open={isTaskDetailModalOpen} onOpenChange={setIsTaskDetailModalOpen}>
         <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] flex flex-col p-0"> {/* Larger modal, no padding */}
            {/* Pass taskId and onClose handler */}
            <TaskDetailModalContent taskId={selectedTaskId} onClose={() => setIsTaskDetailModalOpen(false)} />
         </DialogContent>
       </Dialog>

       {/* Column Detail Modal Placeholder */}
       <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
         <DialogContent className="sm:max-w-2xl"> <DialogHeader> <DialogTitle>Expanded View: {selectedColumn} Tasks</DialogTitle> <DialogDescription> A full list or different view of all tasks in the '{selectedColumn}' status would go here. </DialogDescription> </DialogHeader> {/* TODO: Add expanded column view content */} <DialogFooter> <Button variant="outline" onClick={() => setIsColumnModalOpen(false)}>Close</Button> </DialogFooter> </DialogContent>
       </Dialog>

    </div>
  );
}

// --- Add CSS for simple animations (in your global CSS file) ---
//* ... (keep animation CSS) ...*//

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

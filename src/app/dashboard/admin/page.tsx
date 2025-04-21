// dashboard/page.tsx
'use client';

import React, { useState, useMemo } from 'react'; // Added useMemo
import { format, formatDistanceToNow, isToday, isPast, startOfWeek, endOfWeek } from 'date-fns';
import { subHours, subDays, subMinutes, parseISO } from 'date-fns';
import {
  UsersIcon,
  RectangleStackIcon,
  ClockIcon,
  CalendarDaysIcon,
  FunnelIcon,
  Bars3Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  CpuChipIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  UserCircleIcon,
  EyeIcon,
  LinkIcon,
  BellIcon,
  CheckIcon,
  ListBulletIcon,
  SparklesIcon,
  PencilSquareIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  TagIcon,
  EllipsisHorizontalIcon,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Updated import for DialogClose
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Added Table

// --- Mock Data ---
import { Toggle } from "@/components/ui/toggle";
const getCurrentGreeting = (): string => { /* ... */ };
const userName = "Allan";

const statsData = [ /* ... */ ];

// ** UPDATED Tasks Data with more fields **
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
// Combine all tasks for list view filtering
const allTasks = [...tasksData.todo, ...tasksData.inProgress, ...tasksData.done];

const meetingsData = [ /* ... */ ];
const recentFilesData = [ /* ... */ ];
const activityFeedData = [ /* ... */ ];
const focusGoalsData = [ /* ... */ ];

// --- Helper Components & Functions ---
const getIconColorClass = (changeType?: string): string => { /* ... */ };
const getChangeTextColorClass = (changeType?: string): string => { /* ... */ };

const PriorityBadge = ({ priority }: { priority: string }) => { /* ... */ };

// ** UPDATED Kanban Task Card Component **
const KanbanTaskCard = ({ task, onCardClick }: { task: any; onCardClick: (taskId: string) => void }) => {
  // ... (Keep existing KanbanTaskCard component code from previous step)
  // Attempt to parse the date, handle potential invalid format gracefully
  let dueDate: Date | null = null;
  if (task.dueDate) {
      try {
          // Ensure the date string is in a format parseISO understands (like YYYY-MM-DD)
          // If your dates are like 'MMM dd', you'll need a different parsing method or store them as ISO strings/Date objects
          dueDate = parseISO(task.dueDate); // Assumes YYYY-MM-DD format
          if (isNaN(dueDate.getTime())) { dueDate = null; console.warn("Invalid due date format:", task.id, task.dueDate); }
      } catch (e) { console.error("Error parsing due date:", task.id, task.dueDate, e); dueDate = null; }
  }
  const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate);
  const isTaskDueToday = dueDate && isToday(dueDate);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(task.title);

  const handleTitleClick = (e: React.MouseEvent) => { e.stopPropagation(); console.log("Inline edit title triggered for:", task.id); };
  const handleTitleSave = () => { setIsEditingTitle(false); console.log("Save title:", currentTitle); };

  return (
    // TODO: Wrap this card with Draggable component from D&D library
    <Card
      onClick={() => onCardClick(task.id)}
      className="p-3 shadow-sm border border-gray-200 bg-white hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group relative rounded-lg"
    >
      <div className="absolute top-1 right-1 flex gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10">
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600" onClick={(e) => {e.stopPropagation(); console.log("Edit Task:", task.id)}}><PencilIcon className="w-3.5 h-3.5" /> <span className="sr-only">Edit</span></Button>
         <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600" onClick={(e) => {e.stopPropagation(); console.log("Delete Task:", task.id)}}><TrashIconOutline className="w-3.5 h-3.5" /> <span className="sr-only">Delete</span></Button>
      </div>
      <div className="flex items-center justify-between mb-2">
         <PriorityBadge priority={task.priority} />
         {task.isInternal && (<TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="xs" className="h-auto px-1 py-0 ml-1 text-gray-500 hover:bg-gray-100"><BuildingOffice2Icon className="w-3.5 h-3.5"/></Button></TooltipTrigger><TooltipContent side="top"><p>Internal Task</p></TooltipContent></Tooltip></TooltipProvider>)}
      </div>
      {isEditingTitle ? ( <Input value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} onBlur={handleTitleSave} onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); }} className="text-sm font-semibold text-gray-900 mb-1 h-8 px-1 border-blue-400 ring-1 ring-blue-400" autoFocus onClick={(e) => e.stopPropagation()}/> )
        : ( <h4 onClick={handleTitleClick} className="text-sm font-semibold text-gray-900 mb-1 hover:text-blue-600 leading-tight cursor-text">{task.title}</h4> )}
      <p className="text-xs text-gray-600 mb-2">{task.client} {task.project && task.client !== 'Internal' ? `/ ${task.project}` : ''}</p>
      {task.tags && task.tags.length > 0 && (<div className="flex flex-wrap gap-1 mb-3">{task.tags.map((tag: string) => ( <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 font-normal">{tag}</Badge> ))}</div>)}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <span className={`text-xs font-semibold ${isTaskOverdue ? 'text-red-600' : isTaskDueToday ? 'text-orange-600' : 'text-gray-500'}`}>{dueDate ? format(dueDate, 'MMM dd') : 'No due date'}{isTaskOverdue && ' (Overdue)'}{isTaskDueToday && ' (Today)'}</span>
        {task.assignee ? (<TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><Avatar className="h-6 w-6 border"><AvatarImage src={task.assignee.avatar} alt={task.assignee.name} /><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar></TooltipTrigger><TooltipContent><p>{task.assignee.name}</p></TooltipContent></Tooltip></TooltipProvider>)
         : (<TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><UserCircleIcon className="h-6 w-6 text-gray-400" /></TooltipTrigger><TooltipContent><p>Unassigned</p></TooltipContent></Tooltip></TooltipProvider>)}
      </div>
    </Card>
  );
};

// --- ** NEW Task Detail Modal Content Component ** ---
const TaskDetailModalContent = ({ taskId }: { taskId: string | null }) => {
    // TODO: Fetch actual task data based on taskId
    const task = taskId ? allTasks.find(t => t.id === taskId) : null;

    if (!task) {
        return <div className="p-6 text-center text-gray-500">Task not found or not selected.</div>;
    }

    // Mock state for inputs within modal
    const [comment, setComment] = useState('');
    const [newSubtask, setNewSubtask] = useState('');

    const handleAddComment = () => { console.log("Add comment:", comment); setComment(''); };
    const handleAddSubtask = () => { console.log("Add subtask:", newSubtask); setNewSubtask(''); };
    const handleSubtaskToggle = (subtaskId: string, completed: boolean) => { console.log(`Toggle subtask ${subtaskId} to ${!completed}`); };
    const handleAttachmentUpload = (files: FileList | null) => { if (files) console.log("Upload attachments:", files); };

    let dueDate: Date | null = null;
    if (task.dueDate) { try { dueDate = parseISO(task.dueDate); if (isNaN(dueDate.getTime())) dueDate = null; } catch (e) { dueDate = null; } }

    return (
        <div className="grid gap-6 py-4 px-1 max-h-[80vh]"> {/* Added max-h */}
            {/* Header */}
            <DialogHeader className="pr-6"> {/* Added padding right to avoid overlap with close */}
                {/* TODO: Add inline edit capability for title */}
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                    {task.title}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-blue-600"><PencilIcon className="w-4 h-4" /></Button>
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                   <PriorityBadge priority={task.priority} />
                   {task.isInternal && <Badge variant="secondary" className="text-xs"><BuildingOffice2Icon className="w-3 h-3 mr-1"/> Internal</Badge>}
                </div>
            </DialogHeader>

            {/* Main Content with Scroll */}
            <ScrollArea className="grid md:grid-cols-3 gap-6 h-[calc(80vh-200px)] pr-4"> {/* Adjust height based on header/footer */}
                 {/* Left Column (Meta, Description) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Meta Info */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <span className="font-medium text-gray-600">Client:</span> <span>{task.client}</span>
                                <span className="font-medium text-gray-600">Project:</span> <span>{task.project || '-'}</span>
                                <span className="font-medium text-gray-600">Assignee:</span>
                                <span>
                                    {task.assignee ? (
                                        <div className="flex items-center gap-1.5">
                                            <Avatar className="h-5 w-5"><AvatarImage src={task.assignee.avatar}/><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                                            {task.assignee.name}
                                        </div>
                                    ) : <span className="italic text-gray-500">Unassigned</span>}
                                </span>
                                <span className="font-medium text-gray-600">Due Date:</span>
                                <span>{dueDate ? format(dueDate, 'MMM dd, yyyy') : 'Not set'}</span>
                                <span className="font-medium text-gray-600">Status:</span>
                                <span><Badge variant="outline">{task.status}</Badge></span>
                                {task.tags && task.tags.length > 0 && (
                                    <>
                                        <span className="font-medium text-gray-600">Tags:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {task.tags.map((tag: string) => (<Badge key={tag} variant="secondary" className="font-normal">{tag}</Badge>))}
                                        </div>
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
                            <Textarea readOnly value={task.description || 'No description provided.'} className="min-h-[80px] text-sm text-gray-700 bg-gray-50 border-none focus-visible:ring-0"/>
                        </CardContent>
                    </Card>

                    {/* Subtasks */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Subtasks</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {task.subtasks?.length > 0 ? task.subtasks.map((sub: any) => (
                                <div key={sub.id} className="flex items-center space-x-2">
                                    <Checkbox id={`subtask-${sub.id}`} checked={sub.completed} onCheckedChange={() => handleSubtaskToggle(sub.id, sub.completed)} />
                                    <Label htmlFor={`subtask-${sub.id}`} className={`text-sm ${sub.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{sub.text}</Label>
                                </div>
                            )) : <p className="text-sm text-gray-500 italic">No subtasks added.</p>}
                            {/* Add Subtask Input */}
                            <div className="flex gap-2 pt-2 border-t mt-3">
                                <Input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Add new subtask..." className="h-8 text-sm" />
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
                                 <ArrowUpTrayIcon className="h-6 w-6 mx-auto text-gray-400 mb-1" /> Drag & drop or <Button variant="link" size="xs" className="p-0 h-auto" onClick={()=>document.getElementById('attach-input')?.click()}>browse</Button>
                                 <input type="file" id="attach-input" multiple className="hidden" onChange={(e)=>handleAttachmentUpload(e.target.files)} />
                             </div>
                             {/* List of attachments */}
                             {task.attachments?.length > 0 ? task.attachments.map((att: any) => (
                                 <div key={att.id} className="flex items-center justify-between p-1.5 bg-gray-50 rounded border text-sm">
                                     <div className="flex items-center gap-2 overflow-hidden">
                                         <ClipboardDocumentIcon className="w-4 h-4 text-gray-500 flex-shrink-0"/>
                                         <span className="truncate">{att.name}</span>
                                     </div>
                                     <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600"><TrashIconOutline className="w-3.5 h-3.5"/></Button>
                                 </div>
                             )) : <p className="text-sm text-gray-500 italic text-center">No attachments.</p>}
                         </CardContent>
                     </Card>

                     {/* Comments */}
                     <Card>
                         <CardHeader><CardTitle className="text-base">Comments</CardTitle></CardHeader>
                         <CardContent className="space-y-3">
                             {task.comments?.length > 0 ? task.comments.map((com: any) => (
                                 <div key={com.id} className="flex items-start gap-2 text-sm">
                                     <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{com.user.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback></Avatar>
                                     <div>
                                         <span className="font-medium mr-1">{com.user}</span>
                                         <span className="text-xs text-gray-500">{formatDistanceToNow(com.timestamp, { addSuffix: true })}</span>
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
            </ScrollArea>

            {/* Modal Footer Actions */}
            <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-1">
                 <div className="flex flex-wrap gap-1">
                     <Button variant="outline" size="sm"><TrashIconOutline className="w-4 h-4 mr-1"/> Delete Task</Button>
                     <Button variant="outline" size="sm"><DocumentDuplicateIcon className="w-4 h-4 mr-1"/> Duplicate</Button>
                     {/* Add more actions like Move, Change Assignee */}
                 </div>
                 <DialogClose asChild>
                    <Button variant="outline" size="sm">Close</Button>
                 </DialogClose>
            </DialogFooter>
        </div>
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
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban'); // NEW: View mode state

   // --- Handlers ---
  const handleFileUpload = (files: FileList | null) => { /* ... */ };

  const handleTaskCardClick = (taskId: string) => {
    console.log("Task card clicked:", taskId);
    setSelectedTaskId(taskId);
    setIsTaskDetailModalOpen(true);
  };

  const handleColumnTitleClick = (columnStatus: string) => {
     console.log("Column title clicked:", columnStatus);
     setSelectedColumn(columnStatus);
     setIsColumnModalOpen(true);
  };

  // --- Filtering Logic ---
  const filterTasks = (tasks: any[]) => {
      return tasks.filter(task =>
          (kanbanFilters.priority === 'all' || task.priority === kanbanFilters.priority) &&
          (kanbanFilters.type === 'all' || (kanbanFilters.type === 'internal' && task.isInternal) || (kanbanFilters.type === 'client' && !task.isInternal)) &&
          (kanbanFilters.assignee === 'all' || (kanbanFilters.assignee === 'me' && /* TODO: Check if task.assignee.id matches logged in user */ false) || (kanbanFilters.assignee === 'unassigned' && !task.assignee))
          // TODO: Add client/project filter if needed
      );
  };

  // Memoize filtered tasks to avoid recalculation on every render
  const filteredTasks = useMemo(() => ({
      todo: filterTasks(tasksData.todo),
      inProgress: filterTasks(tasksData.inProgress),
      done: filterTasks(tasksData.done),
  }), [kanbanFilters]); // Recalculate only when filters change

  const allFilteredTasks = useMemo(() => [
      ...filteredTasks.todo,
      ...filteredTasks.inProgress,
      ...filteredTasks.done
  ], [filteredTasks]); // Combine for list view


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Welcome Header */}
      <div className="fade-in">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getCurrentGreeting()}, {userName} 👋</h1>
        <p className="text-sm text-gray-600 mt-1">Here's what's happening today.</p>
      </div>

      {/* Top Stats Section */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 slide-up">
         {/* ... stats mapping ... */}
         {statsData.map((item) => (
          <Card key={item.name} className="shadow-sm border border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md p-4 sm:p-5 flex flex-col items-center text-center">
             <item.icon className={`h-8 w-8 mb-2 ${getIconColorClass(item.changeType)}`} aria-hidden="true" />
             <p className="text-sm font-medium text-gray-500 truncate">{item.name}</p>
             <p className="mt-1 text-3xl font-bold text-gray-900">{item.value}</p>
             {item.change && ( <div className={`text-xs mt-2 ${getChangeTextColorClass(item.changeType)}`}>{item.change}</div> )}
          </Card>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

         {/* Left Column (Kanban + Meetings) */}
         <div className="lg:col-span-2 space-y-8">

            {/* Project Tracker (Kanban/List View) - UPDATED */}
            <Card className="shadow-lg border border-gray-200 fade-in-delay-1 overflow-hidden rounded-xl">
              <CardHeader className="pb-4 px-4 sm:px-6 pt-5 border-b bg-white">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <CardTitle className="text-lg font-semibold">Project Tracker</CardTitle>
                    {/* View Toggle */}
                     <div className="inline-flex items-center gap-2">
                      <Toggle pressed={viewMode === 'kanban'} onPressedChange={(value) => {if(value) setViewMode('kanban')}} aria-label="Toggle Kanban View" className=""><ViewColumnsIcon className="h-4 w-4 mr-1.5"/> Kanban</Toggle>
                      <Toggle pressed={viewMode === 'list'} onPressedChange={(value) => { if(value) setViewMode('list') }} aria-label="Toggle List View"><ListIcon className="h-4 w-4 mr-1.5"/> List</Toggle>
                     </div>
                 </div>
                 {/* Filters Row */}
                 <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="text-sm font-medium text-gray-500">Filter:</span>
                    {/* ... (Filter buttons remain the same) ... */}
                    <Button variant={kanbanFilters.priority === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, priority: 'all'}))}>All</Button>
                  <Button variant={kanbanFilters.priority === 'High' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2 text-red-600 hover:bg-red-50" onClick={() => setKanbanFilters(f => ({...f, priority: 'High'}))}>High</Button>
                    <Button variant={kanbanFilters.type === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, type: 'all'}))}>Type</Button>
                    <Button variant={kanbanFilters.type === 'internal' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, type: 'internal'}))}>Internal</Button>
                    <Separator orientation="vertical" className="h-5 mx-1"/>
                    <Button variant={kanbanFilters.assignee === 'all' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'all'}))}>Assignee</Button>
                    <Button variant={kanbanFilters.assignee === 'me' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'me'}))}>Me</Button>
                    <Button variant={kanbanFilters.assignee === 'unassigned' ? 'secondary' : 'ghost'} size="xs" className="h-7 px-2" onClick={() => setKanbanFilters(f => ({...f, assignee: 'unassigned'}))}>Unassigned</Button>
                 </div>
                 {/* Priority Legend */}
                 <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500">
                    <span>Legend:</span>
                    <span className="flex items-center gap-1"><Badge className="bg-red-100 h-3 w-3 p-0 border-red-200"/> High</span>
                    <span className="flex items-center gap-1"><Badge className="bg-yellow-100 h-3 w-3 p-0 border-yellow-200"/> Medium</span>
                    <span className="flex items-center gap-1"><Badge className="bg-blue-100 h-3 w-3 p-0 border-blue-200"/> Low</span>
                    <span className="flex items-center gap-1"><Badge variant="secondary" className="h-3 w-3 p-0 border-gray-300"/> Internal</span>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === 'kanban' ? (
                     /* Kanban View */
                     <div className="grid grid-cols-1 md:grid-cols-3">
                        {(['To Do', 'In Progress', 'Done'] as const).map((status) => {
                          const columnTasks = filteredTasks[status.toLowerCase().replace(' ', '') as keyof typeof filteredTasks] || [];
                          return (
                            <div key={status} className={`flex flex-col ${status !== 'Done' ? 'border-r border-gray-200' : ''}`}>
                              <button onClick={() => handleColumnTitleClick(status)} className="sticky top-0 z-10 bg-gray-100/80 backdrop-blur-sm p-3 border-b border-gray-200 hover:bg-gray-200/80 transition-colors w-full"><h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-left">{status} ({columnTasks?.length || 0})</h3></button>
                              <ScrollArea className="h-[450px] p-3 bg-gray-50/30">
                                <div className="space-y-3 min-h-[380px]">
                                  {columnTasks.length > 0 ? ( columnTasks.map(task => <KanbanTaskCard key={task.id} task={task} onCardClick={handleTaskCardClick} />) )
                                    : ( <div className="flex items-center justify-center h-full text-center py-10"><p className="text-sm text-gray-400 italic">No tasks in '{status}'</p></div> )}
                                </div>
                                <ScrollBar orientation="vertical" />
                              </ScrollArea>
                              {status !== 'Done' && ( <div className="p-3 border-t border-gray-200 bg-gray-100/80"><Button variant="ghost" size="sm" className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-200/80"><PlusIcon className="h-4 w-4 mr-1.5" /> Add Task</Button></div> )}
                              {status === 'Done' && <div className="p-3 border-t border-transparent bg-gray-50/30 h-[53px]"></div>}
                            </div>
                          );
                        })}
                     </div>
                ) : (
                    /* List View */
                    <ScrollArea className="h-[565px]"> {/* Adjust height as needed */}
                        <Table>
                            <TableHeader className="sticky top-0 bg-gray-100/80 backdrop-blur-sm z-10">
                                <TableRow>
                                    <TableHead className="w-[50%]">Task</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Assignee</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allFilteredTasks.length > 0 ? allFilteredTasks.map(task => {
                                    let dueDate: Date | null = null;
                                    if (task.dueDate) { try { dueDate = parseISO(task.dueDate); if (isNaN(dueDate.getTime())) dueDate = null; } catch (e) { dueDate = null; } }
                                    const isTaskOverdue = dueDate && isPast(dueDate) && !isToday(dueDate) && task.status !== 'Done';
                                    const isTaskDueToday = dueDate && isToday(dueDate) && task.status !== 'Done';
                                    return (
                                        <TableRow key={task.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <button onClick={() => handleTaskCardClick(task.id)} className="font-medium text-gray-800 hover:text-blue-600 text-left w-full truncate">
                                                    {task.title}
                                                </button>
                                                <p className="text-xs text-gray-500">{task.client} {task.project && task.client !== 'Internal' ? `/ ${task.project}` : ''}</p>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{task.status}</Badge></TableCell>
                                            <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                                            <TableCell className={`text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : isTaskDueToday ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                                                {dueDate ? format(dueDate, 'MMM dd') : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {task.assignee ? (
                                                    <TooltipProvider delayDuration={100}><Tooltip><TooltipTrigger><Avatar className="h-6 w-6 border"><AvatarImage src={task.assignee.avatar} /><AvatarFallback className="text-xs">{task.assignee.name.split(' ').map((n:string)=>n[0]).join('')}</AvatarFallback></Avatar></TooltipTrigger><TooltipContent><p>{task.assignee.name}</p></TooltipContent></Tooltip></TooltipProvider>
                                                ) : <span className="text-xs text-gray-500 italic">Unassigned</span>}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-gray-500 italic">No tasks match the current filters.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-2 rounded-xl">
               {/* ... (Upcoming Meetings content remains the same) ... */}
                <CardHeader> <CardTitle className="text-lg font-semibold">Upcoming Meetings</CardTitle> </CardHeader>
                <CardContent> <div className="space-y-4"> {meetingsData.map(meeting => { let meetingDate: Date | null = null; try { meetingDate = parseISO(meeting.dateTime); } catch (e) { console.error("Invalid date format for meeting:", meeting.id, meeting.dateTime); } const isMeetingToday = meetingDate ? isToday(meetingDate) : false; return ( <div key={meeting.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"> <div><p className="text-sm font-medium text-gray-900">{meeting.purpose}</p><p className="text-xs text-gray-500">With: {meeting.clientName}</p></div> <div className="text-sm text-gray-700 text-left sm:text-right">{isMeetingToday && <Badge variant="outline" className="border-orange-300 text-orange-600 mr-2 mb-1 sm:mb-0">Today</Badge>}{meetingDate ? format(meetingDate, 'MMM dd, p') : 'Invalid Date'}</div> <div className="flex items-center gap-1 mt-2 sm:mt-0">{meeting.link && (<Button variant="outline" size="xs" className="h-7 px-2 py-1" asChild><a href={meeting.link} target="_blank" rel="noopener noreferrer"><LinkIcon className="w-3.5 h-3.5 mr-1" /> Join</a></Button>)}<Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700"><PencilIcon className="w-4 h-4" /><span className="sr-only">Add Notes</span></Button></div> </div> ); })} {meetingsData.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings.</p>} </div> </CardContent>
            </Card>
         </div>

         {/* Right Column (Files, Activity, Focus) */}
         <div className="space-y-8">
            {/* ... (This Week's Focus content remains the same) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-3 rounded-xl"> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><MapPinIcon className="w-4 h-4"/> This Week's Focus</CardTitle><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-gray-700"><PencilSquareIcon className="w-4 h-4" /><span className="sr-only">Edit Goals</span></Button></CardHeader> <CardContent className="space-y-2">{focusGoalsData.map(goal => (<div key={goal.id} className="flex items-center gap-2 p-2 rounded-md bg-gray-50 border"><CheckIcon className="w-4 h-4 text-green-600" /><p className="text-sm text-gray-800">{goal.text}</p></div>))}{focusGoalsData.length === 0 && <p className="text-sm text-gray-500 text-center py-2">Set your focus goals for the week!</p>}</CardContent> </Card>
            {/* ... (Recent Files content remains the same) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-4 rounded-xl"> <CardHeader className="pb-4"><CardTitle className="text-base font-semibold">Recent Files</CardTitle><div className="mt-2"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="xs" className="gap-1 h-7 px-2"><FunnelIcon className="h-3 w-3" /><span className="text-xs">{recentFilesFilter === 'all' ? 'All Files' : recentFilesFilter}</span></Button></DropdownMenuTrigger><DropdownMenuContent align="start"><DropdownMenuItem onClick={() => setRecentFilesFilter('all')}>All Files</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('Client Uploads')}>Client Uploads</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('My Uploads')}>My Uploads</DropdownMenuItem><DropdownMenuItem onClick={() => setRecentFilesFilter('Last 7 Days')}>Last 7 Days</DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></CardHeader> <CardContent className="space-y-3">{recentFilesData.map(file => (<div key={file.id} className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors group"><div className="flex items-center gap-3 overflow-hidden"><file.icon className="h-6 w-6 text-gray-500 flex-shrink-0" aria-hidden="true" /><div className="overflow-hidden"><p className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:underline" title={file.name}>{file.name}</p><p className="text-xs text-gray-500">{file.uploader} ・ {formatDistanceToNow(file.uploadedOn, { addSuffix: true })} ・ {file.size}</p></div></div><div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-yellow-500"><StarIcon className={`w-4 h-4 ${file.isPinned ? 'fill-yellow-400 text-yellow-500' : ''}`} /><span className="sr-only">{file.isPinned ? 'Unpin' : 'Pin'}</span></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-gray-500 hover:text-blue-600"><EyeIcon className="w-4 h-4" /><span className="sr-only">Preview</span></Button></div></div>))}{/* Placeholder Dropzone */}<div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files); }}><ArrowUpTrayIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" /><p className="text-sm text-gray-600">Drag & drop files here or</p><Button variant="link" size="sm" className="text-blue-600 h-auto p-0" onClick={() => document.getElementById('file-upload-input')?.click()}>browse to upload</Button><input type="file" id="file-upload-input" multiple className="hidden" onChange={(e) => handleFileUpload(e.target.files)} /></div></CardContent> </Card>
            {/* ... (Recent Activity Feed content remains the same) ... */}
            <Card className="shadow-sm border border-gray-200 fade-in-delay-5 rounded-xl"> <CardHeader><CardTitle className="text-base font-semibold flex items-center gap-2"><ListBulletIcon className="w-4 h-4"/> Recent Activity</CardTitle></CardHeader> <CardContent><ScrollArea className="h-[250px] pr-3"><div className="space-y-4">{activityFeedData.map(activity => (<div key={activity.id} className="flex items-start gap-3"><Avatar className="h-7 w-7 border mt-0.5"><AvatarImage src={activity.avatar} /><AvatarFallback className="text-xs">{activity.user === 'You' ? 'You' : activity.user.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><p className="text-sm text-gray-800"><span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-blue-600">{activity.item}</span> {activity.target && <span className="text-gray-600">in {activity.target}</span>}</p><p className="text-xs text-gray-500">{formatDistanceToNow(activity.time, { addSuffix: true })}</p></div></div>))}</div></ScrollArea></CardContent> </Card>
         </div>
      </div>

       {/* --- Modals --- */}
       {/* Task Detail Modal - UPDATED */}
       <Dialog open={isTaskDetailModalOpen} onOpenChange={setIsTaskDetailModalOpen}>
         <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] flex flex-col p-0"> {/* Larger modal, no padding */}
            {/* Pass taskId to fetch/display correct task */}
            <TaskDetailModalContent taskId={selectedTaskId} />
            {/* Close button is now inside TaskDetailModalContent */}
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

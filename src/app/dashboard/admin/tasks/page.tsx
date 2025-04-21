// Example file path: src/app/dashboard/admin/tasks/priority/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState } from 'react';
import { format, addDays, subDays, isToday, isPast } from 'date-fns';

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For potential search later
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // Used within DatePicker
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Used within DatePicker

// --- Icons ---
import {
  Filter, PlusCircle, MoreHorizontal, Eye, Edit, CheckSquare, CalendarIcon,
  AlertOctagon, CalendarClock, CalendarX, UserX, // Stat icons
  AlertCircle, ChevronUp, ChevronDown // Priority icons (example usage)
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching) ---
const today = new Date();
const tasksData = [
  { id: 'task-001', title: 'Fix checkout bug', project: 'Revamp Website', client: 'Client A', priority: 'High', status: 'In Progress', assignee: { id: 's1', name: 'Alice Smith', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, dueDate: today },
  { id: 'task-002', title: 'Send updated contract', project: 'Brand Redesign', client: 'Client B', priority: 'Medium', status: 'Open', assignee: null, dueDate: addDays(today, 2) },
  { id: 'task-003', title: 'Review design mockups', project: 'Mobile App Dev', client: 'Client C', priority: 'High', status: 'Open', assignee: { id: 's2', name: 'Bob Johnson', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, dueDate: subDays(today, 1) }, // Overdue
  { id: 'task-004', title: 'Prepare Q2 report slides', project: 'Admin', client: 'Internal', priority: 'Low', status: 'Completed', assignee: { id: 's1', name: 'Alice Smith', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, dueDate: subDays(today, 5) },
  { id: 'task-005', title: 'Onboard new client', project: 'Client D Setup', client: 'Client D', priority: 'High', status: 'Open', assignee: null, dueDate: addDays(today, 7) },
  { id: 'task-006', title: 'Finalize marketing copy', project: 'Marketing Campaign', client: 'Client B', priority: 'Medium', status: 'In Progress', assignee: { id: 's2', name: 'Bob Johnson', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, dueDate: today },
];

// Calculate Stats (Replace with backend aggregation)
const urgentTasks = tasksData.filter(t => t.priority === 'High' && t.status !== 'Completed').length;
const dueTodayTasks = tasksData.filter(t => t.dueDate && isToday(t.dueDate) && t.status !== 'Completed').length;
const overdueTasks = tasksData.filter(t => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate) && t.status !== 'Completed').length;
const unassignedTasks = tasksData.filter(t => !t.assignee && t.status !== 'Completed').length;

// --- Helper Functions ---
const getPriorityProps = (priority: string): { color: string; icon: React.ReactNode; variant: "destructive" | "warning" | "secondary" } => {
  switch (priority?.toLowerCase()) {
    case 'high': return { color: 'text-red-600', icon: <AlertCircle className="w-4 h-4 mr-1 text-red-500" />, variant: 'destructive' };
    case 'medium': return { color: 'text-yellow-600', icon: <ChevronUp className="w-4 h-4 mr-1 text-yellow-500" />, variant: 'warning' };
    case 'low': return { color: 'text-gray-600', icon: <ChevronDown className="w-4 h-4 mr-1 text-gray-400" />, variant: 'secondary' };
    default: return { color: 'text-gray-500', icon: null, variant: 'secondary' };
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "info" | "success" => {
  switch (status?.toLowerCase()) {
    case 'open': return 'secondary';
    case 'in progress': return 'info';
    case 'completed': return 'success';
    default: return 'outline';
  }
};

/**
 * AdminPriorityTasksPage Component
 *
 * Displays priority tasks with filters, stats, and creation functionality.
 */
export default function AdminPriorityTasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>();

  // --- State for Filters (Conceptual) ---
  // const [filters, setFilters] = useState({ status: 'all', priority: 'all', assignee: 'all', clientProject: 'all' });
  // const [tasks, setTasks] = useState(tasksData); // Would be fetched/filtered data

  // --- TODO: Handlers ---
  const handleCreateTask = () => {
    // 1. Get data from form fields in the modal state
    // 2. Call API to create the task
    // 3. On success: close modal, refresh task list
    console.log("Creating task...");
    setIsCreateModalOpen(false);
    setNewTaskDueDate(undefined); // Reset date picker
  };

  const handleViewTask = (taskId: string) => console.log("View Task:", taskId);
  const handleEditTask = (taskId: string) => console.log("Edit Task:", taskId);
  const handleCompleteTask = (taskId: string) => console.log("Complete Task:", taskId);
  const handleAssignTask = (taskId: string) => console.log("Assign Task:", taskId);


  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Priority Tasks</h1>
          <p className="text-gray-600 mt-1">Critical and important tasks across all projects and clients.</p>
        </div>
        <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="w-4 h-4 mr-2" /> New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b">
         <Select /* value={filters.status} onValueChange={(v) => handleFilterChange('status', v)} */ >
           <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Filter Status" /></SelectTrigger>
           <SelectContent><SelectItem value="all">All Statuses</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
         </Select>
         <Select /* value={filters.priority} onValueChange={(v) => handleFilterChange('priority', v)} */ >
           <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Filter Priority" /></SelectTrigger>
           <SelectContent><SelectItem value="all">All Priorities</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
         </Select>
         <Select /* value={filters.assignee} onValueChange={(v) => handleFilterChange('assignee', v)} */ >
           <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter Assignee" /></SelectTrigger>
           <SelectContent><SelectItem value="all">All Assignees</SelectItem><SelectItem value="s1">Alice Smith</SelectItem><SelectItem value="s2">Bob Johnson</SelectItem><SelectItem value="unassigned">Unassigned</SelectItem></SelectContent>
         </Select>
         <Select /* value={filters.clientProject} onValueChange={(v) => handleFilterChange('clientProject', v)} */ >
           <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter Client/Project" /></SelectTrigger>
           <SelectContent><SelectItem value="all">All Clients/Projects</SelectItem><SelectItem value="client-a">Client A</SelectItem><SelectItem value="proj-002">Marketing Campaign</SelectItem>{/* Add more */}</SelectContent>
         </Select>
         {/* Optional: Add Search Input */}
      </div>

      {/* 2. Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-red-600">Urgent Tasks</CardTitle><AlertOctagon className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{urgentTasks}</div></CardContent></Card>
         <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-blue-600">Due Today</CardTitle><CalendarClock className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{dueTodayTasks}</div></CardContent></Card>
         <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-orange-600">Overdue Tasks</CardTitle><CalendarX className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{overdueTasks}</div></CardContent></Card>
         <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-gray-600">Unassigned Tasks</CardTitle><UserX className="h-4 w-4 text-gray-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{unassignedTasks}</div></CardContent></Card>
      </div>

      {/* 3. Priority Tasks Table */}
      <Card className="shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="min-w-[250px]">Task</TableHead>
                <TableHead>Project / Client</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasksData.map((task) => {
                const priorityProps = getPriorityProps(task.priority);
                const isTaskOverdue = task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate) && task.status !== 'Completed';
                return (
                  <TableRow key={task.id} className={`hover:bg-gray-50 ${isTaskOverdue ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                    <TableCell className="font-medium text-gray-800 hover:underline cursor-pointer" onClick={() => handleViewTask(task.id)}>
                      {task.title}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{task.project} / {task.client}</TableCell>
                    <TableCell>
                      <Badge variant={priorityProps.variant} className="capitalize">
                        {priorityProps.icon} {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(task.status)} className="capitalize">{task.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {task.assignee ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.img} alt={task.assignee.name} />
                            <AvatarFallback className="text-xs">{task.assignee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-700">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className={`text-sm ${isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {task.dueDate ? format(task.dueDate, 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" /> <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewTask(task.id)}><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTask(task.id)}><Edit className="w-4 h-4 mr-2" /> Edit Task</DropdownMenuItem>
                          {task.status !== 'Completed' && <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}><CheckSquare className="w-4 h-4 mr-2" /> Mark Complete</DropdownMenuItem>}
                          {!task.assignee && <DropdownMenuItem onClick={() => handleAssignTask(task.id)}>Assign Task</DropdownMenuItem>}
                           {/* Add other actions like Attach File, Add Subtask etc. */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {tasksData.length === 0 && (
                 <TableRow><TableCell colSpan={7} className="h-24 text-center text-gray-500">No priority tasks found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {/* Add Pagination Controls Here if needed */}
      </Card>

       {/* 4. Create Task Modal */}
       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
         <DialogContent className="sm:max-w-[600px]">
           <DialogHeader>
             <DialogTitle>Create New Task</DialogTitle>
             <DialogDescription>Fill in the details for the new task.</DialogDescription>
           </DialogHeader>
           <div className="py-4 grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-title" className="text-right">Title</Label>
                <Input id="task-title" placeholder="Enter task title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="task-priority" className="text-right">Priority</Label>
                 <Select>
                   <SelectTrigger id="task-priority" className="col-span-3"><SelectValue placeholder="Select Priority" /></SelectTrigger>
                   <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
                 </Select>
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                 <Label htmlFor="task-desc" className="text-right pt-2">Description</Label>
                 <Textarea id="task-desc" placeholder="Enter task description..." className="col-span-3" />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="task-client-proj" className="text-right">Client/Project</Label>
                 <Select>
                   <SelectTrigger id="task-client-proj" className="col-span-3"><SelectValue placeholder="Select Client or Project" /></SelectTrigger>
                   <SelectContent>{/* Populate with clients/projects */}<SelectItem value="p1">Website Redesign</SelectItem><SelectItem value="c2">Client B</SelectItem></SelectContent>
                 </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="task-assignee" className="text-right">Assign To</Label>
                 <Select>
                   <SelectTrigger id="task-assignee" className="col-span-3"><SelectValue placeholder="Select Assignee" /></SelectTrigger>
                   <SelectContent>{/* Populate with team members */}<SelectItem value="s1">Alice Smith</SelectItem><SelectItem value="s2">Bob Johnson</SelectItem><SelectItem value="unassigned">Unassigned</SelectItem></SelectContent>
                 </Select>
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="task-due-date" className="text-right">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`col-span-3 justify-start text-left font-normal ${!newTaskDueDate && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={newTaskDueDate} onSelect={setNewTaskDueDate} initialFocus />
                    </PopoverContent>
                  </Popover>
               </div>
           </div>
           <DialogFooter>
             <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
             <Button onClick={handleCreateTask}>Create Task</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

    </div>
  );
}

// --- Notes ---
// 1. State Management: Implement state for filters and fetched tasks. Use `useState` or `useReducer`.
// 2. API Integration: Connect task creation, fetching, updating (status, assignment), and deletion to your backend API.
// 3. Filtering Logic: Implement the filtering based on selected values in the filter dropdowns.
// 4. Date Picker: Ensure the `DatePicker` (using Popover and Calendar) is correctly set up in your project if using shadcn/ui.
// 5. Assignee/Client/Project Data: Populate the Select dropdowns in the modal and filters with dynamic data.
// 6. Error Handling & Loading States: Add loading indicators during data fetching and handle potential API errors.

// Example file path: src/app/dashboard/admin/projects/page.tsx

import React from 'react'; // Using React Hooks for state potentially later
import { Input } from "@/components/ui/input"; // shadcn/ui
import { Button } from "@/components/ui/button"; // shadcn/ui
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; // shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // shadcn/ui
import { Checkbox } from "@/components/ui/checkbox"; // shadcn/ui
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // shadcn/ui
import { Badge } from "@/components/ui/badge"; // shadcn/ui
import { Progress } from "@/components/ui/progress"; // shadcn/ui
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // shadcn/ui
import {
  Search, Filter, PlusCircle, MoreHorizontal, Eye, Edit, Archive, Trash2, ChevronDown,
  AlertTriangle, PauseCircle, CheckCircle, Loader // Icons for stats
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching and state) ---
const projectsData = [
  { id: 'proj-001', name: 'Website Redesign', client: { name: 'Example Corp', initials: 'EC', logoUrl: 'https://placehold.co/40x40/e2e8f0/64748b?text=EC' }, status: 'In Progress', startDate: '2025-04-15', dueDate: '2025-06-30', progress: 75, assignedStaff: [{ id: 's1', initials: 'AS', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, { id: 's2', initials: 'BJ', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }], lastUpdated: '2025-04-18', priority: 'High' },
  { id: 'proj-002', name: 'Marketing Campaign', client: { name: 'Innovate Ltd', initials: 'IL', logoUrl: 'https://placehold.co/40x40/d1fae5/065f46?text=IL' }, status: 'Completed', startDate: '2025-02-01', dueDate: '2025-03-31', progress: 100, assignedStaff: [{ id: 's1', initials: 'AS', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }], lastUpdated: '2025-03-15', priority: 'Medium' },
  { id: 'proj-003', name: 'Mobile App Dev', client: { name: 'Example Corp', initials: 'EC', logoUrl: 'https://placehold.co/40x40/e2e8f0/64748b?text=EC' }, status: 'On Hold', startDate: '2025-03-01', dueDate: '2025-08-15', progress: 30, assignedStaff: [{ id: 's3', initials: 'CD', img: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' }], lastUpdated: '2025-04-01', priority: 'High' },
  { id: 'proj-004', name: 'SEO Optimization', client: { name: 'Global Solutions', initials: 'GS', logoUrl: 'https://placehold.co/40x40/fee2e2/991b1b?text=GS' }, status: 'In Progress', startDate: '2025-04-01', dueDate: '2025-07-31', progress: 15, assignedStaff: [{ id: 's2', initials: 'BJ', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, { id: 's3', initials: 'CD', img: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' }], lastUpdated: '2025-04-19', priority: 'Medium' },
  { id: 'proj-005', name: 'Cloud Migration', client: { name: 'Innovate Ltd', initials: 'IL', logoUrl: 'https://placehold.co/40x40/d1fae5/065f46?text=IL' }, status: 'Overdue', startDate: '2025-01-15', dueDate: '2025-04-15', progress: 90, assignedStaff: [{ id: 's1', initials: 'AS', img: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }], lastUpdated: '2025-04-10', priority: 'Critical' },
  { id: 'proj-006', name: 'Brand Identity', client: { name: 'Startup Hub', initials: 'SH', logoUrl: 'https://placehold.co/40x40/e0e7ff/3730a3?text=SH' }, status: 'Cancelled', startDate: '2025-03-10', dueDate: '2025-05-30', progress: 5, assignedStaff: [{ id: 's2', initials: 'BJ', img: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }], lastUpdated: '2025-03-25', priority: 'Low' },
];

// Mock stats (calculate from actual data in real app)
const projectStats = {
  overdue: 1,
  onHold: 1,
  completed: 1,
  inProgress: 2,
};

// Helper to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
  switch (status?.toLowerCase()) {
    case 'in progress': return 'info';
    case 'completed': return 'success';
    case 'on hold': return 'warning';
    case 'cancelled': return 'secondary';
    case 'overdue': return 'destructive';
    default: return 'outline';
  }
};

/**
 * ProjectsAdminPage Component
 *
 * Displays a list of projects for admin users with search, filtering,
 * stats, and management actions.
 */
export default function ProjectsAdminPage() {
  // --- State (Conceptual - Implement with useState/useReducer) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ status: [], priority: [], dateRange: null });
  // const [selectedRows, setSelectedRows] = useState<string[]>([]); // Store IDs of selected projects
  // const [projects, setProjects] = useState(projectsData); // Would be fetched data

  // --- Handlers (Conceptual) ---
  // handleSearchChange = (event) => { ... }
  // handleFilterChange = (filterType, value) => { ... }
  // handleSelectRow = (projectId, isSelected) => { ... }
  // handleSelectAll = (isSelected) => { ... }
  // handleBulkAction = (action) => { ... }
  // handleNewProject = () => { ... } // Open modal or navigate

  const isAllSelected = projectsData.length > 0 // && selectedRows.length === projectsData.length; // Replace with state
  const selectedRowCount = 0; // selectedRows.length; // Replace with state

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Projects</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects, clients..."
              className="pl-10 w-full"
              // value={searchTerm}
              // onChange={handleSearchChange}
            />
          </div>
          {/* Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" /> Filters <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {['All', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Overdue'].map(status => (
                 <DropdownMenuCheckboxItem
                   key={status}
                   // checked={filters.status.includes(status)} // Replace with state check
                   // onCheckedChange={(checked) => handleFilterChange('status', status, checked)} // Replace with handler
                 >
                   {status}
                 </DropdownMenuCheckboxItem>
              ))}
               <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
               {['All', 'Critical', 'High', 'Medium', 'Low'].map(prio => (
                 <DropdownMenuCheckboxItem
                   key={prio}
                   // checked={filters.priority.includes(prio)} // Replace with state check
                   // onCheckedChange={(checked) => handleFilterChange('priority', prio, checked)} // Replace with handler
                 >
                   {prio}
                 </DropdownMenuCheckboxItem>
              ))}
              {/* Add Date Filters (Created, Deadline) - Could use DatePicker component */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* New Project Button */}
          <Button className="w-full sm:w-auto" /* onClick={handleNewProject} */>
            <PlusCircle className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>
      </div>

      {/* 4. Stats & Filters (Optional Summary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6 flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-red-600">{projectStats.overdue}</p>
              <p className="text-sm text-gray-500">Overdue Projects</p>
            </div>
          </CardContent>
        </Card>
         <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6 flex items-center space-x-3">
            <PauseCircle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{projectStats.onHold}</p>
              <p className="text-sm text-gray-500">Projects On Hold</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6 flex items-center space-x-3">
            <Loader className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{projectStats.inProgress}</p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-lg">
          <CardContent className="pt-6 flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-green-600">{projectStats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions Bar (Appears when rows are selected) */}
      {selectedRowCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
           <span className="text-sm font-medium text-blue-800">{selectedRowCount} project(s) selected</span>
           <div className="flex items-center gap-2">
              {/* Add Bulk Action Buttons Here */}
             <Button variant="outline" size="sm" /* onClick={() => handleBulkAction('changeStatus')} */>Change Status</Button>
             <Button variant="outline" size="sm" /* onClick={() => handleBulkAction('reassign')} */>Reassign</Button>
             <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" /* onClick={() => handleBulkAction('archive')} */>Archive</Button>
           </div>
        </div>
      )}

      {/* 2. Projects Table */}
      <Card className="shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[40px] px-4">
                  <Checkbox
                    // checked={isAllSelected}
                    // onCheckedChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
                <TableHead className="min-w-[200px]">Project Name</TableHead>
                <TableHead className="min-w-[150px]">Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="min-w-[150px]">Dates (Start/Due)</TableHead>
                <TableHead className="min-w-[150px]">Progress</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsData.map((project) => (
                <TableRow key={project.id} data-state={false /* selectedRows.includes(project.id) ? 'selected' : undefined */}>
                  <TableCell className="px-4">
                    <Checkbox
                      // checked={selectedRows.includes(project.id)}
                      // onCheckedChange={(checked) => handleSelectRow(project.id, checked)}
                      aria-label={`Select row ${project.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-800 hover:underline cursor-pointer">
                    {/* Make this clickable to open detail modal/drawer/page */}
                    {project.name}
                    {project.priority && ['High', 'Critical'].includes(project.priority) &&
                      <Badge variant={project.priority === 'Critical' ? 'destructive' : 'warning'} className="ml-2 text-xs">{project.priority}</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.client.logoUrl} alt={project.client.name} />
                        <AvatarFallback className="text-xs">{project.client.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-700">{project.client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {project.startDate} <br /> {project.dueDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.progress} className="w-20 h-1.5" aria-label={`${project.progress}% complete`} />
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     {/* Simulate Avatar Group */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {project.assignedStaff.map((staff) => (
                        <Avatar key={staff.id} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={staff.img} alt={staff.initials} />
                          <AvatarFallback className="text-xs">{staff.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                       {project.assignedStaff.length === 0 && <span className="text-xs text-gray-500">Unassigned</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{project.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem /* onClick={() => handleViewProject(project.id)} */>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem /* onClick={() => handleEditProject(project.id)} */>
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem /* onClick={() => handleArchiveAction(project.id)} */>
                          <Archive className="w-4 h-4 mr-2" /> Archive
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                         <DropdownMenuCheckboxItem className="text-red-600 focus:bg-red-50 focus:text-red-700" /* onClick={() => handleDeleteAction(project.id)} */>
                           <Trash2 className="w-4 h-4 mr-2" /> Delete
                         </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {projectsData.length === 0 && (
                <TableRow>
                   <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                     No projects found.
                   </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {/* Add Pagination Controls Here if needed */}
      </Card>

       {/* 3. Project Detail Modal / Drawer (Conceptual) */}
       {/*
         Could use <Dialog> or <Sheet> from shadcn/ui here.
         Triggered by clicking project name or 'View Details' action.
         Would fetch/pass detailed project data to the modal/drawer component.
         Example:
         <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
           <DialogContent className="sm:max-w-[600px]"> // Or use Sheet for side drawer
             <ProjectDetailView projectId={selectedProjectId} />
           </DialogContent>
         </Dialog>
       */}

    </div>
  );
}

// --- Notes ---
// 1. State & Interactivity: This is a static layout. Real implementation requires React state (useState, useReducer) for search, filters, selections, and data fetching/mutation handlers.
// 2. Data Fetching: Replace mockData with API calls to fetch projects based on search/filters/pagination.
// 3. Components: Ensure all used shadcn/ui components are installed.
// 4. Detail View: Implement the modal/drawer/page for viewing project details separately.
// 5. Bulk Actions: Implement logic to handle actions on selected rows.
// 6. Pagination: For large datasets, add pagination controls below the table.

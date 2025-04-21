// Example file path: src/app/dashboard/admin/files/recent/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState, useCallback } from 'react';
import { format, isWithinInterval, subHours } from 'date-fns';
import { DateRange } from 'react-day-picker';
// import { useDropzone } from 'react-dropzone'; // Import if using react-dropzone

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Assumes you have a DatePickerWithRange component
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Adjust path as needed

// --- Icons ---
import {
  UploadCloud, Search, Filter, MoreHorizontal, Download, Trash2, Eye,
  FileText, FileImage, FileArchive, FileAudio, FileVideo, FileSpreadsheet, FileQuestion, Upload, // File type icons
  FileClock, CalendarDays, UserCheck, FileSymlink // Stat icons
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching, sorted by date desc) ---
const now = new Date();
const recentFilesData = [
  { id: 'doc-007', name: 'Meeting Notes April 21.docx', client: 'Client A', project: 'Project Alpha', type: 'DOCX', size: '45 KB', uploadedOn: subHours(now, 1), uploadedBy: 'Alice Smith' }, // Recent
  { id: 'doc-001', name: 'Contract Agreement Final.pdf', client: 'Example Corp', project: 'Website Redesign', type: 'PDF', size: '1.2 MB', uploadedOn: subHours(now, 5), uploadedBy: 'Alice Smith' }, // Recent
  { id: 'doc-004', name: 'Homepage Banner Ad.png', client: 'Innovate Ltd', project: 'Marketing Campaign', type: 'PNG', size: '550 KB', uploadedOn: subHours(now, 23), uploadedBy: 'Alice Smith' }, // Recent
  { id: 'doc-002', name: 'Invoice_INV-015.pdf', client: 'Example Corp', project: 'Website Redesign', type: 'PDF', size: '85 KB', uploadedOn: subHours(now, 26), uploadedBy: 'System' }, // Older
  { id: 'doc-005', name: 'Client Brief Notes.docx', client: 'Global Solutions', project: 'SEO Optimization', type: 'DOCX', size: '35 KB', uploadedOn: subHours(now, 48), uploadedBy: 'Charlie Davis' }, // Older
  { id: 'doc-003', name: 'Design Mockups V1.zip', client: 'Innovate Ltd', project: 'Marketing Campaign', type: 'ZIP', size: '15.8 MB', uploadedOn: subHours(now, 72), uploadedBy: 'Bob Johnson' }, // Older
  { id: 'doc-006', name: 'Budget Planning Q2.xlsx', client: 'Internal', project: 'Admin', type: 'XLSX', size: '60 KB', uploadedOn: subHours(now, 96), uploadedBy: 'Alice Smith' }, // Older
].sort((a, b) => b.uploadedOn.getTime() - a.uploadedOn.getTime()); // Ensure sorted by date descending

// Calculate Stats (Replace with backend aggregation)
const filesToday = recentFilesData.filter(f => isWithinInterval(f.uploadedOn, { start: subHours(now, 24), end: now })).length;
const filesThisWeek = recentFilesData.filter(f => isWithinInterval(f.uploadedOn, { start: subHours(now, 24 * 7), end: now })).length;
// Placeholder stats - implement real logic
const mostActiveUploader = "Alice Smith";
const mostCommonFileType = "PDF";

// --- Helper Function for File Icons (Same as AdminDocumentsPage) ---
const getFileIcon = (fileType: string) => {
  const type = fileType?.toLowerCase();
  switch (type) {
    case 'pdf': return <FileText className="w-5 h-5 text-red-600" />;
    case 'docx': case 'doc': return <FileText className="w-5 h-5 text-blue-600" />;
    case 'xlsx': case 'xls': return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'webp': return <FileImage className="w-5 h-5 text-purple-600" />;
    case 'zip': case 'rar': case '7z': return <FileArchive className="w-5 h-5 text-yellow-600" />;
    case 'mp3': case 'wav': case 'ogg': return <FileAudio className="w-5 h-5 text-orange-600" />;
    case 'mp4': case 'mov': case 'avi': return <FileVideo className="w-5 h-5 text-pink-600" />;
    default: return <FileQuestion className="w-5 h-5 text-gray-500" />;
  }
};

// Helper to check if a file is "new" (e.g., uploaded within last 24 hours)
const isFileNew = (uploadDate: Date): boolean => {
  return isWithinInterval(uploadDate, { start: subHours(new Date(), 24), end: new Date() });
};


/**
 * AdminRecentFilesPage Component
 *
 * Displays recently uploaded files with filtering and upload functionality.
 */
export default function AdminRecentFilesPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State for files in dropzone
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();

  // --- State for Filters (Conceptual) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ type: [], client: '', project: '', uploader: '' });
  // const [files, setFiles] = useState(recentFilesData); // Would be fetched/filtered data

  // --- react-dropzone Integration (Conceptual - Same as AdminDocumentsPage) ---
  // const onDrop = useCallback((acceptedFiles: File[]) => { setUploadedFiles(acceptedFiles); }, []);
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // --- TODO: Handlers ---
  const handleUploadSubmit = () => {
    console.log("Submitting upload...", uploadedFiles);
    // API call logic here...
    setIsUploadModalOpen(false);
    setUploadedFiles([]);
    // Refresh file list
  };

  const handleDownload = (docId: string) => console.log("Download:", docId);
  const handleDelete = (docId: string) => console.log("Delete:", docId);
  const handlePreview = (docId: string) => console.log("Preview:", docId);


  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Recent Files</h1>
           <p className="text-gray-600 mt-1">Latest documents uploaded by you or your team.</p>
         </div>
        <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
          <UploadCloud className="w-4 h-4 mr-2" /> Upload New File
        </Button>
      </div>

       {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 pb-4 border-b">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search by name, client, type..." className="pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
             {/* Add Filter Dropdowns: Client/Project, Uploader, Type */}
             <Select><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter Uploader" /></SelectTrigger><SelectContent><SelectItem value="all">All Uploaders</SelectItem><SelectItem value="s1">Alice Smith</SelectItem></SelectContent></Select>
             <Select><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Filter Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="pdf">PDF</SelectItem><SelectItem value="docx">DOCX</SelectItem></SelectContent></Select>
             {/* Date Range Filter */}
             <DatePickerWithRange date={dateFilter} setDate={setDateFilter} className="w-full sm:w-auto" buttonClassName="w-full sm:w-[260px]" />
          </div>
      </div>

       {/* 2. Summary Info Cards (Optional) */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Files Uploaded Today</CardTitle><FileClock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{filesToday}</div></CardContent></Card>
          <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Files This Week</CardTitle><CalendarDays className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{filesThisWeek}</div></CardContent></Card>
          <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Most Active Uploader</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mostActiveUploader}</div></CardContent></Card>
          <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Most Common Type</CardTitle><FileSymlink className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{mostCommonFileType}</div></CardContent></Card>
       </div>


      {/* 3. Files Table View */}
      <Card className="shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="min-w-[250px]">File Name</TableHead>
                <TableHead>Client / Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Uploaded On</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentFilesData.map((doc) => {
                const isNew = isFileNew(doc.uploadedOn);
                return (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getFileIcon(doc.type)}
                        <span className="font-medium text-gray-800 hover:underline cursor-pointer truncate" title={doc.name} onClick={() => handlePreview(doc.id)}>
                          {doc.name}
                        </span>
                        {isNew && <Badge variant="success" className="text-xs h-5">New</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.client} / {doc.project}</TableCell>
                    <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.uploadedBy}</TableCell>
                    <TableCell className="text-sm text-gray-600" title={format(doc.uploadedOn, 'PPP p')}>

                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Actions</span></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePreview(doc.id)}><Eye className="w-4 h-4 mr-2" /> View / Preview</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(doc.id)}><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleDelete(doc.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {recentFilesData.length === 0 && (
                 <TableRow><TableCell colSpan={6} className="h-24 text-center text-gray-500">No recent files found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {/* Add Pagination Controls Here if needed */}
      </Card>

      {/* Upload Modal (Same as AdminDocumentsPage) */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
         <DialogContent className="sm:max-w-[525px]">
           <DialogHeader>
             <DialogTitle>Upload New Document</DialogTitle>
             <DialogDescription>Select or drag and drop files. Associate them with a client or project.</DialogDescription>
           </DialogHeader>
           <div className="py-4 space-y-4">
              {/* Simulated Dropzone - Replace with react-dropzone */}
              <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors border-gray-300`}>
                {/* <input {...getInputProps()} /> */}
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                {uploadedFiles.length > 0 ? (
                  <div className="text-sm text-gray-700"> Selected: {uploadedFiles.map(f => f.name).join(', ')} </div>
                ) : ( <p className="text-gray-500">Drag & drop or click to select</p> )}
              </div>
              {/* Association Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div><Label htmlFor="client-select-recent">Client</Label><Select><SelectTrigger id="client-select-recent"><SelectValue placeholder="Select Client" /></SelectTrigger><SelectContent><SelectItem value="c1">Example Corp</SelectItem></SelectContent></Select></div>
                 <div><Label htmlFor="project-select-recent">Project</Label><Select><SelectTrigger id="project-select-recent"><SelectValue placeholder="Select Project" /></SelectTrigger><SelectContent><SelectItem value="p1">Website Redesign</SelectItem></SelectContent></Select></div>
              </div>
              <div><Label htmlFor="upload-notes-recent">Notes</Label><Textarea id="upload-notes-recent" placeholder="Optional notes..." /></div>
           </div>
           <DialogFooter>
              <Button variant="outline" onClick={() => { setIsUploadModalOpen(false); setUploadedFiles([]); }}>Cancel</Button>
              <Button onClick={handleUploadSubmit} disabled={uploadedFiles.length === 0}>Upload</Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mock data with API calls. Ensure the API sorts files by upload date descending by default. Apply filters server-side or client-side.
// 2. File Upload Library: Integrate `react-dropzone` for the upload modal.
// 3. State Management: Use state for filters, fetched files, and modal states.
// 4. API Integration: Connect upload, download, delete, and preview actions to your backend.
// 5. Date Formatting: Uses `date-fns`. Ensure it's installed.
// 6. "New" Badge Logic: The `isFileNew` function checks if the upload date is within the last 24 hours. Adjust the interval as needed.

// Example file path: src/app/dashboard/admin/documents/page.tsx

"use client"; // Required for Hooks

import React, { useState, useCallback } from 'react';
// import { useDropzone } from 'react-dropzone'; // Import if using react-dropzone

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // For filters or bulk actions
import { Label } from "@/components/ui/label";import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns'; // For relative time

import {
  UploadCloud, Search, Filter, MoreHorizontal, Download, Trash2, Edit, Eye, FolderPlus,
  FileText, FileImage, FileArchive, FileAudio, FileVideo, FileSpreadsheet, FileQuestion, Upload // Icons
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching) ---
const documentsData = [
  { id: 'doc-001', name: 'Contract Agreement Final.pdf', client: 'Example Corp', project: 'Website Redesign', type: 'PDF', size: '1.2 MB', uploadedOn: new Date(2025, 0, 10), uploadedBy: 'Alice Smith' },
  { id: 'doc-002', name: 'Invoice_INV-015.pdf', client: 'Example Corp', project: 'Website Redesign', type: 'PDF', size: '85 KB', uploadedOn: new Date(2025, 3, 15), uploadedBy: 'System' },
  { id: 'doc-003', name: 'Design Mockups V1.zip', client: 'Innovate Ltd', project: 'Marketing Campaign', type: 'ZIP', size: '15.8 MB', uploadedOn: new Date(2025, 2, 20), uploadedBy: 'Bob Johnson' },
  { id: 'doc-004', name: 'Homepage Banner Ad.png', client: 'Innovate Ltd', project: 'Marketing Campaign', type: 'PNG', size: '550 KB', uploadedOn: new Date(2025, 3, 1), uploadedBy: 'Alice Smith' },
  { id: 'doc-005', name: 'Client Brief Notes.docx', client: 'Global Solutions', project: 'SEO Optimization', type: 'DOCX', size: '35 KB', uploadedOn: new Date(2025, 3, 18), uploadedBy: 'Charlie Davis' },
  { id: 'doc-006', name: 'Budget Planning Q2.xlsx', client: 'Internal', project: 'Admin', type: 'XLSX', size: '60 KB', uploadedOn: new Date(2025, 3, 5), uploadedBy: 'Alice Smith' },
];

// --- Helper Function for File Icons ---
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

/**
 * AdminDocumentsPage Component
 *
 * Allows admins to manage, upload, search, and filter documents.
 */
export default function AdminDocumentsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State for files in dropzone

  // --- State for Filters (Conceptual) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ type: [], client: '', project: '', uploader: '' });
  // const [documents, setDocuments] = useState(documentsData); // Would be fetched/filtered data

  // --- react-dropzone Integration (Conceptual) ---
  // const onDrop = useCallback((acceptedFiles: File[]) => {
  //   // Do something with the files
  //   console.log(acceptedFiles);
  //   setUploadedFiles(acceptedFiles); // Update state to show file names
  // }, []);
  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // --- TODO: Handlers ---
  const handleUploadSubmit = () => {
    // 1. Get selected client/project/notes from form state
    // 2. Get files from `uploadedFiles` state (or directly from dropzone state)
    // 3. Call API to upload files and associate metadata
    // 4. On success: close modal, refresh document list, clear `uploadedFiles` state
    console.log("Submitting upload...", uploadedFiles);
    setIsUploadModalOpen(false);
    setUploadedFiles([]); // Clear after simulated upload
  };

  const handleDownload = (docId: string) => {
    console.log("Download:", docId);
    // Implement download logic (e.g., fetch file URL from API)
  };

  const handleDelete = (docId: string) => {
    console.log("Delete:", docId);
    // Implement delete logic (API call, update state)
    // Consider soft delete / trash bin feature
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Documents</h1>
        <div className="flex items-center gap-2">
           {/* Optional: Create Folder Button */}
           {/* <Button variant="outline" size="sm"><FolderPlus className="w-4 h-4 mr-2" /> Create Folder</Button> */}
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsUploadModalOpen(true)}>
                <UploadCloud className="w-4 h-4 mr-2" /> Upload Document
              </Button>
            </DialogTrigger>
            {/* 4. Upload Modal Content */}
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
                <DialogDescription>
                  Select or drag and drop files here. Associate them with a client or project.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                 {/* Simulated Dropzone - Replace with react-dropzone */}
                 <div
                   // {...getRootProps()} // Spread props from useDropzone here
                   className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors ${false /* isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300' */}`}
                 >
                   <input /* {...getInputProps()} */ /> {/* Input props from useDropzone */}
                   <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                   {
                     uploadedFiles.length > 0 ? (
                       <div className="text-sm text-gray-700">
                         <p className="font-medium mb-1">Selected Files:</p>
                         <ul className="list-disc list-inside text-left max-h-24 overflow-y-auto">
                           {uploadedFiles.map(file => <li key={file.name}>{file.name}</li>)}
                         </ul>
                       </div>
                     ) : false /* isDragActive */ ? (
                       <p className="text-blue-600 font-medium">Drop the files here ...</p>
                     ) : (
                       <p className="text-gray-500">Drag & drop files here, or click to select files</p>
                     )
                   }
                 </div>
                 {/* End Simulated Dropzone */}

                 {/* Association Fields */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client-select">Associate with Client</Label>
                      <Select>
                        <SelectTrigger id="client-select"><SelectValue placeholder="Select Client" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client-123">Example Corp</SelectItem>
                          <SelectItem value="client-456">Innovate Ltd</SelectItem>
                          <SelectItem value="client-789">Global Solutions</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="project-select">Associate with Project</Label>
                      <Select>
                        <SelectTrigger id="project-select"><SelectValue placeholder="Select Project" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="proj-001">Website Redesign</SelectItem>
                          <SelectItem value="proj-002">Marketing Campaign</SelectItem>
                          <SelectItem value="proj-004">SEO Optimization</SelectItem>
                           <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                 </div>

                 {/* Optional Notes */}
                 <div>
                    <Label htmlFor="upload-notes">Notes (Optional)</Label>
                    <Textarea id="upload-notes" placeholder="Add any relevant notes about these documents..." />
                 </div>

              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => { setIsUploadModalOpen(false); setUploadedFiles([]); }}>Cancel</Button>
                 <Button onClick={handleUploadSubmit} disabled={uploadedFiles.length === 0}>
                   Upload {uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ''}
                 </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 2. Filters / Search */}
      <div className="flex flex-col md:flex-row gap-3">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search by file name, client, project..."
              className="pl-10 w-full"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Add Filter Dropdowns Here (Type, Date, Client, Project, Uploader) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="w-4 h-4 mr-2" /> Filter By Type <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded">Any</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               {/* Add Checkbox items for file types */}
               <DropdownMenuItem>PDF</DropdownMenuItem>
               <DropdownMenuItem>DOCX</DropdownMenuItem>
               <DropdownMenuItem>PNG</DropdownMenuItem>
               {/* ... more types */}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Add more filter buttons/dropdowns as needed */}
      </div>

      {/* 3. Documents Table */}
      <Card className="shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                 {/* Optional Checkbox for Bulk Actions */}
                 {/* <TableHead className="w-[40px] px-4"><Checkbox /></TableHead> */}
                <TableHead className="min-w-[250px]">File Name</TableHead>
                <TableHead>Client / Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded On</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documentsData.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-gray-50">
                  {/* <TableCell className="px-4"><Checkbox /></TableCell> */}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getFileIcon(doc.type)}
                      <span className="font-medium text-gray-800 hover:underline cursor-pointer truncate" title={doc.name}>
                        {/* Make clickable for preview/detail modal */}
                        {doc.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {doc.client} / {doc.project}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{doc.type}</Badge>
                  </TableCell>
                   <TableCell className="text-sm text-gray-600">{doc.size}</TableCell>
                  <TableCell className="text-sm text-gray-600" title={doc.uploadedOn.toLocaleString()}>
                     {formatDistanceToNow(doc.uploadedOn, { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{doc.uploadedBy}</TableCell>
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
                         <DropdownMenuItem onClick={() => handleDownload(doc.id)}>
                          <Download className="w-4 h-4 mr-2" /> Download
                        </DropdownMenuItem>
                         {/* <DropdownMenuItem> <Eye className="w-4 h-4 mr-2" /> Preview </DropdownMenuItem> */}
                         {/* <DropdownMenuItem> <Edit className="w-4 h-4 mr-2" /> Rename / Edit </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                         <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-700" onClick={() => handleDelete(doc.id)}>
                           <Trash2 className="w-4 h-4 mr-2" /> Delete
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {documentsData.length === 0 && (
                <TableRow>
                   <TableCell colSpan={8 /* Adjust colSpan based on columns */} className="h-24 text-center text-gray-500">
                     No documents found. Use the upload button to add some.
                   </TableCell>
                 </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
         {/* Add Pagination Controls Here if needed */}
      </Card>
    </div>
  );
}

// --- Notes ---
// 1. File Upload Library: For robust file handling (drag & drop, progress), install and use `react-dropzone` or a similar library. Replace the simulated dropzone div.
// 2. State Management: Implement state for search terms, filters, selected files (for bulk actions), and fetched document data.
// 3. API Integration: Connect `handleUploadSubmit`, `handleDownload`, `handleDelete`, and data fetching to your backend API.
// 4. Filtering/Sorting: Implement the logic to filter and sort the `documentsData` based on selected filters and table header clicks.
// 5. Preview/Detail Modal: Clicking a file name could open another `Dialog` showing a preview (if possible for the file type) or more details.
// 6. Bulk Actions: Add Checkboxes to the table and implement logic for actions on selected rows.

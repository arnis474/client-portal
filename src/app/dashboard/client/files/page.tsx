// Example file path: src/app/client/documents/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
// Assumes you have a DatePickerWithRange component
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Adjust path as needed

// --- Icons ---
import {
  Search, FolderKanban, ListFilter, CalendarDays, // Filters
  Download, Eye, // Actions
  FileText, FileImage, FileArchive, FileAudio, FileVideo, FileSpreadsheet, FileQuestion, // File types
  FolderOpen, Briefcase, Mail // Empty State
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetched for the logged-in client) ---
const clientDocumentsData = [
 { id: 'cdoc-001', name: 'Invoice_302.pdf', project: 'Website Revamp', type: 'PDF', uploadedOn: new Date(2025, 3, 20, 15, 12), uploadedBy: 'Alice Smith', size: '95 KB' },
 { id: 'cdoc-002', name: 'BrandAssets_v2.zip', project: 'Logo Redo', type: 'ZIP', uploadedOn: new Date(2025, 3, 20, 12, 0), uploadedBy: 'Martin G.', size: '22.5 MB' },
 { id: 'cdoc-003', name: 'Final_Contract_Signed.docx', project: 'Rebrand Project', type: 'DOCX', uploadedOn: new Date(2025, 3, 19, 16, 12), uploadedBy: 'Sarah Chen', size: '110 KB' },
 { id: 'cdoc-004', name: 'Homepage_Mockup_Apr18.png', project: 'Website Revamp', type: 'PNG', uploadedOn: new Date(2025, 3, 18, 9, 30), uploadedBy: 'Alice Smith', size: '1.8 MB' },
 { id: 'cdoc-005', name: 'Marketing_Plan_Q3.pdf', project: 'Marketing Strategy', type: 'PDF', uploadedOn: new Date(2025, 3, 15, 14, 0), uploadedBy: 'Bob Johnson', size: '2.1 MB' },
].sort((a, b) => b.uploadedOn.getTime() - a.uploadedOn.getTime()); // Sort by newest first

// --- Helper Function for File Icons (Same as Admin Pages) ---
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
 * ClientDocumentsPage Component
 *
 * Allows clients to view and download documents shared with them.
 */
export default function ClientDocumentsPage() {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<(typeof clientDocumentsData)[0] | null>(null);
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();

  // --- State for Filters (Conceptual) ---
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filters, setFilters] = useState({ project: 'all', type: 'all' });
  // const [documents, setDocuments] = useState(clientDocumentsData); // Would be fetched/filtered data

  const hasDocuments = clientDocumentsData.length > 0; // Replace with check on fetched data state

  const handlePreviewClick = (doc: (typeof clientDocumentsData)[0]) => {
    setSelectedDocument(doc);
    setIsPreviewModalOpen(true);
    // In a real app, you might fetch more details or a preview URL here
  };

  const handleDownload = (docId: string, docName: string) => {
    console.log("Download:", docId, docName);
    // Implement download logic (e.g., fetch file URL from API and trigger download)
    alert(`Simulating download for: ${docName}`);
  };


  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Documents</h1>
        <p className="text-gray-600">Access all files shared with you by our team.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 pb-4 border-b">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search by file name or project..." className="pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
             <Select /* value={filters.project} ... */ >
               <SelectTrigger className="w-full sm:w-[180px]">
                 <FolderKanban className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Project" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Projects</SelectItem>
                 <SelectItem value="proj-web">Website Revamp</SelectItem>
                 <SelectItem value="proj-logo">Logo Redo</SelectItem>
                  {/* Add more projects dynamically */}
               </SelectContent>
             </Select>
             <Select /* value={filters.type} ... */ >
               <SelectTrigger className="w-full sm:w-[160px]">
                 <ListFilter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All File Types</SelectItem>
                 <SelectItem value="pdf">PDF</SelectItem>
                 <SelectItem value="docx">DOCX</SelectItem>
                 <SelectItem value="zip">ZIP</SelectItem>
                 <SelectItem value="png">PNG</SelectItem>
                  {/* Add more types */}
               </SelectContent>
             </Select>
              <DatePickerWithRange date={dateFilter} setDate={setDateFilter} className="w-full sm:w-auto" buttonClassName="w-full sm:w-[260px]" />
          </div>
      </div>

      {/* 2. File Table View */}
      {hasDocuments ? (
        <Card className="shadow-sm rounded-lg overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="min-w-[250px]">File Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded On</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientDocumentsData.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getFileIcon(doc.type)}
                        <span
                           className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer truncate"
                           title={doc.name}
                           onClick={() => handlePreviewClick(doc)}
                        >
                          {doc.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.project}</TableCell>
                    <TableCell><Badge variant="outline">{doc.type}</Badge></TableCell>
                    <TableCell className="text-sm text-gray-600" title={format(doc.uploadedOn, 'PPP p')}></TableCell>
                    <TableCell className="text-sm text-gray-600">{doc.uploadedBy}</TableCell>
                    <TableCell className="text-right space-x-1">
                       <Button variant="outline" size="xs" className="h-7 px-2 py-1" onClick={() => handlePreviewClick(doc)}>
                         <Eye className="w-3.5 h-3.5 mr-1" /> View
                       </Button>
                       <Button variant="outline" size="xs" className="h-7 px-2 py-1" onClick={() => handleDownload(doc.id, doc.name)}>
                         <Download className="w-3.5 h-3.5 mr-1" /> Download
                       </Button>
                       {/* Optional: Add Comment Button */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           {/* Add Pagination Controls Here if needed */}
        </Card>
      ) : (
        // 5. Empty State
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-white">
           <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
           <h2 className="text-xl font-semibold text-gray-700 mb-2">No documents have been shared with you yet.</h2>
           <p className="text-gray-500 mb-6 max-w-md">Files shared by your project team, such as invoices, contracts, or project assets, will appear here once they are uploaded.</p>
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => { /* Navigate to projects page */ }}>
                <Briefcase className="w-4 h-4 mr-2" /> View My Projects
             </Button>
             <Button variant="default">
                <Mail className="w-4 h-4 mr-2" /> Message Team
             </Button>
           </div>
        </div>
      )}

      {/* 4. File Preview Modal (Conceptual Example) */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
         <DialogContent className="sm:max-w-[600px]">
            {selectedDocument ? (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                     {getFileIcon(selectedDocument.type)} {selectedDocument.name}
                  </DialogTitle>
                  <DialogDescription>
                     Project: {selectedDocument.project} | Type: {selectedDocument.type} | Size: {selectedDocument.size} <br/>
                     Uploaded by {selectedDocument.uploadedBy} on {format(selectedDocument.uploadedOn, 'PPP p')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 min-h-[200px] bg-gray-100 rounded flex items-center justify-center">
                   {/* TODO: Implement actual file preview here */}
                   {/* For images: <img src={previewUrl} alt="Preview" /> */}
                   {/* For PDFs: Use react-pdf or an iframe */}
                   <p className="text-gray-500 italic">(File preview area - requires implementation)</p>
                </div>
                {/* Optional: Add comments section here */}
                <DialogFooter className="sm:justify-between">
                   <span className="text-xs text-gray-500 mt-2 sm:mt-0">Preview functionality depends on file type.</span>
                   <div className="flex gap-2">
                     <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>Close</Button>
                     <Button onClick={() => handleDownload(selectedDocument.id, selectedDocument.name)}>
                        <Download className="w-4 h-4 mr-2" /> Download File
                     </Button>
                   </div>
                </DialogFooter>
              </>
            ) : (
               <DialogHeader><DialogTitle>No Document Selected</DialogTitle></DialogHeader>
            )}
         </DialogContent>
       </Dialog>

    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mock data with API calls specific to the logged-in client's accessible documents. Apply filters server-side or client-side.
// 2. State Management: Use state for filters, fetched documents, and modal states.
// 3. File Preview: Implementing the preview modal requires logic based on file type (e.g., using an `<img>` tag for images, `react-pdf` or an `<iframe>` for PDFs, or simply showing file details for unsupported types).
// 4. Actions: Implement the actual download logic. Consider adding commenting functionality if needed.
// 5. Date Picker: Ensure the `DatePickerWithRange` component is available and configured.

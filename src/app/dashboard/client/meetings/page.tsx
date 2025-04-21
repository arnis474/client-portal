// Example file path: src/app/client/meetings/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState } from 'react';
import { format, parseISO, isPast, isFuture, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { DateRange } from "react-day-picker";

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // Used within DatePicker
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Used within DatePicker
// Assumes you have a DatePickerWithRange component
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Adjust path as needed

// --- Icons ---
import {
  Search, ListFilter, CalendarDays, // Filters
  Eye, Calendar as CalendarIconAlt, Video, XCircle, FileText, Send, PlusCircle, // Actions & Request
  CalendarX // Empty State
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetched for the logged-in client) ---
// Current time reference: Monday, April 21, 2025 4:01 AM BST
const now = new Date(2025, 3, 21, 4, 1, 0); // Month is 0-indexed (3 = April)

const clientMeetingsData = [
  // Upcoming
  { id: 'meet-001', topic: 'Project Kickoff Call', project: 'Website Redesign', dateTime: '2025-04-24T10:00:00Z', durationMinutes: 60, with: 'Alice Smith (PM)', status: 'Confirmed', meetingLink: 'https://meet.google.com/xyz-abc-def' },
  { id: 'meet-002', topic: 'Website Design Review', project: 'Website Redesign', dateTime: '2025-04-28T14:00:00Z', durationMinutes: 45, with: 'Martin G. (Dev)', status: 'Pending', meetingLink: null },
  { id: 'meet-003', topic: 'Quick Sync', project: 'Brand Refresh', dateTime: '2025-05-02T09:30:00Z', durationMinutes: 15, with: 'Sarah Chen', status: 'Confirmed', meetingLink: 'https://zoom.us/j/123456' },
  // Past
  { id: 'meet-004', topic: 'Brand Discovery Session', project: 'Brand Refresh', dateTime: '2025-04-10T14:00:00Z', durationMinutes: 90, with: 'Sarah Chen', status: 'Completed', notesAvailable: true },
  { id: 'meet-005', topic: 'Contract Review', project: 'Initial Setup', dateTime: '2025-04-02T11:00:00Z', durationMinutes: 30, with: 'Alice Smith (PM)', status: 'Completed', notesAvailable: false },
  { id: 'meet-006', topic: 'Marketing Strategy Intro', project: 'Marketing Strategy', dateTime: '2025-04-15T15:00:00Z', durationMinutes: 45, with: 'Bob Johnson', status: 'Cancelled', notesAvailable: false },
];

// Separate into upcoming and past based on current time
const upcomingMeetings = clientMeetingsData
  .filter(m => isFuture(parseISO(m.dateTime)))
  .sort((a, b) => parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime());

const pastMeetings = clientMeetingsData
  .filter(m => isPast(parseISO(m.dateTime)))
  .sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime());


// --- Helper Functions ---
const getStatusProps = (status: string): { variant: "success" | "warning" | "secondary" | "outline"; colorClass: string } => {
  switch (status?.toLowerCase()) {
    case 'confirmed': return { variant: 'success', colorClass: 'bg-green-100 text-green-700 border-green-200' };
    case 'pending': return { variant: 'warning', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    case 'cancelled': return { variant: 'secondary', colorClass: 'bg-gray-100 text-gray-600 border-gray-200' };
    case 'completed': return { variant: 'outline', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' }; // Custom style for past completed
    default: return { variant: 'outline', colorClass: 'bg-gray-100 text-gray-500 border-gray-200' };
  }
};

// Check if a meeting is joinable (e.g., starts within 10 mins or is ongoing)
const isMeetingJoinable = (dateTime: string, durationMinutes: number, link: string | null): boolean => {
  if (!link) return false;
  const start = parseISO(dateTime);
  const end = addMinutes(start, durationMinutes);
  const startWindow = subMinutes(start, 10); // Allow joining 10 mins before
  return isWithinInterval(now, { start: startWindow, end: end });
};


/**
 * ClientMeetingsPage Component
 *
 * Allows clients to view upcoming/past meetings and request new ones.
 */
export default function ClientMeetingsPage() {
  const [requestMeetingDate, setRequestMeetingDate] = useState<Date | undefined>();

  // --- State for Filters (Conceptual) ---
  // const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  // const [statusFilter, setStatusFilter] = useState<string>('all');
  // const [searchTerm, setSearchTerm] = useState('');
  // Filter logic would apply to upcomingMeetings and pastMeetings arrays

  const hasUpcomingMeetings = upcomingMeetings.length > 0;
  const hasPastMeetings = pastMeetings.length > 0;
  const hasAnyMeetings = hasUpcomingMeetings || hasPastMeetings;

  // --- TODO: Handlers ---
  const handleViewDetails = (meetingId: string) => console.log("View Details:", meetingId);
  const handleReschedule = (meetingId: string) => console.log("Request Reschedule:", meetingId);
  const handleCancel = (meetingId: string) => console.log("Request Cancel:", meetingId);
  const handleViewNotes = (meetingId: string) => console.log("View Notes:", meetingId);
  const handleRequestMeeting = () => {
     // Get data from form state (topic, date, project, message)
     console.log("Submitting meeting request...");
     // Implement API call or email trigger
     // Clear form state
     setRequestMeetingDate(undefined);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Meetings</h1>
        <p className="text-gray-600">Track upcoming and past meetings with our team.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 pb-4 border-b">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search by topic or project..." className="pl-10 w-full" />
          </div>
          <div className="flex flex-wrap gap-2">
             {/* <DatePickerWithRange date={dateFilter} setDate={setDateFilter} className="w-full sm:w-auto" buttonClassName="w-full sm:w-[260px]" /> */}
             <Select /* value={statusFilter} onValueChange={setStatusFilter} */ >
               <SelectTrigger className="w-full sm:w-[180px]">
                 <ListFilter className="w-4 h-4 mr-2" />
                 <SelectValue placeholder="Filter Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Statuses</SelectItem>
                 <SelectItem value="upcoming">Upcoming</SelectItem>
                 <SelectItem value="completed">Completed</SelectItem>
                 <SelectItem value="cancelled">Cancelled</SelectItem>
               </SelectContent>
             </Select>
          </div>
      </div>

      {!hasAnyMeetings ? (
         // 5. Empty State
         <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-white">
            <CalendarX className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">You don’t have any meetings scheduled yet.</h2>
            <p className="text-gray-500 mb-6 max-w-md">Your scheduled calls with our team will appear here. You can also request a new meeting below.</p>
            {/* Button to scroll to request form or open modal */}
            <Button onClick={() => document.getElementById('request-meeting')?.scrollIntoView({ behavior: 'smooth' })}>
               <PlusCircle className="w-4 h-4 mr-2" /> Request a Meeting
            </Button>
         </div>
      ) : (
         <div className="space-y-8">
            {/* 2. Upcoming Meetings Section */}
            {hasUpcomingMeetings && (
               <Card>
                  <CardHeader><CardTitle>Upcoming Meetings</CardTitle></CardHeader>
                  <CardContent className="p-0">
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead className="min-w-[150px]">Topic / Project</TableHead>
                           <TableHead>Date & Time</TableHead>
                           <TableHead>With</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {upcomingMeetings.map((meet) => {
                            const statusProps = getStatusProps(meet.status);
                            const joinable = isMeetingJoinable(meet.dateTime, meet.durationMinutes, meet.meetingLink);
                            const meetingStart = parseISO(meet.dateTime);
                            return (
                              <TableRow key={meet.id}>
                                <TableCell className="font-medium">{meet.topic}<br/><span className="text-xs text-gray-500">{meet.project}</span></TableCell>
                                <TableCell>{format(meetingStart, 'MMM dd, yyyy p')}</TableCell>
                                <TableCell>{meet.with}</TableCell>
                                <TableCell><Badge variant={statusProps.variant} className={statusProps.colorClass}>{meet.status}</Badge></TableCell>
                                <TableCell className="text-right space-x-1">
                                   {joinable && meet.meetingLink && (
                                      <Button size="xs" asChild className="h-7 px-2 py-1 bg-green-600 hover:bg-green-700 text-white">
                                         <a href={meet.meetingLink} target="_blank" rel="noopener noreferrer"><Video className="w-3.5 h-3.5 mr-1" /> Join</a>
                                      </Button>
                                   )}
                                   <Button variant="outline" size="xs" className="h-7 px-2 py-1" onClick={() => handleViewDetails(meet.id)}><Eye className="w-3.5 h-3.5 mr-1" /> View</Button>
                                   {meet.status !== 'Cancelled' && <Button variant="outline" size="xs" className="h-7 px-2 py-1" onClick={() => handleReschedule(meet.id)}><CalendarIconAlt className="w-3.5 h-3.5 mr-1" /> Reschedule</Button>}
                                   {meet.status !== 'Cancelled' && <Button variant="ghost" size="xs" className="h-7 px-2 py-1 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleCancel(meet.id)}><XCircle className="w-3.5 h-3.5 mr-1" /> Cancel</Button>}
                                </TableCell>
                              </TableRow>
                            );
                         })}
                       </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            )}

            {/* 3. Past Meetings Section */}
             {hasPastMeetings && (
               <Card>
                  <CardHeader><CardTitle>Past Meetings</CardTitle></CardHeader>
                  <CardContent className="p-0">
                     <Table>
                       <TableHeader>
                         <TableRow>
                           <TableHead className="min-w-[150px]">Topic / Project</TableHead>
                           <TableHead>Date</TableHead>
                           <TableHead>With</TableHead>
                           <TableHead>Outcome</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                       </TableHeader>
                       <TableBody>
                         {pastMeetings.map((meet) => {
                            const statusProps = getStatusProps(meet.status);
                            const meetingDate = parseISO(meet.dateTime);
                            return (
                              <TableRow key={meet.id}>
                                <TableCell className="font-medium">{meet.topic}<br/><span className="text-xs text-gray-500">{meet.project}</span></TableCell>
                                <TableCell>{format(meetingDate, 'MMM dd, yyyy')}</TableCell>
                                <TableCell>{meet.with}</TableCell>
                                <TableCell><Badge variant={statusProps.variant} className={statusProps.colorClass}>{meet.status}</Badge></TableCell>
                                <TableCell className="text-right space-x-1">
                                   {meet.status === 'Completed' && meet.notesAvailable && <Button variant="outline" size="xs" className="h-7 px-2 py-1" onClick={() => handleViewNotes(meet.id)}><FileText className="w-3.5 h-3.5 mr-1" /> View Notes</Button>}
                                   {/* Add other relevant past actions */}
                                </TableCell>
                              </TableRow>
                            );
                         })}
                       </TableBody>
                     </Table>
                  </CardContent>
               </Card>
            )}
         </div>
      )}


      {/* 4. Meeting Request Section (Optional) */}
      <Card id="request-meeting" className="mt-8">
         <CardHeader>
            <CardTitle>Request a Meeting</CardTitle>
            <CardDescription>Need to discuss something? Suggest a time that works for you.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
               <div>
                  <Label htmlFor="request-topic">Topic</Label>
                  <Input id="request-topic" placeholder="e.g., Discuss project timeline" />
               </div>
                <div>
                  <Label htmlFor="request-project">Related Project (Optional)</Label>
                  <Select>
                    <SelectTrigger id="request-project"><SelectValue placeholder="Select Project" /></SelectTrigger>
                    <SelectContent><SelectItem value="p1">Website Redesign</SelectItem><SelectItem value="p2">Brand Refresh</SelectItem></SelectContent>
                  </Select>
               </div>
            </div>
             <div>
               <Label htmlFor="request-datetime">Preferred Date & Time</Label>
               {/* Basic Date Picker - Consider a more advanced time slot picker */}
               <Popover>
                 <PopoverTrigger asChild>
                   <Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!requestMeetingDate && "text-muted-foreground"}`}>
                     <CalendarIconAlt className="mr-2 h-4 w-4" />
                     {requestMeetingDate ? format(requestMeetingDate, "PPP") : <span>Pick a preferred date</span>}
                   </Button>
                 </PopoverTrigger>
                 <PopoverContent className="w-auto p-0">
                   <Calendar mode="single" selected={requestMeetingDate} onSelect={setRequestMeetingDate} initialFocus />
                 </PopoverContent>
               </Popover>
               {/* Add time input or suggestions */}
            </div>
             <div>
               <Label htmlFor="request-message">Message / Agenda</Label>
               <Textarea id="request-message" placeholder="Briefly describe what you'd like to discuss..." />
            </div>
         </CardContent>
         <CardFooter>
            <Button onClick={handleRequestMeeting}>
               <Send className="w-4 h-4 mr-2" /> Request Meeting
            </Button>
         </CardFooter>
      </Card>

    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mock data with API calls specific to the logged-in client's meetings. Apply filters server-side or client-side.
// 2. State Management: Use state for filters, fetched meetings, and the request form inputs.
// 3. "Join" Button Logic: The `isMeetingJoinable` function provides basic logic. Adjust the time window (e.g., 10 mins before) as needed. Real-time updates might be better.
// 4. Actions: Implement API calls for requesting rescheduling/cancellation, fetching notes, and submitting the meeting request form.
// 5. Meeting Request Form: The date picker is basic. Consider integrating a calendar with time slots if needed. The form submission needs backend logic (e.g., send email, create DB entry).
// 6. Date/Time Handling: Uses `date-fns`. Ensure correct time zone handling if necessary, especially when comparing with `now`. The mock `now` uses local browser time implicitly via `new Date()`.

// Example file path: src/app/dashboard/admin/calendar/page.tsx

"use client"; // Required for FullCalendar and React Hooks

import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view
import timeGridPlugin from '@fullcalendar/timegrid'; // Week/Day view
import listPlugin from '@fullcalendar/list'; // List view
import interactionPlugin from '@fullcalendar/interaction'; // Needed for dateClick, eventClick, drag/drop
import { CalendarApi, EventApi, EventInput } from '@fullcalendar/core'; // Types
import { format } from 'date-fns'; // For date formatting if needed outside FullCalendar

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // For filters
import { Label } from "@/components/ui/label"; // For forms/filters
import {
  ChevronLeft, ChevronRight, CalendarDays, PlusCircle, Video, Pin, List, Clock, Users, Link as LinkIcon, Edit, Trash2, Filter, Rocket, X, Briefcase, UserMinus
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching) ---
const initialEvents: EventInput[] = [
  { id: 'event1', title: 'Client Meeting: Project Alpha Kickoff', start: '2025-04-22T10:00:00', end: '2025-04-22T11:00:00', extendedProps: { type: 'Client Meeting', client: 'Client X', project: 'Project Alpha', attendees: ['Admin User', 'Client Contact'], location: 'Zoom', description: 'Initial kickoff meeting.', meetingLink: 'https://zoom.us/j/12345' }, backgroundColor: '#ef4444', borderColor: '#dc2626' }, // Red
  { id: 'event2', title: 'Deadline: Website Launch - Client Y', start: '2025-04-25', allDay: true, extendedProps: { type: 'Project Deadline', client: 'Client Y', project: 'Website Redesign' }, backgroundColor: '#1f2937', borderColor: '#111827' }, // Dark Gray/Black
  { id: 'event3', title: 'Task: Send Report to Client X', start: '2025-04-23', extendedProps: { type: 'Internal Task', project: 'Project Alpha', assigned: ['Admin User'] }, backgroundColor: '#6b7280', borderColor: '#4b5563' }, // Gray
  { id: 'event4', title: 'Milestone: Phase 2 Approval - Project Z', start: '2025-04-28', allDay: true, extendedProps: { type: 'Milestone', project: 'Project Z' }, backgroundColor: '#3b82f6', borderColor: '#2563eb' }, // Blue
  { id: 'event5', title: 'Time Off: Alice Smith', start: '2025-04-24', end: '2025-04-26', display: 'background', extendedProps: { type: 'Time Off', employee: 'Alice Smith' }, backgroundColor: '#d1d5db' }, // Light Gray Background
   { id: 'event6', title: 'Team Standup', start: '2025-04-21T09:00:00', end: '2025-04-21T09:15:00', extendedProps: { type: 'Internal Meeting' }, backgroundColor: '#10b981', borderColor: '#059669' }, // Green
];

// --- Helper Function for Event Icons ---
const getEventIcon = (type: string) => {
  switch (type) {
    case 'Client Meeting': return <Video className="w-3 h-3 mr-1 inline-block" />;
    case 'Project Deadline': return <Pin className="w-3 h-3 mr-1 inline-block" />;
    case 'Internal Task': return <Briefcase className="w-3 h-3 mr-1 inline-block" />;
    case 'Milestone': return <Rocket className="w-3 h-3 mr-1 inline-block" />;
    case 'Internal Meeting': return <Users className="w-3 h-3 mr-1 inline-block" />;
    case 'Time Off': return <UserMinus className="w-3 h-3 mr-1 inline-block" />;
    default: return null;
  }
};

/**
 * AdminCalendarPage Component
 *
 * Displays an interactive calendar for managing admin events like meetings,
 * deadlines, tasks, etc.
 */
export default function AdminCalendarPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState('dayGridMonth'); // month, week, day, list
  const [events, setEvents] = useState<EventInput[]>(initialEvents); // Manage events state
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDate, setCreateModalDate] = useState<Date | null>(null); // For pre-filling date on dateClick

  // --- Calendar API Access ---
  const getCalendarApi = (): CalendarApi | null => {
    return calendarRef.current?.getApi() ?? null;
  };

  // --- Navigation Handlers ---
  const handlePrevClick = () => getCalendarApi()?.prev();
  const handleNextClick = () => getCalendarApi()?.next();
  const handleTodayClick = () => getCalendarApi()?.today();

  // --- View Change Handler ---
  const handleViewChange = (view: string) => {
    getCalendarApi()?.changeView(view);
    setCurrentView(view);
  };

  // --- Event Click Handler ---
  const handleEventClick = (clickInfo: { event: EventApi }) => {
    setSelectedEvent(clickInfo.event);
    setIsDetailModalOpen(true);
  };

  // --- Date Click Handler (Optional: Open Create Modal) ---
   const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
     setCreateModalDate(arg.date); // Pre-fill date for new event
     setIsCreateModalOpen(true);
   };

  // --- Modal Close Handlers ---
  const closeDetailModal = () => setIsDetailModalOpen(false);
  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateModalDate(null); // Reset pre-filled date
  }

  // --- Event Rendering Function ---
  const renderEventContent = (eventInfo: { event: EventApi }) => {
    const type = eventInfo.event.extendedProps.type || 'Unknown';
    const icon = getEventIcon(type);
    return (
      <div className="flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
        {icon}
        <b className="font-medium">{eventInfo.event.title}</b>
      </div>
    );
  };

  // --- TODO: Filter Logic ---
  // const [filters, setFilters] = useState({ types: [], members: [], clients: [] });
  // const filteredEvents = useMemo(() => {
  //   return events.filter(event => { /* Apply filter logic */ return true; });
  // }, [events, filters]);

  // --- TODO: Event CRUD Operations ---
  const handleCreateEvent = (newEventData: EventInput) => {
    // Add logic to save event (API call) and update state
    setEvents([...events, { ...newEventData, id: `event${Date.now()}` }]); // Simple add with temp ID
    closeCreateModal();
  };
  const handleUpdateEvent = (updatedEventData: EventInput) => {
    // Add logic to update event (API call) and update state
    setEvents(events.map(ev => ev.id === updatedEventData.id ? updatedEventData : ev));
    closeDetailModal();
  };
  const handleDeleteEvent = (eventId: string) => {
    // Add logic to delete event (API call) and update state
    setEvents(events.filter(ev => ev.id !== eventId));
    closeDetailModal();
  };


  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-white min-h-screen flex flex-col">

      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Calendar</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggles */}
           <Button variant={currentView === 'dayGridMonth' ? 'default' : 'outline'} size="sm" onClick={() => handleViewChange('dayGridMonth')}>Month</Button>
           <Button variant={currentView === 'timeGridWeek' ? 'default' : 'outline'} size="sm" onClick={() => handleViewChange('timeGridWeek')}>Week</Button>
           <Button variant={currentView === 'timeGridDay' ? 'default' : 'outline'} size="sm" onClick={() => handleViewChange('timeGridDay')}>Day</Button>
           <Button variant={currentView === 'listWeek' ? 'default' : 'outline'} size="sm" onClick={() => handleViewChange('listWeek')}>Agenda</Button>

          {/* Date Navigation */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={handlePrevClick} aria-label="Previous Period">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleTodayClick}>Today</Button>
            <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleNextClick} aria-label="Next Period">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Create Event Button */}
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <PlusCircle className="w-4 h-4 mr-2" /> Create Event
              </Button>
            </DialogTrigger>
            {/* Create Event Dialog Content (Simplified Example) */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              {/* Add Form Fields Here */}
              <div className="py-4 space-y-4">
                 <Input placeholder="Event Title" defaultValue="" />
                 <Select>
                   <SelectTrigger><SelectValue placeholder="Select Event Type" /></SelectTrigger>
                   <SelectContent>
                     <SelectItem value="Client Meeting">Client Meeting</SelectItem>
                     <SelectItem value="Project Deadline">Project Deadline</SelectItem>
                     <SelectItem value="Internal Task">Internal Task</SelectItem>
                     <SelectItem value="Milestone">Milestone</SelectItem>
                     <SelectItem value="Internal Meeting">Internal Meeting</SelectItem>
                     <SelectItem value="Time Off">Time Off</SelectItem>
                   </SelectContent>
                 </Select>
                 <Input type="datetime-local" defaultValue={createModalDate ? format(createModalDate, "yyyy-MM-dd'T'HH:mm") : ''} />
                 {/* Add fields for end date/time, description, client, project, attendees etc. */}
                 <Textarea placeholder="Description..." />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeCreateModal}>Cancel</Button>
                <Button onClick={() => handleCreateEvent({ /* Gather form data */ title: 'New Event', start: new Date() })}>Save Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
         {/* 4. Filtering Sidebar (Optional) */}
         <div className="w-64 border-r pr-6 hidden lg:block space-y-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><Filter className="w-4 h-4 mr-2"/> Filters</h3>
            {/* Event Type Filters */}
            <div>
              <Label className="font-medium">Event Type</Label>
              <div className="space-y-1 mt-2">
                 {['Client Meeting', 'Project Deadline', 'Internal Task', 'Milestone', 'Internal Meeting', 'Time Off'].map(type => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={`filter-${type}`} /* onCheckedChange={(checked) => handleFilterChange('type', type, checked)} */ />
                      <Label htmlFor={`filter-${type}`} className="text-sm font-normal">{type}</Label>
                    </div>
                 ))}
              </div>
            </div>
             {/* Team Member Filters */}
             <div>
              <Label className="font-medium">Team Member</Label>
              {/* Add Select or Checkboxes for team members */}
            </div>
             {/* Client Filters */}
             <div>
              <Label className="font-medium">Client</Label>
              {/* Add Select or Checkboxes for clients */}
            </div>
             {/* Project Filters */}
             <div>
              <Label className="font-medium">Project</Label>
              {/* Add Select or Checkboxes for projects */}
            </div>
         </div>

        {/* 2. Calendar Area */}
        <div className="flex-1 overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false} // Using custom header controls
            events={events /* Replace with filteredEvents when implemented */}
            eventClick={handleEventClick}
            dateClick={handleDateClick} // Handle clicking on a date
            editable={true} // Allows dragging/resizing (requires interactionPlugin)
            droppable={true} // Allows dropping external elements (requires interactionPlugin)
            // eventDrop={handleEventDrop} // Handle event drag-n-drop
            // eventResize={handleEventResize} // Handle event resize
            eventContent={renderEventContent} // Custom render function
            height="100%" // Fill available height
            // --- Customize appearance further ---
            // eventColor: '#378006' // Default color
            // eventTextColor: '#ffffff'
            // dayMaxEventRows={true} // For month view, limits rows and adds "+n more" link
            // views={{
            //   timeGridWeek: { buttonText: 'Week' },
            //   // Customize other views if needed
            // }}
          />
        </div>
      </div>

       {/* 3. Event Detail Modal */}
       <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
         <DialogContent>
           {selectedEvent ? (
             <>
               <DialogHeader>
                 <DialogTitle className="flex items-center">
                   {getEventIcon(selectedEvent.extendedProps.type)}
                   {selectedEvent.title}
                 </DialogTitle>
                 <DialogDescription>
                   {selectedEvent.extendedProps.type || 'Event'} - {format(selectedEvent.start ?? new Date(), 'PPP p')}
                   {selectedEvent.end && ` to ${format(selectedEvent.end, 'p')}`}
                   {selectedEvent.allDay && ' (All Day)'}
                 </DialogDescription>
               </DialogHeader>
               <div className="py-4 space-y-3 text-sm">
                 {/* Display more details based on extendedProps */}
                 {selectedEvent.extendedProps.description && <p>{selectedEvent.extendedProps.description}</p>}
                 {selectedEvent.extendedProps.client && <p><strong>Client:</strong> {selectedEvent.extendedProps.client}</p>}
                 {selectedEvent.extendedProps.project && <p><strong>Project:</strong> {selectedEvent.extendedProps.project}</p>}
                 {selectedEvent.extendedProps.location && <p><strong>Location:</strong> {selectedEvent.extendedProps.location}</p>}
                 {selectedEvent.extendedProps.attendees && <p><strong>Attendees:</strong> {selectedEvent.extendedProps.attendees.join(', ')}</p>}
                 {selectedEvent.extendedProps.assigned && <p><strong>Assigned:</strong> {selectedEvent.extendedProps.assigned.join(', ')}</p>}
                 {selectedEvent.extendedProps.meetingLink &&
                   <p><strong>Link:</strong> <a href={selectedEvent.extendedProps.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center"><LinkIcon className="w-4 h-4 mr-1"/>Join Meeting</a></p>}
                 {/* Add Notes section if applicable */}
               </div>
               <DialogFooter className="sm:justify-between">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                    <Trash2 className="w-4 h-4 mr-2"/> Delete
                  </Button>
                 <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={() => { /* TODO: Open Edit Modal */ }}>
                     <Edit className="w-4 h-4 mr-2"/> Edit
                   </Button>
                   <Button variant="default" size="sm" onClick={closeDetailModal}>Close</Button>
                 </div>
               </DialogFooter>
             </>
           ) : (
             <DialogHeader><DialogTitle>No Event Selected</DialogTitle></DialogHeader>
           )}
         </DialogContent>
       </Dialog>

    </div>
  );
}

// --- Notes ---
// 1. Dependencies: Make sure to install `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/timegrid`, `@fullcalendar/list`, `@fullcalendar/interaction`, and `date-fns`.
// 2. State Management: This uses basic useState. For complex filtering or event handling, consider useReducer or a state management library.
// 3. CRUD Operations: The `handleCreate/Update/DeleteEvent` functions need implementation to interact with your backend API.
// 4. Filtering: Filter logic needs to be implemented and applied to the `events` prop of FullCalendar.
// 5. Styling: Customize FullCalendar's appearance further using its props or CSS overrides. See FullCalendar documentation.
// 6. Advanced Features: Drag & drop rescheduling (`eventDrop`), event resizing (`eventResize`), Google Calendar sync require more setup and potentially backend integration.

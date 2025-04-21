// Example file path: src/app/client/messages/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState, useRef, useEffect } from 'react';

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// --- Icons ---
import {
  Search, PlusCircle, Send, Paperclip, Smile, MessagesSquare, // Main Icons
  Check, CheckCheck // Read receipts (example)
} from 'lucide-react';

import { format, formatDistanceToNow, isToday, isYesterday, parseISO, subHours } from 'date-fns';
// --- Mock Data (Replace with actual data/state management) ---
const currentClient = { id: 'client-user-123', name: 'Client User', avatar: 'https://placehold.co/40x40/bfdbfe/1e3a8a?text=CU' };

// Mock conversation threads
const conversationThreads = [
  {
    id: 'thread-proj-alpha',
    title: 'Project Alpha Discussion',
    project: 'Project Alpha',
    participants: [{ id: 's1', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }],
    lastMessage: 'Sounds good, let me know!',
    timestamp: subHours(new Date(), 2), // 2 hours ago
    unreadCount: 0,
    online: true, // Example status of the *other* participant
  },
  {
    id: 'thread-brand-refresh',
    title: 'Branding Refresh Feedback',
    project: 'Brand Refresh',
    participants: [{ id: 's3', name: 'Sarah Chen', avatar: 'https://placehold.co/32x32/ddd6fe/4c1d95?text=SC' }],
    lastMessage: 'Okay, I\'ve attached the revised logo concepts for your review.',
    timestamp: subHours(new Date(), 26), // Yesterday
    unreadCount: 1,
    online: false,
  },
   {
    id: 'thread-billing-q',
    title: 'Question about Invoice #INV-014',
    project: 'Billing',
    participants: [{ id: 's2', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }],
    lastMessage: 'Yes, that payment has been processed.',
    timestamp: subHours(new Date(), 72), // 3 days ago
    unreadCount: 0,
    online: true,
  },
];

// Mock messages for 'thread-proj-alpha'
const threadAlphaMessages = [
  { id: 'alpha-msg1', sender: { id: 's1', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, content: 'Hi Client User, just wanted to confirm the meeting time for tomorrow at 10 AM?', timestamp: '2025-04-21T01:55:00Z', type: 'text' },
  { id: 'alpha-msg2', sender: currentClient, content: 'Yes, 10 AM works perfectly for me. Thanks for confirming!', timestamp: '2025-04-21T01:58:00Z', type: 'text', read: true }, // Client message
  { id: 'alpha-msg3', sender: { id: 's1', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, content: 'Great. I\'ve also uploaded the agenda document.', timestamp: '2025-04-21T02:00:00Z', type: 'file', fileName: 'Meeting_Agenda_Apr22.pdf' },
  { id: 'alpha-msg4', sender: currentClient, content: 'Got it, thanks!', timestamp: '2025-04-21T02:01:00Z', type: 'text', read: true }, // Client message
  { id: 'alpha-msg5', sender: { id: 's1', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, content: 'Sounds good, let me know!', timestamp: '2025-04-21T02:02:00Z', type: 'text' },
];

// Helper Function for Date Formatting (Same as Team Chat)
const formatDateSeparator = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d,<x_bin_534>');
};

/**
 * ClientMessagesPage Component
 *
 * Provides the UI structure for client-team messaging.
 * NOTE: Does not include real-time functionality.
 */
export default function ClientMessagesPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(conversationThreads[0]?.id || null); // Select first thread initially
  const [messageInput, setMessageInput] = useState('');
  const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- TODO: Real-time logic & Data Fetching ---
  // Fetch threads and messages for the logged-in client
  // Connect to WebSocket for real-time updates

  // Scroll to bottom when messages change or thread selection changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadAlphaMessages, selectedThreadId]); // Replace threadAlphaMessages with dynamic messages

  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedThreadId) return;
    console.log("Sending message:", messageInput, "to thread:", selectedThreadId);
    // --- TODO: Send message via WebSocket ---
    // Add message to local state optimistically
    setMessageInput('');
  };

  const handleStartNewConversation = () => {
     console.log("Starting new conversation...");
     // Get data from modal form state
     // Call API / WebSocket event to create new thread/send initial message
     setIsNewConvoModalOpen(false);
     // Select the newly created thread
  };

  // Get messages for the currently selected thread (using mock data here)
  const currentMessages = selectedThreadId === 'thread-proj-alpha' ? threadAlphaMessages : []; // Replace with actual logic

  // Group messages by date
   const groupedMessages: { [key: string]: typeof currentMessages } = currentMessages.reduce((acc, msg) => {
    const dateKey = format(parseISO(msg.timestamp), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as { [key: string]: typeof currentMessages });
  const sortedDateKeys = Object.keys(groupedMessages).sort();

  const selectedThreadDetails = conversationThreads.find(t => t.id === selectedThreadId);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-white font-sans">
      {/* 1. Header */}
       <div className="h-16 border-b px-4 flex justify-between items-center bg-white flex-shrink-0">
         <div>
           <h1 className="text-xl md:text-2xl font-bold text-gray-800">Messages</h1>
           <p className="text-sm text-gray-600 hidden md:block">Conversations between you and our team.</p>
         </div>
         <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input type="search" placeholder="Search messages..." className="pl-10 w-full h-9" />
            </div>
            <Dialog open={isNewConvoModalOpen} onOpenChange={setIsNewConvoModalOpen}>
               <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                     <PlusCircle className="w-4 h-4 mr-2" /> Start New Conversation
                  </Button>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Start a New Conversation</DialogTitle>
                     <DialogDescription>Select a project or topic and send your first message.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                     <div>
                        <Label htmlFor="convo-project">Related Project (Optional)</Label>
                        <Select>
                           <SelectTrigger id="convo-project"><SelectValue placeholder="Select Project" /></SelectTrigger>
                           <SelectContent><SelectItem value="p1">Project Alpha</SelectItem><SelectItem value="p2">Brand Refresh</SelectItem></SelectContent>
                        </Select>
                     </div>
                     <div>
                        <Label htmlFor="convo-topic">Topic / Subject</Label>
                        <Input id="convo-topic" placeholder="e.g., Question about timeline" />
                     </div>
                     <div>
                        <Label htmlFor="convo-message">Your Message</Label>
                        <Textarea id="convo-message" placeholder="Type your message here..." />
                     </div>
                  </div>
                  <DialogFooter>
                     <Button variant="outline" onClick={() => setIsNewConvoModalOpen(false)}>Cancel</Button>
                     <Button onClick={handleStartNewConversation}><Send className="w-4 h-4 mr-2" /> Send Message</Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>
       </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel (Message Threads) */}
        <div className="w-80 border-r bg-gray-50 flex flex-col flex-shrink-0">
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversationThreads.map(thread => (
                <Button
                  key={thread.id}
                  variant={selectedThreadId === thread.id ? 'secondary' : 'ghost'}
                  className="w-full h-auto justify-start text-left py-2 px-3"
                  onClick={() => setSelectedThreadId(thread.id)}
                >
                  <Avatar className="h-8 w-8 mr-3">
                     {/* Show participant avatar */}
                    <AvatarImage src={thread.participants[0]?.avatar} alt={thread.participants[0]?.name} />
                    <AvatarFallback className="text-xs">{thread.participants[0]?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-sm truncate">{thread.title}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                           {formatDistanceToNow(thread.timestamp, { addSuffix: true })}
                        </span>
                     </div>
                     <div className="flex justify-between items-center mt-0.5">
                        <p className="text-xs text-gray-600 truncate">{thread.lastMessage}</p>
                         {thread.unreadCount > 0 && <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs flex-shrink-0">{thread.unreadCount}</Badge>}
                     </div>
                  </div>
                </Button>
              ))}
               {conversationThreads.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">No conversations yet.</div>
               )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel (Open Chat) */}
        <div className="flex-1 flex flex-col max-h-[calc(100vh-4rem)]"> {/* Adjust max-h based on header height */}
          {selectedThreadId && selectedThreadDetails ? (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b px-4 flex items-center bg-white flex-shrink-0">
                 <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={selectedThreadDetails.participants[0]?.avatar} alt={selectedThreadDetails.participants[0]?.name} />
                    <AvatarFallback className="text-xs">{selectedThreadDetails.participants[0]?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                 </Avatar>
                 <div>
                    <h3 className="font-semibold text-sm">{selectedThreadDetails.title}</h3>
                    <p className="text-xs text-gray-500">With {selectedThreadDetails.participants.map(p => p.name).join(', ')}</p>
                 </div>
                 {/* Add more actions like search within chat, info panel toggle */}
              </div>

              {/* Message Area */}
              <ScrollArea className="flex-1 bg-gray-100 p-4 space-y-4">
                 {sortedDateKeys.map(dateKey => (
                    <React.Fragment key={dateKey}>
                       <div className="relative py-2"><Separator /><div className="absolute inset-0 flex items-center justify-center"><span className="bg-gray-100 px-2 text-xs text-gray-500 font-medium">{formatDateSeparator(dateKey)}</span></div></div>
                       {groupedMessages[dateKey].map(msg => {
                         const isClientMessage = msg.sender.id === currentClient.id;
                         return (
                           <div key={msg.id} className={`flex gap-2 ${isClientMessage ? 'justify-end' : 'justify-start'}`}>
                              {!isClientMessage && <Avatar className="h-8 w-8"><AvatarImage src={msg.sender.avatar} /><AvatarFallback>{msg.sender.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>}
                              <div className={`flex flex-col ${isClientMessage ? 'items-end' : 'items-start'}`}>
                                 {!isClientMessage && <span className="text-xs text-gray-600 mb-0.5">{msg.sender.name}</span>}
                                 <TooltipProvider delayDuration={100}>
                                   <Tooltip>
                                     <TooltipTrigger asChild>
                                       <div className={`max-w-xs md:max-w-md lg:max-w-xl px-3 py-2 rounded-lg shadow-sm ${isClientMessage ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                                          {msg.type === 'file' ? ( <div className="flex items-center gap-2"><Paperclip className="w-4 h-4 flex-shrink-0" /><span className="truncate">{msg.fileName}</span></div> )
                                            : ( <p className="text-sm break-words">{msg.content}</p> )}
                                       </div>
                                     </TooltipTrigger>
                                     <TooltipContent side={isClientMessage ? 'left' : 'right'} className="text-xs">{format(parseISO(msg.timestamp), 'MMM d, p')}</TooltipContent>
                                   </Tooltip>
                                 </TooltipProvider>
                                 {isClientMessage && msg.read && <div className="text-xs mt-0.5 text-gray-500"><CheckCheck className="w-4 h-4 text-blue-500" /> Read</div>}
                              </div>
                           </div>
                         );
                       })}
                    </React.Fragment>
                 ))}
                 <div ref={messagesEndRef} /> {/* Scroll target */}
              </ScrollArea>

              {/* Input Bar */}
              <div className="border-t p-4 bg-white flex-shrink-0">
                 <div className="flex items-center gap-2">
                   <Button variant="ghost" size="icon" className="text-gray-500"><Smile className="w-5 h-5" /></Button>
                   <Button variant="ghost" size="icon" className="text-gray-500"><Paperclip className="w-5 h-5" /></Button>
                   <Textarea placeholder={`Message ${selectedThreadDetails.title}...`} className="flex-1 resize-none border rounded-md px-3 py-2 min-h-[40px] max-h-[120px]" rows={1} value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                   <Button onClick={handleSendMessage} disabled={messageInput.trim() === ''}><Send className="w-4 h-4" /></Button>
                 </div>
              </div>
            </>
          ) : (
             // Empty state for right panel when no thread selected
             <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-500">
                <div className="text-center">
                   <MessagesSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                   <p>Select a conversation from the left panel to view messages.</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Notes ---
// 1. Real-time: Needs WebSockets for actual messaging functionality.
// 2. State/Data: Replace mock data with fetched data and robust state management (Context, Zustand, etc.).
// 3. Message Handling: Implement API/WebSocket logic for sending messages, handling uploads, read receipts, etc.
// 4. Scrolling: Basic scroll-to-bottom. Consider virtualized lists for performance.
// 5. Error Handling/Loading: Add UI states for loading threads/messages and handling errors.
// 6. Responsiveness: Ensure the two-panel layout adapts or changes for smaller screens (e.g., showing only the list or only the chat).

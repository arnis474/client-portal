// Example file path: src/app/dashboard/admin/chat/page.tsx

"use client"; // Required for Hooks and client components

import React, { useState, useRef, useEffect } from 'react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // For search
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // For timestamps

// --- Icons ---
import {
  Search, Settings, Send, Paperclip, Smile, Users, MessageSquare, AtSign, ThumbsUp, Trash2, Reply, Check, CheckCheck // Icons
} from 'lucide-react';

// --- Mock Data (Replace with actual data/state management) ---
const currentUser = { id: 'user-admin', name: 'Admin User', avatar: 'https://placehold.co/40x40/a5b4fc/1e1b4b?text=AU' };

const channels = [
  { id: 'ch-general', name: 'general', unread: 0 },
  { id: 'ch-projects', name: 'projects', unread: 2 },
  { id: 'ch-billing', name: 'billing', unread: 0 },
  { id: 'ch-random', name: 'random', unread: 0 },
];

const directMessages = [
  { id: 'dm-alice', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS', online: true },
  { id: 'dm-bob', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ', online: false },
  { id: 'dm-charlie', name: 'Charlie Davis', avatar: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD', online: true },
];

// Mock messages for the '#projects' channel
const messagesData = [
  // Yesterday
  { id: 'msg1', sender: { id: 'dm-alice', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, content: 'Morning team! Quick update on Project Phoenix - client approved the wireframes.', timestamp: '2025-04-20T09:15:00Z', type: 'text', reactions: [{ emoji: '👍', count: 2 }] },
  { id: 'msg2', sender: { id: 'dm-bob', name: 'Bob Johnson', avatar: 'https://placehold.co/32x32/fecaca/991b1b?text=BJ' }, content: 'Great news!', timestamp: '2025-04-20T09:16:30Z', type: 'text' },
  { id: 'msg3', sender: { id: 'system', name: 'System' }, content: 'Charlie Davis joined the channel', timestamp: '2025-04-20T11:05:00Z', type: 'system' },
  { id: 'msg4', sender: { id: 'dm-charlie', name: 'Charlie Davis', avatar: 'https://placehold.co/32x32/fed7aa/9a3412?text=CD' }, content: 'Hey everyone! Catching up now.', timestamp: '2025-04-20T11:06:10Z', type: 'text' },
  // Today
  { id: 'msg5', sender: { id: 'user-admin', name: 'Admin User', avatar: 'https://placehold.co/40x40/a5b4fc/1e1b4b?text=AU' }, content: 'Uploaded the final proposal document for Project Alpha.', timestamp: '2025-04-21T10:05:00Z', type: 'file', fileName: 'Project_Alpha_Proposal_v3.pdf' },
  { id: 'msg6', sender: { id: 'dm-alice', name: 'Alice Smith', avatar: 'https://placehold.co/32x32/c7d2fe/4338ca?text=AS' }, content: 'Thanks! Will review it this afternoon.', timestamp: '2025-04-21T10:07:20Z', type: 'text', read: true }, // Example read receipt
  { id: 'msg7', sender: { id: 'user-admin', name: 'Admin User', avatar: 'https://placehold.co/40x40/a5b4fc/1e1b4b?text=AU' }, content: 'Perfect, let me know if any changes are needed.', timestamp: '2025-04-21T10:08:00Z', type: 'text', read: false },
];

// --- Helper Function for Date Formatting ---
const formatDateSeparator = (dateStr: string): string => {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');
};

/**
 * TeamChatPage Component
 *
 * Provides the UI structure for a team chat application.
 * NOTE: Does not include real-time functionality.
 */
export default function TeamChatPage() {
  const [selectedChat, setSelectedChat] = useState<string>('ch-projects'); // Default to #projects
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling to bottom

  // --- TODO: Real-time logic ---
  // - Connect to WebSocket server
  // - Listen for incoming messages, status updates
  // - Handle sending messages via WebSocket

  // Scroll to bottom when messages change or chat selection changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData, selectedChat]);

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return;
    console.log("Sending message:", messageInput, "to:", selectedChat);
    // --- TODO: Send message via WebSocket ---
    // Add message to local state optimistically (or wait for confirmation)
    setMessageInput(''); // Clear input
  };

  // Group messages by date for separators
  const groupedMessages: { [key: string]: typeof messagesData } = messagesData.reduce((acc, msg) => {
    const dateKey = format(parseISO(msg.timestamp), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(msg);
    return acc;
  }, {} as { [key: string]: typeof messagesData });

  const sortedDateKeys = Object.keys(groupedMessages).sort();

  // Determine current chat name/details
  const currentChatDetails =
    channels.find(c => c.id === selectedChat) ||
    directMessages.find(dm => dm.id === selectedChat);
  const chatTitle = currentChatDetails?.name || 'Chat';
  const isDirectMessage = directMessages.some(dm => dm.id === selectedChat);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-white font-sans">

      {/* 2. Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Team Chat</h2>
          {/* Add user status/profile button here if needed */}
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Channels</h3>
            {channels.map(channel => (
              <Button
                key={channel.id}
                variant={selectedChat === channel.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedChat(channel.id)}
              >
                <span className="mr-2 text-gray-500">#</span> {channel.name}
                {channel.unread > 0 && <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">{channel.unread}</Badge>}
              </Button>
            ))}
          </div>
          <div className="p-2 space-y-1 mt-4">
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Direct Messages</h3>
            {directMessages.map(dm => (
              <Button
                key={dm.id}
                variant={selectedChat === dm.id ? 'secondary' : 'ghost'}
                className="w-full justify-start h-10"
                onClick={() => setSelectedChat(dm.id)}
              >
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={dm.avatar} alt={dm.name} />
                  <AvatarFallback className="text-xs">{dm.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="flex-1 text-left truncate">{dm.name}</span>
                 <span className={`ml-auto h-2 w-2 rounded-full ${dm.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </Button>
            ))}
          </div>
           {/* Optional: Mentions/Pinned Section */}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-h-screen">
        {/* 1. Header */}
        <div className="h-16 border-b px-4 flex justify-between items-center bg-white">
          <div>
             <h3 className="text-lg font-semibold">{isDirectMessage ? currentChatDetails?.name : `# ${chatTitle}`}</h3>
             {/* Status indicator (example) */}
             <span className="text-xs text-green-600 flex items-center">
                <Users className="w-3 h-3 mr-1" /> 3 team members online
             </span>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon"><Search className="w-4 h-4" /></Button>
             <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* 2. Main Chat Panel */}
        <ScrollArea className="flex-1 bg-gray-100 p-4 space-y-4">
          {sortedDateKeys.map(dateKey => (
             <React.Fragment key={dateKey}>
                {/* Date Separator */}
                <div className="relative py-2">
                   <Separator />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-gray-100 px-2 text-xs text-gray-500 font-medium">
                         {formatDateSeparator(dateKey)}
                      </span>
                   </div>
                </div>
                {/* Messages for this date */}
                {groupedMessages[dateKey].map(msg => {
                  const isCurrentUser = msg.sender.id === currentUser.id;
                  const showAvatar = !isCurrentUser; // Only show avatar for received messages in this basic layout

                  if (msg.type === 'system') {
                     return (
                        <div key={msg.id} className="text-center text-xs text-gray-500 italic py-1">
                           {msg.content} - {format(parseISO(msg.timestamp), 'p')}
                        </div>
                     );
                  }

                  return (
                    <div key={msg.id} className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                       {showAvatar && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                            <AvatarFallback className="text-xs">{msg.sender.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                       )}
                       <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          {!isCurrentUser && <span className="text-xs text-gray-600 mb-0.5">{msg.sender.name}</span>}
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                 <div className={`max-w-xs md:max-w-md lg:max-w-lg px-3 py-2 rounded-lg shadow-sm ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                                   {msg.type === 'file' ? (
                                      <div className="flex items-center gap-2">
                                         <Paperclip className="w-4 h-4 flex-shrink-0" />
                                         <span className="truncate">{msg.fileName}</span>
                                         {/* Add download button? */}
                                      </div>
                                   ) : (
                                      <p className="text-sm break-words">{msg.content}</p>
                                   )}
                                   {/* Optional: Reactions */}
                                   {msg.reactions && msg.reactions.length > 0 && (
                                      <div className={`mt-1 flex ${isCurrentUser ? 'justify-end' : ''}`}>
                                         {msg.reactions.map(r => (
                                            <Badge key={r.emoji} variant="secondary" className="px-1.5 py-0.5 text-xs cursor-pointer hover:bg-gray-200">
                                               {r.emoji} {r.count}
                                            </Badge>
                                         ))}
                                      </div>
                                   )}
                                 </div>
                              </TooltipTrigger>
                              <TooltipContent side={isCurrentUser ? 'left' : 'right'} className="text-xs">
                                {format(parseISO(msg.timestamp), 'MMM d, yyyy p')}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                           {/* Optional: Read Receipt */}
                           {isCurrentUser && msg.read !== undefined && (
                              <div className="text-xs mt-0.5 text-gray-500">
                                 {msg.read ? <CheckCheck className="w-4 h-4 text-blue-500" /> : <Check className="w-4 h-4" />}
                              </div>
                           )}
                       </div>
                    </div>
                  );
                })}
             </React.Fragment>
          ))}
          {/* Element to help scroll to bottom */}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* 4. Input Bar */}
        <div className="border-t p-4 bg-white">
           {/* Optional: Typing indicator area */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500"><Smile className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="text-gray-500"><Paperclip className="w-5 h-5" /></Button>
            <Textarea
              placeholder={`Message ${isDirectMessage ? currentChatDetails?.name : `#${chatTitle}`}...`}
              className="flex-1 resize-none border rounded-md px-3 py-2 min-h-[40px] max-h-[120px]"
              rows={1}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Prevent newline
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={messageInput.trim() === ''}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
           <p className="text-xs text-gray-400 mt-1 pl-1">Shift+Enter for newline.</p>
        </div>
      </div>

    </div>
  );
}

// --- Notes ---
// 1. Real-time: This is a UI MOCKUP. Real chat needs WebSockets (e.g., Socket.IO) for sending/receiving messages, online status, typing indicators, etc.
// 2. State Management: Uses basic useState. For a real app, manage channels, DMs, messages, user status globally (Context API, Zustand, Redux).
// 3. Message Handling: Implement API calls and WebSocket events for sending, receiving, deleting, reacting to messages.
// 4. Scrolling: Uses a basic scroll-to-bottom effect. Production apps often use virtualized lists (e.g., react-window, react-virtuoso) for performance with many messages.
// 5. UI Libraries: Consider dedicated chat UI libraries for more features out-of-the-box if needed.
// 6. Error Handling/Loading: Add states for loading messages, sending errors, etc.

// Example file path: src/app/dashboard/admin/clients/[clientId]/page.tsx

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // shadcn/ui
import { Badge } from "@/components/ui/badge"; // shadcn/ui
import { Button } from "@/components/ui/button"; // shadcn/ui
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"; // shadcn/ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // shadcn/ui
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // shadcn/ui
import { Switch } from "@/components/ui/switch"; // shadcn/ui
import { Textarea } from "@/components/ui/textarea"; // shadcn/ui
import {
  Mail, Phone, Building, Edit, Send, Calendar, Briefcase, Receipt, Banknote, Clock, Eye, History, MessageSquare, FileText, Upload, Download, Trash2, CreditCard, ToggleRight, User, Tag, Info
} from 'lucide-react';

// --- Mock Data (Replace with actual data fetching) ---
const clientData = {
  id: 'client-123',
  name: 'Example Corp',
  logoUrl: 'https://placehold.co/100x100/e2e8f0/64748b?text=EC', // Placeholder logo
  initials: 'EC',
  email: 'contact@example.com',
  phone: '+1-555-123-4567',
  companyName: 'Example Corporation Ltd.',
  status: 'Active',
  tags: ['VIP', 'High Priority'],
  accountManager: 'Alice Smith',
  stats: {
    activeProjects: 3,
    totalInvoiced: '$15,250.00',
    outstandingBalance: '$1,800.00',
    lastLogin: '2025-04-20 10:30 AM',
  },
  projects: [
    { id: 'proj-001', name: 'Website Redesign', status: 'In Progress', lastUpdated: '2025-04-18', deadline: '2025-06-30' },
    { id: 'proj-002', name: 'Marketing Campaign', status: 'Completed', lastUpdated: '2025-03-15', deadline: '2025-03-31' },
    { id: 'proj-003', name: 'Mobile App Dev', status: 'On Hold', lastUpdated: '2025-04-01', deadline: '2025-08-15' },
  ],
  meetings: [
    { id: 'meet-001', type: 'Upcoming', title: 'Project Kickoff - Mobile App', dateTime: '2025-04-25 11:00 AM' },
    { id: 'meet-002', type: 'Past', title: 'Website Design Review', dateTime: '2025-04-15 02:00 PM' },
  ],
  activityLog: [
    { id: 'act-001', timestamp: '2025-04-20 10:30 AM', description: 'Client logged in.' },
    { id: 'act-002', timestamp: '2025-04-18 09:15 AM', description: 'Project "Website Redesign" status updated to In Progress by Alice Smith.' },
    { id: 'act-003', timestamp: '2025-04-15 03:00 PM', description: 'Invoice #INV-015 sent.' },
  ],
  notes: [
    { id: 'note-001', author: 'Bob Johnson', timestamp: '2025-04-10', content: 'Client interested in expanding services next quarter. Follow up needed.' },
  ],
  documents: [
    { id: 'doc-001', name: 'Contract Agreement.pdf', type: 'Contract', uploaded: '2025-01-10', icon: FileText },
    { id: 'doc-002', name: 'Invoice_INV-015.pdf', type: 'Invoice', uploaded: '2025-04-15', icon: Receipt },
    { id: 'doc-003', name: 'Design Mockups V1.zip', type: 'Design', uploaded: '2025-03-20', icon: FileText }, // Placeholder icon
  ],
  billing: {
    paymentMethod: 'Visa **** **** **** 4242',
    plan: 'Premium Tier',
    directDebitActive: true,
    invoices: [
      { id: 'inv-015', date: '2025-04-15', amount: '$2,500.00', status: 'Sent' },
      { id: 'inv-014', date: '2025-03-15', amount: '$5,000.00', status: 'Paid' },
      { id: 'inv-013', date: '2025-02-15', amount: '$7,750.00', status: 'Paid' },
    ],
  },
  crmNotes: "Long-term client, very responsive. Potential for upsell in Q3.",
};

// Helper to get status badge variant
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
  switch (status?.toLowerCase()) {
    case 'active': return 'success';
    case 'on hold': return 'warning';
    case 'inactive': return 'secondary';
    case 'in progress': return 'info';
    case 'completed': return 'success';
    case 'paid': return 'success';
    case 'sent': return 'info';
    case 'overdue': return 'destructive';
    default: return 'outline';
  }
};

/**
 * ClientAdminViewPage Component
 *
 * Displays a detailed view of a specific client for admin users.
 * Includes client info, stats, projects, activity, documents, and billing.
 */
export default function ClientAdminViewPage({ params }: { params: { clientId: string } }) {
  // In a real app, you would fetch clientData based on params.clientId here
  // const [clientData, setClientData] = useState(null);
  // useEffect(() => { fetchClientData(params.clientId).then(data => setClientData(data)) }, [params.clientId]);
  // if (!clientData) return <div>Loading...</div>; // Or a loading skeleton

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">
      {/* Optional Breadcrumbs or Header */}
      {/* <h1 className="text-2xl font-semibold text-gray-800">Client Details</h1> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Client Header / Overview */}
          <Card className="shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-gray-100 p-4 border-b">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={clientData.logoUrl} alt={clientData.name} />
                  <AvatarFallback className="text-xl font-semibold">{clientData.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800">{clientData.name}</CardTitle>
                  <p className="text-sm text-gray-600">{clientData.companyName}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Badge variant={getStatusVariant(clientData.status)}>{clientData.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={`mailto:${clientData.email}`} className="hover:underline">{clientData.email}</a>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{clientData.phone}</span>
                </div>
                 <div className="flex items-center text-gray-700">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{clientData.companyName}</span>
                </div>
                 <div className="flex items-center text-gray-700">
                  <User className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Account Manager: {clientData.accountManager}</span>
                </div>
              </div>
               {/* Optional Tags */}
               {clientData.tags && clientData.tags.length > 0 && (
                <div className="pt-2 border-t mt-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {clientData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
               )}
              <div className="flex gap-2 pt-3 border-t mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4 mr-2" /> Edit Client
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
                 {/* Or <Button variant="default" size="sm"><Calendar className="w-4 h-4 mr-2" /> Schedule Meeting</Button> */}
              </div>
            </CardContent>
          </Card>

          {/* 2. Quick Stats / Summary Cards */}
          <Card className="shadow-sm rounded-lg">
             <CardHeader>
               <CardTitle className="text-lg font-semibold text-gray-700">Quick Stats</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-2 gap-4 text-center">
               <div className="p-3 bg-gray-50 rounded-md">
                 <Briefcase className="w-6 h-6 mx-auto text-blue-600 mb-1" />
                 <p className="text-xs text-gray-500">Active Projects</p>
                 <p className="text-lg font-semibold text-gray-800">{clientData.stats.activeProjects}</p>
               </div>
               <div className="p-3 bg-gray-50 rounded-md">
                 <Receipt className="w-6 h-6 mx-auto text-green-600 mb-1" />
                 <p className="text-xs text-gray-500">Total Invoiced</p>
                 <p className="text-lg font-semibold text-gray-800">{clientData.stats.totalInvoiced}</p>
               </div>
               <div className="p-3 bg-gray-50 rounded-md">
                 <Banknote className="w-6 h-6 mx-auto text-red-600 mb-1" />
                 <p className="text-xs text-gray-500">Outstanding</p>
                 <p className="text-lg font-semibold text-gray-800">{clientData.stats.outstandingBalance}</p>
               </div>
               <div className="p-3 bg-gray-50 rounded-md">
                 <Clock className="w-6 h-6 mx-auto text-purple-600 mb-1" />
                 <p className="text-xs text-gray-500">Last Login</p>
                 <p className="text-sm font-medium text-gray-800">{clientData.stats.lastLogin}</p>
               </div>
             </CardContent>
           </Card>

           {/* Optional: CRM Notes */}
           <Card className="shadow-sm rounded-lg">
             <CardHeader>
               <CardTitle className="text-lg font-semibold text-gray-700 flex items-center">
                 <Info className="w-4 h-4 mr-2 text-gray-500"/> CRM Notes
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600 whitespace-pre-wrap">{clientData.crmNotes}</p>
               {/* Could add an edit button here */}
             </CardContent>
           </Card>

        </div>

        {/* --- Right Column (Tabs) --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity & Meetings</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* 3. Projects Tab */}
            <TabsContent value="projects">
              <Card className="shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle>Client Projects</CardTitle>
                  {/* Add Filter/Sort options if needed */}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientData.projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell><Badge variant={getStatusVariant(project.status)}>{project.status}</Badge></TableCell>
                          <TableCell>{project.lastUpdated}</TableCell>
                          <TableCell>{project.deadline}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                   {clientData.projects.length === 0 && (
                     <p className="text-center text-gray-500 py-4">No projects found.</p>
                   )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 4. Meetings / Activity Log Tab */}
            <TabsContent value="activity" className="space-y-6">
              {/* Meetings */}
              <Card className="shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle>Meetings</CardTitle>
                  {/* Add "Schedule New Meeting" button */}
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold mb-2 text-gray-700">Upcoming</h4>
                  <ul className="space-y-2 mb-4">
                    {clientData.meetings.filter(m => m.type === 'Upcoming').map(meeting => (
                      <li key={meeting.id} className="flex justify-between items-center p-2 border rounded-md text-sm">
                        <span><Calendar className="w-4 h-4 mr-2 inline-block text-blue-600"/>{meeting.title}</span>
                        <span className="text-gray-600">{meeting.dateTime}</span>
                        {/* Add Join/Reschedule buttons */}
                      </li>
                    ))}
                     {clientData.meetings.filter(m => m.type === 'Upcoming').length === 0 && <p className="text-sm text-gray-500">No upcoming meetings.</p>}
                  </ul>
                   <h4 className="font-semibold mb-2 text-gray-700">Past</h4>
                   <ul className="space-y-2">
                    {clientData.meetings.filter(m => m.type === 'Past').map(meeting => (
                      <li key={meeting.id} className="flex justify-between items-center p-2 border rounded-md text-sm bg-gray-50">
                        <span><Calendar className="w-4 h-4 mr-2 inline-block text-gray-500"/>{meeting.title}</span>
                        <span className="text-gray-500">{meeting.dateTime}</span>
                         {/* Add View Notes button */}
                      </li>
                    ))}
                     {clientData.meetings.filter(m => m.type === 'Past').length === 0 && <p className="text-sm text-gray-500">No past meetings.</p>}
                  </ul>
                </CardContent>
              </Card>
              {/* Activity Log */}
              <Card className="shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {clientData.activityLog.map(activity => (
                      <li key={activity.id} className="flex items-start text-sm">
                        <History className="w-4 h-4 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {clientData.activityLog.length === 0 && <p className="text-sm text-gray-500">No activity recorded yet.</p>}
                </CardContent>
              </Card>
               {/* Team Notes */}
               <Card className="shadow-sm rounded-lg">
                <CardHeader>
                  <CardTitle>Internal Team Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {clientData.notes.map(note => (
                      <div key={note.id} className="p-3 border rounded-md bg-yellow-50 border-yellow-200">
                         <p className="text-sm text-gray-800">{note.content}</p>
                         <p className="text-xs text-gray-600 mt-1">- {note.author}, {note.timestamp}</p>
                      </div>
                   ))}
                   {clientData.notes.length === 0 && <p className="text-sm text-gray-500">No internal notes added yet.</p>}
                   {/* Add Note Form */}
                   <div className="mt-4">
                     <Textarea placeholder="Add a new internal note..." className="mb-2"/>
                     <Button size="sm">Add Note</Button>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Documents Tab */}
            <TabsContent value="documents">
              <Card className="shadow-sm rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Documents</CardTitle>
                  <Button variant="default" size="sm">
                    <Upload className="w-4 h-4 mr-2" /> Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {clientData.documents.map(doc => (
                      <li key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <doc.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                            <p className="text-xs text-gray-500">Type: {doc.type} | Uploaded: {doc.uploaded}</p>
                          </div>
                        </div>
                        <div className="space-x-1">
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                   {clientData.documents.length === 0 && (
                     <p className="text-center text-gray-500 py-4">No documents uploaded.</p>
                   )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 6. Billing Info Tab */}
            <TabsContent value="billing" className="space-y-6">
               <Card className="shadow-sm rounded-lg">
                 <CardHeader>
                   <CardTitle>Billing Overview</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                       <span className="text-gray-600 flex items-center"><CreditCard className="w-4 h-4 mr-2"/>Payment Method</span>
                       <span className="font-medium text-gray-800">{clientData.billing.paymentMethod}</span>
                    </div>
                     <div className="flex justify-between items-center">
                       <span className="text-gray-600 flex items-center"><Tag className="w-4 h-4 mr-2"/>Plan / Package</span>
                       <span className="font-medium text-gray-800">{clientData.billing.plan}</span>
                    </div>
                     <div className="flex justify-between items-center pt-3 border-t mt-3">
                       <span className="text-gray-600 flex items-center"><ToggleRight className="w-4 h-4 mr-2"/>Direct Debit</span>
                       <div className="flex items-center space-x-2">
                         <Switch
                           id="direct-debit-switch"
                           checked={clientData.billing.directDebitActive}
                           // onCheckedChange={handleDirectDebitToggle} // Add state and handler
                         />
                         <label htmlFor="direct-debit-switch" className={clientData.billing.directDebitActive ? 'text-green-600 font-medium' : 'text-gray-600'}>
                           {clientData.billing.directDebitActive ? 'Active' : 'Inactive'}
                         </label>
                         {!clientData.billing.directDebitActive && <Button size="sm" variant="outline">Setup</Button>}
                       </div>
                    </div>
                 </CardContent>
               </Card>

               <Card className="shadow-sm rounded-lg">
                 <CardHeader>
                   <CardTitle>Invoices</CardTitle>
                    {/* Add "Create New Invoice" button */}
                 </CardHeader>
                 <CardContent>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientData.billing.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.amount}</TableCell>
                          <TableCell><Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                          <TableCell className="text-right">
                             {/* Add actions like View PDF, Resend, Mark as Paid */}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                   {clientData.billing.invoices.length === 0 && (
                     <p className="text-center text-gray-500 py-4">No invoices found.</p>
                   )}
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// --- Notes ---
// 1. Data Fetching: Replace mockData with actual data fetching logic (e.g., using useEffect and fetch/axios).
// 2. State Management: For actions like editing, uploading, toggling switches, you'll need to implement React state (useState) and handlers.
// 3. Routing: Assumes dynamic routing setup (e.g., Next.js app router with [clientId] folder). The View buttons would link to specific project/invoice pages.
// 4. Component Installation: Ensure all used shadcn/ui components (Avatar, Badge, Button, Card, Tabs, Table, Switch, Textarea) are added via `npx shadcn-ui@latest add [component-name]`.
// 5. Icons: Ensure `lucide-react` is installed (`npm install lucide-react`).


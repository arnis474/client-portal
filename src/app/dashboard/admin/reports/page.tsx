// Example file path: src/app/dashboard/admin/reports/page.tsx

"use client"; // Required for Hooks and Client Components like charts/date picker

import React, { useState } from 'react';
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";

// --- Shadcn/ui Components ---
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // For status in tables
// Assumes you have a DatePickerWithRange component (often in components/ui/date-range-picker.tsx)
import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Adjust path as needed

// --- Charting Components (from shadcn/ui/charts & recharts) ---
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// --- Icons ---
import {
  Briefcase, Users, Banknote, Receipt, AlertTriangle, CalendarCheck, FileDown, Activity
} from 'lucide-react';

// --- Mock Data (Replace with actual fetched & aggregated data) ---

// Summary Stats
const summaryData = {
  totalProjects: 42,
  activeClients: 18,
  revenueThisMonth: 7500,
  outstandingInvoices: 2100,
  upcomingDeadlines: 9,
  meetingsThisWeek: 6,
};

// Chart Data Examples
const projectVolumeData = [
  { month: 'Jan', count: 15 }, { month: 'Feb', count: 20 }, { month: 'Mar', count: 18 },
  { month: 'Apr', count: 25 }, { month: 'May', count: 22 }, { month: 'Jun', count: 30 },
];
const revenueBreakdownData = [
  { client: 'Client A', revenue: 4000 }, { client: 'Client B', revenue: 3000 },
  { client: 'Client C', revenue: 2000 }, { client: 'Client D', revenue: 2780 },
  { client: 'Client E', revenue: 1890 },
];
const avgProjectDurationData = [ { status: 'Completed', duration: 45 }, { status: 'In Progress', duration: 60 } ]; // Example structure

// Table Data Examples
const projectsReportData = [
 { id: 'p1', name: 'Website Redesign', client: 'Client A', status: 'Completed', startDate: '2025-01-10', deadline: '2025-03-31', value: 5000 },
 { id: 'p2', name: 'Marketing Campaign', client: 'Client B', status: 'In Progress', startDate: '2025-02-15', deadline: '2025-05-30', value: 7500 },
 { id: 'p3', name: 'Mobile App Dev', client: 'Client A', status: 'On Hold', startDate: '2025-03-01', deadline: '2025-08-15', value: 12000 },
];
const billingReportData = [
 { id: 'inv1', invoiceNum: 'INV-015', client: 'Client B', amount: 2500, status: 'Sent', sentOn: '2025-04-15', paidOn: null },
 { id: 'inv2', invoiceNum: 'INV-014', client: 'Client A', amount: 5000, status: 'Paid', sentOn: '2025-03-15', paidOn: '2025-03-25' },
 { id: 'inv3', invoiceNum: 'INV-013', client: 'Client C', amount: 1800, status: 'Overdue', sentOn: '2025-03-01', paidOn: null },
];
const activityReportData = [
 { id: 'a1', member: 'Alice Smith', action: 'Updated Project Status', target: 'Website Redesign', timestamp: '2025-04-21 09:15 AM' },
 { id: 'a2', member: 'Bob Johnson', action: 'Sent Invoice', target: 'INV-015', timestamp: '2025-04-15 03:00 PM' },
 { id: 'a3', member: 'Alice Smith', action: 'Added Document', target: 'Contract Agreement.pdf', timestamp: '2025-04-10 11:00 AM' },
];

// Chart Configurations (Example for Revenue Breakdown)
const revenueChartConfig = {
  revenue: { label: "Revenue (£)", color: "hsl(var(--chart-1))" },
  client: { label: "Client" },
} satisfies ChartConfig;

const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]; // Colors for Pie chart

// Helper for Status Badges
const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" => {
   switch (status?.toLowerCase()) {
    case 'in progress': return 'info';
    case 'completed': return 'success';
    case 'on hold': return 'warning';
    case 'cancelled': return 'secondary';
    case 'overdue': return 'destructive';
    case 'paid': return 'success';
    case 'sent': return 'info';
    default: return 'outline';
  }
};


/**
 * AdminReportsPage Component
 *
 * Displays reports with metrics, charts, and tables for admin users.
 */
export default function AdminReportsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // --- TODO: Data Fetching Logic ---
  // useEffect(() => {
  //   fetchReportData(activeTab, date, selectedClient).then(data => {
  //     // Update state with fetched data for charts and tables
  //   });
  // }, [activeTab, date, selectedClient]);

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting ${activeTab} report as ${format} for date range: ${date?.from} - ${date?.to}, client: ${selectedClient}`);
    // Implement actual export logic here (likely requires backend support or client-side libraries)
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans bg-gray-50 min-h-screen">

      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports</h1>
        <p className="text-gray-600">Insights across projects, clients, revenue, and activity.</p>
      </div>

      {/* Filters & Report Type Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
         {/* Filters */}
         <div className="flex flex-wrap items-center gap-3">
            <div className="flex">
              <DatePickerWithRange date={date} setDate={setDate} className="w-full sm:w-auto" />
            </div>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="client-a">Client A</SelectItem>
                <SelectItem value="client-b">Client B</SelectItem>
                <SelectItem value="client-c">Client C</SelectItem>
                {/* Add more clients dynamically */}
              </SelectContent>
            </Select>
             {/* Add more filters if needed */}
         </div>
         {/* Export Buttons */}
         <div className="flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
               <FileDown className="w-4 h-4 mr-2" /> Export CSV
             </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
               <FileDown className="w-4 h-4 mr-2" /> Export PDF
             </Button>
         </div>
      </div>

      {/* Report Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* 2. Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Projects</CardTitle><Briefcase className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryData.totalProjects}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Clients</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryData.activeClients}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle><Banknote className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">£{summaryData.revenueThisMonth.toLocaleString()}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Outstanding</CardTitle><Receipt className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">£{summaryData.outstandingInvoices.toLocaleString()}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryData.upcomingDeadlines}</div></CardContent></Card>
             <Card> <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Meetings (Week)</CardTitle><CalendarCheck className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summaryData.meetingsThisWeek}</div></CardContent></Card>
          </div>

          {/* 3. Charts & Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Project Volume Chart */}
             <Card>
               <CardHeader>
                 <CardTitle>Project Volume Over Time</CardTitle>
                 <CardDescription>Number of projects started per month</CardDescription>
               </CardHeader>
               <CardContent>
                 <ChartContainer config={{ count: { label: "Projects", color: "hsl(var(--chart-2))" } }} className="h-[250px] w-full">
                   <LineChart data={projectVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                     <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                     <ChartTooltip content={<ChartTooltipContent />} />
                     <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={true} />
                   </LineChart>
                 </ChartContainer>
               </CardContent>
             </Card>

             {/* Revenue Breakdown Chart */}
             <Card>
               <CardHeader>
                 <CardTitle>Revenue Breakdown by Client</CardTitle>
                  <CardDescription>Total revenue generated per client in period</CardDescription>
               </CardHeader>
               <CardContent>
                 <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                    {/* Using Bar Chart - Pie could also work */}
                   <BarChart data={revenueBreakdownData} layout="vertical" margin={{ right: 20, left: 20 }}>
                     <CartesianGrid horizontal={false} />
                     <YAxis dataKey="client" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} width={80} />
                     <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} tickFormatter={(value) => `£${value/1000}k`} />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                     <Bar dataKey="revenue" layout="vertical" fill="var(--color-revenue)" radius={4} />
                   </BarChart>
                 </ChartContainer>
               </CardContent>
             </Card>
          </div>
        </TabsContent>

        {/* Projects Tab Content */}
        <TabsContent value="projects" className="space-y-6">
           <Card>
             <CardHeader><CardTitle>Projects Report</CardTitle></CardHeader>
             <CardContent>
               {/* Add Project Specific Charts Here (e.g., Status Pie Chart) */}
               <Table>
                 <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Client</TableHead><TableHead>Status</TableHead><TableHead>Start Date</TableHead><TableHead>Deadline</TableHead><TableHead>Total Value (£)</TableHead></TableRow></TableHeader>
                 <TableBody>
                   {projectsReportData.map(p => (
                     <TableRow key={p.id}>
                       <TableCell className="font-medium">{p.name}</TableCell><TableCell>{p.client}</TableCell>
                       <TableCell><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></TableCell>
                       <TableCell>{p.startDate}</TableCell><TableCell>{p.deadline}</TableCell>
                       <TableCell>{p.value.toLocaleString()}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Billing Tab Content */}
        <TabsContent value="billing" className="space-y-6">
           <Card>
             <CardHeader><CardTitle>Billing Report</CardTitle></CardHeader>
             <CardContent>
                {/* Add Billing Specific Charts Here (e.g., Revenue vs Outstanding) */}
               <Table>
                 <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Client</TableHead><TableHead>Amount (£)</TableHead><TableHead>Status</TableHead><TableHead>Sent On</TableHead><TableHead>Paid On</TableHead></TableRow></TableHeader>
                 <TableBody>
                   {billingReportData.map(inv => (
                     <TableRow key={inv.id}>
                       <TableCell className="font-medium">{inv.invoiceNum}</TableCell><TableCell>{inv.client}</TableCell>
                       <TableCell>{inv.amount.toLocaleString()}</TableCell>
                       <TableCell><Badge variant={getStatusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                       <TableCell>{inv.sentOn}</TableCell><TableCell>{inv.paidOn || '-'}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

        {/* Activity Tab Content */}
        <TabsContent value="activity" className="space-y-6">
           <Card>
             <CardHeader><CardTitle>Team Activity Log</CardTitle></CardHeader>
             <CardContent>
                {/* Add Activity Specific Charts Here (e.g., Actions per User) */}
               <Table>
                 <TableHeader><TableRow><TableHead>Team Member</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Date/Time</TableHead></TableRow></TableHeader>
                 <TableBody>
                   {activityReportData.map(act => (
                     <TableRow key={act.id}>
                       <TableCell className="font-medium">{act.member}</TableCell><TableCell>{act.action}</TableCell>
                       <TableCell>{act.target}</TableCell><TableCell>{act.timestamp}</TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

// --- Notes ---
// 1. Dependencies: Ensure `recharts`, `date-fns`, `react-day-picker` are installed, and `shadcn/ui` components (`charts`, `date-picker`, `select`, `tabs`, `card`, `table`, `button`, `badge`) are added/available.
// 2. Data Fetching & Aggregation: Replace mock data with real data fetched from your backend. The backend should perform the necessary aggregations based on selected filters (date range, client).
// 3. Chart Customization: Explore `recharts` documentation for more advanced chart types and customization options. Configure `ChartContainer` and specific chart components as needed.
// 4. Date Picker Component: Ensure the `DatePickerWithRange` component path and props (`date`, `setDate`) match your implementation.
// 5. Export Logic: Implement actual file generation/download logic in `handleExport` using appropriate libraries or backend endpoints.
// 6. Responsiveness: Test and adjust layout/chart sizes for different screen widths. `ResponsiveContainer` helps with chart resizing.

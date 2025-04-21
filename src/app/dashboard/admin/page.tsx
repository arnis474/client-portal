// dashboard/page.tsx
import {
  UsersIcon,
  CheckBadgeIcon,
  ClockIcon,
  CalendarDaysIcon,
  FunnelIcon,
  Bars3Icon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  DocumentIcon, // Generic file icon
  // Specific file icons (optional, use DocumentIcon if not needed)
  DocumentTextIcon,
  PhotoIcon,
  VideoCameraIcon,
  TableCellsIcon,
  ClipboardDocumentIcon, // Example for PDF
} from '@heroicons/react/24/outline'

// Placeholder data (replace with actual data fetching)
const stats = [
  { name: 'Active Clients', value: '24', icon: UsersIcon, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { name: 'Active Projects', value: '18', icon: CheckBadgeIcon, color: 'text-green-600', bgColor: 'bg-green-100' },
  { name: 'Pending Tasks', value: '42', icon: ClockIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { name: 'Upcoming Meetings', value: '7', icon: CalendarDaysIcon, color: 'text-purple-600', bgColor: 'bg-purple-100' },
]

const tasks = {
  todo: [
    { id: 'task1', title: 'Website Redesign', client: 'Client: Acme Corp', dueDate: 'Due: May 15', priority: 'High', priorityClass: 'bg-red-100 text-red-700' },
    { id: 'task2', title: 'Content Strategy', client: 'Client: Beta LLC', dueDate: 'Due: May 18', priority: 'Medium', priorityClass: 'bg-yellow-100 text-yellow-700' },
  ],
  inProgress: [
    { id: 'task3', title: 'SEO Optimization', client: 'Client: Gamma Inc.', dueDate: 'Due: May 20', progress: 75, isUrgent: true },
    { id: 'task4', title: 'Social Media Campaign', client: 'Client: Delta Co', dueDate: 'Due: May 22', progress: 40 },
  ],
  done: [
    { id: 'task5', title: 'Brand Identity', client: 'Client: Epsilon Ltd', completedDate: 'Completed: May 9', status: 'Completed', statusClass: 'bg-green-100 text-green-700' },
    { id: 'task6', title: 'Email Marketing', client: 'Client: Zeta Corp', completedDate: 'Completed: May 5', status: 'Completed', statusClass: 'bg-green-100 text-green-700' },
  ],
}

const meetings = [
    { id: 'meet1', clientName: 'Acme Corp', clientInitials: 'AC', dateTime: 'May 10, 2025 ・ 2:00 PM - 3:00 PM', purpose: 'Website Review', purposeClass: 'bg-blue-100 text-blue-700', link: 'Join Google Meet' },
    { id: 'meet2', clientName: 'Beta Inc', clientInitials: 'BI', dateTime: 'May 12, 2025 ・ 10:00 AM - 11:00 AM', purpose: 'Strategy Session', purposeClass: 'bg-purple-100 text-purple-700', link: 'Join Google Meet' },
]

const recentFiles = [
    { id: 'file1', name: 'Project_Brief.pdf', entity: 'Acme Corp', icon: ClipboardDocumentIcon },
    { id: 'file2', name: 'Content_Outline.docx', entity: 'Beta LLC', icon: DocumentTextIcon },
    { id: 'file3', name: 'Budget_Plan.xlsx', entity: 'Gamma Inc.', icon: TableCellsIcon },
    { id: 'file4', name: 'Logo_Design.png', entity: 'Delta Co', icon: PhotoIcon },
    { id: 'file5', name: 'Tutorial.mp4', entity: 'Epsilon Ltd', icon: VideoCameraIcon },
    { id: 'file6', name: 'Assets.zip', entity: 'Zeta Corp', icon: DocumentIcon }, // Generic for zip
]


export default function DashboardHome() {
  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen"> {/* Added bg and spacing */}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Client Projects Dashboard</h1>
        <p className="text-sm text-gray-600">Manage all client projects and tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5 flex items-center justify-between">
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                 <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Tracker */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Project Tracker</h2>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              Filter
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <Bars3Icon className="h-4 w-4 mr-1.5 text-gray-400" />
              Sort
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">To Do</h3>
            <div className="space-y-3 flex-1">
              {tasks.todo.map(task => (
                <div key={task.id} className="bg-white p-3 rounded shadow border border-gray-200">
                   <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-800">{task.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.priorityClass}`}>
                      {task.priority}
                    </span>
                   </div>
                  <p className="text-xs text-gray-500">{task.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <PlusIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              Add Task
            </button>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-100 rounded-lg p-4 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">In Progress</h3>
             <div className="space-y-3 flex-1">
              {tasks.inProgress.map(task => (
                <div key={task.id} className="bg-white p-3 rounded shadow border border-gray-200">
                   <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-800">{task.title}</h4>
                    {task.isUrgent && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700`}>
                        Urgent
                      </span>
                    )}
                   </div>
                  <p className="text-xs text-gray-500">{task.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.dueDate}</p>
                  {task.progress !== undefined && (
                     <div className="mt-2">
                       <div className="w-full bg-gray-200 rounded-full h-1.5">
                         <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress}%` }}></div>
                       </div>
                       <p className="text-xs text-gray-500 text-right mt-0.5">{task.progress}% complete</p>
                     </div>
                  )}
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <PlusIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              Add Task
            </button>
          </div>

           {/* Done Column */}
           <div className="bg-gray-100 rounded-lg p-4 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Done</h3>
             <div className="space-y-3 flex-1">
              {tasks.done.map(task => (
                <div key={task.id} className="bg-white p-3 rounded shadow border border-gray-200 opacity-80"> {/* Slight opacity for done */}
                   <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-800 line-through">{task.title}</h4>
                     {task.status && (
                       <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${task.statusClass}`}>
                         {task.status}
                       </span>
                     )}
                   </div>
                  <p className="text-xs text-gray-500">{task.client}</p>
                  <p className="text-xs text-gray-500 mt-1">{task.completedDate}</p>
                </div>
              ))}
            </div>
            {/* No 'Add Task' button in 'Done' typically, but image shows it, uncomment if needed */}
             {/* <button className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
               <PlusIcon className="h-4 w-4 mr-1.5 text-gray-400" />
               Add Task
             </button> */}
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
       <div className="bg-white shadow rounded-lg p-6">
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
           <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700">
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Schedule
            </button>
         </div>
         {/* Meetings Table - Using divs for structure */}
         <div>
            {/* Header Row */}
            <div className="hidden md:flex items-center px-3 py-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-t-md">
                <div className="w-2/6">Client</div>
                <div className="w-1/4">Date & Time</div>
                <div className="w-1/4">Purpose</div>
                <div className="w-1/6">Meeting Link</div>
                <div className="w-1/12 text-right">Actions</div>
            </div>
            {/* Data Rows */}
            <div className="divide-y divide-gray-200">
                {meetings.map(meeting => (
                    <div key={meeting.id} className="flex flex-col md:flex-row items-start md:items-center px-3 py-3 hover:bg-gray-50">
                        <div className="w-full md:w-2/6 flex items-center mb-2 md:mb-0">
                            <span className="flex-shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-sm font-medium text-gray-600 mr-3">
                                {meeting.clientInitials}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{meeting.clientName}</span>
                        </div>
                        <div className="w-full md:w-1/4 text-sm text-gray-600 mb-2 md:mb-0">{meeting.dateTime}</div>
                        <div className="w-full md:w-1/4 mb-2 md:mb-0">
                             <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${meeting.purposeClass}`}>
                                {meeting.purpose}
                            </span>
                        </div>
                        <div className="w-full md:w-1/6 text-sm mb-2 md:mb-0">
                            <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">{meeting.link}</a>
                        </div>
                        <div className="w-full md:w-1/12 flex justify-start md:justify-end space-x-2">
                           <button className="text-gray-400 hover:text-gray-600">
                               <PencilIcon className="h-4 w-4" />
                               <span className="sr-only">Edit</span>
                           </button>
                           <button className="text-gray-400 hover:text-red-600">
                               <TrashIcon className="h-4 w-4" />
                               <span className="sr-only">Delete</span>
                           </button>
                        </div>
                    </div>
                ))}
            </div>
         </div>
       </div>


      {/* Recent Files */}
      <div className="bg-white shadow rounded-lg p-6">
         <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-medium text-gray-900">Recent Files</h2>
           <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
              <ArrowUpTrayIcon className="h-4 w-4 mr-1.5 text-gray-400" />
              Upload
            </button>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentFiles.map(file => (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                     <file.icon className="h-10 w-10 text-gray-400 mb-2" aria-hidden="true" />
                     <p className="text-sm font-medium text-gray-700 truncate w-full" title={file.name}>{file.name}</p>
                     <p className="text-xs text-gray-500 mt-0.5">{file.entity}</p>
                </div>
            ))}
         </div>
      </div>
    </div>
  )
}
  
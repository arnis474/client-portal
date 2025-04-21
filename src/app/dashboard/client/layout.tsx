'use client' // Assuming Next.js App Router context, keep if needed

import { ReactNode } from 'react'
import {
  ClockIcon,
  RectangleGroupIcon, // Using this for 'My Projects' - choose another if preferred
  QueueListIcon,      // Using this for 'Tasks'
  DocumentIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon // Using this for 'Messages'
} from '@heroicons/react/24/outline'
import Link from 'next/link' // Assuming Next.js for links, replace with <a> if not

// Helper function for conditional classes
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

// Define the navigation items based on the image
const clientNavigation = [
  { name: 'Dashboard', href: '/dashboard/client', icon: ClockIcon, current: false },
  { name: 'My Projects', href: '/dashboard/client/projects', icon: RectangleGroupIcon, current: false },
  { name: 'Tasks', href: '/dashboard/client/tasks', icon: QueueListIcon, current: false },
  { name: 'Documents', href: '/dashboard/client/files', icon: DocumentIcon, current: false },
  { name: 'Meetings', href: '/dashboard/client/meetings', icon: CalendarIcon, current: false },
  { name: 'Messages', href: '/dashboard/client/messages', icon: ChatBubbleLeftRightIcon, current: false },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white"> {/* Added bg-white for main area contrast */}
      {/* Static Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-black p-4 flex flex-col"> {/* Updated classes */}
        {/* Optional: Add a Logo or Client Name Here */}
        <div className="h-16 flex items-center text-white px-2">
           {/* <img src="/path/to/client-logo.svg" alt="Client Logo" className="h-8 w-auto" /> */}
           <span className="text-xl font-semibold">Client Portal</span> {/* Example Title */}
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1"> {/* Added mt-4 for spacing from title */}
          <ul role="list" className="space-y-1"> {/* Add space between items */}
            {clientNavigation.map((item) => (
              <li key={item.name}>
                <Link // Use Link for Next.js or <a> otherwise
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-800 text-white' // Active item style from image
                      : 'text-white hover:bg-gray-700 hover:text-white', // Default & hover
                    'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-medium' // Adjusted padding/font
                  )}
                >
                  <item.icon
                    className={classNames(
                       // Icon color is always white in this design, active or not
                      'text-white h-6 w-6 shrink-0'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Optional: Add User Profile / Logout at the bottom */}
        {/* <div className="mt-auto p-2">
           User Info / Logout Button
        </div> */}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
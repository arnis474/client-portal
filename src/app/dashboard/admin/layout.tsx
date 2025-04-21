'use client'
import {
  CalendarIcon,
  ClockIcon,
  DocumentIcon,
  ChartBarIcon,
  QueueListIcon,
  PlusIcon,
  UsersIcon,
  StarIcon, // Added
  ChatBubbleBottomCenterIcon, // Added
  XMarkIcon // Added for mobile close button clarity
} from '@heroicons/react/24/outline'
import { ReactNode, useState } from 'react'

// Optional: Define navigation structure for easier mapping, though not strictly necessary for this static example
const workspaceNavigation = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: ClockIcon, current: false },
  { name: 'Clients', href: '/dashboard/admin/clients', icon: UsersIcon, current: false },
  { name: 'Projects', href: '/dashboard/admin/projects', icon: QueueListIcon, current: false },
  { name: 'Calendar', href: '/dashboard/admin/calendar', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '/dashboard/admin/files', icon: DocumentIcon, current: false },
  { name: 'Reports', href: '/dashboard/admin/reports', icon: ChartBarIcon, current: false },
]
const quickAccessNavigation = [
  { name: 'Priority Tasks', href: '/dashboard/admin/tasks', icon: StarIcon, current: false }, // Not yet implemented
  { name: 'Recent Files', href: '/dashboard/admin/recentfiles', icon: ClockIcon, current: false },
  { name: 'Team Chat', href: '/dashboard/admin/chat', icon: ChatBubbleBottomCenterIcon, current: false }, // Not yet implemented
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Default to closed on mobile

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar */}
      {/* NOTE: Mobile sidebar styling hasn't been changed to match the new items */}
      <div className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} role="dialog" aria-modal="true">
        {/* Off-canvas menu backdrop */}
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>

        <div className="fixed inset-0 flex">
          {/* Off-canvas menu */}
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
             {/* Close button */}
             <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
               <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                 <span className="sr-only">Close sidebar</span>
                 <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
               </button>
             </div>

            {/* Sidebar component */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                {/* Optional Mobile Logo */}
                {/* <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                /> */}
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    {/* Mobile New Client Button - Styling might differ */}
                    <button className="text-white w-full rounded-md bg-red-600 px-3 py-2 text-sm font-semibold flex items-center justify-center gap-x-2 shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                      New Client
                    </button>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Workspace</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {workspaceNavigation.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800',
                              'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                            )}
                          >
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* Mobile Quick Access Section */}
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Quick Access</div>
                     <ul role="list" className="-mx-2 mt-2 space-y-1">
                       {quickAccessNavigation.map((item) => (
                         <li key={item.name}>
                           <a
                             href={item.href}
                             className={classNames(
                               item.current
                                 ? 'bg-gray-800 text-white'
                                 : 'text-gray-400 hover:text-white hover:bg-gray-800',
                               'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                             )}
                           >
                             {/* Adjust icon color based on hover/current state if needed */}
                             <item.icon
                               className={classNames(
                                item.current ? 'text-white' : 'text-gray-400 group-hover:text-white',
                                'h-6 w-6 shrink-0'
                               )}
                               aria-hidden="true"
                              />
                             {item.name}
                           </a>
                         </li>
                       ))}
                     </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            {/* Optional Desktop Logo */}
            {/* <img
              className="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=white" // Example: white logo on black bg
              alt="Your Company"
            /> */}
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {/* New Client Button */}
              <li>
                <button className="text-white w-full rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                  <div className="flex items-center justify-center">
                    <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    New Client
                  </div>
                </button>
              </li>
              {/* Workspace Section */}
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  WORKSPACE
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {workspaceNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-800 text-white' // Active item style
                            : 'text-gray-400 hover:text-white hover:bg-gray-800', // Default item style
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-white' : 'text-gray-400 group-hover:text-white', // Icon color matches text/hover
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
              {/* Quick Access Section - NEW */}
              <li>
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  QUICK ACCESS
                </div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {quickAccessNavigation.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className={classNames(
                          item.current
                            ? 'bg-gray-800 text-white' // Active item style (if any)
                            : 'text-gray-400 hover:text-white hover:bg-gray-800', // Default item style
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.current ? 'text-white' : 'text-gray-400 group-hover:text-white', // Icon color matches text/hover
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Optional: Add settings or profile link at the bottom */}
              {/* <li className="mt-auto">
                 <a
                   href="#"
                   className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
                 >
                   <Cog6ToothIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                   Settings
                 </a>
               </li> */}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area needs a left margin to offset the fixed sidebar */}
      <main className="flex-1 p-4 lg:pl-72 lg:p-6"> {/* Adjusted lg:pl-72 */}
        {/* Button to toggle mobile sidebar (place it in your header/main content) */}
         <button
           type="button"
           className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
           onClick={() => setSidebarOpen(true)}
         >
           <span className="sr-only">Open sidebar</span>
           {/* You might want a different icon like Bars3Icon */}
           <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path></svg>
        </button>

        {/* Your page content goes here */}
        {children}
      </main>
    </div>
  )
}
'use client'; // Keep if using Next.js App Router or hooks like useState

import { Fragment, ReactNode, useState } from 'react';
import { useEffect } from 'react';
const customScrollbarStyle = `
 .custom-scrollbar::-webkit-scrollbar {
 display: none;
 }
 .custom-scrollbar {
 -ms-overflow-style: none; /* IE and Edge */
 scrollbar-width: none; /* Firefox */
 }
 `;
import { Dialog, Transition } from '@headlessui/react'; // For mobile sidebar transition
import Link from 'next/link'; // Assuming Next.js for links, replace with <a> if not
import {
  ClockIcon,
  RectangleGroupIcon, // Using this for 'My Projects'
  QueueListIcon,      // Using this for 'Tasks'
  ArchiveBoxIcon,     // Using this for 'Deliverables' - NEW
  DocumentIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon, // Using this for 'Messages'
  ClipboardDocumentListIcon, // Using this for 'Forms & Requests' - NEW
  UserCircleIcon,     // Using this for 'My Account' - NEW
  BellIcon,           // Using this for 'Notifications' - NEW
  LifebuoyIcon,       // Using this for 'Help & Support' - NEW
  ArrowLeftOnRectangleIcon, // Using this for 'Logout' - NEW
  XMarkIcon,          // Mobile close
  Bars3Icon,          // Mobile open / Hamburger
  ChevronDoubleLeftIcon, // Collapse icon
  ChevronDoubleRightIcon // Expand icon
} from '@heroicons/react/24/outline';
// --- If using Next.js App Router, uncomment the line below ---
// import { usePathname } from 'next/navigation';

// --- Navigation Structure ---
interface ClientNavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;
  notificationCount?: number; // Optional for badges
}

const workspaceNavigation: ClientNavItem[] = [
  { name: 'Dashboard', href: '/dashboard/client', icon: ClockIcon },
  { name: 'My Projects', href: '/dashboard/client/projects', icon: RectangleGroupIcon },
  { name: 'Tasks', href: '/dashboard/client/tasks', icon: QueueListIcon },
  { name: 'Deliverables', href: '/dashboard/client/deliverables', icon: ArchiveBoxIcon }, // NEW
  { name: 'Documents', href: '/dashboard/client/files', icon: DocumentIcon },
  { name: 'Meetings', href: '/dashboard/client/meetings', icon: CalendarIcon },
  { name: 'Messages', href: '/dashboard/client/messages', icon: ChatBubbleLeftRightIcon, notificationCount: 3 }, // Example badge count
];

const accountNavigation: ClientNavItem[] = [
  { name: 'Forms & Requests', href: '/dashboard/client/forms', icon: ClipboardDocumentListIcon }, // NEW
  { name: 'My Account', href: '/dashboard/client/account', icon: UserCircleIcon }, // NEW
  { name: 'Notifications', href: '/dashboard/client/notifications', icon: BellIcon, notificationCount: 5 }, // NEW + Example badge count
  { name: 'Help & Support', href: '/dashboard/client/support', icon: LifebuoyIcon }, // NEW
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Main Layout Component ---
export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar collapse state
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customScrollbarStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  // --- Dynamic Active State Logic ---
  // const pathname = usePathname(); // Uncomment if using Next.js App Router
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''; // Basic fallback

  const checkCurrent = (href: string): boolean => {
    // Basic check: exact match or starts with for nested routes
    return pathname === href || (href !== '/dashboard/client' && pathname.startsWith(href));
  };

  // --- Logout Handler ---
  const handleLogout = () => {
     console.log("Client Logout triggered");
     // Implement client logout logic
  };

  // --- Sidebar Content Component ---
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo Area */}
      <div className={`flex h-16 shrink-0 items-center ${isCollapsed && !isMobile ? 'justify-center' : 'px-4'}`}>
        {/* Replace with your actual logo */}
        <img
          className={`h-9 w-auto ${isCollapsed && !isMobile ? '' : ''}`} // Adjust size as needed
          src="/roseyco_logo.svg" // <-- REPLACE WITH YOUR CLIENT LOGO PATH (served from /public)
          alt="Company Logo"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; console.error("Logo load error"); }}
        />
      </div>


      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Workspace Section */}
          <li>
            <SectionTitle title="WORKSPACE" isCollapsed={isCollapsed && !isMobile} />
            <NavList items={workspaceNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
          </li>

          {/* Account Section */}
          <li>
            <SectionTitle title="ACCOUNT" isCollapsed={isCollapsed && !isMobile} />
            <NavList items={accountNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
          </li>

          {/* Logout (Bottom) */}
          <li className="mt-auto">
             {/* Optional Divider */}
             {!isCollapsed || isMobile ? <div className="h-px w-full bg-gray-700 my-2"></div> : null}
             <a
               href="#"
               onClick={(e) => { e.preventDefault(); handleLogout(); }}
               title={isCollapsed && !isMobile ? 'Logout' : undefined}
               className={classNames(
                 'text-gray-300 hover:bg-gray-800 hover:text-white', // Style like other nav items
                 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors duration-150 ease-in-out items-center',
                 isCollapsed && !isMobile ? 'justify-center' : ''
               )}
             >
               <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-white transition-colors duration-150 ease-in-out" aria-hidden="true" />
               {!isCollapsed || isMobile ? 'Logout' : ''}
             </a>
          </li>
        </ul>
      </nav>
    </>
  );

  // --- Helper Components ---
  const SectionTitle = ({ title, isCollapsed }: { title: string; isCollapsed: boolean }) => (
     !isCollapsed ? (
        <div className="mb-1 px-3 text-xs font-semibold leading-6 text-gray-500">{title}</div>
     ) : (
        <div className="h-px w-full bg-gray-700 my-3"></div> // Divider when collapsed
     )
  );

  const NavItemIcon = ({ Icon, current }: { Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>; current: boolean; }) => {
    return (
      <Icon
        className={classNames(
          current ? 'text-white' : 'text-gray-400 group-hover:text-white',
          'h-6 w-6 shrink-0 transition-colors duration-150 ease-in-out'
        )}
        aria-hidden="true" />
    ); };
  const NavList = ({ items, isCollapsed, checkCurrent }: { items: ClientNavItem[]; isCollapsed: boolean; checkCurrent: (href: string) => boolean }) => (
     <ul role="list" className="space-y-1">
       {items.map((item) => {
         const current = checkCurrent(item.href);
         return (
           <li key={item.name}>
             <Link // Use Link for Next.js client-side navigation
               href={item.href}
               title={isCollapsed ? item.name : undefined} // Basic HTML tooltip
               className={classNames(
                 current
                   ? 'bg-gray-800 text-white font-semibold' // Active item style
                   : 'text-gray-300 hover:bg-gray-800 hover:text-white', // Default & hover
                 'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-medium transition-colors duration-150 ease-in-out relative', // Added relative for badge positioning
                 isCollapsed ? 'justify-center' : ''
               )}
               aria-current={current ? 'page' : undefined}
             >
               <NavItemIcon Icon={item.icon} current={current} />
               {!isCollapsed && <span className="truncate flex-1">{item.name}</span>}
               {/* Notification Badge */}
               {!isCollapsed && item.notificationCount && item.notificationCount > 0 && (
                  <span className="ml-auto inline-block whitespace-nowrap rounded-full bg-red-600 px-2 py-0.5 text-xs font-medium leading-4 text-white">
                     {item.notificationCount > 9 ? '9+' : item.notificationCount}
                  </span>
               )}
                {/* Smaller dot badge when collapsed */}
               {isCollapsed && item.notificationCount && item.notificationCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black" />
               )}
             </Link>
           </li>
         );
       })}
     </ul>
  );

  // --- Main Render ---
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-4 pb-4 ring-1 ring-white/10 custom-scrollbar">
                   <SidebarContent isMobile={true} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={classNames(
         "hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
         isCollapsed ? "lg:w-20" : "lg:w-64" // Adjusted width
       )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-3 pb-4 relative custom-scrollbar"> {/* Adjusted padding */}
          <button onClick={() => setIsCollapsed(!isCollapsed)}

            className="flex mt-3 items-center justify-center w-full rounded-none text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 py-2"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <span className="sr-only">{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
            {isCollapsed ? (<ChevronDoubleRightIcon className="h-4 w-4" />) : (<ChevronDoubleLeftIcon className="h-4 w-4" />)}
          </button>
          <SidebarContent isMobile={false} />
        </div>
      </div>

      {/* Main content area */}
      <main className={classNames(
         "flex-1 transition-all duration-300 ease-in-out",
         isCollapsed ? "lg:pl-20" : "lg:pl-64" // Adjusted padding
      )}>
         {/* Sticky Header Example */}
         <div className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-700">
            <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300" onClick={() => setSidebarOpen(true)}>
               <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="h-6 w-px bg-gray-900/10 lg:hidden dark:bg-white/5" aria-hidden="true" />
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
               {/* Header Content Placeholder */}
            </div>
         </div>

         {/* Page Content */}
         <div className="p-4 sm:p-6 lg:p-8">
           {children}
         </div>
      </main>
    </div>
  );
}

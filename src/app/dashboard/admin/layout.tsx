'use client'; // Needed for useState hook

import { Fragment, ReactNode, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link'; // Assuming Next.js
import {
  ClockIcon,            // Dashboard
  UsersIcon,            // Clients, All Clients
  QueueListIcon,        // Projects, All Projects
  CalendarIcon,         // Calendar
  DocumentIcon,         // Documents
  ChartBarIcon,         // Reports
  ChatBubbleLeftRightIcon, // Team Chat, Shared Notes/Ideas (using this for consistency)
  Cog6ToothIcon,        // Settings
  UserCircleIcon,       // My Account
  ArrowLeftOnRectangleIcon, // Logout
  ListBulletIcon,       // All Tasks
  BookOpenIcon,         // Internal Docs, SOPs/Training
  LinkIcon,             // Tools & Links
  KeyIcon,              // Password Vault
  PhotoIcon,            // Brand Assets
  DocumentDuplicateIcon,// Proposal Templates
  ScaleIcon,            // Legal / Contracts
  TrophyIcon,           // Team Goals (Optional)
  XMarkIcon,            // Mobile close
  Bars3Icon,            // Mobile open / Hamburger
  ChevronDoubleLeftIcon, // Collapse icon
  ChevronDoubleRightIcon // Expand icon
} from '@heroicons/react/24/outline';
// --- If using Next.js App Router, uncomment the line below ---
// import { usePathname } from 'next/navigation';

// --- Navigation Structure ---
interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;
}

// Renamed from workspaceNavigation to essentialsNavigation
const essentialsNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard/admin', icon: ClockIcon },
  { name: 'Clients', href: '/dashboard/admin/clients', icon: UsersIcon },
  { name: 'Projects', href: '/dashboard/admin/projects', icon: QueueListIcon },
  { name: 'Calendar', href: '/dashboard/admin/calendar', icon: CalendarIcon },
  { name: 'Documents', href: '/dashboard/admin/files', icon: DocumentIcon },
  { name: 'Reports', href: '/dashboard/admin/reports', icon: ChartBarIcon },
  { name: 'Team Chat', href: '/dashboard/admin/chat', icon: ChatBubbleLeftRightIcon }, // Moved here
];

// NEW: Team Space Navigation
const teamSpaceNavigation: NavItem[] = [
  { name: 'All Clients', href: '/dashboard/admin/all-clients', icon: UsersIcon }, // Link might be same as essentials or a different view
  { name: 'All Projects', href: '/dashboard/admin/all-projects', icon: QueueListIcon },
  { name: 'All Tasks', href: '/dashboard/admin/all-tasks', icon: ListBulletIcon },
  { name: 'Shared Notes / Ideas', href: '/dashboard/admin/notes', icon: ChatBubbleLeftRightIcon }, // Reusing chat icon, consider LightBulbIcon if available/preferred
  // { name: 'Team Goals', href: '/dashboard/admin/goals', icon: TrophyIcon }, // Optional
];

// NEW: Resources Navigation
const resourcesNavigation: NavItem[] = [
  { name: 'Internal Docs', href: '/dashboard/admin/internal-docs', icon: BookOpenIcon },
  { name: 'Tools & Links', href: '/dashboard/admin/tools', icon: LinkIcon },
  { name: 'SOPs / Training', href: '/dashboard/admin/sops', icon: BookOpenIcon }, // Reusing BookOpenIcon
  { name: 'Password Vault', href: '/dashboard/admin/passwords', icon: KeyIcon },
  { name: 'Brand Assets', href: '/dashboard/admin/assets', icon: PhotoIcon },
  // { name: 'Proposal Templates', href: '/dashboard/admin/templates', icon: DocumentDuplicateIcon }, // Optional
  { name: 'Legal / Contracts', href: '/dashboard/admin/legal', icon: ScaleIcon },
];

// Kept separate for clarity
const settingsNavigation: NavItem[] = [
   { name: 'Settings', href: '/dashboard/admin/settings', icon: Cog6ToothIcon },
];

const profileNavigation: NavItem[] = [
   { name: 'My Account', href: '/dashboard/admin/profile', icon: UserCircleIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const customScrollbarStyle = `
  .custom-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4a5568; /* Example dark theme thumb color */
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #1a202c; /* Example dark theme track color */
  }
  .dark .custom-scrollbar::-webkit-scrollbar-track {
  }
  .custom-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const NavItemIcon = ({ Icon, current }: { Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, 'ref'> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>; current: boolean; }) => {
  return (
    <Icon
      className={classNames(
        current ? 'text-white' : 'text-gray-400 group-hover:text-white',
        'h-6 w-6 shrink-0 transition-colors duration-150 ease-in-out'
      )}
      aria-hidden="true" />
  );
};
// --- Main Layout Component ---
export default function DashboardLayoutV3Final({ children }: { children: ReactNode }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = customScrollbarStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);



  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // --- Dynamic Active State Logic ---
  // const pathname = usePathname(); // Uncomment if using Next.js App Router
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''; // Basic fallback

  const checkCurrent = (href: string): boolean => {
    // Basic check, adjust as needed
    return pathname === href || (href !== '/dashboard/admin' && pathname.startsWith(href));
  };

  // --- Logout Handler ---
  const handleLogout = () => {
     console.log("Logout triggered");
     // Implement logout logic
  };

  // --- Sidebar Content Component ---
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Collapse button - Always rendered, hidden on mobile */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:block hidden items-center justify-center w-full mt-3 rounded-none text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 py-2"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <span className="sr-only">{isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}</span>
        {isCollapsed ? ( <ChevronDoubleRightIcon className="h-4 w-4" /> ) : ( <ChevronDoubleLeftIcon className="h-4 w-4" /> )}
      </button>

      {/* Logo Area */}

      <div className={`flex h-16 shrink-0 items-center ${isCollapsed && !isMobile ? 'justify-center' : 'px-4'}`}>
         <img
            className={`h-9 w-auto ${isCollapsed && !isMobile ? 'h-8' : 'h-9'}`} // Slightly smaller when collapsed
            src="/roseyco_logo.svg" // *** YOUR LOGO PATH ***
            alt="Company Logo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; console.error("Logo load error"); }}
         />
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Essentials Section */}
          <li>
            <SectionTitle title="ESSENTIALS" isCollapsed={isCollapsed && !isMobile} />
            <NavList items={essentialsNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
          </li>

          {/* Team Space Section - NEW */}
          <li>
            <SectionTitle title="TEAM SPACE" isCollapsed={isCollapsed && !isMobile} />
            <NavList items={teamSpaceNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
          </li>

          {/* Resources Section - NEW */}
          <li>
            <SectionTitle title="RESOURCES" isCollapsed={isCollapsed && !isMobile} />
            <NavList items={resourcesNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
          </li>

          {/* Settings Section */}
           <li>
             <SectionTitle title="SETTINGS" isCollapsed={isCollapsed && !isMobile} />
             <NavList items={settingsNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
           </li>

          {/* Profile Section (at the bottom) */}
          <li className="mt-auto">
             <SectionTitle title="PROFILE" isCollapsed={isCollapsed && !isMobile} />
             {/* Logged-in User Info (Example) */}
             <div className={classNames(
                 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold items-center text-gray-300',
                 isCollapsed && !isMobile ? 'justify-center' : ''
             )}>
                 <UserCircleIcon className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" />
                 {!isCollapsed || isMobile ? (
                    <span className="truncate">Admin User</span> // Replace with dynamic user name
                 ) : null}
             </div>
             {/* My Account Link */}
             <NavList items={profileNavigation} isCollapsed={isCollapsed && !isMobile} checkCurrent={checkCurrent} />
             {/* Logout Button */}
             <a
               href="#"
               onClick={(e) => { e.preventDefault(); handleLogout(); }}
               title={isCollapsed && !isMobile ? 'Logout' : undefined}
               className={classNames(
                 'text-gray-300 hover:bg-red-600 hover:text-white', // Use red hover
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
        <div className="mb-1 mt-4 px-3 text-xs font-semibold leading-6 text-gray-500">{title}</div> // Adjusted spacing/padding
     ) : (
        <div className="h-px w-full bg-gray-700 my-3 mx-auto"></div> // Divider when collapsed
     )
  );

  const NavList = ({ items, isCollapsed, checkCurrent }: { items: NavItem[]; isCollapsed: boolean; checkCurrent: (href: string) => boolean }) => (
     <ul role="list" className="space-y-1">
       {items.map((item) => {
          const current = checkCurrent(item.href);
         return (
           <li key={item.name}>
             {/* TODO: Add Tooltip for collapsed state */}
             <Link // Use Link for client-side routing
               href={item.href}
               title={isCollapsed ? item.name : undefined}
               className={classNames(
                 current
                   ? 'bg-red-700 text-white font-semibold' // UPDATED: Red active state
                   : 'text-gray-300 hover:bg-red-600 hover:text-white', // UPDATED: Red hover state
                 'group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm leading-6 font-medium transition-colors duration-150 ease-in-out',
                 isCollapsed ? 'justify-center' : ''
               )}
                aria-current={current ? 'page' : undefined}
             >
               <NavItemIcon Icon={item.icon} current={current}
               />
               {!isCollapsed && <span className="truncate">{item.name}</span>}
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
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-4 pb-4 ring-1 ring-white/10"> {/* Adjusted padding */}
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
         isCollapsed ? "lg:w-20" : "lg:w-72" // Keep original width or adjust if needed
      )}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-3 pb-4 relative custom-scrollbar"> {/* Adjusted padding */}
          <SidebarContent isMobile={false}/>
        </div>
      </div>

      {/* Main content area */}
      <main className={classNames(
         "flex-1 transition-all duration-300 ease-in-out",
         isCollapsed ? "lg:pl-20" : "lg:pl-72" // Adjust based on sidebar width
      )}>
         {/* Sticky Header */}
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

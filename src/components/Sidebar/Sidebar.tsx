import { mainLinks, signOutLink } from '@/constants';
import React from 'react'
import LinkItem from './LinkItem';
import { usePathname } from 'next/navigation';

type SidebarProps = {
    isSidebarOpen: boolean;
  };

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {

    const pathname = usePathname();

  return (
    <aside className={`fixed top-0 left-0 z-40 w-60 h-screen pt-20 bg-white border-r border-gray-200
      transform transition-transform duration-300 ease-in-out
      sm:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-2 font-medium">
            {mainLinks.map((link, index) => (
              <LinkItem key={index} {...link} active={pathname === link.href} />
            ))}
          </ul>
        </div>
        
        <div className="px-3 py-4 font-semibold">
          <ul>
            <LinkItem {...signOutLink} />
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
import Image from 'next/image'
import React from 'react'
import { RiMenu2Fill } from 'react-icons/ri'
import * as Popover from "@radix-ui/react-popover";
import { IoPersonCircle } from 'react-icons/io5';

type HeaderProps = {
    toggleSidebar: () => void;
  };

const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
        <div className='px-5 py-4 lg:px-5 lg:pl-3'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start rtl:justify-end'>
                    <button className='inline-flex items-center p-2 text-sm text-gray-700 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200' onClick={toggleSidebar}>
                        <RiMenu2Fill className="h-7 w-6" />
                    </button>
                    <a href="#" className='flex ms-3 md:me-24'>
                        <Image
                            src="/images/Logo.svg"
                            alt="Landscape picture"
                            width={150}
                            height={150}
                        />
                    </a>
                </div>

                <Popover.Root>
                    <Popover.Trigger asChild>
                        <IoPersonCircle className="h-9 w-8 cursor-pointer" />
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content
                        sideOffset={8}
                        align="end"
                        className="max-w-xs p-3 rounded-lg shadow-lg border z-50 bg-white break-words"
                        >
                            <p className="font-bold text-sm">Christine</p>
                            <p className="text-xs text-gray-600 break-words">
                                christine@example.com
                            </p>
                            <Popover.Arrow className="fill-blue" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

            </div>
        </div>
    </nav>
  )
}

export default Header
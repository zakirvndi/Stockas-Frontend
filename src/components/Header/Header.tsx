import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { RiMenu2Fill } from 'react-icons/ri'
import * as Popover from "@radix-ui/react-popover";
import { IoPersonCircle } from 'react-icons/io5';
import { fetchUserProfile } from '@/app/lib/api';

interface UserProfile {
  name: string;
  email: string;
}

type HeaderProps = {
  toggleSidebar: () => void;
};

const Header = ({ toggleSidebar }: HeaderProps) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
      return null;
    });
  
    const [loading, setLoading] = useState(!userProfile);
  
    useEffect(() => {
      if (userProfile) return;
  
      const loadProfile = async () => {
        try {
          const profile = await fetchUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Profile fetch error:', error);
          setUserProfile({ name: 'User', email: '' });
        } finally {
          setLoading(false);
        }
      };
  
      loadProfile();
    }, [userProfile]);

  const getFirstName = (fullName: string | undefined) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };

  return (
    <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200'>
      <div className='px-5 py-4 lg:px-5 lg:pl-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start rtl:justify-end'>
            <button 
              className='inline-flex items-center p-2 text-sm text-gray-700 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200' 
              onClick={toggleSidebar}
            >
              <RiMenu2Fill className="h-7 w-6" />
            </button>
            <a href="#" className='flex ms-3 md:me-24'>
              <Image
                src="/images/Logo.svg"
                alt="Company Logo"
                width={150}
                height={150}
              />
            </a>
          </div>

          <Popover.Root>
            <Popover.Trigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <IoPersonCircle className="h-9 w-8" />
                {loading ? (
                  <div className="hidden md:block">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <span className="hidden md:block font-medium text-gray-700 text-sm">
                    {getFirstName(userProfile?.name)}
                  </span>
                )}
              </div>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={8}
                align="end"
                className="max-w-xs p-3 rounded-lg shadow-lg border z-50 bg-white break-words"
              >
                {loading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-sm text-black">{userProfile?.name || 'User'}</p>
                    <p className="text-xs text-gray-600 break-words">
                      {userProfile?.email || 'No email available'}
                    </p>
                  </>
                )}
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
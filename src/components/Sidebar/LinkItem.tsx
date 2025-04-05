import React from 'react'
import { IconType } from "react-icons";

export type LinkItemProps = {
  href: string;
  icon: IconType;
  text: string;
  active?: boolean;
};

const LinkItem = ({ href, icon:Icon, text, active}: LinkItemProps) => {
  return (
    <li className='mb-4'>
        <a href={href} className={`flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 ${
          active ? 'bg-[#0040FF] text-white' : 'text-gray-500'
        }`}>
            <Icon className="mr-2 h-7 w-8" />
            <span className='flex-1 me-3'>{text}</span>
        </a>
    </li>
  )
}

export default LinkItem
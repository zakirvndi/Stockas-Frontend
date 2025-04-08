import React from 'react';
import { IconType } from "react-icons";

export type LinkItemProps = {
  href: string;
  icon: IconType;
  text: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

const LinkItem = ({ href, icon: Icon, text, active, onClick }: LinkItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <li className='mb-4'>

      <a 
        href={href} 
        onClick={handleClick}
        className={`flex items-center p-2 rounded-lg hover:bg-gray-100 ${
          active ? 'bg-[#0040FF] text-white' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        <Icon className="mr-2 h-7 w-8" />
        <span className='flex-1 me-3'>{text}</span>
      </a>
    </li>
  );
};

export default LinkItem;
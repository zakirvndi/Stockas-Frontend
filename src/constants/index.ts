import { logoutUser } from "@/app/lib/api";
import { IconType } from "react-icons";
import { BiSolidDoorOpen } from "react-icons/bi";
import { FaBoxArchive } from "react-icons/fa6";
import { PiNewspaperFill } from "react-icons/pi";
import { RiHome4Fill } from "react-icons/ri";
import { toast } from "react-toastify";

export interface NavLink {
  href: string;
  icon: IconType;
  text: string;
  onClick?: (e: React.MouseEvent) => Promise<void> | void;
}

export const mainLinks: NavLink[] = [
  {
    href: "/dashboard",
    icon: RiHome4Fill,
    text: "Dashboard",
  },
  {
    href: "/transaction",
    icon: PiNewspaperFill,
    text: "Transactions",
  },
  {
    href: "/product",
    icon: FaBoxArchive,
    text: "Products",
  },
];

export const signOutLink: NavLink = {
  href: "#",
  icon: BiSolidDoorOpen,
  text: "Sign Out",
  onClick: async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logoutUser();
      window.location.href = '/login';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      toast.error(`Logout failed: ${errorMessage}`);
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  }
};
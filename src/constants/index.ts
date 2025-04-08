import { IconType } from "react-icons";
import { BiSolidDoorOpen } from "react-icons/bi";
import { FaBoxArchive } from "react-icons/fa6";
import { PiNewspaperFill } from "react-icons/pi";
import { RiHome4Fill } from "react-icons/ri";

export interface NavLink {
  href: string;
  icon: IconType;
  text: string;
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
        text: "Sign Out"
};
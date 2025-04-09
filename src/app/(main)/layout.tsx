'use client'

import "../globals.css";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <>
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 ml-0 sm:ml-60 p-10 py-20 pl-8 bg-white min-h-screen">
            {children}
          </main>
        </div>
    </>
  );
}
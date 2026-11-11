
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen flex flex-col">

        {/* Navbar */}
        <Navbar
          onMenuClick={() => setIsOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;

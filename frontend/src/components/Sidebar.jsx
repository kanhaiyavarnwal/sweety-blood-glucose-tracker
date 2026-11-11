
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  PlusCircle,
  ChartNoAxesCombined,
  UserRound,
  LogOut,
  HeartPulse,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Readings",
      path: "/readings",
      icon: Activity,
    },
    {
      name: "Add Reading",
      path: "/add-reading",
      icon: PlusCircle,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: ChartNoAxesCombined,
    },
  ];

  const accountItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose?.();
  };

  const renderLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
          }`
        }
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <HeartPulse className="text-white" size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Sweety
              </h1>
              <p className="text-xs text-slate-500">
                Glucose Tracker
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-slate-500"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mb-4">
            Main Menu
          </p>

          <div className="space-y-2">
            {menuItems.map(renderLink)}
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 mt-8 mb-4">
            Account
          </p>

          <div className="space-y-2">
            {accountItems.map(renderLink)}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            Logout
          </button>

          <p className="text-xs text-center text-slate-400 mt-4">
            Sweety © 2026
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


import { Menu, Bell, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/readings": "Glucose Readings",
    "/add-reading": "Add Reading",
    "/reports": "Reports & Analytics",
    "/profile": "My Profile",
  };

  const title = pageTitles[location.pathname] || "Sweety";

  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">
            {title}
          </h2>

          <p className="hidden sm:block text-xs text-slate-500">
            Manage your glucose health records
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-slate-100 text-slate-600"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={21} />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500">
              Member
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserRound className="text-blue-600" size={22} />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;

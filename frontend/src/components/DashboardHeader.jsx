
import { RefreshCw } from "lucide-react";

const DashboardHeader = ({ onRefresh, loading }) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your blood glucose levels.
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 border rounded-lg px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        Refresh
      </button>
    </div>
  );
};

export default DashboardHeader;

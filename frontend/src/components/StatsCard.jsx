
import { Activity } from "lucide-react";

const StatsCard = ({ title, value, unit, icon: Icon = Activity, color }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500 font-medium">
          {title}
        </p>

        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mt-4">
        <h2 className="text-3xl font-bold text-slate-800">
          {value ?? "--"}
        </h2>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
    </div>
  );
};

export default StatsCard;

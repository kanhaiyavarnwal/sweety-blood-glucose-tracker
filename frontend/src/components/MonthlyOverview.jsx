


import {
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

import StatsCard from "./StatsCard";

const MonthlyOverview = ({ report }) => {
  const stats = [
    {
      title: "Monthly Readings",
      value: report?.total ?? 0,
      unit: "readings",
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Monthly Average",
      value: report?.average ?? "--",
      unit: "mg/dL",
      icon: CalendarDays,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Highest Glucose",
      value: report?.highest ?? "--",
      unit: "mg/dL",
      icon: TrendingUp,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Lowest Glucose",
      value: report?.lowest ?? "--",
      unit: "mg/dL",
      icon: TrendingDown,
      color: "bg-green-100 text-green-600",
    },
  ];

  const monthName = report?.month
    ? new Date(report.year, report.month - 1).toLocaleString(
        "en-IN",
        { month: "long", year: "numeric" }
      )
    : "Monthly Report";

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Monthly Overview
        </h2>

        <p className="text-sm text-slate-500">
          Your glucose report for {monthName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default MonthlyOverview;

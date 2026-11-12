

import {
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import StatsCard from "./StatsCard";

const TodayOverview = ({ report }) => {
  const stats = [
    {
      title: "Today's Readings",
      value: report?.total ?? 0,
      unit: "readings",
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Average Glucose",
      value: report?.average ?? "--",
      unit: "mg/dL",
      icon: Activity,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Highest Reading",
      value: report?.highest ?? "--",
      unit: "mg/dL",
      icon: TrendingUp,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Lowest Reading",
      value: report?.lowest ?? "--",
      unit: "mg/dL",
      icon: TrendingDown,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          Today's Overview
        </h2>

        <p className="text-sm text-slate-500">
          Your glucose report for {report?.date }.
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

export default TodayOverview;


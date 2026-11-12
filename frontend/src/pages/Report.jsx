



import { useEffect, useState } from "react";

import {
  CalendarDays,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileText,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import toast from "react-hot-toast";
import api from "../services/api";



const TIMEZONE = "Asia/Kolkata";

const getToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const getCurrentMonth = () => {
  return getToday().slice(0, 7);
};


const formatDate = (dateString) => {
  if (!dateString) return "-";


  if (/^\d{4}-\d{2}-\d{2}$/.test(String(dateString))) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};


const formatChartDate = (dateString) => {
  const formatted = formatDate(dateString);

  return formatted === "-"
    ? "-"
    : formatted.slice(0, 5);
};



const formatSlot = (slot) => {
  const slots = {
    morning: "Morning (Fasting)",
    after_breakfast: "After Breakfast",
    after_lunch: "After Lunch",
    after_dinner: "After Dinner",
  };

  return slots[slot] || slot || "-";
};

const getNumber = (data, keys) => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null) {
      return Number(data[key]);
    }
  }

  return null;
};



export default function Report() {
  const [reportType, setReportType] = useState("daily");

  const [selectedDate, setSelectedDate] = useState(getToday());

  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonth()
  );

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const fetchReport = async () => {
    try {
      setLoading(true);

      let response;

      if (reportType === "daily") {
        response = await api.get("/reports/daily-report", {
          params: {
            date: selectedDate,
          },
        });
      } else {
        const [year, month] = selectedMonth.split("-");

        response = await api.get("/reports/monthly-report", {
          params: {
            month: Number(month),
            year: Number(year),
          },
        });
      }

      const responseData = response.data.report;



      setReport(responseData || null);

    } catch (error) {
      console.error(
        "Report fetch error:",
        error.response?.data || error.message
      );

      setReport(null);

      toast.error(
        error.response?.data?.message ||
        "Unable to fetch report"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, selectedDate, selectedMonth]);

  
  const dailyTotal = getNumber(report, [
    "total",
    "totalReadings",
    "total_readings",
    "count",
  ]);

  const dailyAverage = getNumber(report, [
    "average",
    "avg",
    "average_glucose",
    "avg_glucose",
  ]);

  const dailyHighest = getNumber(report, [
    "highest",
    "max",
    "maximum",
    "max_glucose",
  ]);

  const dailyLowest = getNumber(report, [
    "lowest",
    "min",
    "minimum",
    "min_glucose",
  ]);

  

  const monthlyReports = Array.isArray(report?.dailyReports)
    ? report.dailyReports
    : [];

  const monthlyTotal = monthlyReports.reduce(
    (sum, item) =>
      sum +
      (getNumber(item, [
        "total",
        "totalReadings",
        "count",
      ]) || 0),
    0
  );

  const monthlyAverage = getNumber(report, [
    "average",
    "avg",
    "average_glucose",
    "avg_glucose",
  ]);

  const monthlyHighest = monthlyReports.reduce(
    (max, item) => {
      const value = getNumber(item, [
        "highest",
        "max",
        "max_glucose",
      ]);

      return value === null
        ? max
        : max === null
          ? value
          : Math.max(max, value);
    },
    null
  );

  const monthlyLowest = monthlyReports.reduce(
    (min, item) => {
      const value = getNumber(item, [
        "lowest",
        "min",
        "min_glucose",
      ]);

      return value === null
        ? min
        : min === null
          ? value
          : Math.min(min, value);
    },
    null
  );



  const dailyReadings = Array.isArray(report?.readings)
    ? report.readings
    : Array.isArray(report?.dailyReadings)
      ? report.dailyReadings
      : [];



  const chartData = monthlyReports.map((item) => ({
    date: formatChartDate(
      item.date || item.reading_date
    ),

    average:
      getNumber(item, [
        "average",
        "avg",
        "average_glucose",
      ]) ?? 0,
  }));



  const stats =
    reportType === "daily"
      ? [
          {
            title: "Total Readings",
            value: dailyTotal ?? 0,
            unit: "readings",
            icon: Activity,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Average Glucose",
            value: dailyAverage ?? "--",
            unit: "mg/dL",
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Highest Reading",
            value: dailyHighest ?? "--",
            unit: "mg/dL",
            icon: TrendingUp,
            color: "bg-red-100 text-red-600",
          },
          {
            title: "Lowest Reading",
            value: dailyLowest ?? "--",
            unit: "mg/dL",
            icon: TrendingDown,
            color: "bg-green-100 text-green-600",
          },
        ]
      : [
          {
            title: "Total Readings",
            value: monthlyTotal,
            unit: "readings",
            icon: Activity,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Monthly Average",
            value: monthlyAverage ?? "--",
            unit: "mg/dL",
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Highest Reading",
            value: monthlyHighest ?? "--",
            unit: "mg/dL",
            icon: TrendingUp,
            color: "bg-red-100 text-red-600",
          },
          {
            title: "Lowest Reading",
            value: monthlyLowest ?? "--",
            unit: "mg/dL",
            icon: TrendingDown,
            color: "bg-green-100 text-green-600",
          },
        ];


  return (
    <div className="space-y-6">

  
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analyze your blood glucose history and trends.
        </p>
      </div>

      {/* Report Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" size={22} />

            <h2 className="font-semibold text-gray-800">
              Generate Report
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => setReportType("daily")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                reportType === "daily"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Daily Report
            </button>

            <button
              onClick={() => setReportType("monthly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                reportType === "monthly"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Monthly Report
            </button>

          </div>
        </div>

        {/* Date Filters */}
        <div className="mt-5 flex flex-wrap items-end gap-4">

          {reportType === "daily" ? (
            <div className="w-full sm:w-64">

              <label className="mb-2 block text-sm font-medium text-gray-600">
                Select Date
              </label>

              <input
                type="date"
                value={selectedDate}
                max={getToday()}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-blue-500"
              />

            </div>
          ) : (
            <div className="w-full sm:w-64">

              <label className="mb-2 block text-sm font-medium text-gray-600">
                Select Month
              </label>

              <input
                type="month"
                value={selectedMonth}
                max={getCurrentMonth()}
                onChange={(e) =>
                  setSelectedMonth(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-blue-500"
              />

            </div>
          )}

          <button
            onClick={fetchReport}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />

            Generate
          </button>

        </div>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <RefreshCw
            className="animate-spin text-blue-600"
            size={30}
          />
        </div>
      ) : (
        <>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <div className={`rounded-lg p-3 ${stat.color}`}>
                      <Icon size={20} />
                    </div>

                  </div>

                  <div className="mt-4 flex items-baseline gap-2">

                    <span className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </span>

                    <span className="text-sm text-gray-500">
                      {stat.unit}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

          {/* Monthly Chart */}
          {reportType === "monthly" && (
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

              <h2 className="font-semibold text-gray-800">
                Monthly Glucose Trend
              </h2>

              <p className="mb-5 mt-1 text-sm text-gray-500">
                Daily average glucose readings
              </p>

              {chartData.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-sm text-gray-400">
                  No monthly data available.
                </div>
              ) : (
                <div className="h-72 w-full">

                  <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={chartData}>

                      <CartesianGrid strokeDasharray="3 3" />

                      <XAxis dataKey="date" />

                      <YAxis />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="average"
                        name="Average glucose"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>
              )}

            </div>
          )}

      
          {reportType === "daily" && (
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 p-5">

                <h2 className="font-semibold text-gray-800">
                  Daily Reading Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {formatDate(selectedDate)}
                </p>

              </div>

              {dailyReadings.length === 0 ? (
                <div className="p-10 text-center">

                  <Activity
                    className="mx-auto mb-3 text-gray-300"
                    size={35}
                  />

                  <p className="font-medium text-gray-600">
                    No readings found
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    No glucose entries were recorded for this date.
                  </p>

                </div>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">
                          Date
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Time Slot
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Glucose (mg/dL)
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      {dailyReadings.map((reading) => (
                        <tr key={reading.id}>

                          <td className="px-5 py-4 text-gray-700">
                            {formatDate(
                              reading.reading_date || selectedDate
                            )}
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {formatSlot(reading.time_slot)}
                          </td>

                          <td className="px-5 py-4 font-semibold text-gray-800">
                            {reading.glucose_value} mg/dL
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

          
          {reportType === "monthly" && (
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

              <div className="border-b border-gray-100 p-5">

                <h2 className="font-semibold text-gray-800">
                  Daily Breakdown
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Average, highest, lowest, and total readings per day
                </p>

              </div>

              {monthlyReports.length === 0 ? (
                <p className="p-8 text-center text-sm text-gray-400">
                  No monthly readings found.
                </p>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-left text-sm">

                    <thead className="bg-gray-50 text-gray-500">
                      <tr>

                        <th className="px-5 py-3 font-medium">
                          Date
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Average
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Highest
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Lowest
                        </th>

                        <th className="px-5 py-3 font-medium">
                          Total
                        </th>

                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">

                      {monthlyReports.map((item, index) => (
                        <tr
                          key={item.date || item.reading_date || index}
                        >

                          <td className="px-5 py-4 text-gray-700">
                            {formatDate(
                              item.date || item.reading_date
                            )}
                          </td>

                          <td className="px-5 py-4 font-medium text-gray-800">
                            {getNumber(item, [
                              "average",
                              "avg",
                            ]) ?? "--"}
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {getNumber(item, [
                              "highest",
                              "max",
                            ]) ?? "--"}
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {getNumber(item, [
                              "lowest",
                              "min",
                            ]) ?? "--"}
                          </td>

                          <td className="px-5 py-4 text-gray-700">
                            {getNumber(item, [
                              "total",
                              "count",
                            ]) ?? "--"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

        </>
      )}

    </div>
  );
}

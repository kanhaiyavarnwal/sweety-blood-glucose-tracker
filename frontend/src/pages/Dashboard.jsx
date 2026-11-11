


import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";


import DashboardHeader from "../components/DashboardHeader";
import TodayOverview from "../components/TodayOverview";
import MonthlyOverview from "../components/MonthlyOverview";
import GlucoseChart from "../components/GlucoseChart";
import RecentReadings from "../components/RecentReading"

const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const Dashboard = () => {
  const [todayReport, setTodayReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [recentReadings, setRecentReadings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       const now = new Date();

//       const [daily, monthly, readingsResponse] =
//         await Promise.all([
//           api.get("/reports/daily-report", {
//             params: { date: getToday() },
//           }),

//           api.get("/reports/monthly-report", {
//             params: {
//               month: now.getMonth() + 1,
//               year: now.getFullYear(),
//             },
//           }),

//           api.get("/reading/readings"),
//         ]);
// // console.log("response today: ", daily.data.report);
// console.log("response month: ",  monthly);
// console.log("response month: ",  monthly.data);
// console.log("response month: ",  monthly.data.report);
// // console.log("response readings: ", readingsResponse.data);
//       setTodayReport(daily.data.report);
//       setMonthlyReport(monthly.data.report);

//       const readings = Array.isArray(readingsResponse.data)
//         ? readingsResponse.data
//         : readingsResponse.data.readings || [];

//       setRecentReadings(readings.slice(0, 5));

//       const dailyReports = monthly.data.report || [];
//         // console.log("daily reporst:", dailyReports);
//       setChartData(
//         dailyReports.map((item) => ({
//           date: String(
//             item.reading_date || item.date
//           ).slice(8, 10),

//           average: Number(
//             item.average_glucose ??
//             item.avg_glucose ??
//             item.average ??
//             item.avg ??
//             0
//           ),
//         }))
//       );

//     } catch (error) {
//       console.error("Dashboard error:", error);

//       toast.error(
//         error.response?.data?.message ||
//         "Unable to load dashboard"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };



const fetchDashboardData = async () => {
  try {
    setLoading(true);

    const now = new Date();

    const [daily, monthly, readingsResponse] =
      await Promise.all([
        api.get("/reports/daily-report", {
          params: { date: getToday() },
        }),

        api.get("/reports/monthly-report", {
          params: {
            month: now.getMonth() + 1,
            year: now.getFullYear(),
          },
        }),

        api.get("/reading/readings"),
      ]);

    // Extract report objects
    const todayData = daily.data.report;
    const monthlyData = monthly.data.report;

    // console.log("Today Report:", todayData);
    // console.log("Monthly Report:", monthlyData);

    // Set reports
    setTodayReport(todayData);
    setMonthlyReport(monthlyData);

    // Recent readings
    const readings = Array.isArray(readingsResponse.data)
      ? readingsResponse.data
      : readingsResponse.data.readings || [];
// console.log('readings: ',readings)
    setRecentReadings(readings.slice(0, 4));

    // Monthly chart
    const dailyReports = monthlyData.dailyReports || [];
//  console.log("dailyreports: ",dailyReports)
    const formattedData = dailyReports.map((item) => ({
      date: String(
        item.reading_date || item.date
      ).slice(8, 10),

      average: Number(
        item.average_glucose ??
        item.avg_glucose ??
        item.average ??
        item.avg ??
        0
      ),
    }));

    setChartData(formattedData);

  } catch (error) {
    console.error("Dashboard error:", error);

    toast.error(
      error.response?.data?.message ||
      "Unable to load dashboard"
    );

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader
        onRefresh={fetchDashboardData}
        loading={loading}
      />

      <TodayOverview report={todayReport} />

      <MonthlyOverview report={monthlyReport} />

      <GlucoseChart data={chartData} />

      <RecentReadings readings={recentReadings} />
    </div>
  );
};

export default Dashboard;

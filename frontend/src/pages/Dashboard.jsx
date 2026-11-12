






import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

import DashboardHeader from "../components/DashboardHeader";
import TodayOverview from "../components/TodayOverview";
import MonthlyOverview from "../components/MonthlyOverview";
import GlucoseChart from "../components/GlucoseChart";
import RecentReadings from "../components/RecentReading";



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
    return dateString;
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};



const Dashboard = () => {
  const [todayReport, setTodayReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [recentReadings, setRecentReadings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const today = getToday();
      const [year, month] = getCurrentMonth().split("-");

      const [daily, monthly, readingsResponse] =
        await Promise.all([
          api.get("/reports/daily-report", {
            params: {
              date: today,
            },
          }),

          api.get("/reports/monthly-report", {
            params: {
              month: Number(month),
              year: Number(year),
            },
          }),

          api.get("/reading/readings"),
        ]);

      

      const todayData = daily.data.report;

      setTodayReport(todayData);

   

      const monthlyData = monthly.data.report;

      setMonthlyReport(monthlyData);

  

      const readings = Array.isArray(readingsResponse.data)
        ? readingsResponse.data
        : readingsResponse.data.readings || [];
      
     
      const sortedReadings = [...readings].sort(
        (a, b) =>
          new Date(b.reading_date) -
          new Date(a.reading_date)
      );

      setRecentReadings(sortedReadings.slice(0, 4));

    

      const dailyReports = Array.isArray(
        monthlyData?.dailyReports
      )
        ? monthlyData.dailyReports
        : [];

      const formattedData = dailyReports.map((item) => {
        console.log(item.date)
        const date = formatDate(
           item.date
        );

        return {
          date: date !== "-" ? date.slice(8, 10) : "-",

          average: Number(
            item.average_glucose ??
            item.avg_glucose ??
            item.average ??
            item.avg ??
            0
          ),
        };
      });

      setChartData(formattedData);

    } catch (error) {
      console.error(
        "Dashboard error:",
        error.response?.data || error.message
      );

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
        <RefreshCw
          className="animate-spin text-blue-600"
          size={30}
        />
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

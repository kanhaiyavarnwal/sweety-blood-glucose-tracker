
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const GlucoseChart = ({ data }) => {
    // console.log("data  glucose: ",data)
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-lg text-slate-800">
        Monthly Glucose Trend
      </h2>

      <p className="text-sm text-slate-500 mb-6">
        Daily average glucose readings
      </p>

      {data.length === 0 ? (
        <p className="h-64 flex justify-center items-center text-slate-400">
          No glucose data available.
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="average"
                stroke="#2563eb"
                strokeWidth={3}
                name="Average glucose"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GlucoseChart;

const RecentReadings = ({ readings = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSlot = (slot) => {
    const labels = {
      morning: "Morning (Fasting)",
      after_breakfast: "After Breakfast",
      after_lunch: "After Lunch",
      after_dinner: "After Dinner",
    };

    return labels[slot];
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="font-semibold text-lg">Recent Readings</h2>

        <p className="text-sm text-slate-500">Your latest glucose entries</p>
      </div>

      {readings.length === 0 ? (
        <p className="p-8 text-center text-slate-400">No readings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Glucose (mg/dL)</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {readings.map((reading) => (
                <tr key={reading.id}>
                  <td className="p-4">{formatDate(reading.reading_date)}</td>

                  <td className="p-4">{formatSlot(reading.time_slot)}</td>

                  <td className="p-4 font-semibold">{reading.glucose_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentReadings;

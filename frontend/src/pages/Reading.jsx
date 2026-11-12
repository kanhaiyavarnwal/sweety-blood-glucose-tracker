import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  Activity,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const timeSlots = [
  { value: "morning", label: "Morning (Fasting)" },
  { value: "after_breakfast", label: "After Breakfast" },
  { value: "after_lunch", label: "After Lunch" },
  { value: "after_dinner", label: "After Dinner" },
];

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const getInputDate = (date) => {
  if (!date) return "";

  const dateString = String(date);

 
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const formatDate = (date) => {
  const formattedDate = getInputDate(date);

  if (!formattedDate) return "-";

  const [year, month, day] = formattedDate.split("-");

  return `${day}-${month}-${year}`;
};

const Reading = () => {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingReading, setEditingReading] = useState(null);

  const [editData, setEditData] = useState({
    reading_date: "",
    time_slot: "",
    glucose_value: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

 
  const fetchReadings = useCallback(async (date = "") => {
    try {
      setLoading(true);

      const response = await api.get("/reading/readings", {
        params: date ? { date } : {},
      });

      setReadings(response.data.readings || []);
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch readings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReadings(filterDate);
  }, [filterDate, fetchReadings]);

  // Get time slot label
  const getSlotLabel = (slot) => {
    return (
      timeSlots.find((item) => item.value === slot)?.label ||
      slot
    );
  };

  
  const handleEdit = (reading) => {
    setEditingReading(reading.id);

    setEditData({
      reading_date: getInputDate(reading.reading_date),
      time_slot: reading.time_slot,
      glucose_value: String(reading.glucose_value),
    });
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const closeModal = () => {
    if (saving) return;

    setEditingReading(null);

    setEditData({
      reading_date: "",
      time_slot: "",
      glucose_value: "",
    });
  };

 
  const handleUpdate = async (e) => {
    e.preventDefault();

    const value = Number(editData.glucose_value);

    if (
      !editData.reading_date ||
      !editData.time_slot ||
      !Number.isInteger(value) ||
      value < 40 ||
      value > 600
    ) {
      toast.error("Please enter valid reading details.");
      return;
    }

    if (editData.reading_date > getToday()) {
      toast.error("Date cannot be in the future.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        reading_date: editData.reading_date,
        time_slot: editData.time_slot,
        glucose_value: value,
      };

      const response = await api.put(
        `/reading/readings/${editingReading}`,
        payload
      );
      // in some cases here need to add validation 

      toast.success(
        response.data.message ||
          "Reading updated successfully."
      );

      setEditingReading(null);

      await fetchReadings(filterDate);
    } catch (error) {
      console.error("Update error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update reading."
      );
    } finally {
      setSaving(false);
    }
  };

  
  const handleDelete = async (id) => {
    if (deletingId !== null) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this reading?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/reading/readings/${id}`);

      setReadings((prev) =>
        prev.filter(
          (reading) => String(reading.id) !== String(id)
        )
      );

      toast.success("Reading deleted successfully.");
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete reading."
      );
    } finally {
      setDeletingId(null);
    }
  };


  const filteredReadings = readings.filter((reading) =>
    getSlotLabel(reading.time_slot)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Statistics
  const values = readings.map((reading) =>
    Number(reading.glucose_value)
  ).filter(Number.isFinite);

  const highestReading = values.length
    ? Math.max(...values)
    : "--";

  const lowestReading = values.length
    ? Math.min(...values)
    : "--";

  return (
    <div className="space-y-6">

  
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Glucose Readings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            View and manage your blood glucose history.
          </p>
        </div>

        <button
          onClick={() => fetchReadings(filterDate)}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

   
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Total Readings
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {readings.length}
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Highest Reading
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {highestReading}
            {values.length > 0 && (
              <span className="text-sm font-normal text-slate-500 ml-1">
                mg/dL
              </span>
            )}
          </h2>
        </div>

        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Lowest Reading
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {lowestReading}
            {values.length > 0 && (
              <span className="text-sm font-normal text-slate-500 ml-1">
                mg/dL
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-2xl p-5">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-semibold mb-2">
              Filter by date
            </label>

            <input
              type="date"
              value={filterDate}
              max={getToday()}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Search time slot
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reading..."
                className="w-full border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

        </div>

        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="text-sm text-blue-600 mt-4 hover:underline"
          >
            Clear date filter
          </button>
        )}
      </div>

    
      <div className="bg-white border rounded-2xl overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-lg font-bold">
            Reading History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredReadings.length} readings found
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading readings...
          </div>
        ) : filteredReadings.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center px-4">
            <Activity
              size={42}
              className="text-slate-300 mb-3"
            />

            <h3 className="font-semibold text-slate-700">
              No readings found
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Add a glucose reading to see your history here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left min-w-[650px]">

              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time Slot</th>
                  <th className="px-6 py-4">Glucose Value</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredReadings.map((reading) => (
                  <tr
                    key={reading.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatDate(reading.reading_date)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {getSlotLabel(reading.time_slot)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">
                        {reading.glucose_value}
                      </span>

                      <span className="text-xs text-slate-500 ml-1">
                        mg/dL
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => handleEdit(reading)}
                          title="Edit reading"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(reading.id)}
                          disabled={deletingId === reading.id}
                          title="Delete reading"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deletingId === reading.id ? (
                            <RefreshCw
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}
      </div>

   
      {editingReading !== null && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Edit Glucose Reading
              </h2>

              <button
                onClick={closeModal}
                disabled={saving}
                aria-label="Close edit form"
                className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleUpdate}
              className="space-y-5"
            >

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Reading Date
                </label>

                <input
                  type="date"
                  name="reading_date"
                  value={editData.reading_date}
                  max={getToday()}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Time Slot
                </label>

                <select
                  name="time_slot"
                  value={editData.time_slot}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {timeSlots.map((slot) => (
                    <option
                      key={slot.value}
                      value={slot.value}
                    >
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Glucose Value (mg/dL)
                </label>

                <input
                  type="number"
                  name="glucose_value"
                  min="40"
                  max="600"
                  step="1"
                  value={editData.glucose_value}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  disabled={saving}
                  onClick={closeModal}
                  className="w-1/2 border rounded-xl py-3 font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Reading"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reading;


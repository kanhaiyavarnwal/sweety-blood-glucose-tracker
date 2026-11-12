


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Activity, CalendarDays, Clock } from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const getToday = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const AddReading = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    reading_date: getToday(),
    time_slot: "",
    glucose_value: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const timeSlots = [
    { value: "morning", label: "Morning (Fasting)" },
    { value: "after_breakfast", label: "After Breakfast" },
    { value: "after_lunch", label: "After Lunch" },
    { value: "after_dinner", label: "After Dinner" },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

 
  const validateForm = () => {
    const newErrors = {};

    if (!formData.reading_date) {
      newErrors.reading_date = "Please select a date.";
    } else if (formData.reading_date > getToday()) {
      newErrors.reading_date = "Date cannot be in the future.";
    }

    if (!formData.time_slot) {
      newErrors.time_slot = "Please select a time slot.";
    }

    if (
      formData.glucose_value === "" ||
      formData.glucose_value === null
    ) {
      newErrors.glucose_value = "Please enter a glucose value.";
    } else {
      const value = Number(formData.glucose_value);

      if (!Number.isInteger(value) || value < 40 || value > 600) {
        newErrors.glucose_value =
          "Value must be a whole number between 40 and 600 mg/dL.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
  e.preventDefault();
     
  if (!validateForm()) {
    return;
  }

  try {
    setLoading(true);

    const payload = {
      reading_date: formData.reading_date,
      time_slot: formData.time_slot,
      glucose_value: Number(formData.glucose_value),
    };

    

    const response = await api.post(
      `/reading/add-reading`,
      payload
    );

    toast.success(
      response.data.message || "Reading added successfully!"
    );

    navigate("/readings");

  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Unable to add glucose reading.";

    console.error("Error adding reading:", message);
    toast.error(message);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto space-y-6">

    
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-lg border hover:bg-slate-100"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Add Glucose Reading
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Record your blood glucose measurement.
          </p>
        </div>
      </div>

    
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Activity className="text-blue-600" size={25} />
          </div>

          <div>
            <h2 className="font-semibold text-lg">
              Reading Details
            </h2>

            <p className="text-sm text-slate-500">
              Enter your glucose information below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          
          <div>
            <label
              htmlFor="reading_date"
              className="block text-sm font-semibold mb-2 text-slate-700"
            >
              Reading Date
            </label>

            <div className="relative">
              <CalendarDays
                size={19}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                id="reading_date"
                type="date"
                name="reading_date"
                value={formData.reading_date}
                onChange={handleChange}
                max={getToday()}
                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errors.reading_date && (
              <p className="text-red-500 text-sm mt-2">
                {errors.reading_date}
              </p>
            )}
          </div>

        
          <div>
            <label
              htmlFor="time_slot"
              className="block text-sm font-semibold mb-2 text-slate-700"
            >
              Time Slot
            </label>

            <div className="relative">
              <Clock
                size={19}
                className="absolute left-3 top-3 text-slate-400"
              />

              <select
                id="time_slot"
                name="time_slot"
                value={formData.time_slot}
                onChange={handleChange}
                className="w-full appearance-none border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select time slot</option>

                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {errors.time_slot && (
              <p className="text-red-500 text-sm mt-2">
                {errors.time_slot}
              </p>
            )}
          </div>

        
          <div>
            <label
              htmlFor="glucose_value"
              className="block text-sm font-semibold mb-2 text-slate-700"
            >
              Blood Glucose Value
            </label>

            <div className="relative">
              <input
                id="glucose_value"
                type="number"
                name="glucose_value"
                value={formData.glucose_value}
                onChange={handleChange}
                min="40"
                max="600"
                step="1"
                placeholder="Enter glucose value"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 pr-20 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <span className="absolute right-4 top-3 text-sm text-slate-500">
                mg/dL
              </span>
            </div>

            {errors.glucose_value && (
              <p className="text-red-500 text-sm mt-2">
                {errors.glucose_value}
              </p>
            )}

            <p className="text-xs text-slate-400 mt-2">
              Enter a whole number between 40 and 600.
            </p>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/readings")}
              className="w-full sm:w-1/2 border border-slate-300 text-slate-700 rounded-xl py-3 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-1/2 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Reading"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddReading;




import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);


  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Name is required");
    }

    try {
      setSavingProfile(true);

      const response = await api.put("/profile/update-profile", {
        name: name.trim(),
      });
     
      updateUser(response.data.user);

      toast.success(
        response.data.message || "Profile updated successfully"
      );
    } catch (error) {
      console.log("error: ",error.message)
      toast.error(
        error.response?.data?.message || "Profile update failed"
      );
    } finally {
      setSavingProfile(false);
    }
  };


  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill in all password fields");
    }

    if (newPassword.length < 8) {
      return toast.error("Password must contain at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    if (currentPassword === newPassword) {
      return toast.error("New password must be different");
    }

    try {
      setSavingPassword(true);

      const response = await api.put("/profile/change-password", {
        currentPassword,
        newPassword,
      });
    // console.log("change pass: ",response)
      toast.success(
        response.data.message || "Password changed successfully"
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      logout();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password change failed"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and security.
        </p>
      </div>

      
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <User size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">
              Account Information
            </h2>
            <p className="text-sm text-gray-500">
              Update your personal details.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Email Address
            </label>

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
              <Mail size={18} className="text-gray-400" />
              <span className="truncate text-sm text-gray-600">
                {user?.email }
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Email address cannot be changed here.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Account ID
            </label>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-600">
              {user?.id ?? "--"}
            </div>
          </div>

        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={100}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {savingProfile ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}

            {savingProfile ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>

  
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <Lock size={24} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">
              Change Password
            </h2>
            <p className="text-sm text-gray-500">
              Use a strong password to protect your account.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">

        
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

         
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Minimum 8 characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60"
          >
            {savingPassword ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}

            {savingPassword ? "Updating..." : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Profile;

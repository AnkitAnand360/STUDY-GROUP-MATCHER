import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // Notifications state (sync with localStorage)
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notificationSettings");
    return saved
      ? JSON.parse(saved)
      : { email: true, push: true, digest: false };
  });

  useEffect(() => {
    localStorage.setItem(
      "notificationSettings",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPwdLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        {
          headers: { Authorization: token },
        }
      );
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto mt-10 p-5 text-left"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-650 dark:text-gray-400">
          Manage your account password, system preferences, and notification options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: General & Theme Settings */}
        <div className="space-y-6">
          {/* Theme card */}
          <Card hoverable={false}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <p className="text-sm text-gray-550 dark:text-gray-400 mb-6">
              Customize the look and feel of your SaaS dashboard layout.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (theme === "dark") toggleTheme();
                }}
                className={`flex-1 p-4 rounded-2xl border text-center font-bold cursor-pointer transition-colors ${
                  theme === "light"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-305"
                    : "border-gray-250 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850"
                }`}
              >
                ☀️ Light Mode
              </button>
              <button
                onClick={() => {
                  if (theme === "light") toggleTheme();
                }}
                className={`flex-1 p-4 rounded-2xl border text-center font-bold cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-305"
                    : "border-gray-250 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-850"
                }`}
              >
                🌙 Dark Mode
              </button>
            </div>
          </Card>

          {/* Notifications card */}
          <Card hoverable={false}>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>
            <p className="text-sm text-gray-550 dark:text-gray-400 mb-6">
              Toggle how and when you receive matching updates and study group invitations.
            </p>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-250">
                    Email Matches
                  </p>
                  <p className="text-xs text-gray-500">
                    Receive daily suggestions for study group partners.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => toggleNotification("email")}
                  className="w-5 h-5 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-250">
                    In-App Push Messages
                  </p>
                  <p className="text-xs text-gray-500">
                    Notify about real-time typing and study group message updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => toggleNotification("push")}
                  className="w-5 h-5 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1">
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-250">
                    Weekly Digests
                  </p>
                  <p className="text-xs text-gray-500">
                    A summary report of study plan completion rates and progress.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.digest}
                  onChange={() => toggleNotification("digest")}
                  className="w-5 h-5 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Right Side: Change Password Form */}
        <Card hoverable={false}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Security Settings
          </h3>
          <p className="text-sm text-gray-550 dark:text-gray-400 mb-6">
            Ensure your account password remains secure.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 p-3.5 rounded-xl text-sm font-semibold">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 p-3.5 rounded-xl text-sm font-semibold">
                {passwordSuccess}
              </div>
            )}

            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={pwdLoading}
              className="w-full mt-2"
            >
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  );
}

export default Settings;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Save, User, Settings, Bell, DollarSign, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { userAPI } from "../utils/api";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userData, setUserData] = useState({
    id: 0,
    email: "",
    username: "",
    firstName: "",
    lastName: "",
  });

  const [profileData, setProfileData] = useState({
    startDate: null as Date | null,
    savedMoney: 0,
  });

  const [notifications, setNotifications] = useState(
    localStorage.getItem("userNotifications") === "true" || false
  );

  const [emailEditMode, setEmailEditMode] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Load profile data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [userResponse, profileResponse] = await Promise.all([
          userAPI.getProfile(), 
          userAPI.getProfile(), // Using getProfile for both since getStats doesn't exist in API
        ]);

        setUserData({
          id: userResponse.id,
          email: userResponse.email,
          username: userResponse.username,
          firstName: userResponse.first_name,
          lastName: userResponse.last_name,
        });

        setNewEmail(userResponse.email);

        setProfileData({
          startDate: profileResponse.start_date
            ? new Date(profileResponse.start_date)
            : null,
          savedMoney: profileResponse.saved_money || 0,
        });

        setNotifications(localStorage.getItem("userNotifications") === "true");
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = () => {
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setEmailEditMode(false);
    setUserData(prev => ({ ...prev, email: newEmail }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validation
    if (!passwordData.oldPassword) {
      setPasswordError("Current password is required");
      return;
    }
    
    if (!passwordData.newPassword) {
      setPasswordError("New password is required");
      return;
    }
    
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }
    
    try {
      setLoading(true);
      
      await userAPI.changePassword({
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      });
      
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordSection(false);
      
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (passwordError) {
      setPasswordError("");
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Prepare data for backend
      const updates = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        start_date: profileData.startDate?.toISOString(),
        saved_money: profileData.savedMoney,
      };

      // Update user data
      await userAPI.updateProfile({
        start_date: profileData.startDate?.toISOString(),
        saved_money: profileData.savedMoney,
      });

      // Save notifications preference locally
      localStorage.setItem("userNotifications", notifications.toString());

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "savedMoney" ? parseFloat(value) : value,
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Your Profile
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {passwordSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {passwordSuccess}
        </div>
      )}

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Card */}
        <motion.div className="md:col-span-1" variants={itemVariants}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-4">
                <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {userData.firstName} {userData.lastName}
              </h2>

              <p className="text-slate-600 dark:text-slate-400">
                @{userData.username}
              </p>

              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {userData.email}
              </p>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Sobriety Date
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {profileData.startDate
                      ? format(profileData.startDate, "MMMM d, yyyy")
                      : "Not set"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Money Saved
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 flex items-center">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {profileData.savedMoney.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Form */}
        <motion.div className="md:col-span-2" variants={itemVariants}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center mb-6">
              <Settings className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              Account Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={userData.firstName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={userData.lastName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email
                </label>
                {emailEditMode ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                      <input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleEmailChange}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmailEditMode(false);
                          setEmailError("");
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-slate-600 rounded-md text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                    <input
                      id="email"
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-600 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setEmailEditMode(true)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 dark:text-blue-400 text-sm"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Sobriety Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={
                      profileData.startDate?.toISOString().split("T")[0] || ""
                    }
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        startDate: e.target.value
                          ? new Date(e.target.value)
                          : null,
                      }))
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="savedMoney"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Money Saved ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                  <input
                    id="savedMoney"
                    name="savedMoney"
                    type="number"
                    step="0.01"
                    min="0"
                    value={profileData.savedMoney}
                    onChange={handleProfileChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </div>

              {showPasswordSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border border-gray-200 dark:border-slate-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-700/50"
                >
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Change Password
                  </h3>
                  
                  {passwordError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                      {passwordError}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label
                        htmlFor="oldPassword"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                        <input
                          id="oldPassword"
                          name="oldPassword"
                          type={showPasswords.old ? "text" : "password"}
                          value={passwordData.oldPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('old')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordSection(false);
                          setPasswordData({
                            oldPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordError("");
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ${
                          loading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Changing...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-1.5" />
                            Change Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* <div className="flex items-center">
                <input
                  id="notifications"
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <label
                  htmlFor="notifications"
                  className="ml-2 block text-sm text-slate-700 dark:text-slate-300"
                >
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-1.5 text-blue-600 dark:text-blue-400" />
                    Enable notifications
                  </div>
                </label>
              </div> */}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

/**
 * UpdatePasswordForm
 * Self-contained form for updating password, with show/hide toggles and validation.
 */
const UpdatePasswordForm = () => {
  // Local state for password fields and visibility
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Feedback
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Handle form change
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Validation and submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!form.newPassword) newErrors.newPassword = "New password is required";
    if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess("");
      return;
    }
    // "Success." Real app: send API request here.
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
    setSuccess("Password updated successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Password</h2>
      {success && (
        <div className="mb-4 flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-800">{success}</span>
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.currentPassword ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="current-password"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((vis) => !vis)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label={showCurrent ? "Hide" : "Show"}
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="new-password"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNew((vis) => !vis)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label={showNew ? "Hide" : "Show"}
              tabIndex={-1}
            >
              {showNew ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              autoComplete="new-password"
              placeholder="Re-type new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((vis) => !vis)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              aria-label={showConfirm ? "Hide" : "Show"}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition flex items-center"
        >
          <Lock className="w-4 h-4 mr-2" />
          Update Password
        </button>
      </form>
    </div>
  );
};

export default UpdatePasswordForm;

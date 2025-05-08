"use client";

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

function ResetPassword() {
  const params = useParams();
  const token = params.token;

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await axios.post(
        `https://backend-taskmanagement-k0md.onrender.com/api/auth/resetpassword/${token}`,
        { newPassword }
      );
      console.log(res);
      setSuccessMessage("Password reset successful! You can now login.");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-900 min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleReset}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl text-gray-200 font-bold mb-6 text-center">
          Reset Password
        </h2>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
          className="w-full p-3 rounded-md border border-gray-600 bg-gray-700 placeholder-gray-400 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-md font-semibold ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white transition`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {error && (
          <div className="text-red-400 mt-4 text-center text-sm">{error}</div>
        )}

        {successMessage && (
          <div className="text-green-400 mt-4 text-center text-sm">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  );
}

export default ResetPassword;

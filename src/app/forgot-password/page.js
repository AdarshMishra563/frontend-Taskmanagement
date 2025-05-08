"use client";
import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);
    try {
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/forgotpassword", { email });
      setMessage(res.data.message || "Reset link sent successfully!");
    } catch (err) {
      console.log(err);
      setIsError(true);
      setMessage(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-700 to-gray-800 w-full pl-2 pt-4 h-[100vh]">
      <form onSubmit={handleForgot}>
        <h2 className="text-gray-300 text-2xl">Forgot Password</h2>
        <input
          type="email"
          className="border border-gray-300 placeholder-gray-300 h-10 rounded-md p-2 mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button
          className="border border-white bg-gray-600 text-gray-300 p-1 rounded-md ml-4"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && (
        <div
          className={`pt-4 pl-1 text-xl ${
            isError ? "text-red-400" : "text-green-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;

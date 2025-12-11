import { useState } from "react";
import api from "../api/adminApi";
import { toast } from "react-toastify";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      toast.error("Email and password are required.");
      return setLoading(false);
    }

    try {
      const res = await api.post("/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Login successful");
        onLogin();
      }

    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message;

      if (code === "ADMIN_NOT_FOUND") {
        toast.error("Admin account not found");
      } 
      else if (code === "INVALID_PASSWORD") {
        toast.error("Incorrect password");
      }
      else if (code === "ACCOUNT_LOCKED") {
        toast.error("Too many failed attempts. Try later.");
      }
      else {
        toast.error(msg || "Invalid email or password");
      }
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-xl w-full max-w-sm space-y-5 border border-zinc-700 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>

        {/* Email */}
        <div>
          <label className="text-sm mb-1 block text-zinc-400">Email</label>
          <input
            className="w-full px-3 py-2 bg-zinc-800 rounded outline-none border border-zinc-700 focus:border-blue-600 transition"
            placeholder="Enter your admin email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm mb-1 block text-zinc-400">Password</label>
          <input
            className="w-full px-3 py-2 bg-zinc-800 rounded outline-none border border-zinc-700 focus:border-blue-600 transition"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium transition ${
            loading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

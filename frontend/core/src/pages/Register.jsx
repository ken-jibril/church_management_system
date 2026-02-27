import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Mail, Lock, User, Phone, AlertCircle } from "lucide-react";

/**
 * Registration form.
 * The "role" field is visible to the user but locked to "member".
 * Privileged roles (admin, pastor, elder, etc.) can only be assigned
 * by an administrator via the User Management page after registration.
 */
export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "member", // always "member" on self-registration
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await registerUser(formData);
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Registration failed. Please check your details and try again.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-900/50">
              <UserPlus size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-indigo-300 text-sm mt-1">
              Join Covenant Cloud Church
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400"
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400"
                />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
                />
              </div>
            </div>

            {/* Role info */}
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-3">
              <p className="text-xs text-indigo-300">
                <strong>Note:</strong> You will be registered as a{" "}
                <span className="text-white font-medium">Member</span>. Contact
                an administrator to request a different role.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">
                <AlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-900/50 text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-indigo-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-indigo-500 mt-6">
          © {new Date().getFullYear()} Covenant Cloud. All rights reserved.
        </p>
      </div>
    </div>
  );
}

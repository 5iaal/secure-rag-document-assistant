import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Mail, Lock, Check, X, Loader2 } from "lucide-react";
import { registerUser, loginUser } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const strength =
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)
      ? "strong"
      : pwd.length > 5
      ? "medium"
      : "weak";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (pwd.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(fullName, email, pwd);

      setSuccess("Account created successfully. Logging you in...");

      const loginData = await loginUser(email, pwd);

      if (loginData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-900">
      <div className="w-full max-w-md glass p-8">
        <div className="flex justify-center mb-4">
          <Shield className="w-10 h-10 text-cyber-cyan" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              className="input-field pl-9"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
            <input
              type="email"
              className="input-field pl-9"
              placeholder="Work Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                type="password"
                className="input-field pl-9"
                placeholder="Password"
                required
              />
            </div>

            <div className="mt-2 h-1.5 w-full bg-navy-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  strength === "strong"
                    ? "bg-green-500 w-full"
                    : strength === "medium"
                    ? "bg-cyber-amber w-2/3"
                    : "bg-red-500 w-1/3"
                }`}
              ></div>
            </div>

            <div className="mt-1 flex gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                {pwd.length >= 8 ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-red-500" />
                )}
                8+ chars
              </span>

              <span className="flex items-center gap-1">
                {/[A-Z]/.test(pwd) ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-red-500" />
                )}
                Uppercase
              </span>

              <span className="flex items-center gap-1">
                {/\d/.test(pwd) ? (
                  <Check size={12} className="text-green-500" />
                ) : (
                  <X size={12} className="text-red-500" />
                )}
                Number
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating Account..." : "Create Secure Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-cyber-cyan hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
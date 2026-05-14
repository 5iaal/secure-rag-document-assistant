import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, Mail, Github, Chrome, Loader2 } from "lucide-react";
import { loginUser } from "../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@secure-rag.com");
  const [password, setPassword] = useState("Admin12345");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyber-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-blue/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md glass p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center shadow-glow">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Secure RAG Document Assistant
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                className="input-field pl-9"
                placeholder="admin@secure-rag.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                className="input-field pl-9"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" className="accent-cyber-cyan" /> Remember me
            </label>
            <a href="#" className="text-cyber-cyan hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-navy-800/80 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="btn-secondary flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
              <Github size={18} /> GitHub
            </button>
            <button className="btn-secondary flex items-center justify-center gap-2 opacity-60 cursor-not-allowed">
              <Chrome size={18} /> Google
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyber-cyan hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { logoutUser } from "../../api/auth";

export default function TopNav({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathParts = location.pathname.split("/").filter(Boolean);
  const breadcrumb = pathParts.map((p, i) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    path: `/${pathParts.slice(0, i + 1).join("/")}`,
  }));

  if (breadcrumb.length === 0) breadcrumb.push({ label: "Home", path: "/" });

  const [profileOpen, setProfileOpen] = useState(false);

  const role = localStorage.getItem("user_role") || "user";
  const email = role === "admin" ? "admin@secure-rag.com" : "user@secure-rag.com";

  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <Menu size={20} />
          </button>

          <nav className="hidden sm:flex items-center text-sm text-gray-500">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center">
                <Link to={b.path} className="hover:text-cyber-cyan transition">
                  {b.label}
                </Link>
                {i < breadcrumb.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search system..."
              className="input-field pl-9 w-64 text-sm bg-navy-900/50"
            />
          </div>

          <button className="relative p-2 text-gray-400 hover:text-white transition">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-white/5 transition"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-cyan to-cyber-blue flex items-center justify-center text-white font-bold">
                {role === "admin" ? "A" : "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {role === "admin" ? "Admin" : "User"}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 glass p-2 z-50">
                <div className="px-3 py-2 border-b border-white/10 mb-2">
                  <p className="text-sm font-medium">{email}</p>
                  <p className="text-xs text-gray-400">Role: {role}</p>
                </div>

                <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded">
                  Profile
                </button>

                <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded">
                  API Keys
                </button>

                <div className="border-t border-white/10 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
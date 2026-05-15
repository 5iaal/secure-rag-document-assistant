import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    const userId = searchParams.get("user_id");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    sessionStorage.setItem("access_token", token);
    sessionStorage.setItem("user_role", role || "user");
    sessionStorage.setItem("user_id", userId || "");

    if (role === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 text-gray-300">
      <div className="glass p-8 flex items-center gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-cyber-cyan" />
        Completing OAuth login...
      </div>
    </div>
  );
}
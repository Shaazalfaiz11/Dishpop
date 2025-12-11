import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { api } from "../services/api";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking");
  const location = useLocation();
  const { username } = useParams();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        // 🔥 Cookie-based auth → DON'T check token manually
        // httpOnly cookies cannot be read by JS

        // Validate session directly from backend
        const res = await api.get("/auth/profile");
        const user = res.data?.user;

        if (!user) {
          if (mounted) setStatus("unauthorized");
          return;
        }

        // 🔥 Username mismatch handling
        if (username && username !== user.username) {
          if (mounted) setStatus(`redirect:${user.username}`);
          return;
        }

        if (mounted) setStatus("authorized");

      } catch (err) {
        if (mounted) setStatus("unauthorized");
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [username]);

  // ---------------- UI STATES ----------------

  if (status === "checking") {
    return <Loader message="Checking authentication..." />;
  }

  if (status.startsWith("redirect:")) {
    const correctUser = status.split(":")[1];
    return <Navigate to={`/${correctUser}/dashboard`} replace />;
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

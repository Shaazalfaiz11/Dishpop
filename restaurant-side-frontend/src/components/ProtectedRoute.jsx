// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "../services/api";
import Loader from "./Loader";

export default function ProtectedRoute({ children, validateResource = false }) {
  const [status, setStatus] = useState("checking"); // "checking", "authorized", "unauthorized", "notfound"
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = Cookies.get("token") || localStorage.getItem("token");
        if (!token) {
          if (mounted) setStatus("unauthorized");
          return;
        }

        // Verify token & get user
        const res = await api.get("/auth/profile", { withCredentials: true });
        if (!res.data.success) {
          if (mounted) setStatus("unauthorized");
          return;
        }

        // Validate dynamic resource if required
        if (validateResource && params.restaurantId) {
          try {
            const res2 = await api.get(`/restaurant/${params.restaurantId}`);
            if (!res2.data.success) {
              if (mounted) setStatus("notfound");
              return;
            }
          } catch {
            if (mounted) setStatus("notfound");
            return;
          }
        }

        if (mounted) setStatus("authorized");
      } catch (err) {
        if (mounted) setStatus("unauthorized");
      }
    };

    checkAuth();
    return () => (mounted = false);
  }, [params.restaurantId, validateResource]);

  if (status === "checking") return <Loader message="Checking authentication..." />;
  if (status === "unauthorized") return <Navigate to="/login" replace state={{ from: location }} />;
  if (status === "notfound") return <Navigate to="/404" replace />;

  return children;
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export default function ProtectedRoute() {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <p role="status">Проверяем сессию...</p>;
  if (error) return <p role="alert" className="error">{error}</p>;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[60vh] bg-background px-5 py-16 text-muted-foreground">Even geduld</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ returnTo: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
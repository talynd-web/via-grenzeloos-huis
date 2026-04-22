import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { role, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-[60vh] bg-background px-5 py-16 text-muted-foreground">Even geduld</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ returnTo: "/admin" }} />;
  }

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
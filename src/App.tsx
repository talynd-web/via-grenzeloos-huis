import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AdminRoute from "@/components/auth/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SiteLayout from "@/components/layout/SiteLayout";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "./pages/AuthPages";
import AdminDetailPage from "./pages/AdminDetailPage";
import AdminListPage from "./pages/AdminListPage";
import DashboardPage from "./pages/DashboardPage";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import SpanjePage from "./pages/SpanjePage";
import DubaiPage from "./pages/DubaiPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/quiz/resultaat" element={<QuizResultPage />} />
            <Route path="/spanje" element={<SpanjePage />} />
            <Route path="/dubai" element={<DubaiPage />} />
            <Route path="/plan-gesprek" element={<PlaceholderPage title="Plan gesprek" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registreer" element={<RegisterPage />} />
            <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profiel" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminListPage /></AdminRoute>} />
            <Route path="/admin/klanten/:id" element={<AdminRoute><AdminDetailPage /></AdminRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SiteLayout from "@/components/layout/SiteLayout";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage } from "./pages/AuthPages";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PlaceholderPage from "./pages/PlaceholderPage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";

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
            <Route path="/spanje" element={<PlaceholderPage title="Spanje" />} />
            <Route path="/dubai" element={<PlaceholderPage title="Dubai" />} />
            <Route path="/plan-gesprek" element={<PlaceholderPage title="Plan gesprek" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registreer" element={<RegisterPage />} />
            <Route path="/wachtwoord-vergeten" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
            <Route path="/profiel" element={<PlaceholderPage title="Profiel" />} />
            <Route path="/admin" element={<PlaceholderPage title="Admin" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

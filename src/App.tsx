import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import DashboardLayout from "./components/DashboardLayout";
import WalletDashboard from "./pages/WalletDashboard";
import PaymentsDashboard from "./pages/PaymentsDashboard";
import RetailDashboard from "./pages/RetailDashboard";
import SupplyDashboard from "./pages/SupplyDashboard";
import EducationDashboard from "./pages/EducationDashboard";
import AuditDashboard from "./pages/AuditDashboard";
import SettingsDashboard from "./pages/SettingsDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<WalletDashboard />} />
              <Route path="payments" element={<PaymentsDashboard />} />
              <Route path="retail" element={<RetailDashboard />} />
              <Route path="supply" element={<SupplyDashboard />} />
              <Route path="education" element={<EducationDashboard />} />
              <Route path="audit" element={<AuditDashboard />} />
              <Route path="settings" element={<SettingsDashboard />} />
              <Route path="support" element={<SupportDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing";
import DashboardLayout from "./components/DashboardLayout";
import PersonnelDashboard from "./pages/PersonnelDashboard";
import RetailDashboard from "./pages/RetailDashboard";
import SupplyDashboard from "./pages/SupplyDashboard";
import EducationDashboard from "./pages/EducationDashboard";
import AuditDashboard from "./pages/AuditDashboard";
import SettingsDashboard from "./pages/SettingsDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="personnel" element={<PersonnelDashboard />} />
            <Route path="retail" element={<RetailDashboard />} />
            <Route path="supply" element={<SupplyDashboard />} />
            <Route path="education" element={<EducationDashboard />} />
            <Route path="audit" element={<AuditDashboard />} />
            <Route path="settings" element={<SettingsDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

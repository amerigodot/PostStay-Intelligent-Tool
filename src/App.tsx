import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import GuestRelationsDashboard from "./pages/guest-relations/GuestRelationsDashboard";
import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RoleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Receptionist Console */}
            <Route path="/receptionist" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/arrivals" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/upsell" element={<ReceptionistDashboard />} />
            
            {/* Guest Relations Console */}
            <Route path="/guest-relations" element={<GuestRelationsDashboard />} />
            <Route path="/guest-relations/timelines" element={<GuestRelationsDashboard />} />
            <Route path="/guest-relations/templates" element={<GuestRelationsDashboard />} />
            
            {/* Marketing Console */}
            <Route path="/marketing" element={<MarketingDashboard />} />
            <Route path="/marketing/segments" element={<MarketingDashboard />} />
            <Route path="/marketing/consent" element={<MarketingDashboard />} />
            
            {/* Manager Console */}
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/alerts" element={<ManagerDashboard />} />
            <Route path="/manager/reports" element={<ManagerDashboard />} />
            
            {/* Admin Console */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/audit" element={<AdminDashboard />} />
            <Route path="/admin/incidents" element={<AdminDashboard />} />
            <Route path="/admin/integrations" element={<AdminDashboard />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

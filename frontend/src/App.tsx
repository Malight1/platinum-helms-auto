import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CarPurchasePage } from "./pages/CarPurchasePage";
import { CarImportationPage } from "./pages/CarImportationPage";
import { CarFinancingPage } from "./pages/CarFinancingPage";
import { AboutUsPage } from "./pages/AboutUsPage";
import { ContactPage } from "./pages/ContactPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import ContactLeadsPage from "./pages/admin/ContactLeadsPage";
import FinanceApplicationsPage from "./pages/admin/FinanceApplicationsPage";
import VehicleInventoryPage from "./pages/admin/VehicleInventoryPage";
import AdminDashboardWrapper from "./components/AdminDashboardWrapper";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import { LeadCaptureDialog } from "./components/LeadCaptureDialog";
import { FloatingWhatsAppButton } from "./components/FloatingWhatsAppButton";

/**
 * Scroll to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

/**
 * Layout wrapper for public pages
 */
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
      <LeadCaptureDialog />
      <FloatingWhatsAppButton />
    </>
  );
}

/**
 * Wrapper components that provide onNavigate prop using React Router
 */
function HomePageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <HomePage onNavigate={handleNavigate} />;
}

function CarPurchasePageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <CarPurchasePage onNavigate={handleNavigate} />;
}

function CarImportationPageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <CarImportationPage onNavigate={handleNavigate} />;
}

function CarFinancingPageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <CarFinancingPage onNavigate={handleNavigate} />;
}

function AboutUsPageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <AboutUsPage onNavigate={handleNavigate} />;
}

function ComingSoonPageWrapper() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: "/home",
      purchase: "/purchase",
      importation: "/importation",
      financing: "/financing",
      about: "/about",
      contact: "/contact",
      admin: "/admin",
      comingsoon: "/coming-soon",
    };
    navigate(routes[page.toLowerCase()] || `/${page}`);
  };
  return <ComingSoonPage onNavigate={handleNavigate} />;
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Home as Landing Page */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Public Routes */}
            <Route
              path="/home"
              element={
                <PublicLayout>
                  <HomePageWrapper />
                </PublicLayout>
              }
            />
            <Route
              path="/purchase"
              element={
                <PublicLayout>
                  <CarPurchasePageWrapper />
                </PublicLayout>
              }
            />
            <Route
              path="/importation"
              element={
                <PublicLayout>
                  <CarImportationPageWrapper />
                </PublicLayout>
              }
            />
            <Route
              path="/financing"
              element={
                <PublicLayout>
                  <CarFinancingPageWrapper />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutUsPageWrapper />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />
            <Route path="/coming-soon" element={<ComingSoonPageWrapper />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWrapper />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWrapper>
                    <VehicleInventoryPage />
                  </AdminDashboardWrapper>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/finance-applications"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWrapper>
                    <FinanceApplicationsPage />
                  </AdminDashboardWrapper>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/contact-leads"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWrapper>
                    <ContactLeadsPage />
                  </AdminDashboardWrapper>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboardWrapper>
                    <AdminSettingsPage />
                  </AdminDashboardWrapper>
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

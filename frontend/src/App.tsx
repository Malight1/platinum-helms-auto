import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { LeadCaptureDialog } from "./components/LeadCaptureDialog";
import { FloatingWhatsAppButton } from "./components/FloatingWhatsAppButton";
import { ErrorBoundary } from "./components/feedback/ErrorBoundary";
import { Toaster } from "./components/sonner";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Lazy-load all page chunks — keeps the initial JS bundle slim
const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const CarPurchasePage = lazy(() =>
  import("./pages/CarPurchasePage").then((m) => ({ default: m.CarPurchasePage })),
);
const CarImportationPage = lazy(() =>
  import("./pages/CarImportationPage").then((m) => ({ default: m.CarImportationPage })),
);
const CarFinancingPage = lazy(() =>
  import("./pages/CarFinancingPage").then((m) => ({ default: m.CarFinancingPage })),
);
const AboutUsPage = lazy(() =>
  import("./pages/AboutUsPage").then((m) => ({ default: m.AboutUsPage })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const ComingSoonPage = lazy(() =>
  import("./pages/ComingSoonPage").then((m) => ({ default: m.ComingSoonPage })),
);

// Admin pages (each becomes its own chunk; split from public pages)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboardWrapper = lazy(() => import("./components/AdminDashboardWrapper"));
const VehicleInventoryPage = lazy(() => import("./pages/admin/VehicleInventoryPage"));
const VehicleCatalogPage = lazy(() => import("./pages/admin/VehicleCatalogPage"));
const FinanceApplicationsPage = lazy(() => import("./pages/admin/FinanceApplicationsPage"));
const ContactLeadsPage = lazy(() => import("./pages/admin/ContactLeadsPage"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));

/** Full-page loading spinner shown while lazy chunks load */
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian">
      <div className="flex flex-col items-center gap-4">
        <div className="size-9 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
        <p className="text-xs tracking-widest text-white/30 uppercase">Loading</p>
      </div>
    </div>
  );
}

/** Scroll to top on every route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

/** Shared nav → content → footer shell for public pages */
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

/** Injects the onNavigate prop using React Router for each public page */
function usePageNavigate() {
  const navigate = useNavigate();
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
  return (page: string) => navigate(routes[page.toLowerCase()] ?? `/${page}`);
}

function HomePageWrapper() {
  const onNavigate = usePageNavigate();
  return <HomePage onNavigate={onNavigate} />;
}
function CarPurchasePageWrapper() {
  const onNavigate = usePageNavigate();
  return <CarPurchasePage onNavigate={onNavigate} />;
}
function CarImportationPageWrapper() {
  const onNavigate = usePageNavigate();
  return <CarImportationPage onNavigate={onNavigate} />;
}
function CarFinancingPageWrapper() {
  const onNavigate = usePageNavigate();
  return <CarFinancingPage onNavigate={onNavigate} />;
}
function AboutUsPageWrapper() {
  const onNavigate = usePageNavigate();
  return <AboutUsPage onNavigate={onNavigate} />;
}
function ComingSoonPageWrapper() {
  const onNavigate = usePageNavigate();
  return <ComingSoonPage onNavigate={onNavigate} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AdminAuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <ScrollToTop />
          <div className="min-h-screen bg-white">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Public routes */}
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

                {/* Admin routes */}
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
                  path="/admin/catalog"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboardWrapper>
                        <VehicleCatalogPage />
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
            </Suspense>
          </div>
        </AdminAuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

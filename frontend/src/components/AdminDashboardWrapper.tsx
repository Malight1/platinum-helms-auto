import { ReactNode, useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminDashboard } from "./AdminDashboard";
import { Avatar, AvatarFallback } from "./avatar";
import {
  Car,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

interface AdminDashboardWrapperProps {
  children?: ReactNode;
}

const navItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "All Vehicles", path: "/admin/catalog", icon: LayoutGrid },
  { label: "Inventory", path: "/admin/vehicles", icon: Car },
  { label: "Finance Apps", path: "/admin/finance-applications", icon: FileText },
  { label: "Leads", path: "/admin/contact-leads", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const pageTitles: Record<string, { title: string; desc: string }> = {
  "/admin": { title: "Dashboard", desc: "Overview of your business operations" },
  "/admin/catalog": { title: "All Vehicles", desc: "Browse your full vehicle catalog" },
  "/admin/vehicles": { title: "Vehicle Inventory", desc: "Manage your vehicle listings" },
  "/admin/finance-applications": { title: "Finance Applications", desc: "Review financing leads" },
  "/admin/contact-leads": { title: "Contact Leads", desc: "Manage customer enquiries" },
  "/admin/settings": { title: "Settings", desc: "Account and security preferences" },
};

const AdminDashboardWrapper = ({ children }: AdminDashboardWrapperProps) => {
  const { user, logout, refreshUser } = useAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { refreshUser(); }, []);
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try { await logout(); navigate("/home"); } catch { /* swallow */ }
  };

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "A";

  const page = pageTitles[pathname] ?? { title: "Admin", desc: "" };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0B0B0F] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-brand via-brand/50 to-transparent" />

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/30">
            <Car size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold leading-tight text-white">Platinum Helms</p>
            <span className="rounded-sm bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/40">
              Admin
            </span>
          </div>
          <button
            className="ml-auto flex size-7 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={15} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
            Navigation
          </p>
          {navItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-brand/15 text-white"
                    : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive ? "bg-brand text-white shadow-md shadow-brand/40" : "text-white/40 group-hover:text-white/70"
                    }`}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={13} className="text-brand/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.06]" />

        {/* User + Logout */}
        <div className="p-4 space-y-3">
          {/* User card */}
          <div
            className="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.06]"
            onClick={() => navigate("/admin/settings")}
          >
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-brand text-xs font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-white/40">{user?.email}</p>
            </div>
          </div>

          {/* Logout */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand">
                <LogOut size={15} />
                Sign Out
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out of admin dashboard?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out and returned to the homepage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-brand text-white hover:bg-brand-strong">
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6">
          {/* Mobile menu button */}
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-base font-bold text-gray-900 leading-tight truncate">
              {page.title}
            </h1>
            {page.desc && (
              <p className="hidden text-xs text-gray-400 sm:block">{page.desc}</p>
            )}
          </div>

          {/* Right: user chip */}
          <button
            onClick={() => navigate("/admin/settings")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Avatar className="size-6">
              <AvatarFallback className="bg-brand text-[10px] font-bold text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden font-medium sm:block">{user?.firstName}</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children || <AdminDashboard />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet, CreditCard, ShoppingBag, GraduationCap, HandCoins,
  Settings, LogOut, ChevronLeft, ChevronRight, Menu, X, HeadphonesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import militaryCrest from "@/assets/nigerian-military-crest.png";

interface NavItem {
  label: string;
  icon: typeof Wallet;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Wallet", icon: Wallet, path: "/dashboard" },
  { label: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Retail Discounts", icon: ShoppingBag, path: "/dashboard/retail" },
  { label: "Education Fund", icon: GraduationCap, path: "/dashboard/education" },
  { label: "Approved Fundings", icon: HandCoins, path: "/dashboard/approved-fundings" },
  { label: "Support", icon: HeadphonesIcon, path: "/dashboard/support" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const userEmail = user?.email ?? "";
  const userName = user?.user_metadata?.full_name || userEmail.split("@")[0];
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-sidebar-border p-4">
        <img src={militaryCrest} alt="Nigerian Military Crest" className="h-8 w-8 shrink-0 object-contain" />
        {!collapsed && <span className="text-sm font-bold tracking-wide text-sidebar-foreground">MWCIP</span>}
        <button onClick={() => setMobileOpen(false)} className="ml-auto md:hidden">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* User profile */}
      <div className={cn(
        "border-b border-border/50 p-3",
        collapsed ? "flex justify-center" : ""
      )}>
        {collapsed ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
              <p className="truncate text-xs text-sidebar-foreground/60">{userEmail}</p>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-2 space-y-1">
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="w-full hidden md:inline-flex text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 rounded-md bg-card p-2 shadow-md border border-border/50 md:hidden"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-border/50 transition-transform duration-300 md:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {sidebarContent}
      </aside>

      <aside className={cn(
        "hidden md:flex h-screen flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default DashboardSidebar;

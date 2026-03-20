import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield, LayoutDashboard, ShoppingBag, Truck, GraduationCap,
  ClipboardCheck, Users, Settings, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Personnel", icon: Users, path: "/dashboard" },
  { label: "Retail Discounts", icon: ShoppingBag, path: "/dashboard/retail" },
  { label: "Supply Chain", icon: Truck, path: "/dashboard/supply" },
  { label: "Education Fund", icon: GraduationCap, path: "/dashboard/education" },
  { label: "Audit & Compliance", icon: ClipboardCheck, path: "/dashboard/audit" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex items-center gap-2.5 border-b border-border/50 p-4">
        <Shield className="h-7 w-7 shrink-0 text-primary" />
        {!collapsed && <span className="text-sm font-bold tracking-wide text-foreground">MWCIP</span>}
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-2 space-y-1">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="w-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

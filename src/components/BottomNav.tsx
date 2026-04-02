import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, GraduationCap, ShoppingBag, Receipt, Wallet, Settings, HeadphonesIcon, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Wallet", icon: Wallet, path: "/dashboard" },
  { label: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Education", icon: GraduationCap, path: "/dashboard/education" },
  { label: "Retail", icon: ShoppingBag, path: "/dashboard/retail" },
  { label: "History", icon: Receipt, path: "/dashboard/transactions" },
  { label: "Supply", icon: ClipboardCheck, path: "/dashboard/supply" },
  { label: "Support", icon: HeadphonesIcon, path: "/dashboard/support" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 gap-0 py-1">
        {navItems.slice(0, 4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors rounded-lg",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-4 gap-0 pb-1">
        {navItems.slice(4).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors rounded-lg",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

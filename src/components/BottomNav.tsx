import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, GraduationCap, ShoppingBag, Receipt, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Wallet", icon: Wallet, path: "/dashboard" },
  { label: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  { label: "Education", icon: GraduationCap, path: "/dashboard/education" },
  { label: "Retail", icon: ShoppingBag, path: "/dashboard/retail" },
  { label: "History", icon: Receipt, path: "/dashboard/transactions" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 px-1 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors rounded-lg min-w-0",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

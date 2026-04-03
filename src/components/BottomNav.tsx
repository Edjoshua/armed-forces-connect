import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, GraduationCap, ShoppingBag, Receipt, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Wallet", icon: Wallet, path: "/dashboard", badge: 0 },
  { label: "Payments", icon: CreditCard, path: "/dashboard/payments", badge: 2 },
  { label: "Education", icon: GraduationCap, path: "/dashboard/education", badge: 1 },
  { label: "Retail", icon: ShoppingBag, path: "/dashboard/retail", badge: 3 },
  { label: "History", icon: Receipt, path: "/dashboard/transactions", badge: 0 },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 safe-bottom">
      <div className="flex w-full">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] sm:text-xs font-medium transition-colors min-w-0",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5 sm:h-[22px] sm:w-[22px] shrink-0", isActive && "text-primary")} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate max-w-full px-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

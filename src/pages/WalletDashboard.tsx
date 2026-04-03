import { useState, useEffect, useRef, useCallback } from "react";
import { Wallet, ArrowUpRight, ArrowDownLeft, CreditCard, TrendingUp, Eye, EyeOff, QrCode, Smartphone, Send, Shield, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const recentTransactions = [
  { id: "TXN-8821", type: "credit", description: "Salary Credit", amount: "+₦450,000", date: "Mar 31, 2026", status: "Completed" },
  { id: "TXN-8820", type: "debit", description: "ShopRite - Groceries", amount: "-₦12,500", date: "Mar 30, 2026", status: "Completed" },
  { id: "TXN-8819", type: "debit", description: "Transfer to SGT. Bello", amount: "-₦25,000", date: "Mar 29, 2026", status: "Completed" },
  { id: "TXN-8818", type: "credit", description: "Education Fund Rebate", amount: "+₦35,000", date: "Mar 28, 2026", status: "Completed" },
  { id: "TXN-8817", type: "debit", description: "MedPlus Pharmacy", amount: "-₦8,200", date: "Mar 27, 2026", status: "Pending" },
];

const generateRefreshedTransactions = () => {
  const now = new Date();
  const base = [
    { type: "credit", description: "Salary Credit", amount: "+₦450,000", status: "Completed" },
    { type: "debit", description: "ShopRite - Groceries", amount: "-₦12,500", status: "Completed" },
    { type: "debit", description: "Transfer to SGT. Bello", amount: "-₦25,000", status: "Completed" },
    { type: "credit", description: "Education Fund Rebate", amount: "+₦35,000", status: "Completed" },
    { type: "debit", description: "MedPlus Pharmacy", amount: "-₦8,200", status: "Pending" },
  ];
  return base.map((t, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    return {
      ...t,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
  });
};

const PULL_THRESHOLD = 80;

const WalletDashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [serviceStatus, setServiceStatus] = useState("active");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  const fetchProfile = useCallback(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("service_status")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.service_status) setServiceStatus(data.service_status);
      });
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    fetchProfile();
    // Simulate data refresh
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
    setPullDistance(0);
    toast.success("Wallet updated");
  }, [fetchProfile]);

  // Touch handlers for pull-to-refresh
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current?.closest("main");
    if (el && el.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.5, 120));
    }
  }, [isPulling, refreshing]);

  const onTouchEnd = useCallback(() => {
    if (!isPulling) return;
    setIsPulling(false);
    if (pullDistance >= PULL_THRESHOLD && !refreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, refreshing, handleRefresh]);

  return (
    <div
      ref={scrollRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="relative"
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 || refreshing ? Math.max(pullDistance, refreshing ? 48 : 0) : 0 }}
      >
        <RefreshCw
          className={cn(
            "h-5 w-5 text-primary transition-transform duration-200",
            refreshing && "animate-spin",
            pullDistance >= PULL_THRESHOLD && !refreshing && "text-success"
          )}
          style={{ transform: refreshing ? undefined : `rotate(${pullDistance * 2}deg)` }}
        />
        <span className="ml-2 text-xs text-muted-foreground">
          {refreshing ? "Refreshing…" : pullDistance >= PULL_THRESHOLD ? "Release to refresh" : "Pull to refresh"}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 w-full max-w-4xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome back, {userName}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Your wallet overview and recent activity</p>
        </div>

        {serviceStatus === "active" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3 flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">Monthly ₦10,000 Welfare Fund contribution due on the 1st</p>
              </div>
              <Button variant="gold" size="sm" className="text-xs shrink-0">Pay Now</Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
              </div>
              <button onClick={() => setShowBalance(!showBalance)} className="text-muted-foreground hover:text-foreground transition-colors">
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-foreground mb-1">
              {showBalance ? "₦1,842,300.00" : "₦••••••••"}
            </p>
            <p className="text-xs text-success font-medium">+₦485,000 this month</p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Button variant="gold" size="sm" className="flex-1 min-w-[100px] text-xs sm:text-sm" onClick={() => navigate("/dashboard/payments")}>
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Send
              </Button>
              <Button variant="gold-outline" size="sm" className="flex-1 min-w-[100px] text-xs sm:text-sm" onClick={() => navigate("/dashboard/payments")}>
                <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Scan
              </Button>
              <Button variant="gold-outline" size="sm" className="flex-1 min-w-[100px] text-xs sm:text-sm" onClick={() => navigate("/dashboard/payments")}>
                <Smartphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> NFC
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard icon={ArrowUpRight} title="Money In" value="₦485,000" change="This month" changeType="positive" />
          <StatsCard icon={ArrowDownLeft} title="Money Out" value="₦145,700" change="This month" changeType="negative" />
          <StatsCard icon={CreditCard} title="Transactions" value="47" change="+12 this week" changeType="neutral" />
          <StatsCard icon={TrendingUp} title="Savings" value="₦580,000" change="+8.2% growth" changeType="positive" />
        </div>

        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/dashboard/transactions")}>View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-border/30">
              {recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`rounded-full p-2 shrink-0 ${t.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}>
                      {t.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">{t.date} · {t.id}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className={`text-sm font-mono font-medium ${t.type === "credit" ? "text-success" : "text-foreground"}`}>
                      {t.amount}
                    </p>
                    <Badge variant="outline" className={`text-[10px] ${t.status === "Completed" ? "border-success/20 text-success" : "border-warning/20 text-warning"}`}>
                      {t.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletDashboard;

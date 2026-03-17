import { Users, ShoppingBag, Truck, GraduationCap, AlertTriangle, TrendingUp, Activity, Shield } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const recentActivity = [
  { action: "Discount redeemed", detail: "SGT. A. Mohammed — ₦12,500 at ShopRite", time: "2m ago", type: "retail" },
  { action: "Supply dispatched", detail: "Medical kits → FOB Delta-7", time: "15m ago", type: "supply" },
  { action: "Education deposit", detail: "CPL. O. Bello — ₦25,000 monthly", time: "1h ago", type: "education" },
  { action: "Audit flag raised", detail: "Duplicate transaction detected — TX-88421", time: "2h ago", type: "audit" },
  { action: "New partner registered", detail: "MedPlus Pharmacy — Lagos", time: "5h ago", type: "retail" },
];

const typeColors: Record<string, string> = {
  retail: "bg-info/10 text-info border-info/20",
  supply: "bg-warning/10 text-warning border-warning/20",
  education: "bg-success/10 text-success border-success/20",
  audit: "bg-destructive/10 text-destructive border-destructive/20",
};

const DashboardOverview = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-sm text-muted-foreground">Real-time overview of all MWCIP operations</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Users} title="Active Personnel" value="142,380" change="+2.4% this month" changeType="positive" />
        <StatsCard icon={ShoppingBag} title="Retail Transactions" value="₦2.4B" change="+18% this quarter" changeType="positive" />
        <StatsCard icon={Truck} title="Supply Deliveries" value="8,421" change="98.2% on-time" changeType="positive" />
        <StatsCard icon={GraduationCap} title="Education Fund" value="₦890M" change="+₦45M this month" changeType="positive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className={typeColors[item.type]}>{item.type}</Badge>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { msg: "3 duplicate transactions flagged", severity: "high" },
              { msg: "Supply depot Bravo-9 low stock", severity: "medium" },
              { msg: "2 partners pending verification", severity: "low" },
              { msg: "Audit report Q1 due in 5 days", severity: "info" },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border/30 bg-secondary/30 p-3">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  alert.severity === "high" ? "bg-destructive" :
                  alert.severity === "medium" ? "bg-warning" :
                  alert.severity === "low" ? "bg-info" : "bg-muted-foreground"
                }`} />
                <p className="text-xs text-foreground">{alert.msg}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;

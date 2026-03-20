import { ShoppingBag, Store, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";

const transactions = [
  { id: "TX-90421", soldier: "SGT. A. Mohammed", partner: "ShopRite Abuja", amount: "₦45,200", discount: "15%", date: "Mar 17, 2026" },
  { id: "TX-90420", soldier: "LT. C. Okafor", partner: "MedPlus Lagos", amount: "₦12,800", discount: "20%", date: "Mar 17, 2026" },
  { id: "TX-90419", soldier: "CPL. O. Bello", partner: "SPAR Kaduna", amount: "₦8,500", discount: "10%", date: "Mar 16, 2026" },
  { id: "TX-90418", soldier: "PVT. I. Yusuf", partner: "Hubmart PH", amount: "₦22,100", discount: "15%", date: "Mar 16, 2026" },
];

const RetailDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Retail Discount Program</h1>
      <p className="text-sm text-muted-foreground">Transaction monitoring and partner management</p>
    </div>

    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={ShoppingBag} title="Total Transactions" value="284,910" change="+4,210 this week" changeType="positive" />
      <StatsCard icon={TrendingUp} title="Savings Generated" value="₦2.4B" change="+18% QoQ" changeType="positive" />
      <StatsCard icon={Store} title="Active Partners" value="1,247" change="+23 this month" changeType="positive" />
      <StatsCard icon={AlertTriangle} title="Fraud Flags" value="7" change="Under review" changeType="negative" />
    </div>

    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">TX ID</th>
                <th className="pb-3 pr-4">Personnel</th>
                <th className="pb-3 pr-4">Partner</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Discount</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{t.id}</td>
                  <td className="py-3 pr-4 text-foreground">{t.soldier}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{t.partner}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{t.amount}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className="bg-success/10 text-success border-success/20">{t.discount}</Badge></td>
                  <td className="py-3 text-xs text-muted-foreground">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default RetailDashboard;

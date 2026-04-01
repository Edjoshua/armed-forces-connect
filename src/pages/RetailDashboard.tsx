import { ShoppingBag, Store, TrendingUp, Tag, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";

const myTransactions = [
  { id: "TX-90421", partner: "ShopRite Abuja", amount: "₦45,200", discount: "15%", saved: "₦7,980", date: "Mar 17, 2026" },
  { id: "TX-90420", partner: "MedPlus Lagos", amount: "₦12,800", discount: "20%", saved: "₦3,200", date: "Mar 17, 2026" },
  { id: "TX-90419", partner: "SPAR Kaduna", amount: "₦8,500", discount: "10%", saved: "₦944", date: "Mar 16, 2026" },
  { id: "TX-90418", partner: "Hubmart PH", amount: "₦22,100", discount: "15%", saved: "₦3,900", date: "Mar 16, 2026" },
];

const partnerOffers = [
  { name: "ShopRite", discount: "15% off", category: "Groceries", rating: 4.5 },
  { name: "MedPlus", discount: "20% off", category: "Pharmacy", rating: 4.7 },
  { name: "Total Energies", discount: "10% off", category: "Fuel", rating: 4.2 },
  { name: "Chicken Republic", discount: "12% off", category: "Food", rating: 4.0 },
];

const RetailDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Retail Discounts</h1>
      <p className="text-sm text-muted-foreground">Your discount benefits and purchase history</p>
    </div>

    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={ShoppingBag} title="My Purchases" value="47" change="This quarter" changeType="neutral" />
      <StatsCard icon={TrendingUp} title="Total Saved" value="₦124,500" change="+₦16,024 this month" changeType="positive" />
      <StatsCard icon={Store} title="Partners Used" value="12" change="Out of 1,247 available" changeType="neutral" />
      <StatsCard icon={Tag} title="Best Discount" value="20%" change="MedPlus Pharmacy" changeType="positive" />
    </div>

    {/* Available Offers */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Available Partner Offers</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-primary">View All Partners</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {partnerOffers.map((p) => (
            <div key={p.name} className="rounded-lg border border-border/30 bg-secondary/30 p-4 hover:border-primary/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">{p.discount}</Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-accent text-accent" /> {p.rating}
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.category}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* My Purchase History */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My Purchase History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">TX ID</th>
                <th className="pb-3 pr-4">Partner</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Discount</th>
                <th className="pb-3 pr-4">Saved</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {myTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{t.id}</td>
                  <td className="py-3 pr-4 text-foreground">{t.partner}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{t.amount}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className="bg-success/10 text-success border-success/20">{t.discount}</Badge></td>
                  <td className="py-3 pr-4 font-mono text-xs text-success">{t.saved}</td>
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

import { Truck, Package, MapPin, Clock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";

const myOrders = [
  { id: "SH-4421", items: "Medical Kit (x1)", dest: "My Station — FOB Delta-7", status: "In Transit", eta: "4h", date: "Mar 17, 2026" },
  { id: "SH-4420", items: "Ration Pack (x2)", dest: "My Station — FOB Delta-7", status: "Delivered", eta: "—", date: "Mar 15, 2026" },
  { id: "SH-4419", items: "Field Gear (x1)", dest: "My Station — FOB Delta-7", status: "Processing", eta: "24h", date: "Mar 14, 2026" },
  { id: "SH-4418", items: "Uniform Set (x1)", dest: "My Station — FOB Delta-7", status: "Delivered", eta: "—", date: "Mar 10, 2026" },
];

const statusStyle: Record<string, string> = {
  "In Transit": "bg-info/10 text-info border-info/20",
  Delivered: "bg-success/10 text-success border-success/20",
  Processing: "bg-warning/10 text-warning border-warning/20",
};

const availableItems = [
  { name: "Medical Kit", category: "Health", available: true },
  { name: "Ration Pack", category: "Food", available: true },
  { name: "Field Equipment", category: "Gear", available: true },
  { name: "Tactical Vest", category: "Gear", available: false },
];

const SupplyDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Supply Requests</h1>
      <p className="text-sm text-muted-foreground">Track your supply orders and request new items</p>
    </div>

    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={Package} title="My Orders" value="12" change="This quarter" changeType="neutral" />
      <StatsCard icon={Truck} title="In Transit" value="2" change="Arriving soon" changeType="positive" />
      <StatsCard icon={MapPin} title="My Station" value="FOB Delta-7" change="3rd Armoured Div." changeType="neutral" />
      <StatsCard icon={Clock} title="Avg Delivery" value="6.2h" change="To your station" changeType="positive" />
    </div>

    {/* Request New Supply */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Request Supply Items</CardTitle>
          <Button variant="gold" size="sm"><Package className="h-3.5 w-3.5" /> New Request</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {availableItems.map((item) => (
            <div key={item.name} className="rounded-lg border border-border/30 bg-secondary/30 p-4 hover:border-primary/20 transition-all cursor-pointer">
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
              <Badge variant="outline" className={item.available ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                {item.available ? "Available" : "Out of Stock"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* My Orders */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">My Order History</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs"><Bell className="h-3.5 w-3.5 mr-1" /> Track Updates</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Delivery To</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">ETA</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {myOrders.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{s.id}</td>
                  <td className="py-3 pr-4 text-foreground">{s.items}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{s.dest}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={statusStyle[s.status]}>{s.status}</Badge></td>
                  <td className="py-3 pr-4 text-xs font-mono">{s.eta}</td>
                  <td className="py-3 text-xs text-muted-foreground">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SupplyDashboard;

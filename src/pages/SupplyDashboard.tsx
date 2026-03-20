import { Truck, Package, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";

const shipments = [
  { id: "SH-4421", items: "Medical Supplies (x240)", origin: "Depot Alpha-3", dest: "FOB Delta-7", status: "In Transit", eta: "4h" },
  { id: "SH-4420", items: "Rations Pack (x1,200)", origin: "Depot Bravo-1", dest: "Camp Echo-2", status: "Delivered", eta: "—" },
  { id: "SH-4419", items: "Field Equipment (x80)", origin: "Depot Charlie-5", dest: "OP Juliet-9", status: "Pending", eta: "12h" },
  { id: "SH-4418", items: "Ammunition (x500)", origin: "Depot Alpha-3", dest: "FOB Kilo-1", status: "In Transit", eta: "8h" },
];

const statusStyle: Record<string, string> = {
  "In Transit": "bg-info/10 text-info border-info/20",
  Delivered: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
};

const SupplyDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Supply Chain Operations</h1>
      <p className="text-sm text-muted-foreground">Battlefield essential goods tracking and logistics</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-4">
      <StatsCard icon={Truck} title="Active Shipments" value="342" change="12 dispatched today" changeType="neutral" />
      <StatsCard icon={Package} title="Items in Transit" value="18,490" change="98.2% on-time" changeType="positive" />
      <StatsCard icon={MapPin} title="Supply Depots" value="24" change="All operational" changeType="positive" />
      <StatsCard icon={Clock} title="Avg Delivery Time" value="6.2h" change="-0.8h vs last month" changeType="positive" />
    </div>

    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Shipments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Shipment ID</th>
                <th className="pb-3 pr-4">Items</th>
                <th className="pb-3 pr-4">Origin</th>
                <th className="pb-3 pr-4">Destination</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {shipments.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{s.id}</td>
                  <td className="py-3 pr-4 text-foreground">{s.items}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{s.origin}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{s.dest}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={statusStyle[s.status]}>{s.status}</Badge></td>
                  <td className="py-3 text-xs font-mono">{s.eta}</td>
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

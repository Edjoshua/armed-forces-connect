import { Users, Search, Filter, Shield, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";

const soldiers = [
  { id: "MWIC-0042381", name: "SGT. Abubakar Mohammed", unit: "3rd Armoured Division", status: "Active", savings: "₦580,000", children: 2 },
  { id: "MWIC-0015992", name: "CPL. Oluwaseun Bello", unit: "72 Special Forces", status: "Deployed", savings: "₦320,000", children: 1 },
  { id: "MWIC-0078114", name: "PVT. Ibrahim Yusuf", unit: "7th Infantry Brigade", status: "Active", savings: "₦145,000", children: 0 },
  { id: "MWIC-0031006", name: "LT. Chioma Okafor", unit: "Nigerian Navy Western Fleet", status: "Active", savings: "₦920,000", children: 2 },
  { id: "MWIC-0056773", name: "MAJ. Emeka Nwankwo", unit: "Air Force Combat Command", status: "On Leave", savings: "₦1,250,000", children: 2 },
];

const statusColor: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Deployed: "bg-warning/10 text-warning border-warning/20",
  "On Leave": "bg-info/10 text-info border-info/20",
};

const PersonnelDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Military Personnel</h1>
      <p className="text-sm text-muted-foreground">Manage verified armed forces members and beneficiaries</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-3">
      <StatsCard icon={Users} title="Total Personnel" value="142,380" change="+312 this month" changeType="positive" />
      <StatsCard icon={Shield} title="Verified IDs" value="141,890" change="99.7% verified" changeType="positive" />
      <StatsCard icon={BadgeCheck} title="Active Beneficiaries" value="198,450" change="Dependents enrolled" changeType="neutral" />
    </div>

    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Personnel Registry</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search by MWIC or name..." className="h-9 w-64 pl-8 text-xs bg-secondary/50 border-border/50" />
            </div>
            <Button variant="gold-outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filter</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">MWIC ID</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Unit</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Savings</th>
                <th className="pb-3">Children</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {soldiers.map((s) => (
                <tr key={s.id} className="hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{s.id}</td>
                  <td className="py-3 pr-4 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 pr-4 text-muted-foreground text-xs">{s.unit}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={statusColor[s.status]}>{s.status}</Badge></td>
                  <td className="py-3 pr-4 font-mono text-xs">{s.savings}</td>
                  <td className="py-3 text-center">{s.children}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PersonnelDashboard;

import { ClipboardCheck, AlertTriangle, FileText, Eye, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";

const myAuditLog = [
  { id: "LOG-8812", action: "Retail purchase at ShopRite", amount: "₦45,200", status: "Verified", date: "Mar 17, 2026" },
  { id: "LOG-8811", action: "Education fund top-up", amount: "₦50,000", status: "Verified", date: "Mar 15, 2026" },
  { id: "LOG-8810", action: "Transfer to CPL. Bello", amount: "₦25,000", status: "Verified", date: "Mar 14, 2026" },
  { id: "LOG-8809", action: "Supply request — Medical Kit", amount: "—", status: "Verified", date: "Mar 12, 2026" },
  { id: "LOG-8808", action: "NFC payment at Total Energies", amount: "₦15,800", status: "Under Review", date: "Mar 10, 2026" },
];

const statusStyle: Record<string, string> = {
  Verified: "bg-success/10 text-success border-success/20",
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  Flagged: "bg-destructive/10 text-destructive border-destructive/20",
};

const complianceItems = [
  { label: "Identity Verification", status: "Complete", detail: "MWIC-0042381 verified" },
  { label: "Annual KYC Review", status: "Complete", detail: "Last reviewed: Jan 2026" },
  { label: "Transaction Monitoring", status: "Active", detail: "No flags on your account" },
  { label: "Benefits Eligibility", status: "Confirmed", detail: "All benefits active" },
];

const AuditDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Audit & Compliance</h1>
      <p className="text-sm text-muted-foreground">View your activity log and compliance status</p>
    </div>

    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={ClipboardCheck} title="Compliance" value="100%" change="All checks passed" changeType="positive" />
      <StatsCard icon={Eye} title="Activity Entries" value="124" change="This quarter" changeType="neutral" />
      <StatsCard icon={AlertTriangle} title="Flags" value="0" change="No issues" changeType="positive" />
      <StatsCard icon={FileText} title="Reports" value="4" change="Downloadable" changeType="neutral" />
    </div>

    {/* Compliance Status */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> My Compliance Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {complianceItems.map((item) => (
            <div key={item.label} className="rounded-lg border border-border/30 bg-secondary/30 p-4 flex items-center gap-3">
              <div className="rounded-full bg-success/10 p-2">
                <ClipboardCheck className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/20 text-[10px]">{item.status}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Activity Log */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Log ID</th>
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {myAuditLog.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-primary">{log.id}</td>
                  <td className="py-3 pr-4 text-foreground">{log.action}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{log.amount}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className={statusStyle[log.status]}>{log.status}</Badge></td>
                  <td className="py-3 text-xs text-muted-foreground">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AuditDashboard;

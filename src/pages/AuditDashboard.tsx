import { ClipboardCheck, AlertTriangle, FileText, Eye, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";

const auditFlags = [
  { id: "AF-0012", type: "Duplicate Transaction", detail: "TX-88421 & TX-88419 identical amounts — ShopRite Abuja", severity: "High", date: "Mar 17, 2026" },
  { id: "AF-0011", type: "Abnormal Discount", detail: "40% discount applied (max allowed: 20%) — Partner P-0891", severity: "Critical", date: "Mar 16, 2026" },
  { id: "AF-0010", type: "Supply Diversion", detail: "Medical supplies rerouted from FOB Delta-7 — SH-4401", severity: "High", date: "Mar 15, 2026" },
  { id: "AF-0009", type: "Identity Mismatch", detail: "MWIC-0099012 used at 3 locations simultaneously", severity: "Critical", date: "Mar 15, 2026" },
  { id: "AF-0008", type: "Fund Irregularity", detail: "Education withdrawal without matching deposit record", severity: "Medium", date: "Mar 14, 2026" },
];

const severityStyle: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-warning/10 text-warning border-warning/20",
  Medium: "bg-info/10 text-info border-info/20",
};

const AuditDashboard = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit & Compliance</h1>
        <p className="text-sm text-muted-foreground">Independent monitoring — read-only access</p>
      </div>
      <div className="flex gap-2">
        <Button variant="gold-outline" size="sm"><FileText className="h-3.5 w-3.5" /> Generate Report</Button>
        <Button variant="gold" size="sm"><ShieldAlert className="h-3.5 w-3.5" /> Whistleblower Portal</Button>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-4">
      <StatsCard icon={AlertTriangle} title="Active Flags" value="14" change="5 critical" changeType="negative" />
      <StatsCard icon={ClipboardCheck} title="Compliance Score" value="94.2%" change="+1.3% this month" changeType="positive" />
      <StatsCard icon={Eye} title="Audit Trail Entries" value="2.4M" change="Immutable log" changeType="neutral" />
      <StatsCard icon={FileText} title="Reports Generated" value="48" change="Q1 2026" changeType="neutral" />
    </div>

    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Flagged Items — Requires Investigation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {auditFlags.map((flag) => (
            <div key={flag.id} className="flex items-start justify-between rounded-lg border border-border/30 bg-secondary/30 p-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary">{flag.id}</span>
                  <Badge variant="outline" className={severityStyle[flag.severity]}>{flag.severity}</Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-foreground">{flag.type}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{flag.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className="text-[10px] text-muted-foreground">{flag.date}</span>
                <Button variant="ghost" size="sm" className="text-xs">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AuditDashboard;

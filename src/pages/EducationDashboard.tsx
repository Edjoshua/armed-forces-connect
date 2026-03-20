import { GraduationCap, Wallet, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/StatsCard";

const beneficiaries = [
  { name: "Aisha Mohammed", parent: "SGT. A. Mohammed", school: "University of Lagos", fund: 580000, goal: 1200000, status: "Enrolled" },
  { name: "David Okafor", parent: "LT. C. Okafor", school: "Covenant University", fund: 920000, goal: 1500000, status: "Enrolled" },
  { name: "Grace Nwankwo", parent: "MAJ. E. Nwankwo", school: "ABU Zaria", fund: 450000, goal: 800000, status: "Pending" },
  { name: "Yusuf Bello", parent: "CPL. O. Bello", school: "—", fund: 320000, goal: 1000000, status: "Saving" },
];

const statusStyle: Record<string, string> = {
  Enrolled: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Saving: "bg-info/10 text-info border-info/20",
};

const EducationDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Education Advancement</h1>
      <p className="text-sm text-muted-foreground">Education savings and scholarship management</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-4">
      <StatsCard icon={Wallet} title="Total Fund Value" value="₦890M" change="+₦45M this month" changeType="positive" />
      <StatsCard icon={Users} title="Beneficiaries" value="198,450" change="Active dependents" changeType="neutral" />
      <StatsCard icon={GraduationCap} title="Scholarships" value="4,210" change="Awarded this year" changeType="positive" />
      <StatsCard icon={TrendingUp} title="Govt Matching" value="₦320M" change="Matched contributions" changeType="positive" />
    </div>

    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Beneficiary Profiles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {beneficiaries.map((b, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border/30 bg-secondary/30 p-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{b.name}</p>
                <Badge variant="outline" className={statusStyle[b.status]}>{b.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Parent: {b.parent} · {b.school}</p>
              <div className="mt-2 flex items-center gap-3">
                <Progress value={(b.fund / b.goal) * 100} className="h-1.5 flex-1" />
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  ₦{(b.fund / 1000).toFixed(0)}K / ₦{(b.goal / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default EducationDashboard;

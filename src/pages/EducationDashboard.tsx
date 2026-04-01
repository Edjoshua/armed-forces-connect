import { GraduationCap, Wallet, BookOpen, TrendingUp, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatsCard from "@/components/StatsCard";

const myChildren = [
  { name: "Aisha", school: "University of Lagos", fund: 580000, goal: 1200000, status: "Enrolled", year: "Year 2" },
  { name: "David", school: "Not yet assigned", fund: 320000, goal: 1000000, status: "Saving", year: "—" },
];

const statusStyle: Record<string, string> = {
  Enrolled: "bg-success/10 text-success border-success/20",
  Saving: "bg-info/10 text-info border-info/20",
};

const contributions = [
  { date: "Mar 2026", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
  { date: "Feb 2026", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
  { date: "Jan 2026", amount: "₦45,000", type: "Personal", matched: "₦22,500" },
  { date: "Dec 2025", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
];

const EducationDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Education Fund</h1>
      <p className="text-sm text-muted-foreground">Track savings and manage your children's education benefits</p>
    </div>

    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatsCard icon={Wallet} title="My Total Fund" value="₦900,000" change="+₦50,000 this month" changeType="positive" />
      <StatsCard icon={TrendingUp} title="Govt Match" value="₦97,500" change="50% matching active" changeType="positive" />
      <StatsCard icon={GraduationCap} title="Dependents" value="2" change="1 enrolled, 1 saving" changeType="neutral" />
      <StatsCard icon={BookOpen} title="Scholarships" value="1" change="Applied — pending" changeType="neutral" />
    </div>

    {/* My Children */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">My Dependents</CardTitle>
          <Button variant="gold" size="sm"><PlusCircle className="h-3.5 w-3.5" /> Add Dependent</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {myChildren.map((child, i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-secondary/30 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{child.name}</p>
                <Badge variant="outline" className={statusStyle[child.status]}>{child.status}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{child.year}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{child.school}</p>
            <div className="flex items-center gap-3">
              <Progress value={(child.fund / child.goal) * 100} className="h-2 flex-1" />
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                ₦{(child.fund / 1000).toFixed(0)}K / ₦{(child.goal / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="gold-outline" size="sm" className="text-xs flex-1">Top Up Fund</Button>
              <Button variant="ghost" size="sm" className="text-xs flex-1">View Details</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Contribution History */}
    <Card className="border-border/50 bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">My Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4">Month</th>
                <th className="pb-3 pr-4">My Contribution</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3">Govt Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {contributions.map((c, i) => (
                <tr key={i} className="hover:bg-secondary/30 transition-colors">
                  <td className="py-3 pr-4 text-foreground text-xs">{c.date}</td>
                  <td className="py-3 pr-4 font-mono text-xs">{c.amount}</td>
                  <td className="py-3 pr-4"><Badge variant="outline" className="border-border/50 text-muted-foreground text-[10px]">{c.type}</Badge></td>
                  <td className="py-3 font-mono text-xs text-success">{c.matched}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default EducationDashboard;

import { useState, useEffect } from "react";
import { GraduationCap, Wallet, BookOpen, TrendingUp, PlusCircle, Users, Heart, UserPlus, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import StatsCard from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const statusStyle: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
};


const contributions = [
  { date: "Mar 2026", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
  { date: "Feb 2026", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
  { date: "Jan 2026", amount: "₦45,000", type: "Personal", matched: "₦22,500" },
  { date: "Dec 2025", amount: "₦50,000", type: "Personal", matched: "₦25,000" },
];

const EducationDashboard = () => {
  const [crowdfundAmount, setCrowdfundAmount] = useState("");
  const [dependents, setDependents] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDep, setNewDep] = useState({ name: "", relationship: "Son", dateOfBirth: "", school: "", goal: "" });
  const [newCampaign, setNewCampaign] = useState({ name: "", description: "", goal: "", daysLeft: "30" });
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDependents = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("dependents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setDependents(data || []);
    setLoading(false);
  };

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from("crowdfund_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
  };

  useEffect(() => {
    fetchDependents();
    fetchCampaigns();
  }, [user]);

  const handleDonate = (campaignName: string) => {
    if (!crowdfundAmount || Number(crowdfundAmount) <= 0) {
      toast({ title: "Enter amount", description: "Please enter a donation amount", variant: "destructive" });
      return;
    }
    toast({ title: "Donation Sent!", description: `₦${Number(crowdfundAmount).toLocaleString()} contributed to ${campaignName}` });
    setCrowdfundAmount("");
  };

  const handleAddDependent = async () => {
    if (!user) return;
    if (!newDep.name.trim() || !newDep.dateOfBirth) {
      toast({ title: "Missing info", description: "Please fill in the dependent's name and date of birth", variant: "destructive" });
      return;
    }
    if (dependents.length >= 2) {
      toast({ title: "Limit reached", description: "You can register a maximum of 2 dependents", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("dependents").insert({
      user_id: user.id,
      name: newDep.name.trim(),
      relationship: newDep.relationship,
      date_of_birth: newDep.dateOfBirth,
      school: newDep.school.trim() || "Not yet assigned",
      savings_goal: Number(newDep.goal) || 1000000,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to add dependent. Please try again.", variant: "destructive" });
    } else {
      setNewDep({ name: "", relationship: "Son", dateOfBirth: "", school: "", goal: "" });
      setShowAddDialog(false);
      toast({
        title: "Dependent Submitted",
        description: "Your dependent has been submitted for admin verification. You'll be notified once approved.",
      });
      fetchDependents();
    }
    setSubmitting(false);
  };

  const handleWithdraw = async (depId: string, depName: string) => {
    const confirmed = window.confirm(`Withdraw approval request for ${depName}? This will remove the dependent.`);
    if (!confirmed) return;
    const { error } = await supabase.from("dependents").delete().eq("id", depId);
    if (error) {
      toast({ title: "Error", description: "Failed to withdraw. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Withdrawn", description: `${depName} has been removed.` });
      fetchDependents();
    }
  };

  const handleStartCampaign = async () => {
    if (!user) return;
    if (!newCampaign.name.trim()) {
      toast({ title: "Missing info", description: "Please enter a campaign name", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("crowdfund_campaigns").insert({
      user_id: user.id,
      name: newCampaign.name.trim(),
      description: newCampaign.description.trim() || null,
      goal: Number(newCampaign.goal) || 500000,
      days_left: Number(newCampaign.daysLeft) || 30,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to create campaign. Please try again.", variant: "destructive" });
    } else {
      setNewCampaign({ name: "", description: "", goal: "", daysLeft: "30" });
      setShowCampaignDialog(false);
      toast({ title: "Campaign Created!", description: "Your crowdfunding campaign is now live." });
      fetchCampaigns();
    }
    setSubmitting(false);
  };

  const handleWithdrawCampaign = async (campaignId: string, campaignName: string) => {
    const confirmed = window.confirm(`Withdraw campaign "${campaignName}"? This will remove it permanently.`);
    if (!confirmed) return;
    const { error } = await supabase.from("crowdfund_campaigns").delete().eq("id", campaignId);
    if (error) {
      toast({ title: "Error", description: "Failed to withdraw campaign.", variant: "destructive" });
    } else {
      toast({ title: "Campaign Withdrawn", description: `"${campaignName}" has been removed.` });
      fetchCampaigns();
    }
  };

  const approvedCount = dependents.filter((d) => d.status === "approved").length;
  const pendingCount = dependents.filter((d) => d.status === "pending").length;
  const totalFund = dependents.reduce((sum: number, d: any) => sum + Number(d.fund_balance || 0), 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Education Fund</h1>
        <p className="text-sm text-muted-foreground">Track savings, manage dependents, and support fellow servicemen</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Wallet} title="My Total Fund" value={`₦${(totalFund / 1000).toFixed(0)}K`} change="+₦50,000 this month" changeType="positive" />
        <StatsCard icon={TrendingUp} title="Govt Match" value="₦97,500" change="50% matching active" changeType="positive" />
        <StatsCard icon={GraduationCap} title="Dependents" value={String(dependents.length)} change={`${approvedCount} approved, ${pendingCount} pending`} changeType="neutral" />
        <StatsCard icon={BookOpen} title="Scholarships" value="1" change="Applied — pending" changeType="neutral" />
      </div>

      {/* My Dependents */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">My Dependents</CardTitle>
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                if (dependents.length >= 2) {
                  toast({ title: "Limit reached", description: "Maximum of 2 dependents allowed per service member", variant: "destructive" });
                  return;
                }
                setShowAddDialog(true);
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" /> Add Dependent
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">You can register up to 2 children. Each must be verified by admin before activation.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <p className="text-sm text-muted-foreground text-center py-4">Loading…</p>}

          {!loading && dependents.length === 0 && (
            <div className="text-center py-8 rounded-lg border border-dashed border-border/50">
              <UserPlus className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No dependents registered</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Add a dependent to start saving for their education</p>
              <Button variant="gold" size="sm" className="mt-4" onClick={() => setShowAddDialog(true)}>
                <PlusCircle className="h-3.5 w-3.5" /> Add Your First Dependent
              </Button>
            </div>
          )}

          {dependents.map((dep) => {
            const StatusIcon = statusIcons[dep.status] || Clock;
            const isApproved = dep.status === "approved";
            const progress = dep.savings_goal > 0 ? (Number(dep.fund_balance) / Number(dep.savings_goal)) * 100 : 0;

            return (
              <div key={dep.id} className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{dep.name}</p>
                    <Badge variant="outline" className={statusStyle[dep.status] || "border-border/50"}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {dep.status === "pending" ? "Pending Approval" : dep.status === "approved" ? "Approved" : "Rejected"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">{dep.relationship}</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{dep.school || "Not yet assigned"}</p>

                {dep.status === "pending" && (
                  <div className="space-y-2 mt-1">
                    <div className="flex items-start gap-2 p-2 rounded-md bg-warning/5 border border-warning/15">
                      <Clock className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
                      <p className="text-[11px] text-warning">
                        This dependent is awaiting admin verification. Fund contributions will be enabled once approved.
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" className="text-xs" onClick={() => handleWithdraw(dep.id, dep.name)}>
                      <XCircle className="h-3 w-3" /> Withdraw Request
                    </Button>
                  </div>
                )}

                {dep.status === "rejected" && dep.admin_note && (
                  <div className="flex items-start gap-2 p-2 mt-1 rounded-md bg-destructive/5 border border-destructive/15">
                    <XCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                    <p className="text-[11px] text-destructive">
                      Rejected: {dep.admin_note}
                    </p>
                  </div>
                )}

                {isApproved && (
                  <>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        ₦{(Number(dep.fund_balance) / 1000).toFixed(0)}K / ₦{(Number(dep.savings_goal) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="gold-outline" size="sm" className="text-xs flex-1">Top Up Fund</Button>
                      <Button variant="ghost" size="sm" className="text-xs flex-1">View Details</Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Add Dependent Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Add Dependent
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">Your dependent will be submitted for admin verification before being activated.</p>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Full Name *</Label>
              <Input
                placeholder="Enter dependent's full name"
                value={newDep.name}
                onChange={(e) => setNewDep((p) => ({ ...p, name: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Relationship *</Label>
              <Select value={newDep.relationship} onValueChange={(v) => setNewDep((p) => ({ ...p, relationship: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Son">Son</SelectItem>
                  <SelectItem value="Daughter">Daughter</SelectItem>
                  <SelectItem value="Ward">Ward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Date of Birth *</Label>
              <Input
                type="date"
                value={newDep.dateOfBirth}
                onChange={(e) => setNewDep((p) => ({ ...p, dateOfBirth: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">School (optional)</Label>
              <Input
                placeholder="e.g. University of Lagos"
                value={newDep.school}
                onChange={(e) => setNewDep((p) => ({ ...p, school: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Savings Goal (₦)</Label>
              <Input
                type="number"
                placeholder="e.g. 1000000"
                value={newDep.goal}
                onChange={(e) => setNewDep((p) => ({ ...p, goal: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gold" size="sm" onClick={handleAddDependent} disabled={submitting}>
              <PlusCircle className="h-3.5 w-3.5" /> {submitting ? "Submitting…" : "Submit for Verification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crowdfunding Section */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive" /> Education Crowdfunding
            </CardTitle>
            <Button variant="gold-outline" size="sm"><PlusCircle className="h-3.5 w-3.5" /> Start Campaign</Button>
          </div>
          <p className="text-xs text-muted-foreground">Support fellow servicemen's children's education</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 mb-4">
            <Label className="text-xs">Donation Amount (₦)</Label>
            <Input
              type="number"
              placeholder="Enter amount to donate"
              value={crowdfundAmount}
              onChange={(e) => setCrowdfundAmount(e.target.value)}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          {crowdfundCampaigns.map((c, i) => (
            <div key={i} className="rounded-lg border border-border/30 bg-secondary/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">
                  {c.daysLeft} days left
                </Badge>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Progress value={(c.raised / c.goal) * 100} className="h-2 flex-1" />
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {Math.round((c.raised / c.goal) * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.backers} backers</span>
                  <span>₦{(c.raised / 1000).toFixed(0)}K raised</span>
                </div>
                <Button variant="gold" size="sm" className="text-xs" onClick={() => handleDonate(c.name)}>
                  <Heart className="h-3 w-3" /> Donate
                </Button>
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
};

export default EducationDashboard;
import { useState, useEffect } from "react";
import { GraduationCap, Wallet, BookOpen, TrendingUp, PlusCircle, Users, Heart, UserPlus, Clock, CheckCircle2, XCircle, Trash2, Share2, Award, Target, CalendarDays, Sparkles, FileText, HeartPulse, Stethoscope } from "lucide-react";
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

const NIGERIAN_SCHOLARSHIPS = [
  { name: "Federal Govt. Scholarship Award (FSB)", provider: "Federal Scholarship Board", amount: 750000, level: "Undergraduate", deadline: "Rolling" },
  { name: "PTDF Scholarship Scheme", provider: "Petroleum Technology Dev. Fund", amount: 2500000, level: "Postgraduate", deadline: "Q2" },
  { name: "NNPC/SNEPCo National University Scholarship", provider: "NNPC", amount: 350000, level: "Undergraduate", deadline: "Annual" },
  { name: "Nigerian Army Education Trust", provider: "Nigerian Army", amount: 500000, level: "All Levels", deadline: "Open" },
  { name: "MTN Foundation Scholarship", provider: "MTN Foundation", amount: 200000, level: "Undergraduate", deadline: "Q3" },
  { name: "Agbami Medical & Engineering Scholarship", provider: "Agbami Partners", amount: 400000, level: "Undergraduate", deadline: "Q1" },
];

const EducationDashboard = () => {
  const [crowdfundAmount, setCrowdfundAmount] = useState("");
  const [dependents, setDependents] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showScholarshipDialog, setShowScholarshipDialog] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<typeof NIGERIAN_SCHOLARSHIPS[number] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newDep, setNewDep] = useState({ name: "", relationship: "Son", dateOfBirth: "", school: "", goal: "", cgpa: "", schoolYear: "", reason: "" });
  const [newCampaign, setNewCampaign] = useState({ name: "", description: "", goal: "", daysLeft: "30" });
  const [newApplication, setNewApplication] = useState({ applicantName: "", institution: "", course: "", level: "undergraduate", amount: "", reason: "", cgpa: "", schoolYear: "" });
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

  const fetchScholarships = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("scholarship_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setScholarships(data || []);
  };

  useEffect(() => {
    fetchDependents();
    fetchCampaigns();
    fetchScholarships();
  }, [user]);

  const handleShare = async (campaignName: string) => {
    const text = `Support "${campaignName}" — a medical fundraiser for a serviceman's family. Every donation helps cover treatment costs.`;
    if (navigator.share) {
      try { await navigator.share({ title: campaignName, text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Link copied", description: "Share it with friends and family to spread the word." });
  };

  const openScholarshipApply = (s: typeof NIGERIAN_SCHOLARSHIPS[number]) => {
    setSelectedScholarship(s);
    setNewApplication({ applicantName: "", institution: "", course: "", level: s.level.toLowerCase().includes("post") ? "postgraduate" : "undergraduate", amount: String(s.amount), reason: "", cgpa: "", schoolYear: "" });
    setShowScholarshipDialog(true);
  };

  const handleSubmitScholarship = async () => {
    if (!user || !selectedScholarship) return;
    if (!newApplication.applicantName.trim() || !newApplication.institution.trim() || !newApplication.course.trim()) {
      toast({ title: "Missing info", description: "Please complete the required fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("scholarship_applications").insert({
      user_id: user.id,
      scholarship_name: selectedScholarship.name,
      applicant_name: newApplication.applicantName.trim(),
      institution: newApplication.institution.trim(),
      course_of_study: newApplication.course.trim(),
      level: newApplication.level,
      amount_requested: Number(newApplication.amount) || 0,
      reason: newApplication.reason.trim() || null,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to submit application.", variant: "destructive" });
    } else {
      setShowScholarshipDialog(false);
      setSelectedScholarship(null);
      toast({ title: "Application Submitted", description: "Your scholarship application is pending admin verification." });
      fetchScholarships();
    }
    setSubmitting(false);
  };

  const handleWithdrawScholarship = async (id: string, name: string) => {
    if (!window.confirm(`Withdraw your application for "${name}"?`)) return;
    const { error } = await supabase.from("scholarship_applications").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Could not withdraw application.", variant: "destructive" });
    } else {
      toast({ title: "Withdrawn", description: "Application removed." });
      fetchScholarships();
    }
  };

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
      setNewDep({ name: "", relationship: "Son", dateOfBirth: "", school: "", goal: "", cgpa: "", schoolYear: "", reason: "" });
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
      toast({ title: "Campaign Submitted", description: "Your campaign has been submitted for admin approval. It will go live once approved." });
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

      {/* Start Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" /> Start Medical Fundraiser
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">Create a fundraiser to cover medical treatment, surgery, or recovery costs.</p>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Campaign Name *</Label>
              <Input
                placeholder="e.g. Help Cpl. Bello's Heart Surgery"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign((p) => ({ ...p, name: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Description</Label>
              <Textarea
                placeholder="Briefly describe the medical condition, treatment needed, and how funds will be used"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign((p) => ({ ...p, description: e.target.value }))}
                className="bg-secondary/50 border-border/50 min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Fundraising Goal (₦)</Label>
              <Input
                type="number"
                placeholder="e.g. 2000000"
                value={newCampaign.goal}
                onChange={(e) => setNewCampaign((p) => ({ ...p, goal: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Campaign Duration (days)</Label>
              <Select value={newCampaign.daysLeft} onValueChange={(v) => setNewCampaign((p) => ({ ...p, daysLeft: v }))}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="45">45 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gold" size="sm" onClick={handleStartCampaign} disabled={submitting}>
              <Heart className="h-3.5 w-3.5" /> {submitting ? "Submitting…" : "Submit for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medical crowdfunding removed — replaced by Transaction History route */}
      {/* Nigerian Scholarships Section */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> Nigerian Scholarships
          </CardTitle>
          <p className="text-xs text-muted-foreground">Apply for funded scholarships available to military personnel and dependents. All applications are verified by an admin.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* My applications */}
          {scholarships.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Applications</p>
              <div className="space-y-2">
                {scholarships.map((app) => {
                  const StatusIcon = statusIcons[app.status] || Clock;
                  return (
                    <div key={app.id} className="rounded-lg border border-border/30 bg-secondary/30 p-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground">{app.scholarship_name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {app.applicant_name} · {app.institution} · ₦{Number(app.amount_requested).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className={statusStyle[app.status] || "border-border/50"}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {app.status === "pending" ? "Pending Review" : app.status === "approved" ? "Approved" : "Rejected"}
                        </Badge>
                      </div>
                      {app.status === "rejected" && app.admin_note && (
                        <p className="text-[11px] text-destructive mt-2">Note: {app.admin_note}</p>
                      )}
                      {app.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-xs mt-2 h-7" onClick={() => handleWithdrawScholarship(app.id, app.scholarship_name)}>
                          <XCircle className="h-3 w-3" /> Withdraw application
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available scholarships */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Scholarships</p>
            <div className="grid gap-3 md:grid-cols-2">
              {NIGERIAN_SCHOLARSHIPS.map((s) => (
                <div key={s.name} className="rounded-lg border border-border/30 bg-secondary/30 p-4 hover:border-primary/40 transition-colors flex flex-col">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground leading-tight">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.provider}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">{s.level}</Badge>
                    <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" /> {s.deadline}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">
                      Up to ₦{(s.amount / 1000).toLocaleString()}K
                    </Badge>
                  </div>
                  <Button variant="gold-outline" size="sm" className="text-xs mt-4" onClick={() => openScholarshipApply(s)}>
                    <FileText className="h-3 w-3" /> Apply Now
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholarship Application Dialog */}
      <Dialog open={showScholarshipDialog} onOpenChange={setShowScholarshipDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> Apply for Scholarship
            </DialogTitle>
          </DialogHeader>
          {selectedScholarship && (
            <div className="rounded-md border border-border/40 bg-secondary/30 p-3 -mt-2">
              <p className="text-sm font-semibold text-foreground">{selectedScholarship.name}</p>
              <p className="text-[11px] text-muted-foreground">{selectedScholarship.provider} · {selectedScholarship.level}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Submitted applications are reviewed and verified by an admin before approval.</p>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Applicant Name *</Label>
              <Input
                placeholder="Full name of the applicant"
                value={newApplication.applicantName}
                onChange={(e) => setNewApplication((p) => ({ ...p, applicantName: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Institution *</Label>
              <Input
                placeholder="e.g. University of Lagos"
                value={newApplication.institution}
                onChange={(e) => setNewApplication((p) => ({ ...p, institution: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Course of Study *</Label>
              <Input
                placeholder="e.g. Mechanical Engineering"
                value={newApplication.course}
                onChange={(e) => setNewApplication((p) => ({ ...p, course: e.target.value }))}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Level</Label>
                <Select value={newApplication.level} onValueChange={(v) => setNewApplication((p) => ({ ...p, level: v }))}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Amount (₦)</Label>
                <Input
                  type="number"
                  value={newApplication.amount}
                  onChange={(e) => setNewApplication((p) => ({ ...p, amount: e.target.value }))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Reason for Application</Label>
              <Textarea
                placeholder="Briefly explain why you qualify and need this scholarship"
                value={newApplication.reason}
                onChange={(e) => setNewApplication((p) => ({ ...p, reason: e.target.value }))}
                className="bg-secondary/50 border-border/50 min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gold" size="sm" onClick={handleSubmitScholarship} disabled={submitting}>
              <FileText className="h-3.5 w-3.5" /> {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
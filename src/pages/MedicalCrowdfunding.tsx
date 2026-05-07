import { useEffect, useState } from "react";
import { HeartPulse, Stethoscope, Heart, Share2, Trash2, PlusCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const statusStyle: Record<string, string> = {
  approved: "bg-success/10 text-success border-success/20",
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  active: CheckCircle2,
  rejected: XCircle,
};

const MedicalCrowdfunding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [donateAmount, setDonateAmount] = useState("");
  const [form, setForm] = useState({ name: "", description: "", reason: "", goal: "", daysLeft: "30" });
  const [doc, setDoc] = useState<File | null>(null);

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from("crowdfund_campaigns")
      .select("*")
      .order("created_at", { ascending: false });
    setCampaigns(data || []);
  };

  useEffect(() => { fetchCampaigns(); }, [user]);

  const handleShare = async (name: string) => {
    const text = `Support "${name}" — a medical fundraiser for a serviceman's family. Every donation helps cover treatment costs.`;
    if (navigator.share) {
      try { await navigator.share({ title: name, text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    toast({ title: "Link copied", description: "Share with friends and family." });
  };

  const handleDonate = (name: string) => {
    if (!donateAmount || Number(donateAmount) <= 0) {
      toast({ title: "Enter amount", description: "Please enter a donation amount", variant: "destructive" });
      return;
    }
    toast({ title: "Donation Sent!", description: `₦${Number(donateAmount).toLocaleString()} contributed to ${name}` });
    setDonateAmount("");
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.name.trim()) {
      toast({ title: "Missing info", description: "Please enter a campaign name", variant: "destructive" });
      return;
    }
    if (!form.reason.trim()) {
      toast({ title: "Reason required", description: "Provide the medical reason for this fundraiser.", variant: "destructive" });
      return;
    }
    if (!doc) {
      toast({ title: "Documentation required", description: "Upload medical documentation for verification.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const ext = doc.name.split(".").pop() || "pdf";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage.from("medical-docs").upload(path, doc, { upsert: false });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("crowdfund_campaigns").insert({
      user_id: user.id,
      name: form.name.trim(),
      description: form.description.trim() || null,
      reason: form.reason.trim(),
      documentation_path: path,
      category: "medical",
      goal: Number(form.goal) || 500000,
      days_left: Number(form.daysLeft) || 30,
    });
    if (error) {
      toast({ title: "Error", description: "Failed to create fundraiser.", variant: "destructive" });
    } else {
      setForm({ name: "", description: "", reason: "", goal: "", daysLeft: "30" });
      setDoc(null);
      setShowDialog(false);
      toast({ title: "Submitted", description: "Your medical fundraiser is awaiting admin verification." });
      fetchCampaigns();
    }
    setSubmitting(false);
  };

  const handleWithdraw = async (id: string, name: string) => {
    if (!window.confirm(`Withdraw fundraiser "${name}"?`)) return;
    const { error } = await supabase.from("crowdfund_campaigns").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to withdraw.", variant: "destructive" });
    } else {
      toast({ title: "Withdrawn", description: `"${name}" has been removed.` });
      fetchCampaigns();
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-destructive" /> Medical Crowdfunding
          </h1>
          <p className="text-sm text-muted-foreground">Help fellow servicemen and families cover urgent medical costs. Reason and medical documentation required.</p>
        </div>
        <Button variant="gold" size="sm" onClick={() => setShowDialog(true)}>
          <PlusCircle className="h-3.5 w-3.5" /> Start Fundraiser
        </Button>
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-4 space-y-4">
          {campaigns.length === 0 && (
            <div className="text-center py-10 rounded-lg border border-dashed border-border/50">
              <Stethoscope className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No active medical fundraisers</p>
              <p className="text-xs text-muted-foreground/70 mt-1">Be the first to start one for a serviceman in need</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.map((c) => {
              const isOwner = c.user_id === user?.id;
              const goal = Number(c.goal) || 1;
              const raised = Number(c.raised) || 0;
              const pct = Math.min(100, Math.round((raised / goal) * 100));
              const StatusIcon = statusIcons[c.status] || Clock;
              return (
                <div key={c.id} className="rounded-xl border border-border/40 bg-secondary/30 overflow-hidden flex flex-col">
                  <div className="h-24 bg-gradient-to-br from-destructive/30 via-destructive/10 to-primary/20 flex items-center justify-center relative">
                    <HeartPulse className="h-10 w-10 text-destructive/80" />
                    <Badge variant="outline" className={`absolute top-2 right-2 text-[10px] ${statusStyle[c.status] || "border-border/50"}`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {c.status === "pending" ? "Pending Review" : c.status === "active" ? "Live" : c.status}
                    </Badge>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <p className="text-sm font-semibold text-foreground leading-tight">{c.name}</p>
                    {c.reason && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2"><span className="text-foreground/80 font-medium">Reason:</span> {c.reason}</p>
                    )}
                    {c.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{c.description}</p>
                    )}
                    <div className="mt-auto pt-2 space-y-2">
                      <Progress value={pct} className="h-1.5" />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-foreground">₦{raised.toLocaleString()} <span className="text-muted-foreground">of ₦{goal.toLocaleString()}</span></span>
                        <span className="text-muted-foreground">{pct}% · {c.backers || 0} backers</span>
                      </div>
                      {c.status === "pending" && isOwner && (
                        <div className="flex items-start gap-2 p-2 rounded-md bg-warning/5 border border-warning/15">
                          <Clock className="h-3 w-3 text-warning mt-0.5 shrink-0" />
                          <p className="text-[10px] text-warning">Awaiting admin verification of your medical documentation.</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {isOwner ? (
                          <Button variant="destructive" size="sm" className="text-xs flex-1" onClick={() => handleWithdraw(c.id, c.name)}>
                            <Trash2 className="h-3 w-3" /> Withdraw
                          </Button>
                        ) : (
                          <>
                            <Input
                              type="number"
                              placeholder="₦"
                              value={donateAmount}
                              onChange={(e) => setDonateAmount(e.target.value)}
                              className="h-8 text-xs bg-secondary/50 border-border/50 w-20"
                            />
                            <Button variant="gold" size="sm" className="text-xs flex-1" onClick={() => handleDonate(c.name)}>
                              <Heart className="h-3 w-3" /> Donate
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleShare(c.name)}>
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Start Fundraiser Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-destructive" /> Start Medical Fundraiser
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">Reason and medical documentation are required for admin verification.</p>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Campaign Name *</Label>
              <Input placeholder="e.g. Help Cpl. Bello's Heart Surgery" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Reason for Fundraiser *</Label>
              <Textarea placeholder="Patient's medical condition, diagnosis, and treatment plan" value={form.reason}
                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                className="bg-secondary/50 border-border/50 min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Story / Description</Label>
              <Textarea placeholder="Family, hospital, and how funds will be used" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-secondary/50 border-border/50 min-h-[70px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Medical Documentation *</Label>
              <Input type="file" accept="image/*,application/pdf"
                onChange={(e) => setDoc(e.target.files?.[0] || null)}
                className="bg-secondary/50 border-border/50 file:text-foreground" />
              <p className="text-[10px] text-muted-foreground">Hospital report, prescription, or referral letter (PDF / image). Securely stored, only visible to admin reviewers.</p>
              {doc && (
                <p className="text-[11px] text-success flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {doc.name}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Goal (₦)</Label>
                <Input type="number" placeholder="2000000" value={form.goal}
                  onChange={(e) => setForm((p) => ({ ...p, goal: e.target.value }))}
                  className="bg-secondary/50 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Duration</Label>
                <Select value={form.daysLeft} onValueChange={(v) => setForm((p) => ({ ...p, daysLeft: v }))}>
                  <SelectTrigger className="bg-secondary/50 border-border/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="45">45 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Cancel</Button>
            </DialogClose>
            <Button variant="gold" size="sm" onClick={handleSubmit} disabled={submitting}>
              <HeartPulse className="h-3.5 w-3.5" /> {submitting ? "Submitting…" : "Submit for Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalCrowdfunding;

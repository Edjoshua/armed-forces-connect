import { useEffect, useRef, useState } from "react";
import { Lock, User, Save, Eye, EyeOff, ShieldCheck, Camera, IdCard, Upload, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SettingsDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [savingName, setSavingName] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // KYC
  const [kyc, setKyc] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [faceCaptured, setFaceCaptured] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [idType, setIdType] = useState("national_id");
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("kyc_verifications").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setKyc(data);
        if (data.face_image_path) setStep(2);
      }
    })();
  }, [user]);

  const handleUpdateName = async () => {
    if (!fullName.trim()) return;
    setSavingName(true);
    try {
      const { error } = await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });
      if (error) throw error;
      await supabase.from("profiles").update({ full_name: fullName.trim() }).eq("user_id", user!.id);
      toast({ title: "Profile updated" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) return toast({ title: "Password too short", variant: "destructive" });
    if (newPassword !== confirmPassword) return toast({ title: "Passwords do not match", variant: "destructive" });
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Password updated" });
      setNewPassword(""); setConfirmPassword("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch {
      toast({ title: "Camera unavailable", description: "Please allow camera access.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    setStreaming(false);
  };

  const captureFace = async () => {
    if (!user || !videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL("image/jpeg", 0.85);
    setFaceCaptured(dataUrl);
    stopCamera();

    // Upload
    const blob = await (await fetch(dataUrl)).blob();
    const path = `${user.id}/face-${Date.now()}.jpg`;
    const { error: upErr } = await supabase.storage.from("kyc").upload(path, blob, { contentType: "image/jpeg", upsert: true });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("kyc_verifications").upsert({
      user_id: user.id, face_image_path: path, status: "pending",
    }, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Face verified", description: "Now upload your ID." });
      setStep(2);
      const { data } = await supabase.from("kyc_verifications").select("*").eq("user_id", user.id).maybeSingle();
      setKyc(data);
    }
  };

  const handleIdUpload = async (file: File) => {
    if (!user) return;
    setSubmittingKyc(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/id-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("kyc").upload(path, file, { upsert: true });
    if (upErr) {
      toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      setSubmittingKyc(false); return;
    }
    const { error } = await supabase.from("kyc_verifications").upsert({
      user_id: user.id, id_card_path: path, id_type: idType, status: "pending", submitted_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "KYC submitted", description: "Pending verification by admin." });
      const { data } = await supabase.from("kyc_verifications").select("*").eq("user_id", user.id).maybeSingle();
      setKyc(data);
    }
    setSubmittingKyc(false);
  };

  const statusBadge = () => {
    if (!kyc) return <Badge variant="outline" className="border-border/50 text-muted-foreground"><AlertCircle className="h-3 w-3 mr-1" /> Not Started</Badge>;
    if (kyc.status === "verified") return <Badge variant="outline" className="bg-success/10 text-success border-success/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</Badge>;
    if (kyc.status === "failed") return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
    return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
  };

  return (
    <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Profile, security, and KYC verification</p>
      </div>

      {/* KYC */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" /> KYC Verification</CardTitle>
              <CardDescription>Complete identity verification to unlock all features</CardDescription>
            </div>
            {statusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${step === 1 ? "bg-primary text-primary-foreground" : "bg-success/15 text-success"}`}>
              {kyc?.face_image_path ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Camera className="h-3.5 w-3.5" />} Step 1: Face
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${step === 2 ? "bg-primary text-primary-foreground" : kyc?.id_card_path ? "bg-success/15 text-success" : "bg-secondary/50 text-muted-foreground"}`}>
              {kyc?.id_card_path ? <CheckCircle2 className="h-3.5 w-3.5" /> : <IdCard className="h-3.5 w-3.5" />} Step 2: ID Card
            </div>
          </div>

          {step === 1 && !kyc?.face_image_path && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">Position your face in the frame and capture. This must be completed before uploading your ID.</p>
              <div className="rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                {streaming ? (
                  <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
                ) : faceCaptured ? (
                  <img src={faceCaptured} alt="Face capture" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                {!streaming ? (
                  <Button variant="gold" size="sm" onClick={startCamera}><Camera className="h-3.5 w-3.5" /> Start Camera</Button>
                ) : (
                  <>
                    <Button variant="gold" size="sm" onClick={captureFace}><Camera className="h-3.5 w-3.5" /> Capture</Button>
                    <Button variant="ghost" size="sm" onClick={stopCamera}>Cancel</Button>
                  </>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {kyc?.face_image_path && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-success/10 border border-success/20 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Face verification captured
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs">ID Type</Label>
                <select value={idType} onChange={(e) => setIdType(e.target.value)} className="w-full h-10 rounded-md border border-border/50 bg-secondary/50 px-3 text-sm">
                  <option value="national_id">National ID (NIN)</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers_license">Driver's License</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Upload ID Card</Label>
                <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0])} />
                <Button variant="gold-outline" size="sm" onClick={() => fileRef.current?.click()} disabled={submittingKyc}>
                  <Upload className="h-3.5 w-3.5" /> {submittingKyc ? "Uploading…" : kyc?.id_card_path ? "Replace ID Document" : "Upload ID Document"}
                </Button>
                {kyc?.id_card_path && (
                  <p className="text-[11px] text-success flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> ID uploaded — awaiting admin verification</p>
                )}
              </div>
              {!kyc?.face_image_path && (
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>← Back to face verification</Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-primary" /> Profile</CardTitle>
            <CardDescription>Update your display name</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ""} disabled className="bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-secondary/50 border-border/50" />
            </div>
            <Button onClick={handleUpdateName} disabled={savingName}>
              <Save className="h-4 w-4" /> {savingName ? "Saving…" : "Save Name"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Lock className="h-4 w-4 text-primary" /> Change Password</CardTitle>
            <CardDescription>Set a new password for your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border/50" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border/50" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleUpdatePassword} disabled={savingPassword}>
              <Lock className="h-4 w-4" /> {savingPassword ? "Updating…" : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsDashboard;

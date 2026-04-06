import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Calendar, Mail, IdCard, Star, Tag } from "lucide-react";
import { RANK_DISCOUNTS } from "@/components/MilitaryBarcodeCard";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const militaryId = user?.user_metadata?.military_id || "Not set";
  const dob = user?.user_metadata?.date_of_birth || "Not set";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const serviceStatus = profile?.service_status || "active";
  const currentRank = profile?.military_rank || "private";
  const rankInfo = RANK_DISCOUNTS[currentRank] || RANK_DISCOUNTS.private;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-3">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">{initials}</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-foreground">{userName}</h1>
        <Badge variant="outline" className={serviceStatus === "active" ? "bg-success/10 text-success border-success/20 mt-1" : "bg-muted text-muted-foreground mt-1"}>
          {serviceStatus === "active" ? "Active Service" : "Retired"}
        </Badge>
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <IdCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Military ID (MWIC)</p>
              <p className="text-sm font-medium text-foreground">{militaryId}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium text-foreground">{dob}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Service Status</p>
              <p className="text-sm font-medium text-foreground capitalize">{serviceStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Military Rank — Auto-verified from Military ID */}
      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> Military Rank</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Verified Rank (from Military ID)</p>
              <p className="text-sm font-semibold text-foreground">{rankInfo.label}</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Discount</p>
                <p className="text-sm font-semibold text-foreground">{rankInfo.label}</p>
              </div>
            </div>
            <p className="text-xl font-black text-primary">{rankInfo.discount}%</p>
          </div>

          <p className="text-[11px] text-muted-foreground italic">
            Your rank is automatically verified through your Military ID (MWIC) and cannot be changed manually.
          </p>
        </CardContent>
      </Card>

      {serviceStatus === "active" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Monthly Contribution Reminder</p>
                <p className="text-xs text-muted-foreground mt-1">
                  As an active service member, you are required to contribute <span className="font-bold text-primary">₦10,000</span> monthly to the Military Welfare Fund.
                </p>
                <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/20 text-[10px]">
                  Next due: 1st of next month
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;

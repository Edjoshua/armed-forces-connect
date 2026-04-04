import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Star } from "lucide-react";

const RANK_DISCOUNTS: Record<string, { label: string; discount: number; tier: string }> = {
  private: { label: "Private (Pvt)", discount: 10, tier: "Bronze" },
  corporal: { label: "Corporal (Cpl)", discount: 12, tier: "Bronze" },
  sergeant: { label: "Sergeant (Sgt)", discount: 15, tier: "Silver" },
  lieutenant: { label: "Lieutenant (Lt)", discount: 18, tier: "Silver" },
  captain: { label: "Captain (Capt)", discount: 20, tier: "Gold" },
  major: { label: "Major (Maj)", discount: 22, tier: "Gold" },
  colonel: { label: "Colonel (Col)", discount: 25, tier: "Platinum" },
  general: { label: "General (Gen)", discount: 30, tier: "Platinum" },
};

const TIER_COLORS: Record<string, string> = {
  Bronze: "bg-amber-700/20 text-amber-700 border-amber-700/30",
  Silver: "bg-muted text-muted-foreground border-border",
  Gold: "bg-primary/10 text-primary border-primary/20",
  Platinum: "bg-accent/10 text-accent border-accent/20",
};

const MilitaryBarcodeCard = ({ onDiscountReady }: { onDiscountReady: (discount: number) => void }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const militaryId = user?.user_metadata?.military_id || "MWIC-000000";

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          const rank = (data as any).military_rank || "private";
          const info = RANK_DISCOUNTS[rank] || RANK_DISCOUNTS.private;
          onDiscountReady(info.discount);
        }
      });
  }, [user]);

  const rank = profile?.military_rank || "private";
  const rankInfo = RANK_DISCOUNTS[rank] || RANK_DISCOUNTS.private;
  const serviceStatus = profile?.service_status || "active";
  const isActive = serviceStatus === "active";
  const tierColor = TIER_COLORS[rankInfo.tier] || TIER_COLORS.Bronze;

  // Generate barcode bars from military ID
  const barcodePattern = (militaryId || "000000").split("").map((char, i) => {
    const code = char.charCodeAt(0);
    return { width: (code % 3) + 1, gap: (code % 2) + 1, key: i };
  });

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header Strip */}
        <div className="bg-primary/10 px-4 py-2 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Military Welfare ID</span>
          </div>
          <Badge variant="outline" className={`text-[10px] ${tierColor}`}>
            {rankInfo.tier} Tier
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          {/* Profile Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground font-mono">{militaryId}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold text-foreground">{rankInfo.label}</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge
                variant="outline"
                className={isActive ? "bg-success/10 text-success border-success/20 text-[10px]" : "bg-destructive/10 text-destructive border-destructive/20 text-[10px]"}
              >
                {isActive ? "Active Duty" : "Retired"}
              </Badge>
              <p className="text-2xl font-black text-primary">{rankInfo.discount}%</p>
              <p className="text-[10px] text-muted-foreground">discount</p>
            </div>
          </div>

          {/* Barcode Visual */}
          <div className="bg-background rounded-lg p-3 border border-border/30">
            <div className="flex items-end justify-center gap-[1px] h-14">
              {barcodePattern.map((bar) => (
                <div
                  key={bar.key}
                  className="bg-foreground rounded-sm"
                  style={{
                    width: `${bar.width * 2}px`,
                    height: `${40 + (bar.width * 8)}%`,
                    marginRight: `${bar.gap}px`,
                  }}
                />
              ))}
            </div>
            <p className="text-center text-[10px] font-mono text-muted-foreground mt-1.5 tracking-[0.3em]">
              {militaryId.replace(/[^A-Z0-9]/gi, "").padEnd(12, "0").slice(0, 12)}
            </p>
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-2 p-2 rounded-md bg-success/5 border border-success/15">
            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            <p className="text-[11px] text-success font-medium">
              Identity verified — {rankInfo.discount}% military discount applied automatically
            </p>
          </div>

          {/* Signature Line */}
          <div className="pt-2 border-t border-border/30">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground">Authorized Signature</p>
                <p className="font-serif italic text-sm text-foreground/70 border-b border-foreground/20 pb-0.5 min-w-[140px]">
                  {userName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Valid</p>
                <p className="text-[10px] font-mono text-foreground/70">
                  {new Date().getFullYear()}/{new Date().getFullYear() + 1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RANK_DISCOUNTS };
export default MilitaryBarcodeCard;

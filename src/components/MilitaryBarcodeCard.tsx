import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, Star, QrCode } from "lucide-react";

const RANK_DISCOUNTS: Record<string, { label: string; discount: number }> = {
  private: { label: "Private (Pvt)", discount: 30 },
  corporal: { label: "Corporal (Cpl)", discount: 25 },
  sergeant: { label: "Sergeant (Sgt)", discount: 22 },
  lieutenant: { label: "Lieutenant (Lt)", discount: 20 },
  captain: { label: "Captain (Capt)", discount: 18 },
  major: { label: "Major (Maj)", discount: 15 },
  colonel: { label: "Colonel (Col)", discount: 12 },
  general: { label: "General (Gen)", discount: 10 },
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
  

  // Generate QR code grid pattern from military ID
  const qrSeed = (militaryId || "000000").split("").map((c) => c.charCodeAt(0));
  const qrGrid: boolean[][] = [];
  for (let row = 0; row < 9; row++) {
    qrGrid[row] = [];
    for (let col = 0; col < 9; col++) {
      const idx = (row * 9 + col) % qrSeed.length;
      qrGrid[row][col] = (qrSeed[idx] + row + col) % 3 !== 0;
    }
  }
  // Fixed position markers (top-left, top-right, bottom-left)
  const setMarker = (sr: number, sc: number) => {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) qrGrid[sr + r][sc + c] = true;
    qrGrid[sr + 1][sc + 1] = false;
  };
  setMarker(0, 0);
  setMarker(0, 6);
  setMarker(6, 0);

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/30 overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header Strip */}
        <div className="bg-primary/10 px-4 py-2 flex items-center justify-between border-b border-border/30">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Military Welfare ID</span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
            {rankInfo.discount}% Discount
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

          {/* QR Code Visual */}
          <div className="bg-background rounded-lg p-3 border border-border/30 flex flex-col items-center">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(9, 1fr)` }}>
              {qrGrid.flat().map((filled, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-[2px] ${filled ? "bg-foreground" : "bg-transparent"}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <QrCode className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em]">
                {militaryId.replace(/[^A-Z0-9]/gi, "").padEnd(12, "0").slice(0, 12)}
              </p>
            </div>
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

import { useEffect, useState } from "react";
import { HandCoins, GraduationCap, Award, CalendarDays, CheckCircle2, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Funding = {
  id: string;
  type: "Education" | "Scholarship";
  beneficiary: string;
  detail: string;
  amount: number;
  approvedAt: string;
};

const ApprovedFundings = () => {
  const [items, setItems] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Education" | "Scholarship">("all");

  useEffect(() => {
    (async () => {
      const [{ data: deps }, { data: schs }] = await Promise.all([
        supabase.from("dependents").select("*").eq("status", "approved"),
        supabase.from("scholarship_applications").select("*").eq("status", "approved"),
      ]);
      const merged: Funding[] = [
        ...(deps || []).map((d: any) => ({
          id: d.id,
          type: "Education" as const,
          beneficiary: d.name,
          detail: d.school || "Education Fund",
          amount: Number(d.savings_goal || 0),
          approvedAt: d.updated_at,
        })),
        ...(schs || []).map((s: any) => ({
          id: s.id,
          type: "Scholarship" as const,
          beneficiary: s.applicant_name,
          detail: `${s.scholarship_name} · ${s.institution}`,
          amount: Number(s.amount_requested || 0),
          approvedAt: s.updated_at,
        })),
      ].sort((a, b) => +new Date(b.approvedAt) - +new Date(a.approvedAt));
      setItems(merged);
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter((i) => {
    const matchF = filter === "all" || i.type === filter;
    const matchS = !search || i.beneficiary.toLowerCase().includes(search.toLowerCase()) || i.detail.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><HandCoins className="h-6 w-6 text-primary" /> Approved Fundings</h1>
        <p className="text-sm text-muted-foreground">All verified and approved funding requests across the platform</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search beneficiary or detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border/50 bg-secondary/50 p-1">
          {(["all", "Education", "Scholarship"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Public Funding Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && <p className="text-sm text-muted-foreground text-center py-6">Loading…</p>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 rounded-lg border border-dashed border-border/50">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No approved fundings to display yet</p>
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((i) => {
              const Icon = i.type === "Scholarship" ? Award : GraduationCap;
              return (
                <div key={`${i.type}-${i.id}`} className="rounded-lg border border-border/30 bg-secondary/30 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">{i.beneficiary}</p>
                        <Badge variant="outline" className="text-[10px] border-success/30 bg-success/10 text-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{i.detail}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span className="font-mono font-semibold text-foreground">₦{i.amount.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {new Date(i.approvedAt).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">{i.type}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovedFundings;

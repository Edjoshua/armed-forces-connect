import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const TYPE_LABEL: Record<string, string> = {
  credit: "Credit",
  debit: "Debit",
  withdrawal: "Withdrawal",
  funding_received: "Funding In",
  funding_sent: "Funding Out",
};

const TransactionHistory = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRows(data || []);
      setLoading(false);
    })();
  }, [user]);

  const filtered = rows.filter((t) => {
    const matchSearch = !search || t.description?.toLowerCase().includes(search.toLowerCase()) || t.reference?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.type === typeFilter;
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchDate = !dateFilter || t.created_at?.startsWith(dateFilter);
    return matchSearch && matchType && matchStatus && matchDate;
  });

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        <p className="text-sm text-muted-foreground">Funding received, funding sent, withdrawals, and payments</p>
      </div>

      <div className="grid gap-2 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search description or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 rounded-md border border-border/50 bg-secondary/50 px-3 text-sm">
          <option value="all">All types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
          <option value="withdrawal">Withdrawal</option>
          <option value="funding_received">Funding In</option>
          <option value="funding_sent">Funding Out</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-border/50 bg-secondary/50 px-3 text-sm">
          <option value="all">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-secondary/50 border-border/50 md:col-span-4" />
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {loading && <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>}
            {!loading && filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No transactions found</div>
            )}
            {filtered.map((t) => {
              const isCredit = t.type === "credit" || t.type === "funding_received";
              return (
                <div key={t.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${isCredit ? "bg-success/10" : "bg-destructive/10"}`}>
                      {isCredit ? <ArrowDownLeft className="h-4 w-4 text-success" /> : <ArrowUpRight className="h-4 w-4 text-destructive" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString()} · {TYPE_LABEL[t.type] || t.type}
                        {t.category ? ` · ${t.category}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono font-medium ${isCredit ? "text-success" : "text-foreground"}`}>
                      {isCredit ? "+" : "-"}₦{Number(t.amount).toLocaleString()}
                    </p>
                    <Badge variant="outline" className={`text-[10px] ${
                      t.status === "completed" ? "border-success/20 text-success" :
                      t.status === "pending" ? "border-warning/20 text-warning" :
                      "border-destructive/20 text-destructive"
                    }`}>
                      {t.status}
                    </Badge>
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

export default TransactionHistory;

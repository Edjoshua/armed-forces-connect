import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const allTransactions = [
  { id: "TXN-8821", type: "credit", description: "Salary Credit", amount: "+₦450,000", date: "Mar 31, 2026", status: "Completed" },
  { id: "TXN-8820", type: "debit", description: "ShopRite - Groceries", amount: "-₦12,500", date: "Mar 30, 2026", status: "Completed" },
  { id: "TXN-8819", type: "debit", description: "Transfer to SGT. Bello", amount: "-₦25,000", date: "Mar 29, 2026", status: "Completed" },
  { id: "TXN-8818", type: "credit", description: "Education Fund Rebate", amount: "+₦35,000", date: "Mar 28, 2026", status: "Completed" },
  { id: "TXN-8817", type: "debit", description: "MedPlus Pharmacy", amount: "-₦8,200", date: "Mar 27, 2026", status: "Pending" },
  { id: "TXN-8816", type: "debit", description: "Welfare Fund Contribution", amount: "-₦10,000", date: "Mar 25, 2026", status: "Completed" },
  { id: "TXN-8815", type: "credit", description: "Supply Reimbursement", amount: "+₦15,000", date: "Mar 24, 2026", status: "Completed" },
  { id: "TXN-8814", type: "debit", description: "Total Energies - Fuel", amount: "-₦22,000", date: "Mar 23, 2026", status: "Completed" },
  { id: "TXN-8813", type: "credit", description: "Discount Cashback", amount: "+₦3,200", date: "Mar 22, 2026", status: "Completed" },
  { id: "TXN-8812", type: "debit", description: "SPAR Kaduna", amount: "-₦9,800", date: "Mar 21, 2026", status: "Completed" },
];

const TransactionHistory = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  const filtered = allTransactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Transaction History</h1>
        <p className="text-sm text-muted-foreground">All your transactions in one place</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border/50 bg-secondary/50 p-1">
          {(["all", "credit", "debit"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "All" : f === "credit" ? "In" : "Out"}
            </button>
          ))}
        </div>
      </div>

      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${t.type === "credit" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {t.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{t.date} · {t.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono font-medium ${t.type === "credit" ? "text-success" : "text-foreground"}`}>
                    {t.amount}
                  </p>
                  <Badge variant="outline" className={`text-[10px] ${t.status === "Completed" ? "border-success/20 text-success" : "border-warning/20 text-warning"}`}>
                    {t.status}
                  </Badge>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;

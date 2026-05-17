import * as React from "react";
import { Activity, Database, Shield, Server, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HermesAgentProdSmoke() {
  const [armed, setArmed] = React.useState(false);

  return (
    <button
      type="button"
      onClick={() => setArmed((value) => !value)}
      className={[
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border px-5 py-3 text-sm font-medium shadow-sm transition-all duration-300",
        armed
          ? "border-success bg-success text-white shadow-success/25"
          : "border-border bg-card text-foreground hover:border-primary/30 hover:shadow-md",
      ].join(" ")}
    >
      <span
        className={[
          "h-2.5 w-2.5 rounded-full transition-all duration-300",
          armed ? "bg-white shadow-[0_0_18px_rgba(255,255,255,0.9)]" : "bg-success",
        ].join(" ")}
      />
      <span>Hermes production smoke</span>
      <span className="text-xs opacity-70">{armed ? "verified" : "ready"}</span>
    </button>
  );
}

interface StatusCardProps {
  title: string;
  status: "healthy" | "warning" | "error";
  lastChecked: string;
  icon: React.ElementType;
}

function StatusCard({ title, status, lastChecked, icon: Icon }: StatusCardProps) {
  const statusConfig = {
    healthy: { color: "text-success", bg: "bg-success/10", border: "border-success/20", icon: CheckCircle },
    warning: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", icon: AlertTriangle },
    error: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", icon: AlertTriangle },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className={`border ${config.border} ${config.bg}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg p-2 ${config.bg}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{lastChecked}</p>
            </div>
          </div>
          <StatusIcon className={`h-5 w-5 ${config.color}`} />
        </div>
      </CardContent>
    </Card>
  );
}

interface SmokeLogEntry {
  id: string;
  timestamp: string;
  component: string;
  status: "pass" | "fail" | "running";
  duration: string;
  message: string;
}

const mockLogs: SmokeLogEntry[] = [
  { id: "SMK-001", timestamp: "2026-05-17 22:45:12", component: "Auth Service", status: "pass", duration: "124ms", message: "JWT token validation successful" },
  { id: "SMK-002", timestamp: "2026-05-17 22:45:13", component: "Database", status: "pass", duration: "89ms", message: "PostgreSQL connection pool healthy" },
  { id: "SMK-003", timestamp: "2026-05-17 22:45:14", component: "API Gateway", status: "pass", duration: "45ms", message: "All endpoints responding within SLA" },
  { id: "SMK-004", timestamp: "2026-05-17 22:45:15", component: "Storage", status: "pass", duration: "201ms", message: "File upload/download cycle verified" },
  { id: "SMK-005", timestamp: "2026-05-17 22:45:16", component: "Edge Functions", status: "pass", duration: "312ms", message: "Cold start and warm execution OK" },
];

export default function ProductionSmoke() {
  const [logs] = React.useState<SmokeLogEntry[]>(mockLogs);
  const [overallStatus, setOverallStatus] = React.useState<"healthy" | "warning" | "error">("healthy");

  const allPassed = logs.every((log) => log.status === "pass");
  const hasFailures = logs.some((log) => log.status === "fail");

  React.useEffect(() => {
    if (hasFailures) setOverallStatus("error");
    else if (!allPassed) setOverallStatus("warning");
    else setOverallStatus("healthy");
  }, [allPassed, hasFailures]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Production Smoke</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">System health verification and deployment checks</p>
      </div>

      {/* Overall Status Banner */}
      <Card className={`border ${overallStatus === "healthy" ? "border-success/30 bg-success/5" : overallStatus === "warning" ? "border-warning/30 bg-warning/5" : "border-destructive/30 bg-destructive/5"}`}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className={`rounded-full p-3 ${overallStatus === "healthy" ? "bg-success/10" : overallStatus === "warning" ? "bg-warning/10" : "bg-destructive/10"}`}>
            <Activity className={`h-6 w-6 ${overallStatus === "healthy" ? "text-success" : overallStatus === "warning" ? "text-warning" : "text-destructive"}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              {overallStatus === "healthy" ? "All Systems Operational" : overallStatus === "warning" ? "Systems Degraded" : "Critical Issues Detected"}
            </p>
            <p className="text-xs text-muted-foreground">
              Last smoke test: {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{logs.filter((l) => l.status === "pass").length}/{logs.length}</p>
            <p className="text-xs text-muted-foreground">checks passed</p>
          </div>
        </CardContent>
      </Card>

      {/* Smoke Test Trigger */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manual Smoke Trigger</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center justify-center gap-4 py-8">
          <HermesAgentProdSmoke />
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Toggle to run a comprehensive production smoke test. This validates all critical paths including auth, database, storage, and edge functions.
          </p>
        </CardContent>
      </Card>

      {/* Status Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatusCard title="Auth Service" status="healthy" lastChecked="2 min ago" icon={Shield} />
        <StatusCard title="Database" status="healthy" lastChecked="2 min ago" icon={Database} />
        <StatusCard title="API Gateway" status="healthy" lastChecked="2 min ago" icon={Server} />
        <StatusCard title="Edge Functions" status="healthy" lastChecked="2 min ago" icon={Activity} />
      </div>

      {/* Test Log */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Smoke Tests</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Auto-refreshes</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-border/30">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`rounded-full p-2 shrink-0 ${log.status === "pass" ? "bg-success/10" : log.status === "fail" ? "bg-destructive/10" : "bg-warning/10"}`}>
                    {log.status === "pass" ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : log.status === "fail" ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Activity className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{log.component}</p>
                    <p className="text-xs text-muted-foreground truncate">{log.message}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-mono font-medium text-foreground">{log.duration}</p>
                  <p className="text-xs text-muted-foreground">{log.timestamp.split(" ")[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Settings, Shield, Lock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsDashboard = () => (
  <div className="space-y-6 p-4 pt-14 md:p-6 md:pt-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
      <p className="text-sm text-muted-foreground">Platform configuration and security preferences</p>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Lock className="h-4 w-4 text-primary" /> Security</CardTitle>
          <CardDescription>Authentication and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Multi-Factor Authentication", desc: "Require MFA for all admin accounts", defaultChecked: true },
            { label: "Biometric Verification", desc: "Enable fingerprint/face ID for mobile", defaultChecked: false },
            { label: "Session Timeout", desc: "Auto-logout after 15 minutes of inactivity", defaultChecked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
              <div>
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" /> Notifications</CardTitle>
          <CardDescription>Alert preferences and reporting schedule</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Fraud Alert Notifications", desc: "Immediate alerts for flagged transactions", defaultChecked: true },
            { label: "Supply Chain Updates", desc: "Real-time shipment status notifications", defaultChecked: true },
            { label: "Monthly Audit Reports", desc: "Auto-generated compliance reports", defaultChecked: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/30 bg-secondary/30 p-3">
              <div>
                <Label className="text-sm font-medium">{item.label}</Label>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default SettingsDashboard;

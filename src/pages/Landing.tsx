import { useNavigate } from "react-router-dom";
import { Shield, ShoppingBag, Truck, GraduationCap, ClipboardCheck, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: ShoppingBag, title: "Retail Discounts", desc: "Exclusive discounts for armed forces personnel at partner retailers nationwide" },
  { icon: Truck, title: "Supply Chain", desc: "Real-time battlefield essential goods tracking and logistics management" },
  { icon: GraduationCap, title: "Education Fund", desc: "Education savings and scholarship management for military families" },
  { icon: ClipboardCheck, title: "Audit System", desc: "Independent compliance monitoring with immutable audit trails" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-sm font-bold tracking-wide text-foreground">MWCIP</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Military Welfare Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="gold-outline" size="sm" onClick={() => navigate("/dashboard")}>
              <Lock className="h-3.5 w-3.5" />
              Access Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-primary">System Operational</span>
            </div>
            <h1 className="text-4xl font-black leading-tight text-foreground lg:text-5xl">
              Military Welfare &<br />
              <span className="text-gradient-gold">Civil Integration</span><br />
              Platform
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground max-w-lg">
              A secure, government-grade digital platform supporting the Nigerian Armed Forces welfare system — from retail benefits to education advancement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="gold" size="lg" onClick={() => navigate("/dashboard")}>
                Enter Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="gold-outline" size="lg">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="group border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <p className="text-xs text-muted-foreground">© 2026 Nigerian Armed Forces — MWCIP. Classified.</p>
          <div className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-success" />
            <span className="text-xs text-muted-foreground">End-to-end encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

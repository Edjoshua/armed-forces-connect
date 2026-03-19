import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md shadow-xl border-border/50 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Tab Toggle */}
          <div className="flex bg-muted rounded-t-2xl m-6 mb-0 overflow-hidden">
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 text-sm font-semibold transition-all rounded-l-xl ${
                activeTab === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-sm font-semibold transition-all rounded-r-xl ${
                activeTab === "login"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log in
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-8 space-y-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                {activeTab === "login" ? "Log in" : "Sign up"}
              </h2>
            </div>

            {activeTab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-muted-foreground text-xs">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border-border"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground text-xs">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-border"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-muted-foreground text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border-border"
              />
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full rounded-xl h-12 text-base"
            >
              {activeTab === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;

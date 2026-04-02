import { useState } from "react";
import { useNavigate } from "react-router-dom";
import militaryCrest from "@/assets/nigerian-military-crest.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [militaryId, setMilitaryId] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "signup") {
        if (!militaryId.trim()) {
          toast({ title: "Error", description: "Military ID is required", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, military_id: militaryId, date_of_birth: dateOfBirth },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: "Account created",
          description: "Check your email to verify your account, or sign in if auto-confirm is enabled.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="p-6 pt-8 space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={militaryCrest} alt="Nigerian Military Crest" className="h-8 w-8 object-contain" />
              <h2 className="text-xl font-bold text-foreground">
                {activeTab === "login" ? "Log in" : "Sign up"}
              </h2>
            </div>

            {activeTab === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-muted-foreground text-xs">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="militaryId" className="text-muted-foreground text-xs">Military ID (MWIC)</Label>
                  <Input
                    id="militaryId"
                    type="text"
                    value={militaryId}
                    onChange={(e) => setMilitaryId(e.target.value)}
                    placeholder="e.g. NA/12345/6789"
                    className="rounded-lg border-border"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="text-muted-foreground text-xs">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="rounded-lg border-border"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-muted-foreground text-xs">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border-border"
                required
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
                minLength={6}
                required
              />
            </div>

            {activeTab === "login" && (
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="text-xs text-primary hover:underline self-end -mt-2"
              >
                Forgot password?
              </button>
            )}

            <Button
              type="submit"
              variant="gold"
              className="w-full rounded-xl h-12 text-base"
              disabled={loading}
            >
              {loading ? "Please wait..." : activeTab === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landing;

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import militaryCrest from "@/assets/nigerian-military-crest.png";

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
      <div className="flex items-center gap-2">
        <img src={militaryCrest} alt="Crest" className="h-7 w-7 object-contain" />
        <span className="text-sm font-bold tracking-wide text-foreground">MWCIP</span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/dashboard/profile")} className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;

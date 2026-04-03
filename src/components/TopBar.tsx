import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Truck, HeadphonesIcon, Settings, User, ClipboardCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import militaryCrest from "@/assets/nigerian-military-crest.png";

const profileMenuItems = [
  { label: "My Profile", icon: User, path: "/dashboard/profile" },
  { label: "Supply Chain", icon: Truck, path: "/dashboard/supply" },
  { label: "Audit & Compliance", icon: ClipboardCheck, path: "/dashboard/audit" },
  { label: "Support", icon: HeadphonesIcon, path: "/dashboard/support" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
      <div className="flex items-center gap-2 min-w-0">
        <img src={militaryCrest} alt="Crest" className="h-7 w-7 shrink-0 object-contain" />
        <span className="text-sm font-bold tracking-wide text-foreground truncate">MWCIP</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 outline-none">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {profileMenuItems.map((item) => (
            <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="gap-2 cursor-pointer">
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => { await signOut(); navigate("/"); }}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopBar;

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, HeadphonesIcon, Settings, User, Bell, HandCoins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import militaryCrest from "@/assets/nigerian-military-crest.png";

const profileMenuItems = [
  { label: "My Profile", icon: User, path: "/dashboard/profile", badge: 0 },
  { label: "Approved Fundings", icon: HandCoins, path: "/dashboard/approved-fundings", badge: 0 },
  { label: "Support", icon: HeadphonesIcon, path: "/dashboard/support", badge: 2 },
  { label: "Settings", icon: Settings, path: "/dashboard/settings", badge: 0 },
];

const TopBar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const totalBadges = profileMenuItems.reduce((sum, item) => sum + item.badge, 0);

  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border/50 bg-card">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <img src={militaryCrest} alt="Crest" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 object-contain" />
        <span className="text-sm sm:text-base font-bold tracking-wide text-foreground truncate">MWCIP</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notification bell */}
        <button className="relative text-muted-foreground hover:text-foreground transition-colors p-1">
          <Bell className="h-5 w-5" />
          {totalBadges > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
              {totalBadges > 9 ? "9+" : totalBadges}
            </span>
          )}
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex items-center outline-none">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              {totalBadges > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive border-2 border-card" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {profileMenuItems.map((item) => (
              <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)} className="gap-2 cursor-pointer">
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">
                    {item.badge}
                  </span>
                )}
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
      </div>
    </header>
  );
};

export default TopBar;

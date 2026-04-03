import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-y-auto overscroll-contain pb-[4.5rem]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;

// src/app/layouts/UserLayout.tsx
import UserSidebar from "@/widgets/Sidebar/UserSidebar";
import Navbar from "@/widgets/Navbar/Navbar";
import Footer from "@/widgets/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <UserSidebar />

        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

// src/app/layouts/AdminLayout.tsx
import AdminSidebar from "@/widgets/Sidebar/AdminSidebar";
import AdminTopbar from "@/widgets/Topbar/AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <AdminTopbar />

        {/* Page content */}
        <main className="flex-1 p-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

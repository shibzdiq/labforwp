// src/app/layouts/GuestLayout.tsx
import Navbar from "@/widgets/Navbar/Navbar";
import Footer from "@/widgets/Footer/Footer";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

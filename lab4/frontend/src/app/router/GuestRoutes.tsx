import { Route } from "react-router-dom";
import GuestLayout from "@/app/layouts/GuestLayout";

import HomePage from "@/pages/Home/HomePage";
import ShopPage from "@/pages/Shop/ShopPage";
import ProductPage from "@/pages/Product/ProductPage";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import NotFound from "@/pages/NotFound/NotFound";

export const GuestRoutes = (
  <Route element={<GuestLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/product/:id" element={<ProductPage />} />

    {/* Auth */}
    <Route path="/auth/login" element={<LoginPage />} />
    <Route path="/auth/register" element={<RegisterPage />} />

    <Route path="*" element={<NotFound />} />
  </Route>
);

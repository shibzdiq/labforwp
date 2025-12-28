import { Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import AdminLayout from "@/app/layouts/AdminLayout";

import DashboardPage from "@/admin/Dashboard/DashboardPage";
import ProductsList from "@/admin/Products/ProductsList";
import ProductCreate from "@/admin/Products/ProductCreate";
import ProductEdit from "@/admin/Products/ProductEdit";

import CategoriesList from "@/admin/Categories/CategoriesList";
import CategoryCreate from "@/admin/Categories/CategoryCreate";
import CategoryEdit from "@/admin/Categories/CategoryEdit";

import OrdersPage from "@/admin/Orders/OrdersPage";
import OrderDetails  from "@/admin/Orders/OrderDetails";

import UsersList from "@/admin/Users/UsersList";
import UserEdit from "@/admin/Users/UserEdit";

import FilesManager from "@/admin/Files/FilesManager";
import ReviewsAdmin from "@/admin/Reviews/ReviewsAdmin";

export const AdminRoutes = (
  <Route
    element={
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    }
  >
    <Route path="/admin" element={<DashboardPage />} />

    <Route path="/admin/products" element={<ProductsList />} />
    <Route path="/admin/products/create" element={<ProductCreate />} />
    <Route path="/admin/products/:id" element={<ProductEdit />} />

    <Route path="/admin/categories" element={<CategoriesList />} />
    <Route path="/admin/categories/create" element={<CategoryCreate />} />
    <Route path="/admin/categories/:id" element={<CategoryEdit />} />

    <Route path="/admin/orders" element={<OrdersPage />} />
    <Route path="/admin/orders/:id" element={<OrderDetails />} />

    <Route path="/admin/users" element={<UsersList />} />
    <Route path="/admin/users/:id" element={<UserEdit />} />

    <Route path="/admin/files" element={<FilesManager />} />
    <Route path="/admin/reviews" element={<ReviewsAdmin />} />
  </Route>
);

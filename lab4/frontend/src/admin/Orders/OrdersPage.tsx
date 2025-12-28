import { useOrders } from "@/features/orders/hooks/useOrders";
import { OrderList } from "./OrdersList";
import Loader from "@/shared/ui/Loader";

export default function OrdersPage() {
  const { orders, loading, error, fetchOrders } = useOrders();

  if (loading) return <Loader />;
  if (error) return <div className="text-red-400">Помилка</div>;

  return <OrderList orders={orders} />;
}

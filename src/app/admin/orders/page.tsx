import { getOrders } from "@/actions/orders";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
  const orders = await getOrders();
  
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-2">Food Orders Manager</h1>
            <p className="text-neutral-400">Track requested meals, update cooking status, and generate invoices.</p>
         </div>
      </div>
      <OrdersClient orders={orders} />
    </div>
  );
}

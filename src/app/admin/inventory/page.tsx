import { getInventoryItems } from "@/actions/inventory";
import InventoryClient from "./InventoryClient";

export default async function InventoryPage() {
  const items = await getInventoryItems();
  
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-2">Inventory System</h1>
            <p className="text-neutral-400">Manage your raw materials, ingredients, and equipment stock.</p>
         </div>
      </div>
      
      <InventoryClient items={items} />
    </div>
  );
}

import { getMenuItems } from "@/actions/menu";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
  const items = await getMenuItems();
  
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-2">Menu Manager</h1>
            <p className="text-neutral-400">Add food items, set dynamic pricing, and manage order due dates.</p>
         </div>
      </div>
      
      <MenuClient items={items} />
    </div>
  );
}

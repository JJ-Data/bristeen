import { getInvoices } from "@/actions/invoices";
import InvoicesClient from "./InvoicesClient";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-2">Invoices & Payments</h1>
            <p className="text-neutral-400">Track all generated invoices from Orders and Events, and verify payments.</p>
         </div>
      </div>
      
      <InvoicesClient invoices={invoices} />
    </div>
  );
}

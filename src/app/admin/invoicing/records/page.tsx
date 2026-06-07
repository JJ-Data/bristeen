import { getInvoices } from "@/actions/invoices";
import RecordsClient from "./RecordsClient";

export default async function InvoiceRecordsPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
        <p className="text-gray-500 text-sm mt-1">
          Invoices auto-generated from confirmed bookings and food orders — track and verify payments here.
        </p>
      </div>

      <RecordsClient invoices={invoices} />
    </div>
  );
}

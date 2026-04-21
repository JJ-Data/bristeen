import { getBookings } from "@/actions/bookings";
import BookingsClient from "./BookingsClient";

export default async function BookingsPage() {
  const bookings = await getBookings();
  
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between">
         <div>
            <h1 className="text-3xl font-bold mb-2">Events & Bookings</h1>
            <p className="text-neutral-400">Review upcoming events, confirm availability, and manage client requests.</p>
         </div>
      </div>
      
      <BookingsClient bookings={bookings} />
    </div>
  );
}

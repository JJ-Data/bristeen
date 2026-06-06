import { auth } from "@/auth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userName = session?.user?.name ?? "Admin";

  return (
    <div className="flex h-screen bg-background text-white font-sans overflow-hidden">
      <AdminSidebar userName={userName} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-background/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
            Dashboard Portal
          </h2>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">Hello, {userName}</div>
              <div className="text-xs text-rose-400">CEO / Manager</div>
            </div>
            <div className="size-10 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 border-2 border-neutral-800" />
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          {children}
        </div>
      </main>
    </div>
  );
}

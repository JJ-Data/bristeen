import PublicNavbar from "@/components/layout/PublicNavbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden font-sans select-none selection:bg-rose-500 selection:text-white relative">
      <PublicNavbar />
      {children}
    </div>
  );
}

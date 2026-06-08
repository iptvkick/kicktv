import { BottomNavBar } from "@/components/ui/BottomNavBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-950">
      <main className="w-full max-w-md min-h-screen bg-black relative border-x border-white/5 pb-24 flex flex-col">
        {children}
        <BottomNavBar role="admin" />
      </main>
    </div>
  );
}

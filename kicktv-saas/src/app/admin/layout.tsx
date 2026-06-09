import { AdminSidebar } from "@/components/ui/AdminSidebar";
import { BottomNavBar } from "@/components/ui/BottomNavBar";
import PageTransition from "@/components/ui/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f7]">
      {/* Sidebar Desktop Fixa */}
      <AdminSidebar />
      
      {/* Conteúdo Principal Flexível (Widescreen) */}
      <main className="flex-1 min-h-screen relative flex flex-col max-w-full pb-24 md:pb-0 overflow-x-hidden">
        <PageTransition>
          {children}
        </PageTransition>
        
        {/* BottomNavBar apenas no Mobile, escondida no Desktop */}
        <div className="md:hidden">
          <BottomNavBar role="admin" />
        </div>
      </main>
    </div>
  );
}

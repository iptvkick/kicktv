import { BottomNavBar } from "@/components/ui/BottomNavBar";
import PageTransition from "@/components/ui/PageTransition";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5f6f7]">
      <main className="w-full max-w-md min-h-screen bg-white relative shadow-lg pb-24 flex flex-col overflow-x-hidden">
        <PageTransition>
          {children}
        </PageTransition>
        <BottomNavBar role="client" />
      </main>
    </div>
  );
}

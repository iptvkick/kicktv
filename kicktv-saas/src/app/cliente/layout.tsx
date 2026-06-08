import { FloatingNav } from "@/components/ui/FloatingNav";

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {children}
      <FloatingNav />
    </div>
  );
}

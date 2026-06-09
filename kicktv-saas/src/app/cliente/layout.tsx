import { BottomNavBar } from "@/components/ui/BottomNavBar";
import PageTransition from "@/components/ui/PageTransition";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin/dashboard");
  }

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

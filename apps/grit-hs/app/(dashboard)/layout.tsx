import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AmbientGlow } from "@/components/layout/ambient-glow";
import { MOCK_STUDENT } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let studentName: string = MOCK_STUDENT.fullName;
  let xp: number = MOCK_STUDENT.xpPoints;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, xp_points")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        studentName = profile.full_name ?? studentName;
        xp = profile.xp_points ?? xp;
      }
    }
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-background">
      <AmbientGlow />
      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header studentName={studentName} xp={xp} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

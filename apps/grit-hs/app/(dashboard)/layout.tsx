import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AmbientGlow } from "@/components/layout/ambient-glow";
import { MOCK_STUDENT } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-dvh overflow-hidden bg-background">
      <AmbientGlow />
      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header studentName={MOCK_STUDENT.fullName} xp={MOCK_STUDENT.xpPoints} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

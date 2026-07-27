import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MOCK_STUDENT } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header studentName={MOCK_STUDENT.fullName} xp={MOCK_STUDENT.xpPoints} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

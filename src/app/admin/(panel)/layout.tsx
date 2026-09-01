import { getAdminSession } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already guarantees a valid session for every route in this group.
  const session = await getAdminSession();

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar email={session?.email ?? ""} />
        <main className="flex-1 bg-[#0f0f0f] p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

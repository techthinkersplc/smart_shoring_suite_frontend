import { DashboardLayout } from "./layout/DashboardLayout";
import { AuthGuard } from "./guards/middleware";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}

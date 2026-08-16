import { DashboardLayout } from "./layout/DashboardLayout";
import { AuthGuard } from "./guards/middleware";
import { EquipmentProvider } from "./equipment/context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <EquipmentProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </EquipmentProvider>
    </AuthGuard>
  );
}

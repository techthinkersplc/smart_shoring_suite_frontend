import { DashboardLayout } from "./layout/DashboardLayout";
import { AuthGuard } from "./guards/middleware";
import { EquipmentProvider } from "./equipment/context";
import { CostProvider } from "./cost/context";
import { NotificationsProvider } from "./notifications/context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <EquipmentProvider>
        <CostProvider>
          <NotificationsProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </NotificationsProvider>
        </CostProvider>
      </EquipmentProvider>
    </AuthGuard>
  );
}

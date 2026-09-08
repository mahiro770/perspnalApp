import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { Header } from './Header';
import { NotificationPrimingBanner } from '@/features/settings/components/NotificationPrimingBanner';

export function AppShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col md:pl-56">
        <Header />
        <main className="flex-1 px-4 pb-24 pt-4 md:pb-8">
          <div className="mx-auto w-full max-w-3xl">
            <NotificationPrimingBanner />
            <Outlet />
          </div>
        </main>
      </div>
      <BottomTabBar />
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';
import { WeatherPage } from '@/features/weather/components/WeatherPage';
import { CalendarPage } from '@/features/calendar/components/CalendarPage';
import { BudgetPage } from '@/features/budget/components/BudgetPage';
import { SettingsPage } from '@/features/settings/components/SettingsPage';
import { MorePage } from '@/features/more/components/MorePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>
    </Routes>
  );
}

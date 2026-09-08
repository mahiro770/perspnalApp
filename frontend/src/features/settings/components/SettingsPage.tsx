import { ThemeToggle } from './ThemeToggle';
import { RegionSetting } from './RegionSetting';
import { NotificationSetting } from './NotificationSetting';
import { CategoryManager } from './CategoryManager';

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="hidden text-xl font-bold text-text md:block">設定</h1>
      <ThemeToggle />
      <RegionSetting />
      <NotificationSetting />
      <CategoryManager />
    </div>
  );
}

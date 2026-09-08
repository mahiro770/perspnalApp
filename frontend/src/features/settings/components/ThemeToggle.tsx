import { Moon, Sun, SunMoon } from 'lucide-react';
import { Theme, useThemeStore } from '@/stores/themeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'ライト', icon: Sun },
  { value: 'dark', label: 'ダーク', icon: Moon },
  { value: 'system', label: '端末に合わせる', icon: SunMoon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>テーマ</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 pt-0">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs font-medium ${
              theme === opt.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-text-muted hover:bg-surface-alt'
            }`}
          >
            <opt.icon className="h-5 w-5" strokeWidth={1.75} />
            {opt.label}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

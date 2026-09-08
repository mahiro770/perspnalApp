import { CalendarDays, Cloud, Home, type LucideIcon, MoreHorizontal, Settings, Wallet } from 'lucide-react';

export interface NavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

/**
 * 単一の定義をPCサイドバー・スマホ下部タブバーの両方で共有する。
 * スマホでは MAX_BOTTOM_TABS を超えた分を自動で「その他」(/more)にまとめるため、
 * 画面を追加してもレイアウトコード側は変更不要。
 */
export const navItems: NavItem[] = [
  { key: 'dashboard', label: 'ホーム', icon: Home, path: '/' },
  { key: 'weather', label: '天気', icon: Cloud, path: '/weather' },
  { key: 'calendar', label: 'カレンダー', icon: CalendarDays, path: '/calendar' },
  { key: 'budget', label: '家計簿', icon: Wallet, path: '/budget' },
  { key: 'settings', label: '設定', icon: Settings, path: '/settings' },
];

export const MAX_BOTTOM_TABS = 5;

export const MORE_NAV_ITEM: NavItem = {
  key: 'more',
  label: 'その他',
  icon: MoreHorizontal,
  path: '/more',
};

export function getBottomTabItems(): NavItem[] {
  if (navItems.length <= MAX_BOTTOM_TABS) return navItems;
  return [...navItems.slice(0, MAX_BOTTOM_TABS - 1), MORE_NAV_ITEM];
}

export function getOverflowNavItems(): NavItem[] {
  if (navItems.length <= MAX_BOTTOM_TABS) return [];
  return navItems.slice(MAX_BOTTOM_TABS - 1);
}

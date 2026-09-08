import { useLocation } from 'react-router-dom';
import { navItems, MORE_NAV_ITEM } from '../navigation';

function useCurrentTitle(): string {
  const { pathname } = useLocation();
  const match = [...navItems, MORE_NAV_ITEM].find((item) =>
    item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
  );
  return match?.label ?? 'くらしログ';
}

export function Header() {
  const title = useCurrentTitle();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-surface/95 px-4 backdrop-blur md:hidden">
      <span className="text-base font-bold text-text">{title}</span>
    </header>
  );
}

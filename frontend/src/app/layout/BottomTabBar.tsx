import { NavLink } from 'react-router-dom';
import { getBottomTabItems } from '../navigation';

export function BottomTabBar() {
  const items = getBottomTabItems();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.key}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
              isActive ? 'text-primary' : 'text-text-muted'
            }`
          }
        >
          <item.icon className="h-5 w-5" strokeWidth={1.75} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

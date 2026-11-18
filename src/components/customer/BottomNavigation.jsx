import React from 'react';
import { NavLink } from 'react-router-dom';
import { Wrench, ShoppingBag, CalendarCheck, User } from 'lucide-react';

export default function BottomNavigation({ cartCount = 0 }) {
  const navItems = [
    { to: '/', label: 'Tools & Gear', icon: Wrench, end: true },
    { to: '/cart', label: 'Rental Cart', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : null },
    { to: '/bookings', label: 'My Rentals', icon: CalendarCheck },
    { to: '/profile', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-2">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                    isActive
                      ? 'text-stone-900'
                      : 'text-stone-400 hover:text-stone-600'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? 'text-stone-900' : 'text-stone-400'
                        }`}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {item.badge && (
                        <span className="absolute -top-1 -right-2 min-w-[16px] h-4 flex items-center justify-center px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

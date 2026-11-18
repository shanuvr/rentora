import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  PackageX,
  Receipt,
  Wallet,
  Settings,
  X,
  LogOut,
} from 'lucide-react';

export function AdminSidebar({
  isMobileOpen,
  onCloseMobile,
  bookingsCount = 0,
  undeliveredCount = 0,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Log out from Owner Admin?')) {
      navigate('/');
    }
  };
  const navItems = [
    {
      to: '/admin',
      label: 'Bookings',
      icon: CalendarCheck,
      end: true,
      badge: bookingsCount > 0 ? bookingsCount : null,
    },
    {
      to: '/admin/undelivered',
      label: 'Undelivered',
      sublabel: 'Uncollected equipment',
      icon: PackageX,
      end: false,
      badge: undeliveredCount > 0 ? `${undeliveredCount} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      to: '/admin/billing',
      label: 'Billing',
      sublabel: 'Invoices & fees',
      icon: Receipt,
      end: false,
      badge: null,
    },
    {
      to: '/admin/accounts',
      label: 'Manage Accounts',
      sublabel: 'Revenue & finances',
      icon: Wallet,
      end: false,
      badge: null,
    },
    {
      to: '/admin/settings',
      label: 'Settings',
      icon: Settings,
      end: false,
      badge: null,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200">
      {/* Brand & Portal Header */}
      <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-black text-base shadow-xs">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-stone-900">
                Rentora
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                Owner
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium block">
              Equipment Rental Hub
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 block mb-2">
          Management
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-stone-400 group-hover:text-stone-700'
                      }`}
                    />
                    <div className="truncate">
                      <span className="block truncate leading-tight">
                        {item.label}
                      </span>
                      {item.sublabel && !isActive && (
                        <span className="text-[10px] font-normal text-stone-400 block truncate">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md shrink-0 border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : item.badgeColor || 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Logout Button */}
      <div className="p-3 border-t border-stone-200 mt-auto bg-stone-50/40">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer group"
          title="Log out of Owner Admin"
        >
          <LogOut className="w-4 h-4 text-stone-400 group-hover:text-red-600 transition-colors" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
          />

          {/* Slide-out Sidebar */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;

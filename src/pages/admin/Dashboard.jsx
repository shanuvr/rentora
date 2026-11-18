import React from 'react';
import {
  CalendarCheck,
  PackageX,
  Receipt,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

export default function AdminDashboard() {
  const { bookings = [], undeliveredCount = 0 } = useOutletContext() || {};

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );
  const totalDepositsHeld = bookings.reduce(
    (sum, b) => sum + (b.depositAmount || 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Hub Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Real-time equipment rental overview & dispatch status
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Bookings */}
        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {bookings.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block font-medium">
            Customer equipment reservations
          </span>
        </div>

        {/* Undelivered / Uncollected */}
        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Undelivered
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <PackageX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700 tabular-nums">
            {undeliveredCount}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block font-medium">
            Pending customer pickup
          </span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            Rental payments collected
          </span>
        </div>

        {/* Deposits Held */}
        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Security Deposits
            </span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            ₹{totalDepositsHeld.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block font-medium">
            Refundable on tool return
          </span>
        </div>
      </div>

      {/* Undelivered Attention Alert Banner (if any) */}
      {undeliveredCount > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 leading-tight">
                {undeliveredCount} Equipment {undeliveredCount === 1 ? 'Order' : 'Orders'} Awaiting Customer Pickup
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                Customers booked equipment but haven't collected from the warehouse yet.
              </p>
            </div>
          </div>

          <Link
            to="/admin/undelivered"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-900 text-white text-xs font-bold hover:bg-amber-800 transition-colors shrink-0 shadow-2xs"
          >
            <span>Manage Undelivered</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-xl border border-stone-300 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Recent Customer Bookings
            </h2>
            <p className="text-xs text-stone-400">
              Latest tools booked through the customer storefront
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1"
          >
            <span>All Bookings ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-2.5">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking.bookingId}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-800">
                    BK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {booking.bookingId}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <span className="text-xs text-stone-600 truncate block max-w-sm">
                      {booking.items?.map((i) => i.name).join(', ') || 'Equipment order'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-bold text-stone-900 tabular-nums">
                    ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{booking.status || 'Confirmed'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-xs">
            No bookings recorded yet. Once customers book on the storefront, they appear here.
          </div>
        )}
      </div>
    </div>
  );
}

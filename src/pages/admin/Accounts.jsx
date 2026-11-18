import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, DollarSign, PackageCheck, Layers } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function AdminAccounts() {
  const { bookings = [] } = useOutletContext() || {};

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );
  const totalToolsRented = bookings.reduce(
    (sum, b) => sum + (b.items?.length || 1),
    0
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Manage Accounts & Revenue
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Hub financial statements, gross rental earnings, and payouts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Total Revenue
          </span>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Direct customer rental income
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
            Total Bookings
          </span>
          <div className="text-2xl font-black text-emerald-600 tabular-nums">
            {bookings.length}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Completed checkout orders
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
            Equipment Rented
          </span>
          <div className="text-2xl font-black text-stone-900 tabular-nums">
            {totalToolsRented}
          </div>
          <span className="text-[11px] text-stone-400 mt-1 block">
            Total tools booked across jobs
          </span>
        </div>
      </div>
    </div>
  );
}


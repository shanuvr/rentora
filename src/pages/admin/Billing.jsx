import React from 'react';
import { Receipt, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function AdminBilling() {
  const { bookings = [] } = useOutletContext() || {};

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Billing & Invoices
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Rental charges, daily rates, and payment invoice logs
        </p>
      </div>

      <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs space-y-3">
        {bookings.length > 0 ? (
          <div className="space-y-2.5">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-900">{booking.bookingId}</span>
                    <span className="text-stone-400">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="text-stone-600 block">
                    Rental Subtotal: ₹{(booking.subtotal || booking.totalAmount || 0).toLocaleString('en-IN')} ({booking.items?.length || 1} {booking.items?.length === 1 ? 'item' : 'items'})
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-bold text-stone-900 text-sm tabular-nums">
                    ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Paid</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-400 text-xs">
            <Receipt className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p>No billing records yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}


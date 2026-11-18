import React from 'react';
import { PackageX, AlertTriangle, Phone, CheckCircle2, Clock, User, Calendar } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function AdminUndelivered() {
  const { bookings = [], updateBookingStatus } = useOutletContext() || {};

  // Bookings where customer booked but equipment has not been collected/picked up
  const undeliveredBookings = bookings.filter(
    (b) => b.pickupStatus === 'uncollected' || b.status === 'Confirmed'
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Undelivered Equipment
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Equipment booked by customers that has not yet been picked up from the hub
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs self-start sm:self-center">
          {undeliveredBookings.length} {undeliveredBookings.length === 1 ? 'Booking Awaiting Pickup' : 'Bookings Awaiting Pickup'}
        </span>
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          Tools in this list are reserved but currently still sitting in the warehouse awaiting customer pickup.
        </span>
      </div>

      {/* Undelivered Items List */}
      <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs space-y-3">
        {undeliveredBookings.length > 0 ? (
          <div className="space-y-3">
            {undeliveredBookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200 shadow-2xs">
                      {booking.bookingId}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Awaiting Pickup</span>
                    </span>
                  </div>

                  {/* Items with photos */}
                  <div className="space-y-2">
                    {booking.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <img
                          src={item.image || '/images/tools/grinder.jpg'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-stone-200 bg-white shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/tools/grinder.jpg';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            Pickup: {item.formattedFrom || item.fromDate} ({item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-stone-500 font-medium pt-1 border-t border-stone-200/60">
                    Customer: <strong>{booking.customer?.name || 'Rahul Sharma'}</strong> • {booking.customer?.phone || '+91 98765 43210'}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase tracking-wider">
                      Rental Paid
                    </span>
                    <span className="text-sm sm:text-base font-black text-stone-900 tabular-nums">
                      ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {updateBookingStatus && (
                    <button
                      type="button"
                      onClick={() => updateBookingStatus(booking.bookingId, 'Handed Over')}
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Mark Handed Over
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-stone-400 text-xs">
            <PackageX className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p>All booked equipment has been collected by customers.</p>
          </div>
        )}
      </div>
    </div>
  );
}

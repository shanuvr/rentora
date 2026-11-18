import { useState, useEffect } from 'react';
import {
  CalendarCheck,
  ArrowLeft,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const loadStoredBookings = () => {
  try {
    const stored = localStorage.getItem('rentora_bookings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const unique = [];
        for (const b of parsed) {
          const isDuplicate = unique.some(
            (u) =>
              u.totalAmount === b.totalAmount &&
              JSON.stringify(u.items?.map((i) => i.id)) ===
                JSON.stringify(b.items?.map((i) => i.id)) &&
              Math.abs(new Date(u.createdAt) - new Date(b.createdAt)) < 5000
          );
          if (!isDuplicate) {
            unique.push(b);
          }
        }
        return unique;
      }
    }
    return [];
  } catch {
    return [];
  }
};

export default function MyBookings() {
  const [bookings, setBookings] = useState(loadStoredBookings);

  useEffect(() => {
    const handleUpdate = () => setBookings(loadStoredBookings());
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(`Cancel rental booking ${bookingId}?`)) {
      const updated = bookings.filter((b) => b.bookingId !== bookingId);
      setBookings(updated);
      localStorage.setItem('rentora_bookings', JSON.stringify(updated));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all booking history?')) {
      setBookings([]);
      localStorage.removeItem('rentora_bookings');
    }
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col min-h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-600 transition-colors"
            title="Back to Tools"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-stone-900">My Rentals</h1>
            <p className="text-[11px] text-stone-500 font-medium">
              {bookings.length} {bookings.length === 1 ? 'active booking' : 'active bookings'}
            </p>
          </div>
        </div>

        {bookings.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-stone-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs space-y-3"
            >
              {/* Booking Header */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
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
                  {booking.txnId && (
                    <span className="text-[9px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded hidden xs:inline">
                      {booking.txnId}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{booking.status || 'Confirmed'}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    className="p-1 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded transition-colors"
                    title="Cancel booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Items in Booking */}
              <div className="space-y-2">
                {booking.items?.map((item) => (
                  <div
                    key={item.cartItemId || item.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-stone-50 border border-stone-200"
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-stone-200 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {item.name}
                        {item.quantity > 1 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-700">
                            ×{item.quantity}
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        {item.formattedFrom} → {item.formattedTo} ({item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'})
                        {item.quantity > 1 && ` • ${item.quantity} units`}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-stone-900 shrink-0 tabular-nums">
                      ₹{(item.subtotal || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Booking Total */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-stone-100">
                <span className="text-stone-500 font-medium">
                  Total Payable at Pickup
                </span>
                <span className="font-bold text-stone-900 text-sm tabular-nums">
                  ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-300 shadow-2xs text-stone-400 flex items-center justify-center mb-3">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-stone-900 mb-1">
            No bookings yet
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-5">
            Once you confirm a rental booking, you can track pickup status and return dates here.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
          >
            Browse Rentals
          </Link>
        </div>
      )}
    </div>
  );
}

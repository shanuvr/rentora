import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  LogOut,
  Globe,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Receipt,
  X,
  Trash2,
} from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

const getStoredBookings = () => {
  try {
    const stored = localStorage.getItem('rentora_bookings');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export default function Profile() {
  const { selectedLang, openLanguageModal } = useOutletContext() || {};
  const [bookings, setBookings] = useState(getStoredBookings);
  const [showBookingsModal, setShowBookingsModal] = useState(false);

  const customer = {
    name: 'Nikhil Varghese',
    phone: '+91 98471 20491',
    email: 'nikhil.varghese@example.com',
    location: 'Kochi, Kerala, India',
    memberSince: 'October 2026',
  };

  useEffect(() => {
    const handleStorage = () => setBookings(getStoredBookings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const totalSpent = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );
  const activeRentalsCount = bookings.filter(
    (b) => b.status === 'Confirmed' || !b.status
  ).length;

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(`Cancel rental booking ${bookingId}?`)) {
      const updated = bookings.filter((b) => b.bookingId !== bookingId);
      setBookings(updated);
      localStorage.setItem('rentora_bookings', JSON.stringify(updated));
    }
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col min-h-full">
      {/* Top Header */}
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-stone-200">
        <Link
          to="/"
          className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-600 transition-colors"
          title="Back to Tools"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-bold text-stone-900">Customer Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="py-4 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-xs mb-2.5">
          RS
        </div>
        <h2 className="text-base font-bold text-stone-900">{customer.name}</h2>
        <span className="text-xs text-stone-500">
          Member since {customer.memberSince}
        </span>
      </div>

      {/* Booking & Rental Stats (Clickable to open history modal) */}
      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <button
          type="button"
          onClick={() => setShowBookingsModal(true)}
          className="bg-white rounded-xl p-3 border border-stone-300 shadow-xs text-center hover:border-stone-400 transition-colors cursor-pointer"
        >
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mb-0.5">
            Bookings
          </span>
          <span className="text-base sm:text-lg font-black text-stone-900 tabular-nums">
            {bookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setShowBookingsModal(true)}
          className="bg-white rounded-xl p-3 border border-stone-300 shadow-xs text-center hover:border-stone-400 transition-colors cursor-pointer"
        >
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mb-0.5">
            Active
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600 tabular-nums">
            {activeRentalsCount}
          </span>
        </button>

        <div className="bg-white rounded-xl p-3 border border-stone-300 shadow-xs text-center">
          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block mb-0.5">
            Spent
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 tabular-nums">
            ₹{totalSpent.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Menu Rows */}
      <div className="space-y-2.5 mb-4">
        {/* Booking History Button (Click to view) */}
        <button
          type="button"
          onClick={() => setShowBookingsModal(true)}
          className="w-full bg-white rounded-xl p-3.5 sm:p-4 border border-stone-300 shadow-xs hover:border-stone-400 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-stone-900 block leading-tight">
                Booking History
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                {bookings.length} {bookings.length === 1 ? 'rental' : 'rentals'} recorded
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 group-hover:text-stone-900">
            <span className="text-[11px] text-stone-400">View</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Language Preference Button */}
        <button
          type="button"
          onClick={openLanguageModal}
          className="w-full bg-white rounded-xl p-3.5 sm:p-4 border border-stone-300 shadow-xs hover:border-stone-400 transition-all flex items-center justify-between text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-100 group-hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-stone-900 block leading-tight">
                Language / ഭാഷ
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                {selectedLang === 'ml' ? 'മലയാളം (Malayalam)' : 'English'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 group-hover:text-stone-900">
            <span className="text-[11px] text-stone-400">Change</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Switch to Owner Portal */}
        <Link
          to="/admin"
          className="w-full bg-white rounded-xl p-3.5 sm:p-4 border border-stone-300 shadow-xs hover:border-stone-400 transition-all flex items-center justify-between text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              OP
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-stone-900 block leading-tight">
                Owner Portal (Admin)
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                Manage hub bookings, undelivered, billing & revenue
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 group-hover:text-stone-900">
            <span className="text-[11px] text-stone-400">Open</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Contact Details Card */}
      <div className="bg-white rounded-xl p-4 border border-stone-300 shadow-xs space-y-3 mb-4">
        <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider pb-1 border-b border-stone-100">
          Account Details
        </h3>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <Phone className="w-4 h-4 text-stone-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <Mail className="w-4 h-4 text-stone-400" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span>{customer.location}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          type="button"
          onClick={() => alert('Profile editing is available in Screen 6.')}
          className="w-full py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs"
        >
          Edit Profile
        </button>

        <button
          type="button"
          onClick={() => alert('Demo logout successful.')}
          className="w-full py-2.5 px-4 bg-stone-100 text-rose-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-50 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Log Out (Demo)
        </button>
      </div>

      {/* Booking History Modal (Opens only when clicking Booking History button) */}
      {showBookingsModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-stone-300 flex flex-col relative max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-stone-900" />
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Booking History
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    {bookings.length} {bookings.length === 1 ? 'record' : 'records'} found
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBookingsModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bookings Content */}
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
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

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{booking.status || 'Confirmed'}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking.bookingId)}
                          className="p-1 text-stone-400 hover:text-red-600 rounded"
                          title="Cancel booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 pt-1 border-t border-stone-200/60">
                      {booking.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="truncate pr-2 text-stone-700">
                            • {item.name}
                          </span>
                          <span className="font-semibold text-stone-900 shrink-0 tabular-nums">
                            ₹{(item.subtotal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-stone-200/60 text-xs font-bold text-stone-900">
                      <span className="text-stone-500 font-medium">Total Paid</span>
                      <span className="tabular-nums">
                        ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}

                <Link
                  to="/bookings"
                  onClick={() => setShowBookingsModal(false)}
                  className="block text-center py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
                >
                  Manage in My Rentals tab
                </Link>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 mb-1">
                  No booking history
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto mb-4">
                  You haven't rented any equipment yet.
                </p>
                <Link
                  to="/"
                  onClick={() => setShowBookingsModal(false)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Explore Equipment
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useMemo } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Search,
  X,
  Calendar,
  RotateCcw,
  PackageCheck,
  ChevronDown,
} from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/products';

// Helper to format Date to YYYY-MM-DD
const toISODate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Compact date formatter (e.g., "18 Nov" without the year)
const formatCompactDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
  if (typeof dateVal === 'string') {
    return dateVal.replace(/\s*,?\s*\b\d{4}\b/g, '').trim();
  }
  return String(dateVal);
};

export default function AdminBookings() {
  const { bookings = [], updateBookingStatus } = useOutletContext() || {};

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const todayStr = useMemo(() => toISODate(new Date()), []);
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  }, []);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = booking.bookingId?.toLowerCase().includes(query);
        const matchesCustomer =
          booking.customer?.name?.toLowerCase().includes(query) ||
          booking.customer?.phone?.includes(query);
        const matchesItems = booking.items?.some((item) =>
          item.name?.toLowerCase().includes(query)
        );

        if (!matchesId && !matchesCustomer && !matchesItems) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        const catNameLower = catObj?.name.toLowerCase();
        const matchesCat = booking.items?.some(
          (item) =>
            item.category === selectedCategory ||
            (catNameLower && item.categoryName?.toLowerCase() === catNameLower) ||
            item.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!matchesCat) return false;
      }

      // 3. Date / Calendar Filter
      if (dateFilter) {
        const bookingCreatedDate = booking.createdAt
          ? toISODate(booking.createdAt)
          : '';
        const matchesCreatedDate = bookingCreatedDate === dateFilter;

        const matchesRentalRange = booking.items?.some((item) => {
          if (!item.fromDate) return false;
          const from = item.fromDate;
          const to = item.toDate || item.fromDate;
          return dateFilter >= from && dateFilter <= to;
        });

        if (!matchesCreatedDate && !matchesRentalRange) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, searchQuery, selectedCategory, dateFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedCategory !== 'all' || dateFilter
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateFilter('');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Bookings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Customer equipment rentals and handovers
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
          {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
        </span>
      </div>

      {/* Flat, Low-Profile Filter Toolbar (No nested heavy card) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-1">
        {/* Controls: Search, Category, Date */}
        <div className="flex flex-1 items-center gap-2 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, tools, customers..."
              className="w-full pl-8 pr-7 py-1.5 bg-white text-xs text-stone-900 font-medium rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown & Date Picker (Grid on mobile, inline on desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-3 pr-7 py-1.5 bg-white text-xs text-stone-700 font-medium rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors cursor-pointer appearance-none shadow-2xs"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Picker with Clear Visible Label */}
            <div className="relative">
              <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white text-xs text-stone-700 font-medium rounded-lg border border-stone-300 hover:border-stone-400 focus-within:border-stone-900 transition-colors cursor-pointer shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">
                  {dateFilter ? formatCompactDate(dateFilter) : 'Pick Date'}
                </span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  title="Filter by rental date"
                />
                <ChevronDown className="w-3 h-3 text-stone-400 shrink-0 ml-auto" />
              </label>
            </div>
          </div>
        </div>

        {/* Date Presets & Reset Filter */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDateFilter('')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              dateFilter === ''
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setDateFilter(todayStr)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              dateFilter === todayStr
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setDateFilter(tomorrowStr)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              dateFilter === tomorrowStr
                ? 'bg-stone-900 text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Tomorrow
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md transition-colors border border-amber-200 cursor-pointer ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bookings List Cards (Clean, Single-Layer, No Inner Nested Boxes) */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const isHandedOver = booking.status === 'Handed Over' || booking.status === 'Completed';

            return (
              <div
                key={booking.bookingId}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all overflow-hidden"
              >
                {/* Header: ID, Date, Customer & Status Badge */}
                <div className="px-4 py-2.5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">
                      #{booking.bookingId}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-400">
                      {formatCompactDate(booking.createdAt)}
                    </span>
                    <span className="text-stone-300">·</span>
                    <Link
                      to={`/admin/history?customer=${encodeURIComponent(booking.customer?.name || 'Rahul Sharma')}`}
                      className="text-stone-700 hover:text-amber-800 font-medium hover:underline inline-flex items-center gap-1 transition-colors"
                      title="View complete customer rental history"
                    >
                      <span>{booking.customer?.name || 'Rahul Sharma'}</span>
                      {booking.customer?.phone ? (
                        <span className="text-stone-400 font-normal">({booking.customer.phone})</span>
                      ) : null}
                    </Link>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isHandedOver ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <PackageCheck className="w-3 h-3" />
                        <span>Handed Over</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Confirmed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Items List (Direct layout, no extra nested boxes) */}
                <div className="divide-y divide-stone-100">
                  {booking.items?.map((item, idx) => {
                    const fromStr = formatCompactDate(item.formattedFrom || item.fromDate);
                    const toStr = formatCompactDate(item.formattedTo || item.toDate);
                    const days = item.rentalDays || 1;
                    const daysLabel = `${days}d`;

                    return (
                      <div
                        key={item.cartItemId || idx}
                        className="px-4 py-3 flex items-center justify-between gap-3.5"
                      >
                        {/* Tool Photo */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0">
                          <img
                            src={item.image || '/images/tools/angle_grinder.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/tools/angle_grinder.jpg';
                            }}
                          />
                        </div>

                        {/* Tool Details: Clean single-line / 2-line layout */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {item.name}
                            {item.quantity > 1 && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                                ×{item.quantity}
                              </span>
                            )}
                          </h4>

                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 flex-wrap">
                            <span className="text-amber-800 font-medium">
                              {item.categoryName || 'Equipment'}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="inline-flex items-center gap-1 font-medium text-stone-700 whitespace-nowrap">
                              <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{fromStr} → {toStr} ({daysLabel})</span>
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="text-stone-400">
                              ₹{item.rentalPrice}/day
                            </span>
                            {item.quantity > 1 && (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="font-semibold text-stone-700">
                                  Qty: {item.quantity}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Line Item Total */}
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                            ₹{(item.subtotal || item.rentalPrice * days).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer: Clean Total & Action (No Gateway/Warehouse clutter) */}
                <div className="px-4 py-2.5 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-stone-600">
                    Total: <strong className="text-stone-900 text-sm font-black tabular-nums">₹{(booking.totalAmount || 0).toLocaleString('en-IN')}</strong>
                  </div>

                  {updateBookingStatus && (
                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.bookingId,
                          isHandedOver ? 'Confirmed' : 'Handed Over'
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer ${
                        isHandedOver
                          ? 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                          : 'bg-stone-900 hover:bg-stone-800 text-white'
                      }`}
                    >
                      {isHandedOver ? 'Undo Handover' : 'Mark Handed Over'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-stone-200 p-10 text-center shadow-2xs">
            <CalendarCheck className="w-8 h-8 mx-auto mb-2.5 text-stone-300" />
            <h3 className="text-xs font-bold text-stone-800 mb-1">
              No matching bookings found
            </h3>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto mb-3">
              {hasActiveFilters
                ? 'Try adjusting your search query, category, or date.'
                : 'No equipment bookings have been placed yet.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

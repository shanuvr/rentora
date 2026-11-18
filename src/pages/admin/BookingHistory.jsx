import { useState, useMemo } from 'react';
import {
  History,
  Search,
  X,
  Phone,
  User,
  CheckCircle2,
  PackageCheck,
  Clock,
  RotateCcw,
  Receipt,
  Calendar,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useOutletContext, useSearchParams, Link } from 'react-router-dom';

// Helper to format ISO date to readable string
const formatFullDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCompactDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

const getInitials = (name) => {
  if (!name) return 'CU';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function AdminBookingHistory() {
  const { bookings = [] } = useOutletContext() || {};
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCustomer = searchParams.get('customer') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Aggregate customer statistics
  const customerDirectory = useMemo(() => {
    const map = new Map();

    bookings.forEach((b) => {
      const c = b.customer || {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        location: 'Indiranagar, Bangalore',
      };
      const key = c.name || 'Anonymous Customer';

      if (!map.has(key)) {
        map.set(key, {
          name: key,
          phone: c.phone || '',
          location: c.location || '',
          bookingCount: 0,
          productsRentedCount: 0,
          totalSpent: 0,
          activeCount: 0,
          returnedCount: 0,
          bookings: [],
        });
      }

      const entry = map.get(key);
      entry.bookingCount += 1;
      entry.totalSpent += b.totalAmount || b.subtotal || 0;
      entry.bookings.push(b);

      const items = b.items || [];
      items.forEach((itm) => {
        entry.productsRentedCount += itm.quantity || 1;
      });

      const isDone = b.status === 'Returned' || b.status === 'Completed';
      if (isDone) {
        entry.returnedCount += 1;
      } else {
        entry.activeCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [bookings]);

  // Overall metrics
  const overallStats = useMemo(() => {
    let totalRevenue = 0;
    let completedBookings = 0;
    let activeBookings = 0;
    let totalProductsRented = 0;

    bookings.forEach((b) => {
      totalRevenue += b.totalAmount || b.subtotal || 0;
      if (b.status === 'Returned' || b.status === 'Completed') {
        completedBookings += 1;
      } else {
        activeBookings += 1;
      }
      (b.items || []).forEach((itm) => {
        totalProductsRented += itm.quantity || 1;
      });
    });

    return {
      totalBookings: bookings.length,
      uniqueCustomers: customerDirectory.length,
      totalProductsRented,
      totalRevenue,
      completedBookings,
      activeBookings,
    };
  }, [bookings, customerDirectory]);

  // Filtered bookings list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const cName = b.customer?.name || 'Rahul Sharma';
      const cPhone = b.customer?.phone || '';

      // 1. Customer selection
      if (selectedCustomer !== 'all') {
        if (cName.toLowerCase() !== selectedCustomer.toLowerCase()) {
          return false;
        }
      }

      // 2. Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'returned') {
          if (b.status !== 'Returned' && b.status !== 'Completed') return false;
        } else if (statusFilter === 'in_use') {
          if (b.status !== 'Handed Over') return false;
        } else if (statusFilter === 'confirmed') {
          if (b.status !== 'Confirmed') return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = b.bookingId?.toLowerCase().includes(q);
        const matchesCustomer = cName.toLowerCase().includes(q) || cPhone.includes(q);
        const matchesTxn = b.txnId?.toLowerCase().includes(q);
        const matchesItems = b.items?.some((item) =>
          item.name?.toLowerCase().includes(q) || item.categoryName?.toLowerCase().includes(q)
        );

        if (!matchesId && !matchesCustomer && !matchesTxn && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [bookings, selectedCustomer, statusFilter, searchQuery]);

  // Handle switching customer
  const handleSelectCustomer = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name === 'all') {
      next.delete('customer');
    } else {
      next.set('customer', name);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    const next = new URLSearchParams(searchParams);
    next.delete('customer');
    setSearchParams(next);
  };

  const hasActiveFilters =
    selectedCustomer !== 'all' || searchQuery.trim().length > 0 || statusFilter !== 'all';

  const selectedCustomerData = customerDirectory.find(
    (c) => c.name.toLowerCase() === selectedCustomer.toLowerCase()
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Booking History
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 border border-stone-800">
            User Rental Records
          </span>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
          </span>
        </div>
      </div>

      {/* Overview Stat Cards (Single Row on Mobile & Desktop) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {/* Total Bookings */}
        <div className="bg-white rounded-lg border border-stone-200 p-1.5 sm:p-2 text-center shadow-2xs">
          <span className="text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider text-stone-400 truncate">
            Bookings
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 tabular-nums leading-tight">
            {overallStats.totalBookings}
          </span>
        </div>

        {/* Total Products Rented */}
        <div className="bg-white rounded-lg border border-stone-200 p-1.5 sm:p-2 text-center shadow-2xs">
          <span className="text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider text-stone-400 truncate">
            Tools Rented
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 tabular-nums leading-tight">
            {overallStats.totalProductsRented}
          </span>
        </div>

        {/* Completed / Returned */}
        <div className="bg-white border border-stone-200 rounded-lg p-1.5 sm:p-2 text-center shadow-2xs">
          <span className="text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider text-emerald-700 truncate">
            Completed
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-900 tabular-nums leading-tight">
            {overallStats.completedBookings}
          </span>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-stone-200 rounded-lg p-1.5 sm:p-2 text-center shadow-2xs">
          <span className="text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider text-amber-800 truncate">
            Revenue
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 tabular-nums leading-tight">
            ₹{overallStats.totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search products, tools, booking ID (#BK-...), or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-2 bg-white text-xs text-stone-900 placeholder:text-stone-400 rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* 2 Dropdowns Grid: User Dropdown & Status Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
          {/* User Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCustomer}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-lg border outline-none transition-colors cursor-pointer appearance-none shadow-2xs truncate ${
                selectedCustomer !== 'all'
                  ? 'bg-stone-900 text-white border-stone-900 font-bold'
                  : 'bg-white text-stone-800 border-stone-300 focus:border-stone-900'
              }`}
            >
              <option value="all" className="bg-white text-stone-900">
                All Users ({customerDirectory.length} users · {overallStats.totalProductsRented} tools rented)
              </option>
              {customerDirectory.map((cust) => (
                <option
                  key={cust.name}
                  value={cust.name}
                  className="bg-white text-stone-900"
                >
                  {cust.name} — {cust.bookingCount} bookings · {cust.productsRentedCount} {cust.productsRentedCount === 1 ? 'product' : 'products'} (₹{cust.totalSpent})
                </option>
              ))}
            </select>
            <ChevronDown
              className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedCustomer !== 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full pl-2.5 pr-7 py-2 text-xs font-semibold rounded-lg border outline-none transition-colors cursor-pointer appearance-none shadow-2xs truncate ${
                statusFilter !== 'all'
                  ? 'bg-stone-900 text-white border-stone-900 font-bold'
                  : 'bg-white text-stone-700 border-stone-300 focus:border-stone-900'
              }`}
            >
              <option value="all" className="bg-white text-stone-900">
                All Rental Statuses
              </option>
              <option value="returned" className="bg-white text-stone-900">
                Returned & Closed
              </option>
              <option value="in_use" className="bg-white text-stone-900">
                In Customer Possession (Handed Over)
              </option>
              <option value="confirmed" className="bg-white text-stone-900">
                Confirmed (Upcoming Pickup)
              </option>
            </select>
            <ChevronDown
              className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                statusFilter !== 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>
        </div>

        {/* Reset Filter Pill */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-0.5 px-0.5">
            <span className="text-[11px] text-stone-500 font-medium truncate">
              Filtering: {selectedCustomer !== 'all' ? selectedCustomer : 'All Users'}
              {statusFilter !== 'all' ? ` · ${statusFilter}` : ''}
              {searchQuery ? ` · "${searchQuery}"` : ''}
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 cursor-pointer transition-colors shrink-0"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected User Overview Card */}
      {selectedCustomerData && (
        <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl p-3.5 sm:p-4 shadow-sm border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-400 text-stone-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
              {getInitials(selectedCustomerData.name)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {selectedCustomerData.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-400 border border-stone-700">
                  {selectedCustomerData.bookingCount} {selectedCustomerData.bookingCount === 1 ? 'Booking' : 'Bookings'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-emerald-400 border border-stone-700">
                  {selectedCustomerData.productsRentedCount} {selectedCustomerData.productsRentedCount === 1 ? 'Product Rented' : 'Products Rented'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300 mt-0.5 flex-wrap">
                {selectedCustomerData.phone && (
                  <a
                    href={`tel:${selectedCustomerData.phone}`}
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{selectedCustomerData.phone}</span>
                  </a>
                )}
                {selectedCustomerData.location && (
                  <>
                    <span className="text-stone-600">·</span>
                    <span>{selectedCustomerData.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics for this customer */}
          <div className="flex items-center gap-3 self-start sm:self-center bg-stone-950/40 px-3 py-1.5 rounded-lg border border-stone-700 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                Lifetime Spend
              </span>
              <span className="text-sm font-black text-amber-400 tabular-nums">
                ₹{selectedCustomerData.totalSpent.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="h-6 w-px bg-stone-700" />
            <div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold">
                Active / Returned
              </span>
              <span className="text-xs font-bold text-stone-200">
                {selectedCustomerData.activeCount} active · {selectedCustomerData.returnedCount} returned
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bookings History Timeline List */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const isCompleted =
              booking.status === 'Returned' || booking.status === 'Completed';
            const isHandedOver = booking.status === 'Handed Over';
            const isConfirmed = booking.status === 'Confirmed';
            const customer = booking.customer || {
              name: 'Rahul Sharma',
              phone: '+91 98765 43210',
            };

            return (
              <div
                key={booking.bookingId}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all overflow-hidden"
              >
                {/* Header: ID, Booked Date, Customer & Status */}
                <div className="px-4 py-2.5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">
                      #{booking.bookingId}
                    </span>
                    {booking.txnId && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {booking.txnId}
                      </span>
                    )}
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-medium">
                      Booked: {formatFullDate(booking.createdAt)}
                    </span>
                    <span className="text-stone-300">·</span>

                    {/* Customer Name */}
                    <button
                      type="button"
                      onClick={() => handleSelectCustomer(customer.name)}
                      className="font-bold text-stone-800 hover:text-amber-800 hover:underline cursor-pointer inline-flex items-center gap-1"
                      title="Filter history to this user"
                    >
                      <User className="w-3 h-3 text-stone-400" />
                      <span>{customer.name}</span>
                    </button>
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="text-stone-400 hover:text-stone-700 inline-flex items-center gap-0.5 ml-0.5"
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span className="text-[11px]">{customer.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Returned & Closed</span>
                      </span>
                    ) : isHandedOver ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <PackageCheck className="w-3 h-3 text-blue-600" />
                        <span>In Customer Possession</span>
                      </span>
                    ) : isConfirmed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Confirmed · Awaiting Pickup</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                        <span>{booking.status}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body: Items & Tools Rented */}
                <div className="divide-y divide-stone-100">
                  {booking.items?.map((item, idx) => {
                    const fromStr = formatCompactDate(item.formattedFrom || item.fromDate);
                    const toStr = formatCompactDate(item.formattedTo || item.toDate);
                    const days = item.rentalDays || 1;
                    const qty = item.quantity || 1;
                    const subtotal = item.subtotal || (item.rentalPrice || 0) * days * qty;
                    const isItemReturned = item.returnStatus === 'returned' || isCompleted;

                    return (
                      <div
                        key={item.id || idx}
                        className="px-4 py-3 flex items-center justify-between gap-3.5"
                      >
                        {/* Tool Photo */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
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

                        {/* Tool Details: Product Name, Rental Period, Returned Date */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {item.name}
                            {qty > 1 && (
                              <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                                ×{qty}
                              </span>
                            )}
                          </h4>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 flex-wrap">
                            <span className="text-amber-800 font-medium">
                              {item.categoryName || 'Equipment'}
                            </span>
                            <span className="text-stone-300">·</span>
                            <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                              <Calendar className="w-3 h-3 text-stone-400" />
                              <span>
                                {fromStr} → {toStr} ({days} {days === 1 ? 'day' : 'days'})
                              </span>
                            </span>

                            {/* Return Date Specifics */}
                            {isItemReturned ? (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="text-emerald-700 font-bold inline-flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  <span>Returned: {formatCompactDate(item.returnedAt || item.toDate || toStr)}</span>
                                </span>
                              </>
                            ) : isHandedOver ? (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="text-blue-700 font-bold inline-flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>Due: {toStr}</span>
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-stone-300">·</span>
                                <span className="text-amber-800 font-semibold inline-flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                  <span>Pickup: {fromStr}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Line Subtotal */}
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-black text-stone-900 block tabular-nums">
                            ₹{subtotal}
                          </span>
                          <span className="text-[10px] text-stone-400 block">
                            ₹{item.rentalPrice}/day
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer: Total Amount & Actions */}
                <div className="px-4 py-2.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Total Paid:
                    </span>
                    <span className="text-sm font-black text-stone-900 tabular-nums">
                      ₹{booking.totalAmount || booking.subtotal || 0}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct link to ETR Returns if not completed */}
                    {!isCompleted && (
                      <Link
                        to="/admin/etr"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>View Return Status</span>
                      </Link>
                    )}
                    {booking.txnId && (
                      <span className="text-[10px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200 inline-flex items-center gap-1">
                        <Receipt className="w-2.5 h-2.5 text-stone-400" />
                        <span>Paid</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              No booking records found
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
              {hasActiveFilters
                ? 'Try resetting the search query or user filter.'
                : 'There are currently no recorded bookings in the system.'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

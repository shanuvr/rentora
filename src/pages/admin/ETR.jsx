import { useState, useMemo } from 'react';
import {
  RotateCcw,
  Search,
  X,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  ChevronDown,
  Sparkles,
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

// Compact date formatter (e.g. "18 Nov")
const formatCompactDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

export default function AdminETR() {
  const { bookings = [], loadBookings } = useOutletContext() || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [statusPreset, setStatusPreset] = useState('all'); // 'all' | 'due_today' | 'due_tomorrow' | 'overdue' | 'returned'
  const [actionToast, setActionToast] = useState(null);

  const todayISO = toISODate(new Date());

  const showToast = (msg) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  // Flatten items out on rental from bookings
  const rentalItems = useMemo(() => {
    const list = [];
    bookings.forEach((booking) => {
      const items = booking.items || [];
      items.forEach((item, idx) => {
        const itemReturnDate = item.toDate
          ? toISODate(item.toDate)
          : toISODate(booking.createdAt);

        const isItemReturned =
          item.returnStatus === 'returned' ||
          booking.status === 'Returned' ||
          booking.status === 'Completed';

        let urgency;
        let diffDays = 0;

        if (isItemReturned) {
          urgency = 'returned';
        } else {
          const itemTime = new Date(itemReturnDate).getTime();
          const todayTime = new Date(todayISO).getTime();
          const diffMs = itemTime - todayTime;
          diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays < 0) {
            urgency = 'overdue';
          } else if (diffDays === 0) {
            urgency = 'due_today';
          } else if (diffDays === 1) {
            urgency = 'due_tomorrow';
          } else {
            urgency = 'upcoming';
          }
        }

        list.push({
          uniqueId: `${booking.bookingId}-${item.id || idx}`,
          bookingId: booking.bookingId,
          customer: booking.customer || {
            name: 'Rahul Sharma',
            phone: '+91 98765 43210',
            location: 'Main Hub',
          },
          bookingStatus: booking.status,
          bookingCreatedAt: booking.createdAt,
          item,
          returnDate: itemReturnDate,
          formattedReturnDate: formatCompactDate(item.formattedTo || item.toDate || itemReturnDate),
          formattedFromDate: formatCompactDate(item.formattedFrom || item.fromDate || booking.createdAt),
          rentalDays: item.rentalDays || 1,
          quantity: item.quantity || 1,
          isReturned: isItemReturned,
          urgency,
          diffDays,
        });
      });
    });
    return list;
  }, [bookings, todayISO]);

  // Overall Statistics
  const stats = useMemo(() => {
    let outCount = 0;
    let dueTodayCount = 0;
    let overdueCount = 0;
    let returnedCount = 0;

    rentalItems.forEach((r) => {
      if (r.isReturned) {
        returnedCount += r.quantity;
      } else {
        outCount += r.quantity;
        if (r.urgency === 'due_today') dueTodayCount += r.quantity;
        if (r.urgency === 'overdue') overdueCount += r.quantity;
      }
    });

    return { outCount, dueTodayCount, overdueCount, returnedCount };
  }, [rentalItems]);

  // Filter items based on search, category, specific date, and status preset
  const filteredItems = useMemo(() => {
    return rentalItems.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.item.name?.toLowerCase().includes(q);
        const matchesCategory = item.item.categoryName?.toLowerCase().includes(q);
        const matchesCustomer = item.customer.name?.toLowerCase().includes(q);
        const matchesPhone = item.customer.phone?.toLowerCase().includes(q);
        const matchesBookingId = item.bookingId?.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesCustomer && !matchesPhone && !matchesBookingId) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        if (item.item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Date Picker Filter
      if (dateFilter) {
        if (item.returnDate !== dateFilter) {
          return false;
        }
      }

      // 4. Status Preset Filter
      if (statusPreset === 'due_today') {
        return item.urgency === 'due_today';
      }
      if (statusPreset === 'due_tomorrow') {
        return item.urgency === 'due_tomorrow';
      }
      if (statusPreset === 'overdue') {
        return item.urgency === 'overdue';
      }
      if (statusPreset === 'returned') {
        return item.isReturned;
      }

      return true;
    });
  }, [rentalItems, searchQuery, selectedCategory, dateFilter, statusPreset]);

  // Mark single item or whole booking as Returned
  const handleMarkReturned = (entry) => {
    try {
      const stored = JSON.parse(localStorage.getItem('rentora_bookings') || '[]');
      const updated = stored.map((b) => {
        if (b.bookingId === entry.bookingId) {
          const updatedItems = (b.items || []).map((itm) => {
            if (itm.id === entry.item.id || itm.name === entry.item.name) {
              return {
                ...itm,
                returnStatus: 'returned',
                returnedAt: new Date().toISOString(),
              };
            }
            return itm;
          });

          // Check if all items in this booking are returned
          const allDone = updatedItems.every((i) => i.returnStatus === 'returned');
          return {
            ...b,
            items: updatedItems,
            status: allDone ? 'Returned' : b.status,
          };
        }
        return b;
      });

      localStorage.setItem('rentora_bookings', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      if (loadBookings) loadBookings();
      showToast(`Checked in "${entry.item.name}" as Returned & Restocked!`);
    } catch {
      showToast('Error updating return status.');
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'all' ||
    dateFilter.length > 0 ||
    statusPreset !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDateFilter('');
    setStatusPreset('all');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            ETR Returns
          </h1>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-900 text-amber-400 border border-stone-800">
            Expected Time to Return
          </span>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Metrics Row (Single Row on Mobile and Desktop) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {/* Out on Rent */}
        <div
          onClick={() => setStatusPreset('all')}
          className={`rounded-lg border p-1.5 sm:p-2 text-center shadow-2xs transition-all cursor-pointer ${
            statusPreset === 'all'
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white border-stone-200 hover:border-stone-400 text-stone-900'
          }`}
          title="Show all active rentals"
        >
          <span
            className={`text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider truncate ${
              statusPreset === 'all' ? 'text-stone-300' : 'text-stone-400'
            }`}
          >
            Out
          </span>
          <span className="text-sm sm:text-base font-black tabular-nums leading-tight">
            {stats.outCount}
          </span>
        </div>

        {/* Due Today */}
        <div
          onClick={() => setStatusPreset(statusPreset === 'due_today' ? 'all' : 'due_today')}
          className={`rounded-lg border p-1.5 sm:p-2 text-center shadow-2xs transition-all cursor-pointer ${
            statusPreset === 'due_today'
              ? 'bg-amber-600 text-white border-amber-600 ring-1 ring-amber-500'
              : 'bg-white border-stone-200 hover:border-amber-300 text-stone-900'
          }`}
          title="Filter by items due today"
        >
          <span
            className={`text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider truncate flex items-center justify-center gap-1 ${
              statusPreset === 'due_today' ? 'text-amber-100' : 'text-amber-800'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                statusPreset === 'due_today' ? 'bg-white' : 'bg-amber-500'
              }`}
            />
            <span className="truncate">Due Today</span>
          </span>
          <span
            className={`text-sm sm:text-base font-black tabular-nums leading-tight ${
              statusPreset === 'due_today' ? 'text-white' : 'text-amber-900'
            }`}
          >
            {stats.dueTodayCount}
          </span>
        </div>

        {/* Overdue */}
        <div
          onClick={() => setStatusPreset(statusPreset === 'overdue' ? 'all' : 'overdue')}
          className={`rounded-lg border p-1.5 sm:p-2 text-center shadow-2xs transition-all cursor-pointer ${
            statusPreset === 'overdue'
              ? 'bg-rose-600 text-white border-rose-600 ring-1 ring-rose-500'
              : 'bg-white border-stone-200 hover:border-rose-300 text-stone-900'
          }`}
          title="Filter by overdue rentals"
        >
          <span
            className={`text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider truncate flex items-center justify-center gap-1 ${
              statusPreset === 'overdue' ? 'text-rose-100' : 'text-rose-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                statusPreset === 'overdue' ? 'bg-white' : 'bg-rose-500'
              }`}
            />
            <span className="truncate">Overdue</span>
          </span>
          <span
            className={`text-sm sm:text-base font-black tabular-nums leading-tight ${
              statusPreset === 'overdue' ? 'text-white' : 'text-rose-900'
            }`}
          >
            {stats.overdueCount}
          </span>
        </div>

        {/* Returned */}
        <div
          onClick={() => setStatusPreset(statusPreset === 'returned' ? 'all' : 'returned')}
          className={`rounded-lg border p-1.5 sm:p-2 text-center shadow-2xs transition-all cursor-pointer ${
            statusPreset === 'returned'
              ? 'bg-emerald-600 text-white border-emerald-600 ring-1 ring-emerald-500'
              : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-900'
          }`}
          title="Filter by returned equipment"
        >
          <span
            className={`text-[8.5px] sm:text-[10px] font-bold block uppercase tracking-wider truncate flex items-center justify-center gap-1 ${
              statusPreset === 'returned' ? 'text-emerald-100' : 'text-emerald-700'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                statusPreset === 'returned' ? 'bg-white' : 'bg-emerald-500'
              }`}
            />
            <span className="truncate">Returned</span>
          </span>
          <span
            className={`text-sm sm:text-base font-black tabular-nums leading-tight ${
              statusPreset === 'returned' ? 'text-white' : 'text-emerald-900'
            }`}
          >
            {stats.returnedCount}
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
            placeholder="Search tool, category, customer, phone, or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 bg-white text-xs text-stone-900 placeholder:text-stone-400 rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors shadow-2xs"
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

        {/* 3 Dropdowns Grid: Status, Category, and Date */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 items-center">
          {/* 1. Status Dropdown */}
          <div className="relative">
            <select
              value={statusPreset}
              onChange={(e) => setStatusPreset(e.target.value)}
              className={`w-full pl-2.5 pr-6 py-1.5 text-xs font-semibold rounded-lg border outline-none transition-colors cursor-pointer appearance-none shadow-2xs truncate ${
                statusPreset !== 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 focus:border-stone-900'
              }`}
            >
              <option value="all" className="bg-white text-stone-900">
                All Returns
              </option>
              <option value="due_today" className="bg-white text-stone-900">
                Due Today
              </option>
              <option value="due_tomorrow" className="bg-white text-stone-900">
                Due Tomorrow
              </option>
              <option value="overdue" className="bg-white text-stone-900">
                Overdue
              </option>
              <option value="returned" className="bg-white text-stone-900">
                Returned
              </option>
            </select>
            <ChevronDown
              className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                statusPreset !== 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>

          {/* 2. Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full pl-2.5 pr-6 py-1.5 text-xs font-medium rounded-lg border outline-none transition-colors cursor-pointer appearance-none shadow-2xs truncate ${
                selectedCategory !== 'all'
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                  : 'bg-white text-stone-700 border-stone-300 focus:border-stone-900'
              }`}
            >
              <option value="all" className="bg-white text-stone-900">
                All Categories
              </option>
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option
                  key={cat.id}
                  value={cat.id}
                  className="bg-white text-stone-900"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                selectedCategory !== 'all' ? 'text-stone-300' : 'text-stone-400'
              }`}
            />
          </div>

          {/* 3. Date Picker with Clear Visible Label */}
          <div className="relative">
            <label
              className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer shadow-2xs ${
                dateFilter
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                  : 'bg-white text-stone-700 border-stone-300 hover:border-stone-400 focus-within:border-stone-900'
              }`}
            >
              <Calendar
                className={`w-3 h-3 shrink-0 ${
                  dateFilter ? 'text-stone-300' : 'text-stone-400'
                }`}
              />
              <span className="truncate flex-1">
                {dateFilter ? formatCompactDate(dateFilter) : 'Pick Date'}
              </span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                title="Filter by expected return date"
              />
              <ChevronDown
                className={`w-3 h-3 shrink-0 ${
                  dateFilter ? 'text-stone-300' : 'text-stone-400'
                }`}
              />
            </label>
          </div>
        </div>

        {/* Active Filter Summary & Reset Pill */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs pt-0.5 px-0.5">
            <span className="text-[11px] text-stone-500 font-medium truncate max-w-[240px] xs:max-w-none">
              Filtered: {statusPreset !== 'all' ? statusPreset.replace('_', ' ') : ''}
              {selectedCategory !== 'all' ? ` · ${selectedCategory}` : ''}
              {dateFilter ? ` · ${formatCompactDate(dateFilter)}` : ''}
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

      {/* Return Items List */}
      <div className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((entry) => {
            const {
              uniqueId,
              bookingId,
              customer,
              item,
              formattedFromDate,
              formattedReturnDate,
              rentalDays,
              quantity,
              isReturned,
              urgency,
              diffDays,
            } = entry;

            return (
              <div
                key={uniqueId}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-stone-300 transition-all overflow-hidden"
              >
                {/* Header: Booking Ref, Customer & Return Urgency Badge */}
                <div className="px-4 py-2.5 border-b border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900">
                      #{bookingId}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-600 font-medium">
                      {customer.name}
                    </span>
                    {customer.phone && (
                      <>
                        <span className="text-stone-300">·</span>
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{customer.phone}</span>
                        </a>
                      </>
                    )}
                  </div>

                  {/* Urgency Status Badge */}
                  <div>
                    {isReturned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Returned & Checked In</span>
                      </span>
                    ) : urgency === 'overdue' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Overdue by {Math.abs(diffDays)} {Math.abs(diffDays) === 1 ? 'day' : 'days'}</span>
                      </span>
                    ) : urgency === 'due_today' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Due Today</span>
                      </span>
                    ) : urgency === 'due_tomorrow' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-stone-100 text-stone-800 border border-stone-300">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>Due Tomorrow</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span>Due in {diffDays} days</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Body: Tool Info & ETR Details */}
                <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
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

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.name}
                        {quantity > 1 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                            ×{quantity}
                          </span>
                        )}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 flex-wrap">
                        <span className="text-amber-800 font-medium">
                          {item.categoryName || 'Equipment'}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-600 font-medium">
                          Rented: {formattedFromDate} ({rentalDays} {rentalDays === 1 ? 'day' : 'days'})
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="inline-flex items-center gap-1 font-bold text-stone-900">
                          <RotateCcw className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>ETR: {formattedReturnDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right Side */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-white text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs"
                        title="Contact customer"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span className="hidden xs:inline">Call</span>
                      </a>
                    )}

                    {!isReturned ? (
                      <button
                        type="button"
                        onClick={() => handleMarkReturned(entry)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 active:scale-95 text-white shadow-2xs transition-all cursor-pointer"
                        title="Mark item received and return to stock"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Mark Returned</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Checked In</span>
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
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              No equipment return records found
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
              {hasActiveFilters
                ? 'Try adjusting your search query, category, or return date filter.'
                : 'There are currently no active rental return records.'}
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

      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{actionToast}</span>
        </div>
      )}
    </div>
  );
}

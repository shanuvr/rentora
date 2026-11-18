import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

// Load or seed bookings from localStorage
const getInitialBookings = () => {
  try {
    const stored = localStorage.getItem('rentora_bookings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((b) => {
          const subtotal =
            b.items?.reduce(
              (sum, item) => sum + (item.subtotal || item.rentalPrice || 0),
              0
            ) ||
            b.subtotal ||
            b.totalAmount ||
            300;
          const updatedItems = b.items?.map((item) => ({
            ...item,
            image:
              item.image === '/images/tools/grinder.jpg'
                ? '/images/tools/angle_grinder.jpg'
                : item.image || '/images/tools/angle_grinder.jpg',
          }));
          return {
            ...b,
            depositAmount: 0,
            subtotal,
            totalAmount: subtotal,
            items: updatedItems || b.items,
            customer: b.customer || {
              name: 'Rahul Sharma',
              phone: '+91 98765 43210',
              location: 'Main Hub',
            },
          };
        });
      }
    }

    // Seed realistic initial bookings across diverse categories and return dates
    const today = new Date();
    const formatSeedDate = (d) =>
      d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    const toISO = (d) => d.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const seedData = [
      {
        bookingId: 'BK-130951',
        txnId: 'TXN-849102',
        createdAt: today.toISOString(),
        status: 'Confirmed',
        pickupStatus: 'uncollected',
        customer: {
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          location: 'Main Hub',
        },
        items: [
          {
            id: 'tool-003',
            name: '4-Inch Angle Grinder Machine (850W)',
            category: 'grinding',
            categoryName: 'Grinders & Cutters',
            image: '/images/tools/angle_grinder.jpg',
            rentalPrice: 300,
            priceUnit: 'day',
            stock: 3,
            quantity: 1,
            fromDate: toISO(today),
            toDate: toISO(tomorrow),
            formattedFrom: formatSeedDate(today),
            formattedTo: formatSeedDate(tomorrow),
            rentalDays: 1,
            subtotal: 300,
            totalAmount: 300,
          },
        ],
        subtotal: 300,
        depositAmount: 0,
        totalAmount: 300,
      },
      {
        bookingId: 'BK-618420',
        txnId: 'TXN-912834',
        createdAt: today.toISOString(),
        status: 'Confirmed',
        pickupStatus: 'uncollected',
        customer: {
          name: 'Arun Kumar',
          phone: '+91 97421 88320',
          location: 'Main Hub',
        },
        items: [
          {
            id: 'tool-001',
            name: 'Electric Impact Hammer Drill (13mm)',
            category: 'drilling',
            categoryName: 'Drills & Breakers',
            image: '/images/tools/drill.jpg',
            rentalPrice: 250,
            priceUnit: 'day',
            stock: 4,
            quantity: 2,
            fromDate: toISO(today),
            toDate: toISO(dayAfter),
            formattedFrom: formatSeedDate(today),
            formattedTo: formatSeedDate(dayAfter),
            rentalDays: 2,
            subtotal: 500,
            totalAmount: 500,
          },
          {
            id: 'tool-004',
            name: 'Heavy Duty Wheelbarrow (Arbana)',
            category: 'site',
            categoryName: 'Site Gear & Arbana',
            image: '/images/tools/wheelbarrow.jpg',
            rentalPrice: 150,
            priceUnit: 'day',
            stock: 6,
            quantity: 1,
            fromDate: toISO(today),
            toDate: toISO(dayAfter),
            formattedFrom: formatSeedDate(today),
            formattedTo: formatSeedDate(dayAfter),
            rentalDays: 2,
            subtotal: 300,
            totalAmount: 300,
          },
        ],
        subtotal: 800,
        depositAmount: 0,
        totalAmount: 800,
      },
      {
        bookingId: 'BK-492715',
        txnId: 'TXN-581940',
        createdAt: new Date(today.getTime() - 86400000).toISOString(),
        status: 'Handed Over',
        pickupStatus: 'collected',
        customer: {
          name: 'Suresh Nair',
          phone: '+91 98450 11293',
          location: 'Main Hub',
        },
        items: [
          {
            id: 'tool-002',
            name: '7-Inch Wood Circular Saw (1400W)',
            category: 'cutting',
            categoryName: 'Wood & Metal Saws',
            image: '/images/tools/wood_saw.jpg',
            rentalPrice: 400,
            priceUnit: 'day',
            stock: 6,
            quantity: 1,
            fromDate: toISO(yesterday),
            toDate: toISO(today),
            formattedFrom: formatSeedDate(yesterday),
            formattedTo: formatSeedDate(today),
            rentalDays: 1,
            subtotal: 400,
            totalAmount: 400,
          },
        ],
        subtotal: 400,
        depositAmount: 0,
        totalAmount: 400,
      },
      {
        bookingId: 'BK-304812',
        txnId: 'TXN-391054',
        createdAt: new Date(today.getTime() - 172800000).toISOString(),
        status: 'Handed Over',
        pickupStatus: 'collected',
        customer: {
          name: 'Rajesh Gowda',
          phone: '+91 94480 32190',
          location: 'Main Hub',
        },
        items: [
          {
            id: 'tool-009',
            name: 'Portable Inverter Arc Welding Set',
            category: 'welding',
            categoryName: 'Welding Sets',
            image: '/images/tools/welder.jpg',
            rentalPrice: 450,
            priceUnit: 'day',
            stock: 1,
            quantity: 1,
            fromDate: toISO(twoDaysAgo),
            toDate: toISO(yesterday),
            formattedFrom: formatSeedDate(twoDaysAgo),
            formattedTo: formatSeedDate(yesterday),
            rentalDays: 1,
            subtotal: 450,
            totalAmount: 450,
          },
        ],
        subtotal: 450,
        depositAmount: 0,
        totalAmount: 450,
      },
    ];

    localStorage.setItem('rentora_bookings', JSON.stringify(seedData));
    return seedData;
  } catch {
    return [];
  }
};

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [bookings, setBookings] = useState(getInitialBookings);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close mobile sidebar on route change without effect cascading render
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setIsMobileOpen(false);
  }

  const loadBookings = () => {
    setBookings(getInitialBookings());
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    try {
      const stored = JSON.parse(localStorage.getItem('rentora_bookings') || '[]');
      const updated = stored.map((b) => {
        if (b.bookingId === bookingId) {
          const isCollected = newStatus === 'Handed Over' || newStatus === 'Completed';
          return {
            ...b,
            status: newStatus,
            pickupStatus: isCollected ? 'collected' : 'uncollected',
          };
        }
        return b;
      });
      localStorage.setItem('rentora_bookings', JSON.stringify(updated));
      setBookings(updated);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleStorage = () => setBookings(getInitialBookings());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Compute uncollected / undelivered items count
  const undeliveredCount = bookings.filter(
    (b) => b.pickupStatus === 'uncollected' || b.status === 'Confirmed'
  ).length;

  // Compute ETR returns due today or overdue
  const todayISO = new Date().toISOString().split('T')[0];
  const etrDueCount = bookings.reduce((count, b) => {
    if (b.status === 'Returned' || b.status === 'Completed') return count;
    const dueItems = (b.items || []).filter((item) => {
      if (item.returnStatus === 'returned') return false;
      const retDate = item.toDate ? item.toDate.slice(0, 10) : todayISO;
      return retDate <= todayISO;
    });
    return count + dueItems.length;
  }, 0);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex font-sans selection:bg-amber-500 selection:text-white">
      {/* Responsive Admin Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        bookingsCount={bookings.length}
        undeliveredCount={undeliveredCount}
        etrDueCount={etrDueCount}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Portal Title */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-stone-900">
                Owner Portal
              </span>
            </div>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-2.5">
            {/* Owner Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                OP
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-stone-900 block leading-tight">
                  Manager
                </span>
                <span className="text-[10px] text-stone-400 font-medium block">
                  Owner Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet context={{ bookings, loadBookings, undeliveredCount, updateBookingStatus }} />
        </main>
      </div>
    </div>
  );
}


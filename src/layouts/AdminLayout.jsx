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
      if (Array.isArray(parsed) && parsed.length >= 8 && parsed.some((b) => b.customer?.name === 'Priya Patel')) {
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

    const daysAgo = (n) => {
      const d = new Date(today);
      d.setDate(today.getDate() - n);
      return d;
    };
    const daysAhead = (n) => {
      const d = new Date(today);
      d.setDate(today.getDate() + n);
      return d;
    };

    const yesterday = daysAgo(1);
    const twoDaysAgo = daysAgo(2);
    const fourDaysAgo = daysAgo(4);
    const sixDaysAgo = daysAgo(6);
    const eightDaysAgo = daysAgo(8);
    const tenDaysAgo = daysAgo(10);
    const twelveDaysAgo = daysAgo(12);
    const thirteenDaysAgo = daysAgo(13);

    const tomorrow = daysAhead(1);
    const dayAfter = daysAhead(2);

    const seedData = [
      // --- PERSON 1: Rahul Sharma (3 Bookings, 3 Products, ₹1,600) ---
      {
        bookingId: 'BK-130951',
        txnId: 'TXN-849102',
        createdAt: today.toISOString(),
        status: 'Confirmed',
        pickupStatus: 'uncollected',
        customer: {
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          location: 'Indiranagar, Bangalore',
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
        bookingId: 'BK-108241',
        txnId: 'TXN-719203',
        createdAt: fourDaysAgo.toISOString(),
        status: 'Returned',
        pickupStatus: 'collected',
        customer: {
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          location: 'Indiranagar, Bangalore',
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
            fromDate: toISO(fourDaysAgo),
            toDate: toISO(twoDaysAgo),
            formattedFrom: formatSeedDate(fourDaysAgo),
            formattedTo: formatSeedDate(twoDaysAgo),
            rentalDays: 2,
            returnStatus: 'returned',
            returnedAt: twoDaysAgo.toISOString(),
            subtotal: 800,
            totalAmount: 800,
          },
        ],
        subtotal: 800,
        depositAmount: 0,
        totalAmount: 800,
      },
      {
        bookingId: 'BK-102914',
        txnId: 'TXN-593021',
        createdAt: tenDaysAgo.toISOString(),
        status: 'Returned',
        pickupStatus: 'collected',
        customer: {
          name: 'Rahul Sharma',
          phone: '+91 98765 43210',
          location: 'Indiranagar, Bangalore',
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
            quantity: 1,
            fromDate: toISO(tenDaysAgo),
            toDate: toISO(eightDaysAgo),
            formattedFrom: formatSeedDate(tenDaysAgo),
            formattedTo: formatSeedDate(eightDaysAgo),
            rentalDays: 2,
            returnStatus: 'returned',
            returnedAt: eightDaysAgo.toISOString(),
            subtotal: 500,
            totalAmount: 500,
          },
        ],
        subtotal: 500,
        depositAmount: 0,
        totalAmount: 500,
      },

      // --- PERSON 2: Priya Patel (2 Bookings, 3 Products, ₹1,300) ---
      {
        bookingId: 'BK-245190',
        txnId: 'TXN-902841',
        createdAt: yesterday.toISOString(),
        status: 'Handed Over',
        pickupStatus: 'collected',
        customer: {
          name: 'Priya Patel',
          phone: '+91 98230 45678',
          location: 'Koramangala, Bangalore',
        },
        items: [
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
            fromDate: toISO(yesterday),
            toDate: toISO(tomorrow),
            formattedFrom: formatSeedDate(yesterday),
            formattedTo: formatSeedDate(tomorrow),
            rentalDays: 2,
            subtotal: 300,
            totalAmount: 300,
          },
          {
            id: 'tool-007',
            name: 'Folding Aluminium Step Ladder (10ft)',
            category: 'ladders',
            categoryName: 'Ladders & Scaffolding',
            image: '/images/tools/ladder.jpg',
            rentalPrice: 200,
            priceUnit: 'day',
            stock: 2,
            quantity: 1,
            fromDate: toISO(yesterday),
            toDate: toISO(tomorrow),
            formattedFrom: formatSeedDate(yesterday),
            formattedTo: formatSeedDate(tomorrow),
            rentalDays: 2,
            subtotal: 400,
            totalAmount: 400,
          },
        ],
        subtotal: 700,
        depositAmount: 0,
        totalAmount: 700,
      },
      {
        bookingId: 'BK-209841',
        txnId: 'TXN-419082',
        createdAt: eightDaysAgo.toISOString(),
        status: 'Returned',
        pickupStatus: 'collected',
        customer: {
          name: 'Priya Patel',
          phone: '+91 98230 45678',
          location: 'Koramangala, Bangalore',
        },
        items: [
          {
            id: 'tool-006',
            name: 'Heavy Duty Marble & Tile Cutter Machine (110mm)',
            category: 'cutting',
            categoryName: 'Wood & Metal Saws',
            image: '/images/tools/marble_cutter.jpg',
            rentalPrice: 300,
            priceUnit: 'day',
            stock: 5,
            quantity: 1,
            fromDate: toISO(eightDaysAgo),
            toDate: toISO(sixDaysAgo),
            formattedFrom: formatSeedDate(eightDaysAgo),
            formattedTo: formatSeedDate(sixDaysAgo),
            rentalDays: 2,
            returnStatus: 'returned',
            returnedAt: sixDaysAgo.toISOString(),
            subtotal: 600,
            totalAmount: 600,
          },
        ],
        subtotal: 600,
        depositAmount: 0,
        totalAmount: 600,
      },

      // --- PERSON 3: Arun Kumar (2 Bookings, 3 Products, ₹1,700) ---
      {
        bookingId: 'BK-618420',
        txnId: 'TXN-912834',
        createdAt: today.toISOString(),
        status: 'Confirmed',
        pickupStatus: 'uncollected',
        customer: {
          name: 'Arun Kumar',
          phone: '+91 97421 88320',
          location: 'Whitefield, Bangalore',
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
        bookingId: 'BK-603192',
        txnId: 'TXN-658201',
        createdAt: sixDaysAgo.toISOString(),
        status: 'Returned',
        pickupStatus: 'collected',
        customer: {
          name: 'Arun Kumar',
          phone: '+91 97421 88320',
          location: 'Whitefield, Bangalore',
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
            fromDate: toISO(sixDaysAgo),
            toDate: toISO(fourDaysAgo),
            formattedFrom: formatSeedDate(sixDaysAgo),
            formattedTo: formatSeedDate(fourDaysAgo),
            rentalDays: 2,
            returnStatus: 'returned',
            returnedAt: fourDaysAgo.toISOString(),
            subtotal: 900,
            totalAmount: 900,
          },
        ],
        subtotal: 900,
        depositAmount: 0,
        totalAmount: 900,
      },

      // --- PERSON 4: Suresh Nair (2 Bookings, 2 Products, ₹700) ---
      {
        bookingId: 'BK-492715',
        txnId: 'TXN-581940',
        createdAt: yesterday.toISOString(),
        status: 'Handed Over',
        pickupStatus: 'collected',
        customer: {
          name: 'Suresh Nair',
          phone: '+91 98450 11293',
          location: 'Jayanagar, Bangalore',
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
        bookingId: 'BK-410982',
        txnId: 'TXN-321094',
        createdAt: thirteenDaysAgo.toISOString(),
        status: 'Returned',
        pickupStatus: 'collected',
        customer: {
          name: 'Suresh Nair',
          phone: '+91 98450 11293',
          location: 'Jayanagar, Bangalore',
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
            fromDate: toISO(thirteenDaysAgo),
            toDate: toISO(twelveDaysAgo),
            formattedFrom: formatSeedDate(thirteenDaysAgo),
            formattedTo: formatSeedDate(twelveDaysAgo),
            rentalDays: 1,
            returnStatus: 'returned',
            returnedAt: twelveDaysAgo.toISOString(),
            subtotal: 300,
            totalAmount: 300,
          },
        ],
        subtotal: 300,
        depositAmount: 0,
        totalAmount: 300,
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


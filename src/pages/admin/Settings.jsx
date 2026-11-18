import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Store,
  Boxes,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  UploadCloud,
} from 'lucide-react';
import {
  CATEGORIES,
  getStoredProducts,
  saveStoredProducts,
} from '../../data/products';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'hub' | 'security'

  // --- Hub Profile State ---
  const [hubName, setHubName] = useState('Rentora Main Equipment Hub');
  const [openingTime, setOpeningTime] = useState('07:00 AM');
  const [closingTime, setClosingTime] = useState('08:00 PM');
  const [hubSaved, setHubSaved] = useState(false);

  // --- Password State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwdStatus, setPwdStatus] = useState(null);

  // --- Product Master State ---
  const [products, setProducts] = useState(getStoredProducts);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [masterToast, setMasterToast] = useState(null);

  // Form State for Add / Edit Product Modal
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('drilling');
  const [formPrice, setFormPrice] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSpec1, setFormSpec1] = useState('');
  const [formSpec2, setFormSpec2] = useState('');
  const [formSpec3, setFormSpec3] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formStock, setFormStock] = useState('3');

  // File Upload State & Drag Drop
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // Sync products from localStorage on mount and updates
  useEffect(() => {
    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('rentora_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rentora_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const showToast = (msg) => {
    setMasterToast(msg);
    setTimeout(() => setMasterToast(null), 3000);
  };

  // Open modal for Adding new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('drilling');
    setFormPrice('');
    setFormStock('3');
    setFormImage('');
    setFormSpec1('');
    setFormSpec2('');
    setFormSpec3('');
    setFormDescription('');
    setFormIsAvailable(true);
    setIsModalOpen(true);
  };

  // Open modal for Editing existing product
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category || 'drilling');
    setFormPrice(String(prod.rentalPrice || ''));
    setFormStock(String(typeof prod.stock === 'number' ? prod.stock : 3));
    setFormImage(prod.image || '/images/tools/drill.jpg');
    setFormSpec1(prod.specs?.[0]?.label || '');
    setFormSpec2(prod.specs?.[1]?.label || '');
    setFormSpec3(prod.specs?.[2]?.label || '');
    setFormDescription(prod.bullets?.[0] || '');
    setFormIsAvailable(prod.isAvailable !== false);
    setIsModalOpen(true);
  };

  // Save (Create or Update) Product
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter a tool name.');
      return;
    }
    const priceNum = Number(formPrice);
    if (!priceNum || priceNum <= 0) {
      alert('Please enter a valid daily rental price.');
      return;
    }
    const stockNum = Math.max(0, parseInt(formStock, 10) || 1);
    if (!formImage) {
      alert('Please upload a photo for the tool.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === formCategory);
    const categoryName = catObj ? catObj.name : 'Equipment';

    const specsArray = [];
    if (formSpec1.trim()) specsArray.push({ icon: 'Zap', label: formSpec1.trim() });
    if (formSpec2.trim()) specsArray.push({ icon: 'Settings', label: formSpec2.trim() });
    if (formSpec3.trim()) specsArray.push({ icon: 'Gauge', label: formSpec3.trim() });
    if (specsArray.length === 0) {
      specsArray.push({ icon: 'Wrench', label: 'Heavy Duty' });
    }

    let updatedList;
    if (editingProduct) {
      // Update existing
      updatedList = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName.trim(),
            category: formCategory,
            categoryName,
            rentalPrice: priceNum,
            stock: stockNum,
            image: formImage || '/images/tools/drill.jpg',
            specs: specsArray,
            bullets: formDescription.trim() ? [formDescription.trim()] : p.bullets,
            isAvailable: formIsAvailable,
          };
        }
        return p;
      });
      showToast(`Updated "${formName.trim()}" successfully!`);
    } else {
      // Create new
      const newTool = {
        id: `tool-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        categoryName,
        rentalPrice: priceNum,
        priceUnit: 'day',
        stock: stockNum,
        image: formImage || '/images/tools/drill.jpg',
        specs: specsArray,
        tags: [categoryName],
        bullets: [formDescription.trim() || 'Heavy-duty professional rental equipment'],
        offer: 'Instant Storefront Availability',
        isAvailable: formIsAvailable,
        expectedAvailability: null,
      };
      updatedList = [newTool, ...products];
      showToast(`Added "${formName.trim()}" to Product Master!`);
    }

    setProducts(updatedList);
    saveStoredProducts(updatedList);
    setIsModalOpen(false);
  };

  // Toggle single product availability (In Stock / Out of Stock)
  const handleToggleAvailability = (prodId) => {
    const updatedList = products.map((p) => {
      if (p.id === prodId) {
        return { ...p, isAvailable: !p.isAvailable };
      }
      return p;
    });
    setProducts(updatedList);
    saveStoredProducts(updatedList);
    showToast('Updated tool availability status');
  };

  // Delete product
  const handleDeleteProduct = (prodId, prodName) => {
    if (window.confirm(`Delete "${prodName}" from the product catalog?`)) {
      const updatedList = products.filter((p) => p.id !== prodId);
      setProducts(updatedList);
      saveStoredProducts(updatedList);
      showToast(`Deleted "${prodName}"`);
    }
  };

  // Filtered products in master list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(query);
        const matchesCat = p.categoryName?.toLowerCase().includes(query);
        const matchesSpecs = p.specs?.some((s) => s.label.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesSpecs) return false;
      }
      if (categoryFilter !== 'all') {
        if (p.category !== categoryFilter) return false;
      }
      return true;
    });
  }, [products, productSearch, categoryFilter]);

  // Hub Save Handler
  const handleSaveHub = (e) => {
    e.preventDefault();
    setHubSaved(true);
    setTimeout(() => setHubSaved(false), 2500);
  };

  // Password Change Handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPwdStatus({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdStatus({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwdStatus({ type: 'success', text: 'Owner admin password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdStatus(null), 3500);
  };

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Toast Notification */}
      {masterToast && (
        <div className="fixed top-4 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{masterToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Settings & Master
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Manage your product inventory master, hub profile, and admin security
          </p>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Product Master</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-700 font-semibold border border-stone-200">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hub')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hub'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Hub Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password & Security</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: PRODUCT MASTER                                                */}
      {/* ==================================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] sm:max-w-xs">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search tool master..."
                  className="w-full pl-8 pr-7 py-1.5 bg-stone-50 focus:bg-white text-xs text-stone-900 font-medium rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors"
                />
                {productSearch && (
                  <button
                    type="button"
                    onClick={() => setProductSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-stone-50 focus:bg-white text-xs text-stone-700 font-medium rounded-lg border border-stone-300 focus:border-stone-900 outline-none transition-colors cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Tool Button */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Add New Tool</span>
            </button>
          </div>

          {/* Products List Table / Cards */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-3 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <span className="text-[11px] text-stone-400">
                Changes update customer catalog instantly
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-stone-50/70 transition-colors"
                  >
                    {/* Tool Photo */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <img
                        src={prod.image || '/images/tools/drill.jpg'}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/tools/drill.jpg';
                        }}
                      />
                    </div>

                    {/* Tool Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {prod.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                          {prod.categoryName || 'Equipment'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500 flex-wrap">
                        <span className="font-bold text-stone-800">
                          ₹{prod.rentalPrice}/day
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
                          {typeof prod.stock === 'number' ? `${prod.stock} in stock` : 'In Stock'}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="truncate max-w-xs text-stone-500">
                          {prod.specs?.map((s) => s.label).join(' · ') || 'Heavy Duty'}
                        </span>
                      </div>
                    </div>

                    {/* Availability & Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(prod.id)}
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-bold border transition-colors cursor-pointer ${
                          prod.isAvailable !== false
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            prod.isAvailable !== false ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                        />
                        <span>
                          {prod.isAvailable !== false
                            ? typeof prod.stock === 'number'
                              ? `${prod.stock} in stock`
                              : 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Edit Tool"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Tool"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-stone-400">
                <Boxes className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                <h4 className="text-xs font-bold text-stone-800 mb-1">
                  No matching tools found
                </h4>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto mb-3">
                  Try adjusting your search or add a new tool to your master catalog.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold shadow-2xs hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Add New Tool
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: HUB DETAILS & HOURS                                           */}
      {/* ==================================================================== */}
      {activeTab === 'hub' && (
        <form
          onSubmit={handleSaveHub}
          className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4 max-w-xl"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Store className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Hub Profile & Hours</h2>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Store / Hub Name
            </label>
            <input
              type="text"
              value={hubName}
              onChange={(e) => setHubName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Opening Time
              </label>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Closing Time
              </label>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Hub Details</span>
            </button>

            {hubSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved successfully</span>
              </span>
            )}
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PASSWORD & SECURITY                                           */}
      {/* ==================================================================== */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4 max-w-xl"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-stone-600" />
              <h2 className="text-sm font-bold text-stone-900">Change Admin Password</h2>
            </div>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              {showPassword ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Hide Passwords</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Show Passwords</span>
                </>
              )}
            </button>
          </div>

          {/* Current Password */}
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Current Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
            />
          </div>

          {/* New Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {pwdStatus && (
            <div
              className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
                pwdStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              {pwdStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{pwdStatus.text}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}

      {/* ==================================================================== */}
      {/* ADD / EDIT TOOL MODAL DIALOG                                         */}
      {/* ==================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-stone-300 relative my-8 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-stone-900" />
                <h3 className="text-base font-bold text-stone-900">
                  {editingProduct ? 'Edit Tool in Master' : 'Add New Tool to Master'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Tool Name */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Tool / Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 16-Inch Petrol Chainsaw (52cc)"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
                />
              </div>

              {/* Category, Daily Price & Stock Units Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Daily Rate (₹/day) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="e.g. 3"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1.5">
                  Upload Tool Photo *
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {formImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-stone-50 group">
                    <img
                      src={formImage}
                      alt="Uploaded tool"
                      className="w-full h-44 object-contain bg-stone-900/5 p-2"
                    />
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-sm hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormImage('')}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-stone-900 bg-stone-100'
                        : 'border-stone-300 hover:border-stone-500 bg-stone-50/70 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto mb-2 text-stone-600 shadow-2xs">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-stone-800 mb-0.5">
                      Click to upload photo or drag & drop
                    </p>
                    <p className="text-[10px] text-stone-400">
                      PNG, JPG, or WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Specifications (3 User-Friendly Fields) */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Core Specifications
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={formSpec1}
                    onChange={(e) => setFormSpec1(e.target.value)}
                    placeholder="Spec 1: e.g. 750W Motor"
                    className="px-2.5 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none"
                  />
                  <input
                    type="text"
                    value={formSpec2}
                    onChange={(e) => setFormSpec2(e.target.value)}
                    placeholder="Spec 2: e.g. 13mm Chuck"
                    className="px-2.5 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none"
                  />
                  <input
                    type="text"
                    value={formSpec3}
                    onChange={(e) => setFormSpec3(e.target.value)}
                    placeholder="Spec 3: e.g. Impact Mode"
                    className="px-2.5 py-1.5 text-xs bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Short Description
                </label>
                <textarea
                  rows="2"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Suitable for concrete walls, brickwork, metal, and wood drilling"
                  className="w-full px-3 py-2 text-xs bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors resize-none"
                />
              </div>

              {/* Availability Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formAvail"
                  checked={formIsAvailable}
                  onChange={(e) => setFormIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-900 cursor-pointer"
                />
                <label
                  htmlFor="formAvail"
                  className="text-xs font-bold text-stone-800 cursor-pointer"
                >
                  Mark Available for customer bookings immediately
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Save Tool to Master'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

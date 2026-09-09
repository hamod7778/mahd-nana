'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  CreditCard,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  Eye,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  X,
  Layers,
  Image as ImageIcon,
  Lock,
  User,
  LogOut,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Upload,
  Sliders,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  images?: string;
  categoryId: string;
  category?: { name: string };
  stock: number;
  featured: boolean;
  badge?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  _count?: { products: number };
}

interface ExchangeAccount {
  id: string;
  name: string;
  accountName: string;
  accountNumber: string;
  instructions?: string;
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  image: string;
  linkUrl?: string | null;
  sortOrder: number;
}

interface Governorate {
  id: string;
  name: string;
  shippingFee: number;
  isActive: boolean;
}

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  notes?: string;
  exchangeAccountName: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

function formatDate(dateString: string) {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} - ${hours}:${mins}`;
  } catch (e) {
    return dateString;
  }
}

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs & Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'exchanges' | 'banners' | 'governorates' | 'settings'>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [exchangeAccounts, setExchangeAccounts] = useState<ExchangeAccount[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // Settings state
  const [settingsForm, setSettingsForm] = useState({
    storeName: 'متجر مهد ونعناع',
    whatsappNumber: '967771234567',
    announcementText: '🚚 توصيل لجميع المحافظات اليمنية | 💳 الدفع بالتحويل لجميع شبكات الصرافة بالريال السعودي',
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filter state for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Product modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    images: '',
    categoryId: '',
    stock: '10',
    featured: false,
    badge: '',
  });

  // Category modal state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({
    name: '',
    image: '',
    icon: 'Baby',
  });

  // Exchange modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [editingExchangeId, setEditingExchangeId] = useState<string | null>(null);
  const [exchangeForm, setExchangeForm] = useState({
    name: '',
    accountName: '',
    accountNumber: '',
    instructions: '',
    isActive: true,
  });

  // Banner modal state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    badge: '',
    image: '',
    sortOrder: '1',
  });
  const [uploadingBannerFile, setUploadingBannerFile] = useState(false);

  // Governorate modal state
  const [showGovModal, setShowGovModal] = useState(false);
  const [editingGovId, setEditingGovId] = useState<string | null>(null);
  const [govForm, setGovForm] = useState({
    name: '',
    shippingFee: '15',
    isActive: true,
  });

  // Check auth session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/check');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
          if (data.authenticated) {
            loadAllAdminData();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword) {
      setLoginError('يرجى كتابة اسم المستخدم وكلمة المرور');
      return;
    }

    try {
      setLoginLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAllAdminData();
      } else {
        setLoginError(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (err: any) {
      setLoginError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setLoginPassword('');
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [prodsRes, catsRes, exchRes, ordersRes, settingsRes, bannersRes, govsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/exchange-accounts'),
        fetch('/api/orders'),
        fetch('/api/settings'),
        fetch('/api/banners'),
        fetch('/api/governorates'),
      ]);

      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (catsRes.ok) setCategories(await catsRes.json());
      if (exchRes.ok) setExchangeAccounts(await exchRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (govsRes.ok) setGovernorates(await govsRes.json());
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        setSettingsForm({
          storeName: sData.storeName || 'متجر مهد ونعناع',
          whatsappNumber: sData.whatsappNumber || '967771234567',
          announcementText: sData.announcementText || '',
        });
      }
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  // Save Settings Form
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });

      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );

        if (data.customerWhatsappUrl && confirm('هل تريد إرسال رسالة تحديث حالة الطلب للعميل عبر الواتساب؟')) {
          window.open(data.customerWhatsappUrl, '_blank');
        }
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  // Product Save Form
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProductId ? `/api/products/${editingProductId}` : '/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const imagesArray = prodForm.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      if (prodForm.image && !imagesArray.includes(prodForm.image)) {
        imagesArray.unshift(prodForm.image);
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...prodForm,
          images: JSON.stringify(imagesArray),
          categoryId: prodForm.categoryId || (categories[0]?.id ?? ''),
        }),
      });

      if (res.ok) {
        setShowProductModal(false);
        setEditingProductId(null);
        setProdForm({
          name: '',
          description: '',
          price: '',
          oldPrice: '',
          image: '',
          images: '',
          categoryId: '',
          stock: '10',
          featured: false,
          badge: '',
        });
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to save product', e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا المنتج؟')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  // Category Save Form
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategoryId ? `/api/categories/${editingCategoryId}` : '/api/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catForm),
      });

      if (res.ok) {
        setShowCategoryModal(false);
        setEditingCategoryId(null);
        setCatForm({ name: '', image: '', icon: 'Baby' });
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to save category', e);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متاكد من رغبتك في حذف هذا القسم؟ سيتم حذف جميع الربط بالمنتجات.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete category', e);
    }
  };

  // Exchange Save Form
  const handleSaveExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingExchangeId ? `/api/exchange-accounts/${editingExchangeId}` : '/api/exchange-accounts';
      const method = editingExchangeId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exchangeForm),
      });

      if (res.ok) {
        setShowExchangeModal(false);
        setEditingExchangeId(null);
        setExchangeForm({
          name: '',
          accountName: '',
          accountNumber: '',
          instructions: '',
          isActive: true,
        });
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to save exchange account', e);
    }
  };

  // Upload image handler
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'banner' | 'category' | 'product') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (targetField === 'banner') setUploadingBannerFile(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (targetField === 'banner') {
          setBannerForm((prev) => ({ ...prev, image: data.url }));
        } else if (targetField === 'category') {
          setCatForm((prev) => ({ ...prev, image: data.url }));
        } else if (targetField === 'product') {
          setProdForm((prev) => ({ ...prev, image: data.url }));
        }
      } else {
        alert('فشل رفع الصورة، يرجى المحاولة مرة أخرى');
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      if (targetField === 'banner') setUploadingBannerFile(false);
    }
  };

  // Banner Save Form
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBannerId ? `/api/banners/${editingBannerId}` : '/api/banners';
      const method = editingBannerId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bannerForm,
          sortOrder: parseInt(bannerForm.sortOrder) || 1,
        }),
      });

      if (res.ok) {
        setShowBannerModal(false);
        setEditingBannerId(null);
        setBannerForm({ title: '', subtitle: '', badge: '', image: '', sortOrder: '1' });
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to save banner', e);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id: string) => {
    if (!confirm('هل أنت متاكد من رغبتك في حذف هذا البانر؟')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete banner', e);
    }
  };

  // Governorate Save Form
  const handleSaveGov = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingGovId ? `/api/governorates/${editingGovId}` : '/api/governorates';
      const method = editingGovId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: govForm.name,
          shippingFee: parseFloat(govForm.shippingFee) || 0,
          isActive: govForm.isActive,
        }),
      });

      if (res.ok) {
        setShowGovModal(false);
        setEditingGovId(null);
        setGovForm({ name: '', shippingFee: '15', isActive: true });
        loadAllAdminData();
      }
    } catch (e) {
      console.error('Failed to save governorate', e);
    }
  };

  // Quick Shipping Fee Update
  const handleQuickGovFeeUpdate = async (id: string, newFee: number) => {
    try {
      const res = await fetch(`/api/governorates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingFee: newFee }),
      });

      if (res.ok) {
        setGovernorates((prev) =>
          prev.map((g) => (g.id === id ? { ...g, shippingFee: newFee } : g))
        );
      }
    } catch (e) {
      console.error('Failed to quick update shipping fee', e);
    }
  };

  // Delete Governorate
  const handleDeleteGov = async (id: string) => {
    if (!confirm('هل أنت متاكد من حذف هذه المحافظة من القائمة؟')) return;
    try {
      const res = await fetch(`/api/governorates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGovernorates((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (e) {
      console.error('Failed to delete governorate', e);
    }
  };

  // Stats
  const totalSalesSAR = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;

  const filteredOrders = orders.filter((o) =>
    orderStatusFilter === 'ALL' ? true : o.status === orderStatusFilter
  );

  // INITIAL LOADING STATE
  if (isAuthenticated === null) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-bold text-sm">جاري التحقق من أذونات لوحة التحكم...</p>
      </div>
    );
  }

  // ADMIN LOGIN FORM (When Not Authenticated)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 salla-card-shadow space-y-6 text-center animate-fade-in">
          
          <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-lg mx-auto border-2 border-rose-100 bg-white p-1">
            <img src="/logo.jpg" alt="مهد ونعناع" className="w-full h-full object-cover rounded-2xl" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-900">لوحة تحكم مهد ونعناع 🔒</h1>
            <p className="text-xs text-slate-500 mt-1">أدخل بيانات المسؤول للوصول لإدارة المنتجات والطلبات</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم المستخدم <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-800 text-sm font-bold rounded-xl py-3 pr-10 pl-4 outline-none transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور (المشفّرة) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-800 text-sm font-bold rounded-xl py-3 pr-10 pl-4 outline-none transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-rose-200 transition transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>تسجيل الدخول للوحة التحكم</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // FULL ADMIN DASHBOARD (When Authenticated)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Refresh & Logout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="مهد ونعناع" className="w-12 h-12 rounded-2xl object-cover border border-rose-100 p-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900">لوحة تحكم متجر مهد ونعناع 🛠️</h1>
              <span className="bg-rose-100 text-rose-600 text-xs font-black px-2.5 py-0.5 rounded-full">
                الداشبورد
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">متابعة المبيعات بالريال السعودي، إدارة الطلبات، الأصناف والأقسام، وصرافات التحويل</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث البيانات</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl flex items-center gap-2 transition border border-rose-200/60"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'overview'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>نظرة عامة وإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'orders'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>إدارة الطلبات ({orders.length})</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
              {pendingOrdersCount} جديد
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'products'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>المنتجات والقطع ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'categories'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>إدارة الأقسام والصور ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'banners'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>صور البنرات والسلايدر 🖼️ ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('governorates')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'governorates'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>رسوم توصيل المحافظات 🚚 ({governorates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('exchanges')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'exchanges'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>حسابات الصرافة اليمنية ({exchangeAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'settings'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات المتجر والواتساب 📱</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">إجمالي المبيعات:</span>
                <span className="text-2xl font-black text-slate-900">{totalSalesSAR} ر.س</span>
                <span className="text-[10px] text-emerald-600 font-bold block">بالريال السعودي</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">عدد الطلبات الإجمالي:</span>
                <span className="text-2xl font-black text-slate-900">{orders.length} طلبات</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">طلبات قيد المراجعة:</span>
                <span className="text-2xl font-black text-amber-600">{pendingOrdersCount} طلب</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block">أقسام المتجر:</span>
                <span className="text-2xl font-black text-slate-900">{categories.length} قسم</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900">أحدث الطلبات المستلمة 📦</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                عرض كل الطلبات ({orders.length}) ←
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">لا يوجد طلبات مسجلة حتى الآن.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3">رقم الطلب</th>
                      <th className="pb-3">اسم العميل</th>
                      <th className="pb-3">المحافظة</th>
                      <th className="pb-3">المبلغ (ر.س)</th>
                      <th className="pb-3">شركة الصرافة</th>
                      <th className="pb-3">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-rose-600">#{o.orderCode}</td>
                        <td className="py-3 font-bold text-slate-800">{o.customerName}</td>
                        <td className="py-3 text-slate-600">{o.city}</td>
                        <td className="py-3 font-black text-slate-900">{o.totalAmount} ر.س</td>
                        <td className="py-3 text-slate-600">{o.exchangeAccountName}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              o.status === 'VERIFIED' || o.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : o.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {o.status === 'PENDING'
                              ? '⏳ قيد الانتظار'
                              : o.status === 'VERIFIED'
                              ? '💳 تم التأكيد'
                              : o.status === 'SHIPPED'
                              ? '🚚 تم الشحن'
                              : o.status === 'DELIVERED'
                              ? '✅ تم التوصيل'
                              : 'ملغي'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-lg text-slate-800">إدارة طلبات العملاء الشاملة 📋</h3>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="font-bold text-slate-500">تصفية حسب الحالة:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-transparent font-bold text-rose-600 outline-none cursor-pointer"
              >
                <option value="ALL">جميع الطلبات ({orders.length})</option>
                <option value="PENDING">⏳ قيد الانتظار</option>
                <option value="VERIFIED">💳 تم التأكيد</option>
                <option value="PREPARING">📦 قيد التجهيز</option>
                <option value="SHIPPED">🚚 تم الشحن</option>
                <option value="DELIVERED">✅ تم التوصيل</option>
                <option value="CANCELLED">❌ ملغي</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-100 p-6 salla-card-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-rose-600">#{order.orderCode}</span>
                      <span className="text-xs text-slate-400">• {formatDate(order.createdAt)}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mt-0.5">{order.customerName}</h4>
                    <p className="text-xs text-slate-500">
                      📍 {order.city} - {order.address} | 📞 <span className="font-mono font-bold">{order.customerPhone}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block font-bold">المبلغ الكلي:</span>
                      <span className="text-lg font-black text-rose-600">{order.totalAmount} ر.س</span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-500"
                    >
                      <option value="PENDING">⏳ قيد الانتظار</option>
                      <option value="VERIFIED">💳 تم تأكيد الدفع</option>
                      <option value="PREPARING">📦 قيد التجهيز</option>
                      <option value="SHIPPED">🚚 تم الشحن</option>
                      <option value="DELIVERED">✅ تم التوصيل</option>
                      <option value="CANCELLED">❌ ملغي</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-600 block mb-1">المنتجات المطلوبة:</span>
                    <ul className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {order.items.map((it) => (
                        <li key={it.id} className="flex justify-between">
                          <span>• {it.productName} (x{it.quantity})</span>
                          <span className="font-bold">{it.price * it.quantity} ر.س</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-600 block">تفاصيل الدفع والتواصل:</span>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <p>الصرافة المختارة: <strong>{order.exchangeAccountName}</strong></p>
                      {order.notes && <p className="text-slate-500 italic">ملاحظات: {order.notes}</p>}
                    </div>

                    <a
                      href={`https://wa.me/967${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`أهلاً بك عزيزي ${order.customerName}، يسعدنا متابعة طلبك رقم #${order.orderCode} لدى متجر مهد ونعناع 🌸`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs hover:bg-emerald-600 transition"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>مراسلة العميل مباشر عبر الواتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 3. PRODUCTS MANAGEMENT TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-800">قائمة أصناف المنتجات 🛍️</h3>
            <button
              onClick={() => {
                setEditingProductId(null);
                setProdForm({
                  name: '',
                  description: '',
                  price: '',
                  oldPrice: '',
                  image: '',
                  images: '',
                  categoryId: categories[0]?.id || '',
                  stock: '10',
                  featured: false,
                  badge: '',
                });
                setShowProductModal(true);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-100 p-4 salla-card-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded-2xl bg-slate-50" />
                  <div>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {p.category?.name || 'عام'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">{p.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2 font-black text-rose-600">
                    <span>{p.price} ر.س</span>
                    {p.oldPrice && <span className="text-xs text-slate-400 line-through">{p.oldPrice} ر.س</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-bold">المخزون: {p.stock > 0 ? 'متوفر' : 'غير متوفر'}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        let parsedImgs = '';
                        try {
                          if (p.images) {
                            const arr = JSON.parse(p.images);
                            if (Array.isArray(arr)) parsedImgs = arr.join('\n');
                          }
                        } catch (e) {
                          parsedImgs = p.images || '';
                        }
                        setEditingProductId(p.id);
                        setProdForm({
                          name: p.name,
                          description: p.description,
                          price: p.price.toString(),
                          oldPrice: p.oldPrice ? p.oldPrice.toString() : '',
                          image: p.image,
                          images: parsedImgs,
                          categoryId: p.categoryId,
                          stock: p.stock.toString(),
                          featured: p.featured,
                          badge: p.badge || '',
                        });
                        setShowProductModal(true);
                      }}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. CATEGORIES MANAGEMENT TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">إدارة أقسام وتصنيفات المتجر 🍼</h3>
              <p className="text-xs text-slate-500">يمكنك هنا إضافة وتعديل الأقسام وتغيير الصور المعروضة في الرئيسية</p>
            </div>
            <button
              onClick={() => {
                setEditingCategoryId(null);
                setCatForm({ name: '', image: '', icon: 'Baby' });
                setShowCategoryModal(true);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قسم جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 salla-card-shadow flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-rose-500 bg-rose-50">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base">{cat.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">/{cat.slug}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                      {cat._count?.products || 0} منتج مرتبطة
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingCategoryId(cat.id);
                      setCatForm({
                        name: cat.name,
                        image: cat.image || '',
                        icon: cat.icon || 'Baby',
                      });
                      setShowCategoryModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BANNERS / HERO SLIDER TAB */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">إدارة صور البنرات والسلايدر الرئيسي 🖼️</h3>
              <p className="text-xs text-slate-500">رفع وتعديل الصور المعروضة في السلايدر الترويجي بالصفحة الرئيسية للمتجر</p>
            </div>
            <button
              onClick={() => {
                setEditingBannerId(null);
                setBannerForm({ title: '', subtitle: '', badge: '', image: '', sortOrder: (banners.length + 1).toString() });
                setShowBannerModal(true);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة بنر / صورة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-3xl border border-slate-100 p-4 salla-card-shadow flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{b.title || 'بنر ترويجي'}</h4>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono font-bold">الترتيب: #{b.sortOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingBannerId(b.id);
                        setBannerForm({
                          title: b.title || '',
                          subtitle: b.subtitle || '',
                          badge: b.badge || '',
                          image: b.image,
                          sortOrder: b.sortOrder.toString(),
                        });
                        setShowBannerModal(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. GOVERNORATES SHIPPING FEES TAB (NEW) */}
      {activeTab === 'governorates' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">إدارة رسوم التوصيل حسب المحافظات اليمنية 🚚</h3>
              <p className="text-xs text-slate-500">حدد سعر التوصيل بالريال السعودي لكل محافظة وسيتم تحديثها فوراً بملخص الطلب للعميل</p>
            </div>
            <button
              onClick={() => {
                setEditingGovId(null);
                setGovForm({ name: '', shippingFee: '15', isActive: true });
                setShowGovModal(true);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة محافظة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {governorates.map((gov) => (
              <div
                key={gov.id}
                className="bg-white p-5 rounded-3xl border border-slate-100 salla-card-shadow space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    <h4 className="font-black text-sm text-slate-900">{gov.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${gov.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    {gov.isActive !== false ? 'مفعلة' : 'معطلة'}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">رسوم التوصيل (ريال سعودي):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="1"
                      value={gov.shippingFee}
                      onChange={(e) => handleQuickGovFeeUpdate(gov.id, parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-rose-600 font-black text-base rounded-xl py-1.5 px-3 outline-none text-center"
                    />
                    <span className="text-xs font-bold text-slate-500 shrink-0">ر.س</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setEditingGovId(gov.id);
                      setGovForm({
                        name: gov.name,
                        shippingFee: gov.shippingFee.toString(),
                        isActive: gov.isActive !== false,
                      });
                      setShowGovModal(true);
                    }}
                    className="text-slate-600 hover:text-rose-600 font-bold flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteGov(gov.id)}
                    className="text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. EXCHANGES MANAGEMENT TAB */}
      {activeTab === 'exchanges' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-800">إدارة شبكات وحسابات الصرافة 💳</h3>
            <button
              onClick={() => {
                setEditingExchangeId(null);
                setExchangeForm({
                  name: '',
                  accountName: '',
                  accountNumber: '',
                  instructions: '',
                  isActive: true,
                });
                setShowExchangeModal(true);
              }}
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة حساب صرافة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {exchangeAccounts.map((acc) => (
              <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-100 salla-card-shadow space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-base text-rose-600">{acc.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${acc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                    {acc.isActive ? 'نشط' : 'معطل'}
                  </span>
                </div>
                <p className="text-xs text-slate-700"><strong>اسم المستفيد:</strong> {acc.accountName}</p>
                <p className="text-xs text-slate-700"><strong>رقم الحساب / الجوال:</strong> <span className="font-mono font-bold">{acc.accountNumber}</span></p>
                {acc.instructions && <p className="text-xs text-slate-500 italic">{acc.instructions}</p>}

                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingExchangeId(acc.id);
                      setExchangeForm({
                        name: acc.name,
                        accountName: acc.accountName,
                        accountNumber: acc.accountNumber,
                        instructions: acc.instructions || '',
                        isActive: acc.isActive,
                      });
                      setShowExchangeModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
                  >
                    تعديل
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. STORE SETTINGS & WHATSAPP TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fade-in max-w-2xl">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 salla-card-shadow space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">إعدادات رقم الواتساب والهوية 📱</h3>
                <p className="text-xs text-slate-500">تعديل رقم الهاتف الذي تتلقى عليه فواتير وإيصالات العملاء بالواتساب</p>
              </div>
            </div>

            {settingsSaved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>تم حفظ إعدادات رقم الواتساب واسم المتجر بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                  رقم الواتساب لاستقبال الطلبات <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="967771234567"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-900 font-mono text-base font-bold rounded-xl py-3 pr-10 pl-4 outline-none transition"
                  />
                  <PhoneCall className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  اكتب الرقم مع مفتاح الدولة لليمن بدون مساحات (مثال: <code className="font-mono text-rose-600 font-bold">967771234567</code>). سيتم توجيه العملاء مباشرة لهذا الرقم عند الشراء.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                  اسم المتجر الرسمي
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.storeName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-900 text-sm font-bold rounded-xl py-3 px-4 outline-none transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5 text-sm">
                  شريط الإعلانات الترويجي (أعلى الهيدر)
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:bg-white text-slate-900 text-xs font-bold rounded-xl py-3 px-4 outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-extrabold rounded-2xl hover:bg-rose-600 transition shadow-lg shadow-rose-200 text-sm"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GOVERNORATE FORM MODAL */}
      {showGovModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowGovModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900">
              {editingGovId ? 'تعديل المحافظة' : 'إضافة محافظة جديدة'}
            </h3>

            <form onSubmit={handleSaveGov} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المحافظة <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تعز"
                  value={govForm.name}
                  onChange={(e) => setGovForm({ ...govForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">سعر/رسوم التوصيل (بالريال السعودي SAR) <span className="text-rose-500">*</span></label>
                <input
                  type="number"
                  step="1"
                  required
                  placeholder="مثال: 20"
                  value={govForm.shippingFee}
                  onChange={(e) => setGovForm({ ...govForm, shippingFee: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500 font-bold"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="govActive"
                  checked={govForm.isActive}
                  onChange={(e) => setGovForm({ ...govForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500"
                />
                <label htmlFor="govActive" className="font-bold text-slate-700 cursor-pointer">مفعلة وتظهر بقائمة المحافظات للزبون</label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 transition text-sm shadow-md"
              >
                حفظ المحافظة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BANNER FORM MODAL */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowBannerModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900">
              {editingBannerId ? 'تعديل بيانات البنر' : 'إضافة بنر / صورة جديدة للسلايدر'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان الرئيسي للبنر <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أطقم قطنية فاخرة للرضع"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">العنوان الفرعي (الوصف)</label>
                <input
                  type="text"
                  placeholder="مثال: خامات مريحة ولطيفة جداً على بشرة المولود"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شارة البنر (Badge)</label>
                  <input
                    type="text"
                    placeholder="مثال: تشكيلة 2026 🔥"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ترتيب الظهور</label>
                  <input
                    type="number"
                    value={bannerForm.sortOrder}
                    onChange={(e) => setBannerForm({ ...bannerForm, sortOrder: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">صورة البنر <span className="text-rose-500">*</span></label>
                
                {/* Upload or URL options */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl flex items-center gap-2 transition text-xs border border-slate-200">
                      <Upload className="w-4 h-4 text-rose-500" />
                      <span>{uploadingBannerFile ? 'جاري رفع الصورة...' : 'اختر صورة من جهازك 📁'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'banner')}
                        className="hidden"
                      />
                    </label>
                    <span className="text-slate-400 font-bold text-[11px]">أو ضع رابط مباشر:</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="https://... أو /uploads/banner.jpg"
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500 font-mono text-[11px]"
                  />
                </div>

                {bannerForm.image && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-36">
                    <img src={bannerForm.image} alt="معاينة البنر" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 transition text-sm shadow-md"
              >
                حفظ البنر
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowCategoryModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900">
              {editingCategoryId ? 'تعديل القسم' : 'إضافة قسم جديد للمتجر'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم القسم</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ملابس مواليد"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">صورة القسم (رابط أو رفع ملف)</label>
                <div className="space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition text-xs">
                    <Upload className="w-4 h-4 text-rose-500" />
                    <span>رفع صورة للقسم</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'category')}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={catForm.image}
                    onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-rose-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">تظهر هذه الصورة في كروت الأقسام بالصفحة الرئيسية للمتجر.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 transition text-sm shadow-md"
              >
                حفظ القسم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT FORM MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900">
              {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المنتج</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الوصف</label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر (ريال سعودي)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">السعر السابق (خصم)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={prodForm.oldPrice}
                    onChange={(e) => setProdForm({ ...prodForm, oldPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الصورة الرئيسية</label>
                  <div className="space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition text-[11px]">
                      <Upload className="w-3.5 h-3.5 text-rose-500" />
                      <span>رفع صورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'product')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      required
                      value={prodForm.image}
                      onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  روابط صور إضافية للمنتج (ضع كل رابط صورة في سطر جديد)
                </label>
                <textarea
                  rows={2}
                  placeholder="https://image1.jpg&#10;https://image2.jpg"
                  value={prodForm.images}
                  onChange={(e) => setProdForm({ ...prodForm, images: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المخزون المتوفر</label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شارة مميزة (Badge)</label>
                  <input
                    type="text"
                    placeholder="مثال: الأكثر مبيعاً 🔥"
                    value={prodForm.badge}
                    onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 transition"
              >
                حفظ المنتج
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EXCHANGE FORM MODAL */}
      {showExchangeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowExchangeModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-slate-900">
              {editingExchangeId ? 'تعديل حساب الصرافة' : 'إضافة شبكة صرافة جديدة'}
            </h3>

            <form onSubmit={handleSaveExchange} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم شركة الصرافة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شركة النجم للصرافة"
                  value={exchangeForm.name}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المستفيد الكامل</label>
                <input
                  type="text"
                  required
                  placeholder="اسم مستلم الحوالة"
                  value={exchangeForm.accountName}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, accountName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الحساب / رقم الهاتف</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 771234567"
                  value={exchangeForm.accountNumber}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, accountNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">إرشادات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات تظهر للعميل عند اختيار هذه الصرافة..."
                  value={exchangeForm.instructions}
                  onChange={(e) => setExchangeForm({ ...exchangeForm, instructions: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-rose-500 text-white font-extrabold rounded-xl hover:bg-rose-600 transition"
              >
                حفظ الحساب
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

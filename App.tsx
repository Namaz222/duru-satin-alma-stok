
import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Wallet, 
  Package,
  ClipboardList,
  Boxes,
  Layers,
  TrendingUp
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Orders from './pages/Orders';
import Accounting from './pages/Accounting';
import Requests from './pages/Requests';
import Stock from './pages/Stock';
import ProductCards from './pages/ProductCards';
import Analytics from './pages/Analytics';

interface NavLinkProps {
  to: string;
  icon: any;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-4 rounded-xl transition-all ${
        isActive ? 'bg-green-600 text-white shadow-lg scale-102' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon size={22} />
      <span className="font-bold text-lg tracking-tight uppercase">{children}</span>
    </Link>
  );
};

const Sidebar = () => (
  <div className="w-64 bg-white border-r h-screen fixed left-0 top-0 p-6 z-10 shadow-md flex flex-col">
    <div className="flex flex-col mb-8 px-1">
      <div className="flex items-center space-x-2 mb-1">
        <div className="bg-green-700 p-2 rounded-xl text-white shadow-md">
          <Package size={28} />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
          DURU
        </h1>
      </div>
      <span className="text-green-600 text-sm font-black uppercase tracking-[0.2em] ml-1">Organizasyon</span>
    </div>
    
    <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
      <NavLink to="/" icon={LayoutDashboard}>Panel</NavLink>
      <NavLink to="/product-cards" icon={Layers}>Ürün Kartları</NavLink>
      <NavLink to="/requests" icon={ClipboardList}>Talep Ekranı</NavLink>
      <NavLink to="/suppliers" icon={Users}>Tedarikçi</NavLink>
      <NavLink to="/orders" icon={Truck}>Sipariş</NavLink>
      <NavLink to="/accounting" icon={Wallet}>Muhasebe</NavLink>
      <NavLink to="/stock" icon={Boxes}>Stok Ekranı</NavLink>
      <NavLink to="/analytics" icon={TrendingUp}>Analiz</NavLink>
    </nav>
    
    <div className="mt-auto pt-4">
      <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
        <p className="text-[10px] font-black text-green-600 uppercase mb-1 tracking-widest">Sistem</p>
        <p className="text-sm font-bold text-green-900">v3.6.0 Aktif</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex bg-gray-50 font-['Inter'] min-h-screen text-[14px]">
        <Sidebar />
        <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
          <header className="bg-white/90 backdrop-blur-md border-b px-8 py-4 sticky top-0 z-20 flex justify-between items-center shadow-sm shrink-0">
            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">Yönetim Sistemi</h2>
            <div className="flex items-center space-x-4">
              <span className="text-[11px] font-black text-green-700 bg-green-50 px-4 py-2 rounded-xl border border-green-200 uppercase tracking-widest">
                Güvenli Veritabanı
              </span>
            </div>
          </header>
          <div className="p-8 overflow-y-auto flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product-cards" element={<ProductCards />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/accounting" element={<Accounting />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;

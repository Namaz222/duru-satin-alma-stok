import React, { useEffect, useState } from 'react';
import { DB } from '../db';
import { Order, OrderStatus } from '../types';
import { 
  Clock, 
  CheckCircle2, 
  Banknote,
  Users,
  ShoppingBag,
  TrendingUp,
  Loader2,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-[30px] shadow-lg border border-gray-100 flex items-start justify-between relative overflow-hidden group">
    <div className="relative z-10">
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
    </div>
    <div className={`p-4 rounded-2xl ${color} shadow-md relative z-10 group-hover:scale-105 transition-transform`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [supplierCount, setSupplierCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, suppliersData] = await Promise.all([
        DB.getOrders(),
        DB.getSuppliers()
      ]);
      setOrders(ordersData);
      setSupplierCount(suppliersData.length);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-green-600" size={48} />
        <p className="font-black text-gray-400 uppercase tracking-widest">Veriler Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto space-y-6">
        <div className="bg-red-50 p-8 rounded-[40px] border-2 border-red-100 flex flex-col items-center space-y-4 shadow-xl">
          <AlertCircle className="text-red-500" size={64} />
          <h2 className="text-2xl font-black text-gray-900 uppercase">Hata Oluştu</h2>
          <div className="bg-white/80 p-5 rounded-2xl w-full border border-red-100 text-left">
            <p className="text-red-600 font-mono text-xs break-words whitespace-pre-wrap">{error}</p>
          </div>
          <button onClick={loadDashboard} className="flex items-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-2xl font-black uppercase hover:bg-red-700 transition-all">
            <RefreshCcw size={20} />
            <span>Yenile</span>
          </button>
        </div>
      </div>
    );
  }

  // DÜZELTME: totalAmount -> total_amount (Supabase uyumu)
  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeOrders = orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_TRANSIT).length;
  const completedOrders = orders.filter(o => o.status === OrderStatus.COMPLETED).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none">Yönetim Paneli</h1>
          <p className="text-gray-500 text-sm font-medium italic mt-1">Sistem Genel Durumu</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Toplam Harcama" value={`${totalSpent.toLocaleString('tr-TR')} ₺`} icon={Banknote} color="bg-blue-600" />
        <StatCard title="Aktif Siparişler" value={activeOrders} icon={Clock} color="bg-orange-500" />
        <StatCard title="Tedarikçi Sayısı" value={supplierCount} icon={Users} color="bg-green-600" />
        <StatCard title="Tamamlanan" value={completedOrders} icon={CheckCircle2} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[30px] shadow-lg border border-gray-50 overflow-hidden flex flex-col">
          <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center space-x-2">
            <ShoppingBag className="text-blue-600" size={20} />
            <span>Son Siparişler</span>
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white uppercase shadow-sm">
                      {/* DÜZELTME: supplierName -> supplier_name */}
                      {order.supplier_name ? order.supplier_name.charAt(0) : '?'}
                    </div>
                    <div>
                      {/* DÜZELTME: supplierName -> supplier_name */}
                      <p className="text-md font-black text-gray-900 uppercase tracking-tight">{order.supplier_name}</p>
                      {/* DÜZELTME: orderDate -> order_date */}
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{order.order_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* DÜZELTME: totalAmount -> total_amount */}
                    <p className="text-lg font-black text-gray-900">{order.total_amount?.toLocaleString('tr-TR')} ₺</p>
                    <span className="text-[9px] font-black uppercase text-blue-500">{order.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest border-2 border-dashed rounded-3xl">
                Henüz sipariş kaydı bulunmuyor
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[30px] shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <TrendingUp className="absolute -right-8 -bottom-8 text-white/10" size={200} />
          <div className="relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 italic">Sistem Durumu</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-90">
              Verileriniz bulut altyapısı ile anlık olarak senkronize edilmektedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
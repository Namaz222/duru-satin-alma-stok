import React, { useState, useEffect, useMemo } from 'react';
import { DB } from '../db';
import { Order } from '../types';
import { TrendingUp, Banknote, Package, Search, Calendar, User, Coins } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  
  const load = async () => {
    const data = await DB.getOrders();
    setOrders(data);
  };

  useEffect(() => { load(); }, []);

  const allProducts = useMemo(() => {
    const names = orders.flatMap(o => o.items.map(i => i.product_name.trim()));
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'tr'));
  }, [orders]);

  const history = useMemo(() => {
    if (!selectedProduct) return [];
    return orders.flatMap(o => 
      o.items
        .filter(item => item.product_name.trim() === selectedProduct.trim())
        .map(item => ({
          date: o.order_date,
          price: item.unit_price,
          supplier: o.supplier_name,
          timestamp: new Date(o.order_date).getTime()
        }))
    ).sort((a, b) => a.timestamp - b.timestamp);
  }, [selectedProduct, orders]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-gray-900 uppercase">Analiz & Raporlar</h1>
      <select 
        className="w-full p-4 border-2 rounded-xl font-bold bg-gray-50"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">Ürün seçiniz...</option>
        {allProducts.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <div className="bg-white p-8 rounded-[30px] shadow-lg border h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
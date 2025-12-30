import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Order, OrderStatus, Supplier, OrderItem, UnitType, ProductCard } from '../types';
import { Plus, Trash2, X } from 'lucide-react';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [product_cards, set_product_cards] = useState<ProductCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<Partial<OrderItem>[]>([{ id: Math.random().toString(), product_name: '', quantity: 0, unit_price: 0 }]);

  const loadData = async () => {
    const [o, s, p] = await Promise.all([DB.getOrders(), DB.getSuppliers(), DB.get_product_cards()]);
    setOrders(o); setSuppliers(s); set_product_cards(p);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    const order = {
      id: crypto.randomUUID(),
      supplier_id: selectedSupplierId,
      supplier_name: supplier?.name,
      order_date: orderDate,
      status: OrderStatus.PENDING,
      total_amount: items.reduce((sum, i) => sum + (i.quantity! * i.unit_price!), 0),
      items: items
    };
    await DB.saveOrder(order);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-black uppercase">Sipariş Takibi</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-6 py-2 rounded-xl">Yeni Sipariş</button>
      </div>
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">TEDARİKÇİ</th>
              <th className="p-4 text-center">TARİH</th>
              <th className="p-4 text-right">TUTAR</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="p-4 font-bold">{order.supplier_name}</td>
                <td className="p-4 text-center">{order.order_date}</td>
                <td className="p-4 text-right font-black text-green-700">{order.total_amount?.toLocaleString()} ₺</td>
                <td className="p-4 text-right"><button onClick={() => DB.deleteOrder(order.id).then(loadData)}><Trash2 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
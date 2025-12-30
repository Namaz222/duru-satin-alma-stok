import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { ProductRequest, RequestStatus, UnitType, ProductCard } from '../types';
import { Plus, X, Clock, CheckCircle } from 'lucide-react';

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [product_cards, set_product_cards] = useState<ProductCard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newReq, setNewReq] = useState<Partial<ProductRequest>>({
    product_name: '',
    quantity: 0,
    unit: UnitType.ADET,
    status: RequestStatus.PENDING,
    request_date: new Date().toISOString().split('T')[0]
  });

  const loadData = async () => {
    const r = await DB.getRequests();
    const p = await DB.get_product_cards();
    setRequests(r);
    set_product_cards(p);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!newReq.product_name || !newReq.quantity) return alert("Eksik bilgi!");
    
    const request = {
      ...newReq,
      id: crypto.randomUUID(),
    } as ProductRequest;

    await DB.saveRequest(request);
    loadData();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-xl font-black uppercase">Mutfak Talepleri</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-6 py-2 rounded-xl">Yeni Talep</button>
      </div>
      <div className="bg-white rounded-[25px] shadow-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase">ÜRÜN</th>
              <th className="p-4 text-center text-[10px] font-black uppercase">MİKTAR</th>
              <th className="p-4 text-center text-[10px] font-black uppercase">TARİH</th>
              <th className="p-4 text-center text-[10px] font-black uppercase">DURUM</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((req) => (
              <tr key={req.id}>
                <td className="p-4 font-black uppercase">{req.product_name}</td>
                <td className="p-4 text-center font-black text-green-700">{req.quantity} {req.unit}</td>
                <td className="p-4 text-center font-bold text-gray-500">{req.request_date}</td>
                <td className="p-4 text-center uppercase text-[10px] font-black">{req.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Requests;
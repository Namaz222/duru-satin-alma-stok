import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Invoice, Supplier } from '../types';
import { Plus, CheckCircle2, Circle, X, Loader2 } from 'lucide-react';

const Accounting: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    invoice_date: new Date().toISOString().split('T')[0],
    is_paid: false,
    invoice_number: '',
    total_amount: 0,
    supplier_id: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [invs, sups] = await Promise.all([DB.getInvoices(), DB.getSuppliers()]);
      setInvoices(invs);
      setSuppliers(sups);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    const supplier = suppliers.find(s => s.id === newInvoice.supplier_id);
    if (!supplier || !newInvoice.invoice_number || !newInvoice.total_amount) return alert("Eksik bilgi!");

    const invoice: Invoice = { 
      id: crypto.randomUUID(),
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      invoice_number: newInvoice.invoice_number.toUpperCase(),
      invoice_date: newInvoice.invoice_date!,
      total_amount: newInvoice.total_amount,
      is_paid: newInvoice.is_paid || false
    };

    await DB.saveInvoice(invoice);
    loadData();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-xl font-black uppercase">Muhasebe</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-6 py-2 rounded-xl">Fatura Ekle</button>
      </div>
      <div className="bg-white rounded-[25px] shadow-lg border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-[10px] font-black uppercase">DURUM</th>
              <th className="p-4 text-[10px] font-black uppercase">FATURA NO</th>
              <th className="p-4 text-[10px] font-black uppercase">TEDARİKÇİ</th>
              <th className="p-4 text-right text-[10px] font-black uppercase">TUTAR</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="p-4 text-center">
                   {inv.is_paid ? <CheckCircle2 className="text-green-600"/> : <Circle className="text-gray-300"/>}
                </td>
                <td className="p-4 font-black">{inv.invoice_number}</td>
                <td className="p-4 font-bold">{inv.supplier_name}</td>
                <td className="p-4 text-right font-black">{inv.total_amount.toLocaleString()} ₺</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounting;
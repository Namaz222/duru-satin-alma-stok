import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { Supplier, Category, ContactMethod } from '../types';
import { Plus, Search, Trash2, X, Loader2, Save, Users, Building2, Phone, Mail } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({ 
    name: '',
    address: '',
    phone: '',
    email: '',
    categories: [], 
    contact_person: '', // DÜZELTİLDİ: contactPerson -> contact_person
    preferred_method: ContactMethod.PHONE // DÜZELTİLDİ: preferredMethod -> preferred_method
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await DB.getSuppliers();
      setSuppliers(data);
    } catch (err: any) {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name) return alert("Firma adı gerekli!");

    try {
      setSaving(true);
      const supplierToSave: Supplier = { 
        id: crypto.randomUUID(), 
        name: newSupplier.name.trim().toUpperCase(),
        address: newSupplier.address || '',
        phone: newSupplier.phone || '',
        email: newSupplier.email || '',
        categories: (newSupplier.categories as Category[]) || [],
        contact_person: newSupplier.contact_person || '', // DÜZELTİLDİ
        preferred_method: (newSupplier.preferred_method as ContactMethod) || ContactMethod.PHONE // DÜZELTİLDİ
      };
      
      await DB.saveSupplier(supplierToSave);
      setIsModalOpen(false);
      setNewSupplier({ name: '', address: '', phone: '', email: '', categories: [], contact_person: '', preferred_method: ContactMethod.PHONE });
      await loadData();
    } catch (err: any) {
      alert("KAYDETME HATASI:\n" + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (cat: Category) => {
    const current = newSupplier.categories || [];
    setNewSupplier({ 
      ...newSupplier, 
      categories: current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat] 
    });
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) // DÜZELTİLDİ
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-xl font-black uppercase">Tedarikçi Yönetimi</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2">
          <Plus size={20} strokeWidth={4} />
          <span className="font-black uppercase">Yeni Tedarikçi</span>
        </button>
      </div>

      <div className="bg-white rounded-[25px] shadow-lg border overflow-hidden">
        <div className="p-4 bg-gray-50/50 border-b">
          <input 
            type="text" 
            placeholder="Firma veya ilgili kişi ara..." 
            className="w-full p-3 border-2 rounded-2xl font-bold" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <table className="w-full text-left">
          <thead className="bg-white border-b">
            <tr>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase">FİRMA BİLGİSİ</th>
              <th className="p-4 text-[10px] font-black text-gray-400 uppercase">İLGİLİ KİŞİ</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td className="p-4 font-black uppercase">{s.name}</td>
                <td className="p-4 font-bold text-gray-600 uppercase text-xs">{s.contact_person || '-'}</td>
                <td className="p-4 text-right">
                  <button onClick={async () => { if(confirm('Sil?')) { await DB.deleteSupplier(s.id); loadData(); } }} className="text-red-600 p-2"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSave} className="bg-white rounded-[40px] w-full max-w-xl p-8">
             <h3 className="text-xl font-black mb-6 uppercase">Tedarikçi Kaydı</h3>
             <input 
                className="w-full p-4 border rounded-xl mb-4 font-bold" 
                placeholder="FİRMA ADI" 
                value={newSupplier.name} 
                onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} 
             />
             <input 
                className="w-full p-4 border rounded-xl mb-4 font-bold" 
                placeholder="İLGİLİ KİŞİ" 
                value={newSupplier.contact_person} 
                onChange={e => setNewSupplier({...newSupplier, contact_person: e.target.value})} 
             />
             <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl font-black">KAYDET</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Suppliers;